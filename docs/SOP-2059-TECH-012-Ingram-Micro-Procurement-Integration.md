# SOP-2059-TECH-012: Ingram Micro Distributor Procurement Integration & API Governance

**Owner:** 20/59 Ventures Corp (Company 4) · **Effective:** October 29, 2026 · **Version:** 1.0  
**Systems:** Ingram Micro Xvantage REST API · Odoo 18 (`IAM_Main` / `2059_edi_gateway`) · Unified Distributor Adapter (`distributors/ingram.py`)  
**Account / Customer ID:** `70-214122` (Clean: `214122`) · **CAGE:** `22DH9` · **Partner ID:** `137`

---

## 1. Purpose & Scope

This Standard Operating Procedure (SOP) governs the enterprise API integration, security controls, credential lifecycle, and operational run-rules between **20/59 Ventures Corp.** (Company ID: 4) and **Ingram Micro Inc.** (Partner ID: 137). 

This integration operates in tandem with `SOP-2059-TECH-010` (TD SYNNEX Partner ID 107) to establish an automated **Dual-Distributor Sourcing Cascade**, enabling 20/59 Ventures to perform real-time price comparisons, warehouse inventory aggregation, and automated dropship procurement for federal and public-sector IT hardware contracts.

### Mandatory Safety Protocol (Zero Live Risk)
All development, syntax testing, schema validation, and integration tests are **strictly mandated to execute against the Ingram Micro Sandbox environment** (`https://api.ingrammicro.com/sandbox/...`). In accordance with corporate governance, **Phase 1 is strictly Read-Only (Price & Availability)**. Dropship purchase orders (`purchase.order`) are **never automatically placed** with Ingram Micro; all live orders require explicit executive authorization (Quincy Ruffin / Andrea Marcus).

---

## 2. Architecture & System Components

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        20/59 VENTURES PROCUREMENT ENGINE                               │
│                   (Odoo 18 / Website Store / Cloudflare Edge)                          │
└───────────────────────────┬────────────────────────────────┬───────────────────────────┘
                            │                                │
             ┌──────────────▼──────────────┐  ┌──────────────▼──────────────┐
             │       TD SYNNEX ADAPTER     │  │     INGRAM MICRO ADAPTER    │
             │       (Partner ID: 107)     │  │       (Partner ID: 137)     │
             │    `distributors/tdsynnex`  │  │     `distributors/ingram`   │
             └──────────────┬──────────────┘  └──────────────┬──────────────┘
                            │                                │
                            └────────────────┬───────────────┘
                                             │
                                             ▼
             ┌───────────────────────────────────────────────────────────────┐
             │            DUAL-SOURCING CASCADE ARBITRATION                  │
             │  1. Check Line-Card Authorization (Cisco, Jabra, APC, etc.)   │
             │  2. Compare Real-Time Warehouse Stock & Delivery Lead Times   │
             │  3. Calculate Lowest Landed Cost (Req. ≥15% Gross Margin)    │
             │  4. Verify TAA / Trade Agreements Act & Section 889 Status   │
             └───────────────────────────────────────────────────────────────┘
```

| Component | Repository Path / Service | Functional Role |
| :--- | :--- | :--- |
| **Ingram Micro Adapter** | `distributors/ingram.py` | OAuth 2.0 token management, request signing, P&A v6 querying, and response parsing. |
| **Approved Sandbox App** | `70-214122-SandboxApp` | Pre-production testing environment for simulated pricing, availability, and order schemas. |
| **Approved Prod App** | `70-214122-2059 Ventures GovCon Procurement` | Production eCommerce API application for live catalog and inventory queries. |
| **EDI Gateway Bridge** | `extra-addons/2059_edi_gateway/` | Ingestion of purchase orders, 850 generation, 855 acknowledgments, and 856 ASN tracking. |
| **Edge Intake API** | `_worker.js` (`POST /api/order`) | Public storefront checkout and RFQ intake feeding Company 4 CRM Team 8. |

---

## 3. Approved Developer Portal Applications

Both applications are registered and approved in the **Ingram Micro Developer Portal** (`https://developer.ingrammicro.com/`):

### 3.1 Production Application
* **Application Name:** `70-214122-2059 Ventures GovCon Procurement`
* **App Status:** `Approved` / `Production`
* **Client ID:** `6LkdIgHz1KUHxEeyqgLZBhWuSlvwadPH`
* **Customer Account Identifier:** `70-214122`
* **Approved API Products:**
  * Order Management v7
  * Subscription Management V7
  * Invoice Management v7
  * Freight Estimate v6
  * Deal Management v6
  * Product Catalog & Price/Availability v6

### 3.2 Sandbox Application
* **Application Name:** `70-214122-SandboxApp`
* **App Status:** `Approved` / `Sandbox`
* **Client ID:** `n9xHKHpmfeD7JdgxANGA0egvbNJ0SzoU`
* **Customer Account Identifier:** `70-214122` (Mock Customer: `20-222222`)
* **Approved API Products:**
  * Order Management (Sandbox) v7
  * Subscription Management (Sandbox) V7
  * Product Catalog & Price/Availability (Sandbox) v6

