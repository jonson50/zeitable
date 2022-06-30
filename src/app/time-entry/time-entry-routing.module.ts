import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntryListComponent } from './entry-list/entry-list.component';
import { AuthGuard } from '@app/_helpers';

const routes: Routes = [
   {
      path: '',
      component: EntryListComponent,
      canActivate: [AuthGuard],
      pathMatch: 'full'
   },
   { path: '**', redirectTo: 'timeentry' },
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule],
})
export class TimeEntryRoutingModule {}
