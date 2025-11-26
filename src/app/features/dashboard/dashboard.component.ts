import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ScheduleService } from '../../core/services/schedule.service';
import { Schedule } from '../../shared/models/schedule';
import { AddNotificationDialogComponent } from '../notifications/add-notification-dialog.component';
import { Notification } from '../../shared/models/notification';
import { NotificationService } from '../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { ErrorService } from '../../core/services/error.service';
import { Metrics } from '../../shared/models/metrics';
import { MetricsService } from '../../core/services/metrics.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('0.5s ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('statsAnimation', [
      transition(':enter', [
        query('.stats-card', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(100, [
            animate('0.6s cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ])
      ])
    ]),
    trigger('tableAnimation', [
      transition(':enter', [
        query('tr', [
          style({ opacity: 0, transform: 'translateX(-20px)' }),
          stagger(50, [
            animate('0.5s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
          ])
        ])
      ])
    ]),
    trigger('notificationAnimation', [
      transition(':enter', [
        query('.notification-item', [
          style({ opacity: 0, transform: 'translateX(20px)' }),
          stagger(100, [
            animate('0.5s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
          ])
        ])
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit {
  today = new Date();
  todaySchedule: Schedule[] = [];

  notifications: Notification[] = [];
  metrics: Metrics | undefined;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private scheduleService: ScheduleService,
    private notificationService: NotificationService,
    private errorService: ErrorService,
    private metricsService: MetricsService
  ) {}

  ngOnInit() {
    this.scheduleService.getAll().subscribe(schedules => {
      const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
      const scheduleDateDay = jours[new Date().getDay()];
      this.todaySchedule = schedules.filter(schedule =>
        schedule.jour.toLowerCase() === scheduleDateDay.toLowerCase()
      );
    });

    this.notificationService.getAll().subscribe(notifications => {
      this.notifications = notifications;
    });

    this.metricsService.getMetrics().subscribe({
      next: (data: Metrics) => {
        this.metrics = data;
      },
      error: (error: any) => {
        this.errorService.handleError(error);
      }
    }); 
  }

  addStudent(): void {
    this.router.navigate(['/students/new']);
  }

  goToSchedule(): void {
    this.router.navigate(['/schedule']);
  }

  openAddNotificationDialog(): void {
    const dialogRef = this.dialog.open(AddNotificationDialogComponent, {
      width: '500px',
      maxWidth: '95vw',
      panelClass: 'modern-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newNotification: Notification = {
          icon: result.icon,
          color: this.getColorByImportance(result.importance),
          importance: result.importance,
          title: result.title,
          description: result.description,
          dateTime: result.dateTime
        };
        this.notificationService.create(newNotification).subscribe({
          next: (createdNotification) => {
            this.notifications.unshift(createdNotification);
          },
          error: (error: any) => {
            this.errorService.handleError(error);
          }
        });
      }
    });
  }

  getColorByImportance(importance: string): string {
    switch (importance) {
      case 'Élevée': return '#ef4444'; // rouge
      case 'Moyenne': return '#f59e0b'; // orange
      case 'Faible': return '#10b981'; // vert
      default: return '#6366f1';
    }
  }

  getCourseIcon(matiere: string): string {
    const icons: Record<string, string> = {
      PHYSIQUE_CHIMIE: 'science',
      SVT: 'eco',
      HISTOIRE_GEOGRAPHIE: 'public',
      FRANCAIS: 'menu_book',
      ANGLAIS: 'translate',
      PHILOSOPHIE: 'psychology',
      EPS: 'sports_soccer',
      AUTRE: 'lightbulb'
    };
    return icons[matiere] || 'book';
  }

  getCourseColor(matiere: string): string {
    const colors: Record<string, string> = {
      PHYSIQUE_CHIMIE: 'linear-gradient(135deg, #f6d365, #fda085)',
      SVT: 'linear-gradient(135deg, #43e97b, #38f9d7)',
      HISTOIRE_GEOGRAPHIE: 'linear-gradient(135deg, #f093fb, #f5576c)',
      FRANCAIS: 'linear-gradient(135deg, #667eea, #764ba2)',
      ANGLAIS: 'linear-gradient(135deg, #89f7fe, #66a6ff)',
      PHILOSOPHIE: 'linear-gradient(135deg, #ff9a9e, #fad0c4)',
      EPS: 'linear-gradient(135deg, #fbc2eb, #a6c1ee)',
      AUTRE: 'linear-gradient(135deg, #a1c4fd, #c2e9fb)'
    };
    return colors[matiere] || 'linear-gradient(135deg, #a1c4fd, #c2e9fb)';
  }


  getCourseStatus(item: any): string {
    const now = new Date();
    
    // On récupère les heures de début et de fin du cours
    const [startHour, startMinute] = item.heureDebut.split(':').map(Number);
    const [endHour, endMinute] = item.heureFin.split(':').map(Number);

    const startTime = new Date();
    startTime.setHours(startHour, startMinute, 0);

    const endTime = new Date();
    endTime.setHours(endHour, endMinute, 0);

    if (now < startTime) {
      return 'À venir';
    } else if (now >= startTime && now <= endTime) {
      return 'En cours';
    } else {
      return 'Terminé';
    }
  }

  deleteNotification(notif: Notification) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            title: 'Confirmer la suppression',
            message: `Êtes-vous sûr de vouloir supprimer l'évènement ${notif.title} ?`,
            confirmText: 'Supprimer',
            cancelText: 'Annuler'
          }
        });
    
    dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.notificationService.delete(notif.id!).subscribe({
            next: () => {
              this.notifications = this.notifications.filter(n => n.id !== notif.id);
            },
            error: (error: any) => {
              this.errorService.handleError(error);
            }
          });
        }
      });
    }
  }
