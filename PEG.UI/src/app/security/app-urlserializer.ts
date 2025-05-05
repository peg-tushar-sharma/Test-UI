import { DefaultUrlSerializer, UrlTree } from '@angular/router';
import { Injectable } from "@angular/core";


 @Injectable()
export class LowerCaseUrlSerializer extends DefaultUrlSerializer {
   parse(url: string): UrlTree {
       let urlToNavigate =url.toLowerCase();
       if(urlToNavigate.indexOf('#')>0)
       {
        urlToNavigate = urlToNavigate.replace('#','');
       }
       if(urlToNavigate.indexOf('peg/')>0)
       {
        urlToNavigate = urlToNavigate.replace('peg/','');
       }
      
      return super.parse(urlToNavigate);
  }
}