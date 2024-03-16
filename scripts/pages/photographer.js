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

function displayModal(media) {
    const mediaArray = Array.isArray(media) ? media : [media];
    console.log(mediaArray.map((media) => media.image || media.video));
}

function sortBydate(media) {
    return media.sort((a, b) => new Date(a.date) - new Date(b.date));
}

function sortedByLikes(media) {
    return media.sort((a, b) => b.likes - a.likes);
}

function sortedByTitle(media) {
    return media.sort((a, b) => a.title.localeCompare(b.title));
}

async function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = Number(urlParams.get("id"));
    const media = await getMedia(id);

    // Temporary test to display modal array upon loading page
    displayModal(media);
    //End test 

    if (media) {
        media.forEach(item => {
            displayMedia(item);
            // const mediaLinks = document.querySelectorAll('.media-container a');
            // mediaLinks.forEach(m => m.addEventListener('click', () => displayModal(item)));
        });
    }

    // Stock sort functions in object
    const sortFunctions = {
        date: sortBydate,
        popularity: sortedByLikes,
        title: sortedByTitle
    }

    // Sort media onchange sort select
    const sort = document.querySelector('#sort');
    sort.addEventListener('change', (e) => {

        // Clear media container before sorting
        const mediaContainer = document.querySelector('.media-section');
        mediaContainer.innerHTML = '';

        // Get sort function from object based on text content of "option"
        const sortFunction = sortFunctions[e.target.value];
        if (sortFunction) {
            const sortedMedia = sortFunction(media.slice());
            sortedMedia.forEach(displayMedia);
            displayModal(sortedMedia);
        } else {
            media.forEach(displayMedia);
        }
    })
}

init();