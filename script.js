'use strict';

let aboutUsButton = document.getElementById('about-us-button');
let getSuppliesButton = document.getElementById('get-supplies-button');
let donateSuppliesButton = document.getElementById('donate-supplies-button');
let supportButton = document.getElementById('support-button');

let aboutUsSection = document.querySelector('.about-us');
let getSuppliesSection = document.querySelector('.Get-supplies');
let donateSuppliesSection = document.querySelector('.donate-supplies');
let supportSection = document.querySelector('.Support');

aboutUsButton.addEventListener('click', function() {
    aboutUsSection.classList.remove('hidden');
    getSuppliesSection.classList.add('hidden');
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