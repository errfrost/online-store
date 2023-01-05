import { AbstractView } from './AbstractView';
import { QueryStringParams } from '../types/type';
import { Cart } from '../service/Cart';
import { generateCard, loadProducts } from '../helpers/generate-cards';
import { IProducts, Promocodes } from '../types/interface';
import { cartSum } from '../helpers/addProduct';
import { generateCartItem } from '../helpers/generateCartItem';
import { getPromocode, loadPromocodes } from '../helpers/promocode';

export class CartPage extends AbstractView {
    constructor(params: QueryStringParams) {
        super(params);
        this.setTitle('Cart');
    }

    async getHtml() {
        return `
      <h1 class="main-title visually-hidden">Cart</h1>
      <section class="cart-section">
        <div class="cart">
            <div class="cart__topbar">
                <span class="cart__title">PRODUCTS IN CART</span>
                <span class="cart__items">
                    ITEMS:
                    <b class="cart__items-counter">3</b>
                </span>
                <span class="cart__paginator">
                    PAGE:
                    <button class="button button_prev"><</button>
                    <b class="cart__paginator-page">1</b>
                    <button class="button button_next">></button>
                </span>
            </div>
            <ol class="cart__list">
                
            </ol>
        </div>

        <div class="summary">
            <div class="summary__topbar">
                <span class="summary__title">Summary<span>
            </div>
            <div class="summary__products">
                <div class="summary__products-title">
                    Products: <span class="summary__products-counter">1</span>
                </div>
                <div class="summary__products-title">
                    Total: <span class="summary__products-price">500$</span>
                </div>
                
                <div class="summary__promocodes">
                    <div class="summary__promocodes-title">Applied codes</div>
                    <div class="summary__promocodes-item">Rolling Scopes School 10%<button>DROP</button></div>
                </div>
                <input class="summary__products-promocode" type="search" placeholder="Enter promo code">
                <button class="buy-btn">Buy now</button>
            </div>
        </div>
      </section>
    `;
    }
    async mounted() {
        const products = (await loadProducts()) as unknown as IProducts;
        const cartCounter = document.querySelector('.cart-counter');
        const cartTotal = document.querySelector('.cart-total__price');
        const cartList = document.querySelector('.cart__list');
        const summaryCounter = document.querySelector('.summary__products-counter');
        const summaryPrice = document.querySelector('.summary__products-price');
        const promocodeInput = document.querySelector('.summary__products-promocode');
        const promocodeBlock = document.querySelector('.summary__promocodes');
        const promocodesList: Promocodes[] = await loadPromocodes();
        const activePromocodes: Promocodes[] = [];
        const shopCart = new Cart();
        cartTotal!.textContent = `${cartSum(products, shopCart.show())}$`;
        summaryPrice!.textContent = `${cartSum(products, shopCart.show())}$`;
        ///Нужно как-то иначе сделать чтобы не дублировалось  думаю кака то функця обновлния днных
        cartCounter!.textContent = `${shopCart.length()}`;
        summaryCounter!.textContent = `${shopCart.length()}`;
        for (let key of shopCart.show()) {
            const item = generateCartItem(products[key.id], key.count);
            cartList!.insertAdjacentHTML('beforeend', item);
        }

        document.addEventListener('click', (event) => {
            const target = event.target;
            if (target instanceof Element && target.classList.contains('button')) {
                if (target.parentElement?.classList.contains('stock-buttons-wrapper')) {
                    const cartItem = target.closest('.cart-item');
                    const cartItemId = Number(cartItem?.getAttribute('data-productid'));
                    const counter = target.parentElement.querySelector('.cart__paginator-item')!;
                    if (target.classList.contains('button_plus')) {
                        shopCart.add(products[cartItemId]);
                        counter.textContent = (Number(counter.textContent!) + 1).toString();
                    } else if (target.classList.contains('button_minus')) {
                        counter.textContent = (Number(counter.textContent!) - 1).toString();
                        shopCart.remove(products[cartItemId]);
                    }
                }
            }

            cartList!.innerHTML = '';
            for (let key of shopCart.show()) {
                const item = generateCartItem(products[key.id], key.count);
                cartList!.insertAdjacentHTML('beforeend', item);
            }
            cartTotal!.textContent = `${cartSum(products, shopCart.show())}$`;
            ///Нужно как-то иначе сделать чтобы не дублировалось  думаю кака то функця обновлния днных
            cartCounter!.textContent = `${shopCart.length()}`;
            summaryCounter!.textContent = `${shopCart.length()}`;
            summaryPrice!.textContent = `${cartSum(products, shopCart.show())}$`;
            localStorage.setItem('cart', JSON.stringify(shopCart.show()));
        });
        promocodeInput!.addEventListener('search', async (event) => {
            let target = event.target as HTMLInputElement;
            let isPromocode = await getPromocode(target.value, activePromocodes);
            console.log(activePromocodes);
            if (isPromocode) {
                activePromocodes.push(isPromocode);
                console.log(activePromocodes);
                const newCode = `<div class="summary__promocodes-item">Rolling Scopes School 10%<button>DROP</button></div>`;
            }
        });
    }
}
