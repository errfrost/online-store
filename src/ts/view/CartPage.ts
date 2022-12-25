import { AbstractView } from './AbstractView';
import { QueryStringParams } from '../types/type';

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
                <span class="cart__title">PRODUCTS IN CART<span>
                <span class="cart__items">
                    ITEMS:
                    <b class="cart__items-counter">3</b>
                <span>
                <span class="cart__paginator">
                    PAGE:
                    <button class="button button_prev"><</button>
                    <b class="cart__paginator-page">1</b>
                    <button class="button button_next">></button>
                <span>
            </div>
            <ol class="cart__list">
                <li class="cart-item">
                    <img class="cart-item__img">
                    <div class="cart-item__info>
                        <span class="cart-item__info-title">
                            MacBook Pro
                        </span>
                        <hr>
                        <p class="cart-item__info-descr">
                            An apple mobile which is nothing like apple
                        </p>
                        <span class="cart-item__info-rating">
                            Rating: <b class="rating-count">4.57</b>
                        </span>
                        <span class="cart-item__info-rating">
                            Discount: <b class="rating-count">12.96%</b>
                        </span>
                    <div>

                    <div class="cart-item__count>
                        <span class="cart-item__stock">
                            Stock: <b class="stock=count">94</b>
                            <button class="button button_plus"><</button>
                            <b class="cart__paginator-page">1</b>
                            <button class="button button_minus">></button>
                            <span class="cart-item__total">1749$</span>
                        </span>
                    </div>
                </li>
            </ol>
        </div>

        <div class="summary">
            <div class="summary__topbar">
                <span class="summary__title">Summary<span>
            </div>
            <div class="summary__products">
                Products: <span class="summary__products-counter">6</span>
                Total: <span class="summary__products-counter">1749$</span>
                <input type="text" placeholder="Enter promo code">
                <button class="buy-btn">Buy now</button>
            </div>
        </div>
      </section>
    `;
    }
    async mounted() {
       
    }
}
