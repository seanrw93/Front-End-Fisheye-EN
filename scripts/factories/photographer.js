function photographerFactory(data) {
    const { name, portrait, city, country, tagline, price } = data;

    const picture = `assets/photographers/photographers_ID_Photos/${portrait}`;

   //Create img element
    function getImg() {
        const img = document.createElement( 'img' );
        img.setAttribute("src", picture)
        img.setAttribute("alt", name)
        img.setAttribute("aria-label", `Portrait of ${name}`)
        img.classList.add("photographer-portrait")
        return img;
    }

    //Create name element
    function getName() {
        const h2 = document.createElement( 'h2' );
        h2.textContent = name;
        h2.classList.add("photographer-name")
        return h2;
    }

    //Create location element
    function getLocation() {
        const h3 = document.createElement( 'h3' );
        h3.textContent = `${city}, ${country}`;
        h3.classList.add("photographer-location")
        return h3;
    }

    //Create tagline element
    function getTagline() {
        const pTagline = document.createElement( 'p' );
        pTagline.textContent = tagline;
        pTagline.classList.add("photographer-tagline")
        return pTagline;
    }

    //Create price element
    function getPrice() {   
        const pPrice = document.createElement( 'p' );
        pPrice.textContent = `$${price}/day`;
        pPrice.classList.add("photographer-price")
        return pPrice;
    }

    function getUserCardDOM() {
        //Create article element
        const article = document.createElement( 'article' );
        article.setAttribute("role", "article")

        //create link element 
        const link = document.createElement( 'a' );
        link.setAttribute("href", `./photographer.html?id=${data.id}`)

        const img = getImg();

        //Append img to link
        link.appendChild(img)

        const h2 = getName();
        const h3 = getLocation();
        const pTagline = getTagline();
        const pPrice = getPrice();

        //Append elements to article
        article.appendChild(link);
        article.appendChild(h2);
        article.appendChild(h3);
        article.appendChild(pTagline);
        article.appendChild(pPrice);

        return (article);
    }

    function getPhotographerPageDOM() {
        const divInfo = document.querySelector(".photographer-info");

        const h2 = getName();
        const h3 = getLocation();
        const pTagline = getTagline();

        divInfo.appendChild(h2);
        divInfo.appendChild(h3);
        divInfo.appendChild(pTagline);

        const divPicture = document.querySelector(".photographer-picture");

        const img = getImg();
        divPicture.appendChild(img);

        return { divInfo, divPicture };

    }

    //Return object with properties
    return { name, picture, city, country, tagline, price, getUserCardDOM, getPhotographerPageDOM }
}

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
