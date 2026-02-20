---
title: Intro to Software Architecture 
description: Why do some systems become unmaintainable nightmares while others scale gracefully?
theme: vibe 
---

# Software Architecture

## Week 1: Introduction to Software Architecture

Emmanuel G. | January, 2026

---

## Welcome & Agenda

**Today's Journey:** 

* What is software architecture? 
* Quality attributes that matter 
* Conway's Law and organizational impact 
* Architecture as tradeoffs 
* **Hands-on:** Real case study analysis 

---

## Why This Course Exists

**The Problem:** Most developers learn architecture through trial and error, painful mistakes, or "figuring it out yourself." 

**This course provides:**

* **Structured learning**
* **Real-world context** 
* **Practical skills**

---

## What Makes This Course Different

* **Context over patterns:** Right tool for the job, not the "coolest" tool. 
* **Communication skills:** Talking to stakeholders, not just writing code. 
* **Anti-patterns:** Avoiding the "golden hammer." 
* **Justification:** Explaining *why* you chose X over Y. 
* **Mexican market reality:** Real constraints for real projects. 

---

## Course Expectations

**How to succeed:**

* Attend live sessions or watch recordings. 
* Do the **weekly assignments** to build your portfolio. 
* Ask questions—there are no dumb ones. 
* Share your experiences and be kind to others. 


<hr class="my-4" />

> This is a safe space for learning and making mistakes. 

---

## Intro Round

**Quick intros (30 seconds each):**

1. Your name
2. Current role
3. One architecture pain point you've experienced 

*Example: "I'm Carlos, a backend dev, and my pain point is when features added later slowed everything down."* 

---
layout: section
---

# Part 1: What is Software Architecture? 

---

## Common Misconception

Many developers think **Architecture = Directory structure**. 

```bash
/src
  /controllers
  /models
  /views

```

This is actually **code organization** or project structure, not architecture. 

---

## Working Definition

**Software Architecture:** The significant **decisions** about how a system is organized, its major components, how they communicate, and the principles guiding these choices. 

**Architecture is about choices that are:** 

* Hard to change later
* Have widespread impact
* Involve significant tradeoffs

---

## The Three Levels

| Level | Scope | Examples |
| --- | --- | --- |
| **Code** | Implementation details | Loops, variables, functions |
| **Design** | Module/class structure | Design patterns, SOLID principles |
| **Architecture** | System organization | Databases, APIs, deployment, boundaries |



---

## Example: The Three Levels

**E-commerce system views:**

* **Code level:** A Python function querying a database for a `product_id`. 
* **Design level:** Controllers handling requests, Services containing logic, Repositories accessing data. 
* **Architecture level:** Next.js frontend, Django API, PostgreSQL DB, Stripe for payments, Cloudinary for images. 

---

## Let's Make This Concrete

**Real Scenario:** A small family business wants to sell handmade goods online. 

**Requirements:**

* Product catalog
* Shopping cart
* Payment processing
* Order management 

---

## The Constraints

**Project Context:**

* **Budget:** 5,000 MXN/month maximum 
* **Team:** Solo junior developer 
* **Traffic:** 100-200 visitors/day 
* **Timeline:** 3 weeks 

**Question: What architecture should we use?** 

---

## Option 1: WordPress + WooCommerce

**Architecture:** Monolith on shared hosting 

* **Pros:** Fast deployment, low cost (~300-500 MXN/mo), huge ecosystem. 
* **Cons:** Limited customization, performance ceiling, "plugin hell," security maintenance. 

---

## Option 2: Jamstack

**Architecture:** Static site + serverless + third-party services 

* **Pros:** Excellent performance, scalable, secure. 
* **Cons:** Complex setup, coordination of multiple services, learning curve for junior devs. 

---

## Option 3: Custom Monolith

**Architecture:** Traditional MVC (Django/Rails/Laravel) 

