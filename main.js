/**
 * main.js — Popular Marble Website
 * All features combined:
 * - Navbar toggle
 * - User modal (login/register)
 * - Product search
 * - Hero slider
 * - Cart
 * - Scroll animations
 * - Gallery lightbox
 * - Contact form demo
 */

document.addEventListener("DOMContentLoaded", () => {

  /* ==========================
     NAVBAR TOGGLE
  ========================== */
  (function initNavbar() {
    const navToggle = document.getElementById("nav-toggle");
    const navLinks = document.getElementById("nav-links");
    if (!navToggle || !navLinks) return;
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("show");
    });
  })();

  /* ==========================
     USER MODAL (Login/Register)
  ========================== */
  (function initUserModal() {
    const userBtn = document.getElementById("user-btn");
    const modal = document.getElementById("user-modal");
    const closeBtn = modal ? modal.querySelector(".close-btn") : null;
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const showLogin = document.getElementById("show-login");
    const showRegister = document.getElementById("show-register");

    if (!userBtn || !modal) return;

    userBtn.addEventListener("click", (e) => {
      e.preventDefault();
      modal.style.display = "flex";
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", () => modal.style.display = "none");
    }

    window.addEventListener("click", (e) => {
      if (e.target === modal) modal.style.display = "none";
    });

    if (showRegister) {
      showRegister.addEventListener("click", (e) => {
        e.preventDefault();
        loginForm.classList.remove("active");
        registerForm.classList.add("active");
      });
    }

    if (showLogin) {
      showLogin.addEventListener("click", (e) => {
        e.preventDefault();
        registerForm.classList.remove("active");
        loginForm.classList.add("active");
      });
    }
  })();

  const cartBtn = document.getElementById("cart-btn");
const cart = document.getElementById("cart");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const closeCartBtn = document.querySelector(".close-cart");
const cartCount = document.getElementById("cart-count");

let items = [];
let total = 0;

// open/close cart
cartBtn.addEventListener("click", () => cart.classList.toggle("open"));
closeCartBtn.addEventListener("click", () => cart.classList.remove("open"));

// add to cart
document.querySelectorAll(".add-to-cart").forEach(btn => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.name;
    const price = parseInt(btn.dataset.price, 10);

    items.push({ name, price });
    total += price;

    updateCart();
  });
});

