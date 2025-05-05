import { Component, OnInit, Input, HostListener, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TooltipDirective } from 'ngx-bootstrap/tooltip';

@Component({
  selector: 'app-info-icon',
  templateUrl: './info-icon.component.html',
  styleUrls: ['./info-icon.component.scss']
})
export class InfoIconComponent implements OnInit {
  constructor(private elRef: ElementRef,private sanitizer:DomSanitizer) { }
  public toggle: boolean = false;
  public tooltipCheck: boolean = false;
  public isTooltipOpen: boolean = false;

  @Input()
  infoText: string;
  
  @Input()
  name: string;

  @Input()
  placement: string = "right";

  @ViewChild('infoIcon', { read: TooltipDirective, static: true }) infoIcon: TooltipDirective;

  ngOnInit() {
  }

  manageTooltip(event) {
    if (this.infoIcon.isOpen) {
      this.infoIcon.hide();
      event.currentTarget.classList.remove("active");
    }
    else {
      if (this.infoText) {
        this.infoIcon.show();
        this.isTooltipOpen = true;
        event.currentTarget.classList.add("active");
      }
    }
  }

  parseText(val) {
  
    return this.sanitizer.bypassSecurityTrustHtml(val);

  }


  @HostListener('document:click', ['$event.target'])
  clickout(element) {
       if (!element.classList.contains('fa-info-circle') && element.parentNode && !element.parentNode.classList.contains("active")) {
      this.infoIcon.hide();
      let infoIcon = this.elRef.nativeElement.querySelectorAll('a[name="infoTooltip"]');
      infoIcon.forEach(element => {
        if (element.classList.contains("active")) {
          element.classList.remove("active");
        }
      })
    }
  }
  

  showToolTip(event) {
    if (this.infoText.length > 0) {
      this.manageTooltip(event);
    }
  }

  hideToolTip(event) {
    this.infoIcon.hide();
    event.currentTarget.classList.remove("active");
  }

}
