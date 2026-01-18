/**
 * Dharma Dairy & Veg - Main Script
 * Handles UI, Cart, Products, and Interactions.
 * @version 2.0.0
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Dharma Dairy & Veg - Premium Web Loaded');
    initializeApp();
});

/**
 * Initialize all core application modules
 */
const initializeApp = () => {
    checkAuthStatus();
    updateCartBadge();
    initTestimonialsCarousel();
    initNewsletter();
    initProductFilters();
    initScrollAnimations();
    initSearchListener();

    // Page specific initializers
    if (document.getElementById('dairy-fresh-list')) renderFreshList();
    initProductsPage();
    startLiveClock();
};

/**
 * Live Date and Time Clock
 */
const startLiveClock = () => {
    const clockElement = document.getElementById('live-datetime');
    if (!clockElement) return;

    const updateClock = () => {
        const now = new Date();
        const options = {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        clockElement.textContent = now.toLocaleDateString('en-US', options);
    };

    updateClock(); // Initial call
    setInterval(updateClock, 1000);
};

/* =========================================
   UI & Navigation
   ========================================= */

/**
 * Toggles the mobile navigation menu
 */
const toggleMobileMenu = () => {
    const body = document.body;
    const menuIcon = document.querySelector('.mobile-menu-toggle i');
    let overlay = document.querySelector('.mobile-menu-overlay');

    // Create overlay if missing
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'mobile-menu-overlay';
        overlay.onclick = toggleMobileMenu;
        document.body.appendChild(overlay);
    }

    body.classList.toggle('mobile-menu-open');

    // Update Icon State
    if (menuIcon) {
        const isOpen = body.classList.contains('mobile-menu-open');
        menuIcon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';

        // Style adjustments for open state
        Object.assign(menuIcon.style, isOpen ? {
            position: 'fixed',
            zIndex: '1002',
            right: '1rem',
            top: '1.3rem'
        } : {
            position: '',
            zIndex: '',
            right: '',
            top: ''
        });
    }
};

// Close menu when clicking a nav link
document.querySelectorAll('.desktop-nav a').forEach(link => {
    link.addEventListener('click', () => {
        if (document.body.classList.contains('mobile-menu-open')) {
            toggleMobileMenu();
        }
    });
});

/* =========================================
   Cart Functionality
   ========================================= */

// State
let cart = JSON.parse(localStorage.getItem('dharmaCart')) || [];

/**
 * Adds a product to the cart
 * @param {Object} product - The product object
 * @param {Event} event - The click event
 */
function addToCart(product, event) {
    cart.push(product);
    localStorage.setItem('dharmaCart', JSON.stringify(cart));

    showCartToast(product);
    animateCartIcon();
    updateCartBadge();

    if (event?.target) {
        createFlyingProduct(event.target, product);
    }
}

/**
 * Shows a toast notification for cart actions
 * @param {Object} product 
 */
