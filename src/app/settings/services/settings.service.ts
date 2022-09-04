import * as Parse from 'parse';
import { Injectable } from '@angular/core';
import { from, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor() { }

  getEmployeeUsers(): Observable<any> {
    const userQuery = new Parse.Query(Parse.Role);
    userQuery.contains('name', 'employee');

    return from(
      userQuery.first().then((role: any) => {
        if (!role) {
          //check a role has been found
          const error: any = new Error("Role not found");
          error.code = Parse.Error.OBJECT_NOT_FOUND;
          throw error;
        }
        const users = role.getUsers().query();
        const Person = Parse.Object.extend("Person");
        return new Parse.Query(Person).matchesQuery("user", users).find();
      }).catch(error => {
        throw error;
      })
    );
  }

  getUserSettings(user: Parse.User):Observable<any> {
    // getting the current settings for the user
    const query = new Parse.Query("Setting");
    query.equalTo("user", user);
    query.equalTo("active", true);
    query.descending("updatedAt");
    return from(query.first());
  }

  updateSettings(parseObject:Parse.Object, data: Object): Observable<any> { 
    return from(parseObject.save(data));
  }
}


