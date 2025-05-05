import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-conflict-gallery',
  templateUrl: './conflict-gallery.component.html',
  styleUrls: ['./conflict-gallery.component.scss'],
})
export class ConflictGalleryComponent implements OnInit, OnChanges {

  @Input() header = '';
  @Input() conflictData: any[] = [];

  data: any[] = [];

  ngOnInit(): void {
    this.data = this.conflictData;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.conflictData && changes.conflictData.currentValue) {
      this.data = changes.conflictData.currentValue;
    }
  }
}
