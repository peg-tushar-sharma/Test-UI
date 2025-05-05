import { createAction, props } from '@ngrx/store';

export const addEvent = createAction('[Events] Add Event', props<{ event: any }>());
export const undo = createAction('[Events] Undo');
export const redo = createAction('[Events] Redo');
