import { Component, OnInit } from '@angular/core';

@Component({
   selector: 'app-entry-list',
   templateUrl: './entry-list.component.html',
   styleUrls: ['./entry-list.component.scss'],
})
export class EntryListComponent implements OnInit {
   daysName = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
   currentDate = new Date();
   entryData:any = [];

   constructor() {}

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
}
