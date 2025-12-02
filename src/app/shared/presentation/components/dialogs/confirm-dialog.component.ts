import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  icon?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>
        <mat-icon *ngIf="data.icon">{{ data.icon }}</mat-icon>
        {{ data.title }}
      </h2>
      
      <mat-dialog-content>
        <p>{{ data.message }}</p>
      </mat-dialog-content>
      
      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">
          {{ data.cancelText || 'Cancelar' }}
        </button>
        <button mat-raised-button color="primary" (click)="onConfirm()">
          {{ data.confirmText || 'Confirmar' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    :host ::ng-deep .mat-mdc-dialog-container {
      max-height: none !important;
      overflow: visible !important;
    }

    :host ::ng-deep .mat-mdc-dialog-surface {
      overflow: visible !important;
      padding: 0 !important;
      min-height: auto !important;
      height: auto !important;
    }

    .dialog-container {
      padding: 24px 24px 8px 24px;
    }

    h2[mat-dialog-title] {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 0 0 16px 0;
      padding: 0;
      font-size: 20px;
      font-weight: 600;
      color: #333;
      font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    h2[mat-dialog-title] mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: var(--primary-main);
    }

    mat-dialog-content {
      padding: 0 0 20px 0;
      max-height: none;
      overflow-y: visible;
    }

    mat-dialog-content p {
      margin: 0;
      font-size: 15px;
      color: #333;
      line-height: 1.6;
    }

    mat-dialog-actions {
      padding: 8px 0 0 0;
      margin: 0;
      gap: 12px;
      border-top: 1px solid #EAEAEA;
    }

    mat-dialog-actions button {
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      padding: 0 24px;
      height: 40px;
    }

    mat-dialog-actions button[mat-button] {
      color: #8A8A8A;
    }

    mat-dialog-actions button[mat-raised-button] {
      box-shadow: 0 2px 8px rgba(102, 178, 160, 0.3);
    }

    mat-dialog-actions button[mat-raised-button]:hover {
      box-shadow: 0 4px 12px rgba(102, 178, 160, 0.4);
      transform: translateY(-1px);
      transition: all 0.2s ease;
    }

    @media (max-width: 640px) {
      .dialog-container {
        padding: 20px;
      }
      
      mat-dialog-content {
        padding: 0 0 16px 0;
      }
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) { }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