const showCartToast = (product) => {
    document.querySelector('.cart-toast')?.remove();

    const toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.innerHTML = `
        <div class="cart-toast-icon">
            <i class="fas fa-check-circle"></i>
        </div>
        <div class="cart-toast-content">
            <h4>Added to Cart!</h4>
            <p>${product.name}</p>
        </div>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
};

const animateCartIcon = () => {
    const cartIcon = document.querySelector('.actions a[href="cart.html"]');
    if (cartIcon) {
        cartIcon.classList.add('cart-bounce');
        setTimeout(() => cartIcon.classList.remove('cart-bounce'), 600);
    }
};

/**
 * Creates a flying animation from the button to the cart icon
 * @param {HTMLElement} button 
 * @param {Object} product 
 */
function createFlyingProduct(button, product) {
    const cartIcon = document.querySelector('.actions a[href="cart.html"]');
    if (!cartIcon) return;

    const buttonRect = button.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    const flyingEl = document.createElement('div');
    flyingEl.className = 'flying-product';
    Object.assign(flyingEl.style, {
        left: `${buttonRect.left}px`,
        top: `${buttonRect.top}px`
    });

    const productImg = button.closest('.product-card')?.querySelector('img');

    if (productImg) {
        flyingEl.innerHTML = `<img src="${productImg.src}" alt="${product.name}">`;
    } else {
        flyingEl.innerHTML = `
            <div style="width: 60px; height: 60px; background: var(--primary-green); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem;">
                <i class="fas fa-shopping-bag"></i>
            </div>`;
    }

    document.body.appendChild(flyingEl);

    // Animate
    requestAnimationFrame(() => {
        flyingEl.style.left = `${cartRect.left}px`;
        flyingEl.style.top = `${cartRect.top}px`;
    });

    setTimeout(() => flyingEl.remove(), 800);
}

const updateCartBadge = () => {
    const cartIcon = document.querySelector('.actions a[href="cart.html"]');
    if (!cartIcon) return;

    cartIcon.querySelector('.cart-badge')?.remove();

    if (cart.length > 0) {
        const badge = document.createElement('span');
        badge.className = 'cart-badge';
        badge.textContent = cart.length;
        cartIcon.style.position = 'relative';
        cartIcon.appendChild(badge);
    }
};

const getCartCount = () => cart.length;


/* =========================================
   Scroll & Animations
   ========================================= */

const initScrollAnimations = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));
};


/* =========================================
   Testimonials Carousel
   ========================================= */

let currentSlide = 0;
let autoPlayInterval = null;

const initTestimonialsCarousel = () => {
    const track = document.getElementById('testimonialsTrack');
    const carousel = document.getElementById('testimonialsCarousel');
    if (!track) return;

    startAutoPlay();

    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);
    }
};

const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayInterval = setInterval(() => moveCarousel(1), 5000);
};

const stopAutoPlay = () => {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
};

const moveCarousel = (direction) => {
    const dots = document.querySelectorAll('.carousel-dot');
    if (dots.length === 0) return;

    const totalSlides = dots.length;
    currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
    updateCarousel();
};

const goToSlide = (index) => {
    currentSlide = index;
    updateCarousel();
    startAutoPlay(); // Reset timer on manual interaction
};

const updateCarousel = () => {
    const track = document.getElementById('testimonialsTrack');
    const dots = document.querySelectorAll('.carousel-dot');
    if (!track) return;

    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((dot, index) => dot.classList.toggle('active', index === currentSlide));
};


/* =========================================
   Accordions
   ========================================= */

// Mobile Accordion Toggle
const toggleAccordion = (element) => element.closest('.accordion-section')?.classList.toggle('active');

const toggleAccordionSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (!section || window.innerWidth > 768) return;

    document.querySelectorAll('.mobile-accordion').forEach(acc => {
        if (acc.id !== sectionId) acc.classList.remove('open');
    });

    section.classList.toggle('open');
};

// Auto-open first accordion on mobile
if (window.innerWidth <= 768) {
    document.querySelector('.mobile-accordion')?.classList.add('open');
}


/* =========================================
   Forms & Newsletter
   ========================================= */

const initNewsletter = () => {
    document.getElementById('newsletterForm')?.addEventListener('submit', subscribeNewsletter);
};

const subscribeNewsletter = (e) => {
    e.preventDefault();
    const emailInput = e.target.querySelector('input[type="email"]');
    if (!emailInput?.value) return;

    const email = emailInput.value;
    const submitBtn = e.target.querySelector('button');
    const originalBtnContent = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';

    setTimeout(() => {
        const subscribers = JSON.parse(localStorage.getItem('dharmaSubscribers') || '[]');
        if (!subscribers.includes(email)) {
            subscribers.push(email);
            localStorage.setItem('dharmaSubscribers', JSON.stringify(subscribers));
        }

        e.target.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnContent;
        showSubscribeSuccess(email);
    }, 1500);
};

const showSubscribeSuccess = (email) => {
    document.querySelector('.cart-toast')?.remove();

    const toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.style.background = 'linear-gradient(135deg, var(--primary-green), #1B5E20)';
    toast.innerHTML = `
        <div class="cart-toast-icon"><i class="fas fa-envelope-open-text"></i></div>
        <div class="cart-toast-content">
            <h4>Subscription Confirmed!</h4>
            <p>Welcome! Confirmation sent to ${email}.</p>
        </div>
    `;

    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 500);
    }, 5000);
};


/* =========================================
   Product Filters & Search
   ========================================= */

const initProductFilters = () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterProducts(btn.getAttribute('data-filter'));
        });
    });
};

const filterProducts = (filter) => {
    const sections = {
        dairy: document.getElementById('dairy'),
        veg: document.getElementById('vegetables'),
        dairyAcc: document.getElementById('dairyAccordion'),
        vegAcc: document.getElementById('vegAccordion')
    };

    // Helper to detailed page sections
    const toggle = (el, show) => el?.classList.toggle('hidden', !show);
    // Helper for home page accordions
    const display = (el, show) => { if (el) el.style.display = show ? 'block' : 'none'; };

    if (sections.dairy && sections.veg) {
        toggle(sections.dairy, filter === 'all' || filter === 'dairy');
        toggle(sections.veg, filter === 'all' || filter === 'vegetables');
    }

    if (sections.dairyAcc && sections.vegAcc) {
        display(sections.dairyAcc, filter === 'all' || filter === 'dairy');
        display(sections.vegAcc, filter === 'all' || filter === 'vegetables');
    }
};

/**
 * Handles "Buy Now" - Adds to cart and redirects to checkout/login
 * @param {Object} product 
 * @param {Event} event 
 */
function buyNow(product, event) {
    addToCart(product, event);
    const user = JSON.parse(localStorage.getItem('dharmaUser'));
    window.location.href = user ? 'checkout.html' : 'login.html';
}

const checkAuthStatus = () => {
    const user = JSON.parse(localStorage.getItem('dharmaUser'));
    const actionsDiv = document.querySelector('.actions');

    if (actionsDiv) {
        actionsDiv.querySelector('.user-action-btn')?.remove();

        const userLink = document.createElement('a');
        userLink.href = user ? 'profile.html' : 'login.html';
        userLink.className = 'user-action-btn';
        userLink.title = user ? `Signed in as ${user.name || 'User'}` : "Sign In / Sign Up";
        userLink.innerHTML = user
            ? '<i class="fas fa-user-circle" style="font-size: 1.3rem;"></i>'
            : '<i class="far fa-user" style="font-size: 1.3rem;"></i>';

        actionsDiv.appendChild(userLink);
    }
};

const initSearchListener = () => {
    const searchInput = document.getElementById('searchInput');
    searchInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
};

const handleSearch = () => {
    const query = document.getElementById('searchInput')?.value.trim();
    if (!query) return;

    if (window.location.pathname.includes('products.html')) {
        const url = new URL(window.location);
        url.searchParams.set('search', query);
        window.history.pushState({}, '', url);
        window.location.reload(); // Simple reload to re-init page with search
    } else {
        window.location.href = `products.html?search=${encodeURIComponent(query)}`;
    }
};


/* =========================================
   Wishlist
   ========================================= */

function toggleWishlist(productId, btnElement) {
    const event = window.event || arguments[2];
    event?.stopPropagation();
    event?.preventDefault();

    let wishlist = JSON.parse(localStorage.getItem('dharmaWishlist') || '[]');
    const index = wishlist.indexOf(productId);
    let isAdded = false;

    if (index === -1) {
        wishlist.push(productId);
        isAdded = true;
        showCartToast({ name: 'Added to Wishlist' }); // Reusing toast
        if (btnElement) createFlyingHeart(btnElement);
    } else {
        wishlist.splice(index, 1);
        showCartToast({ name: 'Removed from Wishlist' });
    }

    localStorage.setItem('dharmaWishlist', JSON.stringify(wishlist));

    if (btnElement) {
        updateWishlistIcon(btnElement, isAdded);
        const icon = btnElement.querySelector('i');
        if (icon) {
            icon.classList.add('heart-pulse');
            setTimeout(() => icon.classList.remove('heart-pulse'), 400);
        }
    }

    if (window.location.pathname.includes('wishlist.html') && typeof renderWishlist === 'function') {
        renderWishlist();
    }
}

const updateWishlistIcon = (btnElement, isAdded) => {
    const icon = btnElement.querySelector('i');
    if (!icon) return;

    icon.className = isAdded ? 'fas fa-heart' : 'far fa-heart';
    icon.style.color = isAdded ? '#E91E63' : '';
};

const createFlyingHeart = (sourceElement) => {
    const wishlistIcon = document.querySelector('.wishlist-link');
    if (!wishlistIcon || !sourceElement) return;

    const startRect = sourceElement.getBoundingClientRect();
    const targetRect = wishlistIcon.getBoundingClientRect();

    const flyingHeart = document.createElement('div');
    flyingHeart.className = 'flying-heart';
    flyingHeart.innerHTML = '<i class="fas fa-heart"></i>';

    Object.assign(flyingHeart.style, {
        left: `${startRect.left + startRect.width / 2 - 15}px`,
        top: `${startRect.top + startRect.height / 2 - 15}px`
    });

    document.body.appendChild(flyingHeart);

    requestAnimationFrame(() => {
        Object.assign(flyingHeart.style, {
            left: `${targetRect.left + targetRect.width / 2 - 15}px`,
            top: `${targetRect.top + targetRect.height / 2 - 15}px`,
            opacity: '0',
            transform: 'scale(0.5)'
        });
    });

    setTimeout(() => {
        flyingHeart.remove();
        wishlistIcon.classList.add('wishlist-bump');
        setTimeout(() => wishlistIcon.classList.remove('wishlist-bump'), 300);
    }, 800);
};

const isInWishlist = (productId) => {
    return JSON.parse(localStorage.getItem('dharmaWishlist') || '[]').includes(productId);
};

// Today's Fresh List Logic
function renderFreshList() {
    const dairyContainer = document.getElementById('dairy-fresh-list');
    const vegContainer = document.getElementById('veg-fresh-list');

    if (dairyContainer && typeof products !== 'undefined') {
        const dairyProducts = products.filter(p => p.category === 'dairy');
        dairyContainer.innerHTML = dairyProducts.map(p => createFreshListRow(p)).join('');
    }

    if (vegContainer && typeof products !== 'undefined') {
        const vegProducts = products.filter(p => p.category === 'vegetables');
        vegContainer.innerHTML = vegProducts.map(p => createFreshListRow(p)).join('');
    }
}

function createFreshListRow(product) {
    let stockClass = 'in-stock';
    let stockText = 'In Stock';
    let icon = '📦';

    if (product.stock === 'Limited') {
        stockClass = 'limited';
        stockText = 'Limited';
    } else if (product.stock === 'Out of Stock') {
        stockClass = 'out-of-stock';
        stockText = 'Out of Stock'; // CSS might style this red
    }

    // Emoji Mapping
    const name = product.name.toLowerCase();
    if (product.category === 'dairy') {
        if (name.includes('milk')) icon = '🥛';
        else if (name.includes('paneer') || name.includes('cheese')) icon = '🧀';
        else if (name.includes('ghee') || name.includes('butter')) icon = '🧈';
        else if (name.includes('curd') || name.includes('doi') || name.includes('buttermilk')) icon = '🥣';
    } else {
        if (name.includes('tomato')) icon = '🍅';
        else if (name.includes('potato')) icon = '🥔';
        else if (name.includes('onion')) icon = '🧅';
        else if (name.includes('spinach') || name.includes('palak')) icon = '🥬';
        else if (name.includes('cucumber')) icon = '🥒';
        else if (name.includes('coriander') || name.includes('mint') || name.includes('herb')) icon = '🌿';
        else icon = '🥕';
    }

    // Color logic for status
    let statusStyle = 'color: #4CAF50;';
    if (stockClass === 'limited') statusStyle = 'color: #FF9800;';
    if (stockClass === 'out-of-stock') statusStyle = 'color: #f44336;';

    // Original Table Row Format
    return `
        <tr>
            <td class="product-name" style="padding: 12px 0;">${icon} ${product.name}</td>
            <td class="stock-status ${stockClass}" style="padding: 12px 0; font-size: 0.9rem; font-weight: 500; ${statusStyle}">${stockText}</td>
            <td class="product-price" style="padding: 12px 0; text-align: right; font-weight: 600;">₹${product.price} / ${product.unit}</td>
        </tr>
    `;
}


// Render Product Grid with Filter/Search
function renderProductGrid(category, containerId, searchQuery = '') {
    const container = document.getElementById(containerId);
    if (!container || typeof products === 'undefined') return 0;

    let filteredProducts = products.filter(p => p.category === category);

    // Apply Search
    if (searchQuery) {
        searchQuery = searchQuery.toLowerCase();
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(searchQuery) ||
            p.description.toLowerCase().includes(searchQuery)
        );
    }

    container.innerHTML = filteredProducts.map(p => createProductCard(p)).join('');
    return filteredProducts.length;
}

function updateCounts(searchQuery = '') {
    const dairyCount = products.filter(p => p.category === 'dairy' && (!searchQuery || p.name.toLowerCase().includes(searchQuery))).length;
    const vegCount = products.filter(p => p.category === 'vegetables' && (!searchQuery || p.name.toLowerCase().includes(searchQuery))).length;

    if (document.getElementById('dairy-count')) document.getElementById('dairy-count').innerText = dairyCount;
    if (document.getElementById('veg-count')) document.getElementById('veg-count').innerText = vegCount;
}


function createProductCard(product) {
    // Determine button type based on stock
    let btnHtml = '';
    let stockLabel = '';
    let btnState = '';

    if (product.stock === 'Limited') {
        stockLabel = '<span class="badge limited" style="position: absolute; top: 10px; left: 10px; background: #FF9800; color: white; padding: 4px 10px; border-radius: 4px; font-size: 0.8rem; z-index: 2;">Limited</span>';
    } else if (product.stock === 'Out of Stock') {
        stockLabel = '<span class="badge out-of-stock" style="position: absolute; top: 10px; left: 10px; background: #f44336; color: white; padding: 4px 10px; border-radius: 4px; font-size: 0.8rem; z-index: 2;">Out of Stock</span>';
        btnHtml = `<button class="btn btn-outline" disabled>Out of Stock</button>`;
        btnState = 'disabled';
    } else {
        btnHtml = `
            <button class="btn btn-outline" onclick="addToCart({id: '${product.id}', name: '${product.name}', price: ${product.price}, image: '${product.image}'}, event)">
                <i class="fas fa-cart-plus"></i> Add
            </button>
            <button class="btn btn-primary" onclick="buyNow({id: '${product.id}', name: '${product.name}', price: ${product.price}, image: '${product.image}'}, event)">
                Buy Now
            </button>
        `;
    }

    // Wishlist Button Logic
    // Assumes isInWishlist function is available (it is in script.js)
    const isWishlisted = typeof isInWishlist === 'function' && isInWishlist(product.id);
    const heartIcon = isWishlisted ? 'fas' : 'far';
    const heartStyle = isWishlisted ? 'color: #E91E63;' : 'color: #aaa;';

    return `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                ${stockLabel}
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <button class="wishlist-btn-card" onclick="toggleWishlist('${product.id}', this, event)" 
                        style="position: absolute; top: 10px; right: 10px; width: 35px; height: 35px; border-radius: 50%; background: white; border: none; box-shadow: 0 2px 8px rgba(0,0,0,0.1); cursor: pointer; z-index: 2; display: flex; align-items: center; justify-content: center; transition: transform 0.2s;">
                    <i class="${heartIcon} fa-heart" style="${heartStyle} font-size: 1.1rem;"></i>
                </button>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description.substring(0, 60)}${product.description.length > 60 ? '...' : ''}</p>
                <div class="product-price">
                    ₹${product.price} <span>/ ${product.unit}</span>
                </div>
                <div class="product-actions">
                    ${btnHtml}
                </div>
            </div>
        </div>
    `;
}

// Initialize Products Page
function initProductsPage() {
    // Only run if we are on products page
    if (!document.getElementById('dairy-grid') && !document.getElementById('veg-grid')) return;

    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search')?.toLowerCase() || '';

    if (searchQuery) {
        // Update Title
        const pageTitle = document.querySelector('.page-header h1');
        if (pageTitle) pageTitle.innerHTML = `Search Results: <span class="accent-gold">"${urlParams.get('search')}"</span>`;

        // Reset Filter UI
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        const allBtn = document.querySelector('[data-filter="all"]');
        if (allBtn) allBtn.classList.add('active');
    }

    // Render Grids
    const dairyCount = renderProductGrid('dairy', 'dairy-grid', searchQuery);
    // Vegetables might be in #veg-grid or dynamically found
    let vegGridId = 'veg-grid';
    // Fallback if veg-grid is not found but section exists
    if (!document.getElementById('veg-grid') && document.getElementById('vegetables')) {
        // This handles cases where ID might be missing or different
    }

    const vegCount = renderProductGrid('vegetables', 'veg-grid', searchQuery);

    updateCounts(searchQuery);

    // Hide empty sections if searching
    if (searchQuery) {
        if (dairyCount === 0) {
            const el = document.getElementById('dairy');
            if (el) el.style.display = 'none';
        }
        if (vegCount === 0) {
            const el = document.getElementById('vegetables');
            if (el) el.style.display = 'none';
        }

        if (dairyCount === 0 && vegCount === 0) {
            // Show No Results
            const container = document.querySelector('.container .products-grid')?.parentNode || document.querySelector('.main-content .container');
            if (container) {
                const noResults = document.createElement('div');
                noResults.innerHTML = `<div style="text-align:center; padding: 50px;"><h3>No products found matching "${urlParams.get('search')}"</h3><a href="products.html" class="btn btn-primary" style="margin-top:15px;">View All Products</a></div>`;
                container.prepend(noResults);
            }
        }
    }
}

// Call on load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('dairy-fresh-list')) {
        renderFreshList();
    }

    initProductsPage();
});
