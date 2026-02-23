# AdBid — Integration Case Study

## Business Context

**AdBid** is a Mexican real-time bidding (RTB) platform for digital advertising. It allows advertisers to automatically compete for ad spaces on partner websites.

### How the business works

When a user visits an AdBid partner website, the following process happens in **less than 100 milliseconds**:

1. The site sends an auction request to AdBid with context: user profile, ad size, page URL
2. AdBid notifies all registered advertisers that a space is available
3. Advertisers have 80ms to respond with their bid (in MXN pesos)
4. AdBid determines the winner (highest bid)
5. The winning ad is shown to the user

**All of this in less than 100ms. Every time. For every user on every page.**

### The business opportunity

The founding team has three confirmed initial clients:
- **El Financiero** (financial news site) — 2 million visits/month
- **Linio MX** (e-commerce) — 5 million visits/month
- **A regional cinema chain** — 500,000 visits/month

With these three clients, the initial volume is **~7.5 million auctions per month** (not every visit generates an auction).

### Projected growth

The founders project:
- **Year 1:** 3-5 clients, ~10 million auctions/month
- **Year 2:** 10-15 clients, ~50 million auctions/month
- **Year 3:** 30+ clients, ~200 million auctions/month

*Note: These are business projections, not necessarily what should drive the initial architecture.*

## System Requirements

### Functional Requirements

**Core business:**
1. Receive auction requests from partner websites
2. Notify eligible advertisers about available auctions
3. Receive and process bids from advertisers
4. Determine winner and return winning ad information
5. Record each auction result for billing

**Advertiser management:**
6. Advertisers register campaigns with: daily/monthly budget, targeting (keywords, geography, demographics)
7. Advertisers can view campaign performance (impressions, clicks, spend)
8. Automatic budget control: pause campaign when daily budget is exhausted

**Partner site management:**
9. Sites register and receive a JavaScript snippet to integrate
10. Sites can view their revenue and statistics

**Billing:**
11. Calculate charges to advertisers (based on won auctions)
12. Calculate payments to partner sites (90% of what was charged to the advertiser)
13. Generate monthly billing reports

### Non-Functional Requirements — The ones that matter most

**Latency (CRITICAL)**
- Response to an auction request must be < 100ms at the 95th percentile
- If AdBid doesn't respond within 100ms, the site shows a fallback ad (no charge)
- *Implication: this is the hardest requirement to meet*

