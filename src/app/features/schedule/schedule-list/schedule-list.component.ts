import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Schedule } from '../../../shared/interfaces/schedule.interface';
import { ScheduleService } from '../../../core/services/schedule.service';
import { ErrorService } from '../../../core/services/error.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-schedule-list',
  templateUrl: './schedule-list.component.html',
  styleUrls: ['./schedule-list.component.scss']
})
export class ScheduleListComponent implements OnInit {
  displayedColumns: string[] = ['jour', 'heures', 'matiere', 'enseignant', 'salle', 'actions'];
  dataSource: { [key: string]: MatTableDataSource<Schedule> } = {};
  classes = ['6ème A', '6ème B', '5ème A', '5ème B', '4ème A', '4ème B', '3ème A', '3ème B'];
  jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  matieres = ['Mathématiques', 'Français', 'Anglais', 'Histoire-Géographie', 'SVT', 'Physique-Chimie'];
  
  selectedClass = '6ème A';
  selectedJour: string | null = null;
  selectedMatiere: string | null = null;
  searchText = '';
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private scheduleService: ScheduleService,
    private dialog: MatDialog,
    private errorService: ErrorService
  ) {
    this.classes.forEach(classe => {
      this.dataSource[classe] = new MatTableDataSource<Schedule>();
    });
  }

  ngOnInit(): void {
    this.loadSchedules();
  }

  ngAfterViewInit(): void {
    Object.values(this.dataSource).forEach(ds => {
      ds.paginator = this.paginator;
      ds.sort = this.sort;
      ds.filterPredicate = this.createFilter();
    });
  }

  createFilter(): (data: Schedule, filter: string) => boolean {
    return (data: Schedule, filter: string) => {
      try {
        const searchTerms = JSON.parse(filter);
        
        const matchesSearch = !searchTerms.searchText || 
          Object.keys(data).some(key => {
            const value = data[key as keyof Schedule];
            return value !== undefined && String(value).toLowerCase().includes(searchTerms.searchText.toLowerCase());
          });
          
        const matchesJour = !searchTerms.jour || data.jour === searchTerms.jour;
        const matchesMatiere = !searchTerms.matiere || data.matiere === searchTerms.matiere;

        return matchesSearch && matchesJour && matchesMatiere;
      } catch {
        return true; // Return true if filter is invalid
      }
    };
  }

  loadSchedules(): void {
    this.scheduleService.getAll().subscribe({
      next: (schedules) => {
        this.classes.forEach(classe => {
          if (this.dataSource[classe]) {
            this.dataSource[classe].data = schedules.filter(s => s.classe === classe);
          }
        });
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
      jour: this.selectedJour,
      matiere: this.selectedMatiere
    });
    
    const currentDataSource = this.dataSource[this.selectedClass];
    if (currentDataSource) {
      currentDataSource.filter = filterValue;

      if (currentDataSource.paginator) {
        currentDataSource.paginator.firstPage();
      }
    }
  }

  onClassChange(classe: string): void {
    this.selectedClass = classe;
    this.applyFilters();
  }

  addSchedule(): void {
    this.router.navigate(['/schedule/new']);
  }

  editSchedule(schedule: Schedule): void {
    this.router.navigate(['/schedule/edit', schedule.id]);
  }

  deleteSchedule(schedule: Schedule): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmer la suppression',
        message: `Êtes-vous sûr de vouloir supprimer ce cours ?`,
        confirmText: 'Supprimer',
        cancelText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.scheduleService.delete(schedule.id).subscribe({
          next: () => {
            this.loadSchedules();
          },
          error: (error: HttpErrorResponse) => {
            this.errorService.handleError(error);
          }
        });
      }
    });
  }
}