function updateCart() {
  cartItemsEl.innerHTML = "";
  items.forEach((item, idx) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.name}</span>
      <span>Rs. ${item.price}</span>
    `;
    cartItemsEl.appendChild(li);
  });
  cartTotalEl.textContent = "Total: Rs. " + total;
  cartCount.textContent = items.length;
}


  /* ==========================
     PRODUCT SEARCH
  ========================== */
  (function initSearch() {
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");
    const productCards = document.querySelectorAll(".products-grid .card");

    if (!searchInput || !productCards.length) return;

    function filterProducts() {
      const query = searchInput.value.toLowerCase().trim();
      productCards.forEach(card => {
        const name = card.querySelector("h3")?.textContent.toLowerCase();
        if (name && name.includes(query)) {
          card.style.display = "";   // default (grid item)
        } else {
          card.style.display = "none";
        }
      });
    }

    searchInput.addEventListener("keyup", filterProducts);
    if (searchBtn) {
      searchBtn.addEventListener("click", (e) => {
        e.preventDefault();
        filterProducts();
      });
    }
  })();

  /* ==========================
     HERO SLIDER
  ========================== */
  (function initHeroSlider() {
    const slides = document.querySelectorAll(".hero-slider .slide");
    const prevBtn = document.querySelector(".hero-slider .prev");
    const nextBtn = document.querySelector(".hero-slider .next");
    const dotsContainer = document.querySelector(".hero-slider .dots");

    if (!slides.length) return;

    let index = 0;
    let autoPlayInterval = null;
    const dots = [];

    // Dots
    if (dotsContainer) {
      slides.forEach((_, i) => {
        const dot = document.createElement("span");
        dot.addEventListener("click", () => showSlide(i));
        dotsContainer.appendChild(dot);
        dots.push(dot);
      });
    }

    function syncDots(i) {
      dots.forEach((d, idx) => d.classList.toggle("active", idx === i));
    }

    function showSlide(i) {
      slides.forEach((s, idx) => s.classList.toggle("active", idx === i));
      index = i;
      syncDots(i);
    }

    function nextSlide() { showSlide((index + 1) % slides.length); }
    function prevSlide() { showSlide((index - 1 + slides.length) % slides.length); }

    if (nextBtn) nextBtn.addEventListener("click", nextSlide);
    if (prevBtn) prevBtn.addEventListener("click", prevSlide);

    function startAutoPlay() {
      stopAutoPlay();
      autoPlayInterval = setInterval(nextSlide, 5000);
    }
    function stopAutoPlay() {
      if (autoPlayInterval) clearInterval(autoPlayInterval);
    }

    slides.forEach(slide => {
      slide.addEventListener("mouseenter", stopAutoPlay);
      slide.addEventListener("mouseleave", startAutoPlay);
    });

    showSlide(0);
    startAutoPlay();
  })();

  /* ==========================
     CART SYSTEM
  ========================== */
  (function initCart() {
    const cart = document.getElementById("cart");
    const cartItemsEl = document.getElementById("cart-items");
    const cartTotalEl = document.getElementById("cart-total");
    const checkoutBtn = document.getElementById("checkout-btn");
    const closeCartBtn = document.getElementById("close-cart");
    const addToCartBtns = document.querySelectorAll(".add-to-cart");

    if (!cart || !cartItemsEl || !cartTotalEl) return;

    let items = [];
    let total = 0;

    function formatRs(n) { return `Rs. ${n}`; }

    function updateCartUI() {
      cartItemsEl.innerHTML = "";
      items.forEach((item, idx) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <div style="display:flex;align-items:center;gap:10px;flex:1">
            <img src="${item.img}" alt="${item.name}" style="width:50px;border-radius:6px;object-fit:cover">
            <div style="flex:1">
              <div style="font-size:14px">${item.name}</div>
              <div style="font-size:12px;opacity:.8">${formatRs(item.price)}</div>
            </div>
          </div>
          <button class="remove-btn" data-index="${idx}">X</button>
        `;
        cartItemsEl.appendChild(li);
      });
      cartTotalEl.innerText = `Total: ${formatRs(total)}`;
    }

    addToCartBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const card = btn.closest(".card");
        if (!card) return;
        const name = card.querySelector("h3")?.innerText || "Product";
        const img = card.querySelector("img")?.src || "";
        const price = parseInt(btn.dataset.price || "0", 10) || 0;
        items.push({ name, img, price });
        total += price;
        updateCartUI();
        cart.classList.add("open");
        alert(`${name} added to cart ✅`);
      });
    });

    cartItemsEl.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove-btn")) {
        const idx = parseInt(e.target.dataset.index, 10);
        total -= items[idx].price;
        items.splice(idx, 1);
        updateCartUI();
      }
    });

    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        if (!items.length) { alert("Cart is empty!"); return; }
        const summary = items.map(it => `${it.name} (${formatRs(it.price)})`).join("\n");
        alert(`Checkout:\n\n${summary}\n\nTotal: ${formatRs(total)}`);
      });
    }

    if (closeCartBtn) closeCartBtn.addEventListener("click", () => cart.classList.remove("open"));
  })();

  /* ==========================
     SCROLL ANIMATIONS
  ========================== */
  (function initScrollAnimations() {
    function handleScroll() {
      document.querySelectorAll(".animate-left, .animate-right, .service-card")
        .forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight - 80) el.classList.add("visible");
        });
    }
    window.addEventListener("scroll", handleScroll);
    handleScroll();
  })();

  /* ==========================
     GALLERY LIGHTBOX
  ========================== */
  (function initGalleryLightbox() {
    const imgs = document.querySelectorAll(".gallery-item img");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    if (!imgs.length || !lightbox || !lightboxImg) return;
    let current = 0;

    function show(i) {
      current = (i + imgs.length) % imgs.length;
      lightboxImg.src = imgs[current].src;
      lightbox.style.display = "block";
    }

    imgs.forEach((img, i) => img.addEventListener("click", () => show(i)));
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.style.display = "none"; });
    document.addEventListener("keydown", (e) => {
      if (lightbox.style.display !== "block") return;
      if (e.key === "Escape") lightbox.style.display = "none";
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });
  })();

  /* ==========================
     CONTACT FORM DEMO
  ========================== */
  (function initContactForm() {
    const form = document.querySelector("form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("📩 Thank you! Your message has been sent.");
      form.reset();
    });
  })();

});
