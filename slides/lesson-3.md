---
theme: vibe 
title: Quality Attributes & Tradeoffs
description: "How to Make Informed Architecture Decisions"
drawings:
  persist: false
---

# Quality Attributes & Tradeoffs

<br>

Emmanuel G. | January, 2026

---
layout: center
class: text-center
---

# Nobody Knows Everything

<v-clicks>

- Not me
- Not the book authors
- Not the FAANG architects
- **Not anyone**

</v-clicks>

<v-click>

## Today you'll hear about my mistakes

Because that's how we learn

</v-click>

---

# Today's Agenda

<v-clicks>

1. **Quality Attributes** - The Big Five
2. **Tradeoffs** - When things compete  
3. **Context Questions** - How to decide
4. **War Story** - Project Mercury
5. **Workshop** - Match architectures to contexts
6. **Boring Technology** - Why simple wins
7. **Assignment** - Tradeoff analysis

</v-clicks>

<!-- Break around 1-hour mark (5 min) -->

---
layout: center
---

# What Makes a System "Good"?

<v-clicks>

"It works"

"It's fast"

"It doesn't crash"

"It's secure"

"It's easy to change"

</v-clicks>

<br>
<v-click>

## These are **Quality Attributes**

Characteristics that make a system valuable beyond just functional requirements

</v-click>

---

# The Big Five Quality Attributes

<v-clicks>

1. **Performance** - How fast?
2. **Scalability** - How many users?
3. **Availability** - How much uptime?
4. **Security** - How protected?
5. **Maintainability** - How easy to change?

</v-clicks>

<v-click>

### Not the only ones, but they cover 80% of discussions

</v-click>

---

# Performance

<v-clicks>

## Two types:

**Response Time:** How long until I get an answer?
- Measured in milliseconds
- Amazon: Every 100ms costs 1% in sales

**Throughput:** How many requests can you handle?
- Measured in requests/second
- Different from response time!

</v-clicks>

<v-click>

### But here's the thing...

**Not every system needs to be fast**

</v-click>

---
layout: two-cols
---

# Performance Context Matters

<v-clicks>

**Needs sub-second:**
- E-commerce checkout
- Real-time chat
- Gaming

**1-2 seconds is fine:**
- Admin dashboards  
- Report generation
- Analytics queries

</v-clicks>

::right::

<v-clicks>

**Minutes are acceptable:**
- Batch processing
- Overnight billing
- Data exports

</v-clicks>


<v-click>

### Ask: What does THIS system actually need?

</v-click>

---

# Scalability

<v-clicks>

## Can the system handle increased load?

**Different from performance:**
- Performance = fast for one user
- Scalability = fast for many users

**Two types:**
- **Vertical:** Bigger server (more RAM, CPU)
- **Horizontal:** More servers (add machines)

</v-clicks>

<v-click>

### Real talk for Mexican market...

</v-click>

---

# The Scale Trap

<v-clicks>

**Everyone expects:** "We'll have millions of users day one!"

**Reality:** Most startups take 3 years to reach 100K users

</v-clicks>

<v-click>

## You have time to refactor

</v-click>

<v-click>

### Don't optimize for scale you don't have

This is the golden hammer trap

</v-click>

---

# Availability

<v-clicks>

## Is the system up when users need it?

Measured in "nines":

| Nines | Downtime/Year | Cost |
|-------|--------------|------|
| 99% | 3.65 days | Cheap |
| 99.9% | 8.76 hours | Moderate |
| 99.99% | 52 minutes | Expensive |
| 99.999% | 5 minutes | Very expensive |

</v-clicks>

<v-click>

### Each nine costs exponentially more

</v-click>

---
layout: two-cols
---

# The Cost of Nines

<v-clicks>

**Going from 99.9% → 99.99% requires:**

- Redundant servers
- Automatic failover
- Multi-region deployment
- Load balancers
- 24/7 on-call team
- Monitoring and alerting
- Disaster recovery procedures

</v-clicks>

::right::

<v-click>

## Do you actually need five nines?

Most systems? Three nines is plenty.

</v-click>

---

# Security

<v-clicks>

## Protection from unauthorized access, breaches, attacks

**Why it matters:**
- One breach can destroy a company
- Equifax: 147M people exposed, $1.4B in losses

