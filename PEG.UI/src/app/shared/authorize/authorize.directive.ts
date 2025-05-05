import { Directive, Input, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { RegistrationService } from '../../../app/registrations/registrations/registration.service';

@Directive({ selector: '[authorize]' })
export class AuthorizeDirective implements OnInit {
    @Input() elementName: string;
    public allRoleFields;
    
    constructor(public elementRef: ElementRef, public renderer: Renderer2,private registrationService: RegistrationService) { }

    ngOnInit() {
        this.allRoleFields = this.registrationService.roleFieldValues;
        if(this.allRoleFields == undefined || this.allRoleFields == null){
            this.registrationService.getUserAuthorization()
            .subscribe(userRoleField => {
            this.registrationService.roleFieldValues = userRoleField;
            this.allRoleFields = this.registrationService.roleFieldValues;
            this.setAuthorization();
      });
        }else{
            this.setAuthorization();
        }
    }

    setAuthorization() {        
        let currentFieldName = this.getId() ? this.elementRef.nativeElement.id : this.elementRef.nativeElement.name;
        if(currentFieldName != undefined && currentFieldName !='' && this.allRoleFields != undefined && this.allRoleFields != '') {
            let isFieldExist = this.allRoleFields.filter(fields => fields.field.fieldName == currentFieldName);
            if(isFieldExist.length > 0) {
                if(isFieldExist[0].isVisible == false) {
                    this.setVisibility();                    
                }
                if(isFieldExist[0].isEditable == false) {
                    this.setDisabledState();
                }                
            }
        }
    }

    getId() {
        let elementForId = ['app-editable-text' , 'app-multi-select-typeahead' ,'my-date-picker'];
        let isPresent = elementForId.filter(id => this.elementRef.nativeElement.localName==id);
        if(this.elementRef.nativeElement.className == 'fa fa-edit') {
            this.elementRef.nativeElement.name = 'addNote';
        } else if(this.elementRef.nativeElement.firstChild != null) {
            if(this.elementRef.nativeElement.firstChild.name == 'auditLog'){
                this.elementRef.nativeElement.name = 'auditLog';
            }
        }
        return isPresent.length > 0 ? true : false;
    }

    setVisibility() {
        this.renderer.setStyle(this.elementRef.nativeElement, "display", "none");
        this.elementRef.nativeElement.remove();
    }

    setDisabledState() {
        if(this.elementRef.nativeElement.localName=='app-editable-text' ) {
            this.renderer.setStyle(this.elementRef.nativeElement.firstChild.childNodes[1], "pointer-events", "none");
        } else if(this.elementRef.nativeElement.localName=='app-multi-select-typeahead' || this.elementRef.nativeElement.localName=='my-date-picker'){
            this.renderer.setStyle(this.elementRef.nativeElement, "pointer-events", "none");
        } else {
            this.elementRef.nativeElement.disabled = true;
            this.renderer.setStyle(this.elementRef.nativeElement, "pointer-events", "none");
            if(this.elementRef.nativeElement.parentNode != null && this.elementRef.nativeElement.localName =='select') {
                this.renderer.setStyle(this.elementRef.nativeElement.parentNode, "pointer-events", "none");
            }
        }
    }    

} 