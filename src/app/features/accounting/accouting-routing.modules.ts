import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AccountingDashboardComponent } from "./accounting-dashboard/accounting-dashboard.component";
import { AuthGuard } from "../../core/guards/auth.guard";
import { PaymentFormComponent } from "./payment-form/payment-form.component";
import { SalaryFormComponent } from "./salary-form/salary-form.component";

const routes: Routes = [
    { 
        path: '', component: AccountingDashboardComponent, canActivate: [AuthGuard]
    },
    { 
        path: 'payment/new', component: PaymentFormComponent, canActivate: [AuthGuard]
    },
    { 
        path: 'payment/edit/:id', component: PaymentFormComponent, canActivate: [AuthGuard]
    },
    { 
        path: 'salary/new', component: SalaryFormComponent, canActivate: [AuthGuard]
    },
    { 
        path: 'salary/edit/:id', component: SalaryFormComponent, canActivate: [AuthGuard]
    },
]
@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AccountingRoutingModule{}