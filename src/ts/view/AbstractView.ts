import { QueryStringParams } from '../types/type';

export class AbstractView {
    title: string;

    params: QueryStringParams = {};

    constructor(params: QueryStringParams) {
        if (params) {this.params = params;
        }
        this.title = 'RS Store - ';
    }

    setTitle(title: string) {
        document.title = this.title + title;
    }

    async getHtml() {
        return '';
    }
}
