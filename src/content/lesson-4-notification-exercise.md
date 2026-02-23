# Exercise: Notification Service
## Lesson 4 — Architectural Tactics

**Goal:** Design the same solution for two radically different contexts. Demonstrate that the right tactics depend on context.

---

## The Problem

A blogging platform needs to notify subscribers by email when a writer publishes a new article.

**Same problem. Two very different contexts.**

## Scenario A — The Reality

### The company
- **Name:** BlogMX (fictional)
- **Size:** 50 registered writers
- **Subscribers:** ~200 per writer on average
- **Notification volume:** ~400 per day
- **Peak:** One popular writer with 1,000 subscribers publishes

### The team
- **Developers:** 3 junior developers
- **Messaging experience:** None (they know SQL, JavaScript, basic APIs)
- **Infrastructure budget:** $500 USD / month total (including server, DB, everything)
- **Timeline:** Basic notifications working in 2 months

### System requirements
- When a writer publishes, notify all their subscribers by email
- Email only for now (no push notifications)
- Delivery within 5 minutes is acceptable
- Reliable: notifications cannot be permanently lost
- Simple to build and maintain (the junior team must be able to debug it)

### Current stack
- Node.js + Express (API)
- PostgreSQL (database)
- Heroku (hosting, $25/month)
- SendGrid (email, free tier: 100 emails/day, $15/month for 40,000/month)

---

## Scenario B — The Dream

### The company
- **Name:** BlogMX (3 years later, same product)
- **Size:** 5,000 registered writers
- **Subscribers:** ~10,000 per writer on average
- **Notification volume:** ~1,000,000 per day
- **Peak:** Viral article, 100,000 simultaneous notifications

### The team
- **Developers:** 10 developers + dedicated operations team
- **Experience:** Mixed — some senior, some mid-level
- **Infrastructure budget:** $10,000 USD / month
- **Timeline:** 6 months to build it properly

### System requirements
- Same as Scenario A, BUT:
- Must handle extreme traffic spikes
- Delivery within 1 minute (not 5)
- Monitoring and alerts: know when something fails
- Retry logic: if an email fails, retry automatically
- No duplicate sends if there are retries
- Observable system: able to see the status of any notification

### Current stack
- Node.js (multiple services)
- PostgreSQL + some read replicas
- AWS (EC2, RDS, various services)
- SendGrid Business (higher limits, reliable API)

---

## Your Task

For **EACH scenario**, complete the worksheet below.

**Success criteria:** Your answers must be DIFFERENT for each scenario. If they're identical, you're not thinking about context.

---

## Worksheet — Scenario A (400 notifications/day)

### 1. Overall Architecture
*How does a notification flow from when the writer publishes to when the subscriber receives the email?*

```
Writer publishes article
  ↓
[write the flow step by step here]
  ↓
Subscriber receives email
```

---

### 2. Performance Tactics
*Which of these do you need? Why or why not?*

| Tactic | Use it? | Justification |
|--------|---------|---------------|
| Caching (Redis/Memcached) | Yes / No | |
| Async processing | Yes / No | |
| DB optimization | Yes / No | |
| Load balancing | Yes / No | |
| Compression | Yes / No | |

---

### 3. Scalability Tactics
*Which do you need at 400 notifications/day?*

| Tactic | Use it? | Justification |
|--------|---------|---------------|
| Stateless services | Yes / No | |
| Horizontal scaling | Yes / No | |
| Read replicas | Yes / No | |
| Message queue (RabbitMQ, SQS) | Yes / No | |
| Worker pool | Yes / No | |
| Polyglot persistence | Yes / No | |

---

### 4. Availability Tactics
*What do you need to be reliable without over-engineering?*

| Tactic | Use it? | Justification |
|--------|---------|---------------|
| Server redundancy | Yes / No | |
| Health checks | Yes / No | |
| Graceful degradation | Yes / No | |
| Circuit breakers | Yes / No | |
| Database replication | Yes / No | |
| Monitoring and alerts | Yes / No | |

---

### 5. Key questions

**Can this team of 3 juniors build AND maintain what you're proposing?**

_____________________________________________

