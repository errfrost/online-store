import { AbstractView } from './AbstractView';
import { QueryStringParams } from '../types/type';
import { ProductCard } from '../service/StoreService';
import { loadProducts, mount } from '../helpers/generate-cards';
import { IProducts } from '../types/interface';
import { search } from '../helpers/search';

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
            <div class="products">
                <div class="products-utilities">
                    <div class="products-count">100 Results</div>
                    <div class="utilities">
                        <div class="sort-bar">
                            <span>Sort:</span>
                            <select class="product-sort">
                                <option value="1" selected="selected">Default</option>
                                <option value="2">Price ASC</option>
                                <option value="3">Price DESC</option>
                            </select>
                        </div>
                        <div class="search-bar">
                            <span>Search:</span>
                            <input type="search" class="product-search">
                        </div>

                        </div>
                </div>
                <ul class="products-list">
                </ul>
            </div>
      </section>
    `;
    }

    async bindListeners() {
        document.querySelector('.product-search')?.addEventListener('keypress', async (e) => {
            if ((e as KeyboardEvent).key === 'Enter') {
                const target = e.target as HTMLInputElement;
                const products = (await loadProducts()) as unknown as IProducts;
                search(target.value.toLowerCase(), products);
                if (window.history.pushState) {
                    var newurl =
                        window.location.protocol +
                        '//' +
                        window.location.host +
                        window.location.pathname +
                        '?search=' +
                        target.value.toLowerCase();
                    window.history.pushState({ path: newurl }, '', newurl);
                }
            }
        });
    }

    async mounted() {
        const products = (await loadProducts()) as unknown as IProducts;
        const page = document.querySelector('.products-list');
        const results = document.querySelector('.products-count');
        page!.textContent = '';
        let resultsCount: number = 0;
        for (let item in products) {
            const card = new ProductCard(products[item]);

            mount(page!, card);
            resultsCount++;
        }
        results!.textContent = `${resultsCount} Results`;
        this.bindListeners();
    }
}
