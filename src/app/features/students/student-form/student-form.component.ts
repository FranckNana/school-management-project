import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from '../../../shared/models/student';
import { StudentService } from '../../../core/services/student.service';
import { ErrorService } from '../../../core/services/error.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss']
})
export class StudentFormComponent implements OnInit {
  studentForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  classes = ['6ème A', '6ème B', '5ème A', '5ème B', '4ème A', '4ème B', '3ème A', '3ème B'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService,
    private errorService: ErrorService,
    private snackBar: MatSnackBar
  ) {
    this.studentForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      dateNaissance: ['', [Validators.required, this.ageValidator]],
      classe: ['', Validators.required],
      nomParent: ['', [Validators.required, Validators.minLength(2)]],
      telephoneParent: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      adresse: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.loadStudent(id);
    }
  }

  loadStudent(id: number): void {
    this.isLoading = true;
    this.studentService.getById(id).subscribe({
      next: (student) => {
        this.studentForm.patchValue(student);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorService.handleError(error);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      this.isLoading = true;
      const student = this.studentForm.value;

      const operation = this.isEditMode
        ? this.studentService.update(this.route.snapshot.params['id'], student)
        : this.studentService.create(student);

      operation.subscribe({
        next: () => {
          this.snackBar.open(
            `Élève ${this.isEditMode ? 'modifié' : 'ajouté'} avec succès`,
            'Fermer',
            { duration: 3000 }
          );
          this.router.navigate(['/students']);
        },
        error: (error) => {
          this.errorService.handleError(error);
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.studentForm);
    }
  }

  cancel(): void {
    this.router.navigate(['/students']);
  }

  // Validateurs personnalisés
  private ageValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const birthDate = new Date(control.value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    return age < 10 || age > 20 ? { invalidAge: true } : null;
  }

  // Utilitaire pour marquer tous les champs comme touchés
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Getters pour les messages d'erreur
  getErrorMessage(controlName: string): string {
    const control = this.studentForm.get(controlName);
    if (!control?.errors || !control.touched) return '';

    const errors = control.errors;
    if (errors['required']) return 'Ce champ est requis';
    if (errors['minlength']) {
      return `Minimum ${errors['minlength'].requiredLength} caractères`;
    }
    if (errors['pattern']) return 'Numéro de téléphone invalide (8 chiffres)';
    if (errors['invalidAge']) return 'L\'âge doit être entre 10 et 20 ans';

    return 'Champ invalide';
  }
}