import { Injectable } from '@angular/core';
import { concatMap, from, Observable, zip, of, map } from 'rxjs';
import * as Parse from 'parse';
import { AuthService } from '@app/core/_services';

@Injectable({
  providedIn: 'root'
})
export class RecordsService {
  // variables
  //private recordsSubject: BehaviorSubject<ITimeEntry>();
  //private records: Observable<ITimeEntry>[] = [];
  private user: Parse.User | undefined;

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
    return from(new Parse.Query("TimeEntry").equalTo('user', this.user).find());
  }

  getTimeEntry(id: string): Observable<any> {
    const TimeEntry = Parse.Object.extend("TimeEntry");
    
    return from(new Parse.Query(TimeEntry).get(id));
  }

  saveTimeEntry() {

  }
}


