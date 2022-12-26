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

function generateFilterLine(filterFieldValue: string, productsCount: number) {
    return `
        <div class="checkbox-line">
            <input type="checkbox" id="${filterFieldValue}" class="filter-check">
            <label for="${filterFieldValue}" class="filter-check-label">${filterFieldValue}</label>
        </div>
        <div class="checkbox-counter">(0/${productsCount})</div>
    `;
}

function mount(parent: Element, filterFieldValue: string, productsCount: number) {
    const element: HTMLElement = document.createElement('div');
    element.classList.add('filter-checkbox-line');
    element.innerHTML = generateFilterLine(filterFieldValue, productsCount);
    parent.append(element);
}

export function generateFilter(products: IProducts, filterField: string) {
    const page = document.querySelector('.filter-' + filterField);
    let filterFieldValues: string[] = getFilterFieldArray(products, filterField);
    for (let i in filterFieldValues) {
        const productsCount = getProductsCount(products, filterField, filterFieldValues[i]);
        mount(page!, filterFieldValues[i], productsCount);
    }
}
