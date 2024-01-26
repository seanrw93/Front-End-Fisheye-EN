    async function getPhotographers() {
        try {
            const response = await fetch("./data/photographers.json");
            if (!response.ok) {
                throw new Error("HTTP error " + response.status);
            }
            const data = await response.json();
            console.log(data.photographers);
            return data.photographers;
        } catch (e) {
            console.log("Failed to fetch photographers data", e);
            return [];
        } 
    }

    async function displayData(photographers) {
        const photographersSection = document.querySelector(".photographer_section");

        photographers.forEach((photographer) => {
            const photographerModel = photographerFactory(photographer);
            const userCardDOM = photographerModel.getUserCardDOM();
            photographersSection.appendChild(userCardDOM);
        });
    };

    async function init() {
        // Retreive photographer data
        const photographers = await getPhotographers();
        displayData(photographers);
    };
    
    init();
    