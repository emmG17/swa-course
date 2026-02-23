# Redis (Paper-Server Edition)
## Lesson 4: Architectural Tactics
### The complete HOW reference

*Your personal architecture cache. No expiration policy.*

---

## How to use this handout

This document is a **reference**, not a linear read. Use it while working on AdBid and on real projects.

Lesson 3 taught you the WHAT and the WHY. This handout teaches you the HOW — specific tactics for achieving each quality attribute.

**Structure of each tactic:**
- What is it?
- When to use
- When NOT to use
- Tradeoffs
- Concrete example

---

## Remember: The Lesson 3 → Lesson 4 Transition

| Lesson 3 (Strategy) | Lesson 4 (Tactics) |
|-------------------|------------------|
| WHAT quality attributes matter | HOW to achieve performance |
| WHY we make tradeoffs | HOW to achieve scalability |
| Context analysis | Specific techniques |
| Tradeoff matrix | ADRs and decisions |

Strategy without tactics = good intentions without execution.
Tactics without strategy = doing things at random.

---

## Performance Tactics

*How do we make things faster?*

---

### Tactic 1: Caching

**What is it?**
Store the results of expensive work so you don't have to repeat it. Instead of doing the same work repeatedly, do it once and save the result.

**Cache layers (from outside in):**

```
Client
  ↓
Browser Cache (client stores resources locally)
  ↓
CDN (Cloudflare, Fastly — geographically close to the user)
  ↓
Application Cache (Redis, Memcached — in-memory, ultra fast)
  ↓
Database Query Cache (the DB caches query results)
  ↓
Your database
```

**When to use:**
- Data that doesn't change frequently (product catalog, configuration, reference data)
- Expensive to compute or fetch (complex calculations, slow third-party APIs)
- Same data requested repeatedly (homepage, popular products)

**When NOT to use:**
- Data that changes very frequently (real-time stock price)
- Critical data where freshness matters a lot (bank balance at this exact moment)
- When the cost of cache invalidation outweighs the benefit

**Tradeoffs:**
- ✅ Gain: drastically improved speed, less load on the database
- ❌ Sacrifice: possibly stale data, invalidation complexity

**Example:**
```javascript
// Without cache: 50ms per request, 1,000 requests/min = 50 seconds of DB load per minute
const products = await db.query('SELECT * FROM products WHERE category = ?', [category]);

// With cache: 50ms first time, 0.1ms after, same 1,000 requests = 0.1 seconds of DB load per minute
const cacheKey = `products:category:${category}`;
let products = await redis.get(cacheKey);
if (!products) {
  products = await db.query('SELECT * FROM products WHERE category = ?', [category]);
  await redis.setex(cacheKey, 3600, JSON.stringify(products)); // TTL: 1 hour
}
```

**Rule of thumb:** If the data has more than 1 minute of "useful life" and is requested more than 10 times per minute, it's probably worth caching.

---

### Tactic 2: Async Processing

**What is it?**
Don't make users wait for operations that don't need an immediate result. Accept the task, confirm to the user, process in the background.

**The pattern:**
```
User takes action
  → System accepts and saves the task (immediate, <100ms)
  → System returns "success" to user
  → Background job processes the task
  → System notifies when done (optional)
```

**When to use:**
- Operations that take more than 2 seconds
- Result not needed immediately
- User can continue using the app while waiting
- Confirmation emails, image processing, report generation, data exports

**When NOT to use:**
- User needs the result immediately to continue
- Operation is critical and can't fail silently
- Transactions where the user needs to know the outcome instantly (payments)

**Tradeoffs:**
- ✅ Gain: faster user experience, decouples expensive operations
- ❌ Sacrifice: eventual consistency, user doesn't know immediately if something failed

**My principle:**
When you need messaging between components, it's almost always some kind of queue — or sometimes as simple as a DB table with a status column (pending, processing, completed, failed). Start simple.

**Minimal implementation:**
```sql
-- The simplest possible queue: a PostgreSQL table
CREATE TABLE background_jobs (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  payload JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP
);
```

---

### Tactic 3: Database Optimization

**What is it?**
Make your database queries faster. Almost always the first and biggest performance win.

**The 4 main techniques:**

