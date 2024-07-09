import { Injectable } from '@angular/core';
import { Markup } from '../models/markup';
import { Vat } from '../models/vat';
import { firstValueFrom, of } from 'rxjs';
import { MarkupService } from './markup.service';
import { VatService } from './vat.service';
import { LabourRateService } from './labour-rate.service';
import { LabourRate } from '../models/labourRate';

@Injectable({
    providedIn: 'root'
})
export class GeneralServices {
    private stringCounter: number = 0;
    private digitsCounter: number = 0;
    public notFound: boolean = true;

    constructor(private vatService: VatService,
        private markupService: MarkupService,
        private labourRateService: LabourRateService,) {
    }

    // convert to base64
    public getImageAsBase64(url: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'blob';

            xhr.onload = () => {
                if (xhr.status === 200) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve(reader.result as string);
                    };
                    reader.readAsDataURL(xhr.response);
                } else {
                    reject('Failed to load image');
                }
            };
            xhr.send();
        });
    }

    //get todays date and timestamp
    public getDate() {
        // Date object
        const date = new Date();
        let currentDay = String(date.getDate()).padStart(2, '0');
        let currentMonth = String(date.getMonth() + 1).padStart(2, '0');
        let currentYear = date.getFullYear();
        // let currentTime = date.getTime();

        // we will display the date as DD-MM-YYYY
        let currentDate = `${currentDay}-${currentMonth}-${currentYear}`; //-${currentTime}`;
        return currentDate;
    }

    // the follwing could be in their respective services...
    //get vat for calculations
    public async getVat(): Promise<Vat> {
        const result = await firstValueFrom(this.vatService.getVats())
        let VAT
        //gets the most recent markup amount
        if (result.length > 0) {
            const mostRecentVat = result[result.length - 1];
            VAT = mostRecentVat;
        }
        return VAT
    }

    // get markup for calculations
    public async getMarkup(): Promise<Markup> {
        const result = await firstValueFrom(this.markupService.getMarkups())
        let markup
        //gets the most recent markup amount
        if (result.length > 0) {
            const mostRecentMarkup = result[result.length - 1];
            markup = mostRecentMarkup;
        }
        return markup
    }

    // get labour rate for calculations
    public async getLabourRate(): Promise<LabourRate> {
        const result = await firstValueFrom(this.labourRateService.getLabourRates())
        let labourRate
        //gets the most recent markup amount
        if (result.length > 0) {
            const mostRecentLabourRate = result[result.length - 1];
            labourRate = mostRecentLabourRate;
        }
        return labourRate
    }

    // randomly generate random string for purchaser order, supplier/stock order and client order
    public generateId(): string {
        const prefix = this.generateRandomString(2);
        this.stringCounter++;

        const suffix = this.generateRandomNumber(3).toString().padStart(3, '0'); // Generate 3 random numbers
        this.digitsCounter++;

        return `${prefix}${suffix}`;
    }

    private generateRandomString(length: number): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    private generateRandomNumber(length: number): number {
        const min = Math.pow(10, length - 1);
        const max = Math.pow(10, length) - 1;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // handle reporting 404 errors
    public handleOrdersError(error: any) {
        if (error.status === 404) {
            this.notFound = true;
        } else {
            console.error("Error loading data:", error);
        }
        return of([]); // Return an empty array to continue with the rest of the logic
    }

    // used for reading formdata which is used in user-account.component and the pdf-helo-doc.component
    public formDataToPlainObject(formData: FormData): any {
        console.log(formData);
        const obj: any = {};
        formData.forEach((value, key) => {
            obj[key] = value;
        });
        console.log(obj);
        return obj;
    }
}