export class MediaFactory {
    constructor(data) {
        if (!data) {
            throw new Error("Data is undefined");
        }

        const { id, image, video, title, price, likes } = data;
        this.id = id;
        this.image = image;
        this.video = video;
        this.title = title;
        this.price = price;
        this.likes = likes;

        // Create a new div for the media container
        this.mediaContainer = document.createElement("div");
        this.mediaContainer.classList.add("media-container");
    }

    // Method to toggle the like status of a media item
    toggleLike(e) {
        const button = e.currentTarget;
        const likesCounter = button.nextElementSibling;
        let counter = Number(likesCounter.textContent);
        let totalCounter = document.querySelector(".total-counter > span");
        let totalLikes = Number(totalCounter.textContent);

        // Toggle the like status of the media item
        if (button.classList.contains("liked")) {
            button.classList.remove("liked");
            button.innerHTML = "<i class='far fa-heart'></i>";
            button.setAttribute("aria-label", `Status : unliked`);
            counter--;
            totalLikes--;
        } else {
            button.classList.add("liked");
            button.innerHTML = "<i class='fas fa-heart'></i>";
            button.setAttribute("aria-label", `Status : liked`);
            counter++;
            totalLikes++;
        }

        // Update the two like counters
        likesCounter.textContent = counter;
        totalCounter.textContent = totalLikes;
        totalCounter.setAttribute("aria-live", "off")
    }

    // Method to create the media element (image or video)
    createMedia() {
        let media;
        if (this.image) {
            media = document.createElement("img");
            media.setAttribute("src", `assets/photographers/Photographers_Photos/${this.image}`);
            media.classList.add("media-image");
            media.setAttribute("alt", this.title);
        } else if (this.video) {
            media = document.createElement("video");
            media.setAttribute("src", `assets/photographers/Photographers_Photos/${this.video}`);
            media.classList.add("media-video");
            media.removeAttribute("controls");
        }

        media.setAttribute("tabindex", "0");
        media.classList.add("media-element");
        media.setAttribute("aria-label", `View ${this.title} image and media album modal`);
        media.id = this.id;

        this.mediaContainer.appendChild(media);
        return this.mediaContainer;
    }

    // Method to create the info element for a media item
    createInfo() {
        // Create a div element to contain the media info
        const info = document.createElement("div");
        info.classList.add("media-info");

        // Create a div element to contain the media title
        const div = document.createElement("div");
        div.setAttribute("role", "button");

        // Create a h2 element to display the media title
        const mediaTitle = document.createElement("h2");
        mediaTitle.textContent = this.title;
        mediaTitle.classList.add("media-title");

        // Create a div element to contain the like button and counter
        const mediaLikes = document.createElement("div");
        mediaLikes.classList.add("media-likes");

        // Create a button element to like a media item
        const button = document.createElement("button");
        button.classList.add("likes-button");
        button.innerHTML = "<i class='far fa-heart'></i>";
        button.setAttribute("title", "Like button");

        // Add event listener to the like button
        button.addEventListener("click", (e) => {
            this.toggleLike(e);
        });

        mediaLikes.appendChild(button);

        // Create a span element to display the number of likes
        const likesCount = document.createElement("span");
        likesCount.classList.add("likes-counter");
        likesCount.textContent = this.likes;
        likesCount.setAttribute("aria-live", "polite");
        mediaLikes.appendChild(likesCount);

        div.appendChild(mediaTitle);
        info.appendChild(div);
        info.appendChild(mediaLikes);

        return info;
    }


    // Method to create the DOM structure for a media item
    getMediaDOM() {
        this.createMedia();
        const info = this.createInfo();
        this.mediaContainer.appendChild(info);
        return this.mediaContainer;
    }
}

//Class MediaFactory END

// Function to update aria status based on dialog presence
function updateAriaStatus() {
    const likesCounters = document.querySelectorAll(".likes-counter");
    likesCounters.forEach((counter) => {
        if (document.querySelector("dialog[open]") !== null) {
            counter.setAttribute("aria-hidden", "true");
            counter.setAttribute("aria-live", "off");
            
        } else if (document.querySelector("dialog[open]") === null){
            counter.setAttribute("aria-hidden", "false");
            counter.setAttribute("aria-live", "polite");
        }
    });
}

// Function to be called when dialogs are opened or closed
function handleDialogStateChange() {
    updateAriaStatus();
}

// Observe changes in the document to detect dialog state changes
const observer = new MutationObserver(handleDialogStateChange);
observer.observe(document.body, { childList: true, subtree: true });
