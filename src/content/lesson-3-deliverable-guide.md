# Lesson 3 Assignment: Tradeoff Analysis

## Overview

This assignment tests your ability to analyze architectural tradeoffs and evaluate whether decisions are appropriate for a given context.

**You'll analyze three scenarios.** Each scenario presents an architecture decision that optimizes for certain quality attributes while sacrificing others.

**Your job:** Evaluate whether each tradeoff is appropriate for that specific context.

**Key point:** This is NOT about right vs wrong. It's about the quality of your reasoning.

Two students can reach opposite conclusions and both earn full marks if their reasoning is sound and well-justified.


## What You're Being Graded On

**NOT graded:**
- Whether you agree with the instructor
- Perfect formatting or technical jargon
- Length (quality > quantity)

**ARE graded:**
- Understanding that tradeoffs exist
- Context-aware thinking
- Quality of reasoning
- Consideration of alternatives

## The Three Scenarios

### Scenario 1: E-Commerce Synchronous Checkout

**Context:**

**Company:** MexiMart, mid-size online retailer  
**Scale:** 10,000 orders per day  
**Team:** 5 developers, 2 years experience average  
**Tech Stack:** Node.js/Express monolith, PostgreSQL, deployed on AWS

**Current Architecture Decision:**

The checkout process is implemented **synchronously** with all operations in sequence:

```
1. Check inventory → 
2. Charge payment (Stripe API) → 
3. Create shipping label (ShipStation API) → 
4. Calculate tax (TaxJar API) → 
5. Create order record in database → 
6. Return success to user
```

**Characteristics:**
- All operations must succeed or entire checkout fails
- User waits 2-3 seconds on average during checkout
- If any external API is slow, entire checkout is slow
- If payment service times out, shipping label is never created
- No queueing, no async processing, no retry logic
- When it works, it works perfectly - data is always consistent

**Trade-offs:**

**What this optimizes for:**
- **Consistency**: Data is always correct, no orphaned records
- **Simplicity**: Straightforward code, easy to understand
- **Immediate feedback**: User knows right away if order succeeded

**What this sacrifices:**
- **Availability**: If Stripe is down, no one can check out
- **Performance**: User waits for all API calls sequentially
- **Resilience**: One slow service makes everything slow

**Your Task:**

Is this the right tradeoff for MexiMart's context? Analyze:

1. What quality attributes matter most for e-commerce checkout?
2. Is 2-3 second checkout acceptable or problematic?
3. What happens if Stripe has an outage (happens 2-3 times/year)?
4. Could this team build a more resilient alternative?
5. What would be the cost of adding async processing + retry logic?
6. Is the consistency benefit worth the availability/performance cost?

**Write 1 page analyzing whether this synchronous approach is appropriate.**

---

### Scenario 2: Social Media Aggressive Caching

**Context:**

**Company:** Amigos, Mexican social network startup  
**Scale:** 50,000 active users, seed-funded  
**Team:** 3 developers (2 backend, 1 frontend)  
**Tech Stack:** Python/Django, PostgreSQL, Redis, Heroku

**Current Architecture Decision:**

User feeds are **aggressively cached** in Redis:

```
- When user posts: Post saved to DB immediately
- Feed generation: Runs every 5 minutes via cron job
- Feed storage: Cached in Redis for 5 minutes
- User requests feed: Returns cached version

Result: Posts can take up to 5 minutes to appear in followers' feeds
```

**Characteristics:**
- Feed requests are blazing fast (<50ms response time)
- System can handle 10,000+ requests/second (mostly cache hits)
- Infrastructure cost: $300/month (would be $2,000+ for real-time)
- User experience: "Where did my post go?" for first 5 minutes
- Scales incredibly well, very cheap to run

**Trade-offs:**

**What this optimizes for:**
- **Performance**: Sub-50ms response times
- **Scalability**: Can handle massive traffic spikes
- **Cost**: Very cheap infrastructure

