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

// --- GET SUPPLIES LOGIC ---

// Buttons
let requestWheelchairButton = document.querySelector('.get-wheelchair-button');
let requestShowerChairButton = document.querySelector('.get-shower-chair-button');
let requestCrutchesButton = document.querySelector('.get-crutches-button');
let requestSubmitButton = document.getElementById('get-supplies-request-submit-button');



// --- DONATION LOGIC ---

// Buttons
let donateWheelchairButton = document.querySelector('.donate-wheelchair-button');
let donateShowerChairButton = document.querySelector('.donate-shower-chair-button');
let donateCrutchesButton = document.querySelector('.donate-crutches-button');
let donateRequestButton = document.getElementById('donation-request-submit-button');

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

// Donated Items Count and Variables
let wheelchairUpCountButton = document.querySelector('.donate-wheelchair-increase-button');
let wheelchairDownCountButton = document.querySelector('.donate-wheelchair-decrease-button');
let showerChairUpCountButton = document.querySelector('.donate-shower-chair-increase-button');
let showerChairDownCountButton = document.querySelector('.donate-shower-chair-decrease-button');
let crutchesUpCountButton = document.querySelector('.donate-crutches-increase-button');
let crutchesDownCountButton = document.querySelector('.donate-crutches-decrease-button');

var wheelchairCount = 0;
var showerChairCount = 0;
var crutchesCount = 0;
var donated = false;

// -- Add Item Functionality --

donateWheelchairButton.addEventListener('click', function() {
    donateWheelchair = true;
    donateWheelchairButton.textContent = "Added!";
    wheelchairDonatedText.classList.remove('hidden');
    wheelchairCount = 1;
    document.getElementById('donate-quantity-wheelchair').textContent = wheelchairCount;
});

donateShowerChairButton.addEventListener('click', function() {
    donateShowerChair = true;
    donateShowerChairButton.textContent = "Added!";
    showerChairDonatedText.classList.remove('hidden');
    showerChairCount = 1;  
    document.getElementById('donate-quantity-shower-chair').textContent = showerChairCount;
});

donateCrutchesButton.addEventListener('click', function() {
    donateCrutches = true;
    donateCrutchesButton.textContent = "Added!";
    crutchesDonatedText.classList.remove('hidden');
    crutchesCount = 1;
    document.getElementById('donate-quantity-crutches').textContent = crutchesCount;
});

// -- Remove Item Functionality --

removeWheelchairButton.addEventListener('click', function() {
    donateWheelchair = false;
    donateWheelchairButton.textContent = "Donate Wheelchair";
    wheelchairDonatedText.classList.add('hidden');
    wheelchairCount = 0;
    document.getElementById('donate-quantity-wheelchair').textContent = wheelchairCount;
});

removeShowerChairButton.addEventListener('click', function() {
    donateShowerChair = false;          
    donateShowerChairButton.textContent = "Donate Shower Chair";
    showerChairDonatedText.classList.add('hidden');
    showerChairCount = 0;
    document.getElementById('donate-quantity-shower-chair').textContent = showerChairCount;
});

removeCrutchesButton.addEventListener('click', function() {
    donateCrutches = false;
    donateCrutchesButton.textContent = "Donate Crutches";
    crutchesDonatedText.classList.add('hidden');
    crutchesCount = 0;
    document.getElementById('donate-quantity-crutches').textContent = crutchesCount;
});

// -- Count Adjustment Functionality --

wheelchairUpCountButton.addEventListener('click', function() {
    if (donateWheelchair) {
        wheelchairCount++;
    } else {
        wheelchairCount = 0;
    }
    document.getElementById('donate-quantity-wheelchair').textContent = wheelchairCount;
    wheelChairDonatedText.firstChild.nodeValue = `Wheelchair: ${wheelchairCount}`;
});

wheelchairDownCountButton.addEventListener('click', function() {
    if (wheelchairCount > 1 && donateWheelchair) {
        wheelchairCount--;
    } else if (!donateWheelchair) {
        wheelchairCount = 0;
    }
    document.getElementById('donate-quantity-wheelchair').textContent = wheelchairCount;
    wheelChairDonatedText.firstChild.nodeValue = `Wheelchair: ${wheelchairCount}`;
});

showerChairUpCountButton.addEventListener('click', function() {
    if (donateShowerChair) {
        showerChairCount++;
    } else {
        showerChairCount = 0;
    }   
    document.getElementById('donate-quantity-shower-chair').textContent = showerChairCount;
    showerChairDonatedText.firstChild.nodeValue = `Shower Chair: ${showerChairCount}`;
});

showerChairDownCountButton.addEventListener('click', function() {
    if (showerChairCount > 1 && donateShowerChair) {
        showerChairCount--;
    } else if (!donateShowerChair) {
        showerChairCount = 0;
    }
    document.getElementById('donate-quantity-shower-chair').textContent = showerChairCount;
    showerChairDonatedText.firstChild.nodeValue = `Shower Chair: ${showerChairCount}`;
});

crutchesUpCountButton.addEventListener('click', function() {
    if (donateCrutches) {
        crutchesCount++;
    } else {
        crutchesCount = 0;
    }
    document.getElementById('donate-quantity-crutches').textContent = crutchesCount;
    crutchesDonatedText.firstChild.nodeValue = `Crutches: ${crutchesCount}`;
});

crutchesDownCountButton.addEventListener('click', function() {
    if (crutchesCount > 1 && donateCrutches) {
        crutchesCount--;
    } else if (!donateCrutches) {
        crutchesCount = 0;
    }
    document.getElementById('donate-quantity-crutches').textContent = crutchesCount;
    crutchesDonatedText.firstChild.nodeValue = `Crutches: ${crutchesCount}`;
});

// -- Donate Form Submission --

let supplyForm = document.getElementById('donate-supplies-form');

supplyForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Simple validation
    if (!supplyForm.checkValidity()) {
        alert("Please fill out all required fields.");
        return;     
    }

    // Gather form data
    let formData = {
        name: supplyForm.name.value,
        streetAddress: supplyForm.streetAddress.value,
        wheelchairs: wheelchairCount,
        showerChairs: showerChairCount,
        crutches: crutchesCount,
        city: supplyForm.city.value,
        zip: supplyForm.zip.value,
        phoneNumber: supplyForm.phoneNumber.value,
        email: supplyForm.email.value
    };

    emailjs.send('service_oormfpl', 'template_ai1zyfs', formData)
        .then(function() {
            // Success!
            alert("Request Sent! We will contact you shortly.");
            pickupForm.reset();
            submitBtn.innerText = originalText;
        }, function(error) {
            // Error!
            alert("Failed to send: " + error.text);
            submitBtn.innerText = originalText;
        });
    
    document.querySelector('.donate-cards-container').classList.add('hidden');
    document.querySelector('.donate-confirmation-card').classList.remove('hidden');
    donated = true;
});
