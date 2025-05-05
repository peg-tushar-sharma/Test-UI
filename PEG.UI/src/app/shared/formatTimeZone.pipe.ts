import { Pipe,PipeTransform } from '@angular/core';
import { createUTCDate } from 'ngx-bootstrap/chronos/create/date-from-array';

@Pipe({
  name: 'formatTimeZone',
  pure: true
})
export class FormatTimeZone implements PipeTransform {
  transform(value: any, showTime: boolean = false) {
    //var offset = -5.0; /*add time diffrence in hours*/
    
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    //  let epoc = Date.parse(value);
    let currentTime=new Date(value);
    //  var utc = currentTime.getTime() + (currentTime.getTimezoneOffset() * 60000);  //This converts to UTC 00:00
    // var nd = new Date(utc + (3600000*offset));

    // currentTime.setMilliseconds(epoc)
    // currentTime.setHours(offset); /*add or delete time zone, currently showing EST time zone*/
    var dd;
    if (currentTime.getDate() < 10) {
      dd = '0' + currentTime.getDate().toString();
    } else {
      dd = currentTime.getDate();
    }
    let formatted_date = dd + "-" + (months[currentTime.getMonth()]) + "-" + currentTime.getFullYear()
    
    if(showTime == true)
    {
      formatted_date = formatted_date + ' ' + this.getFormattedValue(currentTime.getHours()) + ':' +this.getFormattedValue(currentTime.getMinutes()) ;
    }

    return formatted_date;
  }

  
 
  getFormattedValue(value :any)
  {
   let formattedvalue =   (value<10)?'0'+ value:value;
   return formattedvalue;
  }
  

}