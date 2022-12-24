import { AbstractView } from './AbstractView';
import { QueryStringParams } from '../types/type';

export class CartPage extends AbstractView {
    constructor(params: QueryStringParams) {
        super(params);
        this.setTitle('Cart');
    }

    async getHtml() {
        return `
      <h1>Cart</h1>
    `;
    }
}
