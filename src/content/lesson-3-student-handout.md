# Lesson 3: Quality Attributes & Tradeoffs
## Redis (Paper-Server Edition)

**Your fast-lookup reference for architectural thinking**

---

## Why "Redis (Paper-Server Edition)"?

**Redis** is an in-memory data store - lightning-fast lookups for frequently accessed data.

**This handout** is your paper-server cache - lightning-fast lookups for frequently needed architecture knowledge.

**Just like Redis:**
- Fast retrieval (flip to page, find answer)
- Frequently accessed (use during every assignment)
- Volatile storage (you don't memorize, you query)
- Key-value lookups (problem → solution)

**Unlike Redis:**
- Doesn't expire or get evicted
- Doesn't need server infrastructure
- Can't handle millions of requests/sec (but you only need ~5/week)
- Works offline
- No network latency
- 100% availability (assuming you don't lose it)

**How to use this cache:**
1. Keep it nearby during assignments
2. Query it when you need to remember tactics or concepts  
3. Reference it during case studies
4. Don't try to memorize - just know it exists and where to find it

**Cache hit rate goal:** 90%+ of your architecture questions answered here

---

## Before You Begin: Nobody Knows Everything

<v-clicks>

This is important to internalize:

**Nobody knows everything about software architecture.**

- Not your instructor
- Not the authors of famous books
- Not the architects at FAANG companies
- Not the people who seem confident on Twitter

**Everyone is figuring it out as they go.**

The difference between junior and senior developers isn't that seniors know everything. It's that seniors:
- Know what they don't know
- Know how to figure things out
- Have made more mistakes and learned from them
- Are comfortable with ambiguity

**You're supposed to feel uncertain sometimes.** That's what architecture feels like.

If you finish this week thinking "I still don't know THE right answer," **that's correct**. 

Architecture rarely has one right answer. It has:
- Answers that work in this context
- Answers that optimize for these priorities
- Answers with acceptable tradeoffs

Your job is to make **well-reasoned** choices, not perfect ones.

---

## The Big Five Quality Attributes

Quality attributes are characteristics that make a system valuable beyond just functional requirements ("it works").

### 1. Performance

**What it is:** How fast the system responds and how much work it can do

**Two sub-types:**
- **Response time:** How long until I get an answer? (measured in milliseconds)
- **Throughput:** How many requests can you handle? (measured in requests/second)

**Real-world example:**
Amazon found that every 100ms of latency cost them 1% in sales. For them, performance directly impacts revenue.

**When to prioritize:**
- E-commerce checkout
- Real-time chat/gaming
- High-frequency trading
- User-facing APIs

**When NOT to prioritize:**
- Overnight batch processing
- Internal admin tools
- Analytics dashboards
- Report generation

**Context matters:** A billing system that runs overnight doesn't need sub-second response times.

**Common tradeoffs:**
- Performance vs Simplicity (optimized code is often complex)
- Performance vs Security (encryption adds latency)
- Performance vs Cost (faster servers cost more)

---

### 2. Scalability

**What it is:** Can the system handle increased load?

**Different from performance:**
- Performance = fast for one user
- Scalability = fast for many users

**Two types:**
- **Vertical scaling:** Bigger server (more RAM, faster CPU)
  - Easier to implement
  - Has a ceiling (can't infinitely upgrade one machine)
- **Horizontal scaling:** More servers (add machines)
  - More complex (requires load balancing, stateless design)
  - No theoretical ceiling

**The Mexican market reality:**
Everyone expects to scale to millions of users day one. Reality? Most startups take 3 years to reach 100K users. You have time to refactor.

**When to prioritize:**
- Proven rapid growth
- Viral products
- Seasonal spikes (e-commerce at holidays)

**When NOT to prioritize:**
- New startups with 0 users
- Internal tools with known user count
- Niche B2B products

**The trap:** Don't optimize for scale you don't have. Build for your actual current needs.

**Common tradeoffs:**
- Scalability ⚖️ Simplicity (horizontal scaling is complex)
- Scalability ⚖️ Cost (more servers = more money)
- Scalability ⚖️ Development time (takes longer to build)

---

### 3. Availability

**What it is:** Is the system up when users need it?

**Measured in "nines":**

| Nines | Uptime | Downtime/Year | Typical Use |
|-------|--------|---------------|-------------|
| 99% | | 3.65 days | Unacceptable for most |
| 99.9% | | 8.76 hours | Acceptable for many |
| 99.99% | | 52 minutes | E-commerce, SaaS |
| 99.999% | | 5 minutes | Financial, medical |

**Cost increases exponentially per nine:**

Going from 99.9% → 99.99% requires:
- Redundant servers
- Automatic failover
- Multi-region deployment
- Load balancers
- 24/7 on-call team
- Disaster recovery procedures

**When to prioritize:**
- Revenue-generating systems
- Medical/safety-critical systems
- Financial transactions
- Customer-facing SaaS

**When NOT to prioritize:**
- Internal tools
- Development environments
- Analytics dashboards
- Batch processing systems

**Reality check:** Most systems don't need five nines. Three nines (99.9%) is often plenty.

**Common tradeoffs:**
- Availability vs Cost (high availability is expensive)
- Availability vs Complexity (redundancy adds moving parts)
- Availability vs Development speed (takes longer to build)

---

### 4. Security

**What it is:** Protection from unauthorized access, data breaches, and attacks

**Why it matters:**
One breach can destroy a company. Example: Equifax breach exposed 147 million people, cost $1.4 billion, executives resigned.

**Security has costs:**
- Development time (implementing auth, encryption)
- Performance (encryption is slow)
- User experience (multi-factor auth is friction)
- Operational complexity (key management, compliance)

**When to prioritize:**
- Payment information
- Medical records
- Personal identifiable information (PII)
- Financial data
- Authentication systems

**When less critical:**
- Public marketing content
- Already-public data
- Read-only product catalogs

**The question isn't "should we be secure?"**

The question is "**how secure do we need to be for THIS data?**"

Social media post? Different security needs than medical records.

**Common tradeoffs:**
- Security vs Performance (encryption adds latency)
- Security vs User experience (MFA adds friction)
- Security vs Development speed (security takes time)
- Security vs Cost (security tools and audits cost money)

**Note:** Week 8 covers security in depth. For now, just know it's always a quality attribute to consider.

---

### 5. Maintainability

**What it is:** How easy is it to change, fix, and extend the system?

**This is the quality attribute that kills you slowly.**

Bad architecture doesn't crash immediately. It makes:
- Every change take longer
- Every bug harder to fix
- Every new feature a nightmare

Six months in: What took 2 days now takes 2 weeks. That's poor maintainability.

**Signs of poor maintainability:**
- "I don't dare touch that code"
- "Only Juan knows how this works"
- "Changing X always breaks Y"
- "We have to test everything manually"
- "The original developer left, now we're stuck"

**Maintainability is like technical debt - it compounds.**

**When to prioritize:**
- Long-lived systems
- Small teams
- High turnover
- Frequent changes expected

**This is why "boring technology" wins:**
Simple, well-understood patterns are maintainable:
- Team already knows them
- Lots of documentation
- StackOverflow answers exist
- Easy to hire for
- Debugging is easier

**Common tradeoffs:**
- Maintainability vs Performance (simple code often slower than optimized)
- Maintainability vs Flexibility (generic solutions are complex)
- Maintainability vs Innovation (boring tech is more maintainable)

---

## Common Quality Attribute Tradeoffs

| Tradeoff | What This Means | Example |
|----------|----------------|---------|
| **Performance vs Security** | Encryption is slow. Faster systems may skip some security. | Encrypt data at rest (DB) but not every API call |
| **Scalability vs Simplicity** | Horizontal scaling requires complex orchestration. | Start with monolith, scale when needed |
| **Availability vs Cost** | High availability requires redundancy, which is expensive. | Three nines probably enough, not five |
| **Performance vs Maintainability** | Optimized code is often complex and hard to maintain. | Use ORM until performance is actually a problem |
| **Security vs User Experience** | Strong security adds friction (passwords, 2FA, etc.) | Balance security needs with user convenience |
| **Development Speed vs Everything** | Building fast often means sacrificing other qualities. | Ship quickly, refactor later |

**Key insight:** You cannot optimize for everything. Every decision improves some qualities and hurts others.

**Architecture is the art of conscious tradeoffs.**

---

## The Context Questions Framework

How do you decide which quality attributes to prioritize? Ask six context questions:

### 1. What's the actual business priority?

**Ask:**
- Is uptime life-or-death (medical) or just annoying (social media)?
- Does every millisecond count (trading) or is 1 second fine (reports)?
- Is this core product or internal tool?
- What happens if this fails?

**Why it matters:**
Business priority determines which quality attribute wins. If client says "we need it fast," performance wins. If they say "it can never go down," availability wins.

**Example:**
- Medical device monitoring: Availability is critical (lives at stake)
- Internal admin dashboard: Performance less critical (used occasionally)

---

### 2. What's your actual scale?

**Ask:**
- Do you have 10 users or 10 million?
- What's realistic growth in 6 months? 1 year?
- Is this proven demand or hypothetical future?

**Why it matters:**
Don't optimize for scale you don't have. Most startups take years to reach significant scale. You'll know when you hit scaling problems - servers slow down, costs spike. Then refactor.

**Example:**
- Current: 100 users
- Growth: Maybe 1,000 in a year
- Don't build for: 1 million users you don't have

**Mexican market reality:** Everyone expects millions of users day one. Reality is 3 years of slow growth. You have time to refactor.

---

### 3. What's your budget?

**Three types of budget:**

**Money budget:**
- How much can you spend on infrastructure?
- $50/month? Different choices than $5,000/month
- Serverless vs dedicated servers

**Time budget:**
- How long do you have to build?
- 2 weeks? Different than 6 months
- Tight timeline = simpler solutions

**People budget:**
- How many developers?
- 1 person? Different than 10-person team
- Junior team? Different than senior team

**All three constrain your architectural choices.**

**Example:**
- Small budget → Heroku monolith, PostgreSQL
- Large budget → Kubernetes, microservices, multiple regions

---

### 4. What's your timeline?

**Ask:**
- Need it in 2 months or 2 years?
- Fast iteration or perfect first time?
- Is there a hard deadline (regulatory, market window)?

**Why it matters:**
Tight deadlines favor simpler solutions. You can refactor later once you're generating revenue or meeting the deadline.

**Example:**
- 2-month deadline → Simple monolith, ship fast, refactor later
- 1-year timeline → Can afford more architectural planning

**Principle:** Ship something that works, then improve it.

---

### 5. What can your team actually build and maintain?

**This is a quality attribute nobody talks about: Team capability.**

**Ask:**
- Team of 3 juniors? Different than 10 seniors.
- Does team know this technology?
- Can they debug it when it breaks?
- Who's on-call at 2 AM when something goes wrong?
- Can we hire for this technology?

**Why it matters:**
The best architecture on paper is useless if your team can't build or maintain it.

**Real example:**
3-person team shouldn't use Kubernetes because:
- Learning curve is months
- Debugging is hard
- Operations are complex
- When something breaks at 2 AM, who fixes it?

**The best solution for YOUR team ≠ the best solution for Google.**

Google has:
- 100-person teams
- Dedicated SREs
- Custom tools
- 24/7 support

You don't.

**Principle:** Choose technology your team can actually handle.

---

### 6. What's your risk tolerance?

**Ask:**
- Is 99% uptime acceptable or unacceptable?
- Can you afford to be down for an hour?
- What's the cost of downtime?
- What's the cost of a security breach?

**Why it matters:**
Risk tolerance determines how much you invest in availability and security.

**Example:**
- E-commerce during Black Friday: Very low risk tolerance (every minute costs money)
- Internal reporting tool: Higher risk tolerance (downtime is annoying, not catastrophic)

**Cost of risk mitigation:**
Lower risk tolerance = higher costs (redundancy, monitoring, on-call team)

---

## Team Skills as a Quality Attribute

**This deserves its own section because it's crucial:**

What your team can actually build and maintain IS a quality attribute.

**Consider:**

**Team composition:**
- 3 junior developers with 6 months experience
- vs 10 senior developers with 10+ years
- **These are different constraints**

**Technology familiarity:**
- Team knows Ruby/Rails well
- Team has never touched Kubernetes
- **Learning curve matters**

**Operational capability:**
- Who's on-call at 2 AM?
- Who can debug distributed systems?
- Who understands networking?
- **Operations is part of the architecture**

**Hiring constraints:**
- Can you hire for exotic technology?
- In Mexican market, easier to hire Rails devs than Kubernetes experts
- **Recruitment affects sustainability**

**The best solution on paper is useless if your team can't build it.**

**Example scenarios:**

**Scenario 1:**
- Team: 3 juniors, know Node.js
- Proposal: Microservices with Kubernetes
- **Problem:** Team can't maintain this
- **Better:** Node.js monolith, deploy to Heroku

**Scenario 2:**
- Team: 10 seniors, strong ops background
- Proposal: Monolith
- **May be fine,** but team has capability for more if needed
- **Consider:** Does business actually need more complexity?

**Principle:** Match architecture complexity to team capability.

---

## The Boring Technology Principle

**Choose boring technology.**

Not because boring is always best, but because boring is usually appropriate.

### What is "Boring Technology"?

**Characteristics:**
- Been around for years
- Well-documented
- Lots of StackOverflow answers
- Battle-tested in production
- Team already knows it (or can learn easily)
- Proven in production at scale
- Mature ecosystem

**Examples:**
- PostgreSQL (not MongoDB unless you have a specific reason)
- Monolithic architecture (not microservices unless you need it)
- REST APIs (not GraphQL unless it solves a problem)
- Server-side rendering (not complex SPA unless necessary)
- Heroku/Railway (not Kubernetes unless you have the team)
- Ruby on Rails, Django, Laravel (not new frameworks)

**Boring ≠ Bad. Boring = Reliable.**

### Why Boring Technology Wins

**Reliability:**
- Known failure modes
- Proven at scale
- Stable API

**Maintainability:**
- Team likely knows it
- Easy to hire for
- Lots of documentation
- Large community

**Debugability:**
- Many people have hit your problem before
- StackOverflow answers exist
- Monitoring tools mature

**Productivity:**
- Less time learning
- More time building
- Faster debugging
- Easier onboarding

**Example:**
PostgreSQL has been around since 1996. It's boring. It's also:
- Used by millions of applications
- Handles petabytes of data
- Well-understood by developers
- Extensively documented
- Easy to hire for

MongoDB is exciting! It's also:
- Easier to misuse (schema-less can be dangerous)
- Fewer people understand it well
- Harder to hire for in some markets
- Different failure modes

**Use PostgreSQL unless you have a specific reason for MongoDB.**

---

## Innovation Tokens

**Concept from Dan McKinley:**

You have a limited budget of innovation. Spend it wisely.

**Why limited?**
- New tech has unknown problems
- Team has to learn it
- Fewer StackOverflow answers
- Harder to hire for
- Debugging is slower
- Operations are harder

**Most companies have 3-5 innovation tokens for their entire stack.**

### Using Tokens Wisely

**Good use of innovation tokens:**
> "We're using boring PostgreSQL, boring monolith, boring REST APIs, boring Heroku...
> 
> But we're innovating on our ML recommendation engine
> 
> Because that's our competitive advantage and core business value"

**Bad use of innovation tokens:**
> "We're using brand new database (token 1), experimental architecture pattern (token 2), cutting-edge deployment tool (token 3), new frontend framework (token 4)...
> 
> Oh and also trying to build our core product
> 
> And our team is 3 people"

**You'll die from a thousand cuts.**

### When to Spend Innovation Tokens

**Spend when:**
- It's your core competitive advantage
- Boring tech genuinely can't solve the problem
- Team has capacity to learn and maintain
- Benefits clearly outweigh costs
- You have tokens available

**Don't spend when:**
- "It's on my resume wishlist"
- "It's what Google uses"
- "It's trending on Twitter"
- "I'm bored with current stack"
- "It's 'best practice'" (according to who?)

**Be honest about your motivations.**

---

## The Golden Hammer Anti-Pattern

**"When you have a hammer, everything looks like a nail."**

In software: When you know one technology, you use it for everything.

### The Problem

**Mexican development context:**
- Everyone learns MERN stack (MongoDB, Express, React, Node)
- So every project becomes MERN
- Even when relational database would be better (e-commerce, billing)
- Even when server-side rendering would be simpler (marketing site)
- Even when Python would be more appropriate (data science)

**This is unconscious over-engineering.**

You're not choosing the best tool for the job. You're choosing the tool you know.

### Consequences

**Inappropriate technology:**
- Square peg, round hole
- Fighting the framework
- Workarounds and hacks

**Unnecessary complexity:**
- Using microservices when monolith would work
- Using NoSQL when relational is better fit
- Using SPA when SSR is simpler

**Poor long-term fit:**
- Hard to maintain
- Doesn't scale the way you need
- Team struggles

### How to Fight It

**1. Always ask: "Is this the right tool for this job?"**
- Not: "Can I use the tool I know?"
- But: "What does this problem actually need?"

**2. Separate familiarity from appropriateness**
- Familiar ≠ Appropriate
- Just because you know Kubernetes doesn't mean every project needs it

**3. Consider team context**
- Can the team maintain this?
- Is learning curve worth it?
- Do we have time to learn?

**4. Document why you chose it**
- If you can't justify beyond "I know this tech," reconsider
- Force yourself to articulate the reasoning
- Write an ADR (Week 9)

**5. Be okay with boring**
- PostgreSQL again? Maybe that's fine.
- Monolith again? Maybe that's appropriate.
- Same stack as last project? Could be the right choice.

**The goal isn't variety. The goal is appropriateness.**

---

## ATAM = UML Analogy

**My take on formal methods:**

"I've never known anyone who actually used UML in practice. C4 diagrams are basically UML drawn from memory: we kept the useful parts and lost the ceremony.

Same with ATAM (Architecture Tradeoff Analysis Method). It's a formal method from Carnegie Mellon with workshops, stakeholders, scenarios, evaluation trees.

Very thorough. Also very heavy.

**We're doing ATAM drawn from memory.** We're keeping:
- Quality attribute thinking
- Tradeoff analysis 
- Context awareness
- Stakeholder needs

We're losing:
- Multi-day workshops
- Formal documentation
- Complete stakeholder participation
- Utility trees and sensitivity analysis

**For most projects, ATAM-lite is enough.**

If you're building nuclear reactor control software or airplane flight systems, use full ATAM.

If you're building a customer portal for 3 users, use the principles from this handout.

**Extract value, lose ceremony.**"

---

## How to Use This Handout for Assignments

**When working on case studies:**

1. **Start with context questions** (page 8-11)
   - What's the business priority?
   - What's the actual scale?
   - What's the budget?
   - What's the timeline?
   - What can the team handle?
   - What's the risk tolerance?

2. **Identify which quality attributes matter most** (page 3-7)
   - Performance?
   - Scalability?
   - Availability?
   - Security?
   - Maintainability?

3. **Acknowledge the tradeoffs**
   - What are you optimizing for?
   - What are you sacrificing?
   - Is that tradeoff appropriate for this context?

4. **Consider team capability**
   - Can this team actually build this?
   - Can they maintain it?
   - Who's on-call when it breaks?

5. **Default to boring technology** 
   - Is there a simpler solution?
   - Do you need the complexity?
   - Can you justify the innovation?

**Your assignment answers should reference these frameworks.**

Example answer structure:
> "For this e-commerce scenario, I'd prioritize availability and performance (context question #1: business priority is revenue).
>
> The tradeoff is complexity - a simple monolith would be easier to build, but the high traffic requires horizontal scaling.
>
> However, given the team is 3 junior developers (context question #5: team capability), I'd start with a monolith and scale when proven necessary.
>
> This optimizes for development speed and maintainability over premature scalability."

**Notice:** Referenced context, quality attributes, tradeoffs, team capability. This is well-reasoned.

---

## Quick Reference Tables

### Quality Attributes Cheat Sheet

| Attribute | Question | When Critical | When Less Critical |
|-----------|----------|---------------|-------------------|
| **Performance** | How fast? | E-commerce, gaming, trading | Batch processing, reports |
| **Scalability** | How many users? | Viral products, proven growth | New startups, internal tools |
| **Availability** | How much uptime? | Revenue systems, medical | Dev environments, analytics |
| **Security** | How protected? | Payment, PII, medical | Public content, catalogs |
| **Maintainability** | How easy to change? | Long-lived systems, small teams | Prototypes, short-term projects |

### Common Tradeoffs Quick Reference

| If you optimize for... | You likely sacrifice... | Consider... |
|------------------------|------------------------|-------------|
| **Performance** | Simplicity, security, cost | Do you actually need <100ms? |
| **Scalability** | Simplicity, cost, development time | Do you have the scale yet? |
| **Availability** | Cost, complexity | Do you need five nines? |
| **Security** | Performance, UX, development time | How sensitive is the data? |
| **Development Speed** | Everything else | Are you shipping to learn? |

### Context Questions Quick Check

Business priority?  
Actual scale?  
Budget (money, time, people)?  
Timeline?  
Team capability?  
Risk tolerance?

**If you can't answer all six, you don't have enough context yet.**

---

## War Story: Project Mercury

**Learn from instructor's mistakes:**

**Project:** Customer portal for logistics company  
**Users:** 3 customers  
**Usage:** ~10 requests per month

**What we built:**
- 7 microservices
- Kubernetes cluster
- Event-driven architecture (RabbitMQ)
- Separate databases per service
- Complex CI/CD pipeline
- Full monitoring suite

**Time:** 3 months  
**Cost:** $500/month  
**Team:** 3 junior developers struggling to maintain it

**What we should have built:**
- Rails/Django monolith
- PostgreSQL
- Heroku deployment
- **Time:** 2 weeks
- **Cost:** $50/month
- **Team:** Could easily maintain

**What we optimized for:**
- Scalability for millions of users (we had 3)
- Team independence (we had 1 team of 3)
- Technology diversity (more complexity)

**What we actually needed:**
- Ship quickly
- Simple to maintain
- Low cost

**The lesson:** Context matters more than "best practices."

**Apply context questions to Mercury:**
1. Business priority? Ship fast → We took 3 months
2. Scale? 3 customers → Built for millions
3. Budget? Limited → Spent $500/month
4. Timeline? 1 month → Took 3 months
5. Team capability? 3 juniors → Complex distributed system
6. Risk tolerance? Can tolerate downtime → High-availability overkill

**We ignored every single context question.**

**When would microservices have made sense?**
- 50+ customers (not 3)
- Multiple teams (not 1)
- Proven scaling issues (not hypothetical)
- Budget for complexity (not shoestring)

**None of which we had.**

**Don't make this mistake. Build for actual needs, not imaginary future scale.**

---

## Remember

**Nobody knows everything.** You're not supposed to have all the answers. You're supposed to ask good questions and reason through tradeoffs.

**Context determines appropriateness.** There's no universal "best architecture." Only "best for this situation."

**Boring technology usually wins.** Choose reliability over novelty. Save innovation tokens for where they matter.

**Team capability is a quality attribute.** The best architecture on paper is useless if your team can't build it.

**You'll make mistakes.** Everyone does. Learn from them. That's how you get better.

---

Redis (Paper-Server Edition) | Week 3 | No expiration policy | Your personal architecture cache
