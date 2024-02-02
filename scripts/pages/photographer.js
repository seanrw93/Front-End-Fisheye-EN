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
    console.log(mediaDOM);
    return mediaDOM;
}

async function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = Number(urlParams.get("id"));
    const media = await getMedia(id);
    if (media) {
        media.forEach(displayMedia);
    }
}

function sortedByDate(media) {
    return media.sort((a, b) => new Date(b.date) - new Date(a.date));
}

init();


// Increase likes counter when clicking on the heart icon
async function increaseLikes(e) {
    const likesCounter = e.currentTarget.parentNode.querySelector('.likes-counter');
    let counter = Number(likesCounter.textContent);
    counter++;
    likesCounter.textContent = counter;
}

// Function to attach event listeners to likes buttons
function attachEventListeners() {
    const likesButtons = document.querySelectorAll('.media-likes button');
    likesButtons.forEach(button => {
        button.addEventListener('click', increaseLikes);
    });
}

// Create a MutationObserver instance
const observer = new MutationObserver((mutationsList) => {
    // If the addedNodes property has one or more nodes
    for(let mutation of mutationsList) {
        if(mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            attachEventListeners();
        }
    }
});

// Start observing the document with the configured parameters
observer.observe(document.body, { childList: true, subtree: true });