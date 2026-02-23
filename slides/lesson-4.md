---
theme: vibe
title: 'Architectural Tactics'
description: 'How we execute the strategy'
resources:
    - name: "Notification Exercise"
      url: "lesson-4-notification-exercise.md"
      type: "document"
    - name: "Student Handout"
      url: "lesson-4-student-handout.md"
      type: "document"
    - name: "Case Study"
      url: "lesson-4-case-study.md"
      type: "document"
    - name: "Tradeoff Matrix Template"
      url: "lesson-4-tradeoff-matrix.md"
      type: "document"
drawings:
  persist: false
---

# Architectural Tactics

## How we execute the strategy

Emmanuel G. | January 2026

---
layout: center
---

# Recap: Lesson 3

<v-clicks>

**Quality Attributes** — Performance, Scalability, Availability, Security, Maintainability

**Tradeoffs** — Every decision optimizes some attributes while sacrificing others

**6 Context Questions** — Team, budget, timeline, scale, business priority, risk tolerance

**Golden Hammer** — The anti-pattern of using what we know regardless of context

**Project Mercury** — The over-engineering lesson none of us wants to repeat

</v-clicks>

---
layout: center
---

# Age of Empires:
## Strategy vs. Tactics

---

# Strategy
## The big picture

<div class="grid grid-cols-2 gap-8 mt-8">
<div>

**In AoE:**
- Save resources to rush Castle Age
- Build buildings close together as defensive walls
- Control the center of the map
- Economy boom or military rush?

</div>
<div>

**In architecture:**
- WHAT quality attributes matter?
- WHAT tradeoffs do we accept?
- WHAT does context demand?

</div>
</div>

---

# Tactics (This lesson)
## The specific moves

<div class="grid grid-cols-2 gap-8 mt-8">
<div>

**In AoE:**
- Use sheep to explore (cheap scout!)
- Move horse archers out of catapult range
- Garrison villagers when attacked
- Quick-wall with palisades when you're being rushed

</div>
<div>

**In architecture:**
- HOW do we achieve performance?
- HOW do we achieve scalability?
- Specific, concrete techniques

</div>
</div>

---
layout: center
---

# You need BOTH to win

**Great strategy + bad tactics = you lose**

**Great tactics + no strategy = you lose**

---

# Today's Agenda

<v-clicks>

**Performance Tactics** — How to make things faster

**Scalability Tactics** — How to handle more load

**Availability Tactics** — How to stay up when things break

**Security Tactics** — Overview only (deep dive Week 8)

**Maintainability Tactics** — How to keep code healthy

**ADRs: The Honest Truth** — When they're worth it, when they're not

**Exercise: Notification Service** — We apply everything

</v-clicks>

---
layout: section 
---

# Performance Tactics

**How do we make things faster?**

---

# Caching

*The sheep move — fundamental, everyone should use it*

<div class="grid grid-cols-2 gap-8 mt-6">
<div>

**Cache layers:**
- Browser cache
- CDN (Cloudflare, Fastly)
- Application cache (Redis, Memcached)
- Database query cache

</div>
<div>

**When to use:**
- Data that doesn't change often
- Expensive to compute or fetch
- Same data requested repeatedly

**The tradeoff:**
Fresh data vs. speed

</div>
</div>

<div class="mt-6 p-4 bg-blue-900 rounded">
💡 Product catalog — changes maybe once a week. Cache for 1 hour. Save yourself 1,000 database queries.
</div>

---

# Async Processing

**Don't make users wait for things that don't need to be immediate**

<v-clicks>

**When to use:**
- Operations that take more than 2 seconds
- Result not needed immediately
- Can tolerate slight delay

**My principle:** When you need messaging between components, it's almost always a queue — or at minimum, a DB table with a status column. Start simple.

</v-clicks>

---

# Database Optimization

**Before adding any infrastructure, optimize the database**

<v-clicks>

**Indexes** — Huge win, basically free. Until you have too many.

