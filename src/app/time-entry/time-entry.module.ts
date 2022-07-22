import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Routing
import { TimeEntryRoutingModule } from './time-entry-routing.module';
// Components for Module Time Entry
import { EntryListComponent } from './entry-list/entry-list.component';
// Angular Material Modules
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RecordCardComponent } from './components/record-card/record-card.component';

@NgModule({
  declarations: [
    EntryListComponent,
    RecordCardComponent,
  ],
  imports: [
    CommonModule,
    TimeEntryRoutingModule,
    MatIconModule,
    MatExpansionModule,
    MatCardModule,
    MatButtonModule
  ]
})
export class TimeEntryModule { }
