import { Directive, ElementRef, OnInit, OnDestroy  } from '@angular/core';
declare var jQuery: any;
@Directive({
  selector: '[semanticDropdown]'
})
export class SemanticDropdownDirective implements OnInit, OnDestroy  {

  private el;

  constructor(private elref: ElementRef) {
    this.el = elref.nativeElement;
  }

  ngOnInit() {
    // wrapping in setTimeout to delay init until after attribute binding
      jQuery(this.el).dropdown({});
  }

  ngOnDestroy() {
    //jQuery(this.el).dropdown('destroy');
  }

}
