import { AbstractView } from './AbstractView';
import { QueryStringParams } from '../types/type';
import { loadProducts, mount } from '../helpers/generate-cards';
import { getProductId } from '../helpers/addProduct';
import { IProducts } from '../types/interface';
import { ProductCard } from '../service/StoreService';
import { search } from '../helpers/search';
import { generateFilter, recalcFilters, filter } from '../helpers/filters';

import { Cart } from '../service/Cart';
const shopCart = new Cart();
const cartCounter = document.querySelector('.cart-counter');
const cartTotal = document.querySelector('.cart-total__price');
import { cartSum } from '../helpers/addProduct';
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
                            <input type="number" class="input-max" value="150" readonly>
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

        let filterCategory = Array.from(document.querySelectorAll('.filter-category-list .filter-check') as unknown as HTMLInputElement[]);
        filterCategory = filterCategory.filter((i) => i.checked === true);
        let filterCategoryValues = filterCategory.map((i) => i.id).join('|');
        url = this.updateQueryStringParameter(url, 'category', filterCategoryValues);

        let filterBrand = Array.from(document.querySelectorAll('.filter-brand-list .filter-check') as unknown as HTMLInputElement[]);
        filterBrand = filterBrand.filter((i) => i.checked === true);
        let filterBrandValues = filterBrand.map((i) => i.id).join('|');
        url = this.updateQueryStringParameter(url, 'brand', filterBrandValues);

        const priceInput = document.querySelectorAll(`.price-range .price-input input`) as unknown as HTMLInputElement[];
        let minprice = priceInput[0].value;
        let maxprice = priceInput[1].value;
        url = this.updateQueryStringParameter(url, 'minprice', minprice);
        url = this.updateQueryStringParameter(url, 'maxprice', maxprice);

        const stockInput = document.querySelectorAll(`.stock-range .price-input input`) as unknown as HTMLInputElement[];
        let minstock = stockInput[0].value;
        let maxstock = stockInput[1].value;
        url = this.updateQueryStringParameter(url, 'minstock', minstock);
        url = this.updateQueryStringParameter(url, 'maxstock', maxstock);

        url = this.updateQueryStringParameter(url, 'search', filterSearch);
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
        const products = (await loadProducts()) as unknown as IProducts;
        let productCards = this.convertToProductCard(products);
        generateFilter(productCards, 'category');
        generateFilter(productCards, 'brand');

        let params = new URL(window.location.href).searchParams;

        //restore 'search' from QS
        let searchParam = params.has('search') ? params.get('search') : '';
        (document.querySelector('.product-search') as HTMLInputElement).value = searchParam as string;

        //restore 'sort' from QS
        let sortParam = params.has('sort') ? params.get('sort') : '';
        (document.querySelector('.product-sort') as HTMLSelectElement).value = sortParam as string;

        //restore 'category' from QS
        let categoryParam = params.has('category') ? params.get('category') : '';
        if (categoryParam !== '') {
            let filterCategory = Array.from(
                document.querySelectorAll('.filter-category-list .filter-check') as unknown as HTMLInputElement[]
            );
            let filterCategoryValues = categoryParam!.split('|');
            filterCategory.forEach(element => {
                if (filterCategoryValues.includes(element.id)) element.checked = true;
            });
        }

        //restore 'brand' from QS
        let brandParam = params.has('brand') ? params.get('brand') : '';
        if (brandParam !== '') {
            let filterBrand = Array.from(
                document.querySelectorAll('.filter-brand-list .filter-check') as unknown as HTMLInputElement[]
            );
            let filterBrandValues = brandParam!.split('|');
            filterBrand.forEach(element => {
                if (filterBrandValues.includes(element.id)) element.checked = true;
            });
        }

        //restore min & max 'price' from QS
        const minpriceParam = params.has('minprice') ? params.get('minprice') : '';
        const maxpriceParam = params.has('maxprice') ? params.get('maxprice') : '';
        let priceInput = document.querySelectorAll(`.price-range .price-input input`) as unknown as HTMLInputElement[];
        let rangeInput = document.querySelectorAll(`.price-range .range-input input`) as unknown as HTMLInputElement[];
        let range = document.querySelector(`.price-range .slider .progress`) as HTMLDivElement;
        if (minpriceParam !== '') {
            priceInput[0].value = minpriceParam!.toString();
            rangeInput[0].value = minpriceParam!.toString();
            range!.style.left = (Number(minpriceParam!) / Number(rangeInput[0].max)) * 100 + '%';
        }
        if (maxpriceParam !== '') {
            priceInput[1].value = maxpriceParam!.toString();
            rangeInput[1].value = maxpriceParam!.toString();
            range!.style.right = 100 - (Number(maxpriceParam) / Number(rangeInput[1].max)) * 100 + '%';
        }

        //restore min & max 'in stock' from QS
        const minstockParam = params.has('minstock') ? params.get('minstock') : '';
        const maxstockParam = params.has('maxstock') ? params.get('maxstock') : '';
        priceInput = document.querySelectorAll(`.stock-range .price-input input`) as unknown as HTMLInputElement[];
        rangeInput = document.querySelectorAll(`.stock-range .range-input input`) as unknown as HTMLInputElement[];
        range = document.querySelector(`.stock-range .slider .progress`) as HTMLDivElement;
        if (minstockParam !== '') {
            priceInput[0].value = minstockParam!.toString();
            rangeInput[0].value = minstockParam!.toString();
            range!.style.left = (Number(minstockParam!) / Number(rangeInput[0].max)) * 100 + '%';
        }
        if (maxstockParam !== '') {
            priceInput[1].value = maxstockParam!.toString();
            rangeInput[1].value = maxstockParam!.toString();
            range!.style.right = 100 - (Number(maxstockParam) / Number(rangeInput[1].max)) * 100 + '%';
        }

        productCards = filter(productCards);
        productCards = search(productCards, searchParam!, sortParam!);
        recalcFilters(productCards, 'firstload');
        this.drawProductCards(productCards);
        this.bindListeners();

        cartTotal!.textContent = `${cartSum(products, shopCart.show())}$`; ///Нужно как-то иначе сделать чтобы не дублировалось  думаю кака то функця обновлния днных
        cartCounter!.textContent = `${shopCart.length()}`;

        document.addEventListener('click', (e) => {
            const target = e.target instanceof Element ? e.target : null;
            const productId = getProductId(e);
            const currentProduct = products[productId];
            if (typeof productId === 'number') {
                if (!target?.classList.contains('remove')) {
                    shopCart.remove(currentProduct, true);
                } else {
                    shopCart.add(currentProduct);
                }
            }
            console.log(shopCart.show());
            cartTotal!.textContent = `${cartSum(products, shopCart.show())}$`;
            cartCounter!.textContent = `${shopCart.length()}`;
            localStorage.setItem('cart', JSON.stringify(shopCart.show()));
        });
    }
}
