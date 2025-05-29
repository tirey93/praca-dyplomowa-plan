import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToolbarConfig } from './toolbar-config';

@Injectable({
  providedIn: 'root'
})
export class ToolbarService {
  private _toolbarConfig = new BehaviorSubject<ToolbarConfig>(this.defaultState);
  toolbarConfig$: Observable<ToolbarConfig> = this._toolbarConfig.asObservable();

  setToolbarConfig(config: ToolbarConfig): void {
    this._toolbarConfig.next(
      { ...this._toolbarConfig.getValue(), ...config }
    );
  }

  resetToolbarConfig(): void {
    this._toolbarConfig.next(this.defaultState);
  }

  private get defaultState() {
    return {
      isLogin: false
    } as ToolbarConfig
  }
}