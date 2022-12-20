import { ProductCard } from '../service/StoreService';
import { LoaderOption } from '../interfaces';

export function generateCard(card: ProductCard) {
    return `
        <h3 class="product-card__title"">${card.product.title}</h3>
        <div class="product-card__thumbnail">
            <img src ="${card.product.thumbnail}" width="245" height="245">
        </div>
        <div class="product-card__body">
            <span class="product-card__price">${card.product.price}$</span>
            <span class="product-card__category">${card.product.category}</span>
            <span class="product-card__brand">${card.product.brand}</span>
            <span class="product-card__rating">Rating: <b>${card.product.rating}</b></span>
            <button class="product-card__button">Add</button>
        </div>
        `;
}

export function mount(parent: Element, card: ProductCard): void {
    const element: HTMLLIElement = document.createElement('li');
    element.classList.add('product-card');
    element.innerHTML = generateCard(card);
    parent.append(element);
}

export async function loadProducts() {
    const res = await fetch(`data/products.json`);
    const data = (await res.json()) as LoaderOption;
    return data.products;
}
