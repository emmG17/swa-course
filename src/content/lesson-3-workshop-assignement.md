# Lesson 3 Workshop: Architecture Context Matching

## Overview

You'll receive:
- **3 different architectures** (A, B, C) for a food delivery platform
- **3 different business contexts** (1, 2, 3) 
- **Your job:** Match each architecture to the context where it makes the most sense

**Time:** 25 minutes total
- 5 minutes: Read materials
- 20 minutes: Group discussion and analysis

---

## The Three Architectures

### Architecture A: "The Startup Hustle"

**Tech Stack:**
- Ruby on Rails monolith
- PostgreSQL database
- Redis for caching
- Sidekiq for background jobs
- Deployed on Heroku

**Structure:**
- Single codebase
- MVC architecture (Models, Views, Controllers)
- All features in one application
- Shared database

**Deployment:**
- Git push to deploy
- Automatic scaling (Heroku dynos)
- No orchestration needed
- Takes 2 minutes to deploy

**Team Requirements:**
- 2-3 developers can handle it
- Standard Rails knowledge
- Basic Postgres admin
- No DevOps expertise needed

**Cost:**
- Development: 2-4 weeks for MVP
- Infrastructure: $50-300/month depending on scale
- Maintenance: Low (familiar technology)

**Performance Profile:**
- Response time: 200-500ms typical
- Can handle: 100-1,000 requests/second (with caching)
- Scales vertically well up to certain point

**What it optimizes for:**
- Development speed
- Maintainability
- Low cost
- Simplicity

**What it sacrifices:**
- Extreme horizontal scalability
- Team independence (everyone works in same codebase)
- Technology diversity (one language, one framework)

**When it breaks down:**
- At truly massive scale (millions of concurrent users)
- When you need different scaling characteristics for different features
- When multiple teams need to deploy independently

---

### Architecture B: "The Scale Play"

**Tech Stack:**
- 7 microservices (User, Menu, Order, Payment, Delivery, Notification, Analytics)
- Kubernetes on AWS EKS for orchestration
- Event-driven architecture with Kafka
- Polyglot: Node.js, Python, Go (different services, different languages)
- PostgreSQL + MongoDB + Redis (different databases for different needs)
- gRPC for inter-service communication

**Structure:**
- Each service is independent
- Own database per service
- Async communication via events
- API Gateway for external requests

**Deployment:**
- Each service deploys independently
- CI/CD pipeline per service
- Kubernetes handles orchestration
- Blue-green deployments
- Takes 15-30 minutes to deploy one service

**Team Requirements:**
- 10-15 developers (1-2 per service)
- Kubernetes expertise required
- DevOps/SRE team needed
- Distributed systems knowledge essential

**Cost:**
- Development: 3-6 months for MVP
- Infrastructure: $2,000-15,000/month
- Maintenance: High (complex operations)

**Performance Profile:**
- Response time: 100-300ms (with overhead from service calls)
- Can handle: Millions of requests/second
- Scales horizontally without limits

