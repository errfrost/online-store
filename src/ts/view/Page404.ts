import { AbstractView } from './AbstractView';

export class Page404 extends AbstractView {
    constructor() {
        super();
        this.setTitle('404 Not Found');
    }

    async getHtml() {
        return `
      <h1>404 - Page not found</h1>
    `;
    }
}
