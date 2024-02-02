function mediaFactory(data) {
    const { image, video } = data;

    function getMediaDOM() {
        const mediaDiv = document.createElement( 'div' );
        div.classList.add("media");

        if (image) {
            const img = document.createElement( 'img' );
            img.setAttribute("src", `assets/photographers/Photographers_Photos/${image}`);
            img.setAttribute("alt", "Image");
            img.classList.add("media-image");
            div.appendChild(img);
        }

        if (video) {
            const video = document.createElement( 'video' );
            video.setAttribute("src", `assets/photographers/Photographers_Photos/${video}`);
            video.setAttribute("controls", true);
            video.classList.add("media-video");
            div.appendChild(video);
        }

        return mediaDiv;
    }

    return { image, video, getMediaDOM }
}