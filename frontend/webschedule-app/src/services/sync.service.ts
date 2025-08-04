import { Injectable } from "@angular/core";
import { BehaviorSubject, distinctUntilChanged, filter, Observable, of, shareReplay, Subject, switchMap } from "rxjs";
import { UserGroupResponse } from "./userInGroup/dtos/userGroupResponse";
import { UserInGroupService } from "./userInGroup/userInGroup.service";

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
    refreshActivities$ = new Subject<void>();

    currentUserGroup$: Observable<UserGroupResponse | null>;
    
    constructor(
        userInGroupRepository: UserInGroupService
    ) {
        this.currentUserGroup$ = this.groupId$.pipe(
            distinctUntilChanged(),
            switchMap(groupId => {
                return groupId ? userInGroupRepository.getLoggedInByGroup$(groupId) : of(null)}),
            shareReplay(1) 
        )
    }
    selectGroup(groupId: number) {
        this._groupId.next(groupId);
    }

    unselectGroup() {
        this._groupId.next(null);
    }
  }