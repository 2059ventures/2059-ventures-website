# Westwind Teardown & Site Integration Plan

**Subject:** Benchmarking 20 59 Ventures Corp's procurement surface against Westwind Computer Products (`wwcpinc.com`), a fellow TD SYNNEX channel partner.

**Date:** 2026-10-22
**Status:** Track A in progress
**Owner:** 20 59 Ventures Corp — Federal Contracting Desk

---

## 0. Why Westwind is the right benchmark

Westwind Computer Products (Albuquerque, NM) is a ~$9–15M value-added reseller, 50–96 employees, 25+ years in business. Critically, **Westwind is a TD SYNNEX partner** — their VP of Sales, Lupe Montoya, is quoted in TD SYNNEX's own press release about the TD SYNNEX Partner Directory (2023-03-21).

Westwind therefore sits in the same row as 20 59 Ventures: buys inventory through TD SYNNEX, sells to federal / state / local / education buyers, and competes for the same contracts. They are not a vendor to us — they are a **peer whose site we can read line by line**.

**Westwind's public identifiers (verified via GSA eLibrary, 2026-10-22):**

| Field | Value |
|---|---|
| GSA MAS contracts | `47QTCA20D003F`, `47QTCA22A000B` |
| SAM UEI | `ZF2JKBE7K285` |
| NAICS | 334111 |
| Address | 5655 Jefferson St NE Ste B, Albuquerque, NM 87109 |
| Socio-economic | Small Business |
| Clearances | FOCI cleared, DOE security clearances |
| ISO | ISO 9001:2015 (PRI Programs Registrar) |

---

## 1. Takeaways from the Westwind site

### 1.1 Contract vehicles are the spine of their site — our #1 structural gap

Westwind's homepage has a "Government Contracts" block; `/contracts/` is a first-class page listing **~13 vehicles**: GSA, SEWP, NITAAC CIO-CS, GSA GSS BPA, Equalis, NCPA, OMNIA, NASPO, CES, GSA GSD, PEPPM, NCSA, Sandia JIT.

**Our site named zero vehicles before this work.** The only reference was a single dropdown option, `BPA / Multi-Year Contract Vehicle` (`rfq.html:525`), and a generic "Fulfillment & Purchasing Vehicles" block on the homepage (`index.html:1134-1141`).

**Why this matters:** each contract vehicle *is* an integration endpoint into the buyer's own procurement system — GSA Advantage / SAM.gov, DoD ESI + Exostar, state cooperative purchasing portals. A vehicle is not paperwork; it is the plumbing that lets an agency buy from us without writing a new solicitation.

### 1.2 Their brand architecture is OEM-led; the distributor is invisible

Westwind's partner strip leads with **Apple Business Partner, Dell Authorized Partner, HPE, Cisco, Microsoft, Logitech, Google Workspace, LG, Zebra, Eaton, Legrand, Pexip, Garner, Draxxon, HP**. Their A–Z "We Believe in the Power of Partnership" list runs 200+ OEM names.

**They never show TD SYNNEX or D&H.** The message is "authorized specialist in these brands." The distributor is invisible supply chain.

Our site currently leads with distributors (`index.html:972`, `it-capabilities.html:1043-1050`): `TD SYNNEX • D&H • StarTech.com • Ergotron • Microsoft • Logitech • Samsung • Jabra`. That reads as *"we're a middleman."* Our `it-capabilities.html:1077` already has the right framing — the partner strip simply contradicted it.

**Action:** lead with OEM authorizations; demote distributors to the supply-chain assurance layer.

### 1.3 Vertical solution landing pages, not RFQ checkboxes

Westwind's nav is solutions: Cloud Computing, Data Center, Unified Communications, AV, Print, Desktop & Mobility, Software, Ergonomic Office, **Unmanned** — each with its own "Learn More" page.

Our six RFQ categories (`rfq.html:581-657` — Workstations & Desking, Ergonomic Mounts, Docks & Connectivity, Clinical Carts, Server Racks/PDUs, Peripherals & Audio) are **checkboxes with no landing pages**. A VA medical center CO searching "ergonomic monitor arms for hospitals" never finds us.

### 1.4 A ~30-item case-study library at `/resources/`

Core-IT Z-Workstation for STEM curriculum, ARDEC 3D printing, DoD ESI, Raytheon, Stantec, Public Safety, Healthcare VR, patient safety — plus whitepapers and a news feed. This is the long-tail discovery engine *and* the sales enablement library. **We have zero.** Cheapest SEO win available.

