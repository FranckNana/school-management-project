import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Bulletin } from '../../../shared/interfaces/bulletin.interface';
import { BulletinService } from '../../../core/services/bulletin.service';
import { ErrorService } from '../../../core/services/error.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-bulletin-list',
  templateUrl: './bulletin-list.component.html',
  styleUrls: ['./bulletin-list.component.scss']
})
export class BulletinListComponent implements OnInit {
  displayedColumns: string[] = ['nomEleve', 'classe', 'trimestre', 'moyenneGenerale', 'rang', 'dateGeneration', 'actions'];
  dataSource: MatTableDataSource<Bulletin>;
  classes = ['6ème A', '6ème B', '5ème A', '5ème B', '4ème A', '4ème B', '3ème A', '3ème B'];
  trimestres = [1, 2, 3];
  
  selectedClasse: string | null = null;
  selectedTrimestre: number | null = null;
  searchText = '';
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private bulletinService: BulletinService,
    private dialog: MatDialog,
    private errorService: ErrorService
  ) {
    this.dataSource = new MatTableDataSource<Bulletin>();
  }

  ngOnInit(): void {
    this.loadBulletins();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = this.createFilter();
  }

  createFilter(): (data: Bulletin, filter: string) => boolean {
    return (data: Bulletin, filter: string) => {
      try {
        const searchTerms = JSON.parse(filter);
        
        const matchesSearch = !searchTerms.searchText || 
          data.nomEleve.toLowerCase().includes(searchTerms.searchText.toLowerCase());
        
        const matchesClasse = !searchTerms.classe || data.classe === searchTerms.classe;
        const matchesTrimestre = !searchTerms.trimestre || data.trimestre === searchTerms.trimestre;

        return matchesSearch && matchesClasse && matchesTrimestre;
      } catch {
        return true;
      }
    };
  }

  loadBulletins(): void {
    this.bulletinService.getAll().subscribe({
      next: (bulletins) => {
        this.dataSource.data = bulletins;
        this.applyFilters();
      },
      error: (error) => {
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
      classe: this.selectedClasse,
      trimestre: this.selectedTrimestre
    });
    
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  generateBulletin(): void {
    this.router.navigate(['/bulletins/new']);
  }

  viewBulletin(bulletin: Bulletin): void {
    this.router.navigate(['/bulletins/view', bulletin.id]);
  }

  editBulletin(bulletin: Bulletin): void {
    this.router.navigate(['/bulletins/edit', bulletin.id]);
  }

  deleteBulletin(bulletin: Bulletin): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirmer la suppression',
        message: `Êtes-vous sûr de vouloir supprimer le bulletin de ${bulletin.nomEleve} ?`,
        confirmText: 'Supprimer',
        cancelText: 'Annuler'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bulletinService.delete(bulletin.id).subscribe({
          next: () => {
            this.loadBulletins();
          },
          error: (error) => {
            this.errorService.handleError(error);
          }
        });
      }
    });
  }

  downloadPDF(bulletin: Bulletin): void {
    this.bulletinService.generatePDF(bulletin.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `bulletin_${bulletin.nomEleve}_${bulletin.trimestre}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        this.errorService.handleError(error);
      }
    });
  }
}