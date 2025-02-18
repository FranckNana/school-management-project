import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Auth
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { 
    path: 'login', component: LoginComponent 
  },
  { 
    path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]
  },
  { 
    path: 'personnel', loadChildren : ()=> import('./features/personnel/personnel-routing.modules').then(m => m.PersonnelRoutingModule) 
  },
  { 
    path: 'students', loadChildren : ()=> import('./features/students/students-routins.modules').then(m => m.StudentsRoutingModule) 
  },
  { 
    path: 'schedule', loadChildren : ()=> import('./features/schedule/schedules-routing.modules').then(m => m.SchedulesRoutingModule) 
  },
  { 
    path: 'accounting', loadChildren : ()=> import('./features/accounting/accouting-routing.modules').then(m => m.AccountingRoutingModule) 
  },
  { 
    path: 'bulletins', loadChildren : ()=> import('./features/bulletins/bulletin-routing.modules').then(m => m.BulletinRoutingModule) 
  },
  { 
    path: '', component: DashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }