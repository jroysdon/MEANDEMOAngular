import { Component, OnInit, OnDestroy  } from '@angular/core';
import { NgForm, FormGroup, FormControl, FormGroupDirective } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {ErrorStateMatcher} from '@angular/material';

import { AuthService } from '../../services/auth.service';

/** Error when the parent is invalid */
class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return control.dirty && form.invalid;
  }
}

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {
  isLoading = false;
  private authStatusSub: Subscription;
  private wizardId: string;

  errorMatcher = new CrossFieldErrorMatcher();
  resetPWForm = new FormGroup({
    passwordExisting: new FormControl(''),
    passwordInput: new FormControl(''),
    passwordConfirmInput: new FormControl(''),
  });

  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  passwordValidator(resetPWForm: FormGroup) {
    // console.log('pw:' + form.get('passwordInput').value)
    // console.log('pwc:' + form.get('passwordConfirmInput').value)
    const condition = resetPWForm.get('passwordInput').value !== resetPWForm.get('passwordConfirmInput').value;
    return condition ? { passwordsDoNotMatch: true} : null;
  }

  ngOnInit() {
    this.resetPWForm.setValidators(this.passwordValidator);
    this.wizardId = this.authService.getWizardId();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }


  onResetPassword(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.resetPassword(this.wizardId, this.resetPWForm.value.passwordExisting, this.resetPWForm.value.passwordInput);

  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
