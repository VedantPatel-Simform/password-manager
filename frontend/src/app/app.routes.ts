import { Routes } from '@angular/router';
import { LandingPageComponent } from './features/landing-page/landing-page.component';
import { authGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { GeneratePasswordComponent } from './features/generate-password/generate-password.component';
import { AddPasswordComponent } from './features/add-password/add-password.component';
import { PasswordDashboardComponent } from './features/password-dashboard/password-dashboard.component';
import { ViewPasswordComponent } from './shared/components/view-password/view-password.component';
import { RecycleBinComponent } from './features/recycle-bin/recycle-bin.component';
export const routes: Routes = [
  { path: '', component: LandingPageComponent, canActivate: [authGuard] },

  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [authGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'passwords',
      },
      {
        path: 'generate-password',
        component: GeneratePasswordComponent,
      },
      {
        path: 'add-password',
        component: AddPasswordComponent,
      },
      {
        path: 'passwords',
        component: PasswordDashboardComponent,
      },
      {
        path: 'passwords/:id',
        component: ViewPasswordComponent,
      },
      {
        path: 'recycle-bin',
        component: RecycleBinComponent,
      },
      // Add more child routes here
    ],
  },
];
