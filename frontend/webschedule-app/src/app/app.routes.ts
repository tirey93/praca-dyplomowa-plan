import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { WeekScheduleComponent } from './week-schedule/week-schedule.component';
import { AuthGuard } from './login/guards/auth.guard';

export const routes: Routes = [
    {
        path: "",
        component: LoginComponent,
        pathMatch: 'full'
    },
    {
        path: "week",
        canActivate: [AuthGuard],
        component: WeekScheduleComponent,
    },
];
