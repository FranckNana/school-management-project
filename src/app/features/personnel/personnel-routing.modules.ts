import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PersonnelListComponent } from "./personnel-list/personnel-list.component";
import { AuthGuard } from "../../core/guards/auth.guard";
import { PersonnelFormComponent } from "./personnel-form/personnel-form.component";

const routes: Routes = [
    { 
        path: '', component: PersonnelListComponent, canActivate: [AuthGuard]
    },
    { 
        path: 'new', component: PersonnelFormComponent, canActivate: [AuthGuard]
    },
    { 
        path: 'edit/:id', component: PersonnelFormComponent, canActivate: [AuthGuard]
    }
]
@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class PersonnelRoutingModule{}