import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[autofocus]'
})
export class AutofocusDirective {
  constructor(private host: ElementRef) {}

  ngAfterViewInit() {
    let self = this;
    setTimeout(function(){
      self.host.nativeElement.focus();
    }, 100);
  }
}