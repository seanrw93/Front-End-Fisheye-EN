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
    const clickedMedia = media.find(obj => obj.id === clickedId);
    let currentIndex = media.indexOf(clickedMedia)

    if (!modal) {
        modal = document.createElement('dialog');
        modal.id = 'lightbox_modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'dialog_label');
        modal.setAttribute('aria-hidden', 'true');
        modal.setAttribute('tabindex', '-1');    
        document.body.style.overflow = "hidden"

    } else {
        modal.innerHTML = ""
    }

    let mediaHTML = ""

    if (clickedMedia.image) {
        mediaHTML = `
            <img src="assets/photographers/Photographers_Photos/${clickedMedia.image}" alt="${clickedMedia.title}" />
        `;
    } 
    // Check if current media is a video (if applicable)
    else if (clickedMedia.video) {
        mediaHTML = `
            <video src="assets/photographers/Photographers_Photos/${clickedMedia.video}" alt="${clickedMedia.title}" controls></video>
        `;
    }


    modal.innerHTML = `
            <button class="close_button" tabindex="0" aria-label="Close">
            <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M42 4.23L37.77 0L21 16.77L4.23 0L0 4.23L16.77 21L0 37.77L4.23 42L21 25.23L37.77 42L42 37.77L25.23 21L42 4.23Z" fill="white"/>
            </svg>
            </button>
            <main>
                <div class="media-navigation">
                    <button class="previous_button" aria-label="Previous media">
                        <i class="fa-solid fa-chevron-left"></i>
                    </button>
                    <div class="lightbox-media">
                        ${mediaHTML}
                    </div>
                    <button class="next_button" aria-label="Next media">
                        <i class="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
            </main>
            <footer>
                <div class="media-title"></div>
            </footer>
    `   
        const prevButton = modal.querySelector('.previous_button');
        const nextButton = modal.querySelector('.next_button');
        prevButton.addEventListener('click', () => showPreviousMedia(media));
        nextButton.addEventListener('click', () => showNextMedia(media));

        if (modal) {
            document.addEventListener('keydown', e => {
                if (e.key === 'ArrowLeft') {
                    prevButton.click()
                } else if (e.key === 'ArrowRight') {
                    nextButton.click()
                }
            });
        }

        function showNextMedia(media) {
            if (currentIndex > media.length - 1) {
                return
            } else {
                currentIndex++
            }

            updateMedia(media[currentIndex]);
        }

        function showPreviousMedia(media) {
            if (currentIndex <= 0) {
                return
            } else {
                currentIndex--
            }

            updateMedia(media[currentIndex]);
        }

        function updateMedia(updatedMedia) {
            let mediaHTML = document.querySelector(".lightbox-media")

            if (updatedMedia.image) {
                mediaHTML.innerHTML = `
                    <img src="assets/photographers/Photographers_Photos/${updatedMedia.image}" alt="${updatedMedia.title}" />
                `;
            } 
            // Check if current media is a video (if applicable)
            else if (updatedMedia.video) {
                mediaHTML.innerHTML = `
                    <video src="assets/photographers/Photographers_Photos/${updatedMedia.video}" alt="${updatedMedia.title}" controls></video>
                `;
            }

            return mediaHTML;
            
        }

    // Event listener for modal close
    modal.querySelector('.close_button').addEventListener('click', () => {
        modal.close();
        modal.setAttribute('aria-hidden', 'true'); // Set aria-hidden to true when closed
        document.body.style.overflow = "auto"
    });

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
            elem.addEventListener('click', () => handleModalCreation(elem));
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