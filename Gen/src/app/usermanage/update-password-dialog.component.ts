import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-password-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  template: `
    <h2 mat-dialog-title>Update Password</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="w-100">
        <mat-label>New Password</mat-label>
        <input matInput [(ngModel)]="newPassword" type="password">
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary" (click)="dialogRef.close(newPassword)">Update</button>
    </mat-dialog-actions>
  `
})
export class UpdatePasswordDialog {
  newPassword: string = '';
  constructor(
    public dialogRef: MatDialogRef<UpdatePasswordDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