**What this sacrifices:**
- **Freshness**: Up to 5-minute delay for posts to appear
- **User experience**: Confusing for users ("did my post work?")
- **Real-time feel**: Not suitable for time-sensitive content

**Your Task:**

Is this aggressive caching appropriate for Amigos' context? Analyze:

1. How important is real-time content for social media?
2. Would 5-minute delay hurt user engagement/growth?
3. Is the performance benefit worth the freshness cost?
4. Does the team have resources to build real-time solution?
5. At 50K users, do they actually need to handle 10K requests/sec?
6. What's the cost of going real-time vs staying with caching?

**Consider:**
- Instagram went years with refresh-to-see-new-content model
- Twitter originally had "refresh to see tweets" before real-time
- But modern users expect instant updates

**Write 1 page analyzing whether this caching strategy is appropriate.**

---

### Scenario 3: Healthcare On-Premise Infrastructure

**Context:**

**Company:** SaludTech, healthcare appointment system  
**Scale:** 50,000 appointments/month across 5 hospitals  
**Team:** 8 developers, 2 IT administrators  
**Compliance:** HIPAA required (US healthcare privacy law)

**Current Architecture Decision:**

All infrastructure is **on-premise** (servers physically in hospital data centers):

```
- Physical servers in each hospital's secure room
- Database replicated across locations
- VPN connections between hospitals
- IT staff manages servers, backups, security
- No cloud services (no AWS, no Azure, no GCP)
```

**Characteristics:**
- Complete control over data (never leaves hospital network)
- IT staff must maintain physical servers
- Cost: ~$15,000/month (servers, power, cooling, IT staff time)
- Cloud alternative would cost: ~$3,000/month
- Scaling requires buying/installing new hardware (weeks)
- HIPAA compliance is straightforward (data never leaves premises)

**Trade-offs:**

**What this optimizes for:**
- **Security/Compliance**: Complete data control, easy HIPAA compliance
- **Regulatory simplicity**: No cloud provider contracts/audits
- **Data sovereignty**: Data never leaves Mexico

**What this sacrifices:**
- **Cost**: 5x more expensive than cloud
- **Flexibility**: Can't scale up/down quickly
- **Disaster recovery**: Limited compared to cloud
- **Developer experience**: Harder to deploy, test, iterate

**Your Task:**

Is on-premise infrastructure appropriate for SaludTech? Analyze:

1. How critical is data control for healthcare?
2. Is HIPAA compliance actually harder in the cloud? (Many healthcare companies use AWS)
3. Is 5x cost justified by the benefits?
4. Could they use cloud WITH proper security controls?
5. What's the risk if they need to scale quickly?
6. Is this decision driven by actual requirements or fear?

**Consider:**
- Many US hospitals use AWS/Azure with HIPAA compliance
- Cloud providers have HIPAA-compliant offerings
- But some organizations prefer complete control
- Regulatory audits may be simpler with on-premise

**Write 1 page analyzing whether on-premise is the right choice.**

---

## Submission Format

### Structure Your Analysis

For each scenario, include:

**1. Executive Summary (2-3 sentences)**
- Brief statement of your conclusion
- Example: "The synchronous checkout is inappropriate for MexiMart's scale because..."

**2. Quality Attribute Analysis**
- What attributes does this decision optimize for?
- What attributes does it sacrifice?
- Are these the right priorities for this context?

**3. Context Evaluation**
- Apply the six context questions (from Week 3 handout)
- Business priority, scale, budget, timeline, team capability, risk tolerance
- How does this decision fit the specific context?

**4. Alternative Consideration**
- What else could they do?
- What would that alternative optimize for?
- Why might they choose current approach over alternative?

**5. Recommendation**
- Is this decision appropriate? Why or why not?
- If inappropriate, what would you change?
- If appropriate, under what conditions might it become inappropriate?

---

