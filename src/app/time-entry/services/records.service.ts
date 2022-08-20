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
  //private recordsSubject: BehaviorSubject<ITimeEntry>();
  //private records: Observable<ITimeEntry>[] = [];
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

  getTimeEntryById(id: string): Observable<any> {

/*
    $query = new ParseQuery("ParseClass");
    // lower bound
    $query->greaterThan(
        "createdAt",
        DateTime::createWithFormat("Y-m-d H:i:s", "2017-05-01 00:00:00")
    );
    // upper bound
    $query->lessThan(
        "createdAt",
        DateTime::createWithFormat("Y-m-d H:i:s", "2017-06-01 00:00:00")
    );

    // find all objects that lie between
    // the start of the 1st of May
    // and start of the 1st of June
    // non-inclusive
    $objectsWithinDates = $query->find(); */



    const TimeEntry = Parse.Object.extend('TimeEntry');

    return from(new Parse.Query(TimeEntry).get(id));
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

  updateTimeEntry() {}

  deleteTimeEntry() {}
}