### 1.5 Third-party certifications, visibly badged

Westwind's footer carries: **WOSB, WBEN, ISO 9001:2015 (PRI Programs Registrar), The Open Group O-TTPS, NMSDC MBE**. Plus a dedicated `/quality-policy/` page (Vision / Mission / Quality Policy) and a C-SCRM Supplier Code of Conduct PDF.

We claim a "QMS *aligned to* ISO 9001:2015" — we do not hold the certificate. Westwind's ISO badge and Open Group badge are a visible differentiator we cannot match yet, but we **can** match their Quality Policy page and Supplier Code of Conduct at near-zero cost.

### 1.6 Co-branded OEM microsites

Westwind runs full co-branded landing pages at `/logitech/` and `/partners/apple/`, complete with "YOUR LOGO HERE" asset slots. Their site is built to be cloned per OEM partnership. We have StarTech, Ergotron, Jabra, Samsung, Logitech, Microsoft relationships — same template, zero pages.

### 1.7 Their quote form is generic; their *credibility surface* is not

Westwind's "Request A Quote" is a stock WordPress contact form — functionally equivalent to our RFQ form. **Westwind wins on surface area (vehicles, badges, case studies, brand wall), not on conversion mechanics.** That is the precise lesson: we do not need to rebuild our form, we need to add the missing surfaces.

---

## 2. Integration options — two distinct senses of "integration"

The phrase covers two different things, and we should treat them separately.

### 2.1 Procurement-channel integration (no code — Track A)

Buying an agency uses a vehicle. Each vehicle is a landing page that plugs into a system the buyer already has. Westwind's entire `/contracts/` portfolio is this play.

TD SYNNEX makes this reachable for us at near-zero cost. From TD SYNNEX Public Sector's own pages:

> *"TD SYNNEX owns a number of federal, state and local government and education contracts, **all of which can be used by our reseller partners**."* — TD SYNNEX Public Sector, Contracts

> *"If you have your own contract, then use our Contractor Team arrangement to add depth to your contract offering without the corresponding administrative headache. If you don't have a schedule, then **use ours and do the billing on our behalf as an authorized dealer. Or allow us to invoice your customer and pay you an agent commission**."* — TD SYNNEX Public Sector, GSA Schedule Program

That second quote is the mechanism that gives a firm our size GSA access without a GSA application cycle.

**TD SYNNEX Public Sector vehicles usable by reseller partners (verified 2026-10-22):**

| Vehicle | Contract # | Awardee | Notes |
|---|---|---|---|
| GSA MAS — IT Equipment, Software & Services | `47QTCA19D00MM` | TD SYNNEX Corporation | SINs 33411, 511210, 518210C, 54151, 811212, OLM. Max order $500,000 ($250,000 OLM). PoP through 09/2029, ultimate 09/2039. |
| GSA MAS — Cisco / Amwell / Ciena / Radware | `GS-35F-0563U` | TD SYNNEX Corporation | SINs 33411, 511210, 54151, 54151ECOM, 54151S, 611420, 811212, OLM. Expires 09/04/2028. |
| 2GIT Blanket Purchase Agreements | `47QTCA21A0026`, `47QTCA21A002E` | TD SYNNEX Corporation | Federal. PoP through 09/2039. |
| NASA SEWP VI | SEWP VI LOA | TD SYNNEX Corporation | Authorized-reseller LOA required; TD SYNNEX publishes LOA guidance for resellers. |
| NASPO ValuePoint (formerly WSCA) | — | TD SYNNEX Corporation | Contact `naspo@tdsynnex.com`. |
| TX DIR — Software COTS & Related Services | `TX DIR-CPO-5869` | TD SYNNEX Corporation | 11/03/2025 – 11/03/2031. |
| Equalis Group | `EQ-013120-01E` | Region 10 ESC lead agency | TD SYNNEX awardee; renewable through 04/30/2027. Sold through authorized dealers/resellers. |
| PEPPM | GSA PMO program | TD SYNNEX Corporation | TD SYNNEX PEPPM Participating Dealer Agreement; approved-state SLED customers only. |
| CMAS (California) | — | TD SYNNEX Corporation | Managed contract. |
| Sourcewell | `030425-SYN` | TD SYNNEX Corporation | Public safety software. 09/2025 – 07/2029. |

