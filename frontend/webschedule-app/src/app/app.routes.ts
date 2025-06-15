import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { WeekScheduleComponent } from './week-schedule/week-schedule.component';
import { AuthGuard } from './auth.guard';
import { PreferencesComponent } from './preferences/preferences.component';

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
