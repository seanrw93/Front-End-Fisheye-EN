function mediaFactory(data) {
    const { image, video, title, likes } = data;

    const mediaContainer = document.createElement('div');
    mediaContainer.classList.add('media-container');

    function getImg() {
        const img = document.createElement( 'img' );
        img.setAttribute("src", `assets/photographers/Photographers_Photos/${image}`);
        img.setAttribute("alt", "Image");
        img.classList.add("media-image");

        mediaContainer.appendChild(img);
        return mediaContainer;
    }

    function getVideo() {
        const vid = document.createElement( 'video' );
        vid.setAttribute("src", `assets/photographers/Photographers_Photos/${video}`);
        vid.setAttribute("controls", true);
        vid.classList.add("media-video");

        mediaContainer.appendChild(vid);
        return mediaContainer;
    }

    function getInfo() {
        const info = document.createElement('div');
        info.classList.add('media-info');

        const mediaTitle = document.createElement('h2');
        mediaTitle.textContent = title;
        mediaTitle.classList.add('media-title');

        const mediaLikes = document.createElement('p');
        mediaLikes.textContent = likes;
        mediaLikes.classList.add('media-likes');

        info.appendChild(mediaTitle);
        info.appendChild(mediaLikes);

        return info;
    }

    function getMediaDOM() {
        let mediaDiv = document.querySelector(".media-section");
        if (image) {
            const img = getImg();
            mediaDiv.appendChild(img);
        }

        if (video) {
            const video = getVideo();
            mediaDiv.appendChild(video);
        }

        const info = getInfo();
        mediaContainer.appendChild(info);

        return { mediaDiv };
    }

    return { image, video, title, likes, getMediaDOM }
}