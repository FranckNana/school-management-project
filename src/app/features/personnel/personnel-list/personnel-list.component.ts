import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpErrorResponse } from '@angular/common/http';
import { Personnel } from '../../../shared/models/personnel';
import { PersonnelService } from '../../../core/services/personnel.service';
import { ErrorService } from '../../../core/services/error.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-personnel-list',
  templateUrl: './personnel-list.component.html',
  styleUrls: ['./personnel-list.component.scss']
})
export class PersonnelListComponent implements OnInit {
  displayedColumns: string[] = ['nom', 'poste', 'telephone', 'email', 'salaire', 'actions'];
  dataSource: MatTableDataSource<Personnel>;
  postes = ['Enseignant', 'Secrétaire', 'Vigile', 'Comptable', 'Directeur'];
  matieres = [
    'Mathématiques', 'Français', 'Anglais', 'Histoire-Géographie', 'SVT', 'Physique-Chimie', 'Philosophie', 'EPS'
  ];
  
  selectedPoste: string | null = null;
  selectedMatiere: string | null = null;
  searchText = '';
  salarySort: string = '';
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private personnelService: PersonnelService,
    private dialog: MatDialog,
    private errorService: ErrorService
  ) {
    this.dataSource = new MatTableDataSource<Personnel>();
  }

  ngOnInit(): void {
    this.loadPersonnel();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = this.createFilter();
  }

  createFilter(): (data: Personnel, filter: string) => boolean {
    return (data: any, filter: string) => {
      try {
        const searchTerms = JSON.parse(filter);
        
        const searchableFields: (keyof Personnel)[] = ['nom', 'prenom', 'email', 'telephone', 'poste'];
        const matchesSearch = !searchTerms.searchText || 
          searchableFields.some(key => {
            const value = data[key];
            return value !== undefined && 
              String(value).toLowerCase().includes(searchTerms.searchText.toLowerCase());
          });
        
        const matchesPoste = !searchTerms.poste || data.poste === searchTerms.poste;
        
        const matchesMatiere = !searchTerms.matiere || 
          (data.matieres && data.matieres.includes(searchTerms.matiere));

        return matchesSearch && matchesPoste && matchesMatiere;
      } catch {
        return true; // Return true if filter is invalid
      }
    };
  }

  loadPersonnel(): void {
    this.personnelService.getAll().subscribe({
      next: (personnel) => {
        this.dataSource.data = personnel;
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
      poste: this.selectedPoste,
      matiere: this.selectedMatiere
    });
    
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applySalarySort(): void {
    const data = [...this.dataSource.data];
    if (this.salarySort === 'asc') {
      data.sort((a, b) => a.salaire - b.salaire);
    } else if (this.salarySort === 'desc') {
      data.sort((a, b) => b.salaire - a.salaire);
    }
    this.dataSource.data = data;
  }

  addPersonnel(): void {
    this.router.navigate(['/personnel/new']);
  }

  editPersonnel(personnel: Personnel): void {
    this.router.navigate(['/personnel/edit', personnel.id]);
  }

  deletePersonnel(personnel: Personnel): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmer la suppression',
        message: `Êtes-vous sûr de vouloir supprimer ${personnel.nom} ${personnel.prenom} ?`,
        confirmText: 'Supprimer',
        cancelText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.personnelService.delete(personnel.id).subscribe({
          next: () => {
            this.loadPersonnel();
          },
          error: (error: HttpErrorResponse) => {
            this.errorService.handleError(error);
          }
        });
      }
    });
  }
}