import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  defaultDuration: number = 3000;

  constructor(private snackBar: MatSnackBar) {}

  showSuccess(message: string, action: string = 'Close'): void {
    this.snackBar.open(message, action, {
      duration: this.defaultDuration,
      panelClass: ['success-toast'],
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  showError(message: string, action: string = 'Close'): void {
    this.snackBar.open(message, action, {
      duration: this.defaultDuration,
      panelClass: ['error-toast'],
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  showInfo(message: string, action: string = 'Close'): void {
    this.snackBar.open(message, action, {
      duration: this.defaultDuration,
      panelClass: ['info-toast'],
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  showWarning(message: string, action: string = 'Close'): void {
    this.snackBar.open(message, action, {
      duration: this.defaultDuration,
      panelClass: ['warning-toast'],
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
}
