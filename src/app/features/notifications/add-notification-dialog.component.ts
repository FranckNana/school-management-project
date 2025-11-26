import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-notification-dialog',
  templateUrl: './add-notification-dialog.component.html',
  styleUrls: ['./add-notification-dialog.component.scss']
})
export class AddNotificationDialogComponent {
  notificationForm: FormGroup;
  showDescription = false;
  selectedColor = '#6366f1';

  importanceLevels = [
    { name: 'Faible', color: '#10b981', icon: 'info' },
    { name: 'Moyenne', color: '#f59e0b', icon: 'warning' },
    { name: 'Élevée', color: '#ef4444', icon: 'notification_important' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddNotificationDialogComponent>
  ) {
    this.notificationForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      importance: ['', Validators.required],
      icon: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required]
    });
  }

  onTitleChange(value: string): void {
    this.showDescription = value === 'Divers';
    if (!this.showDescription) {
      this.notificationForm.patchValue({ description: '' });
    }

    let icon = 'notifications';
    switch (value) {
      case 'Réunion des enseignants':
        icon = 'notification_important';
        break;
      case 'Examens 1er trimestre':
      case 'Examens 2ème trimestre':
      case 'Examens 3ème trimestre':
        icon = 'event_available';
        break;
      case 'Conseil de classe':
        icon = 'school';
        break;
      case 'Divers':
        icon = 'event_note';
        break;
    }

    this.notificationForm.patchValue({ icon });
  }

  setImportance(level: any): void {
    this.notificationForm.patchValue({
      importance: level.name
    });
    this.selectedColor = level.color;
  }

  onSave(): void {
    if (this.notificationForm.valid) {
      const { date, time, ...rest } = this.notificationForm.value;
      const formattedTime = new Date(date);
      const [hours, minutes] = time.split(':');
      formattedTime.setHours(+hours, +minutes);
      this.dialogRef.close({
        ...rest,
        dateTime: formattedTime
      });
    }
  }
}
