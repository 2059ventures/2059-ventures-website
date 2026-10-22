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

**TD SYNNEX Public Sector vehicles usable by reseller partners — VERIFIED 2026-10-22 against the TD SYNNEX Public Sector Contract Linecard (2025-2026 edition, 06/16/2026), held locally at `TDSPS_Contracts-Linecard_06_16_26 (1).pdf`:**

| Vehicle | Contract # | Awardee | PoP / Expiration |
|---|---|---|---|
| GSA MAS — IT Equipment, Software & Services | `47QTCA19D00MM` | TD SYNNEX Corporation | 09/27/2020 – 09/06/2039 |
| GSA MAS — Cisco / Amwell / Ciena / Radware | `GS-35F-0563U` | TD SYNNEX Corporation | 09/08/2008 – 09/04/2028 |
| 2GIT Federal BPAs | `47QTCA21A0026`, `47QTCA21A002E` | TD SYNNEX Corporation | 03/31/2020 – 09/26/2039 |
| OMNIA Partners — Cybersecurity Solutions | `R250307` | TD SYNNEX Corporation | 10/01/2025 – 09/30/2030 |
| NCPA — Advanced Technology Solutions Aggregator | `01-170` | TD SYNNEX Corporation | 12/14/2023 – 12/31/2028 |
| Equalis Group — Tech, Software, Equipment & Services | `R10-1173F` | TD SYNNEX Corporation | 03/01/2025 – 02/28/2030 |
| Sourcewell — Public Safety Software | `030425-SYN` | TD SYNNEX Corporation | 09/05/2025 – 07/17/2029 |
| PEPPM — Wholesaler Technology Catalog | `CA KCSOS 542242` | TD SYNNEX Corporation | 10/01/2024 – 09/30/2027 |
| PEPPM — Product Line Contracts | (numerous OEMs) | TD SYNNEX Corporation | 01/01/2026 – 12/31/2028 |
| CA KCSOS — PA CSIU | `548362` | TD SYNNEX Corporation | — |
| TX DIR — Software COTS & Related Services | `TX DIR-CPO-5869` | TD SYNNEX Corporation | 11/03/2025 – 11/03/2031 |
| TX DIR — Cybersecurity Products & Services | `TX DIR-CPO-4846` | TD SYNNEX Corporation | 01/26/2023 – 01/25/2028 |
| TX DIR — Miscellaneous IT | `TX DIR-CPO-5096` | TD SYNNEX Corporation | 12/14/2022 – 12/21/2027 |
| TX DIR — Mobile Digital Video Recording | `TX DIR-CPO-5283` | TD SYNNEX Corporation | 08/21/2024 – 08/21/2029 |
| TX DIR — Telecom & Conferencing | `TX DIR-CPO-5077` | TD SYNNEX Corporation | 08/04/2022 – 08/04/2027 |
| NASPO ValuePoint — HPE Server/Storage | `23008` | HPE via TD SYNNEX | 09/07/2023 – 06/30/2028 |
| NASPO ValuePoint — HP Computer Equipment | `23011` | HP Inc. via TD SYNNEX | 07/01/2023 – 06/30/2028 |
| NASPO ValuePoint — Ericsson Wireless | `AR3189` | Ericsson via TD SYNNEX | 10/01/2019 – 09/30/2026 |
| NASPO ValuePoint — HPE Datacom | `AR3228` | HPE via TD SYNNEX | 10/01/2019 – 09/30/2026 |
| NASPO ValuePoint — Palo Alto Networks | `AR3229` | Palo Alto via TD SYNNEX | 10/01/2019 – 09/30/2026 |
| TX DIR — Panasonic North America | `TX DIR-TSO-5225` | Panasonic via TD SYNNEX | 01/03/2024 – 01/03/2029 |

