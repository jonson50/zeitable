import { Injectable } from '@angular/core';
import { AuthJwtService, IAuthStatus, IServerAuthResponse } from './auth-jwt.service';
import { sign } from 'fake-jwt-sign';
import { Observable, of, throwError } from 'rxjs';
import { Role } from './auth.enum';
import { PhoneType, User } from '../user/user/user';

@Injectable()
export class InMemoryAuthJwtService extends AuthJwtService {
   private defaultUser = User.Build({
      _id: '5da01751da27cc462d265913',
      email: 'john@me.com',
      name: {first: 'John', middle: 'Harold', last: 'Bermeo'},
      picture: 'https://scontent.ffra1-1.fna.fbcdn.net/v/t39.30808-6/242182031_10158063595387343_8991725421450828761_n.jpg?_nc_cat=109&ccb=1-5&_nc_sid=09cbfe&_nc_eui2=AeGWHl9Y68Qg_AKn5gSH0ep8ASic6B7NNf8BKJzoHs01_5UO-FxHW8jImq1aJsAeDSk&_nc_ohc=m184T7jb2MEAX-mggqQ&_nc_ht=scontent.ffra1-1.fna&oh=00_AT9gvvtTvRvGmNh4h8IUyTLKsV0j6aJ2hFgH1Ptx30xd0A&oe=62423555',
      role: Role.Admin,
      dateOfBirth: new Date(1982, 2, 21),
      userStatus: true,
      address: {
         line1: 'Humboldtstr. 111',
         city: 'Nuremberg',
         state: 'Bayern',
         zip: '90459'
      },
      level: 2,
      phones: [
         {
            id: 0,
            type: PhoneType.Mobile,
            digits: '015906302959'
         }
      ]
   });
   
   constructor() {
      super()
      console.warn("You are using the InMemoryAuthJwtService. Do not use this service in production.")
   }

   protected authProvider(
      email: string,
      password: string
   ): Observable<IServerAuthResponse> {
      email.toLowerCase();
      
      if (!email.endsWith('@test.com')) {
         return throwError(() => new Error('Failed to login! Email needs to end with @test.com'));
      }

      const authStatus:IAuthStatus = {
         isAuthenticated: true,
         userId: this.defaultUser._id,
         userRole: email.includes('admin')
            ? Role.Admin
            : email.includes('clerk')
            ? Role.Clerk
            : email.includes('manager')
            ? Role.Manager
            : Role.None
      } as IAuthStatus;

      this.defaultUser.role = authStatus.userRole;
   
      const authResponse = {
         accessToken: sign(authStatus, 'secret', {
            expiresIn: '1h',
            algorithm: 'none'
         }),
      } as IServerAuthResponse;

      return of(authResponse);
   }

   protected transformJwtToken(token: IAuthStatus):IAuthStatus {
      return token;
   }

   protected getCurrentUser():Observable<User> {
      return of(this.defaultUser);
   }
}
