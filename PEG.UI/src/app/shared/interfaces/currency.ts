export interface Currency{
    
    pegCurrencyId:number;
    searchableName:string;
    currencyCode:string;
    currencyName:string;
    decimalNo:number;
    serviceCode:string;
    roundingFactor:number;
    currencySymbol:string;
    symbolLocation:string;
    formatMask:string;
    decimalFormat:string;
    statusCode:boolean;
    lastUpdated:Date;
    lastUpdatedBy:string;
    priority:number;
}