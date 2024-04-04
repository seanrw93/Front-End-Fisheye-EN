function mediaFactory(data) {
    const { id, image, video, title, likes } = data;

    const mediaContainer = document.createElement('div');
    mediaContainer.classList.add('media-container');
    mediaContainer.setAttribute('role', 'button');
    mediaContainer.setAttribute('aria-label', `View ${title} and media album modal`);


    // Function to toggle like button
    function toggleLike(e) {
        const likesCounter = e.currentTarget.nextElementSibling;
        let counter = Number(likesCounter.textContent);
        if (e.currentTarget.classList.contains('liked')) {
            e.currentTarget.classList.remove('liked');
            e.currentTarget.innerHTML = '<i class="far fa-heart"></i>';
            counter--;
        } else {
            e.currentTarget.classList.add('liked');
            e.currentTarget.innerHTML = '<i class="fas fa-heart"></i>';
            counter++;
        }
        likesCounter.textContent = counter;
    }

    function createImg() {
        const img = document.createElement( 'img' );
        img.setAttribute("src", `assets/photographers/Photographers_Photos/${image}`);
        img.setAttribute("alt", title);
        img.classList.add("media-image");
        img.id = id

        mediaContainer.appendChild(img);
        return mediaContainer;
    }

    function createVideo() {
        const vid = document.createElement( 'video' );
        vid.setAttribute("src", `assets/photographers/Photographers_Photos/${video}`);
        vid.setAttribute("alt", title);
        vid.removeAttribute("controls");
        vid.classList.add("media-video");
        vid.id = id

        mediaContainer.appendChild(vid);
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
        button.setAttribute('aria-label', 'Add/remove like');

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
        if (image) {
            const img = createImg();
            mediaDiv.appendChild(img);
        }

        if (video) {
            const video = createVideo();
            mediaDiv.appendChild(video);
        }

        const info = createInfo();
        mediaContainer.appendChild(info);

        return { mediaDiv };
    }

    return { image, video, title, likes, id, getMediaDOM }
}