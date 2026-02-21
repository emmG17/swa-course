# Requirements Document Template
## Quality Attribute Scenarios

**Name:**  
**Project Name:**  
**Date:**  
**Version:** 1.0

---

## Project Overview

**Brief Description** (2-3 sentences):  
*What is this system? What problem does it solve? Who uses it?*

[Your answer here]

---

## Stakeholder Identification

**Who did you interview or consider for this project?**

List all stakeholders and their primary concerns:

| Stakeholder Type | Name/Role | Primary Concerns |
|------------------|-----------|------------------|
| Example: End User | Restaurant owners | Ease of use, reliability during dinner rush |
---

## Assumptions

**What are you assuming to be true?**  
*These are things you believe but haven't verified. When they turn out false, scope changes.*

1. [Example: Users have stable internet connections with at least 3G speed]
2. 
3. 
4. 
5. 

**What could go wrong if these assumptions are false?**

[Your analysis here]

---

## Constraints

**What are the non-negotiable boundaries for this project?**

### Budget Constraints
- [Example: Maximum $500/month for infrastructure in first 6 months]

### Timeline Constraints
- [Example: Must launch by October 1st to capture holiday season traffic]

### Technology Constraints
- [Example: Must integrate with existing Oracle database (can't replace it)]

### Team Constraints
- [Example: Only 2 backend developers, both mid-level, no DevOps specialist]

### Compliance Constraints
- [Example: Must be GDPR compliant, must handle PCI-DSS for payments]

### Operational Constraints
- [Example: Client has no 24/7 support team; system must be self-healing where possible]

---

## Quality Attribute Scenarios

**Instructions:** Use this format for each scenario:

```
When [STIMULUS] occurs in [CONTEXT/STATE],
the system should [RESPONSE]
within/with [MEASURE].
```

**Requirements:**
- At least **5 scenarios**
- Cover at least **3 different quality attributes**
- Be **specific and measurable**
- Be **realistic** for your context (don't over-engineer)

---

### Scenario 1: [Quality Attribute Name]

**Quality Attribute:** [Performance / Security / Availability / Scalability / Maintainability / Usability / Reliability]

**Scenario:**

When [STIMULUS] occurs in [CONTEXT],  
the system should [RESPONSE]  
within/with [MEASURE].

**Rationale:**  
*Why is this important? What's the business impact if we fail to meet this?*

[Your rationale here]

**How will you test this?**

[Your testing approach here]

---

### Scenario 2: [Quality Attribute Name]

**Quality Attribute:** 

**Scenario:**

When [STIMULUS] occurs in [CONTEXT],  
the system should [RESPONSE]  
within/with [MEASURE].

**Rationale:**  

[Your rationale here]

**How will you test this?**

[Your testing approach here]

---

### Scenario 3: [Quality Attribute Name]

**Quality Attribute:** 

**Scenario:**

When [STIMULUS] occurs in [CONTEXT],  
the system should [RESPONSE]  
within/with [MEASURE].

**Rationale:**  

[Your rationale here]

**How will you test this?**

[Your testing approach here]

---

### Scenario 4: [Quality Attribute Name]

**Quality Attribute:** 

**Scenario:**

When [STIMULUS] occurs in [CONTEXT],  
the system should [RESPONSE]  
within/with [MEASURE].

**Rationale:**  

[Your rationale here]

**How will you test this?**

[Your testing approach here]

---

### Scenario 5: [Quality Attribute Name]

**Quality Attribute:** 

**Scenario:**

When [STIMULUS] occurs in [CONTEXT],  
the system should [RESPONSE]  
within/with [MEASURE].

**Rationale:**  

[Your rationale here]

**How will you test this?**

[Your testing approach here]

---

### Scenario 6 (Optional): [Quality Attribute Name]

**Quality Attribute:** 

**Scenario:**

When [STIMULUS] occurs in [CONTEXT],  
the system should [RESPONSE]  
within/with [MEASURE].

**Rationale:**  

[Your rationale here]

**How will you test this?**

[Your testing approach here]

---

## Tradeoff Analysis (Optional but Recommended)

**What tradeoffs did you make?**  
*Example: We prioritized availability over cost by choosing redundant servers*

[Your analysis here]

**What did you intentionally NOT optimize for?**  
*Example: We didn't optimize for peak performance because user traffic is predictable and low*

[Your analysis here]

---

## Questions & Unknowns

**What don't you know yet that could change these requirements?**

1. [Example: We don't know if restaurants can provide menu data in structured format]
2. 
3. 

---

## Next Steps

**What needs to happen before you can finalize requirements?**

- [ ] [Example: Interview restaurant owners to validate assumptions about POS integration]
- [ ] [Example: Develop our own POS system if integration is too difficult] 
- [ ] [Example: Actually acquire a POS company because we have the cashflow to do it]

---

## Appendix: Example Completed Scenarios

*These examples show good quality attribute scenarios. Use them as reference!*

### Example 1: Performance

**Quality Attribute:** Performance

**Scenario:**

When a user searches for a restaurant by cuisine type during normal business hours,  
the system should return results  
within 200ms for 95% of requests.

**Rationale:**  
Fast search is critical for user experience. Users expect restaurant discovery to feel instant. If search takes more than 500ms, we risk users abandoning the app. We chose 200ms as a target because it's perceivably instant and achievable with proper database indexing and caching.

**How will you test this?**
- Load testing with JMeter simulating 100 concurrent users
- Monitor P95 latency in production with application performance monitoring (APM) tool
- Set up alerts if P95 exceeds 200ms

---

### Example 2: Security

**Quality Attribute:** Security

**Scenario:**

When an attacker attempts SQL injection on the login form,  
the system should reject the malicious input, log the attempt with IP address and timestamp, and return a generic error message  
without exposing database structure or sensitive information.

**Rationale:**  
SQL injection is one of the most common web vulnerabilities. Protecting user credentials and system data is non-negotiable. Logging attempts helps us identify attack patterns. Generic error messages prevent attackers from learning about our system structure.

**How will you test this?**
- Automated security scans with OWASP ZAP
- Manual penetration testing with common SQL injection payloads
- Verify logs capture attempts without exposing sensitive data

---

### Example 3: Availability

**Quality Attribute:** Availability

**Scenario:**

When a single application server fails during dinner rush (6-9 PM),  
the system should automatically failover to a healthy server  
within 30 seconds with no data loss and minimal user disruption (users may need to refresh page once).

**Rationale:**  
Dinner rush (6-9 PM) generates 70% of daily revenue. Downtime during this window is unacceptable. We can tolerate 30 seconds of degraded service because it allows automatic recovery without requiring on-call staff intervention. Requiring one page refresh is acceptable and cheaper than session replication.

**How will you test this?**
- Chaos engineering: deliberately kill servers during load testing
- Monitor failover time and data integrity
- Verify health checks detect failures within 10 seconds

---

### Example 4: Scalability

**Quality Attribute:** Scalability

**Scenario:**

When user traffic increases from 1,000 to 10,000 concurrent users during a promotional event,  
the system should maintain response times under 500ms by automatically scaling to additional servers  
within 5 minutes.

**Rationale:**  
Marketing plans seasonal promotions that could drive 10x traffic spikes. Manual scaling is too slow and requires on-call staff. Auto-scaling prevents downtime and maintains user experience. We allow 500ms (vs. 200ms normal) because it's still acceptable under high load, and setting it lower would require expensive over-provisioning.

**How will you test this?**
- Gradual load testing ramping from 1,000 to 10,000 users over 30 minutes
- Verify auto-scaling triggers correctly
- Monitor response times remain under 500ms during scale-up

---

### Example 5: Maintainability

**Quality Attribute:** Maintainability

**Scenario:**

When a developer needs to add a new payment provider,  
the system should allow the integration  
within 4 hours of development time by following a documented plugin interface without modifying core payment logic.

**Rationale:**  
Payment providers change frequently (contracts, fees, features). We can't afford multi-day integration efforts every time we add or replace a provider. A clean plugin architecture with documentation enables rapid adaptation to market changes.

**How will you test this?**
- Code review: verify payment logic is abstracted behind interface
- Documentation review: can a mid-level developer follow it?
- Real test: have a developer unfamiliar with the codebase add a mock provider and time it

---

## Submission Checklist

Before submitting, verify:

- [ ] Project overview completed
- [ ] At least 5 quality attribute scenarios
- [ ] Scenarios cover at least 3 different quality attributes
- [ ] Each scenario uses the correct format (stimulus, context, response, measure)
- [ ] Each scenario is specific and measurable (no vague statements like "fast")
- [ ] Rationales explain WHY each scenario matters
- [ ] Assumptions documented
- [ ] Constraints documented
- [ ] Stakeholders identified
- [ ] Testing approaches described