**But security has costs:**
- Development time (auth, encryption)
- Performance (encryption is slow)
- User experience (MFA is friction)

</v-clicks>

---
layout: center
---

<v-click>

### The question isn't "should we be secure?"

The question is "how secure do we need to be for THIS data?"

</v-click>

---
layout: two-cols
---

# Security Is Contextual

<v-clicks>

**Low security needs:**
- Public blog posts
- Marketing website
- Product catalog

**Medium security needs:**
- User accounts
- Shopping cart
- Comments/forums

</v-clicks>

::right::

<v-clicks>

**High security needs:**
- Payment information
- Medical records
- Financial data
- Personal identifiable information

</v-clicks>


<v-click>

Different data = Different security requirements

</v-click>

---

# Maintainability

<v-clicks>

## How easy is it to change, fix, and extend?

**This is the quality attribute that kills you slowly**

Bad architecture doesn't crash immediately...

It makes:
- Every change take longer
- Every bug harder to fix
- Every new feature a nightmare

</v-clicks>

---

# Signs of Poor Maintainability

<v-clicks>

- "I don't dare touch that code"
- "Only Juan knows how this works"
- "Changing X always breaks Y"
- "We have to test everything manually"
- "I need 3 days just to understand this"
- "The original developer left, now we're stuck"

</v-clicks>

---
layout: two-cols
---

# Why Boring Technology Wins

<v-click>

**Simple, well-understood patterns are maintainable**

- Team already knows them
- Lots of documentation
- StackOverflow answers exist
- New hires can learn quickly
- Debugging is easier

</v-click>

::right::

<v-click>

**Clever, cutting-edge solutions often aren't**

- Team has to learn them
- Limited documentation
- Few StackOverflow answers
- Hard to hire for
- Debugging is painful

</v-click>


---
layout: center
class: text-center
---

# The Big Tradeoff 

<v-click>

## All quality attributes compete with each other

</v-click>

---
layout: center
class: text-center
---

# Everything Is a Tradeoff

<v-click>

## You cannot optimize for everything

</v-click>

<v-click>

Every decision improves some quality attributes and hurts others

</v-click>

<v-click>

### Architecture is the art of conscious tradeoffs

</v-click>

---

# Common Tradeoffs

<v-clicks>

**Performance vs Security**
- Encryption is slow
- Want <50ms? Might conflict with encrypting everything
- Tradeoff: Encrypt at rest, not every API call

**Scalability vs Simplicity**
- Horizontal scaling = complex (load balancers, orchestration)
- Simple monolith doesn't scale as easily
- Tradeoff: Start simple, scale when needed

</v-clicks>

---

# More Common Tradeoffs

<v-clicks>

**Availability vs Cost**
- Five nines requires redundancy, multi-region, 24/7 on-call
- That's expensive in money and people
- Tradeoff: Three nines is probably enough

**Performance vs Maintainability**
- Optimized code is often complex code
- Hand-written SQL > ORMs in performance
- But ORMs are more maintainable
- Tradeoff: Use ORM until performance problems

</v-clicks>

---

# The Context Questions Framework

<v-clicks>

## How do you decide which quality attributes matter most?

**Ask six context questions:**

1. What's the **actual business priority**?
2. What's your **actual scale**?
3. What's your **budget**?
4. What's your **timeline**?
5. What can your **team actually build and maintain**?
6. What's your **risk tolerance**?

</v-clicks>

<v-click>

### These questions determine everything

</v-click>

---
layout: two-cols
---

# Context Question #1

**What's the actual business priority?**

<v-clicks>

**Ask:**
- Is uptime life-or-death (medical) or just annoying (social media)?
- Does every millisecond count (trading) or is 1 second fine (reports)?

**Example:**
- Medical device: Availability is critical
- Internal admin tool: Performance less critical

</v-clicks>

::right::

<v-click>

### Business priority determines which quality attribute wins

</v-click>

---
layout: two-cols
---

# Context Question #2

**What's your actual scale?**

<v-clicks>

**Ask:**
- Do you have 10 users or 10 million?
- What's realistic growth in 6 months? 1 year?

**Example:**
- 100 current users, maybe 1K in a year
- Don't build for 1M users you don't have

