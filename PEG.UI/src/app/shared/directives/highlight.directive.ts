import { Directive, ElementRef, Renderer2, Input } from '@angular/core';  
  
@Directive({  
  selector: '[appSearchHighlight]'  
})  
export class SearchHighlightDirective {  
  @Input('appSearchHighlight') searchTerm: string;  
  
  constructor(private el: ElementRef, private renderer: Renderer2) {}  
  
  ngOnChanges() {  
    if (!this.searchTerm) {  
      this.renderer.setProperty(this.el.nativeElement, 'innerHTML', this.el.nativeElement.textContent);  
      return;  
    }  
  
    this.highlightText();  
  }  
  
  private highlightText() {  
    const text = this.el.nativeElement.textContent;  
    const highlightedText = text.replace(new RegExp(this.searchTerm, 'gi'), (match) => `<strong>${match}</strong>`);  
    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', highlightedText);  
  }  
}  