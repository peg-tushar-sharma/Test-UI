// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// import { EditableTextComponent } from './editable-text.component';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
// import { By } from '@angular/platform-browser';

// describe('EditableTextComponent', () => {
//   let component: EditableTextComponent;
//   let fixture: ComponentFixture<EditableTextComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ EditableTextComponent ],
//       imports: [
//         CommonModule,
//         FormsModule
//       ],
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(EditableTextComponent);
//     component = fixture.componentInstance;
//     component.labelText = 'Target';
//     component.labelValue = '@Leisure##4335';
//     fixture.detectChanges();
//   });




//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should show text box on edit', () => {

//     const clickSpan = fixture.debugElement.queryAll(By.css('span'))[0];

//     clickSpan.triggerEventHandler('click', null);
//     fixture.detectChanges();

//   });


//   it('change input text values', () => {

//     const clickSpan = fixture.debugElement.queryAll(By.css('span'))[0];
//     clickSpan.triggerEventHandler('click', null);
//     fixture.detectChanges();

//     const inputElement = fixture.nativeElement.querySelector('input');

//     sendInput('CVC', inputElement).then(() => {

//       const foucusOutInput = fixture.debugElement.queryAll(By.css('input'))[0];
//       foucusOutInput.triggerEventHandler('focusout', null);
//       fixture.detectChanges();
//     });

//   });

//   function sendInput(text: string, input: any) {
//     input.value = text;
//     input.dispatchEvent(new Event('input'));
//     fixture.detectChanges();
//     return fixture.whenStable();
//   }

// });