</v-clicks>

::right::

<v-click>

### Don't optimize for imaginary scale

You'll know when you hit scaling problems (servers slow down, costs spike)

Then refactor. You have time.

</v-click>

---
layout: two-cols
---

# Context Question #3

## What's your budget?

<v-clicks>

**Three types of budget:**

**Money:** How much can you spend on infrastructure?

**Time:** How long to build?
<!-- 2 weeks? Different than 6 months -->

**People:** How many developers?
<!-- 1 person? Different than 10-person team -->

</v-clicks>

::right::

<v-click>

### All three constrain your choices

</v-click>

<!--
Money: $50/month? Different choices than $5K/month 

Time: 2 weeks? Different than 6 months

People: 1 person? Different than 10-person team
-->

---
layout: two-cols
---

# Context Question #4

## What's your timeline?

<v-clicks>

**Ask:**
- Need it in 2 months or 2 years?
- Fast iteration or perfect first time?
- Is there a hard deadline?

**Example:**
- 2-month deadline: Simple monolith, ship fast
- 1-year timeline: Can afford more architectural planning

</v-clicks>

::right::

<v-click>

### Tight deadlines = simpler solutions

You can refactor later

</v-click>

---
layout: two-cols
---

# Context Question #5

## What can your team actually build and maintain?

<v-clicks>

This is a quality attribute nobody talks about: **Team capability**

**Ask:**
- Team of 3 juniors? Different than 3 seniors.
- Does team know this technology?
- Can they debug it when it breaks?

</v-clicks>

::right::

<v-click>

### The best architecture on paper is useless if your team can't maintain it

</v-click>

---
layout: two-cols
---

# Team Skills as Quality Attribute

<v-clicks>

**Real example:**

3-person team shouldn't use Kubernetes

**Why?**
- Learning curve: months
- Debugging: hard
- Operations: complex  
- 2 AM outage: who fixes it?

</v-clicks>

::right::

<v-click>

### The best solution for your team ≠ best solution for Google

Google has:
- 100-person teams
- Dedicated SREs
- Custom tools
- 24/7 support

**You don't.**

</v-click>

---
layout: two-cols
---

# Context Question #6

## What's your risk tolerance?

<v-clicks>

**Ask:**
- Is 99% uptime acceptable or unacceptable?
- Can you afford to be down for an hour?
- What's the cost of a security breach?

**Example:**
- E-commerce during Black Friday: Low risk tolerance
- Internal reporting tool: Higher risk tolerance

</v-clicks>

::right::

<v-click>

### Risk tolerance determines how much you invest in availability/security

</v-click>

---
layout: center
class: text-center
---

# War Story: Project Mercury

<v-click>

A consulting project where we got all of this wrong

</v-click>

---

# Project Mercury: The Setup

<v-clicks>

**Client:** Small logistics company  
**Users:** 3 customers  
**Usage:** ~10 requests per month  
**Need:** Customer portal to track shipments

**My role:** Technical lead  
**My experience:** Junior, enthusiastic, read too many blog posts

</v-clicks>

<v-click>

## We'd been reading about microservices...

</v-click>

---
layout: two-cols
---

# What We Built (for 3 customers)

<v-clicks>

### 7 microservices
  - User service
  - Auth service
  - Notification service
  - Shipment service
  - Analytics service
  - etc.

</v-clicks>

::right::

<v-clicks>

- Kubernetes cluster
- Event-driven with RabbitMQ
- Separate databases per service
- CI/CD pipeline (15-minute builds)
- Grafana dashboards

</v-clicks>

<v-click>

### For 3 customers who would use it 10 times per month

</v-click>

---
layout: two-cols
---

# What We Should Have Built

<v-clicks>

**Simple monolith:**
- Rails or Django app
- PostgreSQL database
- Deploy to Heroku
- **Time:** 2 weeks
- **Cost:** $50/month
- **Team:** Can understand and maintain it

</v-clicks>

::right::

<v-click>

**What we built:**
- **Time:** 3 months
- **Cost:** $500/month  
- **Team:** Struggled to debug distributed system

</v-click>

---
layout: two-cols
---

# Mercury: What We Optimized For

<v-clicks>

