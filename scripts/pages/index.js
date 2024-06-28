import { PhotographerFactory } from "../factories/photographer.js";

// Fetch photographers data from the server
async function getPhotographers(id = null) {
    try {
        const response = await fetch("./data/photographers.json");
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        const data = await response.json();
        // If an id is provided, find the photographer with that id
        if (id) {
            const photographer = data.photographers.find((photographer) => photographer.id === id);
            if (!photographer) {
                throw new Error("Photographer not found");
            }
            return photographer;
        } else {
            // If no id is provided, return all photographers
            return data.photographers;
        }
    } catch (e) {
        console.log("Failed to fetch photographers data: ", e);
        return null;
    } 
}

// Create a new PhotographerFactory instance with the given photographer data and display it on the page
async function displayData(photographer) {
    const photographerFactory = new PhotographerFactory(photographer);

    if (window.location.pathname.includes('index.html')) {
        const photographersSection = document.querySelector(".photographer_section");
        const userCardDOM = photographerFactory.getUserCardDOM();
        photographersSection.appendChild(userCardDOM);
    } else if (window.location.pathname.includes('photographer.html')) {
        const headerCardDOM = photographerFactory.getPhotographerPageDOM();
        return headerCardDOM;
    }
}

//Initialize the page
async function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = Number(urlParams.get("id"));

    if (window.location.pathname.includes('photographer.html')) {
        // If no id is provided or the id is not a number, redirect to the index page
        if (!id || isNaN(id)) {
            console.log("No photographer id provided");
            window.location.href = "index.html";
            return;
        }

        // Fetch the photographer data and display it
        const photographer = await getPhotographers(id);
        if (photographer) {
            await displayData(photographer);
        }
    } else if (window.location.pathname.includes('index.html')) {
        // If the current page is the index page, fetch all photographers data and display it
        const photographers = await getPhotographers();
        photographers.forEach(displayData);
    }
};
    
init();