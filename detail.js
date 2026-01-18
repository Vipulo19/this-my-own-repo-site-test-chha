document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const productName = urlParams.get('name'); // Fallback for legacy links if we implement them to pass name

    let product = null;

    if (productId) {
        product = getProductById(productId);
    } else if (productName) {
        product = getProductByName(productName);
    }

    if (product) {
        renderProductDetail(product);
        renderRelatedProducts(product);
    } else {
        showError();
    }
});

function renderProductDetail(product) {
    document.getElementById('product-loading').style.display = 'none';
    document.getElementById('product-content').style.display = 'grid';

    // Image
    const imgEl = document.getElementById('detail-img');
    imgEl.src = product.image;
    imgEl.alt = product.name;

    // Text Content
    document.getElementById('detail-name').textContent = product.name;
    document.getElementById('detail-category').textContent = product.category === 'dairy' ? 'Dairy Essentials' : 'Farm Fresh Veggies';

    // Price
    const priceWrapper = document.getElementById('detail-price-wrapper');
    priceWrapper.innerHTML = `₹${product.price} <span>/${product.unit}</span>`;

    // Description
    if (product.description) {
        document.getElementById('detail-desc').textContent = product.description;
    }

    // Stock Badge
    const stockBadge = document.getElementById('detail-stock');
    if (product.stock === 'Limited') {
        stockBadge.className = 'stock-badge stock-low';
        stockBadge.textContent = 'Limited Stock';
    } else if (product.stock === 'Out of Stock') {
        stockBadge.className = 'stock-badge stock-out';
        stockBadge.textContent = 'Out of Stock';
        // Disable buttons
        document.querySelector('.detail-actions .btn-primary').disabled = true;
        document.querySelector('.detail-actions .btn-gold').disabled = true;
        document.querySelector('.detail-actions .btn-primary').textContent = 'Out of Stock';
    }

    // Wishlist State
    if (typeof isInWishlist === 'function' && isInWishlist(product.id)) {
        const icon = document.getElementById('detail-wishlist-icon');
        if (icon) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            icon.style.color = '#e91e63';
        }
    }
}

function showError() {
    document.getElementById('product-loading').style.display = 'none';
    document.getElementById('product-error').style.display = 'block';
}

function renderRelatedProducts(currentProduct) {
    const related = getRelatedProducts(currentProduct.category, currentProduct.id);
    const container = document.getElementById('related-products');
    const section = document.getElementById('related-section');

    if (related.length > 0) {
        section.style.display = 'block';

        related.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-image">
                    <img src="${p.image}" alt="${p.name}">
                    <button class="wishlist-btn-card" onclick="toggleWishlist('${p.id}', this, event)" style="position: absolute; top: 10px; right: 10px; z-index: 10;">
                        <i class="far fa-heart" style="color: #aaa;"></i>
                    </button>
                </div>
                <div class="product-info">
                    <h3>${p.name}</h3>
                    <div class="product-price">₹${p.price} <span>/${p.unit}</span></div>
                    <div class="product-actions" style="margin-top: 15px;">
                        <a href="detail.html?id=${p.id}" class="btn btn-outline btn-small" style="width: 100%;">View Details</a>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }
}

// Action Wrappers
function addToCartFromDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const product = getProductById(productId); // Re-fetch to be safe

    if (product) {
        // Construct object expected by script.js addToCart
        const cartItem = {
            name: product.name,
            price: product.price,
            image: product.image
        };
        // Call global addToCart
        addToCart(cartItem, { target: document.querySelector('.detail-actions .btn-primary') });
    }
}

function buyNowFromDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const product = getProductById(productId);

    if (product) {
        const cartItem = {
            name: product.name,
            price: product.price,
            image: product.image
        };
        buyNow(cartItem, { target: document.querySelector('.detail-actions .btn-gold') });
    }
}

function toggleDetailWishlist() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const btn = document.querySelector('.wishlist-btn-large');

    if (productId && typeof toggleWishlist === 'function') {
        toggleWishlist(productId, btn);
    }
}
