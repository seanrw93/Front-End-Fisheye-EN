function mediaFactory(data) {
    const { id, image, video, title, likes } = data;

    const mediaContainer = document.createElement('div');
    mediaContainer.classList.add('media-container');


    // Function to toggle like button
    function toggleLike(e) {
        const likesCounter = e.currentTarget.nextElementSibling;
        let counter = Number(likesCounter.textContent);
        if (e.currentTarget.classList.contains('liked')) {
            e.currentTarget.classList.remove('liked');
            e.currentTarget.innerHTML = '<i class="far fa-heart"></i>';
            e.currentTarget.setAttribute("aria-label", `${title} unliked`)
            counter--;
        } else {
            e.currentTarget.classList.add('liked');
            e.currentTarget.innerHTML = '<i class="fas fa-heart"></i>';
            e.currentTarget.setAttribute("aria-label", `${title} liked`)
            counter++;
        }
        likesCounter.textContent = counter;
    }

    function createMedia() {
        let media;
        if (image) {
            media = document.createElement("img");
            media.setAttribute("src", `assets/photographers/Photographers_Photos/${image}`);
            media.classList.add("media-image");
        } else if (video) {
            media = document.createElement("video");
            media.setAttribute("src", `assets/photographers/Photographers_Photos/${video}`);
            media.classList.add("media-video");
            media.removeAttribute("controls");
        }
        
        media.setAttribute("alt", title);
        media.setAttribute("role", "link");
        media.setAttribute("tabindex", "0");
        media.classList.add("media-element");
        media.setAttribute('aria-label', `View ${title} image and media album modal`);
        media.id = id

        mediaContainer.appendChild(media);
        return mediaContainer;
    }

    function createInfo() {
        const info = document.createElement('div');
        info.classList.add('media-info');

        const div = document.createElement('div');
        div.setAttribute("role", "button");

        const mediaTitle = document.createElement('h2');
        mediaTitle.textContent = title;
        mediaTitle.classList.add('media-title');

        const mediaLikes = document.createElement('div');
        mediaLikes.classList.add('media-likes');

        const button = document.createElement('button');
        button.classList.add('likes-button');
        button.innerHTML = '<i class="far fa-heart"></i>';
        button.setAttribute('title', 'Like button');

        button.addEventListener('click', toggleLike);
        
        mediaLikes.appendChild(button);

        const likesCount = document.createElement('span');
        button.classList.add('likes-button');
        likesCount.classList.add('likes-counter');
        likesCount.textContent = likes;
        likesCount.setAttribute('aria-live', 'polite');
        mediaLikes.appendChild(likesCount);

        div.appendChild(mediaTitle);
        info.appendChild(div);
        info.appendChild(mediaLikes);

        return info;
    }

    function getMediaDOM() {
        let mediaDiv = document.querySelector(".media-section");

        const media = createMedia()
        mediaDiv.appendChild(media);

        const info = createInfo();
        mediaContainer.appendChild(info);

        return { mediaDiv };
    }

    return { image, video, title, likes, id, getMediaDOM }
}