import { Component, OnInit } from '@angular/core';
import { IssueServiceTs } from '../../service/issue-service.ts';
import { AuthService } from '../../service/auth-service.js';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AiService } from '../../service/AiService .js';
 

@Component({
  selector: 'app-create-issue-component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatSnackBarModule
  ],
  templateUrl: './create-issue-component.html',
  styleUrl: './create-issue-component.css',
})
export class CreateIssueComponent implements OnInit {

  users: any[] = [];

  issue = {
    title: '',
    description: '',
    status: 'OPEN',
    assignedTo: null as { id: number } | null,
    createdBy: { id: null as number | null }
  };

  loadingDescription = false;
  fixingGrammar = false;
  history: string[] = [];
  showCompareModal = false;

  constructor(
    private issueService: IssueServiceTs,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private ai: AiService
  ) {}

  ngOnInit(): void {
    this.issueService.getAllUsers().subscribe(res => this.users = res);
    const currentUser = this.auth.getUser();
    if (currentUser?.id) {
      this.issue.createdBy = { id: currentUser.id };
    }
  }

  generateDescriptionFromAI(): void {
    if (!this.issue.title?.trim()) return;

    this.loadingDescription = true;

    this.ai.askAI(this.issue.title).subscribe({
      next: (description: string) => {
        if (description?.trim()) {
          this.issue.description = description.trim();
          this.history.unshift(description.trim());
        }
        this.loadingDescription = false;
      },
      error: (err) => {
        console.error('AI generation failed:', err);
        this.loadingDescription = false;
        this.snackBar.open('AI failed to generate description', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['issue-error-snackbar']
        });
      }
    });
  }

  fixGrammar(): void {
    if (!this.issue.description?.trim()) return;

    this.fixingGrammar = true;

    this.ai.fixGrammar(this.issue.description).subscribe({
      next: (corrected: string) => {
        if (corrected?.trim()) {
          this.issue.description = corrected.trim();
        }
        this.fixingGrammar = false;
      },
      error: (err) => {
        console.error('Grammar fix failed:', err);
        this.fixingGrammar = false;
        this.snackBar.open('Grammar fix failed', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['issue-error-snackbar']
        });
      }
    });
  }

  regenerateDescription(): void {
    this.generateDescriptionFromAI();
  }

  openCompareModal(): void {
    if (this.history.length > 1) this.showCompareModal = true;
  }

  closeCompareModal(): void {
    this.showCompareModal = false;
  }

  selectSuggestion(suggestion: string): void {
    this.issue.description = suggestion;
    this.showCompareModal = false;
  }

  createIssue(): void {
    this.issueService.createIssue(this.issue).subscribe({
      next: () => {
        this.snackBar.open('Issue created successfully', 'Close', {
          duration: 2500,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['issue-success-snackbar']
        });
        this.router.navigate(['admin']);
      },
      error: (err) => {
        const message = err?.error?.message || 'Failed to create issue';
        this.snackBar.open(message, 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['issue-error-snackbar']
        });
      }
    });
  }
}