**Also available:** TD SYNNEX's **Small Business Alliance** ("focused support for small business"), and a Public Sector Business Development Team Map with regionally dedicated reps. Contact for reseller public-sector vehicles: `contracts@tdsynnex.com`.

### 2.2 Technical/commercial integration (code — Track B)

Three surfaces TD SYNNEX exposes to partners:

- **TD SYNNEX Partner API** (`developer.tdsynnex.com`) — OAuth2; **Price & Availability by SKU or manufacturer part number**, GetQuote status, GetPOStatus, order submission, invoice query, freight quote.
  *Why this is the highest-leverage item we have:* our RFQ form already collects OEM part numbers (`rfq.html:702` placeholder — *"20x StarTech TB3CDK2DP"*), and `functions/api/rfq.js:767` currently creates an Odoo task reading *"Verify pricing with TD SYNNEX / StarTech / Ergotron."* That step is manual. Wiring MPN extraction → Price & Availability → auto-populated quote is how the published *"2 to 4 business hours"* micro-purchase SLA actually gets hit.
- **TD SYNNEX MyShop** — white-label storefront on our own domain. Browse the TD SYNNEX catalog, request quotes, or purchase. Vendor-specific shops. **Direct integration into the partner's CRM/ERP** (we run Odoo). Custom punchout.
- **StreamOne commerce API** — headless commerce. We build the UI in our own design system; TD SYNNEX supplies product, pricing, inventory, order management, and continuous XaaS usage billing. White-label storefronts, no deployment cost; marketplace syndication to Azure / AppSource.

**Third-party alternative to evaluate:** VARStreet pre-builds the TD SYNNEX XML catalog feed and adds quoting + eCommerce + punchout (Ariba, SAP, Oracle, PeopleSoft, JD Edwards) + CRM. Compare against self-building on StreamOne.

**Punchout is the real integration ask.** Agencies increasingly want to buy *from inside* their Ariba / Coupa / SAP Ariba / Jaggaer rather than receive a quote PDF. Our RFQ placeholder already says *"WAWF invoicing required"* — we are already thinking in terms of agency systems.

---

## 3. Track A — Procurement-channel integration (in progress)

| # | Item | Status | Notes |
|---|---|---|---|
| A1 | `contracts.html` — vehicle portfolio hub | **Done** | New page. Six acquisition pathways, per-vehicle cards with contract numbers, awardee, expiry, and how we participate. |
| A2 | Ride TD SYNNEX's vehicles instead of applying ourselves | **Open — action required** | Requires: join TD SYNNEX Public Sector, get on the Business Development Team Map, obtain reseller agreement + SEWP VI LOA if needed, enroll in the relevant programs (PEPPM dealer agreement, Equalis dealer agreement). Owner: contracting desk. |
| A3 | Publish real vehicle identifiers across the site | **Done** | `contracts.html`, `index.html` procurement section, `it-capabilities.html` sidebar, `rfq.html` fast-facts + new sidebar widget. |
| A4 | Vehicle-aware RFQ routing | **Done** | New `contract_vehicle` field on the RFQ form, wired through `functions/api/rfq.js` into the alert email, auto-reply, and Odoo lead. |
| A5 | State & local co-op tier | **Done** | `contracts.html` includes NASPO ValuePoint, TX DIR, Equalis, CMAS, PEPPM, Sourcewell. |
| A6 | Per-OEM landing pages (`/startech/`, `/ergotron/`, `/jabra/`) | **Open** | Westwind's `/logitech/` template. Next after Track A closes. |

### 3.1 Honest-framing rule adopted (important)

20 59 Ventures is **not** the schedule holder on TD SYNNEX's vehicles, and does not hold OMNIA, NASPO, PEPPM, or Equalis awards directly. The site therefore states, per vehicle, **who the awardee is and how 20 59 participates** (authorized reseller / dealer / sub under the award). This is:

1. Legally correct — misrepresenting schedule participation to a contracting officer is a False Claims Act exposure, and it is exactly the over-claim Westwind avoids by being precise.
2. Commercially stronger — a contracting officer who sees *"we are the awardee"* and later discovers otherwise disqualifies us. A buyer who sees *"here is the vehicle, here is the contract number, here is exactly how we sit under it, and here is the phone number"* treats us as a partner.

