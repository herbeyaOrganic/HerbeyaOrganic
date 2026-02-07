// Shared application state and initialization
window.App = {
    products: [
        {
            id: 1,
            title: "Herbeya organic hair oil 100ml bottle",
            price: 650,
            image: "/Gemini_Generated_Image_8z0t298z0t298z0t_1.png",
            description: "Herbeya organic hair oil Reduces hairfall, frizz, dandruff  Enhances hair growth, shine."
        },
        {
            id: 2,
            title: "Sugar scrub (250g)",
            price: 250,
            image: "/Gemini_Generated_Image_c9jedvc9jedvc9je_1.png",
            description: "Sugar scrub Exfoliates skin, provide Sugar scrub, softness, baby skin No dullness, darkness, tanning."
        },
        {
            id: 3,
            title: "Rice milk soap (small size)",
            price: 200,
            image: "/Gemini_Generated_Image_wcful7wcful7wcfu_1.png",
            description: "Rice milk soap Provide glow, whitening special soap Freshen skin and moisturizes dry skin."
        },
        
    ],
    cart: JSON.parse(localStorage.getItem('cart')) || []
};

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    // Update cart count on page load
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
});

// Initialize search after products load
if (document.getElementById('search-input')) {
    import('./js/search.js').then(module => {
        // Cleanup previous search when navigating in SPA
        if (window.searchCleanup) window.searchCleanup();
    });
}










