**1. Indexes**
```sql
-- Without index: PostgreSQL reads the ENTIRE table (table scan)
SELECT * FROM orders WHERE user_id = 123; -- slow with 1M rows

-- With index: PostgreSQL goes directly (index scan)
CREATE INDEX idx_orders_user_id ON orders(user_id);
SELECT * FROM orders WHERE user_id = 123; -- fast with 1M rows
```

Rule: index columns you use in WHERE, JOIN, ORDER BY. But don't index everything — indexes slow down writes.

**2. The N+1 problem**
```javascript
// ❌ BAD: N+1 queries — 1 query for orders + 1 query PER order
const orders = await db.query('SELECT * FROM orders LIMIT 100'); // 1 query
for (const order of orders) {
  const user = await db.query('SELECT * FROM users WHERE id = ?', [order.user_id]); // 100 more queries!
}
// Total: 101 queries

// ✅ GOOD: 2 queries total
const orders = await db.query('SELECT * FROM orders LIMIT 100');
const userIds = orders.map(o => o.user_id);
const users = await db.query('SELECT * FROM users WHERE id IN (?)', [userIds]);
// Total: 2 queries
```

**3. Connection Pooling**
Creating a new DB connection per request is expensive (~10ms). Connection pooling reuses connections.
```javascript
// Pool of 10 connections → handles 10 simultaneous requests without connection overhead
const pool = new Pool({ max: 10, connectionString: DATABASE_URL });
```

**4. EXPLAIN ANALYZE**
```sql
-- Run this to understand what the DB is doing with your query
EXPLAIN ANALYZE SELECT * FROM orders WHERE created_at > '2026-01-01' ORDER BY total DESC;
-- Shows: how it searches, how many rows it scans, how long it takes
```

**When NOT to:** You should almost always optimize queries. The only exception is when the cost of optimizing outweighs the benefit (queries that run once a day, for example).

---

### Tactic 4: Load Balancing

**What is it?**
Distribute incoming traffic across multiple server instances.

**Common algorithms:**
| Algorithm | How it works | When to use |
|-----------|-------------|-------------|
| Round Robin | 1, 2, 3, 1, 2, 3... | Similar-duration requests |
| Least Connections | Send to server with fewest active connections | Variable-duration requests |
| IP Hash | Same user → same server | When you need some session affinity (note: compromises stateless) |

**When to use:** When a single server can't handle all the traffic.

**When NOT to use:** If your problem is processing speed (not capacity), a faster single server may be simpler. Don't add a load balancer if you have no evidence you need more than one server.

**Tradeoffs:**
- ✅ Gain: distributed capacity, tolerance for individual instance failures
- ❌ Sacrifice: operational complexity, you must be stateless

---

### Tactic 5: Compression

**What is it?**
Compress responses before sending them to the client.

```
Without compression: 100KB JSON → 100KB over the wire
With gzip:           100KB JSON → ~20KB over the wire (80% reduction typical for JSON)
```

**When to use:** Large responses (data-heavy APIs), mobile clients, slow networks.

**When NOT to use:** Already-compressed data (images, video). Re-compressing is inefficient.

**Tradeoffs:**
- ✅ Gain: less bandwidth, faster transfer
- ❌ Sacrifice: CPU to compress/decompress (usually negligible)

---

## Scalability Tactics

*How do we handle more load? Performance = speed per request. Scalability = more simultaneous requests.*

---

### Tactic 1: Stateless Services FOUNDATIONAL

**What is it?**
Your server stores no user session data in its own memory. Session lives in external shared storage.

**Why it's foundational:**
```
App with server-side state:
Server 1 (knows about User A)    Server 2 (knows nothing about User A)
    ↑                                   ↑
User A → can only go to Server 1 → you can't scale horizontally
```

```
Stateless app:
Server 1    Server 2    Server 3
    ↑            ↑           ↑
User A can go to ANY of them → add servers freely
```

**How to implement:**

Option 1 — Redis for session:
```javascript
// Store session in Redis (shared across all servers)
app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET
}));
```

Option 2 — JWT (session in the token):
```javascript
// Token contains all session info
// Server validates the token, doesn't need to "remember" anything
const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET);
// Client stores the token. Server only validates it.
```

**When to use:** Always for web applications that need to scale.

**When NOT to use:** Single permanent server applications (rare, but they exist).

**Tradeoffs:**
- ✅ Gain: unlimited horizontal scaling
- ❌ Sacrifice: slight complexity, added latency to retrieve session from Redis

---

### Tactic 2: Horizontal Scaling

**What is it?**
Add more server instances instead of bigger instances.

