export class AbstractView {
  title: string;

  constructor() {
    this.title = "RS Store - ";
  }

  setTitle(title: string) {
    document.title = this.title + title;
  }

  async getHtml() {
    return "";
  }
}