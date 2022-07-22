import { Component, OnInit } from '@angular/core';

@Component({
   selector: 'app-entry-list',
   templateUrl: './entry-list.component.html',
   styleUrls: ['./entry-list.component.scss'],
})
export class EntryListComponent implements OnInit {
<<<<<<< HEAD
  daysInMonth: Date[] = [];
  currentDate!: Date;
=======
   daysName = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
   currentDate = new Date();
   entryData:any = [];
>>>>>>> 50b1d5cdcd6c19f62bf3e3d8c31a8a55281409e0

   constructor() {}

<<<<<<< HEAD
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
=======
   ngOnInit(): void {
      this.loadEntryData();
   }

   loadEntryData() {
      let monthDays = this.getDaysInMonth(this.currentDate.getMonth(), this.currentDate.getFullYear())
      console.log(monthDays)
      monthDays.forEach(date => {
         let data = {
            date: date,
            day: date.getDay(),
            description: `Day's description`,
            should: 0,
            is: 0,
            active: true,
            closed: false,
            records: []
         }
         this.entryData.push(data);
      });
   }

   /*
   *  @param   {int} Month number, 0 based
   *  @param   {int} year, not zero based, required to account for leap years
   *  @return  {Date[]} List with date objects for each day of the month
   */
   getDaysInMonth(mount:number, year:number): Date[] {
      let date = new Date(year, mount, 1);
      let days = [];
      while(date.getMonth() === mount) {
         days.push(new Date(date));
         date.setDate(date.getDate() + 1);
      }
      return days;
   }
>>>>>>> 50b1d5cdcd6c19f62bf3e3d8c31a8a55281409e0
}
