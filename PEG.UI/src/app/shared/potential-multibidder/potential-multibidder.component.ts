import { Component, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AgEditorComponent } from 'ag-grid-angular';
import { RegistrationService } from '../../registrations/registrations/registration.service';

@Component({
    selector: 'app-potential-mb',
    templateUrl: './potential-multibidder.component.html',
    styleUrls: ['./potential-multibbder.component.scss']
})

export class PotentialMultibidderComponent implements AgEditorComponent {
    @Output()
    public refreshGrid: EventEmitter<any> = new EventEmitter<any>();    
    params: any;
    value: any;
    possibleMBmatches: any = [];
    showLoader:boolean=true;
    constructor(private registrationService: RegistrationService,private route: Router,private activeRoute:ActivatedRoute) {}

    agInit(params): void {
        this.params = params;        
        this.value = params.value;
        this.activeRoute.params.subscribe(data => {
            if (data != undefined && data.hasOwnProperty('id')) {
                this.params.api.stopEditing();
            }  
          });
        this.showLoader=true;
        this.possibleMBmatches=[];
        
        this.registrationService.getFilteredRegistration(params.data.id).subscribe((responses: any) => {
            if(responses){
                this.possibleMBmatches = responses;
            }            
            this.showLoader=false;
        });

    };

    getValue(): any {
        return this.value;
    }

    isPopup(): boolean {
        return true;
    }

    getPopupPosition(): string {
        return "under";
    }

    viewSelected() {
        this.route.navigate([this.route.url + '/' + this.params.data.id]);
    }

    closePopup(){
        this.params.api.stopEditing();
    }
}