**Avoid N+1 queries** — The classic junior mistake. Fetching 100 orders, then looping to fetch each customer separately. That's 101 queries. Fetch everything in one query.

**Connection pooling** — Reuse connections instead of creating a new one per request.

**EXPLAIN ANALYZE** — Run this on your slow queries. See what the DB is actually doing.

**The tradeoff:** Write speed (indexes slow writes) vs. read speed.

</v-clicks>

---

# Load Balancing + Compression

<div class="grid grid-cols-2 gap-8">
<div>

## Load Balancing
Distribute traffic across multiple servers

**Algorithms:**
- Round robin (1, 2, 3, 1, 2, 3...)
- Least connections (send to the least busy)
- IP hash (same user → same server)

**When:** One server can't handle all traffic

</div>
<div>

## Compression
Reduce payload size

100KB JSON → 20KB gzipped

**When:** Large responses, slow networks, mobile clients

**The tradeoff:** CPU to compress vs. bandwidth saved

</div>
</div>

---
layout: section 
---

# Scalability Tactics

**How do we handle more load?**

---

# Stateless Services

*This is NON-NEGOTIABLE for horizontal scaling*

<div class="grid grid-cols-2 gap-8 mt-6">
<div>

**The problem:**
If your server stores session in memory, you can only have ONE server.

User A is on Server 1 — their session lives there.
Server 2 doesn't know who User A is.

</div>
<div>

**The solution:**
- **Redis** for external session storage
- **JWT tokens** (session data lives in the token)
- **Database** if scale is modest

</div>
</div>

<div class="mt-6 p-4 bg-red-900 rounded">
⚠️ If your app stores session in server memory, you're stuck with one server forever.
</div>

---

# Horizontal Scaling + Read Replicas

<div class="grid grid-cols-2 gap-8">
<div>

## Horizontal Scaling
More servers instead of bigger servers

**Requirements:**
- Stateless services ✓
- Load balancer
- Shared external storage

No ceiling. Keep adding.

</div>
<div>

## Read Replicas
The easiest scaling win that people overlook

- 1 primary database (accepts writes)
- 3+ replicas (handle reads)
- Replication lag: typically 1-5 seconds

Most apps are 90% reads.
1 primary + 3 replicas = 4x read capacity.
**Most apps never need more than this.**

</div>
</div>

---

# Queue-Based Processing + Caching for Scale

<div class="grid grid-cols-2 gap-8">
<div>

## Queue-Based Processing
Decouple producers from consumers

**Benefits:**
- Absorbs traffic spikes
- Scale producers and consumers independently
- Retry failed jobs automatically

</div>
<div>

## Caching for Scale
Same tactic, different reason

Each cache layer prevents requests from hitting the bottleneck below:
- CDN → prevents hitting app servers
- Redis → prevents hitting the database
- DB cache → prevents hitting disk

</div>
</div>

---

# Polyglot Persistence

### Use different databases for different data needs

<v-clicks>

**Pattern:**
- **Central ACID DB** (e.g. PostgreSQL) for critical transactional data
- **Specialized DB** for high-volume, less-critical data

**Example — E-commerce:**
- PostgreSQL: orders, payments, user accounts (need ACID)
- Cassandra: product views, analytics events, logs (eventual consistency OK)

</v-clicks>

---

<v-clicks>

## Real examples
- Uber: PostgreSQL for trips, Cassandra for GPS
- Instagram: PostgreSQL for core data, Cassandra for feeds

## The analogy
Two small, manageable flocks — one fancy, one regular — instead of one giant herd of 100 sheep.
Much easier to manage.

</v-clicks>

---
layout: center
---

# Database Sharding
## The Nuclear Option

---

# The Sheep Problem

<div class="grid grid-cols-2 gap-8 mt-6">
<div>

## 1 sheep
Simple.
Click. Move. Done.

</div>
<div>

## 100 sheep, no experience, no sheepdog

🐑 Which sheep am I even moving?

🐑 They scatter everywhere

🐑 Lost track of half of them

