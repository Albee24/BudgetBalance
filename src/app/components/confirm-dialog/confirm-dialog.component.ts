import { Component, ElementRef, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ManageBudgetDialogComponent } from '../manage-budget-dialog/manage-budget-dialog.component';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ManageBudgetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  proceed() {
    this.dialogRef.close(true);
  }

  cancel() {
    this,this.dialogRef.close(false);
  }
}