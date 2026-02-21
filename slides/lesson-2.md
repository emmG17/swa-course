---
theme: vibe
title: "Stakeholder Communication & Requirements Elicitation"
description: "How to Stop Building the Wrong Thing"
resources:
    - name: "Interview Starter"
      url: "lesson-2-interview-starter.md"
      type: "document"
    - name: "Deliverable Template"
      url: "lesson-2-deliverable-template.md"
      type: "document"
---

# Communication & Requirements

## Or: *"How to Stop Building the Wrong Thing"*

<br>

Emmanuel G. | January, 2026

---

# The Real Problem

**The #1 cause of failed software projects isn't bad code.** 

It's building the wrong thing. 

And we build the wrong thing because we don't know how to extract **real requirements** from **vague stakeholder requests**. 

---

# Let Me Tell You About Project Hunter...

*`[Names changed to protect the scarred]`* 

A medical platform connecting:

* Healthcare providers 
* Insurance companies 
* Patients 

**How hard could it be?** 

---

# Phase 1: The Honeymoon

**Requirements seemed simple:**

* Web app for patient registration 
* Hospital directory 
* Insurance dashboards to track patient progress 

**The team:**

* Mexican developers (us) 
* US stakeholders (them) 

**Status:** ✅ Everyone excited, timelines looking good. We felt like rockstars. 

---

# Phase 2: The Cold Shower

**Then someone asked:**

*"Wait, is this HIPAA compliant?"* 

**Us:** "HIPAA? What's HIPAA?" 

**Them:** "...you're joking, right?" 

---

# What We Forgot to Ask About:

* HIPAA (Health Insurance Portability and Accountability Act) 
* Insurance regulations 
* State-specific healthcare laws 
* Data residency requirements 
* Patient privacy protections 
* Audit trail requirements 

Nobody mentioned any of this. We assumed everyone was aligned. 

---

# Phase 3: The Nightmare

**What followed:**

* A massive **rewrite** (not a refactor) 
* Medical coding systems integration (ICD-10, CPT codes) 
* Complete rebuild with audit trails, encryption, and RBAC 

**Timeline?** Exploded ❌

**Budget?** Double exploded ❌❌ 

---

## The Lesson

**If we'd asked these questions in Week 1:**

* "Who regulates this industry?" 
* "What compliance requirements exist?" 
* "Who can veto our system going live?" 

We could have **designed for them from the start.** 

<br>

> Assumptions are expensive.

---
layout: section
---

# So How Do We Avoid This?

1. Ask better questions 
2. Document what we find 

---

# Who Are Your Stakeholders?

**Definition:** Anyone who cares about or is affected by your system. 

**The Hidden Stakeholder Problem:** If someone can say **"no"** to your system going live, they're a stakeholder. Find them early. 

---

# Common Stakeholder Types

| Stakeholder | Primary Concerns |
| --- | --- |
| **End Users** | Usability, features, workflow |
| **Business Owners** | ROI, time-to-market |
| **Ops/DevOps** | Deployability, maintainability |
| **Security Team** | Threats, compliance |
| **Compliance/Legal** | Regulatory requirements, audit trails |
| **Support Team** | Troubleshooting, documentation |
---

# Types of Requirements

* **Functional Requirements:** What the system does, for example:
    * "Users can upload photos"
    * "Admins can generate reports"

    These are usually easy to gather. 
* **Non-Functional Requirements (Quality Attributes):** How the system does it, for example:
    * "99.9% uptime"
    * "Manage 100,000 concurrent users"

    These are often forgotten or vague—**and where projects fail.**

---

# The 7 Key Quality Attributes

1. **Performance** - How fast must it respond? 
2. **Scalability** - How many users/transactions? 
3. **Availability** - How much downtime is acceptable? 
4. **Security** - What threats must we defend against? 
5. **Maintainability** - How easy is it to change/fix? 
6. **Usability** - How easy is it to use? 
7. **Reliability** - How often can it fail? 

---

# The Vague Requirement Problem

**Stakeholders say:**

* "The system must be **fast**" 
* "It needs to be **secure**" 
* "We need **high availability**" 

**Your job:** Turn vague into specific. 

---

# Solution: Quality Attribute Scenarios (QAS)

**A structured format that forces specificity:** 

```text
When [STIMULUS] occurs in [CONTEXT/STATE],
the system should [RESPONSE]
within/with [MEASURE].

```
<br>

* **STIMULUS:** What triggers this? 
* **CONTEXT:** Under what conditions? (Normal vs. Peak load) 
* **RESPONSE:** What should the system do? 
* **MEASURE:** How do we verify success? (Time, %, Count) 

---

# QAS Example: Performance

**Vague Requirement**
<br>
"The system must be fast" 

**Specific Scenario**
<br>
"When a user searches for a product during **normal business hours**, the system should return results within **200ms** for **95%** of requests." 

**Key Insight:** Notice the constraints (normal business hours) and the measurable criteria (200ms, 95%). 

---

# QAS Example: Security

**Vague Requirement**
<br>
"It needs to be secure" 

**Specific Scenario**
<br>
"When an attacker attempts SQL injection on the login form, the system should reject the malicious input, log the attempt, and not expose sensitive error messages to the attacker." 

**Key Insight:** This scenario specifies the attack vector and the expected response, making it testable and actionable.

---

# Common Pitfall

**Don't make everything perfect.** 

* X "99.999% uptime for the admin panel" 
* X "Microsecond response times for batch reports" 

**Perfection costs real money.** Be realistic about business needs. 

---

# The "5 Whys" Technique

**Purpose:** Dig deeper to uncover the root need. 

**Example: The Secure System**

1. **"Why is security important?"** -> Customer data. 
2. **"Why is protecting data critical?"** -> Potential lawsuits. 
3. **"Why would we face lawsuits?"** -> Handling credit card info. 
4. **"Why store it?"** -> **Realization:** We could just use a payment gateway! 

---

# Assumptions & Constraints

* **Assumptions:** Things we believe to be true but haven't verified (e.g., "Users have stable internet"). Document these to protect yourself when scope changes! 
* **Constraints:** Non-negotiable boundaries (Budget, Timeline, Legacy Tech, Team size). These shape your architecture as much as requirements do. 

---

# Workshop: FreshBite Food Delivery

**The Scenario:** Interview the FreshBite founder. They are enthusiastic but vague and unrealistic. 

**Your Mission:** Extract real, specific requirements. 

* Functional requirements 
* Quality attributes (QAS) 
* Assumptions & Constraints 
* Hidden stakeholders 

---

# Summary

1. **Identify all stakeholders** (including hidden ones) 
2. **Distinguish functional from non-functional** requirements 
3. **Transform vague into specific** with quality attribute scenarios 
4. **Dig deeper** with the "5 Whys" 
5. **Document assumptions and constraints** explicitly 

---

# Assignment for Next Week

**Create a requirements document with at least 5 Quality Attribute Scenarios.** 

**Must Include:**

* Stakeholder identification 
* Documented Assumptions & Constraints 
* 5 QAS covering at least 3 different quality attributes 

---
layout: quote
---

The questions you don't ask at the beginning will haunt you later.

An architect who learned the hard way (me)

---
layout: center
---

# Coming Up 

Context Analysis and Technology Selection

*(The Golden Hammer Deep Dive)*

<br>

**Thank You!**

<br>

Questions?
