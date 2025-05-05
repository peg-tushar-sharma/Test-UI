import { createReducer, on } from '@ngrx/store';
import { addEvent, undo, redo } from './undoable.actions';

export interface EventState {
  events: any[];
  undoStack: any[];
  redoStack: any[];
  type: string;
}

const initialState: EventState = {
  events: [],
  undoStack: [],
  redoStack: [],
  type: ''
};

const MAX_UNDO_REDO_ACTIONS = 5;

export const eventReducer = createReducer(
  initialState,
  on(addEvent, (state, { event }) => {
    const updatedEvents = [...state.events, event];
    const newUndoStack = [event, ...state.undoStack].slice(0, MAX_UNDO_REDO_ACTIONS);
    return {
      events: updatedEvents,
      undoStack: newUndoStack,
      redoStack: [],
      type: 'addEvent'
    };
  }),

  on(undo, state => {
    if (state.undoStack.length === 0) {
      return state;
    }
    const [lastEvent, ...newUndoStack] = state.undoStack;
    return {
      events: state.events.filter(event => event !== lastEvent),
      undoStack: newUndoStack,
      redoStack: [lastEvent, ...state.redoStack],
      type: 'undo'
    };
  }),

  on(redo, state => {
    if (state.redoStack.length === 0) {
      return state;
    }
    const [firstEvent, ...newRedoStack] = state.redoStack;
    return {
      events: [...state.events, firstEvent],
      undoStack: [firstEvent, ...state.undoStack].slice(0, MAX_UNDO_REDO_ACTIONS),
      redoStack: newRedoStack,
      type: 'redo'
    };
  })
);
