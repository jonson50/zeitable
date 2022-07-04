import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './core/components/layout/layout.component';
import { LoginComponent } from './core/components/login/login.component';
import { DashboardComponent } from './core/components/dashboard/dashboard.component';
import { TemporalHomeComponent } from './core/temporal-home/temporal-home.component';
import { LoginGuard, AuthGuard } from '@app/core/_helpers';

const routes: Routes = [
   {
      path: 'login',
      component: LoginComponent,
      canActivate: [LoginGuard]
   },
   {
      path: '',
      component: LayoutComponent,
      canActivate: [AuthGuard],
      children: [
         { path: 'dashboard', component: DashboardComponent },
         { path: 'timeentry', loadChildren: () => import('./time-entry/time-entry.module').then(m => m.TimeEntryModule) },
         { path: '', component: TemporalHomeComponent, pathMatch: 'full' },
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
   TemporalHomeComponent,
];
