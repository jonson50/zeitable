import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Routing
import { TimeEntryRoutingModule } from './time-entry-routing.module';
// Components for Module Time Entry
import { EntryListComponent } from './entry-list/entry-list.component';
import { RecordCardComponent } from './components/record-card/record-card.component';
import { RecordEntryDialogComponent } from './components/record-entry-dialog/record-entry-dialog.component';
// Extra Libraries
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
// Angular Material Modules
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    EntryListComponent,
    RecordCardComponent,
    RecordEntryDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    TimeEntryRoutingModule,
    NgxMatTimepickerModule,
    MatIconModule,
    MatExpansionModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule
  ]
})
export class TimeEntryModule { }