**What happens if the email service (SendGrid) is down for 30 minutes?**

_____________________________________________

**What is the simplest thing that can work for this context?**

_____________________________________________

---

## Worksheet — Scenario B (1,000,000 notifications/day)

### 1. Overall Architecture
*How does a notification flow? The flow will be more complex than in A.*

```
Writer publishes article
  ↓
[write the flow step by step here]
  ↓
Subscriber receives email
```

---

### 2. Performance Tactics
*Which of these do you need at this scale?*

| Tactic | Use it? | Justification |
|--------|---------|---------------|
| Caching (Redis/Memcached) | Yes / No | |
| Async processing | Yes / No | |
| DB optimization | Yes / No | |
| Load balancing | Yes / No | |
| Compression | Yes / No | |

---

### 3. Scalability Tactics
*At 1M notifications/day, what is now necessary?*

| Tactic | Use it? | Justification |
|--------|---------|---------------|
| Stateless services | Yes / No | |
| Horizontal scaling | Yes / No | |
| Read replicas | Yes / No | |
| Message queue (RabbitMQ, SQS) | Yes / No | |
| Worker pool | Yes / No | |
| Polyglot persistence | Yes / No | |

---

### 4. Availability Tactics
*What availability guarantees does this system need?*

| Tactic | Use it? | Justification |
|--------|---------|---------------|
| Server redundancy | Yes / No | |
| Health checks | Yes / No | |
| Graceful degradation | Yes / No | |
| Circuit breakers | Yes / No | |
| Database replication | Yes / No | |
| Monitoring and alerts | Yes / No | |

---

### 5. Key questions

**How do you handle a spike of 100,000 notifications in 1 minute (viral article)?**

_____________________________________________

**How do you avoid sending the same email twice if there's a retry?**

_____________________________________________

**How do you know the system is failing BEFORE users report it to you?**

_____________________________________________

---

## Instructor Solutions

*Read this AFTER completing your worksheet. Compare your reasoning.*

---

### Solution: Scenario A — The Minimum Viable Architecture

**Flow:**
```
Writer publishes article
  ↓
API saves article to PostgreSQL
  ↓
API inserts one record into notification_queue per subscriber
  (article_id, subscriber_email, status='pending')
  ↓
[Every 5 minutes — Cron Job]
  ↓
Query: SELECT * FROM notification_queue WHERE status='pending' LIMIT 100
  ↓
For each notification: call SendGrid API
  ↓
Update status to 'sent' (or 'failed' if SendGrid returns an error)
  ↓
Subscriber receives email
```

**The schema:**
```sql
CREATE TABLE notification_queue (
  id SERIAL PRIMARY KEY,
  article_id INTEGER NOT NULL REFERENCES articles(id),
  subscriber_email VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',  -- pending, sent, failed
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP,
  error_message TEXT
);

-- The index you need:
CREATE INDEX idx_notification_queue_status ON notification_queue(status, created_at);
```

**Tactics used (and why):**

| Tactic | Used | Reason |
|--------|------|--------|
| Caching | ❌ No | Nothing worth caching at 400/day |
| Async processing | ✅ Yes | The table as queue IS async processing |
| DB optimization | ✅ Yes | The index on status is needed |
| Load balancing | ❌ No | One server is more than enough for this volume |
| Message queue (RabbitMQ) | ❌ No | Overkill for 400/day, team doesn't know it |
| Worker pool | ❌ No | The cron job is the "worker" |
| Read replicas | ❌ No | No read load that justifies it |
| Health checks | ✅ Yes | Always in production, practically free |
| Monitoring | ✅ Minimal | At least Sentry for errors, uptime monitor |

**Can the 3-junior team maintain this?**
Yes. It's a PostgreSQL table and a script that runs every 5 minutes. Any junior who knows SQL can debug it.

**What if SendGrid is down?**
Records stay at `status='pending'`. The cron job retries them in 5 minutes. Automatically. No extra code.

**Additional infrastructure cost:** $0. Everything runs on the server they already have.

---

### Solution: Scenario B — The Architecture That Scales

