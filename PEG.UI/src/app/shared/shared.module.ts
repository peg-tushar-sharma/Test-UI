import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';
import { AuditLogComponent } from '../registrations/sidebar-notes/audit-log/audit-log.component';
import { AuthorizeDirective } from './authorize/authorize.directive';
import { AutofocusDirective } from "./directives/autofocus.directive";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CheckboxSelectComponent } from './checkbox-select/checkbox-select.component';
import { ClientMultiSelectTypeaheadComponent } from './client-multi-select-typeahead/client-multi-select-typeahead.component';
import { CreateEditProhibitionComponent } from '../registrations/prohibitions/create-edit-prohibition.component';
import { CustomDatePickerComponent } from './custom-date-picker/custom-date-picker.component';
import { CustomTagsComponent } from './tags/custom-tags/custom-tags.component';
import { DoubleClickDirective } from './directives/double-click.directive';
import { DropdownSelectComponent } from './dropdown-select/dropdown-select.component';
import { DurationDropdownComponent } from './customDropdown/duration-dropdown/duration-dropdown.component';
import { EditableTextComponent } from './editable-text/editable-text.component';
import { FocusFirstInvalidFieldDirective } from './directives/FocusInvalidFields';
import { FormatTimeZone } from '../shared/formatTimeZone.pipe';
import { GeneralNotesComponent } from '../registrations/sidebar-notes/general-notes/general-notes.component';
import { GridService } from './grid-generator/grid-column.service';
import { InfoIconComponent } from './info-icon/info-icon.component';
import { Loader } from './templates/loader/loader';
import { MaskDirective } from './directives/ngx-mask.directive';
import { MaskRendererComponent } from './grid-renderer/mask-renderer/mask-renderer.component';
import { ModalComponent } from './modal/modal.component';
import { MultiSelectTypeaheadComponent } from './multi-select-typeahead/multi-select-typeahead.component';
import { NgModule } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NotFoundComponent } from "./errorPages/not-found/not-found.component";
import { PotentialMultibidderComponent } from './potential-multibidder/potential-multibidder.component';
import { RadioListSelectComponent } from './radio-list-select/radio-list-select.component';
import { RedbookAvailableComponent } from "./redbook-available/redbook-available.component";
import { RegistrationBulkUpdate } from './registrationBulkUpdate/registrationBulkUpdate.component';
import { RegistrationMessageService } from '../registrations/registration-message/registration-message.service';
import { ReviewersComponent } from '../registrations/sidebar-notes/reviewers/reviewers.component';
import { SecurityCheckboxComponent } from './security-checkbox/security-checkbox.component';
import { SemanticDropdownDirective } from './directives/semantic-dropdown.directive';
import { SidebarNotesComponent } from '../registrations/sidebar-notes/sidebar-notes.component';
import { TagsComponent } from '../registrations/sidebar-notes/tags/tags.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TruncatePipe } from '../shared/truncate.directive';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead'
import { ValidationComponent } from './validations/validation.component';
import { ValidationModule } from './validations/validation.module';
import { ConflictsComponent } from '../registrations/sidebar-notes/conflicts/conflicts.component';
import { RegDetailsComponent } from '../registrations/sidebar-notes/reg-details/reg-details.component';
import { ConflictPopupComponent } from './conflict-popup/conflict-popup.component';
import { UpdateStageModalComponent } from './update-stage-modal/update-stage-modal.component';
import { PartnerDashboardService } from '../partner-dashboard/partner-dashboard/partner-dashboard.service';
import { RegistrationService } from '../registrations/registrations/registration.service';
import { RefreshPopupComponent } from './refresh-popup/refresh-popup.component';
import { OpportunityTypeDetailsComponent } from '../shared/opportunity-type-details/opportunity-type-details.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { GetListItemValue } from './get-list-item-value.pipe';
import { CaseEditorComponent } from './grid-editor/case-editor/case-editor.component';

@NgModule({

  declarations: [
    FocusFirstInvalidFieldDirective,
    MaskDirective,
    DoubleClickDirective,
    EditableTextComponent,
    ValidationComponent,
    SemanticDropdownDirective,
    MultiSelectTypeaheadComponent,
    ClientMultiSelectTypeaheadComponent,
    Loader,
    AuthorizeDirective,
    InfoIconComponent,
    CheckboxSelectComponent,
    CustomDatePickerComponent,
    DropdownSelectComponent,
    RadioListSelectComponent,
    TruncatePipe,
    FormatTimeZone,
    ModalComponent,
    RegistrationBulkUpdate,
    SecurityCheckboxComponent,
    CreateEditProhibitionComponent,
    DurationDropdownComponent,
    MaskRendererComponent,
    PotentialMultibidderComponent,
    RedbookAvailableComponent,
    NotFoundComponent,
    AutofocusDirective,
    SidebarNotesComponent,
    GeneralNotesComponent,
    ReviewersComponent,
    TagsComponent,
    RegDetailsComponent,
    AuditLogComponent,
    ConflictsComponent,
    ConflictPopupComponent,
    UpdateStageModalComponent,
    RefreshPopupComponent  ,
    OpportunityTypeDetailsComponent,
    GetListItemValue,
    CaseEditorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ValidationModule,
    BsDatepickerModule.forRoot(),
    TypeaheadModule.forRoot(),
    NgSelectModule,
    AlertModule.forRoot(),
    TooltipModule.forRoot(),
    ButtonsModule.forRoot(),
    BsDropdownModule
  ],
  exports: [
    FocusFirstInvalidFieldDirective,
    MaskDirective,
    DoubleClickDirective,
    EditableTextComponent,
    ValidationComponent,
    SemanticDropdownDirective,
    MultiSelectTypeaheadComponent,
    ClientMultiSelectTypeaheadComponent,
    Loader,
    AuthorizeDirective,
    InfoIconComponent,
    CheckboxSelectComponent,
    CustomDatePickerComponent,
    DropdownSelectComponent,
    RadioListSelectComponent,
    TruncatePipe,
    FormatTimeZone,
    ModalComponent,
    RegistrationBulkUpdate,
    SecurityCheckboxComponent,
    CreateEditProhibitionComponent,
    DurationDropdownComponent,
    MaskRendererComponent,
    PotentialMultibidderComponent,
    RedbookAvailableComponent,
    NotFoundComponent,
    AutofocusDirective,
    SidebarNotesComponent,
    GeneralNotesComponent,
    ReviewersComponent,
    TagsComponent,
    RegDetailsComponent,
    AuditLogComponent,
    ConflictsComponent,
    ConflictPopupComponent,
    UpdateStageModalComponent,
    RefreshPopupComponent ,
    OpportunityTypeDetailsComponent,
    GetListItemValue,
    CaseEditorComponent
    
  ],
  providers: [GridService, RegistrationMessageService, BsModalService, BsModalRef, PartnerDashboardService, RegistrationService, DatePipe,CurrencyPipe ]
})
export class SharedModule { }
