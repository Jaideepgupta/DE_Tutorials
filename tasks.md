# Implementation Tasks

This task list is based on the PRD for the "Data Journey — From One Order to a Dashboard" project. It follows the recommended build order and breaks down the work into atomic, phased steps.

## Phase 1: Foundation & Setup
- [x] Initialize Next.js project with React, TypeScript, and Tailwind CSS
- [x] Set up global application layout and page shell
- [x] Install required libraries: `framer-motion`, `reactflow`, `recharts`, `lucide-react` (for icons)
- [x] Create the always-on "Pipeline Map" component (7 stages strip)
- [x] Create generic UI components: "Why does this exist?" header, tooltips
- [x] Define the global `Order` type interface (id, customer, product, price, date, stage, rawVersion, cleanVersion, issuesFixed)
- [x] Set up React Context/State for managing the single `order` object across stages

## Phase 2: Stage 1 — Create Order
- [x] Build the "Create Order" form (customer, product, price inputs)
- [x] Implement logic to generate a dirty `rawVersion` of the order upon creation
- [x] Build a simple table to display the created order record
- [x] Add the "golden thread" persistent badge showing the current form of the order

## Phase 3: Stages 5 & 6 — Bronze to Silver (Core Centerpiece)
- [x] **Stage 5 (Bronze)**
  - [x] Build read-only data table displaying the `rawVersion` order with flaws (e.g., duplicate, bad casing, nulls, bad date)
  - [x] Add locked "Clean" button with explanatory tooltip
- [x] **Stage 6 (Silver)**
  - [x] Build the Cleaning Factory UI layout
  - [x] Implement the Deduplicator machine logic & success animation (red to green)
  - [x] Implement the Standardizer machine logic (fix casing) & success animation
  - [x] Implement the Validator machine logic (handle NULLs) & success animation
  - [x] Implement the Formatter machine logic (fix dates) & success animation
  - [x] Update global state `cleanVersion` as machines run

## Phase 4: Stages 2 & 3 — OLTP & OLAP
- [x] **Stage 2 (OLTP)**
  - [x] Create static data representing linked tables (Customers, Orders, Products, Payments)
  - [x] Implement React Flow diagram showing table relationships
  - [x] Build the "Find Rahul's total spend" interaction with slow hopping animation
- [x] **Stage 3 (OLAP Race)**
  - [x] Build side-by-side view for OLTP vs OLAP race
  - [x] Implement the "Run" button with timers for both characters
  - [x] Add animation demonstrating slow multi-table hops vs fast single lookup

## Phase 5: Stage 4 — Data Lake
- [x] Build the Data Lake drop zone UI
- [x] Implement drag-and-drop interaction for different file types (CSV, Excel, JSON, log)
- [x] Add visual feedback (files landing in the lake)

## Phase 6: Stage 7 — Gold
- [x] Build UI for selecting a metric (e.g., "Total Revenue", "Top Product")
- [x] Implement aggregation logic to collapse `cleanVersion` rows into a single number/table
- [x] Add transition animation from detailed rows to aggregated summary

## Phase 7: Stage 8 — Dashboard & Lineage
- [x] Build the Dashboard canvas UI
- [x] Implement drag-and-drop interaction for moving Gold metrics onto the canvas
- [x] Integrate Recharts to render a simple bar chart from the dropped metrics
- [x] Implement lineage interaction: Clicking a chart number highlights the backwards path on the Pipeline Map
- [x] Enable clicking highlighted map stages to view the historical state of the order

## Phase 8: Quiz & Metrics
- [ ] Build the End-of-journey quiz component shell
- [ ] Write 5 beginner-friendly questions testing concepts learned
- [ ] Implement scoring logic and dynamic feedback based on score
- [ ] Build the "Certificate of Completion" UI
- [ ] Ensure all states reset smoothly for a new session

## Phase 9: Global Interactive Enhancements
- [x] **Data Packet Animation**: Add glowing animated packets to `PipelineMap.tsx` that travel across stages.
- [x] **ELI5 Toggle**: Add a global context state for "Explain Like I'm 5" and implement simplified text metaphors across stages.
- [x] **Guided Tours**: Integrate `driver.js` to create onboarding spotlights for key interactive elements in each stage.
- [x] **Draggable Data Sandbox**: Upgrade the `SilverStage` (Cleaning Factory) to allow users to drag rows into the cleaning machines.

## Phase 10: Industry Domains
- [x] Add `DomainType` to `types.ts`
- [x] Add active domain state to `OrderContext.tsx`
- [x] Build domain selector UI in `CreateOrderStage.tsx`
- [x] Implement domain-specific dynamic data generation
## Phase 11: Global Domain Sync & ELI5 UI/UX
- [x] Create central `domainConfig.tsx`
- [x] Update `CreateOrderStage` to use central config
- [x] Propagate domain terminology to `OltpStage` and `OlapRaceStage`
- [x] Propagate domain terminology to `DataLakeStage` and `BronzeStage`
- [x] Propagate domain terminology to `SilverStage` and `GoldStage`
- [x] Propagate domain terminology to `DashboardStage`
- [x] Implement global ELI5 UI/UX design (softer borders, hide terminal logs, playful colors)

## Phase 12: ELI5 Aesthetic CSS Variables (COMPLETED)
- [x] Add CSS variable structure to `globals.css`.
- [x] Update `page.tsx`, `StageHeader.tsx`, and `PipelineMap.tsx` to use CSS variables (`bg-panel-bg`, `text-text-main`, etc.).
- [x] Update all stage components (`CreateOrderStage.tsx`, `OltpStage.tsx`, `OlapRaceStage.tsx`, `DataLakeStage.tsx`, `BronzeStage.tsx`, `SilverStage.tsx`, `GoldStage.tsx`, `DashboardStage.tsx`) to use the new variables instead of hardcoded `slate` values.
- [x] Set specific aesthetic values (olive green, mustard, beige) for `.eli5-theme`.
