import { Injectable } from '@angular/core';
import { concatMap, from, Observable, zip, of, map } from 'rxjs';
import * as Parse from 'parse';
import { AuthService } from '@app/core/services';
import { TimeEntry } from '@app/core/models/time-entry';

@Injectable({
   providedIn: 'root',
})
export class RecordsService {
   // variables
   private user: Parse.User | null;

   constructor(private authService: AuthService) {
      this.user = this.authService.accountValue.user;
   }

   async timeEntries(): Promise<any> {
      return await new Parse.Query('TimeEntry').equalTo('user', this.user).ascending('startTime').find();
   }
   /**
    *
    * @param data
    * @returns
    */
   createTimeEntry(data: Object): Observable<any> {
      console.log(data)
      const TimeEntry = Parse.Object.extend('TimeEntry');
      const timeEntry = new TimeEntry();

      return from(timeEntry.save(data));
   }

   updateTimeEntry(parseObject: Parse.Object, data: Object): Observable<any> {
      return from(parseObject.save(data));
   }

   deleteTimeEntry(record: TimeEntry): Observable<any> {
      const timeEntry: Parse.Object = record._originalParseObject;
      return from(timeEntry.destroy());
   }

   getHollidays(zone: Parse.Object): Observable<any> {
      const query = new Parse.Query("Hollidays");
      query.equalTo("zone", zone);
      query.equalTo("year", new Date().getFullYear()); // get Settings for current year and active
      return from(query.first());
   }
}
