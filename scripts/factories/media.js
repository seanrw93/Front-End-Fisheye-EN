export class MediaFactory {
    constructor(data) {
        if (!data) {
            throw new Error('Data is undefined');
        }

        const { id, image, video, title, price, likes } = data;
        this.id = id;
        this.image = image;
        this.video = video;
        this.title = title;
        this.price = price;
        this.likes = likes;

        // Create a new div for the media container
        this.mediaContainer = document.createElement('div');
        this.mediaContainer.classList.add('media-container');
    }

    // Method to toggle the like status of a media item
    toggleLike(e) {
        const likesCounter = e.currentTarget.nextElementSibling;
        let counter = Number(likesCounter.textContent);
        if (e.currentTarget.classList.contains('liked')) {
            e.currentTarget.classList.remove('liked');
            e.currentTarget.innerHTML = '<i class="far fa-heart"></i>';
            e.currentTarget.setAttribute("aria-label", `${this.title} unliked`);
            counter--;
        } else {
            e.currentTarget.classList.add('liked');
            e.currentTarget.innerHTML = '<i class="fas fa-heart"></i>';
            e.currentTarget.setAttribute("aria-label", `${this.title} liked`);
            counter++;
        }
        likesCounter.textContent = counter;
    }

    // Method to create the media element (image or video)
    createMedia() {
        let media;
        if (this.image) {
            media = document.createElement("img");
            media.setAttribute("src", `assets/photographers/Photographers_Photos/${this.image}`);
            media.classList.add("media-image");
        } else if (this.video) {
            media = document.createElement("video");
            media.setAttribute("src", `assets/photographers/Photographers_Photos/${this.video}`);
            media.classList.add("media-video");
            media.removeAttribute("controls");
        }

        media.setAttribute("alt", this.title);
        media.setAttribute("role", "link");
        media.setAttribute("tabindex", "0");
        media.classList.add("media-element");
        media.setAttribute('aria-label', `View ${this.title} image and media album modal`);
        media.id = this.id;

        this.mediaContainer.appendChild(media);
        return this.mediaContainer;
    }

    // Method to create the info element for a media item
    createInfo() {
        const info = document.createElement('div');
        info.classList.add('media-info');

        const div = document.createElement('div');
        div.setAttribute("role", "button");

        const mediaTitle = document.createElement('h2');
        mediaTitle.textContent = this.title;
        mediaTitle.classList.add('media-title');

        const mediaLikes = document.createElement('div');
        mediaLikes.classList.add('media-likes');

        const button = document.createElement('button');
        button.classList.add('likes-button');
        button.innerHTML = '<i class="far fa-heart"></i>';
        button.setAttribute('title', 'Like button');

        button.addEventListener('click', this.toggleLike.bind(this));

        mediaLikes.appendChild(button);

        const likesCount = document.createElement('span');
        likesCount.classList.add('likes-counter');
        likesCount.textContent = this.likes;
        likesCount.setAttribute('aria-live', 'polite');
        mediaLikes.appendChild(likesCount);

        div.appendChild(mediaTitle);
        info.appendChild(div);
        info.appendChild(mediaLikes);

        return info;
    }

    // Method to calculate the total number of likes
    getTotalLikes() {
        const likesCounter = document.querySelectorAll('.likes-counter');
        const likesButton = document.querySelectorAll('.likes-button');

        function updateTotalLikes() {
            let totalCounter = 0;
            const totalLikes = Array.from(likesCounter).reduce((acc, like) => acc + parseInt(like.textContent), 0);
            totalCounter = Number(totalLikes);

            likesButton.forEach(button => {
                button.onclick = () => {
                    likesCounter.forEach(like => {
                        if (like.classList.contains('liked')) {
                            totalCounter++;
                        } else {
                            totalCounter--;
                        }
                    });
                };
            });

            return totalCounter;
        }

        let counter = document.querySelector('.total-counter > span');

        counter.textContent = updateTotalLikes();

        likesButton.forEach(button => {
            button.addEventListener('click', () => {
                counter.textContent = updateTotalLikes();
                counter.setAttribute('aria-label', `Total likes: ${counter.textContent}`);
            });
        });
    }

    // Method to create the DOM structure for a media item
    getMediaDOM() {
        this.createMedia();
        const info = this.createInfo();
        this.mediaContainer.appendChild(info);
        this.getTotalLikes();
        return this.mediaContainer;
    }
}