🐑 Clicking frantically

**CHAOS.**

</div>
</div>

---

# Sharding is the Same

<div class="grid grid-cols-2 gap-8">
<div>

## One database
Simple. Query, result, done. ✓

</div>
<div>

## Ten sharded databases
Every query becomes:
- Which shard has this data?
- Need data from multiple shards? (cross-shard query — painful)
- How do I keep them balanced? (rebalancing — nightmare)
- Joins across shards? (very, very painful)
- User moved between shards? (migration — complex)

</div>
</div>

---
layout: center
---

# The Sheep Herding Principle

<div class="text-2xl mt-8">
Keep your flock small until wool demand is too high.
</div>

<div class="mt-8 text-lg text-gray-400">
Translation: Use ONE database until you absolutely, positively cannot handle the load anymore.
</div>

---

# Before You Shard — Reality Check

**"Cannot handle the load" means:**

<v-clicks>

- You tried caching
- You tried read replicas
- You tried vertical scaling (bigger server)
- You optimized every slow query
- You're at 90%+ capacity and still growing

</v-clicks>

<div class="mt-8 p-4 bg-green-900 rounded" v-click>
Well-optimized PostgreSQL handles billions of rows. Instagram used a single database for YEARS before sharding.
If it was good enough for early Instagram, it's probably good enough for your startup.
</div>

---
layout: section
---

# Availability Tactics

**How do we stay UP when things fail?**

*(And they will.)*

---

<div class="flex flex-col gap-0 justify-start">
    <h1 class="inline-block my-0!">Redundancy</h1>
    <p class="text-gray-400 text-sm inline-block mt-1!">No single points of failure</p>
</div>


<div class="grid grid-cols-2 gap-8 mt-4">
<div>

## Active-Active

Both servers handle traffic.
If one dies, the other keeps going.

</div>
<div>

## Active-Passive
One server handles traffic.
One is on standby.
Standby takes over if primary fails.
Slightly simpler to implement.

</div>
</div>

**When to use:** Critical systems that can't go down — production databases, payment services, authentication.

**The tradeoff:** Cost (minimum 2x servers) vs. uptime.

---

# Health Checks + Graceful Degradation

<div class="grid grid-cols-2 gap-8">
<div>

## Health Checks
Add a `/health` endpoint to every service.

- Load balancer pings every 10 seconds
- Returns "healthy" → traffic flows
- Stops responding → traffic stops, instance restarts

**Basically free to implement.**
Catches 80% of problems before users notice them.

</div>
<div>

## Graceful Degradation
Core features work even when non-core services fail.

- Recommendation service down → show generic popular products
- Payment processing slow → queue the order, confirm by email
- Image CDN down → show placeholder images

Reduced functionality vs. complete outage.

</div>
</div>

---

# Circuit Breakers

**Automatically stop calling failing services**

<div class="grid grid-cols-3 gap-6 mt-6 text-center">
<div class="p-4 bg-green-900 rounded">

## Closed
Normal.
Calls go through.

</div>
<div class="p-4 bg-red-900 rounded">

## Open
Service failing.
Block all calls immediately.
Fast-fail.

</div>
<div class="p-4 bg-yellow-900 rounded">

## Half-Open
After timeout:
let one test call through.
Works? → Close.
Fails? → Open.

</div>
</div>

<div class="mt-6 p-4 bg-blue-900 rounded">
Without circuit breakers, a slow external service can bring down YOUR service as all your threads pile up waiting.
</div>

---

# Database Replication + Monitoring

<div class="grid grid-cols-2 gap-8">
<div>

## Database Replication
Keep a warm standby ready to take over.

**Synchronous:** Write must confirm on primary AND replica. Zero data loss. Slightly slower writes.

**Asynchronous:** Confirms on primary, replicates in background. Faster writes. Tiny risk of losing last few seconds of data.

For most apps: async is fine. For financial transactions: go synchronous.

</div>
<div>

## Monitoring & Alerting
You can't fix what you don't know is broken.

