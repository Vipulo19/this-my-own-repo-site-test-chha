// Checkout Logic
const DELIVERY_CHARGE = 0;

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadCheckoutItems();
    setupSteps();
});

function checkAuth() {
    const user = JSON.parse(localStorage.getItem('dharmaUser'));
    if (!user) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
        return;
    }

    // Update user display
    const userDisplay = document.getElementById('user-display');
    if (userDisplay) {
        userDisplay.textContent = user.name || user.email;
    }

    // Mark auth step as done
    document.getElementById('step-auth').classList.add('completed');
    document.getElementById('step-address').classList.add('active');

    // Autofill address if available
    autofillAddress(user);
}

function autofillAddress(user) {
    // 1. Try to get address from dharmaAddress (Saved during previous checkout)
    const savedAddress = JSON.parse(localStorage.getItem('dharmaAddress'));

    // 2. Or try to get from user profile (if I were to implement saving there)
    // For now, let's use user email/name as basics
    if (document.getElementById('fullName')) {
        document.getElementById('fullName').value = user.name || '';
    }
    if (document.getElementById('email')) {
        const emailField = document.getElementById('email');
        emailField.value = user.email || '';

        // Add indicator that this is the account email
        if (user.email && !document.getElementById('email-note')) {
            const note = document.createElement('small');
            note.id = 'email-note';
            note.style.color = 'var(--primary-green)';
            note.style.marginTop = '4px';
            note.style.display = 'block';
            note.innerHTML = '<i class="fas fa-check-circle"></i> Linked to your account';
            emailField.parentNode.appendChild(note);
        }
    }

    // Autofill Phone from profile if available
    if (user.phone && document.getElementById('phone')) {
        document.getElementById('phone').value = user.phone;
    }

    // 3. If full address exists, fill it (Overrides profile data if exists)
    // 3. If full address exists, fill address fields
    // We prioritize User Profile for Name/Email/Phone to keep them in sync ("same as profile")
    // But we use Saved Address for physical address fields.
    if (savedAddress) {
        if (!user.name && savedAddress.fullName) document.getElementById('fullName').value = savedAddress.fullName;
        if (!user.email && savedAddress.email) document.getElementById('email').value = savedAddress.email;

        // For phone, profile wins if exists, else saved address
        if (!user.phone && savedAddress.phone) document.getElementById('phone').value = savedAddress.phone;

        if (savedAddress.address) document.getElementById('address1').value = savedAddress.address;
        if (savedAddress.city) document.getElementById('city').value = savedAddress.city;
        if (savedAddress.pincode) document.getElementById('pincode').value = savedAddress.pincode;
    }
}

function loadCheckoutItems() {
    const cart = JSON.parse(localStorage.getItem('dharmaCart')) || [];
    const container = document.getElementById('checkout-items');

    if (cart.length === 0) {
        container.innerHTML = '<p>Your cart is empty</p>';
        updateTotals(0);
        return;
    }

    // Normalize: Group by name
    const normalized = {};
    cart.forEach(item => {
        if (!normalized[item.name]) {
            normalized[item.name] = { ...item, qty: 0 };
        }
        normalized[item.name].qty++;
    });

    let subtotal = 0;
    container.innerHTML = '';

    Object.values(normalized).forEach(item => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;

        const div = document.createElement('div');
        div.className = 'summary-item';
        div.innerHTML = `
            <div class="summary-item-info">
                <h4>${item.name}</h4>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="updateCheckoutQty('${item.name}', -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="qty-val">${item.qty}</span>
                    <button class="qty-btn" onclick="updateCheckoutQty('${item.name}', 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
            <div class="summary-item-price">₹${itemTotal}</div>
        `;
        container.appendChild(div);
    });

    updateTotals(subtotal);
}

function updateCheckoutQty(name, delta) {
    let cart = JSON.parse(localStorage.getItem('dharmaCart')) || [];

    if (delta > 0) {
        // Find existing item to clone
        const existing = cart.find(i => i.name === name);
        if (existing) cart.push({ ...existing });
    } else {
        // Remove one instance
        const index = cart.findLastIndex(i => i.name === name);
        if (index > -1) cart.splice(index, 1);
    }

    localStorage.setItem('dharmaCart', JSON.stringify(cart));
    loadCheckoutItems();

    // Update global badge etc if script.js is loaded
    if (typeof updateCartBadge === 'function') updateCartBadge();
}

function updateTotals(subtotal) {
    document.getElementById('checkout-subtotal').textContent = `₹${subtotal}`;
    document.getElementById('checkout-delivery').textContent = `₹${DELIVERY_CHARGE}`;
    document.getElementById('checkout-total').textContent = `₹${subtotal + DELIVERY_CHARGE}`;
}

