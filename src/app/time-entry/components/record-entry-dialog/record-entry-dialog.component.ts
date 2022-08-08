import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormGroup, FormControl, Validators, FormBuilder,
  AbstractControl, ValidationErrors
} from '@angular/forms'
import { TimeEntry } from '@app/core/_models/time-entry';
import { IProject, Project } from '@app/core/_models/project';
import { Settings } from '@app/core/_models/account';

@Component({
  selector: 'app-record-entry-dialog',
  templateUrl: './record-entry-dialog.component.html',
  styleUrls: ['./record-entry-dialog.component.scss']
})
export class RecordEntryDialogComponent implements OnInit {
  format = 24;
  recordForm: FormGroup;
  projects: Project[] = [];
  settings: Settings;
  record: TimeEntry;
  pauseRange: string[] = ["00:05", "00:45"]

  constructor(
    public dialogRef: MatDialogRef<RecordEntryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { record: TimeEntry, projects: Project[], settings: Settings },
    private formBuilder: FormBuilder
  ) {
    this.settings = data.settings;
    this.projects = data.projects;
    this.record = data.record;
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
        const startTimeArray = form.startTime.split(":")
        const endTimeArray = form.endTime.split(":");
        let _startTime: Date = new Date(this.record.date);
        let _endTime: Date = new Date(this.record.date);
        _startTime.setHours(Number(startTimeArray[0]));
        _startTime.setMinutes(Number(startTimeArray[1]));
        _endTime.setHours(Number(endTimeArray[0]));
        _endTime.setMinutes(Number(endTimeArray[1]));

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
            _puaseTime = this.stringtimeToNumbertime(form.pause);
          }
        }
        let totalTime = workedTimeSec - _puaseTime;
        this.record.totalTime = totalTime
      }
    });
  }

  onSubmit() {
    console.log(this.recordForm.value)
  }

  clearPauseField(): void {
    this.recordForm.get("pause")?.setValue("");
  }

  dateToStringdate(){}

  numbertimeToStringtime(time: number): string {
    const _hrs = Math.floor(time / 3600);
    const _mins = ((time % 3600) / 60);
    let _hrsString ="0";
    let _minsString = "0";
    _hrsString = _hrs < 10 ? _hrsString.concat(_hrs.toString()) : _hrs.toString();
    _minsString = _mins < 10 ? _minsString.concat(_minsString.toString()) : _minsString = _mins.toString();

    return `${_hrsString}:${_minsString}`
  }

  stringtimeToNumbertime(time:string): number {
    const pauseTimeArray = time.split(":");
    return (Number(pauseTimeArray[0])*3600) + (Number(pauseTimeArray[1])*60);
  }

}
