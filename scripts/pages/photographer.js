import { MediaFactory } from "../factories/media.js";

// Fetch media data from the server
async function getMedia(id) {
    try {
        const response = await fetch("https://seanrw93.github.io/Front-End-Fisheye-EN/data/photographers.json");
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        const data = await response.json();
        // If an id is provided, filter the media data to only include media with that id
        if (id) {
            const media = data.media.filter((media) => media.photographerId === id);
            if (!media) {
                throw new Error("Media not found");
            }
            return media;
        } else {
            return data.media;
        }
    } catch (e) {
        console.log("Failed to fetch media data: ", e);
        return null;
    }
}

// Display media on the page
async function displayMedia(media) {
    const mediaSection = document.querySelector(".media-section");
    mediaSection.innerHTML = ""; 

    media.forEach(item => {
        const mediaFactory = new MediaFactory(item);
        const mediaDOM = mediaFactory.getMediaDOM();
        mediaSection.appendChild(mediaDOM);
    });

    // Update total likes
    updateTotalLikes();
}

// Function to update total likes
function updateTotalLikes() {
    const likesCounters = document.querySelectorAll(".likes-counter");
    const totalCounter = document.querySelector(".total-counter > span");
    const totalLikes = Array.from(likesCounters).reduce((acc, like) => acc + parseInt(like.textContent), 0);
    totalCounter.textContent = totalLikes;
}

// Create a modal logic to display media within
function createModal(media, clickedId) {
    let modal;

    // If the modal doesn't exist, create it and add event listeners
    if (!modal) {
        modal = document.querySelector("#lightbox_modal");
        const closeButton = modal.querySelector(".close_button");
        closeButton.addEventListener("click", handleClose);
        modal.addEventListener("keydown", e => {
            if (e.key === "Escape") {
                handleClose();
            }
        });
    }

    modal.focus();

    const closeButton = modal.querySelector(".close_button");
    const prevButton = modal.querySelector(".previous_button");
    const nextButton = modal.querySelector(".next_button");

    let currentIndex = media.findIndex(obj => obj.id === clickedId);

    document.querySelector("body > main").style.pointerEvents = "none";
    document.body.style.overflow = "hidden";
    modal.setAttribute("aria-modal", "true");

    function removeEventListeners() {
        prevButton.removeEventListener("click", showPreviousMedia);
        nextButton.removeEventListener("click", showNextMedia);
        modal.removeEventListener("keydown", handleKeyDown);
    }

    closeButton.addEventListener("click", removeEventListeners);
    modal && modal.addEventListener("keydown", e => modal && e.key === "Escape" && removeEventListeners());

    const setPreviousId = (index) => {
        if (index === 0) {
            prevButton.classList.add("disabled");
            prevButton.classList.add("disabled");
            prevButton.setAttribute("aria-disabled", "true");
            prevButton.setAttribute("disabled", "true");
            prevButton.dataset.previousId = "";
        } else {
            const newIndex = index - 1;
            prevButton.classList.remove("disabled");
            prevButton.classList.remove("disabled");
            prevButton.setAttribute("aria-disabled", "false");
            prevButton.removeAttribute("disabled");
            prevButton.dataset.previousId = media[newIndex].id;
        }
    };

    const setNextId = (index) => {
        if (index === media.length - 1) {
            nextButton.classList.add("disabled");
            nextButton.setAttribute("aria-disabled", "true");
            nextButton.setAttribute("disabled", "true");
            nextButton.dataset.nextId = "";
        } else {
            const newIndex = index + 1;
            nextButton.classList.remove("disabled");
            nextButton.setAttribute("aria-disabled", "false");
            nextButton.removeAttribute("disabled");
            nextButton.dataset.nextId = media[newIndex].id;
        }
    };

    let mediaContainer = document.querySelector(".lightbox-media");

    // Function to display the media with the given id
    function showMedia(mediaId) {
        const currentMedia = media.find(obj => obj.id === Number(mediaId));
        currentIndex = media.indexOf(currentMedia);
        if (currentMedia.image) {
            mediaContainer.innerHTML = `
                <figure tabindex="-1">
                    <img src="assets/photographers/Photographers_Photos/${currentMedia.image}" 
                    alt="${currentMedia.title}" 
                    aria-live="asserive"/>
                    <figcaption>${currentMedia.title}</figcaption>
                </figure>
            `;
        } else if (currentMedia.video) {
            mediaContainer.innerHTML = `
                <figure tabindex="-1">
                    <video src="assets/photographers/Photographers_Photos/${currentMedia.video}" 
                    controls
                    aria-label="${currentMedia.title} video"
                    aria-live="assertive">
                    </video>
                    <figcaption>${currentMedia.title}</figcaption>
                </figure>
            `;
        }

        setPreviousId(currentIndex);
        setNextId(currentIndex);
    }

    showMedia(clickedId);

    // Add event listeners for navigating through media in the modal
    if (modal) {
        prevButton.addEventListener("click", showPreviousMedia);
        nextButton.addEventListener("click", showNextMedia);
        modal.addEventListener("keydown", handleKeyDown);
    }

    function handleKeyDown(e) {
        if (e.key === "ArrowLeft") {
            prevButton.click();
        } else if (e.key === "ArrowRight") {
            nextButton.click();
        }
    }

    function showNextMedia() {
        if (nextButton.dataset.nextId === "") {
            return;
        } else {
            showMedia(nextButton.dataset.nextId);
        }
    }

    function showPreviousMedia() {
        if (prevButton.dataset.previousId === "") {
            return;
        } else {
            showMedia(prevButton.dataset.previousId);
        }
    }

    function handleClose() {
        document.querySelector("body > main").style.pointerEvents = "auto";
        document.body.style.overflow = "auto";
        modal.close();
    }

    closeButton.addEventListener("click", handleClose);
    modal && modal.addEventListener("keydown", e => modal && e.key === "Escape" && handleClose());

    // Add the modal to the body of the document
    document.body.appendChild(modal);
    return modal;
}

