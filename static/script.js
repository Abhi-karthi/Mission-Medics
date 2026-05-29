'use strict';

// ==========================================
// 1. GET SUPPLIES LOGIC
// ==========================================
const selectedSupplies = new Set();
const selectButtons = document.querySelectorAll('.supplies-grid .btn-select');

// --- A. Handle Standard Button Clicks ---
selectButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const itemName = this.textContent.trim();
        const img = this.querySelector('.check-icon');

        if (selectedSupplies.has(itemName)) {
            // Deselect
            selectedSupplies.delete(itemName);
            this.classList.remove('selected');
            img.src = "static/assets/check-box-grey.png";
        } else {
            // Select
            selectedSupplies.add(itemName);
            this.classList.add('selected');
            img.src = "static/assets/check-box-blue.png";
            // Note: If you have a white checkmark image, change it to that here!
        }
    });
});

// --- B. Handle "Other" Auto-Activation ---
const otherInput = document.getElementById('other-input');
const otherCheck = document.getElementById('other-check-box-image');
const otherWrapper = document.getElementById('other-wrapper');
let otherSelected = false;

if (otherInput) {
    otherInput.addEventListener('input', function() {
        // If the user types anything, auto-activate the "Other" row
        if (this.value.trim().length > 0) {
            otherSelected = true;
            otherWrapper.classList.add('selected');
            otherCheck.src = "static/assets/check-box-blue.png";
        } else {
            // If they delete everything, deactivate it
            otherSelected = false;
            otherWrapper.classList.remove('selected');
            otherCheck.src = "static/assets/check-box-grey.png";
        }
    });
}

// --- C. Handle Search Filtering ---
const searchInput = document.getElementById('supply-search');
const categories = document.querySelectorAll('.category-heading');

if (searchInput) {
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();

        categories.forEach(category => {
            let hasVisibleItems = false;
            const grid = category.nextElementSibling; // The .supplies-grid directly after it
            const buttons = grid.querySelectorAll('.btn-select');

            buttons.forEach(btn => {
                const text = btn.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    btn.style.display = 'flex'; // Show button
                    hasVisibleItems = true;
                } else {
                    btn.style.display = 'none'; // Hide button
                }
            });

            // If a category has no matching items, hide the category header entirely
            category.style.display = hasVisibleItems ? 'block' : 'none';
            grid.style.display = hasVisibleItems ? 'grid' : 'none';
        });
    });
}

// --- D. Handle Form Submission ---
const getSuppliesForm = document.getElementById('get-supplies-form');
if (getSuppliesForm) {
    getSuppliesForm.addEventListener('submit', function(e) {
        e.preventDefault();
        let items = Array.from(selectedSupplies);

        // Add "Other" input to the array if it has text
        if (otherSelected && otherInput.value.trim()) {
            items.push(otherInput.value.trim());
        }

        if (items.length === 0) return alert("Please select at least one item.");
        if (!this.checkValidity()) return alert("Please fill out all required fields.");

        const submitBtn = document.getElementById('get-submit-btn');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "Sending...";

        const formData = {
            name: this.name.value,
            streetAddress: this.streetAddress.value,
            city: this.city.value,
            zip: this.zip.value,
            phoneNumber: this.phoneNumber.value,
            email: this.email.value,
            message: items.join(", ")
        };

        fetch('/api/request-supplies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        }).then(res => {
            if (res.ok) {
                document.getElementById('get-supplies-ui').classList.add('hidden');
                document.getElementById('get-supplies-success').classList.remove('hidden');
            } else {
                alert("Failed to send request.");
            }
        }).catch(err => {
            console.error('Submission error:', err);
        }).finally(() => {
            submitBtn.innerText = originalText;
        });
    });
}

// ==========================================
// 2. DONATION LOGIC (Compact Grid System)
// ==========================================
const donationState = {};
const otherDonateInput = document.getElementById('other-donate-input');
const cartSummaryCard = document.getElementById('cart-summary-card');

document.querySelectorAll('.donate-item').forEach(item => {
    const itemName = item.dataset.item;
    let label = item.dataset.label;

    // Initialize state
    donationState[itemName] = { count: 0, label: label, active: false };

    const btnPlus = item.querySelector('.btn-plus');
    const btnMinus = item.querySelector('.btn-minus');
    const qtyDisplay = item.querySelector('.qty-display');

    const updateUI = () => {
        qtyDisplay.textContent = donationState[itemName].count;

        if (donationState[itemName].count > 0) {
            item.classList.add('active');
            donationState[itemName].active = true;
        } else {
            item.classList.remove('active');
            donationState[itemName].active = false;
        }

        renderDonationCart();
    };

    btnPlus.addEventListener('click', () => {
        // If it's the "Other" field, ensure they've typed something
        if (itemName === 'other' && !otherDonateInput.value.trim()) {
            otherDonateInput.focus();
            return alert("Please type the name of the item first.");
        }
        donationState[itemName].count++;
        updateUI();
    });

    btnMinus.addEventListener('click', () => {
        if (donationState[itemName].count > 0) {
            donationState[itemName].count--;
            updateUI();
        }
    });
});

// Update the "Other" label in the state dynamically if they type
if (otherDonateInput) {
    otherDonateInput.addEventListener('input', (e) => {
        donationState['other'].label = e.target.value.trim() || "Other Item";
        if (donationState['other'].count > 0) renderDonationCart();
    });
}

