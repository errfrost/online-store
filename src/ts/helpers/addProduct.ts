import { IProductCard } from "../types/interface";
export function getProductId(event: Event): number | string {
    const target = event.target;
    if (target instanceof HTMLElement && target.hasAttribute('data-productid')) {
        addClassToCard(target);
        return Number(target.getAttribute('data-productid'));
    }
    return 'Product not found';
}

function addClassToCard(button:HTMLElement){
    const card = button.closest('.product-card')!;
        if(!card.classList.contains('in-cart')){
            button.textContent = 'Remove';
        } else{
            button.textContent = 'Add';
        }
        card.classList.toggle('in-cart');
}

export function cartSum(cartlist:IProductCard[]){
    const total = cartlist.reduce((acc, item) => acc += item.price,0);
    return total;
}