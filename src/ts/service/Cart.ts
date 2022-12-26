import { IProductCard } from '../types/interface';

export class Cart {
    private counter = 0;
    cartList: IProductCard['id'][];
    constructor() {
        const saved = JSON.parse(localStorage.getItem('cart')!) || null;
        this.cartList = saved || [];
        this.counter = saved.length || 0;
    }
    add(product: IProductCard) {
        for (let item in this.cartList) {
            if (this.cartList[item] === product.id) {
                this.remove(product);
                return;
            }
        }
        this.cartList.push(product.id);
        this.counter++;
    }
    remove(product: IProductCard) {
        for (let item in this.cartList) {
            if (this.cartList[item] === product.id) {
                const index = this.cartList.indexOf(product.id);
                this.cartList.splice(index, 1);
                this.counter--;
            }
        }
    }
    show() {
        return this.cartList;
    }
    clear() {
        this.cartList = [];
    }
    length() {
        return this.counter;
    }
}
