import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// Routing
import { TimeEntryRoutingModule } from './time-entry-routing.module';
// Components for Module Time Entry
import { EntryListComponent } from './entry-list/entry-list.component';
import { RecordCardComponent } from './components/record-card/record-card.component';
// Extra Libraries
// Angular Material Modules
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { RecordEntryDialogComponent } from './components/record-entry-dialog/record-entry-dialog.component';

@NgModule({
  declarations: [
    EntryListComponent,
    RecordCardComponent,
    RecordEntryDialogComponent,
  ],
  imports: [
    CommonModule,
    TimeEntryRoutingModule,
    MatIconModule,
    MatExpansionModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule
  ]
})
export class TimeEntryModule { }
