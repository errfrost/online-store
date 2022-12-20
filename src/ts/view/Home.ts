import { AbstractView } from './AbstractView';
import { ProductCard } from '../service/StoreService';
import { loadProducts, mount } from '../helpers/generate-cards';
import { IProducts } from '../interfaces';
export class Home extends AbstractView {
    constructor() {
        super();
        this.setTitle('Home');
    }

    async getHtml() {
        return `
      <h1>Home</h1>
    `;
    }

    async mounted() {
        const products = (await loadProducts()) as unknown as IProducts;
        const page = document.querySelector('#main-content');
        for (let item in products) {
            const card = new ProductCard(products[item]);

            mount(page!, card);
        }
    }
}
