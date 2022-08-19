import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormGroup, Validators, FormBuilder} from '@angular/forms'
import { TimeEntry } from '@app/core/_models/time-entry';
import { AuthService } from '@app/core/_services';
import { RecordsService } from '@app/time-entry/services/records.service';

@Component({
  selector: 'app-record-entry-dialog',
  templateUrl: './record-entry-dialog.component.html',
  styleUrls: ['./record-entry-dialog.component.scss']
})
export class RecordEntryDialogComponent implements OnInit {
  format = 24;
  recordForm: FormGroup;
  projects: Parse.Object[] = [];
  settings: Parse.Object;
  record: TimeEntry;
  pauseRange: string[] = ["00:05", "00:45"];

  constructor(
    private authService: AuthService,
    private recordsService: RecordsService,
    public dialogRef: MatDialogRef<RecordEntryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { recordId: string, date: Date },
    private formBuilder: FormBuilder
  ) {
    this.settings = this.authService.accountValue.settings;
    this.projects = this.authService.accountValue.projects;
    this.record = new TimeEntry();
    this.record.date = this.data.date;

    this.recordForm = this.formBuilder.group({
      startTime: ["", [Validators.required]],
      endTime: ["", [Validators.required]],
      pause: [{ value: "", disabled: true }],
      homeOffice: false,
      project: ["", [Validators.required]],
      comments: [""]
    });
  }

  ngOnInit(): void {
    this.recordForm.valueChanges.subscribe(form => {

      if (form.startTime && form.endTime) {

        let _startTime: Date = TimeEntry.dateFromStringTime(this.record.date, form.startTime);
        let _endTime: Date = TimeEntry.dateFromStringTime(this.record.date, form.endTime);

        if (_startTime >= _endTime) {
          this.recordForm.controls['startTime'].setErrors({ 'invalidStartTime': true });
        } else {
          this.recordForm.controls['startTime'].setErrors(null);
        }
        if ((_endTime.getTime() - _startTime.getTime()) < 3600000) {
          this.recordForm.controls['endTime'].setErrors({ 'invalidMinTime': true });
        } else {
          this.recordForm.controls['endTime'].setErrors(null);
        }
        // Calculating min and max for pause according to start and end time
        if (_endTime.getTime() - _startTime.getTime() >= 18000000) this.pauseRange = ["00:45", "02:00"]; // for at least 5 Hrs of working time
        if (_endTime.getTime() - _startTime.getTime() >= 39600000) this.pauseRange = ["01:00", "02:00"]; // for more then 11 Hrs of working time
        // calculating the worked time
        const workedTimeSec = (_endTime.getTime() - _startTime.getTime()) / 1000; // In seconds
        let _puaseTime = 0;
        //activating pause fieldinput if it's disabled.
        if (this.recordForm.controls['pause'].disabled) {
          this.recordForm.controls['pause'].enable();
        } else {
          if (form.pause != "") {
            _puaseTime = TimeEntry.stringtimeToNumbertime(form.pause);
          }
        }
        let totalTime = workedTimeSec - _puaseTime;
        this.record.totalTime = totalTime
      }
    });
  }

  onSubmit() {
    this.record.fetchFromFormValue(this.recordForm.value);
    this.record.type = 1;
    this.record.difference = 0; // Overtime
    this.record.settings = this.settings;
    this.record.user = this.authService.accountValue.user;

    console.log(this.record)
    //this.createTimeEntry(this.record);
  }

  createTimeEntry(data: TimeEntry):void {
    this.recordsService.createTimeEntry(data).subscribe({
      next: resp => {
        console.log(resp);
        this.dialogRef.close("hallo welt");
      },
      error: error => console.error(error),
      complete: () => {
        //this.spinnerService.hide();
      }
    })

  }
  /**
   *
   */
  clearPauseField(): void {
    this.recordForm.get("pause")?.setValue("");
  }
}
