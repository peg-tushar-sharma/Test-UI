import { Directive,ElementRef, HostListener } from '@angular/core';
import { NgControl } from "@angular/forms";

@Directive({
  selector: '[validateText]'
})
export class TxtBoxDirective {
  constructor(private host: ElementRef,private control : NgControl) {}

  @HostListener('change') onTextChange() {
    let ele = this.host.nativeElement as HTMLInputElement;
    if (typeof ele.value === 'string') {
        ele.value = ele.value.trim();
        this.control.control.setValue(ele.value);
    }
  }

}