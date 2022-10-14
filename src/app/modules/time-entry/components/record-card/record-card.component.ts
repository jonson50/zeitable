import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ITimeEntryForm, TimeEntry } from '@app/core/models/time-entry';

@Component({
   selector: 'app-record-card',
   templateUrl: './record-card.component.html',
   styleUrls: ['./record-card.component.scss']
})
export class RecordCardComponent implements OnInit {
   @Input() record: TimeEntry = new TimeEntry();
   @Input() enableActions: boolean = true;
   @Input() indexMainCard: number | null = null;
   @Output() editClick: EventEmitter<Object> = new EventEmitter<Object>();
   @Output() deleteClick: EventEmitter<TimeEntry> = new EventEmitter<TimeEntry>();
   data: ITimeEntryForm = {
      startTime: '',
      endTime: '',
      pause: '',
      homeOffice: false,
      project: '',
      comments: ''
   } as ITimeEntryForm;

   ngOnInit(): void {
      if (this.record._originalParseObject) {
         this.data = {
            startTime: TimeEntry.dateToStringtime(this.record.startTime),
            endTime: TimeEntry.dateToStringtime(this.record.endTime),
            pause: TimeEntry.numbertimeToStringtime(this.record.pause),
            homeOffice: this.record.homeOffice,
            project: this.record.project,
            comments: this.record.comments,
         }
      }
   }

   onClickEdit(): void {
      this.editClick.emit({ record: this.record, index: this.indexMainCard });
   }

   onClickDelete(): void {
      this.deleteClick.emit(this.record);
   }
}
