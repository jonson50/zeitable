import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TemporalComponent } from './temporal/temporal.component';
import { TemporalHomeComponent } from './temporal-home/temporal-home.component';
import { LoginGuard, AuthGuard } from '@app/_helpers';

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
         // { path: '', redirectTo: 'temporal', pathMatch: 'full' },
         { path: 'dashboard', component: DashboardComponent },
         { path: '', component: TemporalComponent, pathMatch: 'full' },
         { path: 'tempo', component: TemporalHomeComponent, pathMatch: 'full' },
      ]
   },
   { path: '**', redirectTo: 'login' },
];

@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule],
})
export class AppRoutingModule {}
export const routingComponents = [
   LoginComponent,
   LayoutComponent,
   DashboardComponent,
   TemporalComponent,
   TemporalHomeComponent,
];
