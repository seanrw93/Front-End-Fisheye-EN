function mediaFactory(data) {
    const { id, image, video, title, price, likes } = data;

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

    //Create fixed counter element
    function getTotalLikes() {
        const likesCounter = document.querySelectorAll('.likes-counter');
        const likesButton = document.querySelectorAll('.likes-button');

        function updateTotalLikes() {

            let totalCounter = 0;
            const totalLikes = Array.from(likesCounter).reduce((acc, like) => acc + parseInt(like.textContent), 0)

            totalCounter = Number(totalLikes)

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

        const counter = document.querySelector('.total-counter > span');

        //Initial total likes
        counter.textContent = updateTotalLikes();

        //Update total likes when a like button is clicked
        likesButton.forEach(button => {
            button.addEventListener('click', () => {
                counter.textContent = updateTotalLikes();
                counter.setAttribute('aria-label', `Total likes: ${counter.textContent}`);
            });
        });
    }

    function getMediaDOM() {
        const mediaDiv = document.querySelector(".media-section");
    
        const media = createMedia();
        mediaDiv.appendChild(media);
    
        const info = createInfo();
        mediaContainer.appendChild(info);
    
        // Create fixed counter
        const divCounter = getTotalLikes();
        const body = document.querySelector('body');
        body.appendChild(divCounter);
    
        return { mediaDiv, body };
    }
    

    return { image, video, title, likes, price, id, getMediaDOM }
}