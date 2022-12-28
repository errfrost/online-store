import { AbstractView } from './AbstractView';
import { QueryStringParams } from '../types/type';
import { Cart } from '../service/Cart';
import { generateCard, loadProducts } from '../helpers/generate-cards';
import { IProducts } from '../types/interface';
import { cartSum } from '../helpers/addProduct';
import { generateCartItem } from '../helpers/generateCartItem';

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
                <input class="summary__products-promocode" type="text" placeholder="Enter promo code">
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
        const shopCart = new Cart();
        cartTotal!.textContent = `${cartSum(products, shopCart.show())}$`; ///Нужно как-то иначе сделать чтобы не дублировалось  думаю кака то функця обновлния днных
        cartCounter!.textContent = `${shopCart.length()}`;
        
        for(let key of  shopCart.show()){
          const item =   generateCartItem(products[key]);
          cartList!.insertAdjacentHTML('beforeend',item);
        }
}
}