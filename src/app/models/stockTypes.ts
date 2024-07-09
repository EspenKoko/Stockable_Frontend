import { StockCategory } from "./stockCategories"

export interface StockType {
    stockTypeId: number;
    stockTypeName: string;

    //fk
    stockCategoryId: number;
    stockCategory: StockCategory;
}