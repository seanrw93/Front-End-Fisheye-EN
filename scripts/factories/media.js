function mediaFactory(data) {
    const { image, video } = data;

    function getImg() {
        const img = document.createElement( 'img' );
        img.setAttribute("src", `assets/photographers/Photographers_Photos/${image}`);
        img.setAttribute("alt", "Image");
        img.classList.add("media-image");
        return img;
    }

    function getVideo() {
        const vid = document.createElement( 'video' );
        vid.setAttribute("src", `assets/photographers/Photographers_Photos/${video}`);
        vid.setAttribute("controls", true);
        vid.classList.add("media-video");
        return vid;
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

        return { mediaDiv };
    }

    return { image, video, getMediaDOM }
}