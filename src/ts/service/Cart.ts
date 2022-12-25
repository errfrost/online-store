import { IProductCard } from '../types/interface';

export class Cart {
    private counter = 0;
    cartList: IProductCard[];
    constructor() {
        this.cartList = [];
    }
    add(product: IProductCard) {
        for (let item in this.cartList) {
            if (this.cartList[item].id === product.id) {
                this.remove(product);
                return;
            }
        }
        this.cartList.push(product);
        this.counter++;
    }
    remove(product: IProductCard) {
        for (let item in this.cartList) {
            if (this.cartList[item].id === product.id) {
                const index = this.cartList.indexOf(product);
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
