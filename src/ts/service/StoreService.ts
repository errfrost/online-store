export class ProductCard {
    constructor(
        public id: number,
        public title: string,
        public description: string,
        public price: number,
        public discountPercentage: number,
        public rating: number,
        public stock: number,
        public brand: string,
        public category: string,
        public thumbnail: string,
        public images: string[]
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.discountPercentage = discountPercentage;
        this.rating = rating;
        this.stock = stock;
        this.brand = brand;
        this.category = category;
        this.thumbnail = thumbnail;
        this.images = images;
    }

    generate() {
        return `
        <h3 class="product-card__title"">${this.title}</h3>
        <div class="product-card__thumbnail">
            <img src ="${this.thumbnail}" width="245" height="245">
        </div>
        <div class="product-card__body">
            <span class="product-card__price">${this.price}</span>
            <span class="product-card__category">${this.category}</span>
            <span class="product-card__brand">${this.brand}</span>
            <span class="product-card__rating">Rating: <b>${this.rating}</b></span>
            <button class="product-card__button">Add</button>
        </div>
        `
      }

    mount(parent: HTMLUListElement): void {
        const element:HTMLLIElement = document.createElement('li');
        element.classList.add('product-card');
        element.innerHTML = this.generate();

        parent.append(element);
    }
}
