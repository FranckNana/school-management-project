import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Schedule } from '../../../shared/models/schedule';
import { ScheduleService } from '../../../core/services/schedule.service';
import { ErrorService } from '../../../core/services/error.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-schedule-form',
  templateUrl: './schedule-form.component.html',
  styleUrls: ['./schedule-form.component.scss']
})
export class ScheduleFormComponent implements OnInit {
  scheduleForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  classes = ['6ème A', '6ème B', '5ème A', '5ème B', '4ème A', '4ème B', '3ème A', '3ème B'];
  matieres = ['Mathématiques', 'Français', 'Anglais', 'Histoire-Géographie', 'SVT', 'Physique-Chimie'];
  jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'] as const;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private scheduleService: ScheduleService,
    private errorService: ErrorService,
    private snackBar: MatSnackBar
  ) {
    this.scheduleForm = this.fb.group({
      classe: ['', Validators.required],
      jour: ['', Validators.required],
      heureDebut: ['', [Validators.required, this.timeValidator]],
      heureFin: ['', [Validators.required, this.timeValidator]],
      matiere: ['', Validators.required],
      enseignant: ['', [Validators.required, Validators.minLength(3)]],
      salle: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9\s-]+$/)]]
    }, { validators: this.timeRangeValidator });
  }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.loadSchedule(Number(id));
    }
  }

  loadSchedule(id: number): void {
    this.isLoading = true;
    this.scheduleService.getById(id).subscribe({
      next: (schedule) => {
        this.scheduleForm.patchValue(schedule);
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorService.handleError(error);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.scheduleForm.valid) {
      this.isLoading = true;
      const schedule = this.scheduleForm.value;

      const operation = this.isEditMode
        ? this.scheduleService.update(Number(this.route.snapshot.params['id']), schedule)
        : this.scheduleService.create(schedule);

      operation.subscribe({
        next: () => {
          this.snackBar.open(
            `Cours ${this.isEditMode ? 'modifié' : 'ajouté'} avec succès`,
            'Fermer',
            { duration: 3000 }
          );
          this.router.navigate(['/schedule']);
        },
        error: (error: HttpErrorResponse) => {
          this.errorService.handleError(error);
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.scheduleForm);
    }
  }

  cancel(): void {
    this.router.navigate(['/schedule']);
  }

  private timeValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(control.value) ? null : { invalidTime: true };
  }

  private timeRangeValidator(group: AbstractControl): ValidationErrors | null {
    const start = group.get('heureDebut')?.value;
    const end = group.get('heureFin')?.value;

    if (!start || !end) return null;

    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
    
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    if (startTime >= endTime) {
      return { invalidTimeRange: true };
    }

    if (endTime - startTime > 180) { // Max 3 heures
      return { tooLong: true };
    }

    return null;
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.scheduleForm.get(controlName);
    if (!control?.errors || !control.touched) return '';

    const errors = control.errors;
    if (errors['required']) return 'Ce champ est requis';
    if (errors['minlength']) {
      return `Minimum ${errors['minlength'].requiredLength} caractères`;
    }
    if (errors['pattern']) return 'Format invalide';
    if (errors['invalidTime']) return 'Format d\'heure invalide (HH:MM)';
    if (errors['invalidTimeRange']) return 'L\'heure de fin doit être après l\'heure de début';
    if (errors['tooLong']) return 'La durée maximum est de 3 heures';

    return 'Champ invalide';
  }
}