**Monitor:**
- Error rates
- Response times
- Resource usage (CPU, memory, disk)
- **Business metrics** (orders/hour, signups/day)

Business metrics are underrated. A sudden drop in orders is often the first sign of a technical problem.

</div>
</div>

---
layout: section
---

# Security Tactics

Brief overview

---

# Security: What You Need to Know Now

<v-clicks>

**Authentication:** Who are you? (passwords, SSO, OAuth, magic links)

**Authorization:** What can you do? (roles, permissions, row-level security)

**Encryption:** At rest (encrypted database) and in transit (HTTPS — non-negotiable)

**Input validation:** Never, ever trust user input. Validate everything server-side.

**Rate limiting:** Prevents brute force and abuse

**Secrets management:** Don't put passwords in git.

</v-clicks>

---
layout: section 
---

# Maintainability Tactics

Can my team understand and change this code in 6 months?

---

# Modularity + Coupling & Cohesion

<div class="grid grid-cols-2 gap-8">
<div>

## Modularity
Clear boundaries between components.

**Layered architecture:**
- **Controllers** — HTTP, input validation
- **Services** — business logic
- **Repositories** — data access

Each layer knows what it does. Doesn't know how other layers work internally.

**From day one. On any project with more than one developer.**

</div>
<div>

## Low Coupling, High Cohesion

**Low coupling:** Modules don't depend heavily on each other. Change one, you don't have to change everything.

**High cohesion:** Related things live together. Your auth code is in one place, not scattered across 15 files.

**The test:** If you change one module, how many other files do you have to change? If the answer is "lots," coupling is too high.

</div>
</div>

---

# Clear Abstractions
Hide complexity behind simple interfaces.

```typescript
interface StorageService {
  uploadFile(file: File, path: string): Promise<string>
  deleteFile(path: string): Promise<void>
}
```

Could be S3, GCS, or local filesystem.
Code using it doesn't know or care which.

When the client moves from S3 to Azure: change ONE file.

---

# Automated Testing
Confidence to change code without breaking things.

**Types:**
- **Unit:** individual functions, fast
- **Integration:** components working together
- **E2E:** full user flows

You don't need 100% coverage. You need enough confidence to make changes without fear.

**Focus on:** critical business logic, complex algorithms, anything that's broken before.

---

# Documentation
Document the WHY, not the WHAT.

**Bad comment:**
```javascript
// increment counter
```

**Good comment:**
```javascript
// Rate limit is per-user per-minute
// per-endpoint because the client had
// abuse issues in production
```

Document: README, ADRs, API docs, code comments only for the non-obvious.

---

# Consistent Patterns
Same approach throughout the codebase.

- All controllers follow the same structure
- All DB queries through the same ORM
- All API endpoints follow the same conventions

**The benefit:** Learn once, read and write anywhere.

New dev joins, understands one pattern, understands the whole codebase.

---
layout: section 
---

# ADRs: The Honest Truth

---

# ADRs — The honest take

<v-clicks>

**In many companies, ADRs are complete overkill.**

I've worked at places with 200+ ADRs nobody reads. They become bureaucracy.

**But here's the real value:**

They're a **forcing function** for thinking through decisions BEFORE you write code.

</v-clicks>

---

# ADRs — The honest take
It's like rubber duck debugging for architecture. When you force yourself to write:
- What problem are we actually solving?
- What options did we consider?
- Why this one over the others?
- What are the consequences?

**20 minutes writing an ADR can save 2 weeks building the wrong thing.**


---

# The Real Story: The ADR That Saved Us

A team wanted to add Kafka to a notification system.

Me: *"Write an ADR first."*

When they tried to answer the questions:
- *"What problem does Kafka solve that RabbitMQ doesn't?"*
- *"Do we actually need Kafka's log replay and retention?"*
- *"Can our team of 3 juniors operate Kafka in production?"*

Halfway through writing, they stopped.

They realized: *"We want Kafka because it sounds impressive and looks good on a resume. RabbitMQ does everything we need and we already know how to run it."*