**Flow:**
```
Writer publishes article
  ↓
API saves article to PostgreSQL
  ↓
API publishes event to Message Queue: { articleId, authorId, publishedAt }
  ↓
Subscriber Lookup Worker:
  → Reads event from queue
  → Queries PostgreSQL: SELECT email FROM subscriptions WHERE author_id = ?
  → For each subscriber: publishes individual message to Notification Queue
  ↓
Email Worker Pool (3-5 workers, auto-scaling):
  → Consumes messages from Notification Queue
  → Generates deduplication key: sha256(article_id + subscriber_email)
  → Checks Redis: have we already sent this?
  → If not: calls SendGrid API
  → Stores deduplication key in Redis (TTL: 24 hours)
  → ACKs the queue (marks as processed)
  ↓
Monitoring:
  → Queue depth (Datadog/Grafana)
  → Failed job rate
  → Email delivery rate
  → Worker health checks
  ↓
Subscriber receives email (within ~1 minute)
```

**Tactics used (and why):**

| Tactic | Used | Reason |
|--------|------|--------|
| Message queue | ✅ Yes | Absorbs spikes, decouples publish from send |
| Worker pool | ✅ Yes | Horizontal scaling of processing |
| Worker auto-scaling | ✅ Yes | Viral spikes of 100K messages |
| Read replicas | ✅ Yes | Subscriber lookup can be heavy |
| Redis (deduplication) | ✅ Yes | Retries at 1M/day will happen; dedup prevents double-send |
| Full monitoring | ✅ Yes | You cannot debug 1M/day without it |
| Circuit breaker | ✅ Yes | If SendGrid is slow, don't block the workers |
| Health checks | ✅ Yes | Always |
| Polyglot persistence | Maybe | If email analytics needs a specialized DB |

**How do you handle the viral spike of 100,000 messages?**
The Message Queue absorbs them. The autoscaler adds workers. Workers process at their own pace. Without the queue, 100,000 simultaneous requests would collapse the API.

**How do you avoid duplicates on retries?**
```javascript
// Before sending each email:
const dedupKey = `email:sent:${articleId}:${subscriberEmail}`;
const alreadySent = await redis.exists(dedupKey);
if (alreadySent) return; // already sent, skip

await sendGrid.send({ to: subscriberEmail, ... });
await redis.setex(dedupKey, 86400, '1'); // TTL: 24 hours
```

**Additional cost:** ~$1,500-2,000/month more in infrastructure. Justified by the volume.

---

### The Final Comparison

| Aspect | Scenario A | Scenario B |
|--------|-----------|-----------|
| **Architecture** | Cron + PostgreSQL table | Queue + workers + Redis |
| **Complexity** | Low | High |
| **Additional infra cost** | $0 | $1,500-2,000/month |
| **3 juniors can build it** | ✅ Yes | ⚠️ With senior help |
| **Scales to 1M/day** | ❌ No | ✅ Yes |
| **Delivery time** | ~5 minutes | ~1 minute |
| **Deduplication** | Simple (status in DB) | Redis + ACK logic |

---

### The A → B Migration Path

The beauty: you can start at A and evolve toward B when you actually need it.

```
Start: cron + PostgreSQL table ← start here

Trigger 1: volume > 5,000 notifications/day, cron takes > 5 minutes
Action:    Add RabbitMQ. Convert cron into event publisher.
           Workers consume from the queue.

Trigger 2: Queue fills consistently during spikes
Action:    Add second and third worker.

Trigger 3: Workers consistently falling behind
Action:    Configure worker auto-scaling.

Trigger 4: You start having failures you can't debug
Action:    Add full monitoring (Datadog/Grafana).

Trigger 5: Retries are generating duplicates
Action:    Add Redis for deduplication.
```

Each step is taken when there is evidence it's needed. Not before.

**This is incremental architecture. You don't build Scenario B from day one "just in case."**

---

## Final Reflection

Before next week, reflect:

1. **Where in your current work does this same problem exist** — architecture decisions that ignore the real context of the team and budget?

2. **If you had to defend Scenario A** (the simple solution) to a client who wants "enterprise-grade," how would you explain it?

3. **What is the concrete trigger** that would make you move from Scenario A to Scenario B in your context?

