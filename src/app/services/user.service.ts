import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

import { UserApi} from "../../fw/users/user-api";
// import { UserApi2} from "../../fw/users/user-api2";

@Injectable()
export class UserService implements UserApi {
    
    isAuthenticated = false;

    constructor(private router: Router) {}

    signIn(username: string, password: string, rememberMe: boolean): Observable<any> {
        console.log ('UserService.signIn: ' + username + ' ' + password + ' ' + rememberMe);

        this.isAuthenticated = true;
        return Observable.of({}).delay(2000);

        // return Observable.of({}).delay(2000).flatMap(
        //     (x)=> {
        //         console.log(x);
        //         return Observable.throw('Invalid User Name and/or Password')
        //     }
        //     );
// https://stackoverflow.com/questions/33471526/why-we-need-to-use-flatmap
        //Basically if Observable<T> denotes an observable object which pushes values of type T, then flatMap takes a function of type T' -> Observable<T> as its argument, and returns Observable<T>. map takes a function of type T' -> T and returns Observable<T>.


    }

    signOut(): Observable<any> {
        this.isAuthenticated = false;
      //  this.router.navigate(['/sign-in']);
        this.router.navigate(['/signin']);
        return Observable.of({});
    }
}