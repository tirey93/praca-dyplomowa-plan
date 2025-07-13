import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
  })
  export class SnackBarService {

    constructor(
        private snackBar: MatSnackBar,
        private translate: TranslateService) { }

    public openError(error: HttpErrorResponse) {
        if(error.status === 500 || error.status === 0) {
          this.snackBar.open(
            this.translate.instant('snackbar.unknown.error'), 
            this.translate.instant('snackbar.dismiss'),
            { duration: 10000 });
          console.error(error.error.message)
        } else{
          this.snackBar.open(
            this.translate.instant(error.error.code, error.error.params), 
            this.translate.instant('snackbar.dismiss'),
            { duration: 10000 });
        }
    }
    
    public openMessage(key: string, duration: number = 5000) {
      this.snackBar.open(
          this.translate.instant(key), 
          this.translate.instant('snackbar.dismiss'),
          { duration: duration });
    }
  }