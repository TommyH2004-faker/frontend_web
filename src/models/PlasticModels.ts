import GenreModel from "./GenreModel";
import ImageModel from "./ImageModel";

class PlasticModels {
    id?: number;
    idPlasticItem: number;
    namePlasticItem?: string;
    manufacturer?: string;
    description?: string;
    listPrice: number;
    sellPrice: number;
    quantity?: number;
    avgRating?: number;
    soldQuantity?: number;
    discountPercent?: number;
    thumbnail?: string;
    idGenres?: number[];
    genresList?: GenreModel[];
    relatedImg?: string[];
    isFavorited?: boolean;
    images?: ImageModel[];

    constructor(
        idPlasticItem: number,
        namePlasticItem: string,
        manufacturer: string,
        description: string,
        listPrice: number,
        sellPrice: number,
        quantity: number,
        avgRating: number,
        soldQuantity: number,
        discountPercent: number,
        thumbnail: string
    ) {
        this.idPlasticItem = idPlasticItem;
        this.namePlasticItem = namePlasticItem;
        this.manufacturer = manufacturer;
        this.description = description;
        this.listPrice = listPrice;
        this.sellPrice = sellPrice;
        this.quantity = quantity;
        this.avgRating = avgRating;
        this.soldQuantity = soldQuantity;
        this.discountPercent = discountPercent;
        this.thumbnail = thumbnail;
    }
}

export default PlasticModels;
