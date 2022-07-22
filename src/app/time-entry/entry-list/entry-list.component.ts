import { Component, OnInit } from '@angular/core';

@Component({
   selector: 'app-entry-list',
   templateUrl: './entry-list.component.html',
   styleUrls: ['./entry-list.component.scss'],
})
export class EntryListComponent implements OnInit {
  daysInMonth: Date[] = [];
  currentDate!: Date;

   constructor() {}

  ngOnInit(): void {
    this.currentDate = new Date();
    this.daysInMonth = this.getDaysInMonth(this.currentDate);
  }

  /**
   * @param {int} currentDate current date containing the month from which the days are taken.
   * @return {Date[]} List with date objects for each day of the month
   */
  getDaysInMonth(currentDate: Date) {
    let date = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    let days = [];
    while (date.getMonth() === currentDate.getMonth()) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }
  /**
   * @param {int} index value to be either added or substracted from current month value  
   * from current Month shown, get any other month to be displayed 
   * according to the index selected
   */
  selectAnotherMonth(index: number) {
    this.currentDate.setMonth(this.currentDate.getMonth() + index);
    this.currentDate = new Date(this.currentDate);
    this.daysInMonth = this.getDaysInMonth(this.currentDate);
  }
}
