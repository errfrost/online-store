import { AbstractView } from '../view/AbstractView';
import { QueryStringParams } from './type';

export interface View {
    new (params: QueryStringParams): AbstractView;
}

export interface Router {
    path: string;
    view: View;
}

export interface RouterMatch {
    route: Router;
    result: RegExpMatchArray | null;
}

export interface IProductCard {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
}

export interface IProducts {
    [key: string]: IProductCard;
}

export interface LoaderOption {
    [key: string]: IProductCard[];
}

export interface IcartItem {
    id: number;
    count: number;
}
