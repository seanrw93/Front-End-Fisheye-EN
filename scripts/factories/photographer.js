export class PhotographerFactory {
    constructor(data) {

        if (!data) {
            throw new Error('Data is undefined');
        }

        const { id, portrait, name, country, city, tagline, price } = data;
        this.id = id;
        this.picture = `assets/photographers/Photographers_ID_Photos/${portrait}`;
        this.name = name;
        this.country = country
        this.city = city;
        this.tagline = tagline;
        this.price = price;
    }

    // Method to create the image element for a photographer
    createImg() {
        const img = document.createElement('img');
        img.setAttribute("src", this.picture);
        img.setAttribute("alt", this.name);
        img.classList.add("photographer-portrait");
        return img;
    }

    // Method to create the name element for a photographer
    createName() {
        const h2 = document.createElement('h2');
        h2.textContent = this.name;
        h2.classList.add("photographer-name");
        return h2;
    }

    // Method to create the location element for a photographer
    createLocation() {
        const h3 = document.createElement('h3');
        h3.textContent = `${this.city}, ${this.country}`;
        h3.classList.add("photographer-location");
        return h3;
    }

    // Method to create the tagline element for a photographer
    createTagline() {
        const pTagline = document.createElement('p');
        pTagline.textContent = this.tagline;
        pTagline.classList.add("photographer-tagline");
        return pTagline;
    }

    // Method to create the price element for a photographer
    createPrice() {
        const pPrice = document.createElement('p');
        pPrice.textContent = `$${this.price}/day`;
        pPrice.classList.add("photographer-price");
        return pPrice;
    }

    // Method to create the DOM structure for a photographer card 
    getUserCardDOM() {
        const article = document.createElement('article');
        article.setAttribute("role", "article");

        const link = document.createElement('a');
        link.setAttribute("href", `./photographer.html?id=${this.id}`);
        link.setAttribute("aria-label", `See ${this.name}'s portfolio`);

        const img = this.createImg();
        link.appendChild(img);
        article.appendChild(link);

        article.appendChild(this.createName());
        article.appendChild(this.createLocation());
        article.appendChild(this.createTagline());
        article.appendChild(this.createPrice());

        return article;
    }

    // Method to create the DOM structure for a photographer page
    getPhotographerPageDOM() {
        const title = document.querySelector("title");
        title.textContent = `FishEye - ${this.name}`;

        const divInfo = document.querySelector(".photographer-info");
        divInfo.appendChild(this.createName());
        divInfo.appendChild(this.createLocation());
        divInfo.appendChild(this.createTagline());

        const divPicture = document.querySelector(".photographer-picture");
        divPicture.appendChild(this.createImg());

        const spanPhotographerPrice = document.querySelector(".price-per-day");
        spanPhotographerPrice.textContent = `$${this.price}/day`;

        return { divInfo, divPicture, spanPhotographerPrice };
    }
}