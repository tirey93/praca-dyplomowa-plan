import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, switchMap } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export class SidenavService {
    private _groupId = new BehaviorSubject<number | null>(null);
    groupId$: Observable<number | null> = this._groupId.asObservable();
    groupSelected$: Observable<boolean> = this.groupId$.pipe(
        switchMap((groupId) => groupId ? of(true) : of(false))
    );

    selectGroup(groupId: number) {
        this._groupId.next(groupId);
    }

    unselectGroup() {
        this._groupId.next(null);
    }
  }