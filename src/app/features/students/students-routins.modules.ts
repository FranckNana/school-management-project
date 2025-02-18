import { RouterModule, Routes } from "@angular/router";
import { StudentsListComponent } from "./students-list/students-list.component";
import { AuthGuard } from "../../core/guards/auth.guard";
import { StudentFormComponent } from "./student-form/student-form.component";
import { NgModule } from "@angular/core";
import { StudentDetailsComponent } from "./student-details/student-details.component";

const routes: Routes = [
    { 
        path: '', component: StudentsListComponent, canActivate: [AuthGuard]
    },
    { 
        path: 'new', component: StudentFormComponent, canActivate: [AuthGuard]
    },
    { 
        path: 'edit/:id', component: StudentFormComponent, canActivate: [AuthGuard]
    },
    { 
        path: 'details/:id', component: StudentDetailsComponent, canActivate: [AuthGuard]
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
export class StudentsRoutingModule{}