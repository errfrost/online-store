import { ProductCard } from "../service/StoreService";

export function generateCard( card: ProductCard){
    return `
        <h3 class="product-card__title"">${card.title}</h3>
        <div class="product-card__thumbnail">
            <img src ="${card.thumbnail}" width="245" height="245">
        </div>
        <div class="product-card__body">
            <span class="product-card__price">${card.price}</span>
            <span class="product-card__category">${card.category}</span>
            <span class="product-card__brand">${card.brand}</span>
            <span class="product-card__rating">Rating: <b>${card.rating}</b></span>
            <button class="product-card__button">Add</button>
        </div>
        `
}