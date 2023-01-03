import { AbstractView } from './AbstractView';
import { QueryStringParams } from '../types/type';

export class Page404 extends AbstractView {
    constructor(params: QueryStringParams) {
        super(params);
        this.setTitle('404 Not Found');
    }

    async getHtml() {
        return `
      <h1>404 - Page not found</h1>
    `;
    }
    async mounted() {}
}
