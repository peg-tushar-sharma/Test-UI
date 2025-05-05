import { Component, OnInit } from '@angular/core';
import { CoreService } from '../../core/core.service';
import { CacheStore } from '../persistence/cache.store';

@Component({
  selector: 'app-new-updates',
  templateUrl: './new-updates.component.html',
  styleUrls: ['./new-updates.component.scss']
})
export class NewUpdatesComponent implements OnInit {
  toggleNewUpdates: boolean = false;
  isClicked: Boolean = false;
  constructor(private _coreService: CoreService) {
    this._coreService.newUpdates.subscribe(res => {
      this.toggleNewUpdates = res;
    });

  }

  ngOnInit() {

  }

  closeModal() {
    this.toggleNewUpdates = false;
  }
  refresh() {
    this.isClicked = true;
    this._coreService.newUpdates.next(null);
    localStorage.clear();
    history.go(0);
    location.reload();
    return false;

  }
}
