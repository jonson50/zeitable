import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingComponent } from './setting/setting.component';
import { HollidaySettingComponent } from './holliday-setting/holliday-setting.component';

const routes: Routes = [
   {
      path: '',
      component: SettingComponent,
      //canActivate: [AuthGuard],
      pathMatch: 'full'
   },
   {
    path: 'hollidays',
    component: HollidaySettingComponent,
    //canActivate: [AuthGuard],
    pathMatch: 'full'
 },
   { path: '**', redirectTo: '' },
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule],
})
export class SettingsRoutingModule {}