const cartContainer = document.getElementById('donation-cart-items');
function renderDonationCart() {
    if (!cartContainer) return;
    cartContainer.innerHTML = '';

    let hasItems = false;

    Object.keys(donationState).forEach(key => {
        const item = donationState[key];
        if (item.active && item.count > 0) {
            hasItems = true;
            const div = document.createElement('div');
            div.className = 'donated-item';
            div.innerHTML = `
                ${item.label}: <span style="font-weight: 800; margin-left: 5px;">${item.count}</span>
                <button type="button" class="btn-remove" data-key="${key}">
                    <img src="static/assets/trash-can-image.jpg" alt="Remove">
                </button>
            `;
            cartContainer.appendChild(div);
        }
    });

    // Show or hide the cart summary card based on if items exist
    if (cartSummaryCard) {
        cartSummaryCard.style.display = hasItems ? 'block' : 'none';
    }

    // Attach listener to cart remove buttons
    document.querySelectorAll('.btn-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const k = this.dataset.key;
            donationState[k].active = false;
            donationState[k].count = 0;

            // Reset the UI of the compact grid item
            const gridItem = document.querySelector(`.donate-item[data-item="${k}"]`);
            if (gridItem) {
                gridItem.querySelector('.qty-display').textContent = '0';
                gridItem.classList.remove('active');
            }

            if (k === 'other' && otherDonateInput) otherDonateInput.value = '';

            renderDonationCart();
        });
    });
}

const donateForm = document.getElementById('donate-supplies-form');
if (donateForm) {
    donateForm.addEventListener('submit', function(e) {
        e.preventDefault();

        let hasItems = Object.values(donationState).some(i => i.active && i.count > 0);
        if (!hasItems) return alert("Please add at least one item to donate.");
        if (!this.checkValidity()) return alert("Please fill out all required fields.");

        const submitBtn = document.getElementById('donate-submit-btn');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "Sending...";

        let itemStrings = Object.values(donationState)
            .filter(i => i.active && i.count > 0)
            .map(i => `${i.label}: ${i.count}`)
            .join('\n');

        const formData = {
            name: this.name.value,
            streetAddress: this.streetAddress.value,
            city: this.city.value,
            zip: this.zip.value,
            phoneNumber: this.phoneNumber.value,
            email: this.email.value,
            items: itemStrings
        };

        fetch('/api/donate-supplies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        }).then(res => {
            if (res.ok) {
                document.getElementById('donate-ui').classList.add('hidden');
                document.getElementById('donate-success').classList.remove('hidden');
            } else {
                alert("Failed to send request.");
            }
        }).finally(() => {
            submitBtn.innerText = originalText;
        });
    });
}

// ==========================================
// 3. 3D PHYSICS ENGINE
// ==========================================
let globalMouseX = -1000, globalMouseY = -1000;
window.addEventListener('mousemove', e => { globalMouseX = e.clientX; globalMouseY = e.clientY; });

// --- ADJUST THESE VARIABLES ---
const maxRotate = 4;      // Reduced from 12 to 4 for a subtle, premium tilt
const stickiness = 0.08;  // Reduced from 0.04 to minimize the floating shift
const safeZoneBuffer = 60;
// ------------------------------

document.querySelectorAll('.glass-card').forEach(card => {
    let state = { rotX: 0, rotY: 0, tRotX: 0, tRotY: 0, transX: 0, transY: 0, tTransX: 0, tTransY: 0, active: false };

    const render = () => {
        const rect = card.getBoundingClientRect();
        const inSafeZone = (globalMouseX >= rect.left - safeZoneBuffer && globalMouseX <= rect.right + safeZoneBuffer && globalMouseY >= rect.top - safeZoneBuffer && globalMouseY <= rect.bottom + safeZoneBuffer);
        const inStrictZone = (globalMouseX >= rect.left && globalMouseX <= rect.right && globalMouseY >= rect.top && globalMouseY <= rect.bottom);

        if (!state.active && inStrictZone) {
            state.active = true; card.classList.add('is-active');
        } else if (state.active && !inSafeZone) {
            state.active = false; card.classList.remove('is-active');
            state.tRotX = state.tRotY = state.tTransX = state.tTransY = 0;
            card.style.setProperty('--mouse-x', `50%`); card.style.setProperty('--mouse-y', `50%`);
        }

        if (state.active) {
            const cx = rect.width / 2, cy = rect.height / 2;
            const ox = (globalMouseX - rect.left) - cx, oy = (globalMouseY - rect.top) - cy;

            // The math now uses your new maxRotate and stickiness variables
            state.tRotY = (ox / cx) * maxRotate;
            state.tRotX = -(oy / cy) * maxRotate;
            state.tTransX = ox * stickiness;
            state.tTransY = oy * stickiness;

            card.style.setProperty('--mouse-x', `${globalMouseX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${globalMouseY - rect.top}px`);
        }

        const ease = state.active ? 0.005 : 0.004;
        state.rotX += (state.tRotX - state.rotX) * ease; state.rotY += (state.tRotY - state.rotY) * ease;
        state.transX += (state.tTransX - state.transX) * ease; state.transY += (state.tTransY - state.transY) * ease;
        card.style.transform = `translateX(${state.transX}px) translateY(${state.transY}px) perspective(1000px) rotateX(${state.rotX}deg) rotateY(${state.rotY}deg)`;
        requestAnimationFrame(render);
    };
    render();
});