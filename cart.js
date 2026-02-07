// Cart functionality
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalAmount = document.getElementById('cart-total-amount');
const cartCloseBtn = document.querySelector('.cart-close'); // Renamed this variable

// Initialize cart functionality
document.addEventListener('DOMContentLoaded', () => {
    // Set up cart button
    document.getElementById('cart-btn').addEventListener('click', openCartModal);
    
    // Set up modal close button
    cartCloseBtn.addEventListener('click', closeCartModal); // Using renamed variable
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            closeCartModal();
        }
    });
});

// Open cart modal
function openCartModal() {
    renderCartItems();
    cartModal.style.display = 'block';
}

// Close cart modal
function closeCartModal() {
    cartModal.style.display = 'none';
}

// Render cart items
function renderCartItems() {
    if (App.cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        cartTotalAmount.textContent = '0.00';
        return;
    }

    cartItemsContainer.innerHTML = App.cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.title}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" data-action="decrease" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" data-action="increase" data-id="${item.id}">+</button>
                </div>
                <button class="cart-item-remove" data-id="${item.id}">Remove</button>
            </div>
        </div>
    `).join('');

    // Add event listeners to dynamic buttons
    document.querySelectorAll('[data-action="decrease"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = parseInt(btn.getAttribute('data-id'));
            updateCartItemQuantity(productId, -1);
        });
    });

    document.querySelectorAll('[data-action="increase"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = parseInt(btn.getAttribute('data-id'));
            updateCartItemQuantity(productId, 1);
        });
    });

    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = parseInt(btn.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });

    // Calculate and display total
    const total = App.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalAmount.textContent = total.toFixed(2);
}

// Update cart item quantity
function updateCartItemQuantity(productId, change) {
    const item = App.cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity < 1) {
        removeFromCart(productId);
    } else {
        updateCart();
        renderCartItems();
    }
}

// Remove item from cart
function removeFromCart(productId) {
    App.cart = App.cart.filter(item => item.id !== productId);
    updateCart();
    renderCartItems();
    
    // If cart is empty, close the modal after a short delay
    if (App.cart.length === 0) {
        setTimeout(() => {
            if (cartItemsContainer.innerHTML.includes('empty')) {
                closeCartModal();
            }
        }, 1000);
    }
}

// Add product to cart
window.addToCart = function(productId) {
    const product = App.products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = App.cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        App.cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCart();
    alert(`${product.title} added to cart!`);
    
    // Close product modal if open
    const productModal = document.getElementById('product-modal');
    if (productModal) productModal.style.display = 'none';
};

// Update cart in localStorage and UI
function updateCart() {
    localStorage.setItem('cart', JSON.stringify(App.cart));
    updateCartCount();
}

// Update cart count in header
function updateCartCount() {
    const count = App.cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}