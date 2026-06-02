# Product Requirements Document (PRD)

## Project: Data Journey — From One Order to a Dashboard

### Version: 1.0 (MVP) | Status: Build-ready

---

## 1. What this is

An interactive web app that teaches a complete beginner how data travels from a single business event to a dashboard — without code.

The whole product follows **one order through one straight line**:

```
Create Order  →  OLTP  →  Data Lake  →  Bronze  →  Silver  →  Gold  →  Dashboard
```

That is the entire MVP. No second industry, no AI tutor, no gamification levels. Those are listed in Section 9 as deliberately out of scope.

---

## 2. The core design decision (read this first)

**One order, tracked end to end.**

- At the start, the user creates a real record: *"Rahul buys a Toy Car for ₹500."*
- That same record is what they manipulate and watch change at every later stage.
- It is dirty in Bronze, cleaned in Silver, counted in Gold, and shown on the Dashboard.

Why this matters:

- **Continuity builds the mental model.** Beginners get lost when each stage shows new, unrelated example data. Following one familiar object the whole way removes that confusion.
- **It makes lineage almost free.** Because the app already tracks where the order is at each stage, the "trace it backward" feature costs almost nothing to add (see Section 6, Stage 8).
- **It makes the North Star measurable.** If a user can narrate what happened to *Rahul's order* at each stage, they understand the pipeline.

Everything below hangs off this decision.

---

## 3. Target user (one, not two)

**Primary and only v1 user: the beginner.**

- Students, freshers, career switchers, non-technical managers.
- They have no architecture knowledge and are scared of the jargon.

I am dropping the "data professional" secondary audience for v1. That group wants depth and speed; the beginner wants slow cartoons. You cannot serve both in one flow without weakening it for both. Add a separate "deep dive" mode in v2 if the beginner version works.

---

## 4. Teaching method used at every stage

Each stage follows the same 4-beat loop. This is the engine that makes concepts easy to learn.

1. **Feel the problem first** — pose a question or pain the user feels *before* showing the solution. (Pure copywriting. Free.)
   - Example before OLAP: "Try to add up total sales by hand from these 4 tables. Annoying, right?"
2. **Do something** — the user clicks, drags, or toggles. No passive reading.
3. **See the result instantly** — the screen reacts to what they did.
4. **Name the concept** — only *after* they've seen it, attach the real term in one plain sentence.

This is the reverse of how courses usually teach (term first, confusion second).

---

## 5. Always-on learning aids (cross-cutting, cheap)

These appear across all stages, not inside one.

- **Pipeline map (cheap).** A small always-visible strip showing all 7 stages, with the current one highlighted. Click any past stage to revisit. This is the user's anchor — they always know where they are.
- **"Why does this exist?" hook (cheap).** One short line at the top of each stage stating the problem that stage solves. Forces problem-before-solution.
- **Plain-language tooltips (cheap).** Hover any technical word → one-sentence definition in simple English. No paragraph dumps.
- **The golden thread badge (cheap).** A small persistent card showing Rahul's order in its *current* form, so the user can always compare "what it looks like now" vs earlier.

---

## 6. The 7 stages (this is the MVP)

Each stage lists the interaction, the learning outcome, and a **build cost tag**.

### Stage 1 — Create the Order *(cheap)*

- **Interaction:** User fills a tiny form (customer, product, price) and clicks "Place Order." A row appears in a table. Let them create 3–4 orders.
- **They see:** Raw business events becoming records in an app.
- **Concept named after:** transaction, record, table, source system.

### Stage 2 — OLTP: data split across tables *(medium)*

- **Interaction:** The order they made is shown broken into linked tables — Customers, Orders, Products, Payments — connected by IDs. User clicks "Find Rahul's total spend" and watches the app *hop* from table to table to assemble the answer (slow, visible jumps).
- **They see:** Data is stored split up so each fact lives in one place; answering a business question means jumping across many tables.
- **Concept named after:** OLTP, linked tables, why this is fast for *saving* orders but slow for *reporting*.
- **Note:** I am not using a "library shelf" analogy here. It misrepresents how the tables actually link. The honest framing is: "each piece of info is stored once and pointed to by ID."

### Stage 3 — OLTP vs OLAP race *(cheap)*

- **Interaction:** Same question ("total sales?") on two characters side by side. User clicks "Run." OLTP hops across 4 tables (slow). OLAP does one lookup (fast). Show a timer on each.
- **They see:** Why a separate system exists for answering business questions.
- **Concept named after:** OLAP, reporting vs transactions.

### Stage 4 — Data Lake: dump everything *(cheap)*

- **Interaction:** User drags files of different shapes (a CSV, an Excel, a JSON, a log) into a "lake." They all land, no questions asked.
- **They see:** A place that accepts raw data of any shape, no cleanup needed yet.
- **Concept named after:** data lake, raw storage.

### Stage 5 — Bronze: the mess, untouched *(cheap)*

- **Interaction:** Mostly read-only *on purpose*. The order data is shown with real problems: `Rahul / RAHUL / rahul`, a duplicate row, a `NULL` price, a wrongly formatted date. A locked "Clean" button with the label "Not yet — this layer keeps data exactly as it arrived."
- **They see:** Bronze = exact copy of source, flaws included.
- **Concept named after:** raw ingestion, no transformation.
- **Why read-only is the lesson:** the temptation to fix it here is exactly the misunderstanding to correct.

