import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BulletinListComponent } from "./bulletin-list/bulletin-list.component";
import { AuthGuard } from "../../core/guards/auth.guard";
import { BulletinFormComponent } from "./bulletin-form/bulletin-form.component";
import { BulletinViewComponent } from "./bulletin-view/bulletin-view.component";

const routes: Routes = [
    { 
        path: '', component: BulletinListComponent, canActivate: [AuthGuard]
    },
    { 
        path: 'new', component: BulletinFormComponent, canActivate: [AuthGuard]
    },
    { 
        path: 'edit/:id', component: BulletinFormComponent, canActivate: [AuthGuard]
    },
    { 
        path: 'view/:id', component: BulletinViewComponent, canActivate: [AuthGuard]
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
export class BulletinRoutingModule{}