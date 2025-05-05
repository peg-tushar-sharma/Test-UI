import { Component, ElementRef, EventEmitter, forwardRef, Input, Output, ViewChild } from '@angular/core';
import { Employee } from '../interfaces/Employee';
import { Mention } from '../interfaces/mention';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';
import { EMPLOYEE_STATUS_CODE, EXPERT_PARTNER_LEVELGRADE, LEVEL_STATUS_CODE } from '../common/constants';
import { PartnerDashboardService } from '../../partner-dashboard/partner-dashboard/partner-dashboard.service';

@Component({
  selector: 'app-mention-partner', 
  templateUrl: './mention-partner.component.html',
  styleUrl: './mention-partner.component.scss',
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => MentionPartnerComponent),
        multi: true
      }
    ]
})
export class MentionPartnerComponent implements ControlValueAccessor {


  @Output() mentionRecipientsChanged = new EventEmitter<Employee[]>();
  @Output() onBlurPartnerNotes = new EventEmitter<any>();

   @Input() mentionControl!: FormControl;
 @Input() isFormSubmitted: boolean = false;
  filteredUsers: Employee[] = [];
  showMentionList: boolean = false;
  @ViewChild('mirrorDiv') mirrorDiv!: ElementRef;
  @ViewChild('textarea') textarea!: ElementRef;
  @ViewChild('overlay') overlay!: ElementRef;
  @ViewChild('textareaWrapper') textareaWrapper!: ElementRef;
  highlightText: string = '';
  caretTop: number = 0;
  caretLeft: number = 0;
  previousValue: string = '';
  partnerNotesMentionEmployees: Employee[] = [];
  selectedMentions: Mention[] = [];
  isDropdownSelected:boolean=false;
   innerValue = '';
  onChange = (val: any) => {};
  onTouched: () => void = () => {};
  constructor(
      private pdService: PartnerDashboardService) { 

       
      }

  ngOnInit() {

if (this.mentionControl) {
  this.mentionControl.valueChanges.pipe(
    tap(() => {
      this.filteredUsers = [];
      //this.isEmployeeLoading = true;
    }),
    debounceTime(300),
    distinctUntilChanged(),
    switchMap((term) =>
      this.pdService.getEmployeeNames(
        term,
        EMPLOYEE_STATUS_CODE,
        LEVEL_STATUS_CODE,
        EXPERT_PARTNER_LEVELGRADE
      )
    ),
    tap(() => {
      // this.isEmployeeLoading = false;
    })
  ).subscribe((items) => {
    items.forEach((element) => {
      element.searchableName =
        element.lastName +
        ", " +
        (element.familiarName ? element.familiarName : element.firstName);
    });

    this.filteredUsers = items;
    this.showMentionList = items.length > 0;
  });
}
  }

