import { Injectable } from '@angular/core';
import { concatMap, from, Observable, zip, of, map } from 'rxjs';
import * as Parse from 'parse';
import { AuthService } from '@app/core/_services';
import { TimeEntry } from '@app/core/_models/time-entry';

@Injectable({
  providedIn: 'root',
})
export class RecordsService {
  // variables
  private user: Parse.User | null;

  constructor(private authService: AuthService) {
    this.user = this.authService.accountValue.user;
  }

  get timeEntries(): Observable<any> {
    /* return from(new Parse.Query("TimeEntry").equalTo('user', this.user).find()).pipe(
      concatMap(records => {
        return zip(
          of(records), // All TimeEntry records for current user.
          from(new Parse.Query("Project").equalTo('users', this.user).ascending("code").find())
        )
      }),
      map(([records, projects]: any[]) => {
        return ({
          records: records,
          projects: projects
        })
      })
    ); */
    return from(new Parse.Query('TimeEntry').equalTo('user', this.user).ascending('startTime').find());
  }

  getTimeEntryByRecord(searchedRecord: TimeEntry): Observable<any> {
    const query = new Parse.Query(Parse.Object.extend('TimeEntry'));
    return from(query.get(searchedRecord.id));
  }

  getRecordsByDate(date: Date): Observable<any> {
    let initDate = new Date(date);
    let endDate = new Date(initDate);
    endDate.setDate(initDate.getDate() + 1);
    const query = new Parse.Query(Parse.Object.extend('TimeEntry'));
    query.greaterThanOrEqualTo('startTime', initDate);
    query.lessThan('startTime', endDate);

    return from(query.ascending('startTime').find())
  }
  /**
   *
   * @param data
   * @returns
   */
  createTimeEntry(data: Object): Observable<any> {
    const TimeEntry = Parse.Object.extend('TimeEntry');
    const timeEntry = new TimeEntry();

    return from(timeEntry.save(data));
  }

  updateTimeEntry(parseObject:Parse.Object, data: Object): Observable<any> { 
    return from(parseObject.save(data));
  }

  deleteTimeEntry(record:TimeEntry): Observable<any> { 
    const timeEntry:Parse.Object = record.originalParseObject;
    return from(timeEntry.destroy());
  }
}
