import { AbstractView } from './AbstractView';
import { ProductCards } from '../service/StoreService';
export class Home extends AbstractView {
    constructor() {
        super();
        this.setTitle('Home');
    }

    async getHtml() {
        return `
      <h1>Home</h1>
    `;
    }
}
