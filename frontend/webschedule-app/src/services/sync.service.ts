import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, Subject, switchMap } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export class SyncService {
    private _groupId = new BehaviorSubject<number | null>(null);
    groupId$: Observable<number | null> = this._groupId.asObservable();
    groupSelected$: Observable<boolean> = this.groupId$.pipe(
        switchMap((groupId) => groupId ? of(true) : of(false))
    );
    refreshGroups$ = new Subject<void>();

    selectGroup(groupId: number) {
        this._groupId.next(groupId);
    }

    unselectGroup() {
        this._groupId.next(null);
    }
  }