| | Vertical Scaling | Horizontal Scaling |
|-|-----------------|-------------------|
| How | Bigger server | More servers |
| Ceiling | Yes (hardware has limits) | No (keep adding) |
| Cost | Exponential at the top | Linear |
| Complexity | Lower | Higher |
| Risk | Single point of failure | Redundant |

**Requirements:**
1. Stateless services ← most important
2. Load balancer to distribute traffic
3. Shared external storage (DB, Redis)

**When to use:** When vertical scaling is no longer cost-effective or you've hit the limit.

**When NOT to use:** Before you need it. Don't add multi-server complexity before you have evidence that one server isn't enough.

---

### Tactic 3: Read Replicas

**What is it?**
A copy of your database that accepts reads only. Write traffic goes to the primary. Read traffic is distributed across replicas.

```
Writes → Primary DB
              ↓ (replication, lag ~1-5 seconds)
Reads  → Replica 1 | Replica 2 | Replica 3
```

**Why it works:**
Most applications are 90% reads. One replica ≈ double read capacity. Three replicas ≈ 4x total read capacity.

**When to use:** Read-heavy applications. Often the easiest, most overlooked scaling win.

**When NOT to use:** When you need to read data immediately after writing it (replication lag is a problem). e.g., showing a bank balance immediately after a transaction.

**Tradeoffs:**
- ✅ Gain: multiplied read capacity, reduced load on primary
- ❌ Sacrifice: eventual consistency (replicas can be 1-5 seconds behind), cost of additional instances

---

### Tactic 4: Queue-Based Processing

**What is it?**
Decouple who produces work from who processes it using an intermediate message queue.

```
Without queue:
User → Web Server → processes everything immediately → responds

With queue:
User → Web Server → puts in queue → responds "accepted" ✓
                            ↓
                   Workers consume from queue
                   Workers process at their own pace
```

**Benefits:**
- **Absorbs spikes:** if 10,000 requests arrive in 1 second, the queue holds them, workers process at their own pace
- **Independent scaling:** you can have 3 web servers and 10 workers, or the reverse
- **Automatic retry:** if a job fails, the queue can retry it

**Tools:**
- **RabbitMQ** — flexible, feature-rich, self-hosted
- **AWS SQS** — managed, simple, reliable, good price
- **BullMQ** (Node.js) — built on Redis, great DX, for moderate scale

**When to use:** Background processing, high-volume events, anything that can tolerate delay.

**When NOT to use:** When the user needs the result immediately.

**Tradeoffs:**
- ✅ Gain: spike absorption, scalability, resilience
- ❌ Sacrifice: eventual consistency, operational complexity, one more system to manage

---

### Tactic 5: Caching for Scale

**What is it?**
Each cache layer prevents requests from hitting the bottleneck below it.

```
Without cache: 10,000 requests → all hit the DB
With layered cache:
  - CDN answers 7,000 (static assets, cached pages)
  - Redis answers 2,500 (frequent app data)
  - DB receives only 500 (unique data, writes, uncached data)
```

For scalability, think of cache as a **shield**, not just a speed optimization.

---

### Tactic 6: Polyglot Persistence

**What is it?**
Using different databases for different types of data, each optimized for its use case.

**The most common pattern:**

```
Central ACID DB (PostgreSQL):
  → Critical transactional data
  → Orders, payments, user accounts
  → You need ACID: Atomicity, Consistency, Isolation, Durability
  → You cannot lose this

Specialized DB (Cassandra, DynamoDB, InfluxDB, etc.):
  → High-volume, less-critical data
  → Analytics logs, tracking events, time-series data
  → Eventual consistency is fine
  → Volume that would overwhelm your relational DB
```

**Real examples:**
| Company | Critical DB | Specialized DB | For what |
|---------|------------|----------------|----------|
| Uber | PostgreSQL | Cassandra | GPS tracking |
| Instagram | PostgreSQL | Cassandra | Activity feeds |
| Netflix | MySQL/CockroachDB | Cassandra | Viewing history |

**The flock analogy:**
Two small, manageable flocks (one fancy, one regular) instead of one giant herd of 100 sheep. Each has its own shepherd, its own space, its own rhythm.

**When to use:**
- You have data with radically different access patterns
- High volume of data where eventual consistency is fine
- You already have evidence that one DB isn't enough

