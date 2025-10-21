import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

export interface InputDialogData {
  title: string;
  label: string;
  initialValue: string;
  placeholder: string;
  required: boolean;
}

@Component({
  selector: 'app-input-dialog',
  templateUrl: './input-dialog.component.html',
  styleUrls: ['./input-dialog.component.scss']
})
export class InputDialogComponent implements OnInit {
  inputControl!: FormControl;

  constructor(
    public dialogRef: MatDialogRef<InputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: InputDialogData
  ) {}

  ngOnInit(): void {
    const validators = this.data.required ? [Validators.required] : [];
    this.inputControl = new FormControl(this.data.initialValue, validators);
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onConfirm(): void {
    if (this.inputControl.valid) {
      const value = this.inputControl.value?.trim();
      this.dialogRef.close(value || null);
    }
  }

  onEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.inputControl.valid) {
      this.onConfirm();
    }
  }
}
