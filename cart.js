// Cart functionality
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
});

function loadCart() {
    const cart = JSON.parse(localStorage.getItem('dharmaCart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart');
    const cartContainer = document.getElementById('cart-container');

    if (cart.length === 0) {
        cartContainer.style.display = 'none';
        emptyCartMessage.style.display = 'block';
        return;
    }

    cartContainer.style.display = 'block';
    emptyCartMessage.style.display = 'none';

    // Normalize: Group by name
    const normalized = {};
    cart.forEach(item => {
        if (!normalized[item.name]) {
            normalized[item.name] = { ...item, qty: 0 };
        }
        normalized[item.name].qty++;
    });

    let subtotal = 0;
    cartItemsContainer.innerHTML = '';

    Object.values(normalized).forEach(item => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-details">
                <div class="cart-item-image">
                    <i class="fas fa-box-open"></i>
                </div>
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="cart-item-unit-price">₹${item.price} per unit</p>
                </div>
            </div>
            <div class="cart-item-actions">
                <div class="qty-controls">
                    <button class="qty-btn" onclick="updateCartQty('${item.name}', -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="qty-val">${item.qty}</span>
                    <button class="qty-btn" onclick="updateCartQty('${item.name}', 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="cart-item-price-group">
                    <span class="cart-item-total-price">₹${itemTotal}</span>
                </div>
                <button onclick="removeFromCart('${item.name}')" class="cart-remove-btn" title="Remove Item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    document.getElementById('subtotal').textContent = `₹${subtotal}`;
    document.getElementById('total').textContent = `₹${subtotal}`;
}

function updateCartQty(name, delta) {
    let cart = JSON.parse(localStorage.getItem('dharmaCart')) || [];

    if (delta > 0) {
        const existing = cart.find(i => i.name === name);
        if (existing) cart.push({ ...existing });
    } else {
        const index = cart.findLastIndex(i => i.name === name);
        if (index > -1) cart.splice(index, 1);
    }

    localStorage.setItem('dharmaCart', JSON.stringify(cart));
    loadCart();

    if (typeof updateCartBadge === 'function') updateCartBadge();
}

function removeFromCart(name) {
    let cart = JSON.parse(localStorage.getItem('dharmaCart')) || [];
    cart = cart.filter(item => item.name !== name);
    localStorage.setItem('dharmaCart', JSON.stringify(cart));
    loadCart();

    if (typeof updateCartBadge === 'function') updateCartBadge();
}

// Global variable to store selected delivery time
let selectedDeliveryTime = null;

function checkout() {
    const cart = JSON.parse(localStorage.getItem('dharmaCart')) || [];
    if (cart.length === 0) {
        showErrorMessage('Your cart is empty!');
        return;
    }

    // Redirect to new checkout flow
    window.location.href = 'checkout.html';
}

function showDeliveryModal() {
    const modal = document.getElementById('delivery-modal');
    modal.style.display = 'flex';

    // Add click handlers to delivery options
    const deliveryOptions = document.querySelectorAll('.delivery-option');
    deliveryOptions.forEach(option => {
        option.onclick = function () {
            selectedDeliveryTime = this.getAttribute('data-time');
            closeDeliveryModal();
            processOrder();
        };
    });
}

function closeDeliveryModal() {
    const modal = document.getElementById('delivery-modal');
    modal.style.display = 'none';
}

function processOrder() {
    // Show processing animation
    const processingDiv = document.getElementById('order-processing');
    processingDiv.style.display = 'flex';

    // Simulate processing time
    setTimeout(() => {
        processingDiv.style.display = 'none';
        completeOrder();
    }, 2000);
}

function completeOrder() {
    const cart = JSON.parse(localStorage.getItem('dharmaCart')) || [];

    // Generate order number and timestamp
    const orderNumber = 'ORD' + Date.now();
    const orderDate = new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Create detailed WhatsApp message
    let message = '🛒 *DELIVER YOUR ORDER*%0A';
    message += '━━━━━━━━━━━━━━━━━━━━%0A%0A';
    message += `📋 *Order No:* ${orderNumber}%0A`;
    message += `📅 *Date & Time:* ${orderDate}%0A`;
    message += `⏱️ *Delivery Time:* ${selectedDeliveryTime} minutes%0A%0A`;
    message += '━━━━━━━━━━━━━━━━━━━━%0A';
    message += '*ORDER DETAILS*%0A';
    message += '━━━━━━━━━━━━━━━━━━━━%0A%0A';

    // Add items with numbering
    cart.forEach((item, index) => {
        message += `${index + 1}. *${item.name}*%0A`;
        message += `   Price: ₹${item.price}%0A%0A`;
    });

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const delivery = 0.00;
    const total = subtotal + delivery;

    // Add bill summary
    message += '━━━━━━━━━━━━━━━━━━━━%0A';
    message += 'BILL SUMMARY';
    message += '━━━━━━━━━━━━━━━━━━━━%0A%0A';
    message += `Subtotal: ₹${subtotal}%0A`;
    message += `Delivery Charges: ₹${delivery}%0A`;
    message += '- - - - - - - - - - - - - - - - - -%0A';
    message += `*TOTAL AMOUNT: ₹${total}*%0A%0A`;
    message += '━━━━━━━━━━━━━━━━━━━━%0A%0A';
    message += '📍 Please confirm delivery address%0A';
    message += '💳 Payment: Cash on Delivery%0A';
    message += 'Thank you! 🙏';

    // Show success animation
    showSuccessAnimation(selectedDeliveryTime);

    // Open WhatsApp after success animation
    setTimeout(() => {
        const whatsappNumber = '916351510371';
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');

        // Hide success animation after WhatsApp opens
        setTimeout(() => {
            document.getElementById('order-success').style.display = 'none';
        }, 1500);
    }, 3000);
}

function showSuccessAnimation(deliveryTime) {
    const successDiv = document.getElementById('order-success');
    const successMessage = document.getElementById('success-message');
    successMessage.textContent = `Your order will be delivered in ${deliveryTime} minutes!`;
    successDiv.style.display = 'flex';
}

function showErrorMessage(message) {
    // Create a simple animated error toast
    const errorToast = document.createElement('div');
    errorToast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #d32f2f, #c62828);
        color: white;
        padding: 20px 30px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(211, 47, 47, 0.4);
        z-index: 10000;
        animation: slideInToast 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    `;
    errorToast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px;">
            <i class="fas fa-exclamation-circle" style="font-size: 2rem;"></i>
            <div>
                <h4 style="margin: 0 0 5px 0; color: white;">Error</h4>
                <p style="margin: 0; opacity: 0.9;">${message}</p>
            </div>
        </div>
    `;
    document.body.appendChild(errorToast);

    setTimeout(() => {
        errorToast.style.animation = 'slideOutToast 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards';
        setTimeout(() => errorToast.remove(), 500);
    }, 3000);
}
