import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { WeekScheduleComponent } from './week-schedule/week-schedule.component';
import { AuthGuard } from './login/guards/auth.guard';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "week",
        pathMatch: 'full'
    },
    {
        path: "login",
        component: LoginComponent,
    },
    {
        path: "week",
        canActivate: [AuthGuard],
        component: WeekScheduleComponent,
    },
];
