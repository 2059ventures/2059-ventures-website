// ═══════════════════════════════════════════════════════════════════════════
// 20/59 VENTURES CORP. — DEFENSE & FEDERAL IT STOREFRONT & CART ENGINE
// Persistent Session Cart, Micro-Purchase Tracker (<$10k), Quick-Spec Modals
// ═══════════════════════════════════════════════════════════════════════════

const GOVCON_PRODUCTS = [
  {
    id: 19,
    name: "Cisco Catalyst 9300 48-Port PoE+ Switch (TAA Compliant)",
    mpn: "C9300-48P-A",
    category: "networking",
    categoryLabel: "Enterprise Networking & Security",
    distro: "TD SYNNEX",
    image: "img/products/cisco-c9300.jpg",
    price: 4850.00,
    taa: true,
    sec889: true,
    shipping: "US Warehouse Stock — Ships 24-48h",
    desc: "Cisco Catalyst 9300 48-Port PoE+ Layer 3 Switch with Network Advantage. TAA Compliant. Micro-Purchase / Simplified Acquisition Ready.",
    specs: {
      "Form Factor": "1U Rackmount (Standard 19-inch EIA)",
      "Port Density": "48x 10/100/1000 Ethernet PoE+ Ports",
      "PoE Power Budget": "715W AC Default (Expandable to 1440W with dual power)",
      "Stacking Bandwidth": "480 Gbps with Cisco StackWise-480",
      "Switching Capacity": "256 Gbps (with uplinks)",
      "Operating System": "Cisco IOS XE with Network Advantage License",
      "Security Protocols": "MACsec-256 Encryption, Encrypted Traffic Analytics (ETA)"
    },
    compliance: {
      "Trade Agreements Act (TAA)": "Certified Compliant (Manufactured USA/Mexico)",
      "Section 889 NDAA": "Certified 100% Prohibition Compliant (No Covered Telecom)",
      "Information Assurance": "FIPS 140-2 Level 2 & Common Criteria EAL4+ Validated",
      "Target Commands": "USAF AFLCMC, US Navy NAVSEA, Army CECOM, DISA Infrastructure"
    }
  },
  {
    id: 20,
    name: "Cisco Catalyst 9200L 24-Port Gigabit PoE+ Switch (TAA Compliant)",
    mpn: "C9200L-24P-4G-A",
    category: "networking",
    categoryLabel: "Enterprise Networking & Security",
    distro: "TD SYNNEX",
    image: "img/products/cisco-c9200l.jpg",
    price: 2190.00,
    taa: true,
    sec889: true,
    shipping: "US Warehouse Stock — Ships 24-48h",
    desc: "Cisco Catalyst 9200L 24-Port Gigabit PoE+ with 4x 1G SFP uplinks, Network Advantage. TAA Compliant for federal field & tactical deployments.",
    specs: {
      "Form Factor": "1U Rackmount Compact",
      "Port Density": "24x 10/100/1000 Gigabit Ethernet PoE+ Ports",
      "Uplinks": "4x 1G SFP Fixed Optical Ports",
      "PoE Power Budget": "370W Dedicated PoE Power",
      "Stacking Bandwidth": "80 Gbps Stacking with StackWise-80",
      "Forwarding Rate": "41.66 Mpps",
      "Management": "Cisco DNA Center, Command Line Interface (CLI), WebUI"
    },
    compliance: {
      "Trade Agreements Act (TAA)": "Certified Compliant",
      "Section 889 NDAA": "Compliant (FAR 52.204-24/25/26 Certified)",
      "Target Commands": "Federal Field Installations, Deployable Tactical Flyaway Kits"
    }
  },
  {
    id: 21,
    name: "Cisco Meraki MX68 Small Branch Cloud Security Appliance",
    mpn: "MX68-HW",
    category: "networking",
    categoryLabel: "Enterprise Networking & Security",
    distro: "TD SYNNEX",
    image: "img/products/cisco-meraki-mx68.jpg",
    price: 895.00,
    taa: false,
    sec889: true,
    shipping: "US Warehouse Stock — Ships 24h",
    desc: "Cisco Meraki MX68 Cloud Managed Security & SD-WAN Appliance with 10x GbE, 2x PoE+. Section 889 Compliant firewall.",
    specs: {
      "Form Factor": "Compact Desktop / Wall-Mount",
      "Stateful Firewall Throughput": "450 Mbps",
      "Maximum Recommended Clients": "Up to 50 Concurrent Users",
      "Interface Density": "10x 1GbE RJ45 (including 2x PoE+ ports, 2x Dedicated WAN ports)",
      "VPN Throughput": "200 Mbps Site-to-Site Auto VPN",
      "Security Capabilities": "Snort-based Next-Gen IPS/IDS, Cisco AMP, Dual WAN Failover"
    },
    compliance: {
      "Section 889 NDAA": "Fully Compliant (Federal Cloud FedRAMP Moderate Dashboard)",
      "Target Commands": "VA Community Clinics, Remote Border Outposts, DoD Satellite Offices"
    }
  },
  {
    id: 22,
    name: "Ergotron LX Desk Mount LCD Monitor Arm (Polished Aluminum)",
    mpn: "45-241-026",
    category: "mounts",
    categoryLabel: "Ergonomic Mounts & Mobile Carts",
    distro: "TD SYNNEX",
    image: "img/products/ergotron-lx-arm.jpg",
    price: 219.00,
    taa: true,
    sec889: true,
    shipping: "US Warehouse Stock — Ships 24-48h",
    desc: "Ergotron LX Desk Mount LCD Arm, Polished Aluminum finish. Supports up to 34in displays (25 lbs). Constant Force technology.",
    specs: {
      "Weight Capacity": "7 to 25 lbs (3.2 to 11.3 kg)",
      "Display Size Support": "Up to 34-inch Diagonal Monitors",
      "Height Adjustment Lift": "13.0 inches (33.0 cm)",
      "Tilt & Pan": "75-degree Tilt, 360-degree Pan & Rotation (Portrait/Landscape)",
      "Mounting Standard": "VESA MIS-D (100x100mm & 75x75mm hole patterns)",
      "Mounting Base": "Includes Heavy-Duty Desk Clamp & Grommet Mount Options"
    },
    compliance: {
      "Trade Agreements Act (TAA)": "Certified Compliant",
      "Ergonomics Standards": "BIFMA Compliant, Tested to 10,000-cycle Motion Standard",
      "Target Commands": "DoD Joint Operations Centers (JOC), SCIF Workstations, FAA Centers"
    }
  },
  {
    id: 23,
    name: "Ergotron CareFit Pro Medical & Field Mobile Workstation Cart",
    mpn: "C52-1201-1",
    category: "mounts",
    categoryLabel: "Ergonomic Mounts & Mobile Carts",
    distro: "TD SYNNEX",
    image: "img/products/ergotron-carefit.jpg",
    price: 3250.00,
    taa: true,
    sec889: true,
    shipping: "Freight Delivery — Ships 3-5 Days",
    desc: "Ergotron CareFit Pro Medical & Field Mobile Cart with electric lift and integrated LiFe battery system for hospital & deployable medical units.",
    specs: {
      "Power System": "Integrated Lithium Iron Phosphate (LiFePO4) Battery with Smart Display",
      "Lift Mechanism": "Push-Button Motorized Electric Height Lift (24.5 to 49.5 inches)",
      "Mobility": "4x Ultra-Smooth Hospital-Grade Locking Casters with Directional Lock",
      "Infection Control": "Non-porous Antimicrobial Surfaces for Cleanroom & Field Triage",
      "Work Surface": "Backlit Keyboard Tray with Left/Right Mouse Trays & Scanner Holder"
    },
    compliance: {
      "Trade Agreements Act (TAA)": "Certified Compliant",
      "Safety Certifications": "UL/IEC 60601-1 Medical Electrical Equipment Certified",
      "Target Commands": "Veterans Health Administration (VHA), Military Treatment Facilities (MTF)"
    }
  },
  {
    id: 24,
    name: "Ergotron WorkFit-T Standing Desk Converter (TAA Compliant)",
    mpn: "33-397-085",
    category: "mounts",
    categoryLabel: "Ergonomic Mounts & Mobile Carts",
    distro: "TD SYNNEX",
    image: "img/products/ergotron-workfit-t.jpg",
    price: 485.00,
    taa: true,
    sec889: true,
    shipping: "US Warehouse Stock — Ships 24-48h",
    desc: "Ergotron WorkFit-T Standing Desk Desktop Workstation. TAA Compliant for federal civilian and DoD offices.",
    specs: {
      "Work Surface Width": "35.0 inches (89.0 cm)",
      "Height Adjustment Lift": "15.0 inches (38.1 cm) Vertical Travel",
      "Weight Capacity": "10 to 35 lbs (4.5 to 15.9 kg)",
      "Lift Mechanism": "Counterbalancing Constant Force Scissor Lift",
      "Configuration": "Fits Dual 24-inch Monitors or Single Ultra-Wide Screen"
    },
    compliance: {
      "Trade Agreements Act (TAA)": "Certified Compliant",
      "Target Commands": "Federal Headquarters, General Services Administration (GSA) Leases"
    }
  },
  {
    id: 25,
    name: "StarTech.com TAA USB-C Quad 4K Monitor Docking Station (100W PD)",
    mpn: "DK31C4DPPDUE",
    category: "docks",
    categoryLabel: "Secure Connectivity & Docks",
    distro: "TD SYNNEX",
    image: "img/products/startech-quad-dock.jpg",
    price: 349.00,
    taa: true,
    sec889: true,
    shipping: "US Warehouse Stock — Ships 24h",
    desc: "StarTech.com TAA Compliant USB-C Dock with Quad 4K 60Hz DisplayPort/HDMI, 100W Power Delivery, GbE, 4x USB-A/C ports.",
    specs: {
      "Video Output": "Quad 4K @ 60Hz (Choice of 4x DisplayPort or 4x HDMI 2.0)",
      "Host Connection": "USB-C or Thunderbolt 3/4 with 100W Power Delivery (PD 3.0)",
      "Networking": "1x RJ45 Gigabit Ethernet (10/100/1000 Mbps with PXE Boot support)",
      "USB Expansion": "4x USB 3.2 Gen 2 (10Gbps) Ports (1x USB-C, 3x USB-A with Fast-Charge)",
      "Audio": "3.5mm 4-Position TRRS Headset Audio Jack"
    },
    compliance: {
      "Trade Agreements Act (TAA)": "Certified Compliant (Taiwan Origin)",
      "Section 889 NDAA": "Compliant (Realtek / DisplayLink Validated Silicon)",
      "Target Commands": "DoD Intelligence Analyst Desktops, Engineering Multi-Monitor Workstations"
    }
  },
  {
    id: 26,
    name: "StarTech.com TAA 2-Port Dual-Monitor DisplayPort Secure KVM Switch",
    mpn: "SV231DPDDUA2",
    category: "docks",
    categoryLabel: "Secure Connectivity & Docks",
    distro: "TD SYNNEX",
    image: "img/products/startech-kvm-switch.jpg",
    price: 625.00,
    taa: true,
    sec889: true,
    shipping: "US Warehouse Stock — Ships 24-48h",
    desc: "StarTech.com TAA Compliant 2-Port Dual-Monitor DisplayPort KVM Switch with 4K 60Hz and Audio isolation. NIAP PP4.0 ready.",
    specs: {
      "Host Channels": "2 Isolated Systems (Dual DisplayPort 1.2 Video per Host)",
      "Resolution": "Dual 4K @ 60Hz (3840x2160)",
      "Data Isolation": "Unidirectional Optical Data Diodes Prevent Data Leakage",
      "Tamper Protection": "Active Hardware Tamper Evident Seals & Chassis Intrusion Detection",
      "Memory Security": "Automatic Keyboard/Mouse Buffer Purging on Channel Switch"
    },
    compliance: {
      "NIAP Protection Profile": "Certified NIAP PP 4.0 for Peripheral Sharing Devices (PSD)",
      "Trade Agreements Act (TAA)": "Certified Compliant",
      "Target Commands": "NSA, DIA, Defense Intelligence Commands, Classified Air-Gapped Networks"
    }
  },
  {
    id: 27,
    name: "Jabra Engage 50 II Stereo USB-C Secure Call Headset",
    mpn: "Engage-50-II-Stereo",
    category: "audio",
    categoryLabel: "Secure Audio & Communications",
    distro: "Ingram Micro",
    image: "img/products/jabra-engage-50-ii.jpg",
    price: 239.00,
    taa: true,
    sec889: true,
    shipping: "US Warehouse Stock — Ships 24h",
    desc: "Jabra Engage 50 II Stereo USB-C Headset with Real-Time Call Insights, 3-Mic Noise Cancellation, Hearing Protection. FIPS compliant.",
    specs: {
      "Microphone System": "3-Microphone Array with Beamforming Noise Suppression",
      "Acoustic Protection": "Jabra SafeTone 2.0 & PeakStop (Prevents Acoustic Shock >105 dB)",
      "Connectivity": "USB-C Direct with In-line Call Control Unit (Answer/End/Mute/Vol)",
      "Busylight": "Integrated Multi-Color Status Rings on Both Earcups",
      "Software Analytics": "Real-Time Speech Clarity & Background Noise Quality Monitoring"
    },
    compliance: {
      "Trade Agreements Act (TAA)": "Certified Compliant",
      "Information Security": "FIPS 140-2 Compatible for Federal Telework & Dispatch",
      "Target Commands": "VA Telehealth Contact Centers, Federal Emergency Dispatch Operations"
    }
  },
  {
    id: 28,
    name: "Jabra Evolve2 65 Flex Wireless ANC Secure Headset",
    mpn: "Evolve2-65-Flex-UC",
    category: "audio",
    categoryLabel: "Secure Audio & Communications",
    distro: "Ingram Micro",
    image: "img/products/jabra-evolve2-65-flex.jpg",
    price: 319.00,
    taa: true,
    sec889: true,
    shipping: "US Warehouse Stock — Ships 24-48h",
    desc: "Jabra Evolve2 65 Flex Fold-and-Go Wireless Active Noise Cancelling Headset with secure USB-C adapter.",
    specs: {
      "Noise Cancellation": "Hybrid Active Noise Cancellation (ANC) with 6 Microphones",
      "Form Factor": "Ultra-Compact Fold-and-Go Travel Design with Pouch",
      "Wireless Range": "Up to 100 feet (30m) with Encrypted Jabra Link 380 USB-C Dongle",
      "Battery Life": "Up to 32 Hours Listening / 20 Hours Talk Time (Fast Charge 15m=4h)",
      "Microphone Boom": "Hide-Away Boom Arm with Auto-Mute on Lift"
    },
    compliance: {
      "Trade Agreements Act (TAA)": "Certified Compliant",
      "Section 889 NDAA": "Compliant",
      "Target Commands": "Executive Federal Leadership, Mobile Field Officers, DoD Briefing Teams"
    }
  },
  {
    id: 29,
    name: "Jabra Speak2 75 Professional Conference Speakerphone",
    mpn: "Speak2-75-MS",
    category: "audio",
    categoryLabel: "Secure Audio & Communications",
    distro: "Ingram Micro",
    image: "img/products/jabra-speak2-75.jpg",
    price: 389.00,
    taa: true,
    sec889: true,
    shipping: "US Warehouse Stock — Ships 24h",
    desc: "Jabra Speak2 75 Professional Speakerphone with Super-wideband Audio, 4 Beamforming Microphones, Microphone Quality Indicator.",
    specs: {
      "Audio Quality": "Super-Wideband Audio with 65mm Full-Range Speaker",
      "Microphone Pickup": "4 Beamforming Microphones with 360-Degree Voice Level Normalization",
      "Microphone Quality Ring": "Illuminated Custom LED Ring Shows Voice Clarity Score",
      "Connectivity": "USB-C, USB-A and Secure Bluetooth 5.2 (Up to 32 Hours Battery)",
      "Durability": "IP64 Rated Dust & Water Resistant Aluminum Chassis"
    },
    compliance: {
      "Trade Agreements Act (TAA)": "Certified Compliant",
      "UC Platform Certifications": "Microsoft Teams Rooms & Zoom Government Certified",
      "Target Commands": "Tactical Operations Centers (TOC), Command Briefing Rooms"
    }
  },
  {
    id: 30,
    name: "IOGEAR TAA Common Access Card (CAC) / Smart Card Reader",
    mpn: "GSR202G",
    category: "docks",
    categoryLabel: "Secure Connectivity & Docks",
    distro: "Ingram Micro",
    image: "img/products/iogear-cac-reader.jpg",
    price: 29.99,
    taa: true,
    sec889: true,
    shipping: "US Warehouse Stock — Ships 24h",
    desc: "IOGEAR TAA Compliant USB Common Access Card (CAC) / Smart Card Reader. FIPS 201 Compliant for military and federal personnel.",
    specs: {
      "Card Protocol Support": "ISO7816 Class A, B, and C (5V, 3V, 1.8V) Smart Cards",
      "Standards": "EMV Level 1, PC/SC 2.0, Microsoft WHQL Certified",
      "Interface": "USB 2.0 Type-A (High-speed 12 Mbps)",
      "Indicator": "Dual LED Power & Card Activity Status",
      "OS Compatibility": "Windows 11/10, Red Hat Enterprise Linux, macOS, DoD CAC Enclave"
    },
    compliance: {
      "FIPS Standard": "FIPS 201 Approved (Federal Identity Credentialing)",
      "Trade Agreements Act (TAA)": "Certified Compliant (Taiwan Origin)",
      "GSA Approved": "Listed on GSA Approved Products List (APL)",
      "Target Commands": "All DoD Military Branches, Dept of Homeland Security, Federal Judiciary"
    }
  },
  {
    id: 31,
    name: "APC Smart-UPS 1500VA LCD 120V with SmartConnect",
    mpn: "SMT1500C",
    category: "power",
    categoryLabel: "Power & Infrastructure",
    distro: "Ingram Micro",
    image: "img/products/apc-smart-ups-1500.jpg",
    price: 899.00,
    taa: true,
    sec889: true,
    shipping: "Heavy Freight — Ships 24-48h",
    desc: "APC Smart-UPS 1500VA 1000W Pure Sine Wave Battery Backup with SmartConnect Cloud Monitoring for mission-critical IT racks.",
    specs: {
      "Output Power Capacity": "1440 VA / 1000 Watts Pure Sine Wave",
      "Input / Output Voltage": "120V Nominal (NEMA 5-15P Input Plug)",
      "Receptacles": "8x NEMA 5-15R Battery Backup Outlets",
      "Battery Chemistry": "Maintenance-free Sealed Lead-Acid (Hot-Swappable Module)",
      "Surge Protection": "Surge Energy Rating 680 Joules with Noise Filtering",
      "Interface": "SmartSlot Expansion Port + SmartConnect Cloud Monitoring"
    },
    compliance: {
      "Trade Agreements Act (TAA)": "Certified Compliant",
      "Safety Certifications": "UL 1778, CSA Certified, Energy Star V2.0",
      "Target Commands": "Field Deployable Server Racks, VA Medical Records Servers, DoD SCIFs"
    }
  },
  {
    id: 32,
    name: "APC NetShelter SX 42U Server Enclosure Cabinet",
    mpn: "AR3100",
    category: "power",
    categoryLabel: "Power & Infrastructure",
    distro: "Ingram Micro",
    image: "img/products/apc-netshelter-42u.jpg",
    price: 1650.00,
    taa: true,
    sec889: true,
    shipping: "Freight LTL — Ships 3-5 Days",
    desc: "APC NetShelter SX 42U Server Rack Enclosure Cabinet with integrated cable management and locking doors.",
    specs: {
      "Rack Height": "42U (Internal Dimensions: 78.39in H x 23.62in W x 42.13in D)",
      "Weight Capacity": "3,000 lbs (1,360 kg) Static Load / 2,250 lbs Dynamic Load",
      "Doors": "High-Flow Perforated Mesh Curved Front & Split Rear Doors with Keyed Locks",
      "Roof Architecture": "Overhead Cable Access Openings with Toolless Brush Strips",
      "Mounting Standards": "EIA-310-E 19-inch Server Rack Mounting Standard"
    },
    compliance: {
      "Trade Agreements Act (TAA)": "Certified Compliant",
      "Physical Security": "Lockable Side Panels & Front/Rear Doors (Tamper Resistant)",
      "Target Commands": "Defense Data Centers, VA Regional Hospital Server Rooms, Tactical Shelters"
    }
  }
];

