import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AiService } from '../service/AiService ';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-issue-comments-dialog',
  standalone: true,

  // ================= TEMPLATE =================
  template: `
    
    <!-- Main dialog wrapper -->
    <div class="comments-dialog">

      <!-- Dialog title -->
      <h2 mat-dialog-title>
        Comments for Issue #{{ data.issue.id }}
      </h2>

      <!-- Dialog content -->
      <mat-dialog-content>

        <!-- Existing comments section -->
        <div class="comment-list">

          <!-- Single comment item -->
          <div class="comment-item"
               *ngFor="let c of data.issue.comments">

            <!-- Comment header -->
            <div class="comment-meta">

              <!-- User avatar -->
              <div class="comment-avatar">
                {{ c.user?.name?.charAt(0) }}
              </div>

              <!-- User details -->
              <div>
                <div class="comment-author">
                  {{ c.user?.name }}
                </div>

                <div class="comment-date">
                  {{ c.createdAt | date:'short' }}
                </div>
              </div>

            </div>

            <!-- Comment message -->
            <div class="comment-text">
              {{ c.message }}
            </div>

          </div>
        </div>

        <!-- Add new comment -->
        <div class="comment-input-wrap">

          <!-- Textarea input -->
          <textarea
            class="comment-textarea"
            [(ngModel)]="commentText"
            placeholder="Write your comment here...">
          </textarea>

          <!-- Grammar fix button -->
          <button
            class="grammar-fix-btn"
            (click)="fixGrammar()"
            [disabled]="fixingGrammar || !commentText.trim()">

            {{ fixingGrammar ? 'Fixing...' : 'Fix Grammar' }}

          </button>

        </div>

      </mat-dialog-content>

      <!-- Footer actions -->
      <div class="dialog-actions">

        <!-- Close button -->
        <button
          class="btn-cancel"
          mat-dialog-close>
          Close
        </button>

        <!-- Submit button -->
        <button
          class="btn-submit"
          (click)="submitComment()">

          Submit

        </button>

      </div>

    </div>
  `,

  // ================= IMPORTS =================
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule
  ],

  // ================= STYLE FILE =================
  styleUrl: 'comments.css'
})

export class IssueCommentsDialog {

  // Stores textarea value
  commentText: string = '';

  // Controls grammar fixing loader
  fixingGrammar = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ai: AiService,
    private snackBar: MatSnackBar
  ) {}

  // ================= FIX GRAMMAR =================
  fixGrammar() {

    // Prevent empty input
    if (!this.commentText?.trim()) return;

    // Enable loading state
    this.fixingGrammar = true;

    // Call AI grammar correction API
    this.ai.fixGrammar(this.commentText).subscribe({

      // Success response
      next: (corrected: string) => {

        // Replace textarea content
        if (corrected?.trim()) {
          this.commentText = corrected.trim();
        }

        // Disable loader
        this.fixingGrammar = false;
      },

      // Error handling
      error: (err) => {

        console.error('Grammar fix failed:', err);

        // Disable loader
        this.fixingGrammar = false;

        // Show snackbar message
        this.snackBar.open(
          'Grammar fix failed',
          'Close',
          {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['issue-error-snackbar']
          }
        );
      }
    });
  }

  // ================= SUBMIT COMMENT =================
  submitComment() {

    // Prevent empty comments
    if (this.commentText.trim()) {

      // Submit comment
      this.data.onSubmit(
        this.data.issue.id,
        this.commentText
      );

      // Clear textarea
      this.commentText = '';
    }
  }
}