async function getMedia(id) {
    try {
        const response = await fetch("./data/photographers.json")
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        const data = await response.json();
        if (id) {
            const media = data.media.filter((media) => media.photographerId === id);
            if (!media) {
                throw new Error("Media not found");
            }
            return media;
        } else {
            return data.media;
        } 
    }
    catch (e) {
        console.log("Failed to fetch media data: ", e);
        return null;
    }
}

async function displayMedia(media) {
    const mediaDOM = mediaFactory(media).getMediaDOM();
    return mediaDOM;
}

//Create and launch light box modal
let modal;
function createModal(media, clickedId) {
    modal = document.querySelector("#lightbox_modal");
    const closeButton = modal.querySelector('.close_button');
    const prevButton = modal.querySelector('.previous_button');
    const nextButton = modal.querySelector('.next_button');

    let currentIndex = media.find(obj => obj.id === clickedId);
    
    document.querySelector("body > main").style.pointerEvents = "none"
    document.body.style.overflow = "hidden"
    modal.setAttribute('aria-hidden', 'false');
    modal.setAttribute('aria-modal', 'true');

    // Remove event listeners from previous and next buttons
    function removeEventListeners() {
        prevButton.removeEventListener('click', showPreviousMedia);
        nextButton.removeEventListener('click', showNextMedia);
        modal.removeEventListener('keydown', handleKeyDown);
    }

    // Remove existing event listeners before adding new ones
    closeButton.addEventListener('click', removeEventListeners);
    modal && modal.addEventListener('keydown', e => modal && e.key === 'Escape' && removeEventListeners());
    
    const setPreviousId = (index) => {
        if (index === 0) {
            prevButton.classList.add("disabled");
            prevButton.dataset.previousId = ""
        } else { 
            const newIndex = index - 1;
            prevButton.classList.remove("disabled");
            prevButton.dataset.previousId = media[newIndex].id
        }
    }

    const setNextId = (index) => {
        if (index === media.length - 1) {
            nextButton.classList.add("disabled");
            nextButton.dataset.nextId = ""
        } else {
            const newIndex = index + 1;
            nextButton.classList.remove("disabled");
            nextButton.dataset.nextId = media[newIndex].id
        }
    }

    let mediaContainer = document.querySelector(".lightbox-media");

    function showMedia(mediaId) {
        const currentMedia = media.find(obj => obj.id === Number(mediaId));
        currentIndex = media.indexOf(currentMedia)
        if (currentMedia.image) {
            mediaContainer.innerHTML = `
                <figure>
                    <img src="assets/photographers/Photographers_Photos/${currentMedia.image}" 
                    alt="${currentMedia.title}" 
                    tabindex="0" />
                    <figcaption>${currentMedia.title}</figcaption>
                </figure>
            `;
        } else if (currentMedia.video) {
            mediaContainer.innerHTML = `
                <figure>
                    <video src="assets/photographers/Photographers_Photos/${currentMedia.video}" 
                    alt="${currentMedia.title}" 
                    tabindex="0"
                    controls></video>
                    <figcaption>${currentMedia.title}</figcaption>
                <figure>
            `;
        }

        setPreviousId(currentIndex);
        setNextId(currentIndex);
    }

    showMedia(clickedId);

    if (modal) {
        prevButton.addEventListener('click', showPreviousMedia);
        nextButton.addEventListener('click', showNextMedia);
        modal.addEventListener('keydown', handleKeyDown);
    }
    
    function handleKeyDown(e) {
        if (e.key === 'ArrowLeft') {
            showPreviousMedia();
        } else if (e.key === 'ArrowRight') {
            showNextMedia();
        }
    }
    
    function showNextMedia() {
        if (nextButton.dataset.nextId === "") {
            return
        } else {
            showMedia(nextButton.dataset.nextId);

        }
    }

    function showPreviousMedia() {
        if (prevButton.dataset.previousId === "") {
            return
        } else {
            showMedia(prevButton.dataset.previousId);
        }
    }
    
    function handleClose() {
        document.querySelector("body > main").style.pointerEvents = "auto"
        document.body.style.overflow = "auto"
        modal.setAttribute('aria-hidden', 'true');
        modal.setAttribute('aria-modal', 'false');
        modal.close();
    }

    // Event listeners for modal close
    closeButton.addEventListener('click', handleClose);
    modal && modal.addEventListener('keydown', e => modal && e.key === 'Escape' && handleClose());

    document.body.appendChild(modal);
    return modal;
}


function displayModal(modal) {
    if (!modal) {
        console.error("Modal element not found.");
        return;
    }
    modal.setAttribute('aria-hidden', 'false');
    modal.showModal();    

}

function sortByDate(media) {
    return media.sort((a, b) => new Date(a.date) - new Date(b.date));
}

function sortedByLikes(media) {
    return media.sort((a, b) => b.likes - a.likes);
}

function sortedByTitle(media) {
    return media.sort((a, b) => a.title.localeCompare(b.title));
}

async function init() {
    let sortedMedia;
    const urlParams = new URLSearchParams(window.location.search);
    const id = Number(urlParams.get("id"));
    const media = await getMedia(id);

    // Sort media by date on loading the page
    let sortedByDateMedia = sortByDate(media); // Sort media by date
    if (sortedByDateMedia) {
        sortedByDateMedia.forEach(item => {
            displayMedia(item); // Display each sorted media item
        });
    }

    //Stock sort functions in object
    const sortFunctions = {
        date: sortByDate,
        popularity: sortedByLikes,
        title: sortedByTitle
    }

    //Sort by date by default
    sortedMedia = sortFunctions.date(media.slice());

    // Initial event listener setup
    updateEventListeners(sortedMedia);
    
    // Sort media onchange sort select
    const sort = document.querySelector('#sort');
    sort.addEventListener('change', e => {

        // Clear media container before sorting
        const mediaContainer = document.querySelector('.media-section');
        mediaContainer.innerHTML = '';

        // Get sort function from object based on text content of "option"
        const sortFunction = sortFunctions[e.target.value];
        if (sortFunction) {
            sortedMedia = sortFunction(media.slice());
            sortedMedia.forEach(displayMedia);
        } else {
            media.forEach(displayMedia);
        }

        // Update event listeners after sorting
        updateEventListeners(sortedMedia);
    })
    // Await displayMedia to finish before updating event listeners
    await displayMedia(sortedMedia);
        
    function updateEventListeners(sortedMedia) {
        const mediaElements = document.querySelectorAll('.media-element');

        function handleModalCreation(elem) {
            if (elem) {
                const id = Number(elem.id);
                const modal = createModal(sortedMedia, id);
                displayModal(modal);
            }
        }

        // Add event listener to each media container
        mediaElements.forEach(elem => {
            elem.addEventListener('click', () => {
                handleModalCreation(elem)
            });
            elem.addEventListener('keydown', e => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleModalCreation(elem);
                }
            });
        });
    }
}

init();