export class AbstractView {
    mounted() {
        throw new Error('Method not implemented.');
    }
    title: string;

    constructor() {
        this.title = 'RS Store - ';
    }

    setTitle(title: string) {
        document.title = this.title + title;
    }

    async getHtml() {
        return '';
    }
}
