import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpErrorResponse } from '@angular/common/http';
import { Student } from '../../../shared/models/student';
import { StudentService } from '../../../core/services/student.service';
import { ErrorService } from '../../../core/services/error.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.scss']
})
export class StudentsListComponent implements OnInit {
  displayedColumns: string[] = ['matricule', 'nom', 'classe', 'parent', 'telephone', 'actions'];
  dataSource: MatTableDataSource<Student>;
  classes = ['6ème A', '6ème B', '5ème A', '5ème B', '4ème A', '4ème B', '3ème A', '3ème B'];
  
  selectedClasse: string | null = null;
  searchText = '';
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private studentService: StudentService,
    private dialog: MatDialog,
    private errorService: ErrorService
  ) {
    this.dataSource = new MatTableDataSource<Student>();
  }

  ngOnInit(): void {
    this.loadStudents();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = this.createFilter();
  }

  createFilter(): (data: Student, filter: string) => boolean {
    return (data: Student, filter: string) => {
      try {
        const searchTerms = JSON.parse(filter);
        
        const matchesSearch = !searchTerms.searchText || 
          Object.keys(data).some(key => {
            const value = data[key as keyof Student];
            return value !== undefined && 
              typeof value === 'string' && 
              value.toLowerCase().includes(searchTerms.searchText.toLowerCase());
          });
        
        const matchesClasse = !searchTerms.classe || data.classe === searchTerms.classe;

        return matchesSearch && matchesClasse;
      } catch {
        return true; // Return true if filter is invalid
      }
    };
  }

  loadStudents(): void {
    this.studentService.getAll().subscribe({
      next: (students) => {
        this.dataSource.data = students;
        this.applyFilters();
      },
      error: (error: HttpErrorResponse) => {
        this.errorService.handleError(error);
      }
    });
  }

  applyFilter(searchText: string): void {
    this.searchText = searchText;
    this.applyFilters();
  }

  applyFilters(): void {
    const filterValue = JSON.stringify({
      searchText: this.searchText,
      classe: this.selectedClasse
    });
    
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addStudent(): void {
    this.router.navigate(['/students/new']);
  }

  editStudent(student: Student): void {
    this.router.navigate(['/students/edit', student.id]);
  }

  viewStudent(student: Student): void {
    this.router.navigate(['/students/details', student.id]);
  }

  deleteStudent(student: Student): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmer la suppression',
        message: `Êtes-vous sûr de vouloir supprimer l'élève ${student.nom} ${student.prenom} ?`,
        confirmText: 'Supprimer',
        cancelText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.studentService.delete(student.id).subscribe({
          next: () => {
            this.loadStudents();
          },
          error: (error: HttpErrorResponse) => {
            this.errorService.handleError(error);
          }
        });
      }
    });
  }
}