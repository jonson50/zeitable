import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
   FormGroup, Validators, FormBuilder
} from '@angular/forms'
import { TimeEntry } from '@app/core/_models/time-entry';
import { AuthService } from '@app/core/_services';
import { RecordsService } from '@app/time-entry/services/records.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
   selector: 'app-record-entry-dialog',
   templateUrl: './record-entry-dialog.component.html',
   styleUrls: ['./record-entry-dialog.component.scss']
})
export class RecordEntryDialogComponent implements OnInit {
   format = 24;
   recordForm: FormGroup;
   projects: Parse.Object[] = [];
   record: TimeEntry;
   pauseRange: string[] = ["00:05", "00:45"];
   date!: Date;

   constructor(
      private authService: AuthService,
      private recordsService: RecordsService,
      private spinnerService: NgxSpinnerService,
      public dialogRef: MatDialogRef<RecordEntryDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { record: TimeEntry, recordsByDate: TimeEntry[], date: Date },
      private formBuilder: FormBuilder
   ) {
      this.projects = this.authService.accountValue.projects;
      this.record = this.data.record;
      this.date = this.data.date;

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
         const start = this.recordForm.controls['startTime'].value;
         const end = this.recordForm.controls['endTime'].value;
         const pause = this.recordForm.controls['pause'].value;

         if (start && end) {
            let _startTime: Date = TimeEntry.dateFromStringTime(this.date, start);
            let _endTime: Date = TimeEntry.dateFromStringTime(this.date, end);

            this.recordForm.controls['startTime'].setErrors(_startTime >= _endTime ? { 'invalidStartTime': true } : null);
            this.recordForm.controls['endTime'].setErrors((_endTime.getTime() - _startTime.getTime()) < 3600000 ? { 'invalidMinTime': true } : null);
            // Calculating min and max for pause according to start and end time
            if (_endTime.getTime() - _startTime.getTime() >= 18000000) this.pauseRange = ["00:45", "02:00"]; // for at least 5 Hrs of working time
            if (_endTime.getTime() - _startTime.getTime() >= 39600000) this.pauseRange = ["01:00", "02:00"]; // for more then 11 Hrs of working time
            // calculating the worked time
            const workedTimeSec = (_endTime.getTime() - _startTime.getTime()) / 1000; // In seconds

            let _puaseTime = 0;
            //activating pause fieldinput if it's disabled.
            if (this.recordForm.controls['startTime'].valid && this.recordForm.controls['endTime'].valid && this.recordForm.controls['pause'].disabled) {
               this.recordForm.controls['pause'].enable()
            }
            if ((this.recordForm.controls['startTime'].invalid || this.recordForm.controls['endTime'].invalid) && this.recordForm.controls['pause'].enabled) {
               this.recordForm.controls['pause'].disable();
            }
            if (pause) {
               _puaseTime = TimeEntry.stringtimeToNumbertime(pause);
            }

            let totalTime = workedTimeSec - _puaseTime;
            this.record.totalTime = totalTime
         }
      });

      if (this.record._originalParseObject) {
         this.record.project = this.projects.filter(value => value.id == this.record.project?.id)[0]; // Important
         this.recordForm.patchValue(this.toFormData());
      }
   }

   toFormData() {
      return {
         startTime: TimeEntry.dateToStringtime(this.record.startTime),
         endTime: TimeEntry.dateToStringtime(this.record.endTime),
         pause: TimeEntry.numbertimeToStringtime(this.record.pause),
         homeOffice: this.record.homeOffice,
         project: this.record.project,
         comments: this.record.comments,
      };
   }

   onSubmit() {
      //this.record.fetchFromFormValue(this.recordForm.value);
      this.record.startTime = TimeEntry.dateFromStringTime(this.date, this.recordForm.value.startTime);
      this.record.endTime = TimeEntry.dateFromStringTime(this.date, this.recordForm.value.endTime);
      this.record.pause = TimeEntry.stringtimeToNumbertime(this.recordForm.value.pause);
      this.record.homeOffice = this.recordForm.value.homeOffice;
      this.record.project = this.recordForm.value.project;
      this.record.comments = this.recordForm.value.comments;
      this.record.type = 1;
      this.record.difference = 0; // Overtime
      this.record.settings = this.authService.accountValue.settings;
      this.record.user = this.authService.accountValue.user;
      console.log(this.record)
      this.spinnerService.show();
      if (!this.record._originalParseObject) {
        this.createTimeEntry(this.record.toParsePlatform());
      } else {
        this.updateTimeEntry(this.record._originalParseObject, this.record.toParsePlatform());
      }
   }

   createTimeEntry(data: Object): void {
      this.recordsService.createTimeEntry(data).subscribe({
         next: resp => {
            console.log(resp)
            this.dialogRef.close(resp);
            this.spinnerService.hide();
         },
         error: error => {
            console.error(error),
               this.spinnerService.hide();
         },
         complete: () => {

         }
      });
   }

   updateTimeEntry(parseObject: Parse.Object, data: Object): void {
      this.recordsService.updateTimeEntry(parseObject, data).subscribe({
         next: resp => {
            this.dialogRef.close(resp);
         },
         error: error => {
            console.error(error),
               this.spinnerService.hide();
         }
      });
   }
   /**
    *
    */
   clearPauseField(): void {
      this.recordForm.get("pause")?.setValue("");
   }
}
