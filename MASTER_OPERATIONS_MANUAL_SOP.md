# 20/59 VENTURES CORP.
## MASTER OPERATIONS MANUAL — STANDARD OPERATING PROCEDURES (SOP)
**Version 1.7 — Effective October 2026 | Revised: October 24, 2026**

---

### Corporate Identity & Document Control
* **Legal Entity:** 20 59 Ventures Corp. (State of Alabama Incorporation)
* **Headquarters:** 212 W Troy St, Dothan, AL 36303
* **Regional Service Hubs:** Tuscaloosa, Dothan, and Montgomery, Alabama
* **Executive Leadership:**
  * **Andrea Marcus**, President & Chief Executive Officer
  * **Quincy Ruffin**, Program Director & Chief Operating Officer
* **System Repository:** Odoo Community Edition Knowledge Base (`IAM_Main`, Company ID 4) and Enterprise Cloud Vault
* **Document Status:** *Controlled Document — maintain the current approved edition in the system repository.*

---

## QUICK REFERENCE: DAILY OPERATIONS
*Use this section for immediate operational decisions. Refer to the full SOP modules for complete requirements.*

### Emergency Contacts
| Contact | Use For |
| :--- | :--- |
| **911** | Life-safety emergencies, fire, overdose, active violence |
| **988, Press 1** | Veterans Crisis Line and urgent behavioral-health crisis support |
| **205-534-8492** | Program Director escalation and operational emergencies |
| **info@2059ventures.online** | Referral intake and agency correspondence |

### Critical Response Timelines
| Event | Required Timing | Action |
| :--- | :--- | :--- |
| **Incident** | Within 1 hour | Verbal notice to Program Director |
| **Incident Report** | Within 24 hours | Upload factual report and supporting details to Odoo |
| **Caseworker Briefing** | Within 48 hours | Provide coordinated status update |
| **Priority 1 Maintenance** | Under 4 hours | Dispatch for life-safety or essential-service failure |
| **Priority 2 Maintenance** | Under 24 hours | Dispatch for urgent but non-life-safety issue |
| **Priority 3 Maintenance** | Under 72 hours | Schedule routine repair |

### Rates, Authority, and Resident Rules
| Reference | Standard | Operational Note |
| :--- | :--- | :--- |
| **COC Property Retainer** | $375 / home / month | Includes two walkthroughs weekly and supply/cleaning coordination |
| **COC Intake Fee** | $50 / completed intake | Paid for assigned intake completed and documented |
| **COC Turnover Audit** | $25 / exit | Move-out inspection, keys, code removal, and turnover preparation |
| **Routine Purchase** | Under $250 | Community Operations Coordinator (COC) or Program Director authority |
| **President Approval** | Over $1,000 | Written approval required before expenditure |
| **Quiet Hours** | 10:00 PM – 7:00 AM | Daily; zero overnight guests permitted |