<!--
The ADR process caught resume-driven development before we wasted 3 weeks on it.
The ADR was never finished. But it did its job.
-->

---

# When to Write ADRs

<div class="grid grid-cols-2 gap-8 mt-6">
<div>

## Good reasons
- Decision costs 1+ week to change
- Multiple valid approaches and team is split
- You need alignment before coding
- You want to remember in 6 months why you did this

</div>
<div>

## Bad reasons
- Decision is obvious
- Trivial to change later
- You're prototyping / exploring
- Ceremony feels professional but value isn't there

</div>
</div>

---

# ADR Template — One page max

<div class="h-2/3 overflow-scroll">

```markdown
# ADR: [Decision Title]

**Date:** 2026-02-22
**Status:** Accepted

## Context
What problem are we solving? What constraints exist?

## Options Considered
1. Option A: brief description
2. Option B: brief description
3. Option C: brief description

## Decision
We chose: [Option X]

## Rationale
Why this option for OUR context:
- Reason 1
- Reason 2

## Consequences
What we gain: Benefit 1, Benefit 2
What we sacrifice: Tradeoff 1, Tradeoff 2
```

</div>

*One page. Maximum. If you're writing a novel, you're doing it wrong.*

---
layout: section 
---

# Exercise: Notification Service

Same problem. Two completely different contexts.

---

# The Problem

A blogging platform needs to email subscribers when a writer publishes a new post.

Simple, right?

<v-clicks>

**But there are TWO versions of this company:**

**Scenario A:** Small, lean, just starting out

**Scenario B:** Same company, 3 years later, scaled up

**Your job:** Design the architecture for EACH scenario using the tactics we just learned.

**If your answers are identical, you're not thinking about context.**

</v-clicks>

---

# Scenario A — The Reality

<div class="grid grid-cols-2 gap-8 mt-4">

<div>

**The company:**
- 50 writers
- ~200 subscribers per writer
- ~400 notifications per day
- Peak: 1 writer with 1,000 subscribers publishes

</div>

<div>

**The team:**
- 3 junior developers
- Budget: $500 USD/month total infrastructure
- Timeline: basic notifications working in 2 months

</div>

</div>

---

# Scenario A — The Reality

**Requirements:**
- Email notification when post is published
- Email only (no push yet)
- Within 5 minutes is fine
- Reliable: no lost notifications
- Simple to build and maintain

---

# Scenario B — The Dream

<div class="grid grid-cols-2 gap-8 mt-4">

<div>

**The company:**
- 5,000 writers
- ~10,000 subscribers per writer
- ~1 million notifications per day
- Peak: viral article, 100,000 simultaneous notifications

</div>

<div>

**The team:**
- 10 developers + dedicated ops team
- Budget: $10,000 USD/month infrastructure
- Timeline: 6 months to build it properly

</div>

</div>

---

# Scenario B — The Dream
**Requirements:**
- Same as Scenario A, but at scale
- Must handle traffic spikes
- Monitoring and alerting
- Retry logic for failed emails
- Delivery within 1 minute

---

# Now: your turn

**25 minutes. Individual or in pairs.**

For each scenario, decide:
1. What performance tactics?
2. What scalability tactics?
3. What availability tactics?
4. How complex should this system be?
5. Can this team actually build AND maintain what you're proposing?

*Use the worksheet*

---

# Instructor Solution: Scenario A

**The architecture:**

PostgreSQL table: `notification_queue`
  (id, article_id, subscriber_email, status, created_at)

Cron job every 5 minutes
  - Query for pending notifications
  - Send via SendGrid API
  - Update status to 'sent'

---

# Instructor Solution: Scenario A

