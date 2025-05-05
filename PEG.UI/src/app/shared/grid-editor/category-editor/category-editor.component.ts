import {AfterViewInit, Component, ViewChild, ViewContainerRef, OnInit} from "@angular/core";
import {ICellEditorAngularComp} from "ag-grid-angular";
import { of, concat, Subject, Observable, fromEvent } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { DealsService } from '../../../deals/deals.service';
import { ExpertCategory } from '../../../deals/new-deal/deal-experts/expertCategory';
import { GlobalService} from '../../../global/global.service'

@Component({
  selector: 'app-category-editor',
  templateUrl: './category-editor.component.html',
  styleUrls: ['./category-editor.component.scss']
})
export class CategoryEditorComponent implements ICellEditorAngularComp, AfterViewInit {

  constructor(private dealService:DealsService,private globalService:GlobalService) {
    this.globalService.getExpertCategories().subscribe(res=>{
      
      this.expertCategories = res;
    })
   }
  params:any
  selectedCategory;
  expertCategories:ExpertCategory[];
  nonCategoryExpertSortOrder:number = 5;
  agInit(params: any): void {
    this.params = params;
    if(this.params.data.categoryName)
    {
      this.selectedCategory = this.params.data.categoryName;
    }
}

isPopup(){
  return true;
}

ngAfterViewInit() {
  window.setTimeout(() => {
    //this.expertSelect.element.nativeElement.focus();
})
}
getValue(): any {
  return (this.params.data.expertCategory!=null && this.params.data.expertCategory!=undefined)?this.params.data.expertCategory.expertCategoryName:'-';
}

onSelectionChange()
{
 let category = this.expertCategories.find(x=>x.expertCategoryName == this.selectedCategory);
 
   this.params.data.categoryId = (category!=null && category!=undefined)?category.expertCategoryId:0;
  
   this.params.data.sortOrder = (category!=null && category!=undefined)?category.sortOrder:this.nonCategoryExpertSortOrder;

   this.params.data.expertCategory = category;
 
 
 this.params.api.stopEditing();
}

}