class GovConCartManager {
  constructor() {
    this.cart = this.loadCart();
    this.currentCategory = 'all';
    this.searchQuery = '';
    this.init();
  }

  loadCart() {
    try {
      const saved = localStorage.getItem('govcon_gpc_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem('govcon_gpc_cart', JSON.stringify(this.cart));
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
    this.updateCartUi();
  }

  init() {
    this.renderProducts();
    this.setupListeners();
    this.updateCartUi();
  }

  setupListeners() {
    // Search input
    const searchInput = document.getElementById('store-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderProducts();
      });
    }

    // Category pills
    const pills = document.querySelectorAll('.cat-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        const cat = pill.getAttribute('data-category');
        if (cat) {
          pills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          this.currentCategory = cat;
          this.renderProducts();
        }
      });
    });

    // Cart Drawer Toggle
    const cartBtn = document.getElementById('floating-cart-btn');
    const overlay = document.getElementById('cart-drawer-overlay');
    const drawer = document.getElementById('cart-drawer');
    const closeBtn = document.getElementById('btn-close-drawer');

    if (cartBtn) {
      cartBtn.addEventListener('click', () => this.openDrawer());
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeDrawer());
    }
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this.closeDrawer();
      });
    }

    // Checkout Modal Toggle
    const checkoutBtn = document.getElementById('btn-open-checkout');
    const checkoutOverlay = document.getElementById('checkout-modal-overlay');
    const closeCheckoutBtn = document.getElementById('btn-close-checkout');

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        this.closeDrawer();
        this.openCheckout();
      });
    }
    if (closeCheckoutBtn) {
      closeCheckoutBtn.addEventListener('click', () => this.closeCheckout());
    }
    if (checkoutOverlay) {
      checkoutOverlay.addEventListener('click', (e) => {
        if (e.target === checkoutOverlay) this.closeCheckout();
      });
    }

    // Quick-Spec Modal Overlay Toggle
    const specOverlay = document.getElementById('spec-modal-overlay');
    const closeSpecBtn = document.getElementById('btn-close-spec');
    if (closeSpecBtn) {
      closeSpecBtn.addEventListener('click', () => this.closeSpecModal());
    }
    if (specOverlay) {
      specOverlay.addEventListener('click', (e) => {
        if (e.target === specOverlay) this.closeSpecModal();
      });
    }

    // Checkout Form Submission
    const form = document.getElementById('gpc-checkout-form');
    if (form) {
      form.addEventListener('submit', (e) => this.handleOrderSubmit(e));
    }
  }

  openDrawer() {
    document.getElementById('cart-drawer-overlay')?.classList.add('open');
    document.getElementById('cart-drawer')?.classList.add('open');
  }

  closeDrawer() {
    document.getElementById('cart-drawer-overlay')?.classList.remove('open');
    document.getElementById('cart-drawer')?.classList.remove('open');
  }

  openCheckout() {
    this.renderCheckoutSummary();
    document.getElementById('checkout-modal-overlay')?.classList.add('open');
  }

  closeCheckout() {
    document.getElementById('checkout-modal-overlay')?.classList.remove('open');
  }

  openSpecModal(productId) {
    const product = GOVCON_PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const modalBody = document.getElementById('spec-modal-body');
    if (!modalBody) return;

    // Build Specs Table Rows
    const specsRows = product.specs ? Object.entries(product.specs).map(([k, v]) => `
      <tr>
        <th>${k}</th>
        <td>${v}</td>
      </tr>
    `).join('') : '<tr><td colspan="2">Standard manufacturer specifications apply.</td></tr>';

    // Build Compliance Cards
    const compCards = product.compliance ? Object.entries(product.compliance).map(([k, v]) => `
      <div class="comp-spec-card">
        <strong><i class="fas fa-check-shield" style="color: #166534;"></i> ${k}</strong>
        <span>${v}</span>
      </div>
    `).join('') : '';

    modalBody.innerHTML = `
      <div class="spec-grid-layout">
        <div class="spec-img-box">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="spec-info-col">
          <div style="font-size: 12px; font-weight: 700; color: var(--gov-accent); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
            ${product.categoryLabel} &bull; Sourced via ${product.distro}
          </div>
          <h2>${product.name}</h2>
          <div class="spec-mpn-badge">
            <i class="fas fa-barcode"></i> MPN: <strong>${product.mpn}</strong>
          </div>
          <p class="spec-desc-text">${product.desc}</p>
          <div class="spec-price-action-row">
            <div>
              <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700;">GPC Government Price</div>
              <div style="font-size: 24px; font-weight: 800; color: #0f172a;">$${product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <button class="btn-add-cart" onclick="govconCart.addToCart(${product.id}); govconCart.closeSpecModal();" style="padding: 11px 20px;">
              <i class="fas fa-cart-plus"></i> Add to GPC Order
            </button>
          </div>
        </div>
      </div>

      <div class="spec-section-title">
        <i class="fas fa-microchip" style="color: var(--gov-primary);"></i> Technical Hardware Specifications
      </div>
      <table class="spec-table">
        <tbody>
          ${specsRows}
        </tbody>
      </table>

      <div class="spec-section-title">
        <i class="fas fa-shield-alt" style="color: var(--gov-primary);"></i> Regulatory &amp; Public-Sector Compliance
      </div>
      <div class="compliance-spec-grid">
        <div class="comp-spec-card">
          <strong><i class="fas fa-certificate" style="color: #d97706;"></i> Prime Contractor</strong>
          <span>20/59 Ventures Corp. &bull; CAGE: 22DH9 &bull; UEI: GVR2NTGR4HU3 &bull; SAM Active</span>
        </div>
        ${compCards}
      </div>
    `;

    document.getElementById('spec-modal-overlay')?.classList.add('open');
  }

  closeSpecModal() {
    document.getElementById('spec-modal-overlay')?.classList.remove('open');
  }

  renderProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    // Detect page-specific category if on a dedicated category page
    const pageCat = document.body.getAttribute('data-page-category');
    const activeCat = pageCat || this.currentCategory;

    let filtered = GOVCON_PRODUCTS;

    if (activeCat && activeCat !== 'all') {
      filtered = filtered.filter(p => p.category === activeCat);
    }

    if (this.searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(this.searchQuery) ||
        p.mpn.toLowerCase().includes(this.searchQuery) ||
        p.desc.toLowerCase().includes(this.searchQuery) ||
        p.distro.toLowerCase().includes(this.searchQuery)
      );
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
          <i class="fas fa-search" style="font-size: 38px; color: #94a3b8; margin-bottom: 14px;"></i>
          <h3 style="font-size: 18px; font-weight: 800; color: #1e293b; margin-bottom: 8px;">No Federal IT Hardware Found</h3>
          <p style="font-size: 14px; color: #64748b;">Try adjusting your search criteria or view all hardware categories.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(p => `
      <div class="product-card" data-product-id="${p.id}">
        <div class="card-header-banner">
          <div class="card-distro-tag">
            <i class="fas fa-network-wired" style="color: var(--gov-accent);"></i> ${p.distro}
          </div>
          <div class="card-compliance-badges">
            ${p.taa ? '<span class="comp-badge comp-taa"><i class="fas fa-flag-usa"></i> TAA</span>' : ''}
            ${p.sec889 ? '<span class="comp-badge comp-889"><i class="fas fa-shield-alt"></i> Sec 889</span>' : ''}
          </div>
        </div>
        <div class="card-img-wrap" onclick="govconCart.openSpecModal(${p.id})" style="cursor: pointer;" title="Click to view detailed specs">
          <img src="${p.image}" alt="${p.name}" class="product-thumb-img" loading="lazy">
        </div>
        <div class="card-body">
          <div class="card-category-label">${p.categoryLabel}</div>
          <h3 class="card-title" onclick="govconCart.openSpecModal(${p.id})" style="cursor: pointer;">${p.name}</h3>
          <div class="card-mpn-box">
            <i class="fas fa-barcode"></i> MPN: <strong>${p.mpn}</strong>
          </div>
          <p class="card-desc">${p.desc}</p>
          <div class="card-shipping-stat">
            <i class="fas fa-check-circle"></i> ${p.shipping}
          </div>
        </div>
        <div class="card-footer">
          <div class="card-price-wrap">
            <span class="card-price-label">GPC List Price</span>
            <span class="card-price-value">$${p.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div class="card-action-wrap">
            <button class="btn-card-spec" onclick="govconCart.openSpecModal(${p.id})" title="View Technical Specs">
              <i class="fas fa-list-ul"></i> Specs
            </button>
            <button class="btn-add-cart" onclick="govconCart.addToCart(${p.id})">
              <i class="fas fa-cart-plus"></i> Add
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  addToCart(productId) {
    const product = GOVCON_PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const qty = 1;

    const existingIndex = this.cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
      this.cart[existingIndex].qty += qty;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        mpn: product.mpn,
        price: product.price,
        distro: product.distro,
        image: product.image,
        qty: qty
      });
    }

    this.saveCart();

    // Visual button feedback
    const card = document.querySelector(`.product-card[data-product-id="${productId}"]`);
    const btn = card?.querySelector('.btn-add-cart');
    if (btn) {
      const origText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> Added';
      btn.classList.add('added');
      setTimeout(() => {
        btn.innerHTML = origText;
        btn.classList.remove('added');
      }, 1200);
    }
  }

  updateQuantity(productId, delta) {
    const item = this.cart.find(i => i.id === productId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      this.cart = this.cart.filter(i => i.id !== productId);
    }
    this.saveCart();
  }

  removeItem(productId) {
    this.cart = this.cart.filter(i => i.id !== productId);
    this.saveCart();
  }

  calculateTotal() {
    return this.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  }

  updateCartUi() {
    const totalCount = this.cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = this.calculateTotal();

    // Floating button pill
    const countPills = document.querySelectorAll('.cart-counter-pill');
    countPills.forEach(pill => {
      pill.textContent = totalCount;
    });

    const floatingBtn = document.getElementById('floating-cart-btn');
    if (floatingBtn) {
      floatingBtn.style.display = totalCount > 0 ? 'flex' : 'none';
    }

    // Render Items in Drawer
    const listEl = document.getElementById('drawer-items-list');
    if (listEl) {
      if (this.cart.length === 0) {
        listEl.innerHTML = `
          <div class="drawer-empty-msg">
            <i class="fas fa-shopping-basket" style="font-size: 42px; margin-bottom: 12px; display: block;"></i>
            Your Federal GPC Cart is empty.<br>Select TAA-compliant items from the catalog.
          </div>
        `;
      } else {
        listEl.innerHTML = this.cart.map(item => `
          <div class="cart-item-row">
            ${item.image ? `<img src="${item.image}" alt="${item.mpn}" class="cart-thumb-img">` : ''}
            <div class="cart-item-details">
              <div class="cart-item-title">${item.name}</div>
              <div class="cart-item-mpn">MPN: ${item.mpn} &bull; ${item.distro}</div>
              <div class="cart-item-controls">
                <div class="qty-stepper">
                  <button class="btn-stepper" onclick="govconCart.updateQuantity(${item.id}, -1)">-</button>
                  <span class="qty-val-text">${item.qty}</span>
                  <button class="btn-stepper" onclick="govconCart.updateQuantity(${item.id}, 1)">+</button>
                </div>
                <div class="cart-item-price">$${(item.price * item.qty).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <button class="btn-remove-item" onclick="govconCart.removeItem(${item.id})" title="Remove line item">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>
        `).join('');
      }
    }

    // Update Drawer Threshold Status & Totals
    const statusBox = document.getElementById('drawer-threshold-status');
    if (statusBox) {
      if (subtotal <= 10000 && subtotal > 0) {
        statusBox.innerHTML = `
          <div class="status-badge-wrap qualified">
            <i class="fas fa-check-circle" style="font-size: 18px;"></i>
            <div>
              <strong style="font-size: 13px;">FAR 13.201 Micro-Purchase Qualified</strong>
              <div style="font-size: 11.5px; opacity: 0.9;">Direct GPC Card checkout permitted under $10,000 statutory limit.</div>
            </div>
          </div>
        `;
      } else if (subtotal > 10000) {
        statusBox.innerHTML = `
          <div class="status-badge-wrap simplified">
            <i class="fas fa-info-circle" style="font-size: 18px;"></i>
            <div>
              <strong style="font-size: 13px;">FAR Part 13 Simplified Acquisition ($10k - $250k)</strong>
              <div style="font-size: 11.5px; opacity: 0.9;">Requires formal written contracting officer quote & GPC/PO sign-off.</div>
            </div>
          </div>
        `;
      } else {
        statusBox.innerHTML = `
          <div style="font-size: 12px; color: #64748b; text-align: center;">
            <i class="fas fa-shield-alt"></i> Micro-Purchase Threshold: $10,000.00 (FAR 13.201)
          </div>
        `;
      }
    }

    // Totals in drawer
    const subtotalEl = document.getElementById('drawer-subtotal-val');
    const totalEl = document.getElementById('drawer-total-val');
    const formattedSub = `$${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    if (subtotalEl) subtotalEl.textContent = formattedSub;
    if (totalEl) totalEl.textContent = formattedSub;

    const checkoutBtn = document.getElementById('btn-open-checkout');
    if (checkoutBtn) {
      checkoutBtn.disabled = this.cart.length === 0;
      checkoutBtn.style.opacity = this.cart.length === 0 ? '0.5' : '1';
    }
  }

  renderCheckoutSummary() {
    const box = document.getElementById('checkout-items-summary');
    const totalVal = document.getElementById('checkout-total-val');
    const subtotal = this.calculateTotal();

    if (box) {
      box.innerHTML = this.cart.map(item => `
        <div style="display: flex; align-items: center; justify-content: space-between; font-size: 13px; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px dashed #e2e8f0;">
          <div style="display: flex; align-items: center; gap: 8px;">
            ${item.image ? `<img src="${item.image}" alt="${item.mpn}" style="width: 32px; height: 32px; object-fit: contain; border-radius: 4px; border: 1px solid #cbd5e1;">` : ''}
            <span><strong>${item.qty}x</strong> ${item.mpn} (${item.distro})</span>
          </div>
          <span>$${(item.price * item.qty).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      `).join('');
    }

    if (totalVal) {
      totalVal.textContent = `$${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  }

  async handleOrderSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = document.getElementById('btn-submit-order-action');
    const errorBox = document.getElementById('order-submit-error');

    if (this.cart.length === 0) {
      alert('Your cart is empty. Please add items before submitting.');
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Submitting to Defense Bridge...';
    }
    if (errorBox) errorBox.style.display = 'none';

    const formData = new FormData(form);
    const payload = {
      agency: formData.get('agency') || '',
      contact_name: formData.get('contact_name') || '',
      title: formData.get('title') || '',
      email: formData.get('email') || '',
      phone: formData.get('phone') || '',
      payment_method: formData.get('payment_method') || 'gpc',
      gpc_ref: formData.get('gpc_ref') || '',
      delivery_address: formData.get('delivery_address') || '',
      delivery_requirements: formData.get('delivery_requirements') || '',
      rfq_token_hp: formData.get('rfq_token_hp') || '', // honeypot
      items: this.cart,
      total: this.calculateTotal()
    };

    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        // Clear cart
        this.cart = [];
        this.saveCart();

        // Show Success in Modal
        const modalBody = document.getElementById('checkout-modal-body');
        if (modalBody) {
          modalBody.innerHTML = `
            <div class="order-success-card">
              <i class="fas fa-check-circle order-success-icon"></i>
              <h2 class="order-success-title">Defense Order Dispatched to Odoo 18</h2>
              <p style="font-size: 15px; color: #475569; max-width: 520px; margin: 0 auto 16px;">
                Your government procurement request has been registered in the 20/59 Ventures Defense Engine.
              </p>
              <div class="order-ref-pill">
                Order Ref: <strong>${data.order_name || 'Draft Quotation'}</strong> &bull; Lead #${data.lead_id || 'CRM'}
              </div>
              <p style="font-size: 13.5px; color: #64748b; line-height: 1.5; margin-bottom: 24px;">
                A confirmation has been dispatched to <strong>${payload.email}</strong>.<br>
                Quincy Ruffin and the GovCon dispatch team have received an instant priority alert for final executive dropship verification.
              </p>
              <button class="btn-checkout-modal" onclick="location.reload()" style="max-width: 260px; margin: 0 auto;">
                Return to Storefront
              </button>
            </div>
          `;
        }
      } else {
        throw new Error(data.error || 'Submission failed');
      }
    } catch (err) {
      if (errorBox) {
        errorBox.textContent = `Error submitting order: ${err.message}. Please call 1-888-919-2059 for immediate priority assistance.`;
        errorBox.style.display = 'block';
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit GPC Order / Request Quotation';
      }
    }
  }
}

// Global instance
window.govconCart = new GovConCartManager();
