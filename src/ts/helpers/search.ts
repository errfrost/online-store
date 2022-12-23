import { ProductCard } from '../service/StoreService';
import { IProducts, IProductCard } from '../types/interface';
import { mount } from './generate-cards';

function sortProducts(products: ProductCard[], sortString: string): ProductCard[] {
    if (sortString !== '') {
        let sortField: string = sortString.split('.')[0];
        let sortDirection: string = sortString.split('.')[1];
        products.sort((a, b) => {
            if (sortDirection === 'asc')
                return (a.product[sortField as keyof IProductCard] as number) - (b.product[sortField as keyof IProductCard] as number);
            else if (sortDirection === 'desc')
                return (b.product[sortField as keyof IProductCard] as number) - (a.product[sortField as keyof IProductCard] as number);
            return a.product.id - b.product.id;
        });
    }
    return products;
}

function searchProducts(products: ProductCard[], searchText: string): ProductCard[] {
    let finalProducts: ProductCard[] = [];
    for (let item in products) {
        const card = products[item];
        if (
            card.product.title.toLowerCase().includes(searchText) ||
            card.product.description.toLowerCase().includes(searchText) ||
            card.product.price.toString().includes(searchText) ||
            card.product.rating.toString().includes(searchText) ||
            card.product.brand.toLowerCase().includes(searchText) ||
            card.product.category.toLowerCase().includes(searchText)
        ) {
            finalProducts.push(card);
        }
    }
    return finalProducts;
}

export function search(products: IProducts, searchText: string, sortString: string) {
    const page = document.querySelector('.products-list');
    const results = document.querySelector('.products-count');
    page!.textContent = '';
    let resultsCount: number = 0;

    let finalProducts: ProductCard[] = [];
    for (let item in products) {
        const card = new ProductCard(products[item]);
        finalProducts.push(card);
    }

    finalProducts = sortProducts(finalProducts, sortString);
    finalProducts = searchProducts(finalProducts, searchText);

    for (let item in finalProducts) {
        const card = finalProducts[item];
        mount(page!, card);
        resultsCount++;
    }

    results!.textContent = `${resultsCount} Results`;
}
