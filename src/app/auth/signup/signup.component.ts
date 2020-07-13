import { Component, OnInit, OnDestroy } from "@angular/core";
import {ErrorStateMatcher} from '@angular/material';
import { NgForm, FormControl, FormGroupDirective, FormGroup, FormBuilder } from "@angular/forms";
import { Subscription } from "rxjs";

import { AuthService } from "../../services/auth.service";


/** Error when the parent is invalid */
class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return control.dirty && form.invalid;
  }
}

@Component({
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})

export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  signupForm: FormGroup;
  errorMatcher = new CrossFieldErrorMatcher();

  constructor(public authService: AuthService, private fb: FormBuilder) {
    this.initForm();
  }

  passwordValidator(form: FormGroup) {
    console.log('pw:' + form.get('password').value)
    const condition = form.get('password').value !== form.get('confirmpassword').value;

    return condition ? { passwordsDoNotMatch: true} : null;
  }

  initForm() {
    this.signupForm = this.fb.group({
      username: '',
      password: '',
      confirmpassword: '',
      firstname: '',
      lastname: '',
      dob:''
    }, {
      validator: this.passwordValidator
    })
  }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createWizard(form.value.email, form.value.password, form.value.firstname, form.value.lastname, form.value.dob);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
