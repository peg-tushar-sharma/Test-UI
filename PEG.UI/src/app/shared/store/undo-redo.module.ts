import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { eventReducer } from './undoable.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('events', eventReducer),
    // EffectsModule.forFeature([YourEffectsClass]),
  ]
})
export class UndoRedoModule {}
