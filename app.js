/* ==================== STATE ==================== */
const state = {
  route: 'home',
  shopCategory: 'All',
  shopSort: 'featured',
  cart: JSON.parse(localStorage.getItem('typ_cart_v1') || '[]'),
  deliveryZone: 'kumasi',
  paymentChannel: 'mobile_money',
  activeQuickViewProduct: null,
  selectedQvSize: 'M'
};

const formatGHS = (amount) =>
  `GH₵ ${Number(amount).toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/* ==================== WELCOME FEATURE LOGIC ==================== */
const welcomeOverlay = document.getElementById('welcomeOverlay');
const enterAtelierBtn = document.getElementById('enterAtelierBtn');
const replayWelcomeBtn = document.getElementById('replayWelcomeBtn');

function dismissWelcome() {
  welcomeOverlay.classList.add('is-dismissed');
  document.body.classList.remove('no-scroll');
  sessionStorage.setItem('typ_welcomed', 'true');
  setTimeout(() => {
    welcomeOverlay.classList.add('is-hidden');
  }, 1150);
}

function showWelcome() {
  welcomeOverlay.classList.remove('is-hidden', 'is-dismissed');
  document.body.classList.add('no-scroll');
}

if (sessionStorage.getItem('typ_welcomed') === 'true') {
  welcomeOverlay.classList.add('is-hidden');
} else {
  document.body.classList.add('no-scroll');
}

enterAtelierBtn.addEventListener('click', dismissWelcome);
replayWelcomeBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'instant' });
  showWelcome();
});

/* ==================== ROUTING & NAVIGATION ==================== */
const siteHeader = document.getElementById('siteHeader');
const mobileDrawer = document.getElementById('mobileDrawer');

function updateHeaderStyle() {
  if (state.route === 'home' && window.scrollY < window.innerHeight * 0.65) {
    siteHeader.classList.add('is-hero-overlay');
  } else {
    siteHeader.classList.remove('is-hero-overlay');
  }
}

window.addEventListener('scroll', updateHeaderStyle, { passive: true });

function navigateTo(route, filterCat = null) {
  if (!['home', 'lookbook', 'shop', 'about'].includes(route)) route = 'home';
  state.route = route;

  if (filterCat) {
    state.shopCategory = filterCat;
    syncFilterPills();
    renderShopGrid();
  }

  document.querySelectorAll('.page-view').forEach((v) => v.classList.remove('is-active'));
  document.getElementById(`view-${route}`).classList.add('is-active');

  document.querySelectorAll('.nav-link').forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.route === route);
  });

  mobileDrawer.classList.remove('is-open');
  window.location.hash = route;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  updateHeaderStyle();
}

document.querySelectorAll('[data-route]').forEach((el) => {
  el.addEventListener('click', () => navigateTo(el.dataset.route));
});

document.querySelectorAll('[data-shop-filter]').forEach((el) => {
  el.addEventListener('click', () => navigateTo('shop', el.dataset.shopFilter));
});

document.getElementById('mobileMenuBtn').addEventListener('click', () => mobileDrawer.classList.add('is-open'));
document.getElementById('closeMobileDrawer').addEventListener('click', () => mobileDrawer.classList.remove('is-open'));

/* Hero Video Play/Pause Toggle */
const heroVideo = document.getElementById('heroVideo');
const toggleHeroVideoBtn = document.getElementById('toggleHeroVideoBtn');
const heroVideoStateText = document.getElementById('heroVideoStateText');

toggleHeroVideoBtn.addEventListener('click', () => {
  if (heroVideo.paused) {
    heroVideo.play();
    heroVideoStateText.textContent = 'Film Playing • Pause';
  } else {
    heroVideo.pause();
    heroVideoStateText.textContent = 'Film Paused • Play';
  }
});

/* ==================== RENDERING PRODUCTS & LOOKBOOK ==================== */
function createProductCardHTML(product) {
  return `
    <article class="product-card">
      <div class="product-media" onclick="openQuickView('${product.id}')">
        <img src="${product.img}" alt="${product.title}" loading="lazy" />
        <div class="product-quick-bar" onclick="event.stopPropagation()">
          <span style="font-size:0.62rem;letter-spacing:0.14em;text-transform:uppercase;color:var(--ink-muted);">Quick Add:</span>
          <div>
            ${['S', 'M', 'L', 'XL'].map((s) => `
              <button class="quick-size-btn" type="button" onclick="addToCart('${product.id}', '${s}')">${s}</button>
            `).join('')}
          </div>
        </div>
      </div>
      <div class="product-info">
        <div>
          <h3 class="product-title" onclick="openQuickView('${product.id}')">${product.title}</h3>
          <p class="product-material">${product.material}</p>
        </div>
        <span class="product-price">${formatGHS(product.price)}</span>
      </div>
    </article>
  `;
}

function renderHomeFeatured() {
  const container = document.getElementById('homeFeaturedGrid');
  const featured = PRODUCTS.filter((p) => p.featured);
  container.innerHTML = featured.map(createProductCardHTML).join('');
}

function renderShopGrid() {
  const container = document.getElementById('shopProductGrid');
  let list = state.shopCategory === 'All'
    ? [...PRODUCTS]
    : PRODUCTS.filter((p) => p.category === state.shopCategory);

  if (state.shopSort === 'price-asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (state.shopSort === 'price-desc') {
    list.sort((a, b) => b.price - a.price);
  }

  container.innerHTML = list.map(createProductCardHTML).join('');
}

function syncFilterPills() {
  document.querySelectorAll('#shopFilterPills .filter-pill').forEach((pill) => {
    pill.classList.toggle('is-active', pill.dataset.cat === state.shopCategory);
  });
}

document.querySelectorAll('#shopFilterPills .filter-pill').forEach((pill) => {
  pill.addEventListener('click', () => {
    state.shopCategory = pill.dataset.cat;
    syncFilterPills();
    renderShopGrid();
  });
});

document.getElementById('shopSortSelect').addEventListener('change', (e) => {
  state.shopSort = e.target.value;
  renderShopGrid();
});

function renderLookbook() {
  const container = document.getElementById('lookbookGrid');
  container.innerHTML = LOOKBOOK_FRAMES.map((frame) => `
    <article class="look-item ${frame.layout}">
      <div class="look-img-wrap">
        <img src="${frame.img}" alt="${frame.title}" loading="lazy" />
      </div>
      <div class="look-caption">
        <div>
          <h3>${frame.title}</h3>
          <span>${frame.subtitle}</span>
        </div>
        <button class="shop-look-btn" type="button" onclick="openQuickView('${frame.productId}')">
          Shop This Look
        </button>
      </div>
    </article>
  `).join('');
}

/* ==================== QUICK VIEW MODAL ==================== */
const quickViewModal = document.getElementById('quickViewModal');

window.openQuickView = function (productId) {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  state.activeQuickViewProduct = product;
  state.selectedQvSize = 'M';

  document.getElementById('qvImage').src = product.img;
  document.getElementById('qvImage').alt = product.title;
  document.getElementById('qvCategory').textContent = product.category;
  document.getElementById('qvTitle').textContent = product.title;
  document.getElementById('qvPrice').textContent = formatGHS(product.price);
  document.getElementById('qvDesc').textContent = product.desc;
  document.getElementById('qvMaterial').textContent = product.material;

  document.querySelectorAll('#qvSizes .size-pill').forEach((btn) => {
    btn.classList.toggle('is-selected', btn.dataset.size === 'M');
  });

  quickViewModal.classList.add('is-open');
};

document.querySelectorAll('#qvSizes .size-pill').forEach((btn) => {
  btn.addEventListener('click', () => {
    state.selectedQvSize = btn.dataset.size;
    document.querySelectorAll('#qvSizes .size-pill').forEach((b) => {
      b.classList.toggle('is-selected', b === btn);
    });
  });
});

document.getElementById('qvAddToBagBtn').addEventListener('click', () => {
  if (state.activeQuickViewProduct) {
    addToCart(state.activeQuickViewProduct.id, state.selectedQvSize);
    quickViewModal.classList.remove('is-open');
  }
});

document.getElementById('closeQuickViewBtn').addEventListener('click', () => {
  quickViewModal.classList.remove('is-open');
});

/* ==================== CART & DELIVERY LOGIC ==================== */
const cartDrawer = document.getElementById('cartDrawer');
const drawerBackdrop = document.getElementById('drawerBackdrop');

function openBag() {
  cartDrawer.classList.add('is-open');
  drawerBackdrop.classList.add('is-open');
}

function closeBag() {
  cartDrawer.classList.remove('is-open');
  drawerBackdrop.classList.remove('is-open');
}

document.getElementById('openBagBtn').addEventListener('click', openBag);
document.getElementById('closeBagBtn').addEventListener('click', closeBag);
drawerBackdrop.addEventListener('click', closeBag);

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('is-visible');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2800);
}

function saveCart() {
  localStorage.setItem('typ_cart_v1', JSON.stringify(state.cart));
  renderCart();
}

window.addToCart = function (productId, size = 'M') {
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  const existing = state.cart.find((item) => item.id === productId && item.size === size);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      img: product.img,
      size,
      qty: 1
    });
  }

  saveCart();
  showToast(`Added ${product.title} (${size})`);
  openBag();
};

window.updateQty = function (index, delta) {
  state.cart[index].qty += delta;
  if (state.cart[index].qty <= 0) {
    state.cart.splice(index, 1);
  }
  saveCart();
};

window.removeCartItem = function (index) {
  state.cart.splice(index, 1);
  saveCart();
};

function getCartTotals() {
  const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const delivery = state.cart.length > 0 ? DELIVERY_FEES[state.deliveryZone] : 0;
  return { subtotal, delivery, total: subtotal + delivery };
}

function renderCart() {
  const totalCount = state.cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById('navBagCount').textContent = totalCount;

  const itemsContainer = document.getElementById('cartItemsContainer');
  const checkoutPanel = document.getElementById('checkoutPanel');
  const cartFooter = document.getElementById('cartFooter');

  if (state.cart.length === 0) {
    itemsContainer.innerHTML = `
      <div class="cart-empty">
        <p style="font-family:var(--font-serif);font-size:1.5rem;color:var(--ink-obsidian);margin-bottom:0.5rem;">Your bag is empty</p>
        <p style="font-size:0.84rem;margin-bottom:1.5rem;">Explore our Kumasi-crafted silhouettes to begin.</p>
        <button class="btn-outline" type="button" onclick="closeBagAndShop()">Browse Shop</button>
      </div>
    `;
    checkoutPanel.style.display = 'none';
    cartFooter.style.display = 'none';
    return;
  }

  itemsContainer.innerHTML = state.cart.map((item, idx) => `
    <div class="cart-item">
      <img src="${item.img}" alt="${item.title}" />
      <div>
        <div class="cart-item-top">
          <span class="cart-item-title">${item.title}</span>
          <span style="font-size:0.82rem;font-weight:500;">${formatGHS(item.price * item.qty)}</span>
        </div>
        <div class="cart-item-meta">Size: ${item.size} &bull; ${formatGHS(item.price)} each</div>
        <div class="cart-item-controls">
          <div class="qty-stepper">
            <button type="button" onclick="updateQty(${idx}, -1)">&minus;</button>
            <span>${item.qty}</span>
            <button type="button" onclick="updateQty(${idx}, 1)">+</button>
          </div>
          <button class="remove-item-btn" type="button" onclick="removeCartItem(${idx})">Remove</button>
        </div>
      </div>
    </div>
  `).join('');

  checkoutPanel.style.display = 'block';
  cartFooter.style.display = 'block';

  const { subtotal, delivery, total } = getCartTotals();
  document.getElementById('summarySubtotal').textContent = formatGHS(subtotal);
  document.getElementById('summaryDeliveryLabel').textContent =
    state.deliveryZone === 'kumasi' ? 'Delivery (Within Kumasi)' : 'Delivery (Outside Kumasi)';
  document.getElementById('summaryDelivery').textContent = formatGHS(delivery);
  document.getElementById('summaryTotal').textContent = formatGHS(total);
}

window.closeBagAndShop = function () {
  closeBag();
  navigateTo('shop');
};

document.querySelectorAll('.delivery-option').forEach((option) => {
  option.addEventListener('click', () => {
    state.deliveryZone = option.dataset.zone;
    document.querySelectorAll('.delivery-option').forEach((el) => {
      const isMatch = el.dataset.zone === state.deliveryZone;
      el.classList.toggle('is-selected', isMatch);
      el.querySelector('input').checked = isMatch;
    });
    renderCart();
  });
});

document.querySelectorAll('.pay-method-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    state.paymentChannel = btn.dataset.channel;
    document.querySelectorAll('.pay-method-btn').forEach((b) => {
      b.classList.toggle('is-selected', b === btn);
    });
  });
});

/* ==================== PAYSTACK CHECKOUT INTEGRATION ==================== */
function showOrderReceipt(reference, isSimulated) {
  const name = document.getElementById('custName').value.trim();
  const email = document.getElementById('custEmail').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const address = document.getElementById('custAddress').value.trim();
  const { subtotal, delivery, total } = getCartTotals();

  document.getElementById('receiptMessage').textContent = isSimulated
    ? 'Demo Checkout Complete! Once you add your Paystack Public Key in js/data.js, this button launches the live Paystack Mobile Money & Card popup.'
    : 'Your payment via Paystack has been authorized. Our Kumasi studio is preparing your pieces.';

  document.getElementById('receiptDetails').innerHTML = `
    <strong>Reference:</strong> ${reference}<br />
    <strong>Client:</strong> ${name} (${phone})<br />
    <strong>Email:</strong> ${email}<br />
    <strong>Delivery Zone:</strong> ${state.deliveryZone === 'kumasi' ? 'Within Kumasi (GH₵ 20)' : 'Outside Kumasi (GH₵ 40)'}<br />
    <strong>Address:</strong> ${address}<br />
    <strong>Channel:</strong> ${state.paymentChannel === 'mobile_money' ? 'Mobile Money (Paystack)' : 'Debit / Credit Card (Paystack)'}<br />
    <strong>Subtotal:</strong> ${formatGHS(subtotal)} &bull; <strong>Delivery:</strong> ${formatGHS(delivery)}<br />
    <strong>Total Paid:</strong> ${formatGHS(total)}
  `;

  state.cart = [];
  saveCart();
  closeBag();
  document.getElementById('receiptModal').classList.add('is-open');
}

document.getElementById('closeReceiptBtn').addEventListener('click', () => {
  document.getElementById('receiptModal').classList.remove('is-open');
});

document.getElementById('payWithPaystackBtn').addEventListener('click', () => {
  if (state.cart.length === 0) return;

  const name = document.getElementById('custName').value.trim();
  const email = document.getElementById('custEmail').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const address = document.getElementById('custAddress').value.trim();

  if (!name || !email || !phone || !address) {
    showToast('Please complete your name, email, phone & delivery address');
    return;
  }

  const { subtotal, delivery, total } = getCartTotals();
  const amountInPesewas = Math.round(total * 100);
  const ref = 'TYP-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

  if (!PAYSTACK_PUBLIC_KEY || PAYSTACK_PUBLIC_KEY.includes('YOUR_PAYSTACK_PUBLIC_KEY') || typeof PaystackPop === 'undefined') {
    showOrderReceipt(ref + '-TEST', true);
    return;
  }

  const channels = state.paymentChannel === 'mobile_money'
    ? ['mobile_money', 'card']
    : ['card', 'mobile_money'];

  const handler = PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: email,
    amount: amountInPesewas,
    currency: 'GHS',
    ref: ref,
    channels: channels,
    metadata: {
      custom_fields: [
        { display_name: 'Client Name', variable_name: 'client_name', value: name },
        { display_name: 'Phone / MoMo Number', variable_name: 'phone_number', value: phone },
        { display_name: 'Delivery Zone', variable_name: 'delivery_zone', value: state.deliveryZone === 'kumasi' ? 'Kumasi (GHS 20)' : 'Outside Kumasi (GHS 40)' },
        { display_name: 'Delivery Address', variable_name: 'delivery_address', value: address },
        { display_name: 'Items', variable_name: 'order_items', value: state.cart.map(i => `${i.title} (${i.size}) x${i.qty}`).join(', ') },
        { display_name: 'Subtotal GHS', variable_name: 'subtotal_ghs', value: subtotal },
        { display_name: 'Delivery GHS', variable_name: 'delivery_ghs', value: delivery }
      ]
    },
    callback: function (response) {
      showOrderReceipt(response.reference, false);
    },
    onClose: function () {
      showToast('Paystack checkout closed');
    }
  });

  handler.openIframe();
});

/* ==================== INITIALIZATION ==================== */
(function init() {
  renderHomeFeatured();
  renderShopGrid();
  renderLookbook();
  renderCart();

  const hashRoute = window.location.hash.replace('#', '');
  if (['home', 'lookbook', 'shop', 'about'].includes(hashRoute)) {
    navigateTo(hashRoute);
  } else {
    updateHeaderStyle();
  }
})();