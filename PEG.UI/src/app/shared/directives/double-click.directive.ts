import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appDoubleClick]'
})
export class DoubleClickDirective {

  times = 0;

  constructor() { }

  @HostListener('dblclick') onDoubleClicked() {
    console.log('onDoubleClicked ran!');
  }

  @HostListener('click') onClicked() {
    console.log('onClicked ran!');
    this.times++;
    console.log(this.times);
  }

}