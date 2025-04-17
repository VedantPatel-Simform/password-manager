import { Routes } from '@angular/router';
import { LandingPageComponent } from './features/landing-page/landing-page.component';
import { authGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { GeneratePasswordComponent } from './features/generate-password/generate-password.component';
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
        path: 'generate-password',
        component: GeneratePasswordComponent,
      },
      // Add more child routes here
    ],
  },
];