**What it optimizes for:**
- Extreme scalability
- Team independence (each team owns a service)
- Fault isolation (one service down doesn't crash everything)
- Different scaling per service

**What it sacrifices:**
- Simplicity (many moving parts)
- Development speed (complex to build initially)
- Operational simplicity (Kubernetes is hard)
- Cost (expensive infrastructure and team)

**When it shines:**
- Millions of users
- Multiple independent teams
- Different scaling needs per feature
- Need to deploy features independently

**When it's overkill:**
- Small user base
- Small team
- Limited budget
- Need to ship fast

---

### Architecture C: "The Hybrid"

**Tech Stack:**
- Django monolith (modular design with clear boundaries)
- PostgreSQL primary database
- 3 read replicas for query performance
- Redis for caching and session storage
- RabbitMQ for async processing
- Deployed on AWS EC2 with Auto Scaling Group

**Structure:**
- Single codebase but well-organized modules
- Clear separation between components
- Some async processing via message queue
- Read-write splitting for database

**Deployment:**
- Standard deployment pipeline
- Blue-green deployments
- Auto-scaling based on load
- Takes 5-10 minutes to deploy

**Team Requirements:**
- 5-8 developers
- Django/Python knowledge
- Some AWS experience helpful
- Basic database optimization skills

**Cost:**
- Development: 1-2 months for MVP
- Infrastructure: $800-2,500/month
- Maintenance: Moderate

**Performance Profile:**
- Response time: 150-400ms
- Can handle: 5,000-50,000 requests/second
- Scales well horizontally (stateless app servers)

**What it optimizes for:**
- Balance between simplicity and scale
- Maintainability with room to grow
- Read-heavy workload optimization (replicas)
- Gradual evolution path

**What it sacrifices:**
- Not as simple as Architecture A
- Not as scalable as Architecture B
- Middle ground = tradeoffs on both sides

**When it shines:**
- Growing companies (1K-100K users)
- Teams outgrowing simple architecture but not ready for microservices
- Budget for some infrastructure but not unlimited
- Need to scale gradually

**When it's wrong:**
- Very small scale (Architecture A is simpler)
- Massive scale (Architecture B scales better)
- Very tight budget (Architecture A is cheaper)

---

## The Three Business Contexts

### Context 1: Seed-Stage Startup

**Company:** FreshBite (new food delivery startup)

**Current State:**
- Launched 2 months ago
- 0 customers currently (starting from scratch)
- Seed funding: $100K
- Runway: 6 months

**Team:**
- 3 developers (2 backend, 1 frontend)
- 1 founder (non-technical)
- All developers are junior-to-mid level
- No DevOps experience on team

**Business Goals:**
- Get to market FAST (need to show investors traction)
- Start with one city (local validation)
- Ship MVP in 1-2 months
- Learn from users and iterate quickly

**Scale Expectations:**
- **Realistic:** 50-100 orders/day in first 3 months
- **Optimistic:** 500 orders/day by month 6
- **Founder's dream:** "We'll be like Uber Eats!" (unrealistic in 6 months)

**Budget:**
- Infrastructure: $500/month max
- Every dollar counts (cash runway limited)
- Need to minimize burn rate

**Risk Tolerance:**
- Can afford some downtime (not processing payments yet)
- Need to ship fast > need to be perfect
- Can manually fix bugs (small user base)

**Key Constraints:**
- Time: 1-2 months to MVP
- Money: Very limited
- Team: Small, junior, no ops experience
- Must ship to learn, iterate based on feedback

**Success Metrics:**
- Get first 100 customers
- Process first 1,000 orders
- Prove product-market fit
- Raise Series A based on traction

---

### Context 2: Funded Growth Stage

**Company:** DineRush (established 2 years ago, now scaling)

**Current State:**
- Series B funded ($10M)
- 50,000 active users across 3 cities
- Processing 15,000 orders/day
- Growing 20% month-over-month
- Proven product-market fit

**Team:**
- 15 developers (5 backend, 5 frontend, 5 mobile)
- 2 DevOps/SRE engineers
- Mix of senior and mid-level developers
- Hiring aggressively

**Business Goals:**
- Scale to 10 cities in next 6 months
- Grow to 500,000 active users
- Compete with established players
- Prepare for potential IPO path

**Scale Expectations:**
- Current: 15,000 orders/day
- 6 months: 100,000 orders/day
- Peak loads: 3x normal (dinner rush, promotions)
- Need to handle 300,000 orders/day at peaks

**Budget:**
- Infrastructure: $10,000/month (can increase as needed)
- Money available for proper tooling/services
- Investors expect growth, budget is secondary

**Risk Tolerance:**
- Low tolerance for downtime (paying customers now)
- Outages = lost revenue and reputation damage
- Need high availability (target 99.9%)
- Cannot afford to lose orders

**Team Structure:**
- Moving to multiple teams
- Teams stepping on each other in monolith
- Need to ship features independently
- Growing pains from scaling team

**Key Constraints:**
- Time: 6 months to scale infrastructure
- Need: Independent team deployment
- Scale: Must handle 10x growth
- Availability: Can't afford downtime

**Success Metrics:**
- 99.9% uptime
- Handle 300K orders/day at peak
- Multiple teams shipping independently
- <200ms average response time

---

### Context 3: Profitable Scale-Up

**Company:** QuickEats (established 4 years ago, profitable)

**Current State:**
- Bootstrapped (no VC funding)
- 10,000 regular customers in 2 cities
- Processing 3,000 orders/day consistently
- Profitable for last year
- Steady, sustainable growth

**Team:**
- 8 developers (full-stack)
- 1 DevOps engineer (part-time contractor)
- Senior team (average 7 years experience)
- Low turnover, stable team

**Business Goals:**
- Maintain profitability
- Grow sustainably (not chasing hypergrowth)
- Add 1 new city per year
- Focus on operational excellence

**Scale Expectations:**
- Current: 3,000 orders/day
- 1 year: 6,000 orders/day (steady growth)
- 3 years: Maybe 10,000-15,000 orders/day
- No hockey-stick growth expected

**Budget:**
- Infrastructure: $3,000/month comfortable
- Profitable, so can invest in good tools
- But cost-conscious (no VC funding)
- Need good ROI on infrastructure spend

**Risk Tolerance:**
- Moderate tolerance
- 99% uptime acceptable (not mission critical)
- Manual fixes okay for now (small scale)
- Quality over speed

**Team Situation:**
- Current architecture getting messy
- Time to refactor before it becomes painful
- Team has capacity for some complexity
- But doesn't want to over-engineer

**Key Constraints:**
- Cost: Must maintain profitability
- Team: Only 8 developers, all full-stack
- Growth: Steady, not explosive
- Need: Clean architecture that can grow gradually

**Success Metrics:**
- Maintain profitability
- 99% uptime
- Clean codebase team enjoys working in
- Handle 10K orders/day comfortably
- Add features without pain

---

## Analysis Worksheet

Use this to document your thinking:

### Architecture A → Context ___

**Why this match makes sense:**
- Quality attributes this architecture provides:
  - 
  - 
  - 

- Context needs that these address:
  - 
  - 
  - 

- Tradeoffs that are acceptable:
  - 
  - 

**Why this match could be wrong:**
- Risks:
  - 
  - 

---

### Architecture B → Context ___

**Why this match makes sense:**
- Quality attributes this architecture provides:
  - 
  - 
  - 

- Context needs that these address:
  - 
  - 
  - 

- Tradeoffs that are acceptable:
  - 
  - 

**Why this match could be wrong:**
- Risks:
  - 
  - 

---

### Architecture C → Context ___

**Why this match makes sense:**
- Quality attributes this architecture provides:
  - 
  - 
  - 

- Context needs that these address:
  - 
  - 
  - 

- Tradeoffs that are acceptable:
  - 
  - 

**Why this match could be wrong:**
- Risks:
  - 
  - 

---

## Discussion Questions

Use these to guide your group discussion:

**For each architecture-context pairing, ask:**

1. **What does this context actually need?**
   - What's the business priority?
   - What's the actual scale?
   - What's the budget?
   - What's the timeline?
   - What can the team handle?

2. **What does this architecture optimize for?**
   - Which quality attributes?
   - At what cost (what's sacrificed)?

3. **Is this a good match?**
   - Do the optimizations align with needs?
   - Are the sacrifices acceptable?
   - Could the team actually build and maintain this?

4. **What would break first?**
   - If you chose wrong, what fails?
   - Is that failure acceptable or catastrophic?

5. **What's the alternative argument?**
   - Why might someone choose differently?
   - What are they prioritizing?

---

## Hints (Don't Read Until You're Stuck!)

<details>
<summary>Hint for Context 1 (Seed Startup)</summary>

**Think about:**
- They have 2 months and 3 junior developers
- They need to ship and learn fast
- They have almost no budget
- Which architecture can they actually build in time?
- Which can they actually operate with their team?

**Key question:** Can 3 junior devs with no DevOps experience handle Architecture B (microservices + Kubernetes)?

</details>

<details>
<summary>Hint for Context 2 (Funded Growth)</summary>

**Think about:**
- They're scaling 10x in 6 months
- Multiple teams need to ship independently
- They have the budget and team size
- Current architecture is causing team conflicts
- Which architecture supports independent teams?

**Key question:** Do they need the complexity of Architecture B, or would Architecture C handle their scale?

</details>

<details>
<summary>Hint for Context 3 (Profitable Scale-Up)</summary>

**Think about:**
- Steady, sustainable growth (not hypergrowth)
- Need to stay profitable
- Want to refactor but not over-engineer
- 8 developers, senior team
- Which architecture is right-sized for their situation?

**Key question:** Is Architecture A too simple for their growth, or Architecture B too complex?

</details>

---

## What We're Looking For

**Not looking for:**
- The "right" answer (there isn't one)
- Perfect technical knowledge
- Fancy terminology

**Looking for:**
- Context-aware thinking
- Understanding of tradeoffs
- Consideration of team capabilities
- Business-aware reasoning
- Acknowledgment of uncertainty

**Good reasoning sounds like:**
> "We chose Architecture A for Context 1 because the team is small and needs to ship fast. Microservices would slow them down and they don't have the ops expertise. The tradeoff is they'll need to refactor when they scale, but that's acceptable because they need to prove product-market fit first."

**Poor reasoning sounds like:**
> "We chose Architecture B because microservices are best practice."

---

## After the Workshop

**Reflect on:**
- Was there consensus in your group?
- Where did you disagree?
- What assumptions drove your decisions?
- How did team capability factor in?
- Did you consider all six context questions?

**Remember:**
Architecture is about making good tradeoffs for your specific context, not following universal "best practices."

There's no universally "best" architecture. Only "best for this situation."