function setupSteps() {
    // Initial state is set in checkAuth
}

function handleAddressSubmit(e) {
    e.preventDefault();

    // Simple Validation
    const form = e.target;
    if (form.checkValidity()) {
        // Collect data
        const addressData = {
            fullName: document.getElementById('fullName').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address1').value,
            city: document.getElementById('city').value,
            pincode: document.getElementById('pincode').value
        };
        localStorage.setItem('dharmaAddress', JSON.stringify(addressData));

        // Move to next step
        document.getElementById('step-address').classList.remove('active');
        document.getElementById('step-address').classList.add('completed');

        document.getElementById('form-address').classList.remove('active');

        document.getElementById('step-payment').classList.add('active');
        document.getElementById('form-payment').classList.add('active');
    }
}

function backToAddress() {
    document.getElementById('step-payment').classList.remove('active');

    document.getElementById('form-payment').classList.remove('active');

    document.getElementById('step-address').classList.remove('completed');
    document.getElementById('step-address').classList.add('active');

    document.getElementById('form-address').classList.add('active');
}

let selectedPayment = null;

function selectPayment(method) {
    selectedPayment = method;

    // UI Update
    document.querySelectorAll('.payment-option-card').forEach(card => card.classList.remove('selected'));
    document.querySelectorAll('.payment-details').forEach(d => d.style.display = 'none');

    const input = document.querySelector(`input[value="${method}"]`);
    const card = input.closest('.payment-option-card');
    card.classList.add('selected');

    const details = document.getElementById(`${method}-details`);
    if (details) {
        details.style.display = 'block';
    }
}

function placeOrder() {
    if (!selectedPayment) {
        alert('Please select a payment method');
        return;
    }

    // Process Order
    const user = JSON.parse(localStorage.getItem('dharmaUser'));
    const address = JSON.parse(localStorage.getItem('dharmaAddress'));
    const cart = JSON.parse(localStorage.getItem('dharmaCart'));
    const orderId = 'ORD' + Date.now();

    // Calculate total
    let subtotal = 0;
    cart.forEach(item => subtotal += item.price);
    const finalTotal = subtotal + DELIVERY_CHARGE;

    // Save Order to History
    const orderData = {
        id: orderId,
        date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        items: cart,
        total: finalTotal,
        status: 'Processing'
    };

    const existingOrders = JSON.parse(localStorage.getItem('dharmaOrders')) || [];
    existingOrders.unshift(orderData); // Add new order to top
    localStorage.setItem('dharmaOrders', JSON.stringify(existingOrders));

    // Show Success Step
    document.getElementById('step-payment').classList.remove('active');
    document.getElementById('step-payment').classList.add('completed');
    document.getElementById('form-payment').classList.remove('active');

    document.getElementById('step-success').classList.add('active', 'completed');
    document.getElementById('form-success').classList.add('active');

    document.getElementById('orderId').textContent = orderId;

    // Send WhatsApp (Legacy Support)
    sendWhatsAppOrder(orderId, user, address, cart, selectedPayment);

    // Clear Cart
    localStorage.removeItem('dharmaCart');
}

function sendWhatsAppOrder(orderId, user, address, cart, paymentMethod) {
    let message = `🛒 *NEW ORDER RECEIVED*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `📋 *Order No:* ${orderId}\n`;
    message += `👤 *Customer:* ${user.name}\n`;
    message += `📱 *Phone:* ${address.phone}\n`;
    message += `📍 *Address:* ${address.address}, ${address.city} - ${address.pincode}\n\n`;

    message += `*ORDER DETAILS*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n`;

    const normalized = {};
    cart.forEach(item => {
        if (!normalized[item.name]) {
            normalized[item.name] = { ...item, qty: 0 };
        }
        normalized[item.name].qty++;
    });

    let subtotal = 0;
    Object.values(normalized).forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        subtotal += itemTotal;
        message += `${index + 1}. ${item.name} x ${item.qty} - ₹${itemTotal}\n`;
    });

    const total = subtotal + DELIVERY_CHARGE;

    message += `\n*BILL SUMMARY*\n`;
    message += `Subtotal: ₹${subtotal}\n`;
    message += `Delivery: ₹${DELIVERY_CHARGE}\n`;
    message += `*TOTAL: ₹${total}*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `💳 Payment: ${paymentMethod.toUpperCase()}\n`;

    // Open WhatsApp
    const whatsappNumber = '916351510371';
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
}
