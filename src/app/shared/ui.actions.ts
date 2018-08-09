import { Action } from '@ngrx/store';

export const ACTIVE_LOADING = '[UI Loading] Loading...';
export const INACTIVE_LOADING = '[UI Loading] End of load...';

export class ActiveLoadingAction implements Action {
  readonly type = ACTIVE_LOADING;
}

export class InactiveLoadingAction implements Action {
  readonly type = INACTIVE_LOADING;
}

export type acciones = ActiveLoadingAction | InactiveLoadingAction;