**Also on the linecard but awarded to DLT Solutions** (TD SYNNEX's public-sector subsidiary, not to us): CIO-CS `HHSN316201500012W` (expired 04/29/2026), NASA SEWP V `NNG15SC07B`/`NNG15SC98B` (expired 04/30/2026), ITES-SW2 `W52P1J-20-D-0047`, DoD ESI LCATS, TIPS `210101`, NASPO ValuePoint Oracle `AR2487` (expired 09/15/2026). **We do not list these on the public page** — they are DLT's awards and the federal terms shown have lapsed. SEWP remains available to us only through TD SYNNEX's separate **SEWP VI reseller LOA** program.

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
| A1 | `contracts.html` — vehicle portfolio hub | **Done** | New page. Six acquisition pathways, 13-row vehicle table with contract numbers, awardee, term, and how we participate. |
| A2 | Ride TD SYNNEX's vehicles instead of applying ourselves | **Partially closed 2026-10-22** | Verified against the TD SYNNEX Public Sector Contract Linecard (06/16/2026). 20 59's **own executed D&H OMNIA NCPA Reseller Agreement** confirmed (Acct 332729, effective 10/06/2026, 3-yr initial term). **Still open:** TD SYNNEX reseller agreement + SEWP VI LOA + PEPPM dealer enrollment + written marketing permission (see §3.2). Owner: contracting desk. |
| A3 | Publish real vehicle identifiers across the site | **Done** | `contracts.html`, `index.html` procurement section, `it-capabilities.html` sidebar, `rfq.html` fast-facts + new sidebar widget. |
| A4 | Vehicle-aware RFQ routing | **Done** | New `contract_vehicle` field on the RFQ form, wired through `functions/api/rfq.js` into the alert email, auto-reply, and Odoo lead. |
| A5 | State & local co-op tier | **Done** | `contracts.html` includes NASPO ValuePoint, TX DIR, Equalis, CMAS, PEPPM, Sourcewell. |
| A6 | Per-OEM landing pages (`/startech/`, `/ergotron/`, `/jabra/`) | **Open** | Westwind's `/logitech/` template. Next after Track A closes. |

### 3.1 Honest-framing rule adopted (important)

20 59 Ventures is **not** the schedule holder on TD SYNNEX's vehicles, and does not hold OMNIA, NASPO, PEPPM, or Equalis awards directly. The site therefore states, per vehicle, **who the awardee is and how 20 59 participates** (authorized reseller / dealer / sub under the award). This is:

1. Legally correct — misrepresenting schedule participation to a contracting officer is a False Claims Act exposure, and it is exactly the over-claim Westwind avoids by being precise.
2. Commercially stronger — a contracting officer who sees *"we are the awardee"* and later discovers otherwise disqualifies us. A buyer who sees *"here is the vehicle, here is the contract number, here is exactly how we sit under it, and here is the phone number"* treats us as a partner.

**Never claim a vehicle we do not hold.** If we later obtain our own GSA MAS, add it as a separate direct-award row.

### 3.2 Vehicle verification results — 2026-10-22

Sources read: `D&H Authorization Omnia Auth.pdf`, `TDSPS_Contracts-Linecard_06_16_26 (1).pdf`, `Equalis-R10-1173F-Subcontractors-September2026-no-contact-info.xlsx` (all in the OneDrive business-documents folder).

**Confirmed and promoted on the site:**
- **OMNIA Partners NCPA `01-170`** — 20 59 holds its own **D&H Distributing OMNIA NCPA Reseller Agreement**, D&H account **332729**, authorization effective **10/06/2026**, three-year initial term with annual renewals, lead agency Region 14 ESC / Advanced Technology Solutions Aggregator. Customers must hold NCPA membership.
- **OMNIA Partners Cybersecurity `R250307`**, **Equalis `R10-1173F`**, **Sourcewell `030425-SYN`**, **PEPPM `CA KCSOS 542242` / `548362` / Product Line Contracts**, **six TX DIR contracts**, **NASPO ValuePoint OEM awards** — all via TD SYNNEX.
- **SEWP** is *not* a TD SYNNEX linecard vehicle for us: SEWP V is a DLT award that expired 04/30/2026. SEWP is available to us only under a **SEWP VI reseller LOA**, which we do not yet hold.

**Corrected from the earlier web-research draft:**
- Equalis contract number is **`R10-1173F`**, not `EQ-013120-01E` (that was an earlier Equalis award).
- **NASPO ValuePoint is OEM-awarded** (HP Inc., HPE, Ericsson, Palo Alto Networks, Panasonic) via TD SYNNEX — it is not a single TD SYNNEX award.
- 20 59 does **not** appear in the Equalis `R10-1173F` reseller roster (341 resellers checked, 0 matches) — Equalis is framed as a TD SYNNEX-awarded vehicle we sell under, not as an Equalis-listed reseller.
- CMAS is **not** on the 2025-2026 linecard; retained with a "confirm with the desk" caveat.

**Legal action — D&H marketing restriction (RESOLVED 2026-10-22 by removal, not by permission):**
D&H Reseller Agreement §13.1: *"Reseller may not create any press release or use D&H or NCPA's names in any external marketing without the prior permission granted by D&H and/or NCPA, respectively."* **Decision taken: D&H was removed from every public-facing surface** (`contracts.html`, `index.html`, `it-capabilities.html`, `rfq.html`, `compliance.html`, `llms.txt`, `llms-full.txt`, and the transactional RFQ emails). The executed D&H agreement itself remains in force — it is an internal record, not marketing.

**Ingram Micro was considered as the replacement and was rejected.** No Ingram Micro reseller agreement exists in the corporate records (only `D&H Authorization Omnia Auth.pdf` and `Reseller agreements\Apple-Non-Authorized-Rider-6.pdf`), so publishing "Authorized Wholesale Distribution via Ingram Micro" would have been an unsubstantiated claim — the same failure mode we had just corrected on the contract vehicle data. **No substitute distributor was named.** The public surfaces now name **only TD SYNNEX** (verified) plus the OEM authorizations, and where the vehicle table needs the schedule holder it says "our Tier-1 distribution partner". Revisit only if an executed Ingram Micro agreement is on file.

**Remaining follow-up:** the NCPA name is also restricted by §13.1. The public pages still publish "NCPA 01-170". Either obtain NCPA's written permission or replace "NCPA" with "OMNIA Partners" publicly — the contract number itself is accurate and safe to publish.

**Open data item — address mismatch:**
The D&H authorization form lists **1537 33rd Ave, Tuscaloosa, AL 35401**; the website, SAM.gov record, and `sam_entity_status.json` list **212 W Troy St, Dothan, AL 36303**. Reconcile before the next contract registration or renewal.

**Public presentation decision — no expiry dates on the site (2026-10-22):**
The published vehicle tables carry **no dates**. Rationale: a table of expiry dates and "Term expired" flags reads as a
stale audit spreadsheet, which is exactly the neglect signal we are removing. Instead the portfolio carries a **Track
record** column with three states — *20 59 authorized reseller* (24 vehicles), *Active — portfolio* (35), and
*Completed* (18) — and the contracting desk confirms terms at quote time.

**Critical consequence:** because the public page carries no dates, **the badge status must be recomputed against the
current date before every publish**, not copied from the linecard. Doing it the other way is how three NASPO
ValuePoint OEM awards (`AR3189` Ericsson, `AR3228` HPE Datacom, `AR3229` Palo Alto Networks) were published as
"Available to 20 59" for three weeks after they lapsed on 09/30/2026. The status is now derived from each vehicle's
term at build time, and the authoritative dated record lives in **Appendix A of `MASTER_OPERATIONS_MANUAL_SOP.md`**.

**Renewal watchlist — 18 completed vehicles as of 2026-10-22** (full dated register in the SOP):

| Vehicle | Contract # | Lapsed |
|---|---|---|
| TX DIR — Software | `TX DIR-TSO-4383` | 11/19/2025 |
| New York OGS — Blackboard | `PM69700` | 11/29/2025 |
| State of Ohio Multi-Vendor IDIQ | `534042` | 04/10/2026 |
| State of California Multiple Award Schedule (CMAS) | `3-16-70-1047B` | 04/11/2026 |
| CIO-CS | `HHSN316201500012W` | 04/29/2026 |
| NASA SEWP V | `NNG15SC07B` / `NNG15SC98B` | 04/30/2026 |
| DoD — Rancher Government ESI | `NNG15SC98B` | 04/30/2026 |
| Equalis Group — Cybersecurity | `COG2127B` | 04/30/2026 |
| City of San Francisco, CA — Autodesk Software IDIQ | `1000015124` | 06/30/2026 |
| NASPO ValuePoint — Panasonic Connect North America | `MA23019` | 06/30/2026 |
| State of California Software License Program — Oracle | `SLP-23-0-0068K` | 08/31/2026 |
| University of Maine — Autodesk IDIQ | `2020-016` | 09/13/2026 |
| NASPO ValuePoint — Cloud | `AR2480` | 09/15/2026 |
| NASPO ValuePoint — Oracle | `AR2487` | 09/15/2026 |
| 2GIT | `47QTCA21A000Y` | 09/30/2026 |
| **NASPO ValuePoint — Ericsson Enterprise Wireless** | `AR3189` | **09/30/2026** |
| **NASPO ValuePoint — HPE Datacom** | `AR3228` | **09/30/2026** |
| **NASPO ValuePoint — Palo Alto Networks** | `AR3229` | **09/30/2026** |

**Do not quote against any of these without confirming renewal status with TD SYNNEX (`contracts@tdsynnex.com`).**

**Positioning decision — do not read as a middleman:**
The procurement surface was restructured so the distributor is a supply-chain detail rather than the headline. The vehicle table dropped its "Awardee" column; the vehicle, contract number, term, and 20 59's role now lead. Three promise cards ("One contract / One point of contact / One accountable supplier") and a rewritten disclosure now say plainly that the vehicle determines the paperwork while 20 59 owns the delivery. Accuracy is preserved — we never claim to hold a schedule we do not hold — but the buyer-facing read is "one accountable supplier."

---

## 3.3 Presentation & responsive pass — 2026-10-22

Removing dates and the stale copyright was only half of it. The same pass fixed several layout defects that were
making the site look unmaintained:

| Defect | Fix |
|---|---|
| **`© 2024` on all 14 pages** in 2026 | Hardcoded `© 2026`. Consider a shared `js/footer-year.js` so it never goes stale again. |
| **Nav overflowed its container by ~83px** and squeezed "Contract Vehicles" onto two lines | `white-space: nowrap` on `.nav-link`; gap 32 → 24; nav collapse breakpoint moved 1024px → 1200px (the container max-width) so the desktop nav only renders when it fits. Homepage: logo subtitle shortened to one line, CTA shortened to "Submit RFQ", and the redundant "Procurement" anchor removed (the dedicated Contract Vehicles page supersedes it). |
| **CSS was cached with no version query on 12 of 14 pages** | Bumped to `apple-style.css?v=7` everywhere. **Without this, the nav fix would never have reached returning visitors.** Check this on every future CSS change — most pages had no cache-buster at all. |
| **Horizontal page scroll on phones/tablets** (printable capability sheet, flyers, contact form, compliance cards, long email links) | `overflow-x: auto` on the print-artifact wrappers; `min-width: 0` on flex/grid children that refuse to shrink; `minmax(min(Npx, 100%), 1fr)` on 17 fixed-minimum grid tracks; `overflow-wrap: anywhere` on long email addresses. |
| **Vehicle tables unbalanced** | Explicit column widths per table; the repeated "Authorized reseller on this vehicle" label shortened to "Authorized reseller" so it fits one line; a mobile-only "swipe the table sideways" affordance added. |

Verified across **160 page/viewport combinations** (10 pages × 16 widths from 1920px down to 320px): zero horizontal
overflow, zero wrapped nav labels, zero nav container overflow.

**Encoding defect found and fixed:** `contracts.html` shipped in commit `38a19bd` with 24 mangled em-dashes and 2 mangled en-dashes — a PowerShell `Get-Content`/`WriteAllLines` round trip re-encoded UTF-8 as ANSI. Repaired; the repo now contains zero mojibake across all files. Lesson: never round-trip UTF-8 through PowerShell 5.1 `Get-Content` without `-Encoding UTF8`.

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
| CMMC | `index.html` said *"CMMC Level 2 … Compliant"*; four other surfaces said *"working toward CMMC L2"* | **CMMC Level 2 readiness** on all surfaces — backed by a CMMC L2 Final Self-Assessment in SPRS; certification is not claimed because no C3PAO assessment is on file |
| Inventory | *"granting direct access to multi-million dollar IT inventory"* (`it-capabilities.html:1077`) | Rewritten — we resell through Tier-1 distributors, we do not own inventory |
| Partner set | `llms.txt`, `llms-full.txt`, and every transactional email in `functions/api/rfq.js` omitted D&H and Jabra | All surfaces now list the same partner set |
| Vehicles | Zero named anywhere | Named with awardee + contract number + participation model |

**SPRS CMMC record verified (2026-10-22).** The public card is now sourced from the SPRS Cyber Reports Detail
screen rather than asserted. `compliance.html` publishes the **CMMC Level 2 Self-Assessment (SPRS)** record: CMMC
Unique Identifier **S200081625** · assessment type **CMMC L2 Final Self-Assessment** · assessed **10/22/2026** ·
affirmation expiration **10/22/2027** · CMMC status expiration **10/22/2029** · scope **Enterprise** · included CAGE
**22DH9** · NIST SP 800-171 score **110** (maximum possible) · SSP assessed **SOP-2059-CA-003 System Security Plan
rev 1.18** · Plans of Action and Milestones **none open**. The SPRS account shows **CMMC Level 2 (Self) = 1** and
**CMMC Level 2 (C3PAO) = 0**. The same identifiers and expiry dates are echoed in the homepage procurement block, the
IT capabilities sidebar, the RFQ fast-facts sidebar, `llms.txt`, and `llms-full.txt`.

**Correction:** the previous pass cited DoD UID `SB00164625` and an assessment date of `10/02/2026`. Those values did
not match the SPRS CMMC record and were replaced with `S200081625` / `10/22/2026`. Any NIST SP 800-171 record can be
cited separately only if captured from the NIST tab.

**Note on wording:** a CMMC self-assessment, even at "Final" status, is not a CMMC Level 2 certification. Certification
requires a C3PAO assessment; because the C3PAO tab shows 0, the site claims readiness only and does not use "certified".

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