    writeValue(obj: any): void {
     
      this.innerValue = obj || '';
      //this.highlightText = this.formatTextForHighlight(this.innerValue);
      if (this.textarea) {
        this.textarea.nativeElement.value = this.innerValue;
      }
      this.syncMirror();
      this.syncTextArea();

      
      this.onTouched();
    }
    registerOnChange(fn: any): void {
      
    this.onChange = fn;
    }
    registerOnTouched(fn: any): void {
      this.onTouched = fn;
    }
    setDisabledState?(isDisabled: boolean): void {
  if(this.isFormSubmitted)
  {
    
     // Delay access until the view is ready
  setTimeout(() => {
    if (this.textarea?.nativeElement) {
      this.textarea.nativeElement.disabled = isDisabled;
    }
  });
   
  }
     
    }


  
  populateIntoRecipeint() {

    this.mentionRecipientsChanged.emit(this.partnerNotesMentionEmployees);
    
}

mergeUniqueRecipients(...lists: any[][]): any[] {
   
  // Flatten the lists and create a Map to remove duplicates based on 'id'
  return Array.from(
    new Map(lists.flat().map((item) => [item.employeeCode, item])).values()
  );
}

onInput(event: Event) {
//console.log('onInput', event);

this.innerValue = this.textarea.nativeElement.value;
this.onChange(this.innerValue);
this.syncMirror();
this.syncTextArea();

// this.syncMirror();
// this.syncTextArea();
}
onTextClick(event: KeyboardEvent)
{
  
const text = this.innerValue || '';
// console.log(text)
//console.log('prvious', this.previousValue);

const cursorPos = this.textarea.nativeElement.selectionStart;


for (const mention of this.selectedMentions) {
if (cursorPos > mention.start && cursorPos < mention.end) {

this.textarea.nativeElement.setSelectionRange(text.length + 1, text.length + 1);
break;
}
}
}
onKeyUp(event: KeyboardEvent) {
const text = this.innerValue || '';
// console.log(text)
// console.log('prvious', this.previousValue);

const cursorPos = this.textarea.nativeElement.selectionStart;


const beforeCursor = text.slice(0, cursorPos);
if (event.key === 'Backspace') {
///const beforeCursor = text.slice(0, cursorPos);
const previousbeforeCursor = this.previousValue.slice(0, cursorPos+1);

const splitText = previousbeforeCursor.split('@');

const lastValue = splitText[splitText.length - 1];

const isAvailable = this.partnerNotesMentionEmployees.some(
(employee) => employee.searchableName === lastValue
);



const mentionMatch=beforeCursor.match(/@[\w]+(?=\s|$)/g);
const lastMention = mentionMatch ? mentionMatch[mentionMatch.length - 1] : null;
if (isAvailable) {
//const mention = mentionMatch[0];
const start = cursorPos - (lastValue.length);
const updatedText =
text.slice(0, start) + text.slice(cursorPos); // remove the mention

this.innerValue=updatedText;
this.onChange(this.innerValue);
this.syncMirror();
this.syncTextArea();
// Set cursor after deletion
setTimeout(() => {
this.textarea.nativeElement.setSelectionRange(start, start);
this.textarea.nativeElement.focus();
}, 0);

return; // Skip further processing
}
this.TrackMention();

}
this.TrackMention();
const mentionMatch = beforeCursor.match(/@(\w{2,})$/); // at least 2 characters

if (mentionMatch) {
const keyword = mentionMatch[1].toLowerCase();

this.mentionControl.setValue(keyword); // 👈 triggers typeahead
//this.emailDetailsForm.get('mentionControl').setValue(keyword); // Trigger the typeahead with the current search query
} else {
this.showMentionList = false; // Hide dropdown if no @mention
}

}

selectUser(user: any) {
this.isDropdownSelected = true;
const text = this.innerValue || '';
const cursorPos = this.textarea.nativeElement.selectionStart;


// const beforeCursor = text.slice(0, cursorPos);
// const updated = beforeCursor.replace(/@\w*$/, '@' + user.searchableName + ' ');


// Find the position of the last mention
const lastAtPos = text.lastIndexOf('@', cursorPos);  // Find the last @ before the cursor position
  
if (lastAtPos === -1) {
  // No @ found, no need to process
  return;
}

// Now we want to find the end of the mention (which is usually the next space or the end of the text)
const mentionEndPos = text.indexOf(' ', lastAtPos); // Get the position of the space after @mention
const mentionText = mentionEndPos === -1 ? text.slice(lastAtPos) : text.slice(lastAtPos, mentionEndPos);

// Replace the mention (from @ to space) with the selected user's searchableName
const updatedText = text.slice(0, lastAtPos) + '@' + user.searchableName + ' ' + text.slice(lastAtPos + mentionText.length);

this.innerValue = updatedText;
this.onChange(this.innerValue);


//Add to selected list if not already selected
const alreadySelected = this.partnerNotesMentionEmployees.find(emp => emp.employeeCode === user.employeeCode);
if (!alreadySelected) {
this.partnerNotesMentionEmployees.push(user);
} 
this.showMentionList = false;
this.populateIntoRecipeint();
this.syncMirror();
this.syncTextArea();

this.previousValue=text;
this.mentionControl.setValue(null); // 👈 triggers typeahead
this.setcursorPosition();

}
setcursorPosition() {
  // Focus the cursor at the end of the text area
setTimeout(() => {
  // Get the textarea element
  const textarea = this.textarea.nativeElement;
  
  // Set the cursor at the end of the text
  textarea.setSelectionRange(textarea.value.length, textarea.value.length);
  
  // Focus on the textarea after setting the cursor position
  textarea.focus();
}, 0);

}
TrackMention() {

const newText = this.innerValue || '';
this.selectedMentions=[]; // Clear previous mentions
this.partnerNotesMentionEmployees.forEach(employee => {
const mentionText = '@' + employee.searchableName;
let mentionStart = -1;
let mentionEnd = -1;

// Search for all occurrences of the employee's mention in the text
while ((mentionStart = newText.indexOf(mentionText, mentionStart + 1)) !== -1) {
mentionEnd = mentionStart + mentionText.length;

// Add to selectedMentions for every occurrence
this.selectedMentions.push({
start: mentionStart,
end: mentionEnd,
text: mentionText,
employee: employee,
});
}
});
}
// Sync the textarea with the overlay
syncTextArea() {
const val = this.innerValue || '';
this.highlightText = this.formatTextForHighlight(val);
this.TrackMention();
setTimeout(() => this.setCaretPosition(), 0);
}
// Format the text with highlights (replace @mention with highlighted span)
formatTextForHighlight(text: string): string {

// Replace any mention that starts with @ and includes letters or spaces
// return text.replace(/(@\w+)/g, '<span  class="mention-tag">$1<span class="symbol-tag hidden-symbol">#</span></span>');
let formattedText = text;

// Loop through all selected employees
this.partnerNotesMentionEmployees.forEach(employee => {
const employeeName = employee.searchableName.toLowerCase(); // Get lowercase name

// Create a regex to find all occurrences of @employeeName
const regex = new RegExp(`@${employeeName}\\b`, 'gi'); // 'g' for global, 'i' for case-insensitive

// Replace all mentions of the employee in the text with highlighted spans
formattedText = formattedText.replace(regex, (match) => {
return `<span class="mention-tag">${match}</span>`;
});
});

return formattedText;
}

syncMirror() {
const val = this.innerValue || '';
if (typeof val === 'string') {
this.highlightText = val.replace(/\n/g, '<br/>') || '';
setTimeout(() => this.setCaretPosition(), 0); // wait for DOM update
} else {
this.highlightText = ''; // Fallback to empty if val is not a string
}
setTimeout(() => this.setCaretPosition(), 0); // wait for DOM update

}

ngAfterViewInit() {
this.syncMirror();
}
setCaretPosition() {
// const caretSpan = this.mirrorDiv.nativeElement.querySelector('.caret-marker');
// if (caretSpan) {
// const rect = caretSpan.getBoundingClientRect();
// const parentRect = this.textarea.nativeElement.getBoundingClientRect();
// this.caretTop = rect.top - parentRect.top + 20;
// this.caretLeft = rect.left - parentRect.left;
// }

// const textareaEl = this.textarea.nativeElement;
// const mirrorEl = this.mirrorDiv.nativeElement;
// const caretMarker = mirrorEl.querySelector('.caret-marker');

// if (caretMarker) {
//   const markerRect = caretMarker.getBoundingClientRect();
//   const wrapperRect = this.textareaWrapper.nativeElement.getBoundingClientRect();

//   this.caretTop = markerRect.top - wrapperRect.top - textareaEl.scrollTop + textareaEl.offsetTop;
//   this.caretLeft = markerRect.left - wrapperRect.left + textareaEl.offsetLeft;
// }
const textareaEl = this.textarea.nativeElement;
const wrapperEl = this.textareaWrapper.nativeElement;
const mirrorEl = this.mirrorDiv.nativeElement;
const caretMarker = mirrorEl.querySelector('.caret-marker');

if (caretMarker) {
  const markerRect = caretMarker.getBoundingClientRect();
  const wrapperRect = wrapperEl.getBoundingClientRect();

  let left = markerRect.left - wrapperRect.left + textareaEl.offsetLeft;
  const maxLeft = wrapperEl.clientWidth - 600; // width in px

  // Clamp left to prevent overflow
  this.caretLeft = Math.min(left, maxLeft);
  this.caretTop = markerRect.top - wrapperRect.top - textareaEl.scrollTop + textareaEl.offsetTop;

}
//add comment

}
onTextareaScroll() {
this.overlay.nativeElement.scrollTop = this.textarea.nativeElement.scrollTop;
}
onKeyDown(event: KeyboardEvent) {
this.previousValue = this.innerValue || '';
}

onTextareaBlur()
{
setTimeout(() => {
this.DelayEmoveMethod();
}, 500);


}
DelayEmoveMethod()
{

if (this.isDropdownSelected) {
// If the dropdown was used, we don't need to run the logic inside onTextareaBlur
this.isDropdownSelected = false; // Reset the flag
return;
}
let removedEmployee: any[] = [];
const text = this.innerValue || '';

if(text.length > 0){
this.partnerNotesMentionEmployees.forEach(employee => {
 
// Check if the employee is not mentioned in the text
if(!(text.toLowerCase()).includes('@'+employee.searchableName.toLowerCase().toLowerCase()) )
{
removedEmployee.push(employee);

}
});
removedEmployee.forEach(employee => {
const index = this.partnerNotesMentionEmployees.findIndex(e => e.employeeCode === employee.employeeCode);
if (index !== -1) {
this.partnerNotesMentionEmployees.splice(index, 1);
}
});


this.onBlurPartnerNotes.emit({removedPartnerList: removedEmployee,partnerNotes:this.innerValue,partnerNotesMentionEmployees:this.partnerNotesMentionEmployees });
}
else{
removedEmployee=this.partnerNotesMentionEmployees;
this.onBlurPartnerNotes.emit({removedPartnerList: removedEmployee, PartnerNotes: this.innerValue,partnerNotesMentionEmployees:[] });
this.partnerNotesMentionEmployees=[];
}
}


}
