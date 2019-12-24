import {EventEmitter, Injectable, OnDestroy} from '@angular/core';
import {LoadingStateInterface} from '../core/models/loading-state.interface';
import {takeUntil} from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})

export class LoadingService implements OnDestroy{

  public loadingState = new EventEmitter<LoadingStateInterface>();
  public visibility = new EventEmitter<boolean>();
  private _state: LoadingStateInterface ;
  private unsubscribe = new EventEmitter();
  private subscription;
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

  show() {
      this.visibility.emit(true);
  }

  hide() {
    this.visibility.emit(false);
  }

  setHideButton(state: boolean) {
    this._state.hide_btn = state ;
    this.loadingState.emit(this._state);
  }

  subscribeTo(handle: EventEmitter<any>) {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
      this.subscription = handle.pipe(takeUntil(this.unsubscribe)).subscribe(
          state => {
            if (typeof state.stateObj !== 'undefined') {
              this.setLoadingState(state.stateObj);
            }
            if (typeof state.state !== 'undefined') {
              this.state(state.state);
            }
            if (typeof state.message !== 'undefined') {
              this.message(state.message);
            }
            if (typeof state.progress !== 'undefined') {
              this.progress(state.progress);
            }
          }
      );
  }

  ngOnDestroy(){
      this.unsubscribe.next();
      this.unsubscribe.complete();
  }

}
