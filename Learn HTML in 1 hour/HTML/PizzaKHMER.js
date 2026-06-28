// DATA INITIALIZATION MODULE
const menuItems = [
    // Classic Pizza
    { id: 1, name: 'Margherita', price: 8, category: 'classic', description: 'Fresh tomatoes, mozzarella, basil, and olive oil.', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=400&q=80' },
    { id: 2, name: 'Pepperoni', price: 10, category: 'classic', description: 'Classic pepperoni slices layered with signature mozzarella.', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=400&q=80' },
    { id: 3, name: 'Hawaiian', price: 11, category: 'classic', description: 'Smoked ham, juicy pineapple, and mozzarella.', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80' },
    { id: 4, name: 'Cheese Lovers', price: 9, category: 'classic', description: 'A premium blend of 4 delicate white cheeses.', image: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&w=400&q=80' },
    { id: 5, name: 'BBQ Chicken', price: 12, category: 'classic', description: 'Grilled chicken, smoky BBQ sauce, and red onions.', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80' },

    // Premium Pizza
    { id: 6, name: 'Truffle Pizza', price: 18, category: 'premium', description: 'Wild mushrooms infused with rich white truffle aromatic oil.', image: 'https://images.unsplash.com/photo-1604917621956-10dfa7cce2e7?auto=format&fit=crop&w=400&q=80' },
    { id: 7, name: 'Four Cheese Deluxe', price: 16, category: 'premium', description: 'Gorgonzola, Fontina, Parmesan, and Fresh Mozzarella.', image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=400&q=80' },

    // Vegetarian Pizza
    { id: 8, name: 'Veggie Supreme', price: 12, category: 'vegetarian', description: 'Bell peppers, onions, mushrooms, tomatoes, and olives.', image: 'https://images.unsplash.com/photo-1571066811602-71683a3f680d?auto=format&fit=crop&w=400&q=80' },

    // Seafood Pizza
    { id: 9, name: 'Shrimp Pizza', price: 17, category: 'seafood', description: 'Succulent shrimp tossed in garlic butter herb crust.', image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=400&q=80' },

    // Spicy Pizza
    { id: 10, name: 'Mexican Hot', price: 15, category: 'spicy', description: 'Spicy ground beef, jalapeños, onions, and chili flakes.', image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=400&q=80' },

    // Non-Pizza Additions
    { id: 11, name: 'Classic Burger', price: 6, category: 'drinks', description: 'Premium flame-grilled beef burger patty.', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80' },
    { id: 12, name: 'Coca-Cola', price: 2, category: 'drinks', description: 'Chilled 330ml dynamic refreshment.', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80' },
    { id: 13, name: 'Chocolate Tiramisu', price: 5, category: 'desserts', description: 'Layered Italian espresso cake cream dessert.', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=400&q=80' }
];

// STATE MANAGEMENT ENGINE
let cart = [];
let currentItemForCustomization = null;
let activeDiscount = 0;

// DOM ELEMENT REFERENCES
const menuContainer = document.getElementById('menu-container');
const tabButtons = document.querySelectorAll('.tab-btn');
const searchInput = document.getElementById('search-input');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');
const customModal = document.getElementById('custom-modal');
const closeCustom = document.getElementById('close-custom');
const themeToggle = document.getElementById('theme-toggle');

// CORE EXECUTION SCHEDULER
document.addEventListener('DOMContentLoaded', () => {
    renderMenu(menuItems);
    setupEventListeners();
});

// UI RENDERING ENGINES
function renderMenu(items) {
    menuContainer.innerHTML = '';
    if (items.length === 0) {
        menuContainer.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding: 2rem; opacity:0.7;">No items match your search.</p>`;
        return;
    }
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="product-info">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="product-meta">
                    <span class="price">$${item.price.toFixed(2)}</span>
                    <button class="btn btn-primary" onclick="initiateAddToCart(${item.id})">Add to Cart</button>
                </div>
            </div>
        `;
        menuContainer.appendChild(card);
    });
}

// CART AND DIALOG HANDLERS
window.initiateAddToCart = function(id) {
    const item = menuItems.find(p => p.id === id);
    if (item.category === 'drinks' || item.category === 'desserts') {
        // Direct processing bypassing optimization menus for basic fluids/sweets
        executeAddToCart(item, 'Standard', [], item.price);
    } else {
        currentItemForCustomization = item;
        document.getElementById('modal-item-title').innerText = `Customize your ${item.name}`;
        customModal.style.display = 'flex';
    }
};

document.getElementById('confirm-add-btn').addEventListener('click', () => {
    if (!currentItemForCustomization) return;

    const sizeInput = document.querySelector('input[name="pizza-size"]:checked');
    const sizeName = sizeInput.parentElement.innerText.split(' (')[0].trim();
    const sizePremium = parseFloat(sizeInput.getAttribute('data-price'));

    let selectedToppings = [];
    let toppingsPremium = 0;
    document.querySelectorAll('.toppings-grid input:checked').forEach(cb => {
        selectedToppings.push(cb.value);
        toppingsPremium += 1.50;
    });

    const finalUnitPrice = currentItemForCustomization.price + sizePremium + toppingsPremium;
    executeAddToCart(currentItemForCustomization, sizeName, selectedToppings, finalUnitPrice);

    // Dialog Dismissal and Resets
    customModal.style.display = 'none';
    document.querySelectorAll('.toppings-grid input').forEach(cb => cb.checked = false);
});

function executeAddToCart(item, size, toppings, unitPrice) {
    const cartItemId = `${item.id}-${size}-${toppings.sort().join(',')}`;
    const existingIndex = cart.findIndex(i => i.cartItemId === cartItemId);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            cartItemId,
            id: item.id,
            name: item.name,
            size,
            toppings,
            unitPrice,
            quantity: 1
        });
    }
    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById('cart-items-container');
    container.innerHTML = '';

    let totalItemsCount = 0;
    let subtotal = 0;

    cart.forEach(item => {
                totalItemsCount += item.quantity;
                const totalItemCost = item.unitPrice * item.quantity;
                subtotal += totalItemCost;

                const row = document.createElement('div');
                row.className = 'cart-item';
                row.innerHTML = `
            <div class="cart-item-details">
                <h4>${item.name} (${item.size})</h4>
                ${item.toppings.length > 0 ? `<span>+ ${item.toppings.join(', ')}</span>` : ''}
                <span>$${item.unitPrice.toFixed(2)} each</span>
            </div>
            <div class="cart-item-actions">
                <button onclick="alterQuantity('${item.cartItemId}', -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="alterQuantity('${item.cartItemId}', 1)">+</button>
                <span style="font-weight:600; margin-left: 0.5rem;">$${totalItemCost.toFixed(2)}</span>
            </div>
        `;
        container.appendChild(row);
    });

    document.getElementById('cart-count').innerText = totalItemsCount;
    
    // Computation Algorithms
    const savings = subtotal * activeDiscount;
    const netTotal = subtotal - savings;

    document.getElementById('subtotal-val').innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById('discount-val').innerText = `-$${savings.toFixed(2)}`;
    document.getElementById('total-val').innerText = `$${netTotal.toFixed(2)}`;
}

window.alterQuantity = function(cartItemId, dynamicDelta) {
    const matchIndex = cart.findIndex(i => i.cartItemId === cartItemId);
    if(matchIndex === -1) return;

    cart[matchIndex].quantity += dynamicDelta;
    if(cart[matchIndex].quantity <= 0) {
        cart.splice(matchIndex, 1);
    }
    updateCartUI();
};

// BUSINESS COMPLIANCE UTILITY SUBSYSTEMS
function setupEventListeners() {
    // Intercept category tabs
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterCatalog();
        });
    });

    // Handle full search queries
    searchInput.addEventListener('input', filterCatalog);

    // Dynamic structural drawer triggers
    cartBtn.addEventListener('click', () => cartModal.style.display = 'flex');
    closeCart.addEventListener('click', () => cartModal.style.display = 'none');
    closeCustom.addEventListener('click', () => customModal.style.display = 'none');
    
    // Application runtime modal mitigation
    window.addEventListener('click', (e) => {
        if(e.target === cartModal) cartModal.style.display = 'none';
        if(e.target === customModal) customModal.style.display = 'none';
    });

    // Process Coupon Validations
    document.getElementById('apply-coupon').addEventListener('click', () => {
        const val = document.getElementById('coupon-input').value.trim().toUpperCase();
        if(val === 'PIZZA10') {
            activeDiscount = 0.10;
            alert('Promo Code Applied: 10% Off Absolute Discount!');
            updateCartUI();
        } else {
            alert('Invalid coupon code.');
        }
    });

    // Checkout Confirmation
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if(cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        alert('Thank you for your order! Processing payment integration via ABA Pay...');
        cart = [];
        activeDiscount = 0;
        document.getElementById('coupon-input').value = '';
        cartModal.style.display = 'none';
        updateCartUI();
    });

    // Dark Mode Core Toggler
    themeToggle.addEventListener('click', () => {
        const rootElement = document.documentElement;
        const currentTheme = rootElement.getAttribute('data-theme');
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        rootElement.setAttribute('data-theme', nextTheme);
        
        // Dynamic toggle icons 
        const icon = themeToggle.querySelector('i');
        if(nextTheme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    });
}

function filterCatalog() {
    const currentActiveTab = document.querySelector('.tab-btn.active').getAttribute('data-filter');
    const query = searchInput.value.toLowerCase().trim();

    const output = menuItems.filter(item => {
        const matchesCategory = (currentActiveTab === 'all' || item.category === currentActiveTab);
        const matchesQuery = item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query);
        return matchesCategory && matchesQuery;
    });

    renderMenu(output);
}