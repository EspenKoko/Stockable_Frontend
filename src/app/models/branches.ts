import { AssignedPrinter } from "./AssignedPrinters"
import { City } from "./cities"
import { Client } from "./clients"

export interface Branch {
    branchId: number
    branchName: string
    branchCode: string

    //fk
    assignedPrinterId: number
    assignedPrinter: AssignedPrinter

    //fk
    clientId: number
    client: Client

    //fk
    cityId: number
    city: City
}