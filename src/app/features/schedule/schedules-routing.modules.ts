import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ScheduleListComponent } from "./schedule-list/schedule-list.component";
import { AuthGuard } from "../../core/guards/auth.guard";
import { ScheduleFormComponent } from "./schedule-form/schedule-form.component";

const routes: Routes = [
    { 
        path: '', component: ScheduleListComponent, canActivate: [AuthGuard]
    },
    { 
        path: 'new', component: ScheduleFormComponent, canActivate: [AuthGuard]
    },
    { 
        path: 'edit/:id', component: ScheduleFormComponent, canActivate: [AuthGuard]
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
export class SchedulesRoutingModule{}