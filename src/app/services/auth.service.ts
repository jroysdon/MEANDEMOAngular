import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthData } from '../models/auth-data.model';
import { SignupData } from '../models/signup-data.model';
import { NewPasswordData } from '../models/newPassword-data.model';
import { DeleteAccountData } from '../models/deleteAccount-data.model';

const BACKEND_URL = environment.apiUrl + '/wizard/';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private wizardId: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getWizardId() {
    return this.wizardId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createWizard(email: string, password: string, firstname: string, lastname: string, dob: Date) {
    const signupData: SignupData = { email: email, password: password, firstname: firstname, lastname: lastname, dob: dob };
    this.http.post(BACKEND_URL + 'signup', signupData).subscribe(
      () => {
        this.router.navigate(['/']);
      },
      error => {
        this.authStatusListener.next(false);
      }
    );
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number; wizardId: string }>(
        BACKEND_URL + 'login',
        authData
      )
      .subscribe(
        response => {
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.wizardId = response.wizardId;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            console.log(expirationDate);
            this.saveAuthData(token, expirationDate, this.wizardId);
            this.router.navigate(['/']);
          }
        },
        error => {
          this.authStatusListener.next(false);
        }
      );
  }

  autoAuthWizard() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.wizardId = authInformation.wizardId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.wizardId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  deleteWizard(profileID: string, password: string, deleteContent: boolean) {
    console.log('srvc - ID: ' + profileID);
    console.log('srvc - PW: ' + password);
    console.log('srvc - Content: ' + deleteContent);
    const deleteAccountData: DeleteAccountData = {profileID: profileID, password: password, deleteContent: deleteContent };
    this.http
      .post<{  }>(
        BACKEND_URL + 'deleteWizard',
        deleteAccountData
      )
      .subscribe(
        response => {
            this.router.navigate(['/']);
        },
        error => {
          this.authStatusListener.next(false);
        }
      );
  }

  resetPassword(profileID: string, passwordCurrent: string, passwordNew: string) {
    const newpasswordData: NewPasswordData = { tokenID: profileID, password: passwordCurrent, newPassword: passwordNew };
    this.http
      .post<{  }>(
        BACKEND_URL + 'setNewPassword',
        newpasswordData
      )
      .subscribe(
        response => {
            this.router.navigate(['/']);
        },
        error => {
          this.authStatusListener.next(false);
        }
      );
  }

  private setAuthTimer(duration: number) {
    console.log('Setting timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, wizardId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('wizardId', wizardId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('wizardId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const wizardId = localStorage.getItem('wizardId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      wizardId: wizardId
    };
  }


}
