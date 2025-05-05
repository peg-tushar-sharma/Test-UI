import { SemanticDropdownDirective } from './semantic-dropdown.directive';
import { Component, DebugElement } from "@angular/core";
import {TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  template: `<select type="text" semanticDropdown><option>1</option></select>`
})
class TestDropdownComponent {
}


describe('SemanticDropdownDirective', () => {

  let component: TestDropdownComponent;
    let fixture: ComponentFixture<TestDropdownComponent>;
    let elRef: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SemanticDropdownDirective, TestDropdownComponent]
    });
    fixture = TestBed.createComponent(TestDropdownComponent);
    component = fixture.componentInstance;
    
  });

  it('should create an instance', () => {
    elRef = fixture.debugElement.query(By.css('select'));
    const directive = new SemanticDropdownDirective(elRef);
    expect(directive).toBeTruthy();
  });
});
