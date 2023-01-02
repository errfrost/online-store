import { ProductCard } from '../service/StoreService';
import { IProducts, IProductCard } from '../types/interface';

function getFilterFieldArray(products: IProducts, filterField: string) {
    let filterFieldValues: string[] = [];
    for (let item in products) {
        const filterFieldValue = products[item][filterField as keyof IProductCard] as string;
        if (!filterFieldValues.includes(filterFieldValue)) filterFieldValues.push(filterFieldValue);
    }
    return filterFieldValues;
}

function getProductsCount(products: IProducts, filterField: string, filterFieldValue: string) {
    let counter: number = 0;
    for (let item in products) {
        const card = products[item];
        if (filterFieldValue === card[filterField as keyof IProductCard]) counter++;
    }
    return counter;
}

function generateFilterLine(filterFieldValue: string, productsCount: number, filterField: string) {
    return `
        <div class="checkbox-line">
            <input type="checkbox" id="${filterFieldValue}" class="filter-check" data-filterfield="${filterField}">
            <label for="${filterFieldValue}" class="filter-check-label">${filterFieldValue}</label>
        </div>
        <div class="checkbox-counter">(0/${productsCount})</div>
    `;
}

function mount(parent: Element, filterFieldValue: string, productsCount: number, filterField: string) {
    const element: HTMLElement = document.createElement('div');
    element.classList.add('filter-checkbox-line');
    element.innerHTML = generateFilterLine(filterFieldValue, productsCount, filterField);
    parent.append(element);
}

export function generateFilter(products: IProducts, filterField: string) {
    const page = document.querySelector('.filter-' + filterField);
    let filterFieldValues: string[] = getFilterFieldArray(products, filterField);
    for (let i in filterFieldValues) {
        const productsCount = getProductsCount(products, filterField, filterFieldValues[i]);
        mount(page!, filterFieldValues[i], productsCount, filterField);
    }
}

export function filter(productCards: ProductCard[]): ProductCard[] {
    let filters = Array.from(document.querySelectorAll('input[type=checkbox]')) as Array<HTMLInputElement>;
    filters = filters.filter((i) => i.checked);
    const filterCategory = filters.filter((i) => i.getAttribute('data-filterfield') === 'category');
    const filterBrand = filters.filter((i) => i.getAttribute('data-filterfield') === 'brand');
    const filterCategoryStrings = filterCategory.map((i) => i.getAttribute('id'));
    const filterBrandStrings = filterBrand.map((i) => i.getAttribute('id'));
    const filterPrice = document.querySelectorAll('.price-range .range-input input') as unknown as HTMLInputElement[];
    const filterStock = document.querySelectorAll('.stock-range .range-input input') as unknown as HTMLInputElement[];

    if (filterCategoryStrings.length > 0) productCards = productCards.filter((i) => filterCategoryStrings.includes(i.product.category));
    if (filterBrandStrings.length > 0) productCards = productCards.filter((i) => filterBrandStrings.includes(i.product.brand));
    productCards = productCards.filter((i) => (i.product.price > Number(filterPrice[0].value) && i.product.price < Number(filterPrice[1].value)));
    productCards = productCards.filter((i) => (i.product.stock > Number(filterStock[0].value) && i.product.stock < Number(filterStock[1].value)));

    return productCards;
}
