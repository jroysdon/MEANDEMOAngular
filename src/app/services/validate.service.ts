import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
//import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "../../environments/environment";
import { ValidateData } from "../models/validate-data.model";
import { PasswordData } from "../models/password-data.model";

const BACKEND_URL = environment.apiUrl + "/wizard/";

@Injectable({ providedIn: "root" })
export class ValidateService {
  private isValidated = false;
  private state: string;
  private message: string;
  // private validatedEmail: string;
  private validatedEmailListener = new Subject<string>();
  private validatedListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getValidaterListener() {
    return this.validatedListener.asObservable();
  }

  getValidatedEmailListener(){
    return this.validatedEmailListener.asObservable();
  }

  validateWizard(validationCode: string) {
    const validateData: ValidateData = { validationCode: validationCode, validated: false };
    this.http
      .post<{ state: string; message: string }>(
        BACKEND_URL  + "validatewizard/" + validationCode,
        validateData
        )
       .subscribe(
          response => {
            this.isValidated = true;
            this.validatedListener.next(true);
            this.router.navigate(["/validated"]);
          },
          error => {
            this.validatedListener.next(false);
          }      
      );
   }

   resetPWWizard(validationCode: string) {
    const validateData: ValidateData = { validationCode: validationCode, validated: false };
    this.http
      .post<{ state: string; message: string }>(
        BACKEND_URL  + "validatePWReset/" + validationCode,
        validateData
        )
       .subscribe(
          response => {
            this.isValidated = true;
            this.validatedEmailListener.next( response.message)
            this.validatedListener.next(true);
//            this.router.navigate(["/resetpwd"]);
          },
          error => {
            this.validatedListener.next(false);
          }      
      );
   }


   resetPW(validationCode: string, password: string){
     console.log('validCode: ' + validationCode)
     console.log('PW: ' + password )
    const passwordData: PasswordData = { validationCode: validationCode, password: password };
    this.http.post(BACKEND_URL + "resetpassword", passwordData).subscribe(
      () => {
        this.router.navigate(["/"]);
        this.validatedListener.next(true);
      },
      error => {
        this.validatedListener.next(false);
      }
    );
  }
}