**What we optimized for:**
- Scalability (handle millions!)
- Team independence (each service has own team!)
- Technology diversity (different languages!)
- Fault isolation (one service down ≠ crash)

</v-clicks>

::right::

<v-clicks>

**What we actually needed:**
- Development speed (ship quickly)
- Simplicity (3-person team)
- Cost (limited budget)
- Debugging ease (fix fast)

</v-clicks>

<v-click>

### We optimized for the wrong things

</v-click>

---

# Mercury: The Context We Ignored

<v-clicks>

| Question | Answer | What We Built |
|----------|--------|---------------|
| Business priority? | Ship fast | Took 3 months |
| Actual scale? | 3 customers | Built for millions |
| Budget? | Limited | $500/month |
| Timeline? | 1 month | Took 3 months |
| Team capability? | 3 juniors | Complex system |
| Risk tolerance? | Can tolerate downtime | High-availability |

</v-clicks>

<!--
We ignored every single context question
-->

---
layout: two-cols
---

# When Would Microservices Make Sense?

<v-clicks>

**For Mercury client, we'd need:**

- 50+ customers (not 3)
- Multiple teams (not 1 team of 3)
- Proven scaling issues (not hypothetical)
- Budget for complexity (not shoestring)
- Independent deployment needs (not weekly releases)

**None of which we had**

</v-clicks>

::right::

<v-click>

## The lesson?

**Don't build for imaginary future scale**

### Build for actual current needs

</v-click>

---
layout: two-cols
---

# Mercury: The Aftermath

<v-clicks>

**What happened:**
- Client got their portal (eventually)
- 3 months late
- Way over budget
- Team burned out
- Hard to maintain
- Hard to debug

</v-clicks>

::right::

<v-clicks>

**What we learned:**
- Context matters more than "best practices"
- Simple beats complex for small scale
- Team capability is a quality attribute
- Boring technology would have won

<br>

### I'm telling you this so you don't make the same mistake

</v-clicks>

<!--
5-Minute Break

When we return: Workshop time
-->

---

# Workshop: Architecture Context Matching

<v-clicks>

**You'll get:**
- 3 different architectures (A, B, C)
- 3 different business contexts (1, 2, 3)

**Your job:**
- Match each architecture to the context where it makes most sense
- Justify your choices using: quality attributes, tradeoffs, context questions

**Time:** 20 minutes group work + 10 minutes discussion

</v-clicks>

<v-click>

### No perfect answers, but there are well-reasoned answers

</v-click>

---

# Workshop Format

<v-clicks>

1. **Form groups** of 3-4 people
2. **Read materials** (5 min)
   - 3 architectures
   - 3 business contexts
3. **Group discussion** (20 min)
   - What does each architecture optimize for?
   - What does it sacrifice?
   - Which context needs those optimizations?
4. **Share findings** (10 min)
   - Quick presentations from each group

</v-clicks>

---
layout: center
class: text-center
---

# [Workshop Time]

## 20 minutes of group discussion

I'll be walking around if you need help

Go!

---
layout: center
---

# Choose Boring Technology

<v-clicks>

Not because boring is always best

But because boring is usually appropriate

</v-clicks>

<br>

<v-click>

### What do I mean by "boring"?

</v-click>

---
layout: two-cols
---

# What Is Boring Technology?

<v-clicks>

**Characteristics:**
- Been around for years
- Well-documented
- Lots of StackOverflow answers and LLM support
- Battle-tested in production
- Team already knows it (or can learn easily)

</v-clicks>

::right::

<v-clicks>

**Examples:**
- PostgreSQL (not MongoDB unless you have a reason)
- Monolith (not microservices unless you need it)
- REST APIs (not GraphQL unless it solves a problem)
- Server-side rendering (not complex SPA unless necessary)

</v-clicks>


---
layout: two-cols
---

# Boring ≠ Bad

<v-clicks>

**Boring means:**
- Reliable
- Proven
- Understood
- Maintainable
- Lots of help available

</v-clicks>

::right::

<v-clicks>

**Exciting means:**
- Unknown problems
- Limited documentation
- Few experts
- Harder to hire
- Slower debugging

</v-clicks>


<v-click>

### Choose reliability over novelty

</v-click>

---

# Innovation Tokens

<v-clicks>