**Availability**
- 99.5% minimum uptime (the team doesn't have 24/7 ops yet)
- Downtime during overnight hours (1am-7am) is acceptable with prior notice
- *99.5% = maximum ~44 hours of downtime per year*

**Financial accuracy**
- Every won auction MUST be recorded for billing
- Up to 5 minutes of delay in recording is acceptable, but no data loss
- *The business depends on this — not a single transaction can be lost*

**Security**
- Advertisers cannot see competitors' bids (sealed auction)
- APIs must be authenticated (sites and advertisers use API keys)
- Budgets must be accurate (don't exceed daily budget by more than 10%)

**Scalability**
- System must handle current volume with headroom to triple it
- Spikes: some days (Black Friday, major soccer matches) volume can double for hours

### Team and context constraints

**The team:**
- 4 developers: 1 senior backend, 2 mid-level, 1 junior
- The senior has experience with high-frequency APIs but not RTB specifically
- The team knows: Node.js, PostgreSQL, basic Redis, Docker
- Nobody has experience with Kafka or complex messaging systems

**Infrastructure budget:**
- Phase 1 (first 6 months): maximum $3,000 USD/month
- Phase 2 (6-18 months): up to $8,000 USD/month
- The business needs to be profitable before it can be elegant

**Timeline:**
- Working MVP with the 3 initial clients: 3 months
- Complete system with reporting and management: 6 months

---

## Your Deliverable

You'll design the architecture for AdBid. A perfect system is not expected — an **appropriate system for the context** is.

### What you must deliver

#### 1. Quality Attribute Analysis

For AdBid, document:
- **Latency**: What is the concrete scenario? How much time does each component have?
- **Availability**: What does 99.5% mean in practical terms for this system?
- **Financial reliability**: How do you guarantee no transaction is lost?
- **Scalability**: What scenario are you designing for? Day 1 or Year 3?
- **Security**: What threats are real for AdBid?

Format: Quality attribute table with concrete scenarios (stimulus-response format from the Lesson 2 handout).

#### 2. Tactic Decisions with Reasoning

For at least **4 important technical decisions**, document:
- The decision (what did you choose?)
- Alternatives you considered
- **Why this option for AdBid's context**
- Accepted tradeoffs

Suggested decisions to consider (not mandatory, just starting points):
- How do you handle the 100ms time limit? What happens if it's not met?
- How do you guarantee billing records aren't lost?
- How do you control that an advertiser doesn't exceed their daily budget?
- How do you manage "auction in progress" state?
- What database(s) do you use and why?

#### 3. Architecture Diagram

A diagram showing:
- The main components of the system
- How an auction flows from start to finish
- How billing recording flows

Use Mermaid (the handout has examples). It doesn't need to be perfect — it needs to be understandable.

```mermaid
flowchart LR
    A[Website] --> B[AdBid API]
    B --> C[???]
    C --> D[???]
    D --> E[Advertiser]
```

*This is your starting point. Complete it.*

#### 4. 3-5 ADRs

Using the template from the Lesson 4 handout. Each ADR must:
- Identify a real decision
- Show that you considered alternatives
- Justify the decision using AdBid's context (team, budget, timeline)
- Not assume unlimited team or infinite budget

#### 5. Anti-Golden-Hammer Justification

An explicit section where you answer:
- Was there any technology or pattern you were tempted to use but decided not to? Why?
- How did you validate that your decisions are appropriate for the context and not just "what you know"?

---

## Resources

### To use while working

- 📚 **Lesson 3 handout** — Quality Attributes and Tradeoffs (your analysis framework)
- 📚 **Lesson 4 handout** — Architectural Tactics (your menu of options)
- 📋 **ADR template** (in the Lesson 4 handout)
- 📊 **Tradeoff matrix template** (separate file)

### Optional but useful reading

- [RTB Process Overview](https://www.iab.com/guidelines/real-time-bidding-rtb-project/) — IAB explains how RTB works in the industry
- [Latency Numbers Every Programmer Should Know](https://gist.github.com/jboner/2841832) — to understand real-world timings
- [PostgreSQL vs Redis for Queues](https://adriano.fyi/posts/2023-09-24-choose-postgres/) — for the queue decision

---

## FAQ

**What level of detail is expected in the diagram?**
A "Container" level C4 model diagram is fine. You don't need to detail code. You do need to show the main services/components and how they connect.

**Can I use Kubernetes / full microservices?**
You can, but you must justify it with context. Can a team of 4 people operate Kubernetes in a 3-month MVP with a $3,000/month budget? If your answer is "yes, because...," convince me.

**Does the system need to be perfect for Year 3?**
No. Design for the current context with the ability to evolve. What you must NOT do is design for Year 3 if the current context doesn't justify it.

**What about requirements I don't cover?**
Document it. "I decided not to solve X in this version because Y" is a valid and honest answer. Architects always prioritize.

**Can I use Claude or other AIs to help?**
Yes — AI use is allowed and encouraged. But you must be able to explain and defend everything you submit. If you don't understand something the AI generated, don't include it.

---

## A final note

This project doesn't have a single correct answer. Two completely different architectures can be equally valid if both are well-justified for the context.

What does have a wrong answer is an architecture that ignores the context — the real budget, the real team capabilities, the real scale.

When in doubt between simplicity and sophistication: if you have to doubt, choose simplicity. You can add complexity when the problem demands it. Not before.

**Good luck. And start early.**
