import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './core/components/layout/layout.component';
import { LoginComponent } from './core/components/login/login.component';
import { DashboardComponent } from './core/components/dashboard/dashboard.component';
import { LoginGuard } from '@app/core/_helpers';
import { AuthorizationGuard } from './core/_services/authorization.guard';

const routes: Routes = [
   {
      path: 'login',
      component: LoginComponent,
      canActivate: [LoginGuard]
   },
   {
      path: '',
      component: LayoutComponent,
      canActivate: [AuthorizationGuard],
      children: [
         { path: 'dashboard', component: DashboardComponent },
         { path: 'timeentry', loadChildren: () => import('./time-entry/time-entry.module').then(m => m.TimeEntryModule) },
         { path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule) },
         { path: '**', redirectTo: '/dashboard' },
      ]
   },
   { path: '**', redirectTo: 'login' },
];

@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule],
})
export class AppRoutingModule {}

// Exporting all components used as core components
export const routingComponents = [
   LoginComponent,
   LayoutComponent,
   DashboardComponent,
];
