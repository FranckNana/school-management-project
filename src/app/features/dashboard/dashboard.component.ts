import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

interface Notification {
  icon: string;
  type: 'warning' | 'success' | 'info';
  title: string;
  time: string;
}

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
            animate('0.6s cubic-bezier(0.35, 0, 0.25, 1)', style({ 
              opacity: 1, 
              transform: 'translateY(0)' 
            }))
          ])
        ])
      ])
    ]),
    trigger('tableAnimation', [
      transition(':enter', [
        query('tr', [
          style({ opacity: 0, transform: 'translateX(-20px)' }),
          stagger(50, [
            animate('0.5s ease-out', style({ 
              opacity: 1, 
              transform: 'translateX(0)' 
            }))
          ])
        ])
      ])
    ]),
    trigger('notificationAnimation', [
      transition(':enter', [
        query('.notification-item', [
          style({ opacity: 0, transform: 'translateX(20px)' }),
          stagger(100, [
            animate('0.5s ease-out', style({ 
              opacity: 1, 
              transform: 'translateX(0)' 
            }))
          ])
        ])
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit {
  today = new Date();

  todaySchedule = [
    { time: '08:00 - 10:00', class: '6ème A', subject: 'Mathématiques', teacher: 'M. Ouedraogo' },
    { time: '10:00 - 12:00', class: '5ème B', subject: 'Français', teacher: 'Mme Kaboré' },
    { time: '14:00 - 16:00', class: '3ème A', subject: 'Physique', teacher: 'M. Sanou' },
    { time: '16:00 - 18:00', class: '4ème B', subject: 'Anglais', teacher: 'M. Traoré' }
  ];

  notifications: Notification[] = [
    {
      icon: 'notification_important',
      type: 'warning',
      title: 'Réunion des enseignants',
      time: 'Aujourd\'hui à 13:00'
    },
    {
      icon: 'event_available',
      type: 'success',
      title: 'Examens 3ème trimestre',
      time: 'Dans 2 semaines'
    },
    {
      icon: 'payment',
      type: 'warning',
      title: 'Échéance paiements',
      time: 'Dans 5 jours'
    },
    {
      icon: 'school',
      type: 'info',
      title: 'Conseil de classe',
      time: 'Demain à 15:00'
    }
  ];

  getNotificationColor(type: 'warning' | 'success' | 'info'): string {
    switch (type) {
      case 'warning':
        return '#f59e0b';
      case 'success':
        return '#10b981';
      case 'info':
        return '#6366f1';
      default:
        return '#6b7280';
    }
  }

  ngOnInit() {
    // Animation initialization logic if needed
  }
}