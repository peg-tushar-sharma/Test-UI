import { Component, EventEmitter, forwardRef, Input, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Employee } from '../interfaces/Employee';
import { QuillEditorComponent } from 'ngx-quill';
import { Mention } from '../interfaces/mention';
import { PartnerDashboardService } from '../../partner-dashboard/partner-dashboard/partner-dashboard.service';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';
import { EMPLOYEE_STATUS_CODE, EXPERT_PARTNER_LEVELGRADE, LEVEL_STATUS_CODE } from '../common/constants';

@Component({
  selector: 'app-mention-partners', 
  templateUrl: './mention-partners.component.html',
  styleUrl: './mention-partners.component.scss',
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => MentionPartnersComponent),
        multi: true
      }
    ]
    
})
export class MentionPartnersComponent implements ControlValueAccessor {

  @Output() mentionRecipientsChanged = new EventEmitter<Employee[]>();
  @Output() onBlurPartnerNotes = new EventEmitter<any>();
  @Input() mentionControl!: FormControl;
  @Input() isFormSubmitted: boolean = false;
  @ViewChild('quilEditor') quilEditor: QuillEditorComponent; // Access QuillEditorComponent

  highlightText: string = '';
  innerValue = '';
  onChange = (val: any) => { };
  onTouched: () => void = () => { };
  caretTop: number = 0;
  caretLeft: number = 0;
editorContent: string = '';
modules: any;
previousValue: string = '';
partnerNotesMentionEmployees: Employee[] = [];
filteredUsers: Employee[] = [];
showMentionList: boolean = false;
  selectedMentions: Mention[] = [];
  quillInstance: any;
lastKeyPressed: string | null = null;
isDropdownSelected:boolean=false;
lastCursorPosition: number = 0;
savedRange: any = null;
isReadOnly=false;
  constructor(
    private pdService: PartnerDashboardService) {
  }
ngOnInit() {
  

  this.modules = {    
    toolbar: false};

  
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
ngAfterViewInit() {
     this.quillInstance = this.quilEditor.quillEditor;

}


writeValue(obj: any): void {
  this.innerValue = obj || '';

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
 this.isReadOnly=true;
setTimeout(() => {

  this.quilEditor.addClasses("quill-disabled")
 
},1000);

}
 
}


onEditorCreated(editor: any) {
  this.quillInstance = editor;

  // Listen for backspace key
  this.quillInstance.keyboard.addBinding({ key: 8 }, (range: any, context: any) => {
    this.lastKeyPressed = 'Backspace';
    // You can handle backspace-specific logic here directly
    return true; // Let Quill handle the key normally as well
  });

  editor.root.addEventListener('keydown', (event: KeyboardEvent) => {
    this.previousValue =this.quillInstance.getText();
    //setTimeout(() => this.setCaretPosition(), 500);
  });
  editor.root.addEventListener('click', this.onQuillClick.bind(this));

}




getCursorPosition() {
  const selection = this.quillInstance.getSelection();
  if (selection) {
    return selection.index;
  }
  return 0;
}
onContentChanged(event: any) {
  const text = this.quillInstance.getText();
let cursorPos=this.getCursorPosition();
this.lastCursorPosition=cursorPos;

const beforeCursor = text.slice(0, cursorPos);
if (this.lastKeyPressed === 'Backspace') {

const delta = this.quillInstance.getContents();
const cursorPos = this.getCursorPosition();
this.lastCursorPosition = cursorPos;

// Extract part of the delta before cursor
const beforeCursorDelta = this.quillInstance.getContents(0, cursorPos);
const beforeCursorText = this.quillInstance.getText(0, cursorPos);

// Use previous plain text for detecting what was typed
const previousBeforeCursor = this.previousValue.slice(0, cursorPos + 1);
const splitText = previousBeforeCursor.split('@');
const lastValue = splitText[splitText.length - 1];

const isAvailable = this.partnerNotesMentionEmployees.some(
  (employee) => employee.searchableName === lastValue
);

if (isAvailable) {
  const start = cursorPos - lastValue.length;

  // Delete from Delta (preserves formatting around it)
  this.quillInstance.deleteText(start - 1, lastValue.length + 1); // -1 to include '@'

  setTimeout(() => {
    this.quillInstance.setSelection(start - 1, 0); // Set cursor just before mention
    this.quilEditor.quillEditor.focus();
  }, 0);
  this.TrackMention();
  return;

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
this.mentionControl.setValue(null); // 👈 triggers typeahead
}
this.syncTextArea();
}
// Sync the textarea with the overlay
syncTextArea() {


  setTimeout(() => {
    const delta = this.quillInstance.getContents(); // full delta
    let index = 0;
  
    delta.ops.forEach(op => {
      if (typeof op.insert === 'string') {
        this.partnerNotesMentionEmployees.forEach(employee => {
          const mentionText = '@' + employee.searchableName;
          const text = op.insert;
          let offset = 0;
          
          while ((offset = text.indexOf(mentionText, offset)) !== -1) {
            const globalIndex = index + offset;
            this.quillInstance.formatText(globalIndex, mentionText.length, {
              bold: true,
              color: 'rgb(40, 76, 224)'
            });
            // Reset formatting after the mention
         // Insert a space (if needed)


// Reset formatting for the next character after mention
this.quillInstance.formatText(globalIndex + mentionText.length + 1, 1, {
  bold: false,
  color: false
});
// Move the cursor to the end of the inserted mention
if(this.isDropdownSelected == true)
{const newCursorPos = globalIndex + mentionText.length;
  this.quillInstance.setSelection(newCursorPos, 0);}


            offset += mentionText.length;
          }
        });
      }
      index += typeof op.insert === 'string' ? op.insert.length : 1;
    });
  }, 0);

 
   this.TrackMention();
   }
selectUser(user: any) {
  this.isDropdownSelected = true;
  const rawtext=this.quillInstance.getText();
  const rawIndex= rawtext.lastIndexOf('@', this.lastCursorPosition);
  const textBetween = rawtext.slice(rawIndex , this.lastCursorPosition); // Exclude the '@' itself

  const text = this.innerValue;//this.quillInstance.getText();   
  
  // Find the position of the last mention
  const lastAtPos = text.lastIndexOf(textBetween);  // Find the last @ before the cursor position

    const lastEndPointPoint=((text.length-textBetween.length)-lastAtPos);
  if (lastAtPos === -1) {
    // No @ found, no need to process
    return;
  }
  
  // Now we want to find the end of the mention (which is usually the next space or the end of the text)
  //const mentionEndPos = text.indexOf(' ', lastAtPos); // Get the position of the space after @mention
  const mentionText = lastAtPos === -1 ? text.slice(lastAtPos) : text.slice(lastAtPos, text.length);
 
  // Rep  console.log(this.innerValue)lace the mention (from @ to space) with the selected user's searchableName
  // const updatedText = text.slice(0, lastAtPos) + '@' + user.searchableName + ' ' + text.slice(lastAtPos + mentionText.length);
  const updatedText =
  text.slice(0, lastAtPos) + // start up to @
  '@' + user.searchableName + ' ' + // new mention
  text.slice(lastAtPos+textBetween.length,text.length); // rest of the text after cursor
  this.innerValue = updatedText;
  this.onChange(this.innerValue);
  
  //Add to selected list if not already selected
  const alreadySelected = this.partnerNotesMentionEmployees.find(emp => emp.employeeCode === user.employeeCode);
  if (!alreadySelected) {
  this.partnerNotesMentionEmployees.push(user);
  } 
  this.showMentionList = false;
  this.populateIntoRecipeint();
  this.syncTextArea();
  
  this.previousValue=text;
  this.mentionControl.setValue(null); // 👈 triggers typeahead

  } 
TrackMention() {

  const newText = this.quillInstance.getText();
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

 
  populateIntoRecipeint() {

    this.mentionRecipientsChanged.emit(this.partnerNotesMentionEmployees);
    
}

onQuillClick(event: MouseEvent) {
  const range = this.quillInstance.getSelection();
  const text = this.quillInstance.getText();

  if (!range) return;

  const cursorPos = range.index;

  for (const mention of this.selectedMentions) {
    if (cursorPos > mention.start && cursorPos < mention.end) {
      // Move the cursor to the end of the text
      const length = text.length;
      this.quillInstance.setSelection(length, 0); // moves cursor to the end
      break;
    }
  }
}
onBlurEditor()
{
setTimeout(() => {
this.RemoveMentionPartner();
}, 500);


}
RemoveMentionPartner()
{

if (this.isDropdownSelected) {
// If the dropdown was used, we don't need to run the logic inside onTextareaBlur
this.isDropdownSelected = false; // Reset the flag
return;
}
let removedEmployee: any[] = [];
const text = this.quillInstance.getText();

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

const delta = this.quillInstance.getContents();         // Get Quill Delta
const deltaString = JSON.stringify(delta); 

this.onBlurPartnerNotes.emit({removedPartnerList: removedEmployee,partnerNotes:this.quillInstance.getText() ,partnerNotesMentionEmployees:this.partnerNotesMentionEmployees });
}
else{
removedEmployee=this.partnerNotesMentionEmployees;
this.onBlurPartnerNotes.emit({removedPartnerList: removedEmployee, PartnerNotes: this.quillInstance.getText(),partnerNotesMentionEmployees:[] });
this.partnerNotesMentionEmployees=[];
}
}

}
