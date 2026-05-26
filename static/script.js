'use strict';

// ==========================================
// 1. GET SUPPLIES LOGIC
// ==========================================
const selectedSupplies = new Set();
const selectButtons = document.querySelectorAll('.btn-select:not(.other-btn)');
const otherBtn = document.querySelector('.other-btn');
const otherInput = document.getElementById('other-input');
const otherCheck = document.getElementById('other-check-box-image');

selectButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const itemName = this.textContent.trim();
        const img = this.querySelector('.check-icon');

        if (selectedSupplies.has(itemName)) {
            selectedSupplies.delete(itemName);
            img.src = "static/assets/check-box-grey.png";
        } else {
            selectedSupplies.add(itemName);
            img.src = "static/assets/check-box-blue.png";
        }
    });
});

let otherSelected = false;
if (otherBtn) {
    otherBtn.addEventListener('click', function(e) {
        if (e.target === otherInput) return;
        otherSelected = !otherSelected;
        otherCheck.src = otherSelected ? "static/assets/check-box-blue.png" : "static/assets/check-box-grey.png";
        if (otherSelected) otherInput.focus();
        else otherInput.value = '';
    });
}

const getSuppliesForm = document.getElementById('get-supplies-form');
if (getSuppliesForm) {
    getSuppliesForm.addEventListener('submit', function(e) {
        e.preventDefault();
        let items = Array.from(selectedSupplies);
        if (otherSelected && otherInput.value.trim()) items.push(otherInput.value.trim());

        if (items.length === 0) return alert("Please select at least one item.");
        if (!this.checkValidity()) return alert("Please fill out all required fields.");

        const submitBtn = document.getElementById('get-submit-btn');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "Sending...";

        const formData = {
            name: this.name.value, streetAddress: this.streetAddress.value,
            city: this.city.value, zip: this.zip.value,
            phoneNumber: this.phoneNumber.value, email: this.email.value,
            message: items.join(", ")
        };

        fetch('/api/request-supplies', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
        }).then(res => {
            if (res.ok) {
                document.getElementById('get-supplies-ui').classList.add('hidden');
                document.getElementById('get-supplies-success').classList.remove('hidden');
            } else alert("Failed to send request.");
        }).finally(() => submitBtn.innerText = originalText);
    });
}

// ==========================================
// 2. DONATION LOGIC (Dynamic State Manager)
// ==========================================
const donationState = {};

document.querySelectorAll('.donate-logic-card').forEach(card => {
    const itemName = card.dataset.item;
    donationState[itemName] = { count: 0, active: false, label: card.dataset.label };

    const btnAdd = card.querySelector('.btn-add-donate');
    const btnInc = card.querySelector('.btn-qty-inc');
    const btnDec = card.querySelector('.btn-qty-dec');
    const qtyDisplay = card.querySelector('.qty-display');

    const updateUI = () => {
        qtyDisplay.textContent = donationState[itemName].count;
        btnAdd.textContent = donationState[itemName].active ? "Added!" : `Donate ${donationState[itemName].label}`;
        renderDonationCart();
    };

    btnAdd.addEventListener('click', () => {
        donationState[itemName].active = true;
        if (donationState[itemName].count === 0) donationState[itemName].count = 1;
        updateUI();
    });

    btnInc.addEventListener('click', () => {
        if (donationState[itemName].active) {
            donationState[itemName].count++;
            updateUI();
        }
    });

    btnDec.addEventListener('click', () => {
        if (donationState[itemName].active && donationState[itemName].count > 1) {
            donationState[itemName].count--;
            updateUI();
        }
    });
});

const cartContainer = document.getElementById('donation-cart-items');
function renderDonationCart() {
    if (!cartContainer) return;
    cartContainer.innerHTML = '';

    Object.keys(donationState).forEach(key => {
        const item = donationState[key];
        if (item.active && item.count > 0) {
            const div = document.createElement('div');
            div.className = 'donated-item';
            div.innerHTML = `
                ${item.label}: ${item.count}
                <button class="btn-remove" data-key="${key}">
                    <img src="static/assets/trash-can-image.jpg" alt="Remove">
                </button>
            `;
            cartContainer.appendChild(div);
        }
    });

    document.querySelectorAll('.btn-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const k = this.dataset.key;
            donationState[k].active = false;
            donationState[k].count = 0;
            document.querySelector(`.donate-logic-card[data-item="${k}"] .qty-display`).textContent = '0';
            document.querySelector(`.donate-logic-card[data-item="${k}"] .btn-add-donate`).textContent = `Donate ${donationState[k].label}`;
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
            name: this.name.value, streetAddress: this.streetAddress.value,
            city: this.city.value, zip: this.zip.value,
            phoneNumber: this.phoneNumber.value, email: this.email.value,
            items: itemStrings
        };

        fetch('/api/donate-supplies', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
        }).then(res => {
            if (res.ok) {
                document.getElementById('donate-ui').classList.add('hidden');
                document.getElementById('donate-success').classList.remove('hidden');
            } else alert("Failed to send request.");
        }).finally(() => submitBtn.innerText = originalText);
    });
}

// ==========================================
// 3. 3D PHYSICS ENGINE
// ==========================================
let globalMouseX = -1000, globalMouseY = -1000;
window.addEventListener('mousemove', e => { globalMouseX = e.clientX; globalMouseY = e.clientY; });

document.querySelectorAll('.glass-card').forEach(card => {
    let state = { rotX: 0, rotY: 0, tRotX: 0, tRotY: 0, transX: 0, transY: 0, tTransX: 0, tTransY: 0, active: false };

    const render = () => {
        const rect = card.getBoundingClientRect();
        const inSafeZone = (globalMouseX >= rect.left - 60 && globalMouseX <= rect.right + 60 && globalMouseY >= rect.top - 60 && globalMouseY <= rect.bottom + 60);
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
            state.tRotY = (ox / cx) * 12; state.tRotX = -(oy / cy) * 12;
            state.tTransX = ox * 0.04; state.tTransY = oy * 0.04;
            card.style.setProperty('--mouse-x', `${globalMouseX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${globalMouseY - rect.top}px`);
        }

        const ease = state.active ? 0.03 : 0.015;
        state.rotX += (state.tRotX - state.rotX) * ease; state.rotY += (state.tRotY - state.rotY) * ease;
        state.transX += (state.tTransX - state.transX) * ease; state.transY += (state.tTransY - state.transY) * ease;
        card.style.transform = `translateX(${state.transX}px) translateY(${state.transY}px) perspective(1000px) rotateX(${state.rotX}deg) rotateY(${state.rotY}deg)`;
        requestAnimationFrame(render);
    };
    render();
});