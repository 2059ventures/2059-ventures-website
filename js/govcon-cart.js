// ═══════════════════════════════════════════════════════════════════════════
// 20/59 VENTURES CORP. — DEFENSE & FEDERAL IT STOREFRONT & CART ENGINE
// Persistent Session Cart, Micro-Purchase Tracker (<$10k), and Odoo Bridge
// ═══════════════════════════════════════════════════════════════════════════

const GOVCON_PRODUCTS = [
  {
    id: 19,
    name: "Cisco Catalyst 9300 48-Port PoE+ Switch (TAA Compliant)",
    mpn: "C9300-48P-A",
    category: "networking",
    categoryLabel: "Enterprise Networking & Security",
    distro: "TD SYNNEX",
    price: 4850.00,
    taa: true,
    sec889: true,
    shipping: "US Warehouse Stock — Ships 24-48h",
    desc: "Cisco Catalyst 9300 48-Port PoE+ Layer 3 Switch with Network Advantage. TAA Compliant. Micro-Purchase / Simplified Acquisition Ready."
  },
  {
    id: 20,
    name: "Cisco Catalyst 9200L 24-Port Gigabit PoE+ Switch (TAA Compliant)",
    mpn: "C9200L-24P-4G-A",
    category: "networking",
    categoryLabel: "Enterprise Networking & Security",
    distro: "TD SYNNEX",
    price: 2190.00,
    taa: true,
    sec889: true,
    shipping: "US Warehouse Stock — Ships 24-48h",
    desc: "Cisco Catalyst 9200L 24-Port Gigabit PoE+ with 4x 1G SFP uplinks, Network Advantage. TAA Compliant for federal field & tactical deployments."
  },
  {
    id: 21,
    name: "Cisco Meraki MX68 Small Branch Cloud Security Appliance",
    mpn: "MX68-HW",
    category: "networking",
    categoryLabel: "Enterprise Networking & Security",
    distro: "TD SYNNEX",
    price: 895.00,
    taa: false,
    sec889: true,
    shipping: "US Warehouse Stock — Ships 24h",
    desc: "Cisco Meraki MX68 Cloud Managed Security & SD-WAN Appliance with 10x GbE, 2x PoE+. Section 889 Compliant firewall."
  },
  {
    id: 22,
    name: "Ergotron LX Desk Mount LCD Monitor Arm (Polished Aluminum)",
    mpn: "45-241-026",
    category: "mounts",
    categoryLabel: "Ergonomic Mounts & Mobile Carts",
    distro: "TD SYNNEX",
    price: 219.00,
    taa: true,
    sec889: true,
    shipping: "US Warehouse Stock — Ships 24-48h",
    desc: "Ergotron LX Desk Mount LCD Arm, Polished Aluminum finish. Supports up to 34in displays (25 lbs). Constant Force technology."
  },
  {
    id: 23,
    name: "Ergotron CareFit Pro Medical & Field Mobile Workstation Cart",
    mpn: "C52-1201-1",
    category: "mounts",
    categoryLabel: "Ergonomic Mounts & Mobile Carts",
    distro: "TD SYNNEX",
    price: 3250.00,
    taa: true,
    sec889: true,
    shipping: "Freight Delivery — Ships 3-5 Days",
    desc: "Ergotron CareFit Pro Medical & Field Mobile Cart with electric lift and integrated LiFe battery system for hospital & deployable medical units."
  },
  {
    id: 24,
    name: "Ergotron WorkFit-T Standing Desk Converter (TAA Compliant)",
    mpn: "33-397-085",
    category: "mounts",
    categoryLabel: "Ergonomic Mounts & Mobile Carts",
    distro: "TD SYNNEX",
    price: 485.00,
    taa: true,
    sec889: true,
    shipping: "US Warehouse Stock — Ships 24-48h",
    desc: "Ergotron WorkFit-T Standing Desk Desktop Workstation. TAA Compliant for federal civilian and DoD offices."
  },
  {
    id: 25,
    name: "StarTech.com TAA USB-C Quad 4K Monitor Docking Station (100W PD)",
    mpn: "DK31C4DPPDUE",
    category: "docks",
    categoryLabel: "Secure Connectivity & Docks",
    distro: "TD SYNNEX",
    price: 349.00,
    taa: true,
    sec889: true,
    shipping: "US Warehouse Stock — Ships 24h",
    desc: "StarTech.com TAA Compliant USB-C Dock with Quad 4K 60Hz DisplayPort/HDMI, 100W Power Delivery, GbE, 4x USB-A/C ports."
  },
  {
    id: 26,
    name: "StarTech.com TAA 2-Port Dual-Monitor DisplayPort Secure KVM Switch",
    mpn: "SV231DPDDUA2",
    category: "docks",
    categoryLabel: "Secure Connectivity & Docks",
    distro: "TD SYNNEX",
    price: 625.00,
    taa: true,
    sec889: true,
    shipping: "US Warehouse Stock — Ships 24-48h",
    desc: "StarTech.com TAA Compliant 2-Port Dual-Monitor DisplayPort KVM Switch with 4K 60Hz and Audio isolation. NIAP PP4.0 ready."
  },
  {
    id: 27,
    name: "Jabra Engage 50 II Stereo USB-C Secure Call Headset",
    mpn: "Engage-50-II-Stereo",
    category: "audio",
    categoryLabel: "Secure Audio & Communications",
    distro: "Ingram Micro",
    price: 239.00,
    taa: true,
    sec889: true,
    shipping: "US Warehouse Stock — Ships 24h",
    desc: "Jabra Engage 50 II Stereo USB-C Headset with Real-Time Call Insights, 3-Mic Noise Cancellation, Hearing Protection. FIPS compliant."
  },
  {
    id: 28,
    name: "Jabra Evolve2 65 Flex Wireless ANC Secure Headset",
    mpn: "Evolve2-65-Flex-UC",
    category: "audio",
    categoryLabel: "Secure Audio & Communications",
    distro: "Ingram Micro",
    price: 319.00,
    taa: true,
    sec889: true,
    shipping: "US Warehouse Stock — Ships 24-48h",
    desc: "Jabra Evolve2 65 Flex Fold-and-Go Wireless Active Noise Cancelling Headset with secure USB-C adapter."
  },
  {
    id: 29,
    name: "Jabra Speak2 75 Professional Conference Speakerphone",
    mpn: "Speak2-75-MS",
    category: "audio",
    categoryLabel: "Secure Audio & Communications",
    distro: "Ingram Micro",
    price: 389.00,
    taa: true,
    sec889: true,
    shipping: "US Warehouse Stock — Ships 24h",
    desc: "Jabra Speak2 75 Professional Speakerphone with Super-wideband Audio, 4 Beamforming Microphones, Microphone Quality Indicator."
  },
  {
    id: 30,
    name: "IOGEAR TAA Common Access Card (CAC) / Smart Card Reader",
    mpn: "GSR202G",
    category: "docks",
    categoryLabel: "Secure Connectivity & Docks",
    distro: "Ingram Micro",
    price: 29.99,
    taa: true,
    sec889: true,
    shipping: "US Warehouse Stock — Ships 24h",
    desc: "IOGEAR TAA Compliant USB Common Access Card (CAC) / Smart Card Reader. FIPS 201 Compliant for military and federal personnel."
  },
  {
    id: 31,
    name: "APC Smart-UPS 1500VA LCD 120V with SmartConnect",
    mpn: "SMT1500C",
    category: "power",
    categoryLabel: "Power & Infrastructure",
    distro: "Ingram Micro",
    price: 899.00,
    taa: true,
    sec889: true,
    shipping: "Heavy Freight — Ships 24-48h",
    desc: "APC Smart-UPS 1500VA 1000W Pure Sine Wave Battery Backup with SmartConnect Cloud Monitoring for mission-critical IT racks."
  },
  {
    id: 32,
    name: "APC NetShelter SX 42U Server Enclosure Cabinet",
    mpn: "AR3100",
    category: "power",
    categoryLabel: "Power & Infrastructure",
    distro: "Ingram Micro",
    price: 1650.00,
    taa: true,
    sec889: true,
    shipping: "Freight LTL — Ships 3-5 Days",
    desc: "APC NetShelter SX 42U Server Rack Enclosure Cabinet with integrated cable management and locking doors."
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
        <div class="card-body">
          <div class="card-category-label">${p.categoryLabel}</div>
          <h3 class="card-title">${p.name}</h3>
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
            <input type="number" min="1" max="99" value="1" class="qty-input-store" id="qty-${p.id}" aria-label="Quantity for ${p.mpn}">
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

    const qtyInput = document.getElementById(`qty-${productId}`);
    const qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;

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
        <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px; padding-bottom: 4px; border-bottom: 1px dashed #e2e8f0;">
          <span><strong>${item.qty}x</strong> ${item.mpn} (${item.distro})</span>
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
