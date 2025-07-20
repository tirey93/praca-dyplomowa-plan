import { Component } from '@angular/core';
import { MatDialog, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { CreateGroupDialogComponent } from '../create-group-dialog/create-group-dialog.component';
import { SearchGroupComponent } from "../search-group/search-group.component";

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
    private readonly dialog: MatDialog,
    private dialogRef: MatDialogRef<SearchGroupDialogComponent>
  ) {
  }

  handleCreateNewGroup() {
    this.dialog.open(CreateGroupDialogComponent, {
      maxWidth: '100vw',
      autoFocus: false
    }).afterClosed().subscribe((result:boolean) => {
      if(result)
        this.dialogRef.close(result);
    })
  }
}