**When NOT to use:**
- Your app is small or mid-size (adds real operational complexity)
- The team has no experience with the specialized DB
- "Because Netflix does it" (they also have 100+ person infrastructure teams)

**Tradeoffs:**
- ✅ Gain: each DB optimized for its case, independent scaling
- ❌ Sacrifice: two systems to operate, monitor, and back up; cross-DB joins are complex

---

### Tactic 7: Database Sharding THE NUCLEAR OPTION

**What is it?**
Split a single database into multiple databases (shards) where each shard contains a subset of the data.

```
Without sharding:
Single DB → all data for all users

With sharding (by user_id):
Shard 1 → users 1 to 1,000,000
Shard 2 → users 1,000,001 to 2,000,000
Shard 3 → users 2,000,001 to 3,000,000
```

### ⚠️ THE SHEEP HERDING PRINCIPLE ⚠️

**1 sheep:** Simple. Click, move, done.

**100 sheep with no experience and no sheepdog:** Chaos. They scatter, you can't control them, you lose them.

**1 database:** Simple. Query, result, done.

**10 sharded databases:** Every query becomes:
- Which shard has this data?
- Need data from multiple shards? (cross-shard query — very slow)
- How do I keep shards balanced? (rebalancing — nightmare)
- Joins across shards? (very, very painful)
- User moved between shards? (migration — complex)

**You're herding 100 sheep with no sheepdog.**

### The Principle

**Keep your flock small until wool demand is too high.**

= Use ONE database until you absolutely cannot handle the load anymore.

**"Cannot handle the load" means you've already tried:**
1. ✓ Caching at all layers
2. ✓ Read replicas (3-4 replicas)
3. ✓ Vertical scaling (bigger server)
4. ✓ Optimizing all slow queries
5. ✓ Connection pooling
6. You're at 90%+ capacity and growth continues

**THEN, maybe, consider sharding.**

**Reality check:**
- Well-optimized PostgreSQL handles **billions of rows** on a single instance
- Instagram used a single database for **years** before needing to shard
- Most companies never need to shard
- If you eventually do need it: hire someone with experience, or use a DB with auto-sharding (CockroachDB, PlanetScale)

**When to use:** When you've literally exhausted every other option.

**When NOT to use:** Practically always.

---

## Availability Tactics

*How do we stay running when things fail? (And they will.)*

---

### Tactic 1: Redundancy

**What is it?**
Eliminate single points of failure by having multiple instances of critical components.

**Modes:**

| | Active-Active | Active-Passive |
|-|---------------|----------------|
| How it works | Both instances handle traffic simultaneously | One active, one on standby |
| If primary fails | Traffic continues on secondary | Secondary takes over (failover) |
| Complexity | Higher (both must handle load) | Lower |
| Resource usage | More efficient | Standby resources "wasted" |

**When to use:** Systems that cannot have downtime — production databases, payment services, authentication, network infrastructure.

**When NOT to use:** In development. In systems where some downtime is acceptable and redundancy complexity isn't worth it.

**Tradeoffs:**
- ✅ Gain: eliminates single points of failure, improved uptime
- ❌ Sacrifice: cost (minimum 2x), operational complexity

---

### Tactic 2: Health Checks

**What is it?**
A dedicated endpoint that reports whether your service is working correctly. The orchestration system uses it to decide whether to send traffic.

```javascript
// Simple endpoint
app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1'); // verify DB responds
    res.json({ status: 'healthy', timestamp: new Date() });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', error: error.message });
  }
});
```

```javascript
// Detailed health check
app.get('/health/detailed', async (req, res) => {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    externalApi: await checkExternalApi(),
  };
  const allHealthy = Object.values(checks).every(c => c.healthy);
  res.status(allHealthy ? 200 : 503).json({ status: allHealthy ? 'healthy' : 'degraded', checks });
});
```

**When to use:** Always. On every production service. Basically free to implement and catches 80% of problems before users notice.

**Tradeoffs:**
- ✅ Gain: automatic failure detection, automatic restart, routing away from degraded instances
- ❌ Sacrifice: one more endpoint to maintain (minimal)

---

### Tactic 3: Graceful Degradation

**What is it?**
When a component fails, the system continues working with reduced functionality instead of failing completely.

**Practical examples:**

