import { ProductCard } from '../service/StoreService';
import { IProducts } from '../types/interface';
import { mount } from './generate-cards';

export function search(searchText: string, products: IProducts) {
    const page = document.querySelector('.products-list');
    const results = document.querySelector('.products-count');
    page!.textContent = '';
    let resultsCount: number = 0;
    for (let item in products) {
        const card = new ProductCard(products[item]);
        if (
            card.product.title.toLowerCase().includes(searchText) ||
            card.product.description.toLowerCase().includes(searchText) ||
            card.product.price.toString().includes(searchText) ||
            card.product.rating.toString().includes(searchText) ||
            card.product.brand.toLowerCase().includes(searchText) ||
            card.product.category.toLowerCase().includes(searchText)
        ) {
            mount(page!, card);
            resultsCount++;
        }
    }
    results!.textContent = `${resultsCount} Results`;
}
