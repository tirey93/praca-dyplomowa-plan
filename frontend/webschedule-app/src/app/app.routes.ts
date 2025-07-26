import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LogoutGuard } from './guards/logout.guard';
import { MainComponent } from './main/main.component';
import { CreateGroupComponent } from './create-group-dialog/create-group.component';
import { LoginGuard } from './guards/login.guard';

export const routes: Routes = [
    {
        path: "login",
        canActivate: [LogoutGuard],
        component: LoginComponent,
    },
    {
        path: "",
        component: MainComponent,
    },
    {
        path: "group/:groupId",
        component: MainComponent
    },
    {
        path: "create-group",
        canActivate: [LoginGuard],
        component: CreateGroupComponent
    },
    {
        path: "**",
        redirectTo: ""
    }
];
