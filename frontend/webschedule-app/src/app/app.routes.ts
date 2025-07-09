import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoginGuard } from './guards/login.guard';
import { MainComponent } from './main/main.component';

export const routes: Routes = [
    {
        path: "login",
        canActivate: [LoginGuard],
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
        path: "**",
        redirectTo: ""
    }
];
