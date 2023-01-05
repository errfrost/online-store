import { AbstractView } from './AbstractView';
import { QueryStringParams } from '../types/type';
import { Cart } from '../service/Cart';
import { generateCard, loadProducts } from '../helpers/generate-cards';
import { IProducts } from '../types/interface';
import { cartSum } from '../helpers/addProduct';
import { generateCartItem } from '../helpers/generateCartItem';

export class ProductPage extends AbstractView {
    productID: number;

    constructor(params: QueryStringParams) {
        super(params);
        this.setTitle('Product Details');
        this.productID = Number(this.params.type);
    }

    async getHtml() {
        return `
      <h1 class="main-title visually-hidden">Cart</h1>
      <div class="product-details">
          <div class="product-title">
              <div class="products-name">IPhone</div>
              <div class="breadcrumbs">Store > Smartphones > Apple > IPhone X</div>
          </div>
          <div class="product-main">
              <div class="product-images">
                <img src="" width="150" height="150">
              </div>
              <div class="product-image">
                <img src="" width="550" height="550">
              </div>
              <div class="product-desc">
                <h3 class="description-title">Description</h3>
                <p id="desc-description">SIM-Free, Model A19211 6.5-inch Super Retina HD display with OLED technology A12 Bionic chip with ...</p>
                <h3 class="description-title">Discount Percentage</h3>
                <p id="desc-discountPercentage">17.94</p>
                <h3 class="description-title">Rating</h3>
                <p id="desc-rating">4.44</p>
                <h3 class="description-title">In Stock</h3>
                <p id="desc-stock">34</p>
                <h3 class="description-title">Brand</h3>
                <p id="desc-brand">Apple</p>
                <h3 class="description-title">Category</h3>
                <p id="desc-category">smartphones</p>
                <h3 class="description-title">Price</h3>
                <p id="desc-price">899$</p>
                <div class="buy-utilities">
                    <button class="buy-button buy-cart">Add To Cart</button>
                    <button class="buy-button buy-now">Buy Now</button>
                </div>                
              </div>
          </div>
      </div>
    `;
    }

    async mounted() {}
}
