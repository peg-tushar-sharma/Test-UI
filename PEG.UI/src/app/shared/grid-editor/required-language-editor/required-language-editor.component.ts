import { AgEditorComponent } from 'ag-grid-angular';
import { Component, ViewChild } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';

import { GlobalService } from '../../../global/global.service'



@Component({
  selector: 'app-required-language-editor',
  templateUrl: './required-language-editor.component.html',
  styleUrls: ['./required-language-editor.component.scss']
})
export class RequiredLanguageEditorComponent implements AgEditorComponent {
  @ViewChild('language') eLa: NgSelectComponent;
  public languages: any;
  params: any;
  selectedLanguages:any[];
  constructor(private globalService: GlobalService) { }

  agInit(params): void {
    this.params = params;
    this.globalService.getLanguages()
    .subscribe((languages) => {
      this.languages = languages;
  
    });

    if (this.params.data && this.params.data.requiredLanguage) {
      this.selectedLanguages=this.params.data.requiredLanguage;
     
    }

    setTimeout(() => {
      this.eLa.searchInput.nativeElement.focus()
    }, 100);
  }
 
  getValue() {
    this.params.data.requiredLanguage = this.selectedLanguages;
    return this.params.data.requiredLanguage;
  }
  isPopup(): boolean {
    return true;
  }

  getPopupPosition(): string {
    return "under";
  }
}
