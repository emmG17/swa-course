# Interview Question Starter List
## For Requirements Elicitation Workshop

**Purpose:** This is a scaffold to help you structure your stakeholder interview. You don't have to use all these questions—pick the ones that make sense for the conversation flow. Think of this as training wheels; remove them once you get comfortable!

## Opening Questions (Start Here)

**Goal:** Understand the business context and high-level goals

- "Can you tell me about the problem you're trying to solve?"
- "What does success look like for this project?"
- "Who are the end users, and what do they need?"
- "What's your biggest fear about this project—what keeps you up at night?"
- "If we launched today, what would be missing?"

## Stakeholder Identification

**Goal:** Uncover hidden stakeholders

- "Who else cares about this system succeeding?"
- "Who can say 'no' to launching this?"
- "Who will maintain this system once it's live?"
- "Are there any regulatory or compliance teams we should talk to?"
- "Who handles customer support? Operations?"
- "What external partners or integrations are involved?"

## Performance Questions

**Goal:** Turn "fast" into measurable requirements

- "When you say 'fast,' what does that mean specifically?"
  - **Follow-up:** "Can you give me a number? Seconds? Milliseconds?"
- "What's the user doing when speed matters most?"
- "How fast is your current process/system?"
- "What happens if the response takes 5 seconds? 10 seconds?"
- "What percentage of requests need to be this fast—all of them or most of them?"

**Example transformation:**
- Vague: "It should be fast"
- Specific: "When a user searches for a restaurant, results should appear within 200ms for 95% of requests"

## Scalability Questions

**Goal:** Understand real growth expectations

- "How many users do you expect at launch?"
- "How many users in 6 months? 1 year? 3 years?"
- "What's driving that growth? Is it realistic?"
- "What's the peak usage time? (e.g., lunch rush, payday)"
- "How many transactions per second do you expect?"
- "What happens if you get featured on TV or social media—can the system handle sudden spikes?"

**Watch out for:**
- Unrealistic hockey-stick growth projections
- Vague "we'll scale later" handwaving

## Security Questions

**Goal:** Identify real threats and compliance needs

- "What data does this system handle?"
- "What's the worst thing that could happen if security fails?"
- "Who are you protecting the data from? (external hackers, malicious insiders, competitors)"
- "Are there any regulations we need to comply with? (HIPAA, GDPR, PCI-DSS, Mexican data protection laws)"
- "What happens if customer data leaks?"
- "Do you need audit trails? Who audits you?"

**Example transformation:**
- Vague: "It needs to be secure"
- Specific: "When an attacker attempts SQL injection, the system should reject the input, log the attempt, and not expose sensitive error messages"

## Availability & Reliability Questions

**Goal:** Define acceptable downtime and failure scenarios

- "Can this system ever go down? When?"
- "What's the cost of 1 hour of downtime? 1 day?"
- "What time of day is most critical? (e.g., dinner rush for food delivery)"
- "How quickly do we need to recover from failures?"
- "What's acceptable: 99% uptime? 99.9%? 99.99%?"
  - **Note:** Each "9" costs exponentially more!
- "What happens when a server crashes during peak hours?"

**Example transformation:**
- Vague: "High availability"
- Specific: "When a server fails during dinner rush (6-9 PM), the system should failover within 30 seconds with no data loss"

## Maintainability & Operations Questions

**Goal:** Understand who maintains this long-term

- "Who will be responsible for maintaining this system?"
- "What's their technical skill level?"
- "How often do you expect to make changes?"
- "How quickly do you need to deploy bug fixes?"
- "Do you have a DevOps team? Monitoring tools?"
- "What happens when something breaks at 3 AM—who gets the call?"

## Usability Questions

**Goal:** Understand user expectations and constraints

- "Who are your users? What's their technical skill level?"
- "What devices will they use? (desktop, mobile, tablet)"
- "What browsers do they use?"
- "Do they have reliable internet? What about offline scenarios?"
- "How much training will they need?"
- "What's their tolerance for complexity?"

## Budget & Timeline Questions

**Goal:** Uncover realistic constraints

- "What's your budget for infrastructure?"
- "What's your budget for development?"
- "When do you absolutely need to launch?"
  - **Follow-up:** "What happens if we miss that date?"
- "Is this a hard deadline or aspirational?"
- "What can we cut if we run out of time or money?"

## Integration Questions

