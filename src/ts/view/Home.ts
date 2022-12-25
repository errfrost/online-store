import { AbstractView } from './AbstractView';
import { QueryStringParams } from '../types/type';
import { ProductCard } from '../service/StoreService';
import { loadProducts, mount } from '../helpers/generate-cards';
import { getProductId } from '../helpers/addProduct';
import { IProducts } from '../types/interface';
import { search } from '../helpers/search';
import { Cart} from '../service/Cart';
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
            <aside class="sidebar"></aside>
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

    async prepareSearch() {
        let filterSearch: string = (document.querySelector('.product-search') as HTMLInputElement).value.toLowerCase();
        let filterSort: string = (document.querySelector('.product-sort') as HTMLSelectElement).value;
        const products = (await loadProducts()) as unknown as IProducts;
        search(products, filterSearch, filterSort);

        let url: string = window.location.href;
        if (filterSearch !== '') url = this.updateQueryStringParameter(url, 'search', filterSearch);
        if (filterSort !== '') url = this.updateQueryStringParameter(url, 'sort', filterSort);
        window.history.pushState({ path: url }, '', url);
    }

    async bindListeners() {
        document.querySelector('.product-search')?.addEventListener('keypress', async (e) => {
            if ((e as KeyboardEvent).key === 'Enter') {
                await this.prepareSearch();
            }
        });
        document.querySelector('.product-sort')?.addEventListener('change', async (e) => {
            await this.prepareSearch();
        });
    }

    async mounted() {
        const products = (await loadProducts()) as unknown as IProducts;
        let params = new URL(window.location.href).searchParams;
        let searchParam = params.has('search') ? params.get('search') : '';
        (document.querySelector('.product-search') as HTMLInputElement).value = searchParam as string;

        let sortParam = params.has('sort') ? params.get('sort') : '';
        (document.querySelector('.product-sort') as HTMLSelectElement).value = sortParam as string;

        search(products, searchParam!, sortParam!);
        this.bindListeners();

        document.addEventListener('click', (e) =>{
            const productId = getProductId(e);
            const currentProduct = products[productId]
            if(typeof productId === 'number'){
                shopCart.add(currentProduct);
            }
            cartTotal!.textContent = `${cartSum(shopCart.show())}$`;
            cartCounter!.textContent = `${shopCart.length()}`;
        })
    }
}

