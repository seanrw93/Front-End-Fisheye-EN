function photographerFactory(data) {
    const { name, portrait, city, country, tagline, price } = data;

    const picture = `assets/photographers/Photographers_ID_Photos/${portrait}`;

   //Create img element
    function createImg() {
        const img = document.createElement( 'img' );
        img.setAttribute("src", picture)
        img.setAttribute("alt", name)
        img.classList.add("photographer-portrait")
        return img;
    }

    //Create name element
    function createName() {
        const h2 = document.createElement( 'h2' );
        h2.textContent = name;
        h2.classList.add("photographer-name")
        return h2;
    }

    //Create location element
    function createLocation() {
        const h3 = document.createElement( 'h3' );
        h3.textContent = `${city}, ${country}`;
        h3.classList.add("photographer-location")
        return h3;
    }

    //Create tagline element
    function createTagline() {
        const pTagline = document.createElement( 'p' );
        pTagline.textContent = tagline;
        pTagline.classList.add("photographer-tagline")
        return pTagline;
    }

    //Create price element
    function createPrice() {   
        const pPrice = document.createElement( 'p' );
        pPrice.textContent = `$${price}/day`;
        pPrice.classList.add("photographer-price")
        return pPrice;
    }

    //Create fixed counter element
    function createFixedCounter() {
        const likesCounter = document.querySelectorAll('.likes-counter');
        const likesButton = document.querySelectorAll('.likes-button');

        function updateTotalLikes() {
            const totalLikes = Array.from(likesCounter).reduce((acc, like) => acc + parseInt(like.textContent), 0)

            let totalCounter = Number(totalLikes)

            likesButton.forEach(button => {
                button.addEventListener('click', () => {
                    likesCounter.forEach(like => {
                        if (like.classList.contains('liked')) {
                            totalCounter++;
                            
                        } else {
                            totalCounter--;      
                        }
                    });
                });
            });

            return totalCounter;
        }

        const container = document.createElement('div');
        container.classList.add('fixed-counter');
        container.setAttribute('role', 'contentinfo');

        const counterDiv = document.createElement('div');
        counterDiv.classList.add('total-counter');
        counterDiv.setAttribute('role', 'status'); 
        counterDiv.setAttribute('aria-live', 'polite');

        const counter = document.createElement('span');

        //Initial total likes
        counter.textContent = updateTotalLikes();

        //Update total likes when a like button is clicked
        likesButton.forEach(button => {
            button.addEventListener('click', () => {
                counter.textContent = updateTotalLikes();
                counter.setAttribute('aria-label', `Total likes: ${counter.textContent}`);
            });
        });
        counterDiv.appendChild(counter);

        const i = document.createElement('i');
        i.classList.add('fas', 'fa-heart');
        counterDiv.appendChild(i);

        const priceDiv = document.createElement('div');

        const pricePerDay = document.createElement('span');
        pricePerDay.textContent = `$${price}/day`;
        priceDiv.appendChild(pricePerDay);

        container.appendChild(counterDiv);
        container.appendChild(priceDiv);

        return container;
    }

    function getUserCardDOM() {
        //Create article element
        const article = document.createElement( 'article' );
        article.setAttribute("role", "article")

        //create link element 
        const link = document.createElement( 'a' );
        link.setAttribute("href", `./photographer.html?id=${data.id}`)

        const img = createImg();

        //Append img to link
        link.appendChild(img)

        const h2 = createName();
        const h3 = createLocation();
        const pTagline = createTagline();
        const pPrice = createPrice();

        //Append elements to article
        article.appendChild(link);
        article.appendChild(h2);
        article.appendChild(h3);
        article.appendChild(pTagline);
        article.appendChild(pPrice);

        return (article);
    }

    function getPhotographerPageDOM() {

        // Change title to photographer's name
        const title = document.querySelector("title");
        title.textContent = `Fisheye - ${name}`;

        // Create picture info elements
        const divInfo = document.querySelector(".photographer-info");

        const h2 = createName();
        const h3 = createLocation();
        const pTagline = createTagline();

        divInfo.appendChild(h2);
        divInfo.appendChild(h3);
        divInfo.appendChild(pTagline);

        const divPicture = document.querySelector(".photographer-picture");

        const img = createImg();
        divPicture.appendChild(img);

        //Create fixed counter
        const body = document.querySelector('body');

        const divCounter = createFixedCounter();
        body.appendChild(divCounter);

        return { divInfo, divPicture, body };
    }

    //Return object with properties
    return { name, picture, city, country, tagline, price, getUserCardDOM, getPhotographerPageDOM }
}