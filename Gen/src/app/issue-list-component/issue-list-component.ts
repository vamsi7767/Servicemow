import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IssueServiceTs } from '../service/issue-service.ts';
import { Observable } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../service/auth-service.js';
import { isPlatformBrowser } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { IssueDescriptionDialog } from './IssueDescriptionDialog.js';
import { IssueCommentsDialog } from './Issuecomments.js';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';
 
@Component({
  selector: 'app-issue-list-component',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    AsyncPipe,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatDialogModule,
    MatSelectModule,
    MatOptionModule,
    RouterModule
    
  ],
  templateUrl: './issue-list-component.html',
  styleUrls: ['./issue-list-component.css'],
})
export class IssueListComponent {
  
  users: any[] = [];
  selectedStatus: string = ''; 
  selectedUserId: number | null = null;
  searchTerm: string = '';

  displayedColumns: string[] = [
    'id', 'title', 'status', 'createdBy', 'assignedTo',
    'createdAt', 'updatedAt', 'description', 'actions'
  ];

  issues$!: Observable<any[]>;

  constructor(
    private issueService: IssueServiceTs,
    private snackBar: MatSnackBar,
    private auth: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private dialog: MatDialog   // ✅ Inject MatDialog
  ) {
    this.loadIssues();
    this.loadUsers();
  }

  loadIssues(): void {
    const user = this.auth.getUser();
    if (user?.role === 'ADMIN') {
      this.issues$ = this.issueService.getAllIssues();
    } else {
      this.issues$ = this.issueService.getByAssigned(user.id);
    }
  }

filterIssues(): void {
  const status = this.selectedStatus;
  const userId = this.selectedUserId;

  // Case 1: All + All → all tickets
  if (!status && !userId) {
    this.loadIssues();
    return;
  }

  // Case 2: Status + User → tickets for that user with that status
  if (status && userId) {
    this.issues$ = this.issueService.getByStatusAndUser(status, userId);
    return;
  }

  // Case 3: Status only → all tickets with that status
  if (status && !userId) {
    this.issues$ = this.issueService.getByStatus(status);
    return;
  }

  // Case 4: User only → all tickets for that user
  if (!status && userId) {
    this.issues$ = this.issueService.getByAssigned(userId);
    return;
  }
}

  loadUsers(): void {
    this.issueService.getAllUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error('Error loading users', err)
    });
  }

  deleteIssue(id: number): void {
    this.issueService.deleteIssue(id).subscribe({
      next: () => {
        this.snackBar.open('Issue deleted', 'Close', { duration: 2000 });
        this.loadIssues();
      },
      error: (err) => console.error('Error deleting issue', err),
    });
  }

  updateStatus(id: number, status: string): void {
    this.issueService.updateStatus(id, status, 1).subscribe({
      next: () => {
        this.snackBar.open(`Status updated to ${status}`, 'Close', { duration: 2000 });
        this.loadIssues();
      },
      error: (err) => console.error('Error updating status', err),
    });
  }

  addComment(issueId: number, message: string): void {
    const userId = this.getLoggedInUserId();
    if (!message) {
      this.snackBar.open('Please enter a comment', 'Close', { duration: 2000 });
      return;
    }

    this.issueService.addComment(issueId, userId, message).subscribe({
      next: () => {
        this.snackBar.open('Comment added successfully', 'Close', { duration: 2000 });
        this.loadIssues();
      },
      error: (err) => console.error('Error adding comment', err),
    });
  }

  getLoggedInUserId(): number {
    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem('user');
      if (userJson) {
        try {
          const user = JSON.parse(userJson);
          return user.id;
        } catch {
          return 0;
        }
      }
    }
    return 0;
  }

  openDescription(issue: any): void {
    this.dialog.open(IssueDescriptionDialog, {
      width: '500px',
      data: { description: issue.description }
    });
  }

  openComments(issue: any): void {
  this.dialog.open(IssueCommentsDialog, {
    width: '600px',
    data: {
      issue,
      onSubmit: (issueId: number, message: string) => this.addComment(issueId, message)
    }
  });
}
searchIssues(): void {
  if (this.searchTerm.trim()) {
    this.issues$ = this.issueService.searchIssues(this.searchTerm);
  } else {
    this.loadIssues(); // reload default if empty
  }
}

goBack(): void {
  window.history.back(); // simple back navigation
}


getInitials(name: string | undefined): string {
  if (!name) return '?';
  return name.slice(0, 2).toUpperCase();
}
}
