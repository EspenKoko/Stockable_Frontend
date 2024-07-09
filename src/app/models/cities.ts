import { Province } from "./provinces"

export interface City {
    cityId: number,
    cityName: string,

    //fk
    provinceId: number;
    province: Province
}