**Tactics USED:**
- DB as queue (400/day is trivial for PostgreSQL)
- Cron for scheduling (zero complex orchestration)
- SendGrid (3 juniors don't manage email infrastructure)

**Tactics NOT used — and why:**
- No RabbitMQ — overkill for 400/day
- No worker pools — cron is perfectly adequate
- No real-time websockets — 5-min delay is explicitly acceptable

---

# Instructor Solution: Scenario B

**The architecture:**

Message Queue: RabbitMQ or AWS SQS.

- Worker pool (3-5 workers, auto-scaling)
- Writer publishes → event to queue
- Workers consume → SendGrid with rate limiting
- Redis for deduplication
- Monitoring: queue depth, failed jobs, delivery rates

---

# Instructor Solution: Scenario B

**Tactics USED:**
- Queue for decoupling (workers scale independently)
- Worker pool for horizontal scaling
- Rate limiting (respect SendGrid limits at scale)
- Redis deduplication (at 1M/day, retries happen)
- Monitoring (you cannot debug 1M/day without it)

**Tradeoffs:** Simplicity and cost → Scale and reliability

---
layout: center
---

# The Key Lesson

<div class="text-2xl mt-8">
The <strong>problem</strong> is the same.
</div>
<div class="text-2xl mt-4">
The <strong>tactics</strong> are completely different.
</div>
<div class="text-xl mt-8 text-gray-400">
Because the <strong>context</strong> is different.
</div>

<div class="mt-8 grid grid-cols-2 gap-8">
<div class="p-4 bg-blue-900 rounded">
Scenario A architecture for Scenario B scale → Under-engineered. Your cron falls apart.
</div>
<div class="p-4 bg-red-900 rounded">
Scenario B architecture for Scenario A scale → Over-engineered. Wasted complexity.
</div>
</div>

---

# The Migration Path

**Start at A, evolve toward B when you actually need it**

```
1. Start: cron + DB table (Scenario A)
2. When volume hits 5,000/day and cron takes too long → add a queue
3. When queue gets too deep during spikes → add more workers
4. When workers consistently fall behind → add auto-scaling
5. When you can't debug failures → add full monitoring
```

<div class="mt-8 p-4 bg-green-900 rounded text-center">
Each step is triggered by a PROVEN need. Not a hypothetical.
<br/>
You don't build Scenario B from day one "just in case."
<br/>
This is incremental evolution. This is how good architecture works.
</div>


<!--
PIZZA BREAK
-->

---
layout: section
---

# AdBid 
Integration Project

---

# AdBid — What is it?

**Design the architecture for a real-time ad bidding platform.**

<v-clicks>

**What you'll do:**
- Apply the quality attributes framework (Week 3)
- Choose appropriate tactics (Week 4)
- Document key decisions as ADRs
- Justify everything with context — no golden hammer allowed

**Individual or in pairs**

</v-clicks>

---

# AdBid — What's in the brief

**The case study includes:**
- Business requirements (functional and non-functional)
- Scale expectations
- Team constraints
- Budget information

**What you'll deliver:**
- Quality attribute analysis with tradeoff justification
- Tactical decisions with context reasoning
- 3-5 ADRs for key decisions
- Architecture diagram (Mermaid is fine)
- Tradeoff matrix

---

# Resources for AdBid

- **Case study brief** — detailed requirements
- **Lesson 3 handout** — quality attributes + tradeoffs
- **Lesson 4 handout** — tactics reference
- **Tradeoff matrix template**
- **ADR template**

<div class="mt-8 p-4 bg-yellow-900 rounded text-center">
Start early. This requires deep thinking — not something to leave for Saturday night.
</div>

---
layout: center
---

# Next week: Monolithic Architecture

**And I have some war stories for you...**

<v-clicks>

🦆 How I spent 8 hours building a duck shooter game... for a food preference form

🥽 Why I built an augmented reality app with hand tracking... to control window blinds

🎮 Why I no longer own my Oculus Quest but still don't regret the decision

</v-clicks>

<div class="mt-8 text-gray-400" v-click>
I know, it sounds absurd.
<br/>
They're some of the most instructive architecture lessons I've had.
<br/>
See you next week. Genuinely great session today.
</div>

---
layout: center
background: '#1a1a2e'
---

# Questions?