// Display the modal
function displayModal(modal) {
    if (!modal) {
        console.error("Modal element not found.");
        return;
    }

    modal.setAttribute("aria-hidden", "false");
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

// Initialize the page
async function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = Number(urlParams.get("id"));

    // Fetch and display media
    const media = await getMedia(id);
    let sortedByDateMedia = sortByDate(media);
    await displayMedia(sortedByDateMedia);

    // Sort media by date by default
    const sortFunctions = {
        "date": sortByDate,
        "popularity": sortedByLikes,
        "title": sortedByTitle
    };

    // Sort media by date by default
    let sortedMedia = sortFunctions["date"](media.slice());

    // Add event listener for changing the sort order
    const sort = document.querySelector("#sort");
    sort.addEventListener("change", async (e) => {
        const mediaContainer = document.querySelector(".media-section");
        mediaContainer.innerHTML = ""; // Clear previous media

        const sortFunction = sortFunctions[e.target.value];
        if (sortFunction) {
            sortedMedia = sortFunction(media.slice());
        } else {
            sortedMedia = media;
        }

        // Display the sorted media
        await displayMedia(sortedMedia);
        updateEventListeners(sortedMedia);
    });

    // Add event listeners for opening the modal
    updateEventListeners(sortedMedia);
}

function updateEventListeners(sortedMedia) {
    const mediaElements = document.querySelectorAll(".media-element");

    // Function to handle the creation of a modal using the clicked media element's ID
    const handleModalCreation = (elem) => {
        if (elem) {
            const id = Number(elem.id);
            // Create a modal for the media with the given id
            const modal = createModal(sortedMedia, id);
            displayModal(modal);
        }
    }

    // Add event listeners for opening the modal
    mediaElements.forEach(elem => {
        elem.addEventListener("click", () => {
            handleModalCreation(elem);
        });
        elem.addEventListener("keydown", e => {
            if (e.key === "Enter") {
                e.preventDefault();
                handleModalCreation(elem);
            }
        });
    });
}

init();