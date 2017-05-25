import { Observable } from 'rxjs/Observable';

export class UserApi2 {
    signIn : (username: string, password: string, rememberMe: boolean) => Observable<any>;
    signOut: () => Observable<any>;
    // changePassword:
}