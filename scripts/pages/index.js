import { PhotographerFactory } from "../factories/photographer.js";

async function getPhotographers(id = null) {
    try {
        const response = await fetch("./data/photographers.json");
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        const data = await response.json();
        if (id) {
            const photographer = data.photographers.find((photographer) => photographer.id === id);
            if (!photographer) {
                throw new Error("Photographer not found");
            }
            return photographer;
        } else {
            return data.photographers;
        }
    } catch (e) {
        console.log("Failed to fetch photographers data: ", e);
        return null;
    } 
}

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



    async function init() {
        const urlParams = new URLSearchParams(window.location.search);
        const id = Number(urlParams.get("id"));
    
        if (window.location.pathname.includes('photographer.html')) {
            if (!id || isNaN(id)) {
                console.log("No photographer id provided");
                window.location.href = "index.html";
                return;
            }
            const photographer = await getPhotographers(id);
            if (photographer) {
                await displayData(photographer);
            }
        } else if (window.location.pathname.includes('index.html')) {
            const photographers = await getPhotographers();
            photographers.forEach(displayData);
        }
    };
    
init();