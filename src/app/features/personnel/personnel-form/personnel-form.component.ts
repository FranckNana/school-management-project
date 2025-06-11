import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Personnel } from '../../../shared/models/personnel';
import { PersonnelService } from '../../../core/services/personnel.service';
import { ErrorService } from '../../../core/services/error.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-personnel-form',
  templateUrl: './personnel-form.component.html',
  styleUrls: ['./personnel-form.component.scss']
})
export class PersonnelFormComponent implements OnInit {
  id! : number;
  personnelForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  postes = ['Enseignant', 'Secrétaire', 'Vigile', 'Comptable', 'Directeur'];
  matieres = [
    'SVT', 
    'PHILOSOPHIE', 
    'CHIMIE', 
    'MATHEMATIQUES', 
    'ANGLAIS', 
    'PHYSIQUE', 
    'HISTOIRE', 
    'FRANCAIS', 
    'GEOGRAPHIE', 
    'EPS'
  ];


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private personnelService: PersonnelService,
    private errorService: ErrorService,
    private snackBar: MatSnackBar
  ) {
    this.personnelForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      dateNaissance: ['', [Validators.required, this.ageValidator]],
      telephone: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      email: ['', [Validators.required, Validators.email]],
      adresse: ['', [Validators.required, Validators.minLength(5)]],
      poste: ['', Validators.required],
      dateEmbauche: ['', [Validators.required, this.embaucheValidator]],
      salaire: ['', [Validators.required, Validators.min(30000)]],
      matieres: [[]]
    });

    // Afficher/masquer le champ matières en fonction du poste
    this.personnelForm.get('poste')?.valueChanges.subscribe(poste => {
      const matieresControl = this.personnelForm.get('matieres');
      if (poste === 'Enseignant') {
        matieresControl?.setValidators([Validators.required, Validators.minLength(1)]);
      } else {
        matieresControl?.clearValidators();
        matieresControl?.setValue([]);
      }
      matieresControl?.updateValueAndValidity();
    });

    // Ajuster le salaire minimum en fonction du poste
    this.personnelForm.get('poste')?.valueChanges.subscribe(poste => {
      const salaireControl = this.personnelForm.get('salaire');
      let minSalaire = 30000;
      
      switch (poste) {
        case 'Directeur':
          minSalaire = 10000;
          break;
        case 'Enseignant':
          minSalaire = 10000;
          break;
        case 'Comptable':
          minSalaire = 10000;
          break;
        case 'Secrétaire':
          minSalaire = 10000;
          break;
        case 'Vigile':
          minSalaire = 10000;
          break;
      }
      
      salaireControl?.setValidators([
        Validators.required,
        Validators.min(minSalaire)
      ]);
      salaireControl?.updateValueAndValidity();
    });
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.isEditMode = true;
      this.loadPersonnel(this.id);
    }
  }

  loadPersonnel(id: number): void {
    this.isLoading = true;
    this.personnelService.getById(id).subscribe({
      next: (personnel) => {
        this.personnelForm.patchValue(personnel);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorService.handleError(error);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.personnelForm.valid) {
      this.isLoading = true;
      const personnel = this.personnelForm.value;
      const operation = this.isEditMode
        ? this.personnelService.update(this.id, personnel)
        : this.personnelService.create(personnel);

      operation.subscribe({
        next: () => {
          this.snackBar.open(
            `Membre du personnel ${this.isEditMode ? 'modifié' : 'ajouté'} avec succès`,
            'Fermer',
            { duration: 3000 }
          );
          this.router.navigate(['/personnel']);
        },
        error: (error) => {
          this.errorService.handleError(error);
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.personnelForm);
    }
  }

  cancel(): void {
    this.router.navigate(['/personnel']);
  }

  // Validateurs personnalisés
  private ageValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const birthDate = new Date(control.value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    return age < 18 || age > 65 ? { invalidAge: true } : null;
  }

  private embaucheValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const embaucheDate = new Date(control.value);
    const today = new Date();
    
    return embaucheDate > today ? { futureDate: true } : null;
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
    const control = this.personnelForm.get(controlName);
    if (!control?.errors || !control.touched) return '';

    const errors = control.errors;
    if (errors['required']) return 'Ce champ est requis';
    if (errors['email']) return 'Email invalide';
    if (errors['minlength']) {
      return `Minimum ${errors['minlength'].requiredLength} caractères`;
    }
    if (errors['pattern']) return 'Numéro de téléphone invalide (8 chiffres)';
    if (errors['min']) {
      const minSalaire = errors['min'].min;
      return `Le salaire minimum pour ce poste est de ${minSalaire.toLocaleString()} FCFA`;
    }
    if (errors['invalidAge']) return 'L\'âge doit être entre 18 et 65 ans';
    if (errors['futureDate']) return 'La date ne peut pas être dans le futur';

    return 'Champ invalide';
  }
}