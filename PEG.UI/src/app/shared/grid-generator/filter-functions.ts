import { GridValues } from './grid-constants';
import { FormatTimeZone } from '../../shared/formatTimeZone.pipe';
import * as moment from "moment";
export class FilterFunctions {
    public static _formatTimeZone=new FormatTimeZone();
    public static get dateComparator() {
        return (filterLocalDateAtMidnight: Date, cellValue: string) => {
            if (cellValue && filterLocalDateAtMidnight) {               
        
                let temcellvalue=moment.utc(cellValue).format('DD-MM-YYYY');;
            
                if (!temcellvalue) {
                    temcellvalue = GridValues.minimunDateValue;
                }
                let dateAsString = temcellvalue;
                let dateParts = dateAsString.split("-");              
                let cellDate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));
     
                if (cellDate < filterLocalDateAtMidnight) {
                    return -1;
                }
                else if (cellDate > filterLocalDateAtMidnight) {
                    return 1;
                }
                else {
                    return 0
                }
            }
        };
    }
}