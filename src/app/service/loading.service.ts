import {EventEmitter, Injectable} from '@angular/core';
import {LoadingStateInterface} from '../core/models/loading-state.interface';

@Injectable({
  providedIn: 'root'
})

export class LoadingService {

  public loadingState = new EventEmitter<LoadingStateInterface>();
  private _state: LoadingStateInterface ;

  constructor() { }


  setLoadingState(state: LoadingStateInterface): void {
    this.loadingState.emit(state) ;
    this._state = state ;
  }

  progress(progress: number) {
    this._state.progress = progress;
    this.loadingState.emit(this._state);
  }

  message(message: string) {
    this._state.message = message ;
    this.loadingState.emit(this._state) ;
  }

  state(state: boolean) {
    this._state.state = state ;
    this.loadingState.emit(this._state);
  }

  setHideButton(state: boolean) {
    this._state.hide_btn = state ;
    this.loadingState.emit(this._state);
  }

}
