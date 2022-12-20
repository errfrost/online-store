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
