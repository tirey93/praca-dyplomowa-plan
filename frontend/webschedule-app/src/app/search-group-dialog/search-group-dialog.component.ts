import { Component } from '@angular/core';
import { MatDialog, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { CreateGroupComponent } from '../create-group-dialog/create-group.component';
import { SearchGroupComponent } from "../search-group/search-group.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-group-dialog',
  imports: [
    MatDialogContent, MatDialogTitle,
    SearchGroupComponent
],
  templateUrl: './search-group-dialog.component.html',
  styleUrl: './search-group-dialog.component.scss'
})
export class SearchGroupDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<SearchGroupDialogComponent>,
    private router: Router
  ) {
  }

  handleCreateNewGroup() {
    this.router.navigateByUrl("/create-group");
    this.dialogRef.close();
  }
}
