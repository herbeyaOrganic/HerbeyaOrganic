// Initialize wishlist
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// DOM Elements
const wishlistBtn = document.getElementById('wishlist-btn');
const wishlistModal = document.getElementById('wishlist-modal');
const wishlistItemsContainer = document.getElementById('wishlist-items-container');
const wishlistCountElement = document.getElementById('wishlist-count');
const wishlistCloseBtn = document.querySelector('.wishlist-close');

// Initialize wishlist functionality
function initWishlist() {
    updateWishlistCount();
    
    wishlistBtn.addEventListener('click', openWishlistModal);
    wishlistCloseBtn.addEventListener('click', closeWishlistModalFunction);
    
    window.addEventListener('click', (e) => {
        if (e.target === wishlistModal) {
            closeWishlistModalFunction();
        }
    });
}

// Open wishlist modal
function openWishlistModal() {
    renderWishlistItems();
    wishlistModal.style.display = 'block';
    document.body.classList.add('modal-open');
}

// Close wishlist modal (renamed to avoid conflict)
function closeWishlistModalFunction() {
    wishlistModal.style.display = 'none';
    document.body.classList.remove('modal-open');
}

// Render wishlist items
// In the renderWishlistItems function:
function renderWishlistItems() {
    if (wishlist.length === 0) {
        wishlistItemsContainer.innerHTML = `
            <div class="empty-wishlist">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <h3>Your wishlist is empty</h3>
                <p>Save your favorite items here</p>
            </div>
        `;
        return;
    }
    wishlistItemsContainer.innerHTML = wishlist.map(item => `
        <div class="wishlist-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.title}">
            <h3>${item.title}</h3>
            <div class="wishlist-item-price">$${item.price.toFixed(2)}</div>
            <div class="wishlist-item-actions">
                <button class="move-to-cart" data-id="${item.id}">Add to Cart</button>
                <button class="remove-from-wishlist" data-id="${item.id}">Remove</button>
            </div>
        </div>
    `).join('');

    // Add event listeners to dynamic buttons
    document.querySelectorAll('.move-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            if (typeof addToCart === 'function') {
                addToCart(productId);
            }
            removeFromWishlist(productId);
        });
    });

    document.querySelectorAll('.remove-from-wishlist').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            removeFromWishlist(productId);
        });
    });
}

// Add to wishlist
window.addToWishlist = function(productId) {
    const product = App.products.find(p => p.id === productId);
    
    if (!wishlist.some(item => item.id === productId)) {
        wishlist.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image
        });
        
        updateWishlist();
        alert(`${product.title} added to wishlist!`);
    }
};

// Remove from wishlist
function removeFromWishlist(productId) {
    wishlist = wishlist.filter(item => item.id !== productId);
    updateWishlist();
    renderWishlistItems();
}

// Update wishlist in storage and UI
function updateWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
}

// Update wishlist count
function updateWishlistCount() {
    wishlistCountElement.textContent = wishlist.length;
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', initWishlist);