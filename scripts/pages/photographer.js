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

//Launch light box modal
function displayModal(media) {
    const foo = getMediaUrl(media);
    console.log(foo);
}

//Map media to return array of media urls
function getMediaUrl(media) {
    const mediaArray = Array.isArray(media) ? media : [media];
    const mappedMedia = mediaArray.map((media) => media.image || media.video);
    return mappedMedia;
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
    getMediaUrl(sortedMedia);

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
            getMediaUrl(sortedMedia);
        } else {
            media.forEach(displayMedia);
        }

        // Update event listeners after sorting
        updateEventListeners(sortedMedia);
    })

    // Await displayMedia to finish before updating event listeners
    await displayMedia(sortedMedia);
        
    function updateEventListeners(sortedMedia) {
        const mediaContainerLinks = document.querySelectorAll('.media-container');

        // Add event listener to each media container
        mediaContainerLinks.forEach((link, index) => link.addEventListener('click', () => {
            const clickedMedia = sortedMedia[index];
            displayModal(sortedMedia);
            if (clickedMedia) {
                displayModal(clickedMedia);
            } else {
                console.error("Clicked media not found.");
            }
        }));
    }
}

init();