import { Component, Input, OnInit } from '@angular/core';
import { ITimeEntryForm, TimeEntry } from '@app/core/_models/time-entry';

@Component({
  selector: 'app-record-card',
  templateUrl: './record-card.component.html',
  styleUrls: ['./record-card.component.scss']
})
export class RecordCardComponent implements OnInit {
  @Input() record: TimeEntry = new TimeEntry();
  data!:ITimeEntryForm;

  ngOnInit(): void {
    if(this.record.id) this.data = this.record.toFormData() as ITimeEntryForm;
  }

}
