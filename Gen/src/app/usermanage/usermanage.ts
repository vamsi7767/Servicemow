import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { UserService } from '../services/user';
import { UpdatePasswordDialog } from './update-password-dialog.component';

@Component({
  selector: 'app-usermanage',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './usermanage.html',
  styleUrls: ['./usermanage.css']
})
export class Usermanage implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'role','actions'];
  dataSource = new MatTableDataSource<any>([]);

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe(data => {
      this.dataSource.data = data;
    });
  }

  updatePassword(id: number, newPassword: string) {
    this.userService.updatePassword(id, newPassword).subscribe(() => {
      this.snackBar.open('✅ Password updated successfully!', 'Close', { duration: 3000 });
      this.loadUsers();
    });
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe(() => {
      this.snackBar.open('🗑️ User deleted successfully!', 'Close', { duration: 3000 });
      this.loadUsers();
    });
  }

 openUpdateDialog(user: any) {
    const dialogRef = this.dialog.open(UpdatePasswordDialog, {
      width: '400px',
      data: { user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updatePassword(user.id, result);
      }
    });
  }

  goBack(): void {
  window.history.back(); // simple back navigation
}
}
