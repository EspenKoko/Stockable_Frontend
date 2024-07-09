import { City } from "./cities"

export interface Hub{
    hubId:number
    hubName:string
    qtyOnHand:number
    hubPrinterThreshold:number

    //fk
    cityId:number
    city:City
}