## Example Analysis (Good vs Bad)

### Bad Example:

> "The synchronous checkout is bad because it's slow and if Stripe goes down everything breaks. They should use async processing with queues because that's best practice. Microservices would also help with scalability."

**Why this is bad:**
- No context consideration
- Doesn't analyze tradeoffs
- Appeals to "best practice" without justification
- Suggests complex solutions without considering team capability
- No acknowledgment of what current approach does well

---

### Good Example:

> "The synchronous checkout is appropriate for MexiMart's current context, though it may need to evolve.
>
> **Quality Attributes:** This optimizes for data consistency and code simplicity at the cost of availability and resilience. For e-commerce, consistency is critical - you can't charge someone without creating the order record.
> **Context Fit:** At 10K orders/day with a 5-person team, this is reasonable. The team can likely understand and maintain synchronous code better than async + queuing systems. The 2-3 second checkout is acceptable for non-peak traffic.
> **However**, the availability risk is concerning. If Stripe has an outage (2-3 times/year), the entire checkout fails. For those hours, they process zero orders and lose revenue.
> **Recommendation:** This is appropriate now, but they should plan to add retry logic and graceful degradation within 6 months. Not full async architecture (too complex for team), but at least retry failed API calls before failing the checkout. This gives better availability without sacrificing their consistency guarantee or overwhelming the team with complexity."

**Why this is good:**
- Analyzes both benefits and costs
- Considers the specific context (team size, scale)
- Recognizes the decision is contextual, not universal
- Suggests evolution path appropriate to team capability
- Acknowledges tradeoffs are acceptable for now but may change


## Common Pitfalls to Avoid

**Don't:**
- Say "this is always bad" without considering context
- Recommend complex solutions without considering team capability
- Ignore business needs in favor of technical elegance
- Assume scale that doesn't exist ("when they have millions of users...")
- Cite "best practices" without justification

**Do:**
- Consider the specific business context
- Acknowledge what the current approach does well
- Recognize tradeoffs may be acceptable for now
- Think about team capability to implement alternatives
- Provide reasoning, not just opinions

---

## Submission Checklist

Before submitting, verify:

- [ ] Analyzed all three scenarios
- [ ] Each analysis is ~1 page (2-3 pages total)
- [ ] Identified quality attributes being optimized
- [ ] Identified what's being sacrificed
- [ ] Evaluated appropriateness for specific context
- [ ] Considered team capability
- [ ] Acknowledged tradeoffs and alternatives
- [ ] Clear writing, well-organized
- [ ] Submitted via GitHub Classroom as PDF or Markdown
- [ ] Filename: `week3-tradeoff-analysis-[yourname].pdf/md`


## Tips for Success

**Use your resources:**
- Week 3 student handout (Redis Paper-Server Edition)
- Context questions framework
- Quality attributes reference
- Workshop notes

**Think like an architect:**
- Context determines appropriateness
- No universal "best" solutions
- Every decision has tradeoffs
- Team capability matters
- Business needs > technical elegance

**Write clearly:**
- State your conclusion upfront
- Support with reasoning
- Acknowledge uncertainty
- Be concise

**Remember:**
This is an architecture thinking exercise. You're learning to reason about tradeoffs in context, not memorizing "right answers."


## Academic Integrity

**Collaboration:**
- Discussing scenarios with classmates
- Sharing perspectives on tradeoffs
- Asking clarifying questions

**Not allowed:**
- Copying someone else's analysis
- Submitting AI-generated content without understanding
- Sharing your written analysis before deadline

**Using AI:**
- You can use AI tools (ChatGPT, Claude, etc.) to help think through scenarios
- But you must understand and be able to explain your reasoning
- The analysis must reflect YOUR thinking

If you use AI to help brainstorm, note it in your submission: "I discussed these scenarios with Claude AI to help organize my thoughts. We won't judge you for using AI, but you should be able to explain your reasoning in your own words."

