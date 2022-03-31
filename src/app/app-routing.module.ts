import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth-guard.service';
import { LayoutComponent } from './components/layout/layout.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
   {
      path: 'qms',
      component: LayoutComponent,
      canActivate: [AuthGuard]
   },
   { path: 'login', component: LoginComponent},
   { path: '**', redirectTo: 'login' },
];

@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule],
})
export class AppRoutingModule {}
export const routingComponents = [LoginComponent, LayoutComponent];
