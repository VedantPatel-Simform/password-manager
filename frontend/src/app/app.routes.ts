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
import { SentByMeComponent } from './features/sent-by-me/sent-by-me.component';
import { ReceivedByMeComponent } from './features/recieved-by-me/recieved-by-me.component';
import { SharePasswordComponent } from './features/share-password/share-password.component';
import { ViewSharedPasswordComponent } from './shared/components/view-shared-password/view-shared-password.component';
import { UploadCsvComponent } from './features/upload-csv/upload-csv.component';
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
        path: 'upload-csv',
        component: UploadCsvComponent,
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
      {
        path: 'shared',
        pathMatch: 'full',
        redirectTo: 'shared/sent',
      },
      {
        path: 'shared/share',
        component: SharePasswordComponent,
      },
      {
        path: 'shared/sent',
        component: SentByMeComponent,
      },
      {
        path: 'shared/received',
        component: ReceivedByMeComponent,
      },
      {
        path: 'shared/manage/:id',
        component: ViewSharedPasswordComponent,
      },
      // Add more child routes here
    ],
  },
];
