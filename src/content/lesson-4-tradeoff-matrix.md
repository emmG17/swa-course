# Template: Tradeoff Matrix
## Lesson 4 → AdBid

*Use this template to document your architecture decisions for AdBid.*

---

## Instructions

1. For each important architecture decision, complete one section of this matrix
2. You don't need to fill in EVERY cell — fill in what applies to your decision
3. The goal is to demonstrate you thought about alternatives, not that you memorized options
4. Minimum 3 decisions, maximum however many you actually need

---

## Decision 1: [Decision name]

*Example: "Database for auction records"*

### Context
*What problem are you solving? What constraints do you have?*

_____________________________________________

### Options considered

| Option | Brief description | Main strength | Main weakness |
|--------|------------------|---------------|---------------|
| Option A: | | | |
| Option B: | | | |
| Option C: | | | |

### Chosen decision
**We chose:** ______________________

### Justification for AdBid
*Why this option given the specific context (team, budget, scale):*

-
-
-

### Accepted tradeoffs

| We gain | We sacrifice |
|---------|-------------|
| | |
| | |

### Additional notes
*Are there conditions under which this decision would change? When to revisit?*

_____________________________________________

---

## Decision 2: [Decision name]

### Context

_____________________________________________

### Options considered

| Option | Brief description | Main strength | Main weakness |
|--------|------------------|---------------|---------------|
| Option A: | | | |
| Option B: | | | |
| Option C: | | | |

### Chosen decision
**We chose:** ______________________

### Justification for AdBid

-
-
-

### Accepted tradeoffs

| We gain | We sacrifice |
|---------|-------------|
| | |
| | |

### Additional notes

_____________________________________________

---

## Decision 3: [Decision name]

### Context

_____________________________________________

### Options considered

| Option | Brief description | Main strength | Main weakness |
|--------|------------------|---------------|---------------|
| Option A: | | | |
| Option B: | | | |

### Chosen decision
**We chose:** ______________________

### Justification for AdBid

-
-
-

### Accepted tradeoffs

| We gain | We sacrifice |
|---------|-------------|
| | |
| | |

---

## Decision 4 (optional): [Decision name]

### Context

_____________________________________________

### Options considered

| Option | Brief description | Main strength | Main weakness |
|--------|------------------|---------------|---------------|
| Option A: | | | |
| Option B: | | | |

### Chosen decision
**We chose:** ______________________

### Justification for AdBid

-
-

### Accepted tradeoffs

| We gain | We sacrifice |
|---------|-------------|
| | |

---

## Tradeoffs Summary

*A single-view table of your main decisions:*

| Decision | We chose | Instead of | We gain | We sacrifice |
|----------|----------|------------|---------|-------------|
| | | | | |
| | | | | |
| | | | | |
| | | | | |

---

## Anti-Golden-Hammer Reflection

**What technology or pattern was tempting to use but you decided not to?**

_____________________________________________

**Why was it not appropriate for AdBid's context?**

_____________________________________________

**How did you validate that your decisions are appropriate for this specific context?**

_____________________________________________

---

## Common Decision Examples for AdBid

*(These are inspiration — you're not required to make exactly these decisions)*

**Storage decisions:**
- "PostgreSQL or Redis for active auction state?"
- "How do we guarantee billing records aren't lost?"
- "One DB or multiple for different data types?"

**Communication decisions:**
- "How do we notify advertisers in < 80ms?"
- "Synchronous or asynchronous for auction registration?"
- "How do we handle the 100ms timeout from the client's perspective?"

**Scalability decisions:**
- "Do we design for 10M or 200M auctions/month from the start?"
- "Stateless from the beginning or can we simplify?"
- "Read replicas from the MVP or when we need them?"

**Availability decisions:**
- "What level of redundancy do we need with a 99.5% SLA?"
- "What do we do if the DB is down?"

