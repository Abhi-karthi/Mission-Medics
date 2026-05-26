'use strict';

// --- GET SUPPLIES LOGIC ---

// Buttons
let requestWheelchairButton = document.querySelector('.get-wheelchair-button');
let requestShowerChairButton = document.querySelector('.get-shower-chair-button');
let requestCrutchesButton = document.querySelector('.get-crutches-button');
let requestSubmitButton = document.getElementById('get-supplies-request-submit-button');

var wheelChairSelected = false;
var showerChairSelected = false;
var crutchesSelected = false;

// Request Item Functionality

if (requestWheelchairButton) {
    requestWheelchairButton.addEventListener('click', function() {
        if (!wheelChairSelected) {
            requestWheelchairButton.querySelector('img').src = "static/assets/check-box-blue.png";
            wheelChairSelected = true;
        } else {
            requestWheelchairButton.querySelector('img').src = "static/assets/check-box-grey.png";
            wheelChairSelected = false;
        }
    });
}

if (requestShowerChairButton) {
    requestShowerChairButton.addEventListener('click', function() {
        if (!showerChairSelected) {
            requestShowerChairButton.querySelector('img').src = "static/assets/check-box-blue.png";
            showerChairSelected = true;
        } else {
            requestShowerChairButton.querySelector('img').src = "static/assets/check-box-grey.png";
            showerChairSelected = false;
        }
    });
}

if (requestCrutchesButton) {
    requestCrutchesButton.addEventListener('click', function() {
        if (!crutchesSelected) {
            requestCrutchesButton.querySelector('img').src = "static/assets/check-box-blue.png";
            crutchesSelected = true;
        } else {
            requestCrutchesButton.querySelector('img').src = "static/assets/check-box-grey.png";
            crutchesSelected = false;
        }
    });
}

let requestForm = document.getElementById('get-supplies-form');

if (requestForm) {
    requestForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        let messageArray = [];
        let messageString = "";

        if (wheelChairSelected) {
            messageArray.push("a wheelchair");
        } 
        if (showerChairSelected) {
            messageArray.push("a shower chair");
        } 
        if (crutchesSelected) {
            messageArray.push("crutches");
        }

        if (messageArray.length === 0) { 
            alert("Please select at least one item.");
            return; 
        } 
        
        if (messageArray.length === 1) {
            messageString = messageArray[0];
        } else if (messageArray.length === 2) {
            messageString = messageArray[0] + " and " + messageArray[1];
        } else {
            let lastItem = messageArray.pop(); 
            messageString = messageArray.join(", ") + ", and " + lastItem;
        }

        if (!requestForm.checkValidity()) {
            alert("Please fill out all required fields.");
            return;     
        }

        let formData = {
            name: requestForm.name.value,
            streetAddress: requestForm.streetAddress.value,
            city: requestForm.city.value,
            zip: requestForm.zip.value,
            phoneNumber: requestForm.phoneNumber.value,
            email: requestForm.email.value,  
            message: messageString
        };

        const submitBtn = document.getElementById('get-supplies-request-submit-button');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "Sending...";

        emailjs.send('service_oormfpl', 'template_rvzmg0q', formData)
            .then(function() {
                alert("Request Sent! We will contact you shortly.");
                requestForm.reset();
                submitBtn.innerText = originalText;
                
                document.querySelector('.get-supplies-cards-container').classList.add('hidden');
                document.querySelector('.get-supplies-confirmation-card').classList.remove('hidden');

            }, function(error) {
                alert("Failed to send: " + JSON.stringify(error));
                submitBtn.innerText = originalText;
            });
    });
}

// --- DONATION LOGIC ---

// Buttons
let donateWheelchairButton = document.querySelector('.donate-wheelchair-button');
let donateShowerChairButton = document.querySelector('.donate-shower-chair-button');
let donateCrutchesButton = document.querySelector('.donate-crutches-button');

// Remove Buttons
let removeWheelchairButton = document.querySelector('.remove-wheelchair-button');
let removeShowerChairButton = document.querySelector('.remove-shower-chair-button');
let removeCrutchesButton = document.querySelector('.remove-crutches-button');

// Text Elements
let wheelchairDonatedText = document.querySelector('.wheelchair-donated-text');
let showerChairDonatedText = document.querySelector('.shower-chair-donated-text');
let crutchesDonatedText = document.querySelector('.crutches-donated-text');

// State Variables
var donateWheelchair = false;
var donateShowerChair = false;
var donateCrutches = false;

// Donated Items Count
let wheelchairUpCountButton = document.querySelector('.donate-wheelchair-increase-button');
let wheelchairDownCountButton = document.querySelector('.donate-wheelchair-decrease-button');
let showerChairUpCountButton = document.querySelector('.donate-shower-chair-increase-button');
let showerChairDownCountButton = document.querySelector('.donate-shower-chair-decrease-button');
let crutchesUpCountButton = document.querySelector('.donate-crutches-increase-button');
let crutchesDownCountButton = document.querySelector('.donate-crutches-decrease-button');

var wheelchairCount = 0;
var showerChairCount = 0;
var crutchesCount = 0;

if (donateWheelchairButton) {
    donateWheelchairButton.addEventListener('click', function() {
        donateWheelchair = true;
        donateWheelchairButton.textContent = "Added!";
        wheelchairDonatedText.classList.remove('hidden');
        wheelchairCount = 1;
        document.getElementById('donate-quantity-wheelchair').textContent = wheelchairCount;
        wheelchairDonatedText.firstChild.nodeValue = `Wheelchair: ${wheelchairCount} `;
    });
}

