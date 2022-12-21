import { AbstractView } from './AbstractView';
import { QueryStringParams } from '../types/type';

export class Home extends AbstractView {
    constructor(params: QueryStringParams) {
        super(params);
        this.setTitle('Home');
    }

    async getHtml() {
        return `
      <h1>Home</h1>
    `;
    }
}
