import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from '../components/shared/confirm-dialog/confirm-dialog.component';
import { InputDialogComponent } from '../components/shared/input-dialog/input-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private defaultConfig: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'end',
    verticalPosition: 'top',
  };

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  success(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Fechar', {
      ...this.defaultConfig,
      duration,
      panelClass: ['snackbar-success']
    });
  }

  error(message: string, duration: number = 4000): void {
    this.snackBar.open(message, 'Fechar', {
      ...this.defaultConfig,
      duration,
      panelClass: ['snackbar-error']
    });
  }

  warning(message: string, duration: number = 3500): void {
    this.snackBar.open(message, 'Fechar', {
      ...this.defaultConfig,
      duration,
      panelClass: ['snackbar-warning']
    });
  }

  info(message: string, duration: number = 3000): void {
    this.snackBar.open(message, 'Fechar', {
      ...this.defaultConfig,
      duration,
      panelClass: ['snackbar-info']
    });
  }

  confirm(
    title: string,
    message: string,
    confirmText: string = 'Confirmar',
    cancelText: string = 'Cancelar',
    type: 'warning' | 'danger' | 'info' = 'warning'
  ): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      maxWidth: '90vw',
      data: { title, message, confirmText, cancelText, type },
      disableClose: false,
      panelClass: 'custom-dialog-container'
    });

    return dialogRef.afterClosed();
  }

  prompt(
    title: string,
    label: string,
    initialValue: string = '',
    placeholder: string = '',
    required: boolean = true
  ): Observable<string | null> {
    const dialogRef = this.dialog.open(InputDialogComponent, {
      width: '450px',
      maxWidth: '90vw',
      data: { title, label, initialValue, placeholder, required },
      disableClose: false,
      panelClass: 'custom-dialog-container'
    });

    return dialogRef.afterClosed();
  }
}