* **Pros:** Full control, single codebase, well-understood patterns. 
* **Cons:** Slower initial dev, server maintenance required, more expensive hosting. 

---

## Option 4: Microservices

**Architecture:** Distributed services (Node.js, API Gateway, K8s) 

* **Pros:** Independent scaling, technology flexibility. 
* **Cons:** **MASSIVE OVERKILL.** Operational complexity nightmare, high costs. 

---

## Discussion Time

**Which architecture is "right"?** 

Consider the constraints:

* 5,000 MXN budget
* Solo junior dev
* 3-week timeline 

---

## The Answer

For **THIS** context: **Option 1 (WordPress)** or **Option 2 (Jamstack)**. 

**Why?** 

* Fits budget and timeline 
* Matches team capability 
* Handles expected traffic 

---

## The Critical Insight

**All four options would technically work** (customers could buy goods). 

However, only 1-2 are **APPROPRIATE** for this specific context. Architecture is about finding the fit, not just a working solution. 

---

## Key Principle

**Architecture is NOT about:**

* Picking the "best" technology or newest framework. 
* Doing what Google/Amazon does. 

**Architecture IS about:**

* The **RIGHT** technology for **YOUR** constraints. 
* Understanding and justifying tradeoffs. 



---
layout: section
---

# Part 2: Quality Attributes 

---

## What Makes Architecture "Good"?

We optimize for **Quality Attributes**: 

1. **Performance:** Speed of response. 
2. **Scalability:** Ability to handle growth. 
3. **Maintainability:** Ease of modification. 
4. **Security:** Protection from unauthorized access. 

---

## Performance vs. Scalability

* **Performance:** How fast is it for *one* user? (Response time, latency). 
* **Scalability:** How does it handle *more* users? (Vertical vs. Horizontal scaling). 



---

## Maintainability & Security

* **Maintainability:** Readability, modularity, and testability. Most costs come *after* launch. 
* **Security:** Authentication, authorization, and encryption. One breach can destroy a business. 

---

## Quick Exercise: Which Matters Most?

1. **Banking App:** Security 
2. **Social Media Feed:** Scalability 
3. **Internal HR System:** Maintainability 
4. **Real-time Trading:** Performance 

---

## The Tradeoff Reality

You cannot optimize for everything equally. 

* High security might lower performance. 
* High scalability might increase cost/complexity. 

**Architecture is choosing which tradeoffs to make.** 

---
layout: section
---

# Part 3: Conway's Law 

---

## Conway's Law

> "Organizations design systems that mirror their own communication structure." — Melvin Conway, 1967 

**In practice:**

* Siloed teams → Siloed systems 
* One team → Monolith 
* Independent teams → Microservices 

---

## Architecture as Tradeoffs

* **WordPress:** ✅ Fast/Cheap | ❌ Limited flexibility 
* **Custom App:** ✅ Full control | ❌ Slower/Expensive 
* **Microservices:** ✅ Independent scaling | ❌ High complexity 

**The Tradeoff Mindset:** "What am I giving up to get this benefit?" 

---

## Case Study: The Golden Hammer

**"When all you have is a hammer, everything looks like a nail."**

We will analyze a **GraphQL** case study where a team used a complex tool for a simple problem because it was what they knew.

---

## Week 1 Deliverable

**One-page analysis of an architectural decision.**

* Analyze a real system you've worked on or observed. 
* Identify 2-3 decisions and explain the constraints.
* Analyze tradeoffs: What went right/wrong?
* **Due:** Sunday at 11:59 PM.

---

## Key Takeaways

1. Architecture ≠ Code organization.
2. Context is everything (Right tool, not "best" tool).
3. Quality attributes guide decisions.
4. Conway's Law: Org structure affects technical design.
5. Architecture is about informed tradeoffs.

---

## Thank You!

**See you next week for Stakeholder Communication!** 

* Deliverable due Sunday.
* Join office hours if you need help.
* Ask questions in Slack!

**Questions?**