**Goal:** Identify external dependencies

- "What existing systems does this need to connect to?"
- "Do those systems have APIs? Are they documented?"
- "What's their uptime and performance like?"
- "Who owns those systems—can we change them if needed?"
- "What happens if an external service goes down?"

## Prioritization Questions

**Goal:** Force hard choices between conflicting requirements

- "If you could only launch with 3 features, which would they be?"
- "What's more important: launching fast or getting it perfect?"
- "What's more important: lots of features or rock-solid reliability?"
- "What's more important: low cost or high performance?"
- "If we have to choose between X and Y, which matters more?"

**Technique:** Create forced choices to reveal true priorities.

## The "5 Whys" Technique

**Goal:** Uncover root needs, not surface requests

**How to use it:**
1. Start with their stated requirement
2. Ask "why" that's important
3. For their answer, ask "why" again
4. Repeat 3-5 times until you hit the root cause
5. Check if the real need is different from the original request

**Example:**
- "We need real-time notifications"
- **Why?** "So users know when their order is ready"
- **Why is that important?** "So they don't wait unnecessarily"
- **Why is waiting a problem?** "Our restaurant partners complain about food getting cold"
- **Why does it get cold?** "Pickup time estimates are inaccurate"
- **Real need uncovered:** Better time estimation, not necessarily real-time notifications!

**Caution:** Don't be annoying. Use judgment. Sometimes 2-3 whys are enough.

## Red Flag Questions

**Goal:** Smoke out dangerous assumptions

- "What are you assuming that might not be true?"
- "What could cause this project to fail?"
- "What don't you know yet?"
- "What questions should I be asking that I'm not?"
- "What's the scariest part of this project for you?"

## Assumptions & Constraints Questions

**Goal:** Document the boundaries

**For Assumptions:**
- "Are you assuming users have smartphones? Internet access?"
- "Are you assuming restaurants can integrate easily?"
- "Are you assuming there are no regulations?"
- "What happens if that assumption is wrong?"

**For Constraints:**
- "What can't we change? (technology, integrations, team size)"
- "What's non-negotiable?"
- "What would cause you to cancel the project?"

## Advanced Techniques

### **Scenario-Based Questions**
Instead of asking "What do you need?", paint a picture:

- "Imagine it's dinner rush and your top restaurant's tablet crashes. Walk me through what should happen."
- "Imagine we launch and go viral overnight—10x more users than expected. What happens?"
- "Imagine a customer's credit card is charged twice. Who handles that?"

### **Challenge Assumptions (Gently)**
When they say something unrealistic:

- ❌ Don't say: "That's impossible"
- ✅ Do say: "That's interesting! Help me understand how you envision that working given [constraint]"
- ✅ Or: "I want to make sure we're aligned—if we do X, it means Y. Is that okay?"

### **Summarize and Confirm**
Every 10 minutes:
- "Let me make sure I understand: you need [X], [Y], and [Z]. Is that right?"
- This gives them a chance to correct you and adds clarity

## Note-Taking Tips

**During the interview:**
- Write down EXACT quotes when they're vague ("make it fast")
- Note contradictions (they say speed is #1, then say features are #1)
- Mark questions you don't know the answer to with "???"
- Flag risks with "⚠️" or your own shorthand (sometimes I use `!!`)

**After the interview:**
- Immediately write up what you learned
- Transform vague statements into quality attribute scenarios
- List assumptions that need verification
- Identify hidden stakeholders mentioned

## Checklist: Did You Cover Everything?

By the end of the interview, you should know:

- [ ] Who are the stakeholders?
- [ ] What's the business problem?
- [ ] What are the functional requirements (features)?
- [ ] What are the quality attributes (performance, security, scalability, availability)?
- [ ] What are the constraints (budget, timeline, technology, team)?
- [ ] What are the assumptions?
- [ ] What are the priorities (if we have to cut, what goes)?
- [ ] Who maintains this long-term?
- [ ] What regulations apply?
- [ ] What are the biggest risks?

## Remember

**Good questions:**
- Are specific and open-ended
- Dig into the "why" behind requests
- Uncover assumptions
- Force prioritization when there are conflicts

**Bad questions:**
- Are yes/no without follow-up
- Accept vague answers
- Let assumptions slide
- Avoid hard conversations about tradeoffs

**Your goal isn't to be liked—it's to protect the project by uncovering the truth early.**

Good luck!