```javascript
// Instead of failing when recommendation service is down:
async function getProductRecommendations(userId) {
  try {
    return await recommendationService.getFor(userId); // try the service
  } catch (error) {
    logger.warn('Recommendation service unavailable, using fallback');
    return await getPopularProducts(); // fallback: generic popular products
  }
}

// Instead of showing an error when payment service is slow:
async function processOrder(order) {
  await saveOrderToQueue(order); // save to process later
  return { status: 'queued', message: 'Your order was received. We will confirm by email.' };
}
```

**When to use:** Whenever your system depends on external or internal services that can fail.

**When NOT to use:** When the secondary functionality is so critical that there's no point continuing without it. If the payment processor fails during checkout, there's no way to degrade gracefully — the transaction must fail.

**Tradeoffs:**
- ✅ Gain: user experiences reduced functionality instead of a total error
- ❌ Sacrifice: complexity of implementing multiple paths, users may not notice degradation

---

### Tactic 4: Circuit Breakers

**What is it?**
A mechanism that automatically stops calling services that are failing, preventing error cascades.

**The three states:**

```
CLOSED state (normal):
    Your service → calls pass through → External service ✓

OPEN state (failure detected):
    Your service → BLOCKED immediately → Never reaches external service
                ↓
    Returns fast error or cached data

HALF-OPEN state (testing recovery, after timeout):
    Your service → ONE test call → External service
    If it works → CLOSED state
    If it fails → OPEN state (reset timer)
```

**Why it matters:**
Without circuit breaker: external service is slow → your threads pile up waiting → your thread pool exhausts → YOUR service falls too.

With circuit breaker: external service is slow → circuit opens → your threads fast-fail → your service stays responsive.

**Tools:**
- Node.js: `opossum` library
- Java: Resilience4j
- .NET: Polly
- Or implement a simple one yourself

**When to use:** When calling external services (third-party APIs) or your own internal microservices.

**When NOT to use:** Simple internal function calls, database operations where you want errors to propagate normally.

---

### Tactic 5: Database Replication (for availability)

**What is it?**
Keep a "warm" copy of the database ready to take over if the primary fails.

(Note: also used for scalability — see Read Replicas. Here the focus is failover, not load distribution.)

**Modes:**

| | Synchronous | Asynchronous |
|-|-------------|-------------|
| Write confirms when | Primary AND replica confirm | Only primary confirms |
| Data loss if primary fails | Zero | Possibly last 1-5 seconds |
| Write speed | Slower | Faster |
| For what | Critical financial data | Most apps |

**When to use:** In any production system where losing data would be unacceptable.

**When NOT to use:** Development or staging where downtime is acceptable.

---

### Tactic 6: Monitoring & Alerting

**What is it?**
Systems that measure your application's behavior and notify you when something goes wrong.

**What to monitor:**

```
Technical Metrics:
  - Error rate (% of requests returning 5xx)
  - Response times (p50, p95, p99)
  - Resource usage (CPU, memory, disk)
  - Queue depth
  - Active DB connections

Business Metrics (underrated!):
  - Orders per hour
  - User signups per day
  - Revenue per hour
  - Searches per minute
```

Business metrics are crucial: a sudden drop in orders/hour is often the first signal of a technical problem, before technical metrics show it clearly.

**Accessible tools:**
- **Sentry** — errors and exceptions (has a free tier)
- **Datadog** — metrics and infrastructure (paid, powerful)
- **Grafana + Prometheus** — open source, requires setup
- **Uptime Robot** — simple, monitors that endpoints respond

**When to use:** Always in production. Non-negotiable.

---

## Security Tactics — Overview

*Full deep dive in Lesson 8. This is the introduction.*

| Tactic | What it does | When |
|--------|-------------|------|
| **Authentication** | Verifies who you are | Always for access to user data |
| **Authorization** | Verifies what you can do | Always for privileged operations |
| **Encryption in transit** | HTTPS protects data in network | Always in production |
| **Encryption at rest** | Encrypted DB | Sensitive data (PII, health, finance) |
| **Input validation** | Never trust external data | Always, server-side |
| **Rate limiting** | Prevents abuse and brute force | Public APIs, auth endpoints |
| **Secrets management** | Environment variables, vault | Never in code or git |

**Golden rule:** If you don't know whether you need a security tactic, you do.

---

## Maintainability Tactics

*Can the team understand and modify this code in 6 months?*

---

### Tactic 1: Modularity

**What is it?**
Organize code into modules with clear, well-defined responsibilities.

**The most common pattern — Layered Architecture:**