**Concept from Dan McKinley:**

You have a limited budget of innovation. Spend it wisely.

**Why limited?**
- New tech has unknown problems
- Team has to learn it
- Harder to hire for
- Debugging is slower

**Most companies have 3-5 innovation tokens**

</v-clicks>

---

# Using Innovation Tokens Wisely

<v-clicks>

**Good use:**
> "We're using boring PostgreSQL, boring monolith, boring REST APIs...
> But we're innovating on our ML recommendation engine
> Because that's our competitive advantage"

**Bad use:**
> "We're using brand new database, experimental architecture, cutting-edge deployment...
> Oh and also trying to build our core product"

</v-clicks>

<br>

<v-click>

### You'll die from a thousand cuts

</v-click>

---

# The Golden Hammer

<v-clicks>

**Anti-pattern:** When you have a hammer, everything looks like a nail

**In software:** When you know one technology, you use it for everything

**Mexican development context:**
- Everyone learns MERN stack (Mongo, Express, React, Node)
- So every project becomes MERN
- Even when relational database would be better
- Even when server-side rendering would be simpler
- Even when Python would be more appropriate

</v-clicks>

<v-click>

### This is unconscious over-engineering

</v-click>

---

# The Golden Hammer Problem

<v-clicks>

You're not choosing the best tool for the job. You're choosing the tool you know

This leads to:
- Inappropriate technology choices
- Unnecessary complexity
- Poor fit for problem domain
- Maintainability issues

</v-clicks>

<br>

<v-click>

### How do you fight this?

</v-click>

---

# Fighting the Golden Hammer

<v-clicks>

**1. Always ask:** "Is this the right tool for this job?"
- Not: "Can I use the tool I know?"
- But: "What does this problem actually need?"

**2. Separate familiarity from appropriateness**
- Familiar ≠ Appropriate
- Just because you know Kubernetes doesn't mean every project needs it

**3. Consider team context**
- Can the team maintain this?
- Is learning curve worth it?

</v-clicks>

---

# Fighting the Golden Hammer (cont.)

<v-clicks>

**4. Document why you chose it**
- If you can't justify beyond "I know this tech," reconsider
- Force yourself to articulate the reasoning

**5. Be okay with boring**
- PostgreSQL again? Maybe that's fine
- Monolith again? Maybe that's appropriate
- Same stack as last project? Could be the right choice

</v-clicks>

<br>

<v-click>

### The goal isn't variety. The goal is appropriateness

</v-click>

---
layout: two-cols
---

# When to Use New Technology

<v-clicks>

**Good reasons:**
- Solves a problem boring tech can't
- Core competitive advantage
- Team has capacity to learn
- Benefits clearly outweigh costs
- You have innovation tokens to spend

</v-clicks>

::right::

<v-clicks>

**Bad reasons:**
- It's on your resume wishlist
- It's what Google uses
- It's trending on Twitter
- You're bored with current stack
- It's "best practice" (says who?)

</v-clicks>

<v-click>

### Be honest with yourself about which category you're in

</v-click>

---

# Week 3 Assignment

## Tradeoff Analysis Paper

<v-clicks>

Three scenarios, each with architecture decisions. For each scenario:
1. Identify quality attributes being optimized
2. Identify what's being sacrificed
3. Evaluate if tradeoff is appropriate for context
4. Justify your answer

</v-clicks>

<br>

<v-click>

### This is not about right/wrong, this is about quality of reasoning

</v-click>

---
layout: two-cols
---

# Next Lesson Preview

## Lesson 4: Architectural Tactics

<v-clicks>

**This week we learned:**
- **What** quality attributes matter
- **Why** we make tradeoffs

</v-clicks>

::right::

<v-clicks>

**Next week we learn:**
- **How** to achieve performance (caching, async, optimization)
- **How** to achieve scalability (horizontal scaling, stateless)
- **How** to achieve availability (redundancy, health checks)

Plus: **🍕 Pizza party!**

</v-clicks>

---
layout: center
class: text-center
---

# Questions?

---
layout: center
class: text-center
---

# Great Work!

This was heavy conceptual material. If you're feeling uncertain, that's normal

<br>

<v-click>

### Architecture is ambiguous

That's why we get paid to do it

</v-click>
