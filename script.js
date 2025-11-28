'use strict';

// --- NAVIGATION LOGIC ---

// 1. Select the Nav Buttons
const navButtons = {
    about: document.getElementById('about-us-button'),
    getSupplies: document.getElementById('get-supplies-button'),
    donate: document.getElementById('donate-supplies-button'),
    support: document.getElementById('support-button')
};

// 2. Add Click Listeners to Navigation
navButtons.about.addEventListener('click', () => switchPage('section-about'));
navButtons.getSupplies.addEventListener('click', () => switchPage('section-get-supplies'));
navButtons.donate.addEventListener('click', () => switchPage('section-donate'));
navButtons.support.addEventListener('click', () => switchPage('section-support'));

// 3. The Page Switcher Function (Handles the Fade Out)
function switchPage(nextSectionId) {
    // Find the currently visible section (the one without the 'hidden' class)
    // We look inside .main-container to ensure we grab the right element
    const currentSection = document.querySelector('.main-container > section:not(.hidden)');
    const nextSection = document.getElementById(nextSectionId);

    // If we are already on the page, do nothing
    if (currentSection === nextSection) return;

    if (currentSection) {
        // A. Add the 'fading-out' class to trigger the CSS animation
        currentSection.classList.add('fading-out');

        // B. Wait 400ms (matches CSS animation time) before swapping
        setTimeout(() => {
            currentSection.classList.add('hidden');       // Hide old
            currentSection.classList.remove('fading-out'); // Clean up
            
            if (nextSection) {
                nextSection.classList.remove('hidden');   // Show new
            }
        }, 400); 
    } else {
        // Fallback for first load if nothing is visible
        if (nextSection) nextSection.classList.remove('hidden');
    }
}


// --- DONATION LOGIC ---

// Buttons
let donateWheelchairButton = document.querySelector('.donate-wheelchair-button');
let donateShowerChairButton = document.querySelector('.donate-shower-chair-button');
let donateCrutchesButton = document.querySelector('.donate-crutches-button');
let donateTotalButton = document.querySelector('.donate-total-button');

// Remove Buttons
let removeWheelchairButton = document.querySelector('.remove-wheelchair-button');
let removeShowerChairButton = document.querySelector('.remove-shower-chair-button');
let removeCrutchesButton = document.querySelector('.remove-crutches-button');

// Text Elements (The pill rows in the total card)
let wheelchairDonatedText = document.querySelector('.wheelchair-donated-text');
let showerChairDonatedText = document.querySelector('.shower-chair-donated-text');
let crutchesDonatedText = document.querySelector('.crutches-donated-text');

// State Variables
var donateWheelchair = false;
var donateShowerChair = false;
var donateCrutches = false;

// -- Add Item Functionality --

donateWheelchairButton.addEventListener('click', function() {
    donateWheelchair = true;
    donateWheelchairButton.textContent = "Added!";
    wheelchairDonatedText.classList.remove('hidden');
    updateTotalDonated();
});

donateShowerChairButton.addEventListener('click', function() {
    donateShowerChair = true;
    donateShowerChairButton.textContent = "Added!";
    showerChairDonatedText.classList.remove('hidden');
    updateTotalDonated();
});

donateCrutchesButton.addEventListener('click', function() {
    donateCrutches = true;
    donateCrutchesButton.textContent = "Added!";
    crutchesDonatedText.classList.remove('hidden');
    updateTotalDonated();
});

// -- Remove Item Functionality --

removeWheelchairButton.addEventListener('click', function() {
    donateWheelchair = false;
    donateWheelchairButton.textContent = "Donate Wheelchair";
    wheelchairDonatedText.classList.add('hidden');
    updateTotalDonated();
});

removeShowerChairButton.addEventListener('click', function() {
    donateShowerChair = false;          
    donateShowerChairButton.textContent = "Donate Shower Chair";
    showerChairDonatedText.classList.add('hidden');
    updateTotalDonated();
});

removeCrutchesButton.addEventListener('click', function() {
    donateCrutches = false;
    donateCrutchesButton.textContent = "Donate Crutches";
    crutchesDonatedText.classList.add('hidden');
    updateTotalDonated();
});

// -- Update Total Calculation --

function updateTotalDonated() {
    let totalDonated = 0;
    if (donateWheelchair) totalDonated += 200; // Updated to match HTML price
    if (donateShowerChair) totalDonated += 25;
    if (donateCrutches) totalDonated += 50;

    let totalDonatedElement = document.querySelector('.donate-total-heading');
    totalDonatedElement.textContent = `Total: $${totalDonated}`;
}

// Optional: Proceed to donate button action
donateTotalButton.addEventListener('click', function() {
    if (donateWheelchair || donateShowerChair || donateCrutches) {
        alert("Redirecting to payment...");
        // You can add your payment redirection here
    } else {
        alert("Please select an item to donate first.");
    }
});