**Never claim a vehicle we do not hold.** If we later obtain our own GSA MAS, add it as a separate direct-award row.

---

## 4. Track B — Technical integration (not started)

| # | Item | Notes |
|---|---|---|
| B1 | TD SYNNEX Partner API — OAuth2 + Price & Availability by MPN | Wire into RFQ pipeline; replaces the manual "verify pricing" Odoo task |
| B2 | MyShop storefront at `/shop` | White-label, TD SYNNEX catalog + our margin rules, Odoo order sync |
| B3 | StreamOne commerce API | Headless build of our own storefront on our design system |
| B4 | VARStreet evaluation | Buy-vs-build decision vs. B3 |
| B5 | Punchout (Ariba / Coupa / SAP Ariba / Jaggaer) | Depends on B2–B4 |
| B6 | TD SYNNEX Small Business Alliance enrollment | Low effort, directly relevant to our size |

---

## 5. Track C — Trust surface (quick wins)

| # | Item | Notes |
|---|---|---|
| C1 | `/quality-policy/` page + Supplier Code of Conduct | Copy Westwind's structure — near-zero cost, visible credibility |
| C2 | Real ISO 9001:2015 certification | Or keep the "aligned to" wording. Do not imply a cert we don't hold. |
| C3 | Open Group O-TTPS | Relevant to TAA-sensitive servers and network gear |
| C4 | Back "authorized distribution" with artifacts | TD SYNNEX partner ID, vendor authorization letters, logo licensing. Currently asserted with nothing behind it. |
| C5 | Capabilities statement PDF in the header | Westwind surfaces theirs in the header. We generate `pdf/capabilities-statement.pdf` but never link it from the header. |

---

## 6. Claims hygiene — corrections made in this pass

| Claim | Before | After |
|---|---|---|
| CMMC | `index.html` said *"CMMC Level 2 … Compliant"*; four other surfaces said *"working toward CMMC L2"* | **CMMC Level 2 Certified** on all surfaces — 20 59 Ventures is certified |
| Inventory | *"granting direct access to multi-million dollar IT inventory"* (`it-capabilities.html:1077`) | Rewritten — we resell through Tier-1 distributors, we do not own inventory |
| Partner set | `llms.txt`, `llms-full.txt`, and every transactional email in `functions/api/rfq.js` omitted D&H and Jabra | All surfaces now list the same partner set |
| Vehicles | Zero named anywhere | Named with awardee + contract number + participation model |

**Outstanding, needs a human:** the CMMC Level 2 certification is now claimed site-wide. Before publish, insert the **C3PAO attestation ID, assessment date, and score** into `compliance.html` — a certification claim without a citable artifact is the same problem as the claims we just removed. Placeholder is marked in the source.

---

## 7. Reference: Westwind site inventory

| Path | Purpose |
|---|---|
| `/` | Homepage — hero, featured solutions, Government Contracts block, Request A Quote |
| `/contracts/` | Vehicle portfolio (~13) |
| `/contracts/{gsa,sewp,nitaac-cio-cs,gsa-gss-bpa,equalis,sandia-jit}/` | Per-vehicle detail pages |
| `/partners/` | 15 partner logos + 200+ brand A–Z wall |
| `/partners/apple/`, `/logitech/` | Co-branded OEM microsites |
| `/solutions/it-products/*` | Vertical solution pages (9) |
| `/resources/` | ~30 case studies, whitepapers, news feed |
| `/quality-policy/` | Vision / Mission / Quality Policy |
| `/contact-us/` | Request A Quote + subscribe |
| `/wp-content/uploads/2025/09/Westwind-Capabilities-Statement-2025-v08.15.25.pdf` | Capabilities statement (header link) |

---

## 8. Sequencing

**Week 1 (Track A + Track C quick wins):** `contracts.html` live · vehicle identifiers site-wide · vehicle-aware RFQ routing · CMMC consistency · claims hygiene · quality-policy page.

**Month 1:** TD SYNNEX Partner API auth + Price & Availability by MPN wired into the RFQ pipeline. This is what makes the 4-hour micro-purchase SLA real. Enroll in TD SYNNEX Small Business Alliance and get on the Public Sector Business Development Team Map.

**Quarter:** storefront (MyShop or StreamOne, after the B3/B4 decision) · six solution landing pages matching our RFQ categories · three OEM microsites · first five case studies.