```
┌─────────────────────────────┐
│         Controllers          │  ← HTTP, input validation, responses
│  (what the world sees)       │
└─────────────┬───────────────┘
              │
┌─────────────▼───────────────┐
│          Services            │  ← Business logic, orchestration
│  (the brain)                 │
└─────────────┬───────────────┘
              │
┌─────────────▼───────────────┐
│        Repositories          │  ← Data access, DB queries
│  (the memory)                │
└─────────────────────────────┘
```

```
📁 src/
   📁 controllers/     ← handles HTTP
      userController.js
      orderController.js
   📁 services/        ← business logic
      userService.js
      orderService.js
   📁 repositories/    ← data access
      userRepository.js
      orderRepository.js
   📁 models/          ← data structures
   📁 middleware/       ← auth, logging, error handling
```

**When to use:** From day one. On any project with more than one person or more than 3 months of life.

---

### Tactic 2: Low Coupling, High Cohesion

**What is it?**

**Low Coupling:** Modules depend minimally on each other.

```javascript
// ❌ HIGH COUPLING: UserService knows too much about OrderRepository
class UserService {
  async deleteUser(userId) {
    await this.db.query('DELETE FROM orders WHERE user_id = ?', [userId]); // ← directly accesses order DB!
    await this.db.query('DELETE FROM users WHERE id = ?', [userId]);
  }
}

// ✅ LOW COUPLING: UserService coordinates, each repository handles its own concern
class UserService {
  async deleteUser(userId) {
    await this.orderRepository.deleteByUserId(userId); // ← delegates to whoever owns it
    await this.userRepository.delete(userId);
  }
}
```

**High Cohesion:** Related things live together.

```
❌ Bad: Your auth logic scattered across:
   - authController.js (some here)
   - userService.js (some here)
   - middleware/validate.js (some here)
   - utils/token.js (some here)

✅ Good: All auth logic in:
   - auth/authService.js (complete logic)
   - auth/authMiddleware.js (middleware)
   - auth/tokenUtils.js (token utilities)
```

**Coupling test:** If you change one file, how many others do you have to change? If the answer is more than 2-3, coupling is too high.

---

### Tactic 3: Clear Abstractions

**What is it?**
Hide complexity behind simple interfaces. Code that uses the abstraction doesn't know or care how it's implemented.

```typescript
// Define the interface (the contract)
interface StorageService {
  uploadFile(file: Buffer, path: string): Promise<string>;
  deleteFile(path: string): Promise<void>;
  getFileUrl(path: string): string;
}

// Development implementation
class LocalStorageService implements StorageService {
  async uploadFile(file: Buffer, path: string): Promise<string> {
    await fs.writeFile(`./uploads/${path}`, file);
    return `/uploads/${path}`;
  }
  // ...
}

// Production implementation
class S3StorageService implements StorageService {
  async uploadFile(file: Buffer, path: string): Promise<string> {
    await this.s3.upload({ Bucket: 'my-bucket', Key: path, Body: file }).promise();
    return `https://my-bucket.s3.amazonaws.com/${path}`;
  }
  // ...
}

// Code using storage doesn't change when you change the implementation
class UserService {
  constructor(private storage: StorageService) {} // ← injected, not hardcoded
  
  async updateAvatar(userId: string, image: Buffer) {
    const url = await this.storage.uploadFile(image, `avatars/${userId}.jpg`);
    await this.userRepository.updateAvatar(userId, url);
  }
}
```

**When to use:** When you might swap implementations (vendor change), when you want easy tests (mock the interface), when multiple modules use the same thing.

---

### Tactic 4: Automated Testing

**What is it?**
Tests that run automatically to verify code works as expected.

**The three types and when to use each:**

| Type | What it tests | Speed | When to prioritize |
|------|--------------|-------|--------------------|
| Unit | Individual function in isolation | Very fast | Complex business logic, algorithms |
| Integration | Components working together | Medium | Data flows, service interactions |
| E2E (End-to-End) | Complete user flow | Slow | Critical paths (checkout, login, signup) |

**You don't need 100% coverage.** You need confidence to change code.

Prioritize tests for:
- Critical business logic (price calculation, authorization, validations)
- Things that have broken before
- Complex algorithms

Don't spend much energy testing:
- Simple configuration (if DB config works, you know in 5 seconds)
- Code that changes constantly (tests you break every change aren't helping)

```javascript
// Example of a well-written unit test
describe('OrderService.calculateTotal', () => {
  it('should apply 10% discount for orders over $100', () => {
    const order = { items: [{ price: 60 }, { price: 50 }] }; // total = $110
    const result = orderService.calculateTotal(order);
    expect(result.discount).toBe(11); // 10% of $110
    expect(result.total).toBe(99);    // $110 - $11
  });
  
  it('should not apply discount for orders under $100', () => {
    const order = { items: [{ price: 40 }, { price: 30 }] }; // total = $70
    const result = orderService.calculateTotal(order);
    expect(result.discount).toBe(0);
    expect(result.total).toBe(70);
  });
});
```

---

### Tactic 5: Documentation

**What is it?**
Explaining the WHY behind decisions, not the WHAT of the code.

**What's worth documenting:**

```javascript
// ❌ Bad comment — explains the obvious:
// sum item prices
const total = items.reduce((sum, item) => sum + item.price, 0);

