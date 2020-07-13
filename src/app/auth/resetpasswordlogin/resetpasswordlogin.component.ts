import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/wizard/';

@Component({
  selector: 'app-resetpasswordlogin',
  templateUrl: './resetpasswordlogin.component.html',
  styleUrls: ['./resetpasswordlogin.component.css']
})
export class ResetpasswordloginComponent implements OnInit, OnDestroy {
  isLoading = true;


  constructor(
    private http: HttpClient,
    private router: Router
    )
  { }

  onResetPassword(form: NgForm){
    console.log('Form:')
    console.dir(form)
    if (form.invalid) {
      return;
    }
    console.log('Sending Email to : ' + form.value.email)
    this.http.get(BACKEND_URL + 'sendPWEmail/' + form.value.email ).subscribe(
      () => {
        this.router.navigate(['/auth/login'])
      },
      error => {
        this.router.navigate(['/']);
      }
    );

  }

  ngOnInit() {
    this.isLoading = false;

  }

  ngOnDestroy() {
  }
}
