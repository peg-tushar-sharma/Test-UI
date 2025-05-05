import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "getListItemValue",
    pure: true
})
export class GetListItemValue implements PipeTransform {
    constructor() {}

    transform(value: number, list, propertyKey, propertyName): string {
        if (list) {
            let obj = list.find((item) => item[propertyKey] == value);
            if (obj) {
                let val = obj[propertyName];
                return val;
            }
        } else {
            return "";
        }
    }
}
