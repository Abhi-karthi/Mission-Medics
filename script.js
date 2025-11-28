'use strict';

let aboutUsButton = document.getElementById('about-us-button');
let getSuppliesButton = document.getElementById('get-supplies-button');
let donateSuppliesButton = document.getElementById('donate-supplies-button');
let supportButton = document.getElementById('support-button');

let donateWheelchairButton = document.querySelector('.donate-wheelchair-button');
let donateShowerChairButton = document.querySelector('.donate-shower-chair-button');
let donateCrutchesButton = document.querySelector('.donate-crutches-button');
let removeWheelchairButton = document.querySelector('.remove-wheelchair-button');
let removeShowerChairButton = document.querySelector('.remove-shower-chair-button');
let removeCrutchesButton = document.querySelector('.remove-crutches-button');

let aboutUsSection = document.querySelector('.about-us');
let getSuppliesSection = document.querySelector('.Get-supplies');
let donateSuppliesSection = document.querySelector('.donate-supplies');
let supportSection = document.querySelector('.Support');

let wheelchairDonatedText = document.querySelector('.wheelchair-donated-text');
let showerChairDonatedText = document.querySelector('.shower-chair-donated-text');
let crutchesDonatedText = document.querySelector('.crutches-donated-text');

var donateWheelchair = false;
var donateShowerChair = false;
var donateCrutches = false;

// Switching between sections

aboutUsButton.addEventListener('click', function() {
    aboutUsSection.classList.remove('hidden'); // removes hidden class to unhide section
    getSuppliesSection.classList.add('hidden'); // addes hidden class to hide section
    donateSuppliesSection.classList.add('hidden');
    supportSection.classList.add('hidden');
});

getSuppliesButton.addEventListener('click', function() {
    aboutUsSection.classList.add('hidden');
    getSuppliesSection.classList.remove('hidden');
    donateSuppliesSection.classList.add('hidden');
    supportSection.classList.add('hidden');
});

donateSuppliesButton.addEventListener('click', function() {
    aboutUsSection.classList.add('hidden');
    getSuppliesSection.classList.add('hidden');
    donateSuppliesSection.classList.remove('hidden');
    supportSection.classList.add('hidden');
});

supportButton.addEventListener('click', function() {
    aboutUsSection.classList.add('hidden');
    getSuppliesSection.classList.add('hidden');
    donateSuppliesSection.classList.add('hidden');
    supportSection.classList.remove('hidden');
});

// Donate supplies buttons functionality

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

// Remove donated items from list

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

function updateTotalDonated() {
    let totalDonated = 0;
    if (donateWheelchair) totalDonated += 100;
    if (donateShowerChair) totalDonated += 75;
    if (donateCrutches) totalDonated += 50;

    let totalDonatedElement = document.querySelector('.donate-total-heading');
    totalDonatedElement.textContent = `Total: $${totalDonated}`;
}