---

## 4. API Endpoints & Request Specifications

### 4.1 OAuth 2.0 Bearer Authentication
* **Token URL:** `https://api.ingrammicro.com:443/oauth/oauth30/token`
* **Grant Type:** `client_credentials`
* **Token Lifetime:** 86,400 seconds (24 Hours)
* **Caching Rule:** In-memory caching with 60-second pre-expiry refresh buffer (`_TOKEN_CACHE`).

### 4.2 Price and Availability (PNA) Endpoint
* **Production URL:** `POST https://api.ingrammicro.com:443/resellers/v6/catalog/priceandavailability?includePricing=true&includeAvailability=true`
* **Sandbox URL:** `POST https://api.ingrammicro.com:443/sandbox/resellers/v6/catalog/priceandavailability?includePricing=true&includeAvailability=true`

#### Mandatory Request Headers:
```http
Authorization: Bearer <access_token>
IM-CustomerNumber: 70-214122
IM-CountryCode: US
IM-CorrelationID: <uuid4_guid>
Content-Type: application/json
Accept: application/json
```

#### Standard Request Payload:
```json
{
  "showAvailableDiscounts": true,
  "showReserveInventoryDetails": true,
  "products": [
    {
      "ingramPartNumber": "123456",
      "vendorPartNumber": "VENDOR-PART-NUMBER",
      "quantity": 1
    }
  ]
}
```

---

## 5. Operational Run-Rules

1. **Default to Sandbox Environment:** All adapter instances must explicitly initialize with `env="sandbox"` unless production is purposefully mandated for an audited read query.
2. **Strict Prohibition of Automated Dropship:** No API call shall submit `POST /resellers/v6/orders` directly from automated web store intake or webhook triggers. Any order submission requires manual executive sign-off in Odoo 18.
3. **Dual-Distributor Cascade Priority:**
   * Step 1: Query TD SYNNEX (Partner ID 107) for availability and promotion pricing.
   * Step 2: Query Ingram Micro (Partner ID 137) for availability and price.
   * Step 3: Compare landed stock across distribution hubs (Atlanta, South Bend, Mira Loma, Fort Worth).
   * Step 4: Route award to distributor with superior stock/pricing, tagging `x_distributor_id` in Odoo.
4. **CUI & Data Sanitization:** Distributor customer pricing and sensitive agency delivery addresses constitute Controlled Technical / Business Data and must not be exposed in client-side code, public GitHub repositories, or unauthenticated logs.

---

## 6. Credential Rotation & Security Governance

* **Storage:** Secrets reside strictly in the VPS production environment (`.env`) with permission `chmod 600`.
* **Environment Variables:**
  ```bash
  INGRAM_CUSTOMER_NUMBER="70-214122"
  INGRAM_SANDBOX_CLIENT_ID="n9xHKHpmfeD7JdgxANGA0egvbNJ0SzoU"
  INGRAM_SANDBOX_CLIENT_SECRET="7MbaqZc5ymVZUPTF"
  INGRAM_PROD_CLIENT_ID="6LkdIgHz1KUHxEeyqgLZBhWuSlvwadPH"
  INGRAM_PROD_CLIENT_SECRET="E0uL8tcddWkeSgt2"
  # Remote MCP Server (Workato APIM Gateway)
  INGRAM_MCP_URL="https://34286.apim.mcp.workato.com?wkt_token=cf3659e39387c20854a83184d5f02071e5cca723325425b8546446958d632f58"
  ```
* **Rotation Schedule:** Bi-annually or immediately upon suspected credential exposure via `developer.ingrammicro.com` &rarr; *My Apps* &rarr; *Regenerate Key*.

---

## 7. Troubleshooting Guide

| Symptom / Error | Root Cause | Corrective Action |
| :--- | :--- | :--- |
| `HTTP 500: Invalid client identifier` | Character ambiguity in Client ID (`I` vs `l`, `1`) | Ensure Client ID matches exact base64 string (`6LkdIg...SlvwadPH`). |
| `HTTP 403: Customer validation failed` | Missing `70-` prefix or mismatch with registered account | Set `IM-CustomerNumber` header to full registered ID: `70-214122`. |
| `HTTP 400: includePricing field required` | Missing mandatory URL query flags | Append `?includePricing=true&includeAvailability=true` to catalog URL. |
| `HTTP 401: No apiproduct match found` | Requested resource path not assigned to app in portal | Verify URL path prefix matches `/sandbox/` or activate missing API product in portal. |
| `productStatusCode: "E"` | Part number not found in distributor database | Verify manufacturer part number (`vendorPartNumber`) or query via distributor line card. |

---

## 8. Executive Approvals

**Quincy Ruffin**  
Program Director & Chief Operating Officer  
20 59 Ventures Corp.  
Date: October 29, 2026  

**Andrea Marcus**  
President & Chief Executive Officer  
20 59 Ventures Corp.  
Date: October 29, 2026  

