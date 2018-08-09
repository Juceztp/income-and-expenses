import * as fromUI from './ui.actions';

export interface State {
  isLoading: boolean;
}

const initState: State = {
  isLoading: false
};

export function uiReducer(state = initState, action: fromUI.acciones): State {
  switch (action.type) {
    case fromUI.ACTIVE_LOADING:
      return {
        isLoading: true
      };
    case fromUI.INACTIVE_LOADING:
      return {
        isLoading: false
      };
    default:
      return state;
  }
}
