import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

// Auth
import { LoginComponent } from './auth/login/login.component';

// Dashboard
import { DashboardComponent } from './dashboard/dashboard.component';

// Personnel
import { PersonnelListComponent } from './personnel/personnel-list/personnel-list.component';
import { PersonnelFormComponent } from './personnel/personnel-form/personnel-form.component';

// Students
import { StudentsListComponent } from './students/students-list/students-list.component';
import { StudentFormComponent } from './students/student-form/student-form.component';
import { StudentDetailsComponent } from './students/student-details/student-details.component';

// Schedule
import { ScheduleListComponent } from './schedule/schedule-list/schedule-list.component';
import { ScheduleFormComponent } from './schedule/schedule-form/schedule-form.component';

// Accounting
import { AccountingDashboardComponent } from './accounting/accounting-dashboard/accounting-dashboard.component';
import { PaymentFormComponent } from './accounting/payment-form/payment-form.component';
import { SalaryFormComponent } from './accounting/salary-form/salary-form.component';

// Bulletins
import { BulletinListComponent } from './bulletins/bulletin-list/bulletin-list.component';
import { BulletinFormComponent } from './bulletins/bulletin-form/bulletin-form.component';
import { BulletinViewComponent } from './bulletins/bulletin-view/bulletin-view.component';
import { AccountingRoutingModule } from './accounting/accouting-routing.modules';
import { BulletinRoutingModule } from './bulletins/bulletin-routing.modules';
import { PersonnelRoutingModule } from './personnel/personnel-routing.modules';
import { SchedulesRoutingModule } from './schedule/schedules-routing.modules';
import { StudentsRoutingModule } from './students/students-routins.modules';
import { AddNotificationDialogComponent } from './notifications/add-notification-dialog.component';

@NgModule({
  declarations: [
    // Auth
    LoginComponent,
    
    // Dashboard
    DashboardComponent,
    
    // Personnel
    PersonnelListComponent,
    PersonnelFormComponent,
    
    // Students
    StudentsListComponent,
    StudentFormComponent,
    StudentDetailsComponent,
    
    // Schedule
    ScheduleListComponent,
    ScheduleFormComponent,
    
    // Accounting
    AccountingDashboardComponent,
    PaymentFormComponent,
    SalaryFormComponent,

    // Bulletins
    BulletinListComponent,
    BulletinFormComponent,
    BulletinViewComponent,

    // Notifications
    AddNotificationDialogComponent
  ],
  imports: [
    AccountingRoutingModule,
    BulletinRoutingModule,
    PersonnelRoutingModule,
    SchedulesRoutingModule,
    StudentsRoutingModule,
    SharedModule
  ],
  exports: [
    // Auth
    LoginComponent,
    
    // Dashboard
    DashboardComponent,
    
    // Personnel
    PersonnelListComponent,
    PersonnelFormComponent,
    
    // Students
    StudentsListComponent,
    StudentFormComponent,
    StudentDetailsComponent,
    
    // Schedule
    ScheduleListComponent,
    ScheduleFormComponent,
    
    // Accounting
    AccountingDashboardComponent,
    PaymentFormComponent,
    SalaryFormComponent,

    // Bulletins
    BulletinListComponent,
    BulletinFormComponent,
    BulletinViewComponent,

    // Notifications
    AddNotificationDialogComponent
  ]
})
export class FeaturesModule { }