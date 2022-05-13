import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from './user.model';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;
  constructor(private http: HttpClient, private router: Router) {}

  /**
   * signUpUser: Method calls sign up API of Firebase to register new user.
   * @param email
   * @param password
   * @returns: An observable is returned with Web service response or error.
   */
  signUpUser(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
          environment.webAPIKey,
        {
          //sending sign up data
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((respData) => {
          this.handleAuthentication(
            respData.email,
            respData.localId,
            respData.idToken,
            +respData.expiresIn
          );
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
          environment.webAPIKey,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    if (localStorage.getItem('userData') !== null) {
      localStorage.removeItem('userData');
    }
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  /**
   * autoLogin: method is called whenever user refreshes the page.
   * It gets the token from local storage, so that it could be sent to backend.
   * @returns
   */
  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _expirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    console.log('user data is' + userData);

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._expirationDate)
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._expirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
      console.log(`expirationDuration is ${expirationDuration}`);
    }
  }

  /**
   *autoLogout: To logout the user on expiry of token.
   * @param expirationDuration
   */
  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(function () {
      this.logout();
    }, expirationDuration);
  }

  handleAuthentication(
    email: string,
    localId: string,
    token: string,
    expiresInSeconds: number
  ) {
    const expirateDate = new Date(
      new Date().getTime() + expiresInSeconds * 1000
    );
    const user = new User(email, localId, token, expirateDate);
    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  /**
   * handleError: Generic handle error method, to handle errors returned from server.
   * @param errorRes
   * @returns throwable Errors.
   */
  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    //If there is no error in the error response then simply return default error message
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    //Looping through the response
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already!';
    }
    return throwError(errorMessage);
  }
}

// private handleError(errorRes: HttpErrorResponse){
//     let errorMessage="An unknown error occcurred";
//     return throwError(errorMessage);
// }
