import { AbstractView } from './AbstractView';
import { QueryStringParams } from '../types/type';
import { ProductCard } from '../service/StoreService';
import { loadProducts, mount } from '../helpers/generate-cards';
import { IProducts } from '../types/interface';
import { search } from '../helpers/search';
import { generateFilter, recalcFilters, filter } from '../helpers/filters';

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
                    <div class="filter-category-list">
                    </div>
                </div>
                <div class="filter-brand">
                    <h3 class="filter-title">Brand</h3>
                    <div class="filter-brand-list">
                    </div>
                </div>
                <div class="filter-price">
                    <h3 class="filter-title">Price</h3>
                    <div class="price-range">
                        <div class="price-input">
                          <div class="field">
                            <input type="number" class="input-min" value="10" readonly>
                          </div>
                          <div class="field">
                            <input type="number" class="input-max" value="1749" readonly>
                          </div>
                        </div>
                        <div class="slider">
                          <div class="progress"></div>
                        </div>
                        <div class="range-input">
                          <input type="range" class="range-min" min="10" max="1749" value="10" step="1">
                          <input type="range" class="range-max" min="10" max="1749" value="1749" step="1">
                        </div>
                  </div>                    
                </div>
                <div class="filter-stock">
                    <h3 class="filter-title">In Stock</h3>
                    <div class="stock-range">
                        <div class="price-input">
                          <div class="field">
                            <input type="number" class="input-min" value="2" readonly>
                          </div>
                          <div class="field">
                            <input type="number" class="input-max" value="96" readonly>
                          </div>
                        </div>
                        <div class="slider">
                          <div class="progress"></div>
                        </div>
                        <div class="range-input">
                          <input type="range" class="range-min" min="2" max="150" value="2" step="1">
                          <input type="range" class="range-max" min="2" max="150" value="150" step="1">
                        </div>
                  </div>                    
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

    async prepareSearch(caller: string) {
        let filterSearch: string = (document.querySelector('.product-search') as HTMLInputElement).value.toLowerCase();
        let filterSort: string = (document.querySelector('.product-sort') as HTMLSelectElement).value;
        const products = (await loadProducts()) as unknown as IProducts;
        let productCards = this.convertToProductCard(products);
        productCards = filter(productCards);
        productCards = search(productCards, filterSearch, filterSort);
        recalcFilters(productCards, caller);
        this.drawProductCards(productCards);

        let url: string = window.location.href;
        if (filterSearch !== '') url = this.updateQueryStringParameter(url, 'search', filterSearch);
        if (filterSort !== '') url = this.updateQueryStringParameter(url, 'sort', filterSort);
        window.history.pushState({ path: url }, '', url);
    }

    sliderListener(slider: string) {
        const sliderClass = `.${slider}-range`;
        const rangeInput = document.querySelectorAll(`${sliderClass} .range-input input`) as unknown as HTMLInputElement[];
        const priceInput = document.querySelectorAll(`${sliderClass} .price-input input`) as unknown as HTMLInputElement[];
        const range = document.querySelector(`${sliderClass} .slider .progress`) as HTMLDivElement;
        rangeInput.forEach((input) => {
            input.addEventListener('input', async (e) => {
                let priceGap = 10;
                let minVal = parseInt(rangeInput[0].value);
                let maxVal = parseInt(rangeInput[1].value);

                if (maxVal - minVal < priceGap) {
                    if ((<HTMLInputElement>e.target)!.className === 'range-min') {
                        rangeInput[0].value = (maxVal - priceGap).toString();
                    } else {
                        rangeInput[1].value = (minVal + priceGap).toString();
                    }
                } else {
                    priceInput[0].value = minVal.toString();
                    priceInput[1].value = maxVal.toString();
                    range!.style.left = (minVal / Number(rangeInput[0].max)) * 100 + '%';
                    range!.style.right = 100 - (maxVal / Number(rangeInput[1].max)) * 100 + '%';
                }
                await this.prepareSearch('slider');
            });
        });
    }

    async bindListeners() {
        document.querySelector('.product-search')?.addEventListener('search', async (e) => {
            await this.prepareSearch('search');
        });
        document.querySelector('.product-sort')?.addEventListener('change', async (e) => {
            await this.prepareSearch('sort');
        });

        const filters = Array.from(document.querySelectorAll('input[type=checkbox]')) as Array<HTMLInputElement>;
        filters.forEach((f: Element) => {
            f.addEventListener('change', async (e) => {
                await this.prepareSearch('checkbox');
            });
        });

        this.sliderListener('price');
        this.sliderListener('stock');
    }

    async mounted() {
        let params = new URL(window.location.href).searchParams;
        let searchParam = params.has('search') ? params.get('search') : '';
        (document.querySelector('.product-search') as HTMLInputElement).value = searchParam as string;
        let sortParam = params.has('sort') ? params.get('sort') : '';
        (document.querySelector('.product-sort') as HTMLSelectElement).value = sortParam as string;

        const products = (await loadProducts()) as unknown as IProducts;
        let productCards = this.convertToProductCard(products);
        generateFilter(productCards, 'category');
        generateFilter(productCards, 'brand');
        productCards = search(productCards, searchParam!, sortParam!);
        recalcFilters(productCards, '');
        this.drawProductCards(productCards);
        this.bindListeners();
    }
}
