import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../../core/services/student.service';
import { ErrorService } from '../../../core/services/error.service';
import { Student } from '../../../shared/models/student';
import { HttpErrorResponse } from '@angular/common/http';
import { AccountingService } from '../../../core/services/accounting.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss']
})
export class PaymentFormComponent implements OnInit{
  paymentForm: FormGroup;
  listOfStudents: string[] = [];
  student: Student[] = [];
  snapShotId?: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private studentService: StudentService,
    private accountingService: AccountingService,
    private errorService: ErrorService,
    private route: ActivatedRoute,
  ) {
    this.paymentForm = this.fb.group({
      eleve: ['', Validators.required],
      classe: ['', Validators.required],
      montant: ['', [Validators.required, Validators.min(0)]],
      date: [new Date(), Validators.required],
      motif: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    this.snapShotId = +this.route.snapshot.params['id'];
    if (this.snapShotId) {
      forkJoin({
        students: this.studentService.getAll(),
        payments: this.accountingService.getAllPayments()
      }).subscribe({
        next: ({ students, payments }) => {
          this.student = students;
          this.listOfStudents = students.map(s => `${s.numeroMatricule} ${s.nom} ${s.prenom}`).sort((a, b) => a.localeCompare(b));

          const payment = payments.find(p => p.id === this.snapShotId);
          const student = this.getStudentById(payment!.eleve);

          if (payment && student) {
            this.paymentForm.patchValue({
              eleve: `${student.numeroMatricule} ${student.nom} ${student.prenom}`,
              classe: student.classe,
              montant: payment.montant,
              date: new Date(payment.date),
              motif: payment.motif
            });
          } else {
            this.errorService.handleError(new HttpErrorResponse({ status: 404, statusText: 'Payment or Student not found' }));
          }
        },
        error: (error: HttpErrorResponse) => this.errorService.handleError(error)
      });
    } else {
      // Sinon on charge juste la liste des élèves
      this.getStudendList();
    }
    this.paymentForm.get('eleve')?.valueChanges.subscribe(value => {
      const matricule = value.split(' ')[0]; // Extract the matricule from the selected student
      const selectedStudent = this.getStudentByMatricule(matricule);
      if (selectedStudent) {
        this.paymentForm.patchValue({
          classe: selectedStudent.classe
        });
      }
    });
  } 

  onSubmit() {
    if (this.paymentForm.valid) {
      
      const payment = this.paymentForm.value;
      const studentMatricule = payment.eleve.split(' ')[0]; // Extract the student matricule
      const student = this.getStudentByMatricule(studentMatricule);
      payment.eleve = student?.id;
      payment.id = this.snapShotId; 

      this.snapShotId ? this.updatePaie(payment) : this.createPaie(payment);
    }
     
  }

  createPaie(payment:any) {
    this.accountingService.createPayment(payment).subscribe({
        next: () => {
          this.router.navigate(['/accounting']);
        },
        error: (error : HttpErrorResponse) => this.errorService.handleError(error)
    });
  }


  updatePaie(payment:any){
    this.studentService.updatePaiement(payment).subscribe({
      next: () => {
        this.router.navigate(['/students']);
      },
      error: (error: HttpErrorResponse) => this.errorService.handleError(error)
    }); 
  }

  getStudentByMatricule(matricule: string) {
    return this.student.find(student => student.numeroMatricule === matricule);
  }

  getStudendList(){
    //this.listOfStudents = this.student.map(student => `${student.numeroMatricule} ${student.nom} ${student.prenom}`).sort((a, b) => a.localeCompare(b))
    this.studentService.getAll().subscribe({
      next: (students) => {
        this.student = students;
        this.listOfStudents = students.map(student => `${student.numeroMatricule} ${student.nom} ${student.prenom}`).sort((a, b) => a.localeCompare(b));
      },
      error: (error) => this.errorService.handleError(error)
    });
  }

  getStudentById(id: number): Student | undefined {
    return this.student.find(student => student.id === id);
  }

  cancel() {
    console.log('this.snapShotId', this.snapShotId);
    this.snapShotId ? this.router.navigate(['/students']) : this.router.navigate(['/accounting']);
  }
}