import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TimeEntry } from '@app/core/_models/time-entry';

@Component({
  selector: 'app-record-entry-dialog',
  templateUrl: './record-entry-dialog.component.html',
  styleUrls: ['./record-entry-dialog.component.scss']
})
export class RecordEntryDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<RecordEntryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TimeEntry,
  ) { }

  ngOnInit(): void {
  }

}