// ✅ Good comment — explains the non-obvious why:
// We use price.amount in cents (not decimal pesos) to avoid floating-point
// errors in financial calculations. The client had a $0.01 bug in production
// from using floats. See ADR-042 for details.
const totalCents = items.reduce((sum, item) => sum + item.price.amount, 0);
```

**The minimum documentation stack:**
- **README.md** — how to run, how to deploy, required environment variables
- **ADRs** — why we made the important architecture decisions
- **API documentation** (OpenAPI/Swagger) — how to call the endpoints
- **Code comments** — only for things that are truly non-obvious

---

### Tactic 6: Consistent Patterns

**What is it?**
Using the same approach to solve the same type of problem throughout the codebase.

**Example — Consistent error handling:**

```javascript
// ✅ All controllers follow the same pattern:
// Result: any dev understands any controller immediately
async function getUser(req, res) {
  try {
    const user = await userService.getById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ data: user });
  } catch (error) {
    logger.error('Error in getUser', { error, params: req.params });
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

**To maintain consistency in a team:**
- Linter (ESLint, Prettier) — auto-enforce style
- Code review — catches deviations from patterns
- Document patterns in the architecture README
- Templates for new files (controllers, services, etc.)

---

## ADRs — The Thinking Tool

### The real value

ADRs aren't for documenting past decisions. They're for **forcing rigorous thinking before deciding**.

When you have to write:
1. What problem am I actually solving?
2. What options did I consider?
3. Why this option for my specific context?
4. What are the consequences?

...you catch bad ideas early. You catch golden hammer thinking. You catch resume-driven development.

### When to write an ADR

**Write an ADR when:**
- The decision costs 1+ week to change if you're wrong
- The team is split between options
- You want to remember in 6 months why you chose this
- The decision affects multiple teams or components

**Don't write an ADR when:**
- The decision is obvious to everyone
- Trivial to change later
- You're exploring or prototyping
- Ceremony doesn't add value

### Template — One Page Maximum

```markdown
# ADR-[number]: [Descriptive decision title]

**Date:** YYYY-MM-DD  
**Status:** [Proposed | Accepted | Deprecated | Superseded by ADR-XXX]

## Context
[2-3 sentences: What problem do we have? What constraints exist?
Why do we need to make this decision now?]

## Options Considered
1. **[Option A]** — brief description
2. **[Option B]** — brief description  
3. **[Option C]** — brief description (if applicable)

## Decision
We chose **[Option X]**.

## Rationale
Why this option for OUR specific context:
- [Reason 1 — ties to your real constraints]
- [Reason 2 — ties to your real constraints]
- [Reason 3 if needed]

## Consequences
**We gain:**
- [Benefit 1]
- [Benefit 2]

**We sacrifice:**
- [Tradeoff 1]
- [Tradeoff 2]

**Next steps:** [optional — what concrete actions does this decision generate]
```

### Real Example — ADR for Notification Service Scenario A

```markdown
# ADR-001: Use PostgreSQL table as queue for email notifications

**Date:** 2026-02-22  
**Status:** Accepted

## Context
We need to notify subscribers when a writer publishes. Current volume: ~400
notifications/day. Team: 3 junior developers. Infrastructure budget: $500/month.
Timeline: working system in 2 months.

## Options Considered
1. **PostgreSQL table as queue** + cron job every 5 minutes
2. **RabbitMQ** + worker pool
3. **AWS SQS** + Lambda functions

## Decision
We chose **Option 1: PostgreSQL table + cron**.

## Rationale
- 400 notifications/day is trivially handled by a PostgreSQL table
- The 3-junior team already knows PostgreSQL; no need to learn RabbitMQ
- The $500/month budget doesn't justify $150+/month of additional messaging infrastructure
- Delivery within 5 minutes is explicitly acceptable per requirements
- Simple system, easy to understand and debug from day one

## Consequences
**We gain:** Simplicity, no new infrastructure, team can maintain it from day 1

**We sacrifice:** Not real-time (~5 min delay), doesn't scale easily beyond ~10,000/day

**Next steps:** If we exceed 5,000 notifications/day, revisit and add a real queue
```

---

## Quick Reference Tables

### Tactics by Quality Attribute

| Quality Attribute | Main Tactics | When to Start |
|------------------|-------------|---------------|
| **Performance** | Caching, Async, DB optimization | From MVP if you have 100+ users/day |
| **Scalability** | Stateless, Read replicas, Queues | When one server shows >70% load |
| **Availability** | Health checks, Monitoring, Graceful degradation | Always in production |
| **Security** | Auth/Authz, HTTPS, Input validation | From day one, no exceptions |
| **Maintainability** | Modularity, Testing, Consistent patterns | From day one |

### When NOT to use each tactic

| Tactic | Don't use when... |
|--------|------------------|
| Caching | Data changes frequently or freshness is critical |
| Microservices / Queues | Small team, startup, scale doesn't justify it |
| Sharding | You haven't exhausted all other options first |
| Polyglot persistence | Team has no experience with the second DB |
| Redundancy | Cost outweighs the value of additional uptime |

### Common Combinations

| Scenario | Recommended tactic combination |
|----------|---------------------------------|
| Startup web app | Stateless + Redis session + PostgreSQL + Health checks + Sentry |
| Growing mid-size app | All above + Read replicas + CDN + Background jobs |
| High-scale app | All above + Queues + Workers + Polyglot persistence + Full monitoring |
| Never in this course | Sharding (you need to be Instagram first) |

---

## Case Study: Notification Service

### Scenario A — 400 notifications/day

**Context:** 50 writers, 200 subscribers each, 3-junior-dev team, $500/month budget.

**Recommended architecture:**
```
PostgreSQL table: notification_queue
  (id, article_id, subscriber_email, status, created_at, processed_at)

Cron job → every 5 minutes → query status='pending' → SendGrid API → update to 'sent'
```

**Tactics used:** DB as queue, cron scheduling, email via SendGrid API

**Tactics explicitly NOT used:** RabbitMQ (overkill), worker pools (overkill), real-time websockets (unnecessary), Redis (nothing to cache at this scale)

**Why this design?** Because 3 junior devs can build it, maintain it, and debug it. It meets all requirements. Additional cost: $0.

---

### Scenario B — 1,000,000 notifications/day

**Context:** 5,000 writers, 10,000 subscribers each, 10-dev team + ops, $10K/month budget.

**Recommended architecture:**
```
Article published → event to Message Queue (RabbitMQ / AWS SQS)
                            ↓
                   Worker Pool (3-5 workers, auto-scaling)
                            ↓
                   SendGrid API with rate limiting
                            ↓ (in parallel)
                   Redis for retry deduplication
                            ↓
                   Monitoring: queue depth, failed jobs, delivery rates
```

**Tactics used:** Queue for decoupling, worker pool for horizontal scaling, rate limiting, Redis for deduplication, full monitoring

**Why this design?** Because at 1M notifications/day, a cron job would collapse. Viral spikes (article = 100K simultaneous notifications) need a buffer. The team has the capacity to operate this.

---

### The A → B Migration

```
Start (Scenario A):      cron + PostgreSQL table
         ↓ when: volume exceeds 5,000/day and cron takes too long
Step 1:                  add RabbitMQ, convert cron to publisher
         ↓ when: queue fills consistently during spikes
Step 2:                  add worker pool (2-3 workers)
         ↓ when: workers consistently fall behind
Step 3:                  add worker auto-scaling
         ↓ when: you have trouble debugging failures
Step 4:                  add full monitoring

Each step: triggered by PROVEN need, not hypothetical.
```

---

*Redis (Paper-Server Edition) | Lesson 4 | Software Architecture for Junior Developers*

*No expiration policy. Your personal architecture cache.*
