import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BulletinService } from '../../../core/services/bulletin.service';
import { ErrorService } from '../../../core/services/error.service';
import { Bulletin } from '../../../shared/models/bulletin';

@Component({
  selector: 'app-bulletin-view',
  templateUrl: './bulletin-view.component.html',
  styleUrls: ['./bulletin-view.component.scss']
})
export class BulletinViewComponent implements OnInit {
  bulletin: Bulletin | null = null;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bulletinService: BulletinService,
    private errorService: ErrorService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadBulletin(id);
    }
  }

  private loadBulletin(id: number) {
    this.isLoading = true;
    this.bulletinService.getById(id).subscribe({
      next: (bulletin) => {
        this.bulletin = bulletin;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorService.handleError(error);
        this.isLoading = false;
      }
    });
  }

  downloadPDF() {
    if (this.bulletin) {
      this.bulletinService.generatePDF(this.bulletin.id).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `bulletin_${this.bulletin?.nomEleve}_${this.bulletin?.trimestre}.pdf`;
          link.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          this.errorService.handleError(error);
        }
      });
    }
  }

  editBulletin() {
    if (this.bulletin) {
      this.router.navigate(['/bulletins/edit', this.bulletin.id]);
    }
  }

  goBack() {
    this.router.navigate(['/bulletins']);
  }
}