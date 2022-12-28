import { AbstractView } from './AbstractView';
import { QueryStringParams } from '../types/type';
import { ProductCard } from '../service/StoreService';
import { loadProducts, mount } from '../helpers/generate-cards';
import { IProducts } from '../types/interface';
import { search } from '../helpers/search';
import { generateFilter, filter } from '../helpers/filters';

export class Home extends AbstractView {
    constructor(params: QueryStringParams) {
        super(params);
        this.setTitle('Home');
    }

    async getHtml() {
        return `
      <h1 class="main-title visually-hidden">Home</h1>
        <section class="products-wrapper">
            <aside class="sidebar">
                <div class="filter-utilities">
                    <button class="filter-button filter-reset">Reset Filters</button>
                    <button class="filter-button filter-copy">Copy Link</button>
                </div>
                <div class="filter-category">
                    <h3 class="filter-title">Category</h3>
                </div>
                <div class="filter-brand">
                    <h3 class="filter-title">Brand</h3>
                </div>
            </aside>
            <div class="products">
                <div class="products-utilities">
                    <div class="products-count">100 Results</div>
                    <div class="utilities">
                        <div class="sort-bar">
                            <span>Sort:</span>
                            <select class="product-sort">
                                <option value="" selected="selected">Default</option>
                                <option value="price.asc">Price ASC</option>
                                <option value="price.desc">Price DESC</option>
                                <option value="rating.asc">Rating ASC</option>
                                <option value="rating.desc">Rating DESC</option>
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

    updateQueryStringParameter(uri: string, key: string, value: string) {
        var re = new RegExp('([?&])' + key + '=.*?(&|$)', 'i');
        var separator = uri.indexOf('?') !== -1 ? '&' : '?';
        if (uri.match(re)) {
            return uri.replace(re, '$1' + key + '=' + value + '$2');
        } else {
            return uri + separator + key + '=' + value;
        }
    }

    convertToProductCard(products: IProducts): ProductCard[] {
        let productCards: ProductCard[] = [];
        for (let item in products) {
            const card = new ProductCard(products[item]);
            productCards.push(card);
        }
        return productCards;
    }

    drawProductCards(productCards: ProductCard[]) {
        const page = document.querySelector('.products-list');
        const results = document.querySelector('.products-count');
        page!.textContent = '';
        let resultsCount: number = 0;

        for (let item in productCards) {
            const card = productCards[item];
            mount(page!, card);
            resultsCount++;
        }

        results!.textContent = `${resultsCount} Results`;
    }

    async prepareSearch() {
        let filterSearch: string = (document.querySelector('.product-search') as HTMLInputElement).value.toLowerCase();
        let filterSort: string = (document.querySelector('.product-sort') as HTMLSelectElement).value;
        const products = (await loadProducts()) as unknown as IProducts;
        let productCards = this.convertToProductCard(products);
        productCards = filter(productCards);
        productCards = search(productCards, filterSearch, filterSort);
        this.drawProductCards(productCards);

        let url: string = window.location.href;
        if (filterSearch !== '') url = this.updateQueryStringParameter(url, 'search', filterSearch);
        if (filterSort !== '') url = this.updateQueryStringParameter(url, 'sort', filterSort);
        window.history.pushState({ path: url }, '', url);
    }

    async bindListeners() {
        document.querySelector('.product-search')?.addEventListener('search', async (e) => {
            await this.prepareSearch();
        });
        document.querySelector('.product-sort')?.addEventListener('change', async (e) => {
            await this.prepareSearch();
        });

        const filters = Array.from(document.querySelectorAll('input[type=checkbox]')) as Array<HTMLInputElement>;
        filters.forEach((f: Element) => {
            f.addEventListener('change', async (e) => {
                await this.prepareSearch();
            });
        });
    }

    async mounted() {
        let params = new URL(window.location.href).searchParams;
        let searchParam = params.has('search') ? params.get('search') : '';
        (document.querySelector('.product-search') as HTMLInputElement).value = searchParam as string;
        let sortParam = params.has('sort') ? params.get('sort') : '';
        (document.querySelector('.product-sort') as HTMLSelectElement).value = sortParam as string;

        const products = (await loadProducts()) as unknown as IProducts;
        let productCards = this.convertToProductCard(products);
        generateFilter(products, 'category');
        generateFilter(products, 'brand');
        productCards = search(productCards, searchParam!, sortParam!);
        this.drawProductCards(productCards);
        this.bindListeners();
    }
}