if (donateShowerChairButton) {
    donateShowerChairButton.addEventListener('click', function() {
        donateShowerChair = true;
        donateShowerChairButton.textContent = "Added!";
        showerChairDonatedText.classList.remove('hidden');
        showerChairCount = 1;  
        document.getElementById('donate-quantity-shower-chair').textContent = showerChairCount;
        showerChairDonatedText.firstChild.nodeValue = `Shower Chair: ${showerChairCount} `;
    });
}

if (donateCrutchesButton) {
    donateCrutchesButton.addEventListener('click', function() {
        donateCrutches = true;
        donateCrutchesButton.textContent = "Added!";
        crutchesDonatedText.classList.remove('hidden');
        crutchesCount = 1;
        document.getElementById('donate-quantity-crutches').textContent = crutchesCount;
        crutchesDonatedText.firstChild.nodeValue = `Crutches: ${crutchesCount} `;
    });
}

if (removeWheelchairButton) {
    removeWheelchairButton.addEventListener('click', function() {
        donateWheelchair = false;
        donateWheelchairButton.textContent = "Donate Wheelchair";
        wheelchairDonatedText.classList.add('hidden');
        wheelchairCount = 0;
        document.getElementById('donate-quantity-wheelchair').textContent = wheelchairCount;
    });
}

if (removeShowerChairButton) {
    removeShowerChairButton.addEventListener('click', function() {
        donateShowerChair = false;          
        donateShowerChairButton.textContent = "Donate Shower Chair";
        showerChairDonatedText.classList.add('hidden');
        showerChairCount = 0;
        document.getElementById('donate-quantity-shower-chair').textContent = showerChairCount;
    });
}

if (removeCrutchesButton) {
    removeCrutchesButton.addEventListener('click', function() {
        donateCrutches = false;
        donateCrutchesButton.textContent = "Donate Crutches";
        crutchesDonatedText.classList.add('hidden');
        crutchesCount = 0;
        document.getElementById('donate-quantity-crutches').textContent = crutchesCount;
    });
}

if (wheelchairUpCountButton) {
    wheelchairUpCountButton.addEventListener('click', function() {
        if (donateWheelchair) {
            wheelchairCount++;
            document.getElementById('donate-quantity-wheelchair').textContent = wheelchairCount;
            wheelchairDonatedText.firstChild.nodeValue = `Wheelchair: ${wheelchairCount} `;
        }
    });
}

if (wheelchairDownCountButton) {
    wheelchairDownCountButton.addEventListener('click', function() {
        if (wheelchairCount > 1 && donateWheelchair) {
            wheelchairCount--;
            document.getElementById('donate-quantity-wheelchair').textContent = wheelchairCount;
            wheelchairDonatedText.firstChild.nodeValue = `Wheelchair: ${wheelchairCount} `;
        }
    });
}

if (showerChairUpCountButton) {
    showerChairUpCountButton.addEventListener('click', function() {
        if (donateShowerChair) {
            showerChairCount++;
            document.getElementById('donate-quantity-shower-chair').textContent = showerChairCount;
            showerChairDonatedText.firstChild.nodeValue = `Shower Chair: ${showerChairCount} `;
        }
    });
}

if (showerChairDownCountButton) {
    showerChairDownCountButton.addEventListener('click', function() {
        if (showerChairCount > 1 && donateShowerChair) {
            showerChairCount--;
            document.getElementById('donate-quantity-shower-chair').textContent = showerChairCount;
            showerChairDonatedText.firstChild.nodeValue = `Shower Chair: ${showerChairCount} `;
        }
    });
}

if (crutchesUpCountButton) {
    crutchesUpCountButton.addEventListener('click', function() {
        if (donateCrutches) {
            crutchesCount++;
            document.getElementById('donate-quantity-crutches').textContent = crutchesCount;
            crutchesDonatedText.firstChild.nodeValue = `Crutches: ${crutchesCount} `;
        }
    });
}

if (crutchesDownCountButton) {
    crutchesDownCountButton.addEventListener('click', function() {
        if (crutchesCount > 1 && donateCrutches) {
            crutchesCount--;
            document.getElementById('donate-quantity-crutches').textContent = crutchesCount;
            crutchesDonatedText.firstChild.nodeValue = `Crutches: ${crutchesCount} `;
        }
    });
}

let supplyForm = document.getElementById('donate-supplies-form');

if (supplyForm) {
    supplyForm.addEventListener('submit', function(event) {
        event.preventDefault();

        if (!supplyForm.checkValidity()) {
            alert("Please fill out all required fields.");
            return;     
        }

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

        const submitBtn = document.getElementById('donation-request-submit-button');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "Sending...";

        emailjs.send('service_oormfpl', 'template_ai1zyfs', formData)
            .then(function() {
                alert("Request Sent! We will contact you shortly.");
                supplyForm.reset();
                submitBtn.innerText = originalText;
                document.querySelector('.donate-cards-container').classList.add('hidden');
                document.querySelector('.donate-confirmation-card').classList.remove('hidden');
            }, function(error) {
                alert("Failed to send: " + error.text);
                submitBtn.innerText = originalText;
            });
    });
}


// --- MOUSE TRACKING FOR 3D CARDS ---
document.querySelectorAll('.about-card, .form, .donate-wheelchair-card, .donate-shower-chair-card, .donate-crutches-card, .donate-total-card, .get-supplies-selection-card, .get-supplies-form-card, .schedule-pickup-card, .donate-confirmation-card, .get-supplies-confirmation-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element.
        const y = e.clientY - rect.top;  // y position within the element.
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});
