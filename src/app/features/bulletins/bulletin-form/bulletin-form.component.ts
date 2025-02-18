import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BulletinService } from '../../../core/services/bulletin.service';
import { StudentService } from '../../../core/services/student.service';
import { ErrorService } from '../../../core/services/error.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-bulletin-form',
  templateUrl: './bulletin-form.component.html',
  styleUrls: ['./bulletin-form.component.scss']
})
export class BulletinFormComponent implements OnInit {
  bulletinForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  students: any[] = [];
  matieres = [
    'Mathématiques',
    'Français',
    'Anglais',
    'Histoire-Géographie',
    'SVT',
    'Physique-Chimie'
  ];
  trimestres = [1, 2, 3];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private bulletinService: BulletinService,
    private studentService: StudentService,
    private errorService: ErrorService,
    private snackBar: MatSnackBar
  ) {
    this.bulletinForm = this.fb.group({
      eleveId: ['', Validators.required],
      trimestre: ['', Validators.required],
      annee: [new Date().getFullYear(), Validators.required],
      notes: this.fb.array([]),
      appreciation: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadStudents();
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.loadBulletin(id);
    } else {
      this.initializeNotes();
    }
  }

  get notesArray() {
    return this.bulletinForm.get('notes') as FormArray;
  }

  private loadStudents() {
    this.studentService.getAll().subscribe({
      next: (students) => {
        this.students = students;
      },
      error: (error) => {
        this.errorService.handleError(error);
      }
    });
  }

  private loadBulletin(id: number) {
    this.isLoading = true;
    this.bulletinService.getById(id).subscribe({
      next: (bulletin) => {
        this.bulletinForm.patchValue({
          eleveId: bulletin.eleveId,
          trimestre: bulletin.trimestre,
          annee: bulletin.annee,
          appreciation: bulletin.appreciation
        });
        
        bulletin.notes.forEach(note => {
          this.notesArray.push(this.createNoteFormGroup(note));
        });
        
        this.isLoading = false;
      },
      error: (error) => {
        this.errorService.handleError(error);
        this.isLoading = false;
      }
    });
  }

  private initializeNotes() {
    this.matieres.forEach(matiere => {
      this.notesArray.push(this.createNoteFormGroup({
        matiere,
        note: 0,
        coefficient: 1,
        appreciation: ''
      }));
    });
  }

  private createNoteFormGroup(note: any) {
    return this.fb.group({
      matiere: [note.matiere, Validators.required],
      note: [note.note, [Validators.required, Validators.min(0), Validators.max(20)]],
      coefficient: [note.coefficient, [Validators.required, Validators.min(1)]],
      appreciation: [note.appreciation]
    });
  }

  calculateMoyenne(): number {
    let totalPoints = 0;
    let totalCoefficients = 0;

    this.notesArray.controls.forEach(control => {
      const note = control.get('note')?.value || 0;
      const coefficient = control.get('coefficient')?.value || 1;
      totalPoints += note * coefficient;
      totalCoefficients += coefficient;
    });

    return totalCoefficients > 0 ? totalPoints / totalCoefficients : 0;
  }

  onSubmit() {
    if (this.bulletinForm.valid) {
      this.isLoading = true;
      const bulletinData = {
        ...this.bulletinForm.value,
        moyenneGenerale: this.calculateMoyenne(),
        dateGeneration: new Date()
      };

      const operation = this.isEditMode
        ? this.bulletinService.update(this.route.snapshot.params['id'], bulletinData)
        : this.bulletinService.create(bulletinData);

      operation.subscribe({
        next: () => {
          this.snackBar.open(
            `Bulletin ${this.isEditMode ? 'modifié' : 'généré'} avec succès`,
            'Fermer',
            { duration: 3000 }
          );
          this.router.navigate(['/bulletins']);
        },
        error: (error) => {
          this.errorService.handleError(error);
          this.isLoading = false;
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/bulletins']);
  }
}