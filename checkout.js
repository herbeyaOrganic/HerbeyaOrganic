// js/checkout.js
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const checkoutBtn = document.querySelector('.checkout-btn');
    const checkoutModal = document.getElementById('checkout-modal');
    const closeCheckoutModal = document.querySelector('.checkout-close');
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutItemsContainer = document.getElementById('checkout-items');
    const checkoutTotalElement = document.getElementById('checkout-total');
    
    // Open checkout modal
    checkoutBtn.addEventListener('click', () => {
        if (App.cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        renderCheckoutItems();
        checkoutModal.style.display = 'block';
        document.body.classList.add('modal-open');
    });
    
    // Close checkout modal
    closeCheckoutModal.addEventListener('click', () => {
        checkoutModal.style.display = 'none';
        document.body.classList.remove('modal-open');
    });
    
    // Close when clicking outside modal
    window.addEventListener('click', (e) => {
        if (e.target === checkoutModal) {
            checkoutModal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    });
    
    // Render checkout items
    function renderCheckoutItems() {
        checkoutItemsContainer.innerHTML = '';
        
        App.cart.forEach(item => {
            const product = App.products.find(p => p.id === item.id);
            if (product) {
                const itemElement = document.createElement('div');
                itemElement.className = 'checkout-item';
                itemElement.innerHTML = `
                    <span>${item.quantity} × ${product.title}</span>
                    <span>$${(product.price * item.quantity).toFixed(2)}</span>
                `;
                checkoutItemsContainer.appendChild(itemElement);
            }
        });
        
        const total = App.cart.reduce((sum, item) => {
            const product = App.products.find(p => p.id === item.id);
            return sum + (product ? product.price * item.quantity : 0);
        }, 0);
        
        checkoutTotalElement.textContent = `$${total.toFixed(2)}`;
    }
    
    // Form submission
    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = checkoutForm.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';
        
        try {
            // Prepare customer data
            const formData = new FormData(checkoutForm);
            const customerData = {
                name: formData.get('full-name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                city: formData.get('city'),
                province: formData.get('province'),
                payment: formData.get('payment')
            };
            
            // Prepare order data
            const orderItems = App.cart.map(item => {
                const product = App.products.find(p => p.id === item.id);
                return {
                    id: item.id,
                    name: product ? product.title : 'Unknown Product',
                    quantity: item.quantity,
                    price: product ? product.price : 0,
                    total: product ? (product.price * item.quantity).toFixed(2) : '0.00'
                };
            });
            
            const orderTotal = App.cart.reduce((sum, item) => {
                const product = App.products.find(p => p.id === item.id);
                return sum + (product ? product.price * item.quantity : 0);
            }, 0);
            
            // Submit to Web3Forms
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    access_key: 'bb19bce2-50a7-4dc2-84af-bd1dd11594ce',
                    subject: `New Order from ${customerData.name}`,
                    customer: JSON.stringify(customerData),
                    order: JSON.stringify(orderItems),
                    total: `$${orderTotal.toFixed(2)}`,
                    redirect: window.location.origin + '/thank-you.html'
                })
            });
            
            if (response.ok) {
                // Clear cart
                App.cart = [];
                localStorage.setItem('cart', JSON.stringify(App.cart));
                updateCartCount();
                
                // Redirect to thank you page
                window.location.href = 'thank-you.html';
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('There was an error processing your order. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Place Order';
        }
    });
});