### Mandatory Workforce Compliance & Certifications (COC Position)
| Certification | Provider & Cost | Completion Deadline | Annual Renewal | Filing Requirement |
| :--- | :--- | :--- | :--- | :--- |
| **HIPAA Compliance Training Program** | [HIPAA Training US](https://hipaatraining.us/) (100% Free) | **Prior to Starting / Pre-Placement** | Required (1 Year) | Digital certificate on file under Odoo Personal Profile (`hr.employee` / `res.partner`) |
| **OSHA for Healthcare: Bloodborne Pathogens** | [EPICourses](https://epicourses.com/product-category/free-healthcare-compliance-training-courses/) (100% Free) | **Within 30 Days of Hire / Engagement** | Required (1 Year) | Digital certificate on file under Odoo Personal Profile (`hr.employee` / `res.partner`) |

---

## TABLE OF CONTENTS
* **MODULE 01: CORPORATE FOUNDATION & GOVERNANCE**
  * `[SOP-2059-CORP-001]` Mission, Vision, Core Values & Service Demographics
  * `[SOP-2059-CORP-002]` Organizational Hierarchy, Leadership Roles & COC Specification
  * `[SOP-2059-CORP-003]` Corporate Certifications, SAM.gov, NPI & Socioeconomic Standing
  * `[SOP-2059-CORP-004]` Regulatory Compliance, Fair Housing & HIPAA Standards
  * `[SOP-2059-CORP-005]` Document Retention, Security & Information Governance
  * `[SOP-2059-CORP-006]` Mandatory Workforce Compliance Training, Certification & Chatter Automation Protocol
  * `[SOP-2059-CORP-007]` Role-Based Security Training for CUI Protection, Access Control & System Security (CMMC 2.0 AT.L2-3.2.1/3.2.2/3.2.3)
* **MODULE 02: HOUSING OPERATIONS & RESIDENT LIFECYCLE**
  * `[SOP-2059-HOUS-001]` Referral Intake & Admissions Workflow
  * `[SOP-2059-HOUS-002]` Resident Screening & Low-Barrier Acceptance Criteria
  * `[SOP-2059-HOUS-003]` Resident Move-In, Room Assignment & Orientation
  * `[SOP-2059-HOUS-004]` Resident Stay, Case Coordination & Weekly COC Walkthroughs
  * `[SOP-2059-HOUS-005]` Planned Transition & Involuntary Programmatic Discharge *(Mobile Initiation via TECH-007)*
  * `[SOP-2059-HOUS-006]` Progressive Disciplinary & 3-Strike System *(Mobile Intake via TECH-007)*
  * `[SOP-2059-HOUS-007]` Master Forms & Operational Documents Index
* **MODULE 03: TECHNOLOGY, AUTOMATION & OUTREACH**
  * `[SOP-2059-TECH-001]` Housing Facility Automation Platform Operational Run-Rules
  * `[SOP-2059-TECH-002]` Agency Outreach & Caseworker Partnership Pipeline
  * `[SOP-2059-TECH-003]` Harry AI Intake Dispatch & Human Oversight Protocols
  * `[SOP-2059-TECH-004]` Data Protection, Consent & Communications Security
  * `[SOP-2059-TECH-005]` **Mobile COC Walkthrough & Photo Audit Tool — Full SOP** *(v1.1)*
  * `[SOP-2059-TECH-006]` Digital Platform Expansion Roadmap: CRM Property Profiles & COC Profiles *(v1.1)*
  * `[SOP-2059-TECH-007]` **Mobile COC Strike Notice & Resident Discharge Reporting Tool — Full SOP** *(v1.2)*
  * `[SOP-2059-TECH-008]` **Telnyx Wholesale SMS Gateway & Multi-Company Dispatch** *(v1.2)*
  * `[SOP-2059-TECH-009]` **Unified Email Platform, Odoo Marketing & Carrier Relay Architecture** *(New — v1.3)*
  * `[SOP-2059-TECH-010]` **TD SYNNEX Distributor Procurement Integration — Read-Only Price Gateway** *(New — v1.5)*
  * `[SOP-2059-TECH-011]` **Enterprise System Architecture Defense, CMMC/NIST SP 800-171 & JCP Compliance** *(New — v1.6)*
  * `[SOP-2059-GOV-004]` **GovCon CRM & Defense Procurement Workflow (Tracks A & B, WAWF Engine)** *(New — v1.7)*
  * `[SOP-2059-GOV-005]` **Simplified Delivery Procurement (SDP) & Federal IT Storefront Operations** *(New — v1.8)*
* **MODULE 04: FINANCIAL MANAGEMENT, RATES & BILLING**
  * `[SOP-2059-FIN-001]` Room Rate Determination & Calculator Methodology
  * `[SOP-2059-FIN-002]` Voucher Processing, Direct Billing & Copay Collections
  * `[SOP-2059-FIN-003]` Odoo Community ERP Accounting & Invoicing SOP
  * `[SOP-2059-FIN-004]` Banking, Treasury, Mercury & Stripe Operations
* **MODULE 05: FACILITIES, SAFETY & MAINTENANCE**
  * `[SOP-2059-FAC-001]` Property Standards, Cleanliness & Living Checklists
  * `[SOP-2059-FAC-002]` Routine & Emergency Maintenance Procedures
  * `[SOP-2059-FAC-003]` Ozone Sanitization & Environmental Safety Protocol (`SOP-2059-ACQ-001`)
  * `[SOP-2059-FAC-004]` Property Emergency Response & Crisis Protocols
  * `[SOP-2059-FAC-005]` Mandatory Incident Reporting & 24-Hour Escalation
* **MODULE 06: FUTURE SERVICES FRAMEWORK (PRE-LAUNCH NPI CAPACITIES)**
  * `[SOP-2059-FUT-001]` Non-Emergency Medical Transportation (NEMT) Blueprint
  * `[SOP-2059-FUT-002]` Nutritional & Home Meal Coordination Blueprint
* **MODULE 07: APPENDICES & IMPLEMENTATION TOOLS**
  * `[SOP-2059-APP-001]` 12-Month Rolling Corporate Compliance Calendar
  * `[SOP-2059-APP-002]` Preferred Vendor & Service Provider Directory Template
  * `[SOP-2059-APP-003]` Standalone Incident & Disciplinary Report Form
  * `[SOP-2059-APP-004]` Resident Handbook & Community Living Outline
* **EXECUTIVE SIGN-OFF & ADOPTION**

---

# MODULE 01: CORPORATE FOUNDATION & GOVERNANCE

### [SOP-2059-CORP-001] Mission, Vision, Values & Target Populations
1. **Purpose & Scope:** This document defines the foundational purpose, guiding mission, strategic vision, core ethical principles, and authorized service demographics of 20/59 Ventures Corp. This standard applies enterprise-wide across all operational divisions, regional service hubs (Tuscaloosa, Dothan, and Montgomery, AL), residential supportive housing facilities, digital platforms, and third-party contractor relationships.
2. **Corporate Mission Statement:**
   > *"20/59 Ventures Corp. delivers dignity, safety, and long-term stabilization to vulnerable individuals through integrated supportive housing placement, dedicated community living facilities, and coordinated healthcare logistics."*
   We bridge the critical gap between public assistance programs, healthcare case managers, and private residential real estate by offering rapid, reliable, and compassionate transitional and supportive community housing.
3. **Strategic Vision:** To serve as the premier, trusted Southeast regional supportive housing and healthcare logistics partner for the U.S. Department of Veterans Affairs (VA), local housing authorities, healthcare systems, and municipal re-entry agencies—scaling a standardized model of community living that pairs safe shelter with structured, supportive pathways to permanent independence.
4. **Core Operating Values:**
   * **Dignity First:** Every resident, regardless of background, disability, or circumstance, is treated with foundational human respect, clear expectations, and equitable access.
   * **Integrity & Compliance:** We hold ourselves to uncompromising standards of federal, state, and local regulatory adherence across SAM.gov, CMS/NPI, Fair Housing, and municipal housing codes.
   * **Radical Reliability:** When a caseworker, VA coordinator, or agency refers a client, our team moves with speed, clarity, and accountability to prevent homelessness and stabilize lives.
   * **Operational Excellence:** We utilize modern ERP systems (Odoo Community), data-driven room calculators, and rigorous field audits (COC inspections, ozone sanitization) to maintain clean, safe, and sustainable properties.
   * **Community Stewardship:** We build thriving neighborhoods by fostering quiet, respectful, and well-maintained shared residences that benefit both occupants and surrounding communities.
5. **Authorized Service Demographics:**
   1. **U.S. Military Veterans:** Including participants enrolled in HUD-VASH (HUD-Veterans Affairs Supportive Housing), Supportive Services for Veteran Families (SSVF), and VA Healthcare referral networks.
   2. **Disability & Supplemental Security Income (SSI / SSDI) Recipients:** Individuals requiring accessible, affordable shared housing stabilized by predictable social security or disability benefits.
   3. **Low-Income & Workforce Transition Clients:** Individuals transitioning from municipal shelters, workforce training programs, or emergency housing into stable independent living.
   4. **Re-Entry & Legal Aid Referrals:** Individuals vetted through legal aid partners and municipal transition programs working toward societal re-integration and self-sufficiency.

---

### [SOP-2059-CORP-002] Organizational Structure, Roles & COC Specification
1. **Organizational Hierarchy:**
   * **President (Andrea Marcus):** Executive governance, legal standing, certification renewals (SAM.gov, VOSB, WOSB, UCP), banking & treasury oversight, master commercial lease execution, and primary approval for expenditures over $1,000.
   * **Program Director (Quincy Ruffin):** Supportive housing operations, property management, caseworker relationship management, system administration (Housing Platform & Odoo), COC coordination, incident review, and expenditure authority up to $1,000.
     * *Dual Execution State:* Quincy Ruffin initially functions in the lead Community Operations Coordinator (COC) role across the first 1–2 properties.
   * **Community Operations Coordinators (COCs):** Independent contractors (1099) managing localized clusters of supportive homes.
2. **Community Operations Coordinator (COC) Operating Charter:**
   * **Weekly Walkthroughs:** Complete two (2) routine physical walkthroughs per home weekly utilizing the standardized mobile photo inspection checklist.
   * **Resident Onboarding:** Conduct assigned shelter pickups, assist with digital intake paperwork, and orient new residents.
   * **Vendor & Supply Stewardship:** Coordinate cleaning crews and restock common household supplies.
   * **Software Scouting:** Screen prospective properties on 20/59 scouting tools.
   * **Discharge & Turnover Audits:** Complete move-out audits, recover keys, and prepare rooms for the next resident.
3. **Activity-Based Compensation Schedule:**
   * **Monthly Property Retainer:** $375.00 / home / mo (Guaranteed base for 2 walkthroughs/wk, supplies & cleaning coordination).
   * **Assigned Intake Fee:** $50.00 / completed intake (Paid per completed intake assigned & executed).
   * **Discharge & Turnover Audit:** $25.00 / exit (Per room turnover audit, key collection & unit prep).
   * **New Property Launch Fee:** $250.00 / new house (Paid when assigned full staging oversight & furniture coordination).
   * **Mileage Reimbursement:** IRS Standard Rate ($0.76/mi) (Reimbursed on all assigned shelter pickups, property routes, and urgent dispatches, tracked via MileIQ or Driversnote).
4. **Mandatory Workforce Certifications & Compliance Credentials (COC Positions):**
   To uphold high-standard supportive housing operations, safeguard resident Protected Health Information (PHI) under our National Provider Identifier (NPI `1932035060`), and protect workforce health and safety across shared residential homes, all Community Operations Coordinators (COCs) / Coordinators of Care must complete and maintain two (2) mandatory certifications:
   * **1. HIPAA Compliance Training Program (Pre-Hire / Day 1 Requirement):**
     * **Training Portal:** [HIPAA Training US](https://hipaatraining.us/) (100% Free Online Course).
     * **Timeline:** **Mandatory prior to starting / pre-placement.** Must be completed, certified, and filed before conducting resident intakes, reviewing referral paperwork, accessing tenant PII/PHI, or executing property visits.
     * **Curriculum:** Introduction to HIPAA, The Privacy Rule, The Security Rule, Breach Notification & Enforcement, and HIPAA Compliance Best Practices.
     * **Duration & Credential:** 0.5 Credit Hours; formal Certificate of Completion with unique Certificate ID.
     * **Renewal Cycle:** Annual recertification required (valid for 1 year from date of issue).
   * **2. OSHA for Healthcare with Bloodborne Pathogens Training (30-Day Requirement):**
     * **Training Portal:** [EPICourses / EPICompliance](https://epicourses.com/product-category/free-healthcare-compliance-training-courses/) (100% Free Healthcare Compliance Training).
     * **Timeline:** **Mandatory within thirty (30) days of hire / engagement.**
     * **Curriculum:** OSHA Healthcare Safety Standards (29 CFR 1910.1030 & 1910.120), Bloodborne Pathogens (HBV, HIV), Universal Precautions, Needle-stick Safety and Prevention Act, Exposure Control Plan, Sharps Injury Log, Biomedical Waste Handling, Disposal Containers, Personal Protective Equipment (PPE), Safety Data Sheets (SDS), and Workplace Hazard Communication.
     * **Duration & Credential:** 2.0 Contact Hours; formal Certificate of Achievement signed by accredited compliance leadership.
     * **Renewal Cycle:** Annual recertification required (valid for 1 year from date of issue).
5. **Personnel Recordkeeping & Odoo Profile Governance:**
   * **Mandatory File Retention:** Active digital copies of all completed certification certificates must be permanently maintained on file under the worker's official personal profile in Odoo Community ERP (both `hr.employee` and linked `res.partner` records) as verified `ir.attachment` records.
   * **Resume & Credentials Ledger:** Verified certifications are cataloged under the employee's `Certifications & Compliance` profile tab (`hr.resume.line`) specifying issuance date, expiration date, and accreditation credential ID.
   * **Compliance Audits & Renewal Alerts:** Program Director reviews the corporate workforce compliance registry quarterly. Automated 30-day pre-expiration notices are dispatched to workers to ensure timely renewal without lapse in credentialing.

---

### [SOP-2059-CORP-003] Corporate Certifications, Credentials & Identifiers
* **Master Identifiers:**
  * **Legal Entity:** 20 59 Ventures Corp. (State of Alabama Incorporation)
  * **National Provider Identifier (NPI):** 1932035060 (Taxonomy: `193200000X` Multi-Specialty Group)
  * **SAM.gov Unique Entity ID (UEI):** `GVR2NTGR4HU3` | **CAGE Code:** `22DH9` (Active Entity)
  * **Socioeconomic Status:** Veteran-Owned Small Business (VOSB) & Woman-Owned Small Business (WOSB)
  * **UCP Certification:** Approved Alabama UCP (App ID: 112124)
  * **Employment Verification:** E-Verify Enrolled Participant (Right to Work Compliant)
  * **Accreditation:** Better Business Bureau (BBB) Accredited (Rating: A+)
  * **Payment Acceptance:** Government Purchase Cards (GPC / Credit Card) Accepted
* **Registered NAICS Codes:**
  * **624220 (Primary):** Community Housing Services (Temporary, emergency, and supportive housing)
  * **485991:** Special Needs Transportation & Non-Emergency Medical Transit (NEMT)
  * **624210:** Community Food & Home-Delivered Meal Services
  * **531311:** Residential Property Managers
  * **541611:** Administrative Management and General Management Consulting Services

---

### [SOP-2059-CORP-004] Regulatory Compliance, Fair Housing & HIPAA
1. **Fair Housing Act (Title VIII) Compliance:** 20/59 Ventures Corp. strictly prohibits discrimination based on race, color, religion, sex, national origin, familial status, or disability.
   * **Reasonable Accommodations:** Permitting assistance animals (which are not pets and incur zero deposits) and reasonable physical modifications requested by healthcare providers for disabled participants.
2. **HIPAA & Health Privacy Safeguards:** With an active NPI (1932035060), staff and contractors must protect client Protected Health Information (PHI):
   * **Mandatory Pre-Placement Certification:** All workforce members, operations staff, and Community Operations Coordinators (COCs) must successfully complete accredited HIPAA compliance training (via `https://hipaatraining.us/`) prior to interacting with residents, intake documentation, or Protected Health Information (PHI). Active certificates are filed in Odoo personal profiles.
   * Apply the Minimum Necessary Rule to all medical disclosures.
   * Zero transmission of unencrypted clinical diagnosis notes over personal SMS or unencrypted personal email.
   * All case notes and referral memos uploaded directly to secure Odoo CRM records.
3. **Alabama Residential Landlord-Tenant Act Standards:**
   * Compliance with Alabama habitability standards (operable HVAC, potable hot/cold water, structural integrity, smoke/CO detectors).
   * Operating under programmatic supportive housing agreements and covenants.

---

### [SOP-2059-CORP-005] Document Retention, Security & Governance
* **Retention Schedules:**
  * **Corporate Governance Records:** Permanent retention (Bylaws, minutes, stock ledgers).
  * **Tax & Fiscal Records:** 7 Years (Returns, 1099s, bank statements, general ledgers).
  * **Resident Files & Leases:** 5 Years post-discharge (Intake applications, subleases, proof of address letters).
  * **Safety & Incident Reports:** 5 Years (Incident forms, strike notices, discharge letters).
  * **Bi-Weekly Inspections:** 3 Years (Digital mobile walkthrough checklists and photos).

---

### [SOP-2059-CORP-006] Mandatory Workforce Compliance Training, Certification & Chatter Automation Protocol
1. **Universal Compliance Mandate:** To protect resident Protected Health Information (PHI) under NPI `1932035060` and maintain high-standard residential biosafety across all shared supportive homes, all workforce members—including new hires, 1099 Community Operations Coordinators (COCs), and existing personnel—must complete and maintain two (2) accredited, 100% free certifications:
   * **HIPAA Compliance Training (0.5 Credit Hours):** [HIPAA Training US](https://hipaatraining.us/) (Mandatory Pre-Placement / Day 1 prior to resident contact or documentation access).
   * **OSHA for Healthcare: Bloodborne Pathogens (2.0 Contact Hours):** [EPICourses / EPICompliance](https://epicourses.com/product-category/free-healthcare-compliance-training-courses/) (Mandatory within 30 days of hire/engagement).
2. **Automated Submission & Intake Channels:**
   * **Toll-Free Carrier MMS (`+1-888-919-2059`):** Staff text a photo or PDF certificate with keyword `CERT`. The Telnyx relay downloads the media and runs auto-archival.
   * **Dedicated Email Intake (`compliance@2059ventures.online`):** Staff email or forward certificate attachments.
   * **Mobile Self-Service Portal (`https://portal.2059ventures.online/cert`):** Smartphone-optimized upload portal with real-time verification status.
3. **Automated Odoo Archival & Autopilot Recertification:**
   * Certificates are automatically converted and filed as verified `ir.attachment` records under `hr.employee` and `res.partner`.
   * Open compliance activities (`mail.activity`) are automatically marked complete with audit feedback.
   * A rich compliance status card is posted to employee Chatter.
   * The next annual recertification activity is automatically scheduled **11 months out (335 days)**.
4. **Dual Leadership "Good News" Alerts:**
   * Real-time celebration SMS dispatched to **Program Director Quincy Ruffin (`205-534-8492`)** and **Owner & President Andrea Marcus (`205-886-5198`)**.
   * Executive email summary dispatched to `andrea.marcus@2059ventures.online`, `qruffin@2059ventures.online`, and `compliance@2059ventures.online`.
5. **Enforcement & Non-Compliance:** Uncertified personnel are subject to immediate dispatch hold from resident intake and field walkthrough duties.

### [SOP-2059-CORP-007] Role-Based Security Training for CUI Protection, Access Control & System Security (CMMC 2.0)
1. **Scope:** Additionally mandatory for Administrative (CUI-ADMIN), Engineering (CUI-ENG), and Data-Handling (CUI-DATA) roles. Covers CUI/FCI protection, access control protocols (least privilege, MFA, quarterly recertification), system security procedures, and insider-threat recognition/reporting per CMMC 2.0 AT.L2-3.2.1/3.2.2/3.2.3 (NIST 800-171 §3.2).
2. **Timing:** Pre-access Day 0, retrain within 14 days on system/policy change, annual refresher (335-day autopilot).
3. **Evidence:** Signed `AT_Security_Policy_Signoff.pdf` per person/year filed as `ir.attachment` on `hr.employee` + `res.partner` (`docs/AT_Security_Policy_Signoff.pdf`), quiz roster, Chatter card, access-review log.
4. **Full SOP:** See `docs/SOP-2059-CORP-007-Role-Based-Security-Training-CUI.md` (+ PDF twin).

---

# MODULE 02: HOUSING OPERATIONS & RESIDENT LIFECYCLE

### [SOP-2059-HOUS-001] Referral Intake & Admissions Workflow
* **The 5-Step Admissions Lifecycle:**
  1. **Caseworker Initiation:** VA, shelter, or disability caseworker submits referral via email (`info@2059ventures.online`), phone (`1-888-919-2059`), or web portal.
  2. **Eligibility & Vacancy Screening (Program Director):** Verification of funding (HUD-VASH voucher or SSI benefit verification) and bed availability within 24 business hours.
  3. **Digital Intake Execution (Lead COC / COC):** In-person or digital completion of the `PARTICIPANT_INTAKE_PROGRAM_ENROLLMENT_APPLICATION` (`SOP-2059-FORM-005`) and government photo ID collection ($50 COC milestone).
  4. **Room Assignment:** Match participant mobility requirements (ground floor, quiet hours) to available bedroom.
  5. **Move-In Scheduling & Shelter Pickup:** Coordinate transit pickup and execute move-in.

---

### [SOP-2059-HOUS-002] Resident Screening & Low-Barrier Acceptance Criteria
* **Barrier-Reduction Principle:** We do not run consumer credit checks or disqualify applicants for medical debt, poor credit scores, or past evictions.
* **Voucher / Funding Guarantee:** Acceptance is predicated upon confirmed third-party voucher sponsorship or documented benefit awards.
* **Disqualifying Conditions:** Limited strictly to active violent threats toward others, prohibited lifetime sex offenses under local zoning laws, or physical/medical acuity requiring 24/7 skilled nursing care beyond supportive shared housing capacity.

---

### [SOP-2059-HOUS-003] Resident Move-In, Room Assignment & Orientation
* **Mandatory Paperwork Bundle (Day 1):**
  1. Master Commercial Sublease Agreement (`MASTER_COMMERCIAL_LEASE_AGREEMENT.pdf`)
  2. Supportive Housing Program Covenants & House Rules (`SUPPORTIVE_HOUSING_PROGRAM_COVENANTS_HOUSE_RULES.pdf`)
  3. Release of Liability & Waiver (`RELEASE_OF_LIABILITY_UPDATED_CONTACT.pdf`)
  4. Security Camera Disclosure Notice (`SECURITY_CAMERA_DISCLOSURE_NOTICE.pdf`)
  5. Media Release Form (`mediareleaseformprogramform2.docx` — Optional)
* **Issuance of Proof of Address:**
  * Upon signing, provide the resident with the official signed Letter of Verification / Proof of Address (`LETTER_OF_VERIFICATION_PROOF_OF_ADDRESS.pdf` / `SOP-2059-FORM-002`) to update benefits with SSA, VA, and Alabama DMV.

---

### [SOP-2059-HOUS-004] Resident Stay, Case Coordination & Weekly COC Walkthroughs
* **Bi-Weekly COC Walkthrough Protocol (2 Visits / Week):**
  * **Physical Walkthrough:** Inspect kitchen, living room, hallways, bathrooms, and exterior.
  * **Supplies Restock:** Replenish toilet tissue, paper towels, dish soap, hand soap, and trash bags.
  * **Safety Audit:** Confirm smoke and CO detectors have green operational lights; verify locks.
  * **Mobile Photo Log:** COC opens the mobile audit tool via link (`https://sms.iamalgo.com/audit`), completes all Pass/Fail toggles, selects restocked supplies, uploads 8 required time-stamped photos from phone camera, enters defect priority if applicable, and submits. Audit is automatically ingested into Odoo `Field Walkthrough Audits` (Module 05 category) with photos attached as `ir.attachment` records. *See `[SOP-2059-TECH-005]` for full operational procedure.*
  * **Trigger via SMS:** Any COC may text **`AUDIT`** to **`+1-888-919-2059`** to receive a direct link to the walkthrough tool at any time.
  * **Quiet Hours:** 10:00 PM – 7:00 AM daily.
  * **Visitors:** Daytime visiting hours 9:00 AM – 8:00 PM in common areas only; zero overnight guests.
  * **Substance Prohibition:** 100% smoke-free / vape-free indoors; zero illegal drugs on property.

---

### [SOP-2059-HOUS-005] Planned Transition & Involuntary Programmatic Discharge
* **Planned Transition (Graduation):** Resident achieves independence and transitions to permanent housing. Requires 14-day notice, exit inspection, and positive landlord reference.
* **Involuntary Discharge Procedure:**
  * **Grounds:** Accumulation of 3 progressive strikes or immediate zero-tolerance violations (firearms, physical violence, drug distribution).
  * **Digital Incident Reporting:** COC initiates report via Mobile Strike Tool (`https://sms.iamalgo.com/strike` or text `DISCHARGE` to `+1-888-919-2059`) with photo evidence and narrative per `[SOP-2059-TECH-007]`.
  * **Strict Zero-Confrontation Rule:** COC does NOT confront resident. COC reports; Program Director executes.
  * **Automatic Escalation Alert:** System automatically sends instant high-priority SMS alert to Program Director (`+1-205-534-8492`).
  * **Formal Notice & Coordination:** Program Director delivers formal Notice of Programmatic Discharge (`SOP-2059-FORM-006`), provides immediate notice to caseworker within 2 hours, and coordinates safe transition.
* **Turnover Audit ($25 COC Milestone):** Move-out inspection, key collection, digital door code revocation, and scheduling turnover cleaning & ozone sanitization.

---

### [SOP-2059-HOUS-006] Progressive Disciplinary & 3-Strike System
* **Core Philosophy:** Progressive accountability with second chances, documented objectively via the Mobile Strike Tool (`https://sms.iamalgo.com/strike` / text `STRIKE` to `+1-888-919-2059`).
* **COC Role:** Fact-finder and evidence submitter only. COCs do not adjudicate strikes or issue final penalties.
* **Strike 1 (Written Warning):** Initiated via mobile tool; formal notice issued via `PARTICIPANT_STRIKE_NOTICE.pdf` (`SOP-2059-FORM-004`); copy sent to caseworker within 48 hours; establishes a 30-day corrective action plan.
* **Strike 2 (Final Written Warning):** Formal notice and mandatory 3-way conference between resident, Program Director, and caseworker.
* **Strike 3 (Programmatic Discharge):** Issuance of formal Notice of Programmatic Discharge (`SOP-2059-FORM-006`, 7-day transition notice).
* **Severe Violations (Immediate Emergency Discharge):** Firearms/deadly weapons, physical assault, or active illicit drug sales immediately escalate to emergency discharge and 911 police dispatch.
* **Clean Slate Policy:** 60 consecutive days of full compliance expunges one active strike from the resident's Odoo record.

---

### [SOP-2059-HOUS-007] Master Forms & Operational Documents Index
* `SOP-2059-FORM-005`: Participant Intake & Program Enrollment Application (Official 4-Page Standard)
* `SOP-2059-FORM-002`: Letter of Verification & Proof of Address for Resident
* `SOP-2059-FORM-004`: Participant Strike Notice (Corrective Action Notice)
* `SOP-2059-FORM-006`: Notice of Programmatic Discharge (Revocation of Occupancy Permission)
* `SOP-2059-LEASE-001`: Master Commercial Lease & Program Operational Agreement

---

# MODULE 03: TECHNOLOGY, AUTOMATION & OUTREACH

### [SOP-2059-TECH-001] Housing Facility Automation Platform Operational Run-Rules
* **Bi-Weekly Discovery Runs:** Executed every other Tuesday evening to scrape regional agency leads.
* **Monthly Enrichment:** Deep-crawl agency websites for caseworker names and email hooks.
* **Weekly Lead Scrubbing:** Verify every lead has a name and direct email/phone before Odoo sync.
* **Reference:** See technical companion `SOP_Housing_Platform_How_To_Use.md` and Odoo `SOP-2059-OPS-001` for CLI and API operation.

---

### [SOP-2059-TECH-002] Agency Outreach & Caseworker Partnership Pipeline
* **3-Touch Outreach Sequence:**
  * **Touch 1 (Day 1 - Email):** Targeted introduction with capabilities statement, VOSB/WOSB credentials, and housing flyers.
  * **Touch 2 (Day 5 - Phone):** Direct follow-up call to assess active shelter overflow.
  * **Touch 3 (Day 12 - Email):** Current room inventory update across regional hubs.
* **Bi-Weekly Inventory Broadcast:** Send room availability updates to caseworkers on the 1st and 15th of each month.

---

### [SOP-2059-TECH-003] Harry AI Intake Dispatch & Human Oversight Protocols
* **Role:** 24/7 autonomous chatbot on `2059ventures.online` handling intake pre-screening and notification routing.
* **Prohibited AI Actions:** Cannot approve/deny admissions, cannot sign leases, cannot give medical advice, cannot quote binding custom rates.
* **Crisis Escalation:** Language indicating suicidal ideation triggers immediate 988 Veterans Crisis Line info and emergency push notifications to Program Director (205-534-8492).

---

### [SOP-2059-TECH-004] Data Protection, Consent & Communications Security
* **TCPA & 10DLC Compliance:** Affirmative un-checked web opt-in required for SMS communications; automated STOP/HELP keyword support.
* **Security Controls:** Multi-Factor Authentication (MFA) mandatory on Mercury Bank, Odoo Admin, Cloudflare, and SAM.gov.
* **PII Protection:** Zero unencrypted client IDs or SSNs stored on personal mobile photo rolls or local desktop caches.

---

### [SOP-2059-TECH-005] Mobile COC Walkthrough & Photo Audit Tool — Full SOP
*(Introduced v1.1 — September 11, 2026)*

#### 1. Purpose & Scope
This SOP governs the mandatory use of the 20/59 Ventures Mobile COC Walkthrough & Photo Audit application (`coc_audit.py`) for all bi-weekly supportive housing property inspections. The tool replaces paper or informal photo documentation with a standardized, mobile-optimized web form that automatically ingests results into Odoo Community Edition (Knowledge Base, Module 05) with time-stamped photographic evidence.

#### 2. System Architecture
| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | HTML5 / CSS3 / Vanilla JS | Zero-install mobile web app. Opens in any smartphone browser. |
| **Backend** | FastAPI (Algo Text gateway, port 8000) | Receives JSON submission; routes to Odoo XML-RPC. |
| **SMS Trigger** | Telnyx toll-free `+1-888-919-2059` | Inbound keyword `AUDIT`, `WALKTHROUGH`, or `CHECKLIST` auto-replies with the link. |
| **Data Store** | Odoo `document.page` — Module 05 KB | Each audit creates a permanent record under `Field Walkthrough Audits`. |
| **Photo Storage** | Odoo `ir.attachment` (base64 JPEG) | Up to 8 photos attached to each audit record; client-side compressed before upload. |
| **Public URL** | `https://sms.iamalgo.com/audit` | Routed via Cloudflare Tunnel `sms-gateway` → `127.0.0.1:8000/audit`. |
| **Emergency SMS** | Telnyx → `+1-205-534-8492` | Automatic Priority 1 alert SMS to Program Director when flagged. |

#### 3. Step-by-Step COC Operating Procedure
1. **Receive Link:** Text `AUDIT` to `+1-888-919-2059` from your phone. You will immediately receive a text with the walkthrough link. Alternatively, Program Director may text the link directly before each visit via `send_audit_link.py`.
2. **Open on Mobile:** Tap the link. The form opens in your default mobile browser — no app download required.
3. **Select Property:** Choose the property address from the dropdown or enter a custom address. Select your visit type (Routine Visit 1 or 2, Emergency, or Turnover Audit).
4. **Enter COC Details:** Enter your name and phone number. The confirmation SMS will be sent to your phone number upon successful submission.
5. **Complete Life-Safety Audit:** Tap **PASS** or **ATTENTION** for each item:
   - Smoke Detectors (all rooms)
   - Fire Extinguisher (green zone, charged)
   - Narcan / First Aid Kit (stocked)
   - Exterior & Egress (grounds, locks, lighting)
6. **Log Supplies Restocked:** Tap the chips for each supply item restocked during the visit.
7. **Upload 8 Required Photos:** Tap each camera slot to capture:
   1. Front Exterior & Grounds
   2. Living Room / Entry
   3. Kitchen Counters & Sink
   4. Refrigerator Shelves
   5. Bathroom 1 (primary)
   6. Bathroom 2 / Hall Bath
   7. Fire Extinguisher & Narcan (First Aid Kit)
   8. Utility Closet / HVAC Filter
8. **Flag Maintenance Defects:** If any maintenance issue is observed, select priority level:
   - **None** — No issues
   - **Priority 3** — Routine (< 72 hr)
   - **Priority 2** — Urgent (< 24 hr)
   - **Priority 1 — Emergency** — Life-safety hazard (< 4 hr)
9. **Add Resident Notes:** Enter brief welfare notes or observations.
10. **Sign & Submit:** Type your name in the certification field. Tap **Submit Walkthrough to Odoo**.

#### 4. Automated System Actions Upon Submission
* Odoo `document.page` record created under `Field Walkthrough Audits` → `Module 05: Facilities, Safety & Maintenance`.
* All uploaded photos attached as `ir.attachment` records (named `Audit_[Area]_[Date].jpg`).
* **If Priority 1 flagged:** Automatic emergency SMS dispatched to Program Director (`+1-205-534-8492`) with property, defect description, and COC contact.
* **COC Confirmation SMS:** If phone number was entered, a confirmation text is sent acknowledging the audit was logged with photo count.

#### 5. Compliance & Retention
* Completed audits must be submitted **within 30 minutes of completing each physical walkthrough**.
* Audit records are retained for **3 years minimum** per `[SOP-2059-CORP-005]`.
* Photos must be captured **at the property during the visit** — no stock or archival photos permitted.
* Submission without minimum 4 photos will be flagged as incomplete by Program Director during monthly review.

#### 6. Manual Link Dispatch (Program Director)
To proactively send the walkthrough link to a COC before a scheduled visit:
```
python scripts/tools/send_audit_link.py --phone [COC_10_DIGIT] --name "[COC Name]" --property "[Address]" --url "https://sms.iamalgo.com/audit"
```

#### 7. Troubleshooting
| Symptom | Cause | Resolution |
| :--- | :--- | :--- |
| No reply after texting AUDIT | Gateway service may be stopped | Program Director restarts Algo Text service on port 8000 |
| Photos fail to upload | Image too large or network timeout | Use on Wi-Fi; photos are auto-compressed but retry if > 5 MB raw |
| Submission error on final step | Odoo server unavailable | Notify Program Director; Odoo Docker may need restart (`docker start odoo`) |
| Link not loading | Cloudflare tunnel offline | Program Director checks tunnel `sms-gateway` via Cloudflare dashboard |

---

### [SOP-2059-TECH-006] Digital Platform Expansion Roadmap: CRM Property Profiles & COC Profiles
*(Introduced v1.1 — September 11, 2026)*

#### Purpose
This section documents the planned integration roadmap for expanding the Mobile COC Audit Tool beyond basic walkthrough logging into a full property intelligence and workforce management platform.

#### Planned Phase 2 Capabilities

| Feature | Description | Timeline |
| :--- | :--- | :--- |
| **CRM Property Profiles** | Each audit submission auto-populates or updates an Odoo CRM record for the inspected property (address, resident count, last audit date, cumulative defect history, maintenance trends). | Phase 2 |
| **COC Profiles** | Individual contractor dashboards in Odoo CRM showing audit count, average photo quality score, defect catch rate, response time to Priority 1 events, and monthly earnings summary. | Phase 2 |
| **Audit Analytics Dashboard** | Aggregated property health dashboard showing: defect frequency by property, supply restock patterns, COC walkthrough compliance rate (% completed vs. required per month). | Phase 2 |
| **Scheduling Integration** | Auto-generate COC walkthrough calendar from Odoo using property list; dispatch SMS reminders 1 hour before each scheduled visit. | Phase 3 |
| **Resident Welfare Flag** | Add a resident-initiated SMS keyword (e.g., text `HELP` to `+1-888-919-2059`) to open a welfare request form routed to Program Director. | Phase 3 |
| **Vendor Dispatch from Audit** | Priority 1 defect automatically opens a maintenance work order in Odoo, pre-fills vendor list, and triggers vendor notification SMS. | Phase 3 |
| **Move-In & Turnover Audit Forms** | Separate form variants in the same app for new resident move-in condition documentation and exit turnover audits. | Phase 3 |

#### Development Principles
* All new form types use the same `coc_audit.py` FastAPI + Odoo XML-RPC pattern — zero additional servers required.
* CRM integration uses Odoo's native `crm.lead` and `res.partner` models with property address as the unique CRM record key.
* All SMS interactions continue through the existing Telnyx toll-free `+1-888-919-2059` number with additional keyword routing.
* Privacy: COC profile data is accessible only to Program Director and President — not to other COC contractors.

---

### [SOP-2059-TECH-007] Mobile COC Strike Notice & Resident Discharge Reporting Tool — Full SOP
*(Introduced v1.2 — September 11, 2026)*

#### 1. Purpose & Core Operational Safeguard
This SOP governs the digital reporting of resident rule violations, progressive disciplinary strikes, and emergency programmatic discharges across all supportive housing properties using `coc_strike.py`.

> [!CAUTION]
> **STRICT ZERO-CONFRONTATION MANDATE:**  
> Community Operations Coordinators (COCs) are independent 1099 contractors responsible for property oversight and factual documentation. **COCs DO NOT have authority to verbally evict, remove, or physically confront a resident.**  
> - **COC Role:** Document facts, select violation categories, upload photographic evidence, and submit.  
> - **Director Role:** Program Director (Quincy Ruffin) executes all disciplinary actions, serves formal notices (`SOP-2059-FORM-004` / `FORM-006`), coordinates with sponsoring caseworkers, and manages law enforcement if required.

#### 2. System Architecture & Access
| Component | Details |
| :--- | :--- |
| **Tool URL** | `https://sms.iamalgo.com/strike` (via Cloudflare Tunnel `sms-gateway`) |
| **SMS Gateway** | Telnyx toll-free `+1-888-919-2059` |
| **SMS Triggers** | Text keyword `STRIKE`, `DISCHARGE`, or `VIOLATION` to receive the mobile link instantly |
| **Backend** | FastAPI endpoint `/api/v1/strike/submit` running in `Algo Text` (port 8000) |
| **Database Target** | Odoo `document.page` records in Module 02 (`Resident Discipline & Discharges`) |
| **Evidence Photos** | Attached as `ir.attachment` records to the incident report |
| **Emergency SMS Alert** | Automatic instant text to Program Director (`+1-205-534-8492`) on Emergency or Strike 3 |

#### 3. Step-by-Step Reporting Procedure
1. **Safety First:** If active violence or weapons are present, retreat to safety and call **911** first.
2. **Access Form:** Text `STRIKE` to `+1-888-919-2059` or open `https://sms.iamalgo.com/strike`.
3. **Property & Resident Identification:** Select property address, resident full name, and room/bed number.
4. **Select Action Level:** Strike 1 (Written Warning), Strike 2 (Final Warning), Strike 3 (Discharge Notice), or Emergency Discharge (Immediate Revocation).
5. **Violation Tags:** Select all applicable tags (e.g., unauthorized overnight guests, indoor smoking/vaping, noise, food theft, weapons, physical altercations).
6. **Upload Evidence:** Take or upload clear photos of physical evidence (contraband, property damage, cigarette butts, etc.).
7. **Factual Narrative:** Detail exactly what occurred (date, time, witness accounts, direct observations).
8. **Submit:** Upon submission, report is logged into Odoo KB, evidence attached, Director alerted if critical, and confirmation text sent to COC.

---

# MODULE 04: FINANCIAL MANAGEMENT, RATES & BILLING

### [SOP-2059-FIN-001] Room Rate Determination & Calculator Methodology
* **Baseline Cost Modeling:** All rates calculated via `2059_Ventures_Room_Rate_Calculator_V2_4.xlsx` factoring in lease rent, electric, water, trash, high-speed Wi-Fi, $375 COC retainer, cleaning, supplies, and 10% reserve.
* **Target Rate Tiers (Alabama Hubs):**
  * **Tier 1 (Master Suite / En-Suite Bath):** $850 – $1,050 / mo
  * **Tier 2 (Standard Private Bedroom):** $700 – $850 / mo
  * **Tier 3 (Compact Private Bedroom):** $600 – $725 / mo
  * **Tier 4 (Shared Double Bed):** $450 – $550 / bed / mo
* **All-Inclusive Provision:** All rates are 100% all-inclusive of utilities, Wi-Fi, furniture, linens, and paper supplies.

---

### [SOP-2059-FIN-002] Voucher Processing, Direct Billing & Copay Collections
* **Voucher HAP Disbursements:** Housing authority subsidy payments direct-deposited via ACH to Mercury Bank between the 1st and 5th of each month.
* **Resident Copayments:** Due on the 1st; grace period through the 5th (aligning with SSI benefit deposit dates). Collected via Stripe online portal, ACH, or money order. Cash is strictly prohibited.
* **Government Purchase Cards (GPC):** CAGE code `22DH9` accepted for federal micro-purchases via Stripe Virtual Terminal with Level 2/3 data logging.

---

### [SOP-2059-FIN-003] Odoo Community ERP Accounting & Invoicing SOP
* **Core Odoo Modules:** Accounting, Invoicing, CRM, and Knowledge Base.
* **Billing Schedule:** Recurring invoices generated on the 25th of each month for the upcoming 1st.
* **COC Payouts:** Bi-weekly ACH disbursement based on submitted itemized contractor bills ($375 retainer, $50 intakes, $25 turnovers, $0.76/mi mileage).
* **Month-End Closeout:** Reconcile Mercury Bank and Stripe feeds by the 10th of every month; lock accounting period.
* **Knowledge App Parity:** All Markdown SOPs synchronized to internal Odoo Knowledge Base articles for mobile access.

---

### [SOP-2059-FIN-004] Banking, Treasury, Mercury & Stripe Operations
* **Account Segregation (Mercury Bank):**
  * **Operating Checking:** Receives vouchers, Stripe payouts, pays rent, utilities, and contractor fees. Target: 60-day operational expense buffer.
  * **Tax & Capital Reserve:** Automated monthly transfer of 20% of net margin for state/federal income taxes and capital reserves.
* **Internal Expenditure Thresholds:**
  * `< $250`: COC / Program Director routine supplies.
  * `$250 – $1,000`: Program Director maintenance dispatches.
  * `> $1,000`: President (Andrea Marcus) written approval required.
  * **Wires & External Transfers:** President authorization only.

---

# MODULE 05: FACILITIES, SAFETY & MAINTENANCE

### [SOP-2059-FAC-001] Property Standards, Cleanliness & Living Checklists
* **Life Safety Systems:** Operational smoke alarms in every bedroom and hallway; CO detectors on every level; kitchen 2A:10B:C fire extinguisher charged in green zone; first aid kit stocked; emergency evacuation placards posted.
* **Bi-Weekly Mobile Photo Audit (COC Deliverable):** Exterior grounds, kitchen/refrigerator cleanliness, shared bathrooms, living room pathways, and utility rooms inspected with minimum 8 time-stamped photos uploaded.

---

### [SOP-2059-FAC-002] Routine & Emergency Maintenance Procedures
* **Service Level Agreements (SLAs):**
  * **Priority 1 (Emergency - Flooding, no heat/AC, electrical, lock broken):** < 4 Hour Dispatch.
  * **Priority 2 (Urgent - Fridge out, single toilet inoperable, hot water out):** < 24 Hour Dispatch.
  * **Priority 3 (Routine - Slow drain, drywall scuff, blind repair):** < 72 Hour Dispatch.
* **Notice of Entry:** Minimum 48 hours written notice before entering private bedrooms for non-emergency repairs.
* **Preventative Maintenance:** HVAC filters replaced every 60 days; ozone sanitization every 90 days; pest control monthly; winterization annually.

---

### [SOP-2059-FAC-003] Ozone Sanitization & Environmental Safety Protocol
*(Technical Reference: `SOP-2059-ACQ-001`)*
* **Applications:** Resident room turnovers, pre-renovation subfloor sanitization, and quarterly whole-house preventative treatment (every 90 days with 48h advance resident notice).
* **Strict Safety Mandate:** Zero humans, pets, or plants on premises during treatment. Warning placards posted on all exterior doors.
* **Timer Settings:** 2–3 hours (light), 4–6 hours (moderate), 6–12 hours (heavy).
* **Breakdown & Flush:** 30–60 minute post-timer dwell period, followed by a mandatory 15-minute cross-ventilation exterior flush before re-entry.

---

### [SOP-2059-FAC-004] Property Emergency Response & Crisis Protocols
* **Emergency Contacts:** 911 (Life Safety) | 988 Press 1 (Veterans Crisis Line) | 205-534-8492 (Program Director).
* **Suspected Overdose:** Call 911 immediately. Administer Naloxone (Narcan nasal spray) from first aid kit. Roll into recovery position. Protected under Alabama Good Samaritan Act (Ala. Code § 22-2-19).
* **Fire:** R.A.C.E. Principle (Rescue, Alarm, Confine, Evacuate). Assemble at designated outdoor meeting point 50 feet away.
* **Alabama Tornado Warning:** Move all residents immediately to innermost ground-floor windowless room/hallway.
* **Active Violence:** Run, Hide, Fight. Do not confront armed individuals. Call 911. Immediate emergency discharge of perpetrator.

---

### [SOP-2059-FAC-005] Mandatory Incident Reporting & 24-Hour Escalation
* **Reporting SLA:** Verbal notice to Program Director within 1 hour; completed written Incident Report uploaded to Odoo within 24 hours; caseworker briefed within 48 hours.
* **Mandatory Data:** Factual narrative, persons involved, police/EMS CAD report number, immediate actions taken, corrective action plan.
* **Retention:** Incident records permanently retained in Odoo for minimum 5 years.

---

# MODULE 06: FUTURE SERVICES FRAMEWORK (PRE-LAUNCH NPI CAPACITIES)

### [SOP-2059-FUT-001] Non-Emergency Medical Transportation (NEMT) Blueprint
* **Pre-Launch Status:** Active NPI (1932035060), Taxonomy `193200000X`, NAICS `485991`. Ready for activation upon vehicle deployment or brokerage contract.
* **Driver Standards:** Valid driver’s license with clean MVR (< 2 violations), 10-panel drug test, CPR/First Aid, PASS wheelchair securement certification, HIPAA training.
* **Vehicle Standards:** ADA-compliant wheelchair lift/ramp, Q’Straint 4-point tie-downs, 5-lb fire extinguisher, commercial auto liability ($1,000,000 limit).

---

### [SOP-2059-FUT-002] Nutritional & Home Meal Coordination Blueprint
* **Pre-Launch Status:** Active NPI (1932035060), Taxonomy `193200000X`, NAICS `624210`.
* **Coordinated Logistics Model:** Partner with licensed commercial kitchen / USDA-inspected meal prep providers (e.g., Mom’s Meals).
* **Cold-Chain & Food Safety:** Perishable meals maintained below 41°F; dedicated labeled refrigerator shelf per participant; tamper-evident trays; ServSafe certified supervision.

---

# MODULE 07: APPENDICES & IMPLEMENTATION TOOLS

### [SOP-2059-APP-001] 12-Month Rolling Corporate Compliance Calendar
* **Q1 (Jan–Mar):** Form 1099-NEC distribution, Annual Corporate Meeting & Minutes, Bi-annual Operations Manual review, Q1 Ozone cycle, HVAC filters.
* **Q2 (Apr–Jun):** Alabama Business Privilege Tax & Annual Report (My Alabama Taxes - Apr 15), SAM.gov renewal check, Q2 Ozone cycle.
* **Q3 (Jul–Sep):** UCP Affidavit of No Change (App ID: 112124), VOSB/WOSB verification, Q3 Ozone cycle, Semi-annual Rate Calculator review.
* **Q4 (Oct–Dec):** CMS NPI review, property winterization, Q4 Ozone cycle, annual document retention purge (Dec 15), fiscal year closeout.

---

### [SOP-2059-APP-002] Preferred Vendor & Service Provider Directory Template
* **Pre-qualification Requirements:** IRS Form W-9, $1,000,000 General Liability Certificate of Insurance naming 20 59 Ventures Corp., verified trade licensure.
* **Service Categories:** Licensed HVAC, Master Plumbing, Licensed Electrician, Locksmith/Keypads, Turnover Cleaners, Lawn Maintenance, Pest Control, Emergency Board-Up.
* **Utility Providers Directory:** Complete utility provider contact numbers for Tuscaloosa, Dothan, and Montgomery hubs.

---

### [SOP-2059-APP-003] Standalone Incident & Disciplinary Report Form
Official fillable incident report template capturing administrative details, incident classification, persons involved, police/EMS CAD numbers, objective chronological narrative, immediate safety actions taken, and corrective disciplinary/caseworker follow-up with required signatures.

---

### [SOP-2059-APP-004] Resident Handbook & Community Living Outline
Plain-language resident-facing handbook structure covering:
1. Welcome to 20/59 Ventures
2. Your Room & All-Inclusive Living
3. Community House Rules (quiet hours, visitors, smoke-free policy)
4. Maintenance Requests & 48-Hour Notice of Entry
5. Safety & Overdose Prevention (Narcan in first aid kit, 988 Veterans Crisis Line)
6. 3-Strike Disciplinary System & Grievance Rights

---

### [SOP-2059-TECH-008] Telnyx Wholesale SMS Gateway & Multi-Company Dispatch
Integrated telecommunications gateway directly connecting Odoo 18 to Telnyx v2 Messaging REST API, routing all system SMS alerts, strike warnings, audit links, and mass broadcasts through wholesale US 10DLC and toll-free carrier routes.

---

### [SOP-2059-TECH-009] Unified Email Platform, Odoo Marketing & Carrier Relay Architecture
*(Introduced v1.3 — September 11, 2026)*

#### 1. Purpose & Scope
This SOP establishes the unified email communication framework for 20 59 Ventures Corp. across all regional hubs (Tuscaloosa, Dothan, Montgomery). It combines executive/staff human mailboxes (Zoho Mail), community outreach and marketing campaigns (Odoo Email Marketing), and high-volume automated operational dispatches (Telnyx Carrier API Relay) into a cohesive architecture without seat-licensing friction or domain deliverability conflicts.

#### 2. Corporate Mailboxes & Operational Routing
| Address | Purpose | Environment | Delivery Path |
| :--- | :--- | :--- | :--- |
| `info@2059ventures.online` | Public inquiries, admissions, general correspondence | Zoho Mail (Desktop & Mobile) | Primary Zoho MX |
| `support@2059ventures.online` | Property issues, tenant assistance, tickets | Zoho Mail + Odoo Ticket sync | Primary Zoho MX + Algo Text Webhook |
| `intake@2059ventures.online` | Housing referral & application submissions | Zoho Alias + Housing Auto-sync | Primary Zoho MX + Algo Text Webhook |
| `andrea.marcus@2059ventures.online` | Executive leadership (President & CEO) | Zoho Mail (Desktop & Mobile) | Primary Zoho MX |
| `qruffin@2059ventures.online` | Operational leadership (Program Director & COO) | Zoho Mail (Desktop & Mobile) | Primary Zoho MX |

#### 3. DNS Co-Existence & Deliverability (Cloudflare)
To ensure flawless deliverability and eliminate spam filtering while protecting human inboxes:
* **Primary MX Records:** Maintained exclusively by Zoho Mail (`mx.zoho.com`, `mx2.zoho.com`, `mx3.zoho.com`). Personal email is never disrupted.
* **SPF Authorization:** Multi-provider SPF record authorizing both Zoho and Telnyx:
  `v=spf1 include:zohomail.com include:spf.telnyx.com ~all`
* **Cryptographic DKIM:** Dedicated 2048-bit RSA selector `telnyx1._domainkey.2059ventures.online` authenticating automated dispatches.
* **Domain Ownership:** Verification token `telnyx-domain-verification=bcc40a08-ae0d-4df5-8a83-930831a6fcd8`.

#### 4. Automated Operational Templates & Dispatch Run-Rules
Automated operational notices trigger directly from the mobile-ready application suite (`https://sms.iamalgo.com/email` or automated Odoo events):
1. **Application Received Confirmation:** Sent immediately upon intake form submission (`intake@`).
2. **Move-In & Welcome Package:** Dispatched upon room assignment with handbook attachment (`info@`).
3. **Corrective Strike Notice:** Formal disciplinary documentation mirroring SMS strike warnings (`support@`).
4. **COC Walkthrough Schedule:** Audit links and property notices to COCs and landlords.
5. **Community Announcements & Newsletters:** Built and dispatched via Odoo Email Marketing using shared Contact lists (`Coordinators of Care`, `All Active Residents`, `Monthly Rent & Fee Reminder List`).

#### 5. Employee Standard of Procedure
1. **Reading & Responding on the Go:** Employees continue using the official Zoho Mail iOS/Android application for direct human conversations.
2. **Outbound Community Blasts:** Employees utilize Odoo Email Marketing (`/odoo/email-marketing`) to draft and schedule professional mass mailings using predefined mailing lists.
3. **Resident History:** All sent notices and incoming operational emails are logged against the resident or caseworker record in Odoo Chatter for a complete audit trail.

---

### [SOP-2059-TECH-010] TD SYNNEX Distributor Procurement Integration — Read-Only Price Gateway
*(Introduced v1.5 — October 4, 2026. Full SOP: `docs/SOP-2059-TECH-010-TD-SYNNEX-Procurement-Integration.md`)*

Live distributor pricing for 20/59 Ventures (Company 4 only) via the TD SYNNEX CIS Partner API (reseller account `822061`, US). `tdsynnex_2059_client.py` manages OAuth2 tokens and `POST GetPriceAvailability` lookups (1–100 SKUs/call, `synnexSKU`/`mfgPN`/`customerPartNo`); Hub API Gateway exposes `GET/POST /api/v1/2059/tdsynnex/price` and `GET /api/v1/2059/tdsynnex/health` behind `HUBS_PRIVATE_API_KEY`. Reads run against Prod (account exists there; UAT has no record of `822061`). Use `priceType PROMOTION` for deal pricing (e.g. Cisco 8851 `$477.72` vs `$608.46` REGULAR). Credentials live in VPS `.env` as `TDSYNNEX_2059_*` (`chmod 600`, never git); rotate per §4 of TECH-010. All future purchases carry `x_distributor_id` + `x_vehicle_id` for the 3-year coop audit trail. No automated ordering in this phase.

---

### [SOP-2059-TECH-011] Enterprise System Architecture Defense, CMMC/NIST SP 800-171 & JCP Safeguards
*(Introduced v1.6 — October 14, 2026)*

#### 1. Purpose & Core System Defense Framework
This SOP operationalizes the **Enterprise System Defense Framework** for 20/59 Ventures Corp. (Company ID: 4). In commercial and defense procurement evaluations, enterprise buyers and government contracting officers do not read raw application code—they require leadership to defend the architecture across **five fundamental operational pillars**:
1. **Data Flows & Boundary Definition** (*Where the data goes*)
2. **Access Control & Least Privilege** (*Who can reach it*)
3. **Auditability, Telemetry & Logging** (*What gets logged*)
4. **Resilience, Degraded Mode & Recovery** (*What happens when it fails*)
5. **Ownership, Governance & Escalation** (*Who owns it*)

This standard integrates our active federal accreditations—including **SAM.gov** (`UEI: GVR2NTGR4HU3`, `CAGE: 22DH9`), **NPI** (`1932035060`), **CMMC 2.0 Level 2 / NIST SP 800-171 Rev 2** controls, and **Joint Certification Program (JCP / DD Form 2345)** export-controlled technical data protections—directly into daily Odoo Community ERP workflows.

#### 2. The Five System Defense Pillars for 20/59 Ventures

```
+───────────────────────────────────────────────────────────────────────────────────────+
|               20/59 VENTURES ENTERPRISE SYSTEM ARCHITECTURE DEFENSE                   |
+───────────────────────────────────────────────────────────────────────────────────────+
| 1. DATA FLOWS         | 2. ACCESS CONTROL       | 3. AUDIT & LOGGING | 4. RESILIENCE  |
| - MMS/SMS (+1-888-2059)| - RBAC via Company ID 4 | - Central Syslog   | - SQLite Queue |
| - COC Photo Audits    | - Mandatory TOTP / MFA  | - Immutable Chatter| - Warm Fallback|
| - TD SYNNEX API       | - Replay-Resistant Keys | - 24-hr Incident Log| - R2 Snapshots |
| - Encrypted Postgres  | - Session Auto-Lock (15m)| - Audit Watchdog   | - Quarantine Dir|
+───────────────────────────────────────────────────────────────────────────────────────+
|                                5. OWNERSHIP & GOVERNANCE                              |
|   Executive Custodians: Andrea Marcus (President/CEO) & Quincy Ruffin (COO/Director)  |
+───────────────────────────────────────────────────────────────────────────────────────+
```

##### Pillar 1: Where the Data Goes (Data Ingestion, Boundaries & Sinks)
* **Ingestion Channels**:
  * **Resident & Workforce Communications**: Toll-Free MMS/SMS (`+1-888-919-2059`) processed via Telnyx Webhook router into Odoo Chatter.
  * **Property & Facility Field Data**: Mobile COC Walkthrough & Photo Audit Tool (`coc_audit.py`) and Mobile Strike Notice Tool (`coc_strike.py`) ingesting inspection metrics, geolocation, and time-stamped damage photos into Odoo Knowledge Module 05.
  * **Distributor Procurement Data**: TD SYNNEX CIS Partner API (`tdsynnex_2059_client.py`) ingesting hardware pricing into read-only memory caches; no resident PII or CUI leaves the enclave.
  * **Compliance Intake**: Mobile `/cert` portal, intake mailboxes (`intake@2059ventures.online`), and carrier relays.
* **Storage Sinks & Boundary Protection**:
  * Primary persistent storage: PostgreSQL 15 (`IAM_Main` database), restricted strictly to localhost/internal Docker network.
  * Digital Attachments: Encrypted `ir.attachment` volume storage for lease agreements, photo audits, and certifications.
  * CUI/PII Isolation: Resident intake files, HIPAA disclosures, and CUI are tagged with metadata flags and restricted by Odoo record rules.

##### Pillar 2: Who Can Reach It (Access Control & Boundary Isolation)
* **Corporate Segregation**: Multi-company record rules guarantee that users authenticated under Company 4 cannot access parent IAM proprietary assets or sibling subsidiary ledgers without explicit inter-company permission.
* **Authentication Controls**:
  * Mandatory Multi-Factor Authentication (TOTP) for all administrative and operational staff (`SOP-2059-IDA-003`).
  * Replay-resistant authentication and strict session timeouts (15 minutes idle lock per `SOP-2059-SYS-011`).
  * Explicit role-based separation: COC Field Staff (read/create inspection tickets), Program Director (operational approval, lease execution), President (financial disbursements, executive certifications).

##### Pillar 3: What Gets Logged (Auditability, Correlation & Telemetry)
* **Immutable Chatter Logging**: All resident state transitions, lease approvals, disciplinary strikes, and compliance uploads post directly to Odoo Chatter (`mail.message`), recording user ID, timestamp, and payload hash.
* **System Audit Daemon**: Centralized logging via `core/logger.py` and `scripts/audit_watchdog.py`, monitoring failed authentication attempts, privilege escalation, and file system modifications (`SOP-2059-AUD-001` to `AUD-009`).
* **Audit Failure Alerting**: Automated notifications dispatch within 60 minutes if audit ingestion ceases (`SOP-2059-AUD-004`).

##### Pillar 4: What Happens When It Fails (Resilience, Degraded Modes & Recovery)
* **Graceful Degradation**:
  * If external telecom gateways experience downtime, incoming webhooks queue in local persistence buffers (SQLite) with automatic retry backoff.
  * If the TD SYNNEX API is unreachable, procurement caching falls back to the static line-card repository (`TDS_LINECARD_2025_2026.csv`) with warning indicators.
* **Backup & Warm Fallback**:
  * Nightly automated database snapshots pushed to Cloudflare R2 object storage with 256-bit AES encryption (`backup.bat`).
  * Documented Warm Fallback restoration procedure on local Docker instances (`LOCAL_RESTORE_PROCEDURE.md`), guaranteeing Recovery Time Objective (RTO) under 2 hours and Recovery Point Objective (RPO) under 24 hours.

##### Pillar 5: Ownership, Accountability & Human Oversight
* **Designated Service Custodians**:
  * Primary System Custodian & Program Director: **Quincy Ruffin** (operations, incident response, COC coordination).
  * Executive Governance & Corporate Certifications: **Andrea Marcus** (SAM.gov, JCP Data Custodian, banking).
* **Incident Escalation**: Formal incident handling per `SOP-2059-IR-001`: Tier 1 (1 hour acknowledgment) -> Tier 2 (containment under 4 hours) -> Tier 3 (executive/agency reporting within 24 hours).

---

#### 3. CMMC 2.0 Level 2 & NIST SP 800-171 Rev 2 Safeguards Matrix
20/59 Ventures enforces the 110 NIST SP 800-171 Rev 2 controls across its ERP and cloud footprint:

| NIST SP 800-171 Family | 20/59 Ventures Implementation Mechanism | Active SOP Reference |
| :--- | :--- | :--- |
| **Access Control (AC)** | Dual-layered CORS + Private API headers, Odoo multi-company record rules, least-privilege role gating, automatic session lockout after 15m idle. | `SOP-2059-SYS-002`, `SYS-006`, `SYS-011` |
| **Awareness & Training (AT)** | Mandatory CUI and cyber hygiene onboarding before system access; signed annual acknowledgement. | `SOP-2059-CORP-006`, `CORP-007` |
| **Audit & Accountability (AU)** | Synchronized NTP authoritative time source, daily log review, automated audit alerting, immutable Chatter thread tracking. | `SOP-2059-AUD-001` through `AUD-009` |
| **Configuration Mgmt (CM)** | Baseline configuration management in Git, strict change approval protocol, non-essential port and service disabling. | `SOP-2059-CFG-001` through `CFG-009` |
| **Identification & Auth (IA)** | Mandatory MFA/TOTP on all Odoo web access, salted-hash password storage, obscure login feedback, identifier reuse bans. | `SOP-2059-IDA-001` through `IDA-011` |
| **Incident Response (IR)** | 1-hr containment timeline, 24-hr mandatory incident reporting, documented tabletop exercises and after-action reports. | `SOP-2059-IR-001`, `IR-002`, `IR-003` |
| **Maintenance (MA)** | Sanitization of equipment prior to disposal, nonlocal maintenance authorization and monitoring. | `SOP-2059-MA-001` through `MA-006` |
| **Media Protection (MP)** | Full-disk encryption for backups, zero portable media storage of CUI, controlled media disposal protocols. | `SOP-2059-MP-001` through `MP-009` |
| **Personnel Security (PS)** | Comprehensive pre-engagement screening for COCs and employees, rapid account offboarding upon transfer or termination. | `SOP-2059-PS-001`, `PS-002` |
| **Physical Protection (PE)** | Facility monitoring, visitor logs, 48-hr resident entry notice rules, secure physical lockboxes for operational hardware. | `SOP-2059-PE-001` through `PE-006` |
| **Risk Assessment (RA)** | Periodic vulnerability scans and formal annual operational risk assessments. | `SOP-2059-RA-001`, `RA-002` |
| **Security Assessment (CA)** | Continuous monitoring plan, System Security Plan (SSP) version control, active Plan of Action and Milestones (POA&M). | `SOP-2059-CA-001` through `CA-004` |
| **System & Comm Protection (SC)** | TLS 1.3 encryption in transit, strict split-tunneling prohibition, boundary firewalls, isolated microservices network. | `SOP-2059-SC-001` through `SC-016` |
| **System & Info Integrity (SI)** | Flaw remediation monitoring, automated endpoint protection, rapid malicious code scanning on uploaded attachments. | `SOP-2059-SI-001` through `SI-007` |

---

#### 4. Joint Certification Program (JCP / DD Form 2345) Safeguards
As a certified entity holding active registration under **CAGE: 22DH9**, 20/59 Ventures maintains rigorous governance over Militarily Critical Technical Data (MCTD) and Export-Controlled defense technical information pursuant to DoDD 5230.25 and Canadian Technical Data Control Regulations (TDCR):

1. **Designated Data Custodians**:
   * **Andrea Marcus** (President & CEO) — Primary Executive Custodian
   * **Quincy Ruffin** (Program Director & COO) — Technical & Systems Custodian
   * *Both custodians maintain active signed certifications on file in Odoo Knowledge Base (`[EXPORT-22DH9-2026]`).*
2. **Access & Handling Controls**:
   * **Strict U.S. Person Verification**: Access to defense logistics records, cooperative procurement specifications, or technical data is strictly limited to verified U.S. citizens or lawful permanent residents.
   * **Air-Gapped Document Tags**: Any defense logistics or technical document ingested into Odoo is classified under the `MCTD / EXPORT-CONTROLLED` tag, preventing automated external sync or public portal exposure.
   * **Prohibition of Non-U.S. Hosting**: All production instances, Docker containers, and Cloudflare R2 backup buckets reside exclusively within continental United States (CONUS) data centers.
   * **Media Sanitization & Disposal**: Any storage device or media bearing JCP-regulated data is sanitized pursuant to NIST SP 800-88 Rev 1 before decommissioning (`SOP-2059-MA-003`).

---

### [SOP-2059-GOV-005] Simplified Delivery Procurement (SDP) & Federal IT Storefront Operations
1. **Purpose & Authority:**
   Establishes the operational run-rules and ERP intake pipelines for 20/59 Ventures Corp.'s public-sector commercial-off-the-shelf (COTS) IT hardware storefront (`https://2059ventures.com/store.html`) pursuant to **FAR 13.201 (Micro-Purchase threshold < $10,000)**, **FAR Part 13 (Simplified Acquisition Procedures up to $250,000)**, **FAR 52.204-24/25/26 (Section 889 NDAA)**, and the **Trade Agreements Act (19 U.S.C. § 2501)**.
2. **Storefront Multi-Page Architecture:**
   * **Master IT Catalog (`store.html`):** Unified line card across all authorized manufacturers with search bar, category filter pills, and persistent session cart.
   * **Enterprise Networking (`store-networking.html`):** Cisco Catalyst 9300/9200L Layer 3 switches & Meraki cloud security appliances.
   * **Secure Audio & Headsets (`store-audio.html`):** Jabra Engage 50 II, Evolve2 65 Flex ANC, and Speak2 75 conference units (FIPS-compatible).
   * **Ergonomic Mounts & Carts (`store-mounts.html`):** Ergotron LX monitor arms, CareFit Pro medical/field carts, and WorkFit-T sit-stand converters.
   * **Docks, KVM & CAC Readers (`store-docks-cac.html`):** StarTech Quad 4K TAA docks, NIAP PP4.0 secure DisplayPort KVMs, and IOGEAR FIPS 201 CAC readers.
   * **Power Protection & Racks (`store-power.html`):** APC Smart-UPS 1500VA pure sine wave backups & NetShelter SX 42U server enclosures.
3. **Persistent Session Cart & Statutory Threshold Monitoring:**
   * Utilizes client-side persistent storage (`js/govcon-cart.js`) maintaining state across page reloads and category navigation.
   * Real-time statutory threshold evaluation:
     * `< $10,000.00`: Displays `✅ FAR 13.201 Micro-Purchase Qualified (Immediate GPC Card Action)`.
     * `> $10,000.00`: Displays `📋 FAR Part 13 Simplified Acquisition ($10k-$250k Formal RFQ Flow)`.
4. **Odoo 18 Multi-Company Intake Pipeline (`POST /api/order`):**
   * Serverless edge routing via Cloudflare Worker (`_worker.js`) with anti-bot honeypot and `.gov`/`.mil` domain validation.
   * Automated lookup or creation of customer record in `res.partner` under **Company 4** (`20/59 Ventures Corp.`).
   * Automated generation of `crm.lead` in **Team 8** (`20/59 GovCon & IT Solutions`) with tag `[GPC ORDER]` and expected revenue.
   * Automated generation of draft quotation (`sale.order`, `state='draft'`) in Company 4 with itemized line items, MPNs, and distributor tags.
   * Automated rich HTML Chatter logging to both lead and quotation records.
   * Instant priority Telnyx SMS notification dispatch to Quincy Ruffin (+1-205-393-7396) from +1-888-919-2059.
5. **Human Executive Oversight Gate (Zero Auto-Dropship):**
   * Dropship purchase orders (`purchase.order`) are **never automatically placed** with TD SYNNEX (Partner ID 107) or Ingram Micro (Partner ID 137).
   * Executive leadership (Quincy Ruffin / Andrea Marcus) must review the draft sale order, verify buyer agency authority, confirm distributor stock and lead time, and validate minimum 15% CLIN gross margin before confirming quotation.

---

## EXECUTIVE SIGN-OFF & ADOPTION

### Original Adoption
*This Master Operations Manual was originally adopted by the executive leadership of 20/59 Ventures Corp. on the 11th day of September, 2026.*

### Version 1.3 Amendment
*Version 1.3 formally establishes `[SOP-2059-TECH-009]` (Unified Email Platform, Odoo Marketing & Carrier Relay Architecture) and integrates Odoo Email Marketing with Telnyx and Zoho DNS co-existence. Approved: September 11, 2026.*

### Version 1.4 Amendment
*Version 1.4 formally establishes mandatory workforce compliance certifications for all Community Operations Coordinator (COC) positions—requiring pre-placement HIPAA compliance training and 30-day OSHA for Healthcare Bloodborne Pathogens certification, with digital credentials permanently filed under worker personal profiles in Odoo Community ERP. Approved: September 12, 2026.*

### Version 1.5 Amendment
*Version 1.5 formally establishes `[SOP-2059-TECH-010]` (TD SYNNEX Distributor Procurement Integration — Read-Only Price Gateway): live price/availability via CIS Partner API for Company 4, gateway routes in `hub_api.py`, `TDSYNNEX_2059_*` credential handling, and rotation run-rules. No automated ordering. Approved: October 4, 2026.*

### Version 1.6 Amendment
*Version 1.6 formally establishes `[SOP-2059-TECH-011]` (Enterprise System Architecture Defense, CMMC/NIST SP 800-171 & JCP Compliance): codifying the 5-question system defense review framework, full 110-control NIST SP 800-171 alignment, and JCP DD Form 2345 export control data handling protocols under CAGE 22DH9. Approved: October 14, 2026.*

### Version 1.8 Amendment
*Version 1.8 formally establishes `[SOP-2059-GOV-005]` (Simplified Delivery Procurement & Federal IT Storefront Operations): codifying the multi-page defense IT hardware storefront (Master store.html + 5 dedicated category pages), 14 TAA & Section 889 curated products seeded in Odoo 18 Company 4, persistent cross-page session cart with FAR 13.201 micro-purchase tracker (<$10,000 statutory limit), Cloudflare `/api/order` edge pipeline, automated Team 8 CRM lead and draft quotation (`sale.order`) creation, human executive approval gate, and instant Telnyx SMS dispatch. Approved: October 24, 2026.*

### Version 1.7 Amendment
*Version 1.7 formally establishes `[SOP-2059-GOV-004]` (GovCon CRM & Defense Procurement Workflow): unifying Team 8 visual pipeline stages with satellite `govcon.rfq` workspaces, automated Sourcing Cascade (TD SYNNEX API adapter & line card benchmark), stage-exit compliance gates, distributor price-lock constraints, FAR 4.703 retention lock, DFARS 252.232-7006 WAWF pre-flight validation, Prompt Payment Act statutory interest computation (31 U.S.C. § 3902), daily compliance watchdog cron, and CUI-sanitized Telnyx SMS alerts to Quincy's cell (+1-205-393-7396). Approved: October 24, 2026.*

**Andrea Marcus**  
President & Chief Executive Officer  
20 59 Ventures Corp.

**Quincy Ruffin**  
Program Director & Chief Operating Officer  
20 59 Ventures Corp.