### Stage 6 — Silver: the cleaning factory *(medium — the centerpiece)*

This is the strongest interactive moment. Spend the most effort here.

- **Interaction:** Four machines the user runs one at a time, watching rows fix in real time:
  - **Deduplicator** — removes the repeated row.
  - **Standardizer** — `RAHUL / rahul` → `Rahul`.
  - **Validator** — flags or fills the `NULL` price.
  - **Formatter** — fixes the broken date.
- After each machine runs, the affected cells animate from red (bad) to green (clean).
- **They see:** Cleaning is a set of specific, repeatable fixes — not magic.
- **Concept named after:** data quality, transformation, standardization.

### Stage 7 — Gold: roll it up *(cheap)*

- **Interaction:** User picks a metric ("Total Revenue", "Top Product"). The clean rows visibly collapse into one number or a 3-row table.
- **They see:** Aggregation trades detail for insight; this is what the business actually reads.
- **Concept named after:** aggregation, business metric, data mart.

### Stage 8 — Dashboard + Lineage *(medium)*

- **Dashboard interaction:** User drags Gold metrics onto a canvas → a simple bar chart renders.
- **Lineage interaction (nearly free because of the golden thread):** User clicks a number on the chart → the pipeline map lights up the full path backward (Dashboard ← Gold ← Silver ← Bronze ← Lake ← OLTP ← the original order). Click each lit stage to see Rahul's order in that form.
- **They see:** Every dashboard number is traceable to a real event; nothing is invented.
- **Concept named after:** reporting layer, data lineage.

---

## 7. End-of-journey quiz *(cheap, but required)*

Without this, your success metrics are unmeasurable.

- 6 short questions, mix of multiple-choice and "drag the stages into order."
- Examples:
  - Put the 7 stages in the correct order.
  - "Which layer holds the messy, untouched data?" → Bronze.
  - "Why does a business use OLAP instead of OLTP for reports?"
- Score shown at the end. Result logged (see metrics).

---

## 8. Success metrics (only what you can actually measure)

I rewrote the original metrics. The old ones ("70% can explain OLTP vs OLAP") could not be measured by a static app — there was no way to capture a spoken explanation.

**Learning (from the quiz):**
- 70%+ of quiz-takers order the 7 stages correctly.
- 70%+ correctly identify the Bronze layer's purpose.

**Engagement (logged events):**
- 60%+ of users who start Stage 1 reach the Dashboard.
- Median time in the Silver cleaning factory > 60 seconds (shows they engaged, not skipped).

**North Star (still the goal, tested separately):**
- "After one session, can a beginner narrate what happened to Rahul's order at each stage?"
- This needs a human watching them talk. Test it on 5 real beginners before claiming the app works. The quiz is your proxy; this is the truth.

---

## 9. Deliberately OUT of scope for v1

Listed so no one quietly adds them back.

- **AI Tutor.** Needs an LLM API and a backend. Contradicts the "static, no backend" plan. v2.
- **Cross-session progress / login.** Needs storage and accounts. Keep progress in memory for one session only in v1.
- **5 industries.** Multiplies your content and testing by 5 for no new concept. Toy store only.
- **Gamification levels and badges.** This is engagement decoration, not learning. For a portfolio piece it adds build time and proves nothing about the concept. Skip.
- **SQL / Spark / Airflow / Snowflake visualizers.** v2 — and only after the beginner flow is validated.

---

## 10. Technical notes

- **Stack:** Next.js + React + TypeScript + Tailwind. No backend.
- **Animation:** Framer Motion is enough. GSAP only if a specific animation needs it — don't add a second library by default.
- **Diagrams / table hops:** React Flow for the pipeline map and OLTP table-jumping.
- **Charts:** one chart library (Recharts is fine). Don't add a second.
- **State:** one shared `order` object held in React state and passed through all stages. This *is* the golden thread. Shape roughly:

```
order = {
  id, customer, product, price, date,
  stage,            // where it currently is
  rawVersion,       // dirty form (Bronze)
  cleanVersion,     // fixed form (Silver)
  issuesFixed: []   // which machines were run
}
```

- **Data:** all static JSON. No live data sources in v1.

---

## 11. Build order (so you don't stall)

Build in the order a user experiences it. Each stage is shippable on its own.

1. Pipeline map + page shell (the anchor everything plugs into).
2. Stage 1 (create order) + the golden-thread state object.
3. Stages 5–6 (Bronze → Silver). This is your demo centerpiece — get it working early so you have something worth showing even if you run out of time.
4. Stages 2–3 (OLTP, OLAP race).
5. Stage 4 (Data Lake).
6. Stage 7 (Gold).
7. Stage 8 (Dashboard + Lineage).
8. Quiz + metrics logging.

**If time runs out:** Stages 1, 5, 6, 8 alone (Create → Bronze → Silver → Dashboard with lineage) still tell a complete, honest story. Cut the rest before you cut these.

---

## 12. Honest framing

This is a **learning and portfolio project**, not a startup. The Bronze/Silver/Gold idea is Databricks' own framing and there are many free explainers online. That is fine — the value here is that *you build it well and it demonstrates your product thinking and front-end skill.* Do not attach startup-style growth metrics to it. Finish it, demo it, write it up. That is the win.
