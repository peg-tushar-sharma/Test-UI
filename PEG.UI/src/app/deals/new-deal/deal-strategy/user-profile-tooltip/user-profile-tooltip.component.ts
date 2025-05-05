import { Component, OnInit ,Input, Output, EventEmitter} from '@angular/core';
import { GlobalService } from '../../../../global/global.service';
import { ExpertCategories } from '../../../../shared/enums/expert-category.enum'
import { ExpertCategory } from '../../deal-experts/expertCategory';

@Component({
  selector: 'app-user-profile-tooltip',
  templateUrl: './user-profile-tooltip.component.html',
  styleUrls: ['./user-profile-tooltip.component.scss']
})
export class UserProfileTooltipComponent implements OnInit {
  @Input()
  item: any;
  NACategoryID : number;
  expertCategories:ExpertCategory[];
  selectedCategory;
  @Output()
   saveExpert: EventEmitter<any> = new EventEmitter<any>();
   @Output()
   saveExpertNote: EventEmitter<any> = new EventEmitter<any>();
   @Output()
   saveExpertCategory: EventEmitter<any> = new EventEmitter<any>();
   
  constructor(private globalService: GlobalService) { }

  ngOnInit() {  
    this.selectedCategory=this.item.expertCategory;
    this.globalService.getExpertCategories().subscribe(res=>{
      
      this.expertCategories = res;
    })
   this.NACategoryID = ExpertCategories.NotAvailable;
   for(let i = 0; i < this.item.expertPoolColor.length; i++){
   }
  }

  saveNotes(event,itemColor, index){
    event.stopPropagation();

     this.saveExpertNote.emit(itemColor);
  }
  saveCategory() {
    if (this.selectedCategory && this.selectedCategory != undefined) {
      this.item.expertCategory = this.selectedCategory;
    }
    else {
      this.item.expertCategory.expertCategoryId = 0;
      this.item.expertCategory.expertCategoryName = '-';
    }

    this.saveExpert.emit(this.item);
  }

}
