function photographerFactory(data) {
    const { name, portrait, city, country, tagline, price } = data;

    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM() {
        //Create article element
        const article = document.createElement( 'article' );
        article.setAttribute("role", "article")

        //create link element 
        const link = document.createElement( 'a' );
        link.setAttribute("href", `./photographer.html?id=${data.id}`)

        //Create img element
        const img = document.createElement( 'img' );
        img.setAttribute("src", picture)
        img.setAttribute("alt", name)
        img.setAttribute("aria-label", `Portrait of ${name}`)

        //Append img to link
        link.appendChild(img)

        //Create name element
        const h2 = document.createElement( 'h2' );
        h2.textContent = name;

        //Create location element
        const h3 = document.createElement( 'h3' );
        h3.textContent = `${city}, ${country}`;

        //Create tagline element
        const pTagline = document.createElement( 'p' );
        pTagline.textContent = tagline;

        //Create price element
        const pPrice = document.createElement( 'p' );
        pPrice.textContent = `$${price}/day`;

        //Append elements to article
        article.appendChild(link);
        article.appendChild(h2);
        article.appendChild(h3);
        article.appendChild(pTagline);
        article.appendChild(pPrice);

        return (article);
    }

    //Return object with properties
    return { name, picture, city, country, tagline, price, getUserCardDOM }
}