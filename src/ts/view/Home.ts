import { AbstractView } from './AbstractView';
import { QueryStringParams } from '../types/type';
import { ProductCard } from '../service/StoreService';
import { loadProducts, mount } from '../helpers/generate-cards';
import { IProducts } from '../interfaces';


export class Home extends AbstractView {
    constructor(params: QueryStringParams) {
        super(params);
        this.setTitle('Home');
    }

    async getHtml() {
        return `
      <h1 class="main-title visually-hidden">Home</h1>
        <section class="products-wrapper">
            <aside class="sidebar"></aside>
            <ul class="products-list">
        </ul>
      </section>
    `;
    }

    async mounted() {
        const products = (await loadProducts()) as unknown as IProducts;
        const page = document.querySelector('.products-list');
        for (let item in products) {
            const card = new ProductCard(products[item]);

            mount(page!, card);
        }
    }
}
