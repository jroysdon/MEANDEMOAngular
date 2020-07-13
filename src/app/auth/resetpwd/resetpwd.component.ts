import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, NgForm, FormGroupDirective } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import {ErrorStateMatcher} from '@angular/material';

import { ValidateService} from '../../services/validate.service';

/** Error when the parent is invalid */
class CrossFieldErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return control.dirty && form.invalid;
  }
}

@Component({
  selector: 'app-resetpwd',
  templateUrl: './resetpwd.component.html',
  styleUrls: ['./resetpwd.component.css']
})

export class ResetpwdComponent implements OnInit, OnDestroy {
  isLoading = false;
  private validateStatusSub: Subscription;
  private validateEmailSub: Subscription;
  private validCode: string;
  public validatedEmail: string;
  errorMatcher = new CrossFieldErrorMatcher();
  resetPWForm = new FormGroup({
    passwordInput: new FormControl(''),
    passwordConfirmInput: new FormControl(''),
  });

  constructor(
    public validateService: ValidateService,
    private route: ActivatedRoute,
    private router: Router,

    ) {
      // this.initForm();
    }

    passwordValidator(resetPWForm: FormGroup) {
      // console.log('pw:' + form.get('passwordInput').value)
      // console.log('pwc:' + form.get('passwordConfirmInput').value)
      const condition = resetPWForm.get('passwordInput').value !== resetPWForm.get('passwordConfirmInput').value;
      return condition ? { passwordsDoNotMatch: true} : null;
    }

    // initForm() {
    //   this.form = this.fb.group({
    //     email: new FormControl({value:'', disabled: true, }),
    //     passwordInput: new FormControl({value:'' }),
    //     passwordConfirmInput: new FormControl({value:'' })
    //   }, {
    //     validator: this.passwordValidator
    //   })
    // }


  ngOnInit() {
    this.resetPWForm.setValidators(this.passwordValidator);
    this.validateStatusSub = this.validateService.getValidaterListener().subscribe(
      validateStatus => {
          this.isLoading = false;
         }
    );
    this.validateEmailSub = this.validateService.getValidatedEmailListener().subscribe(
      validateEmailStatus => {
          this.validatedEmail = validateEmailStatus;
        }
    );

    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('validcode')) {
          this.validCode = paramMap.get('validcode');
          this.validateService.resetPWWizard(this.validCode);
      } else {
          console.log('You are screwed');
          this.isLoading = false;
          this.validCode = 'No - such Code';
      }
  });
}

onResetPassword() {
   if (this.resetPWForm.invalid) {
    return;
   } else {
     this.validateService.resetPW(this.validCode, this.resetPWForm.value.passwordInput);
     this.router.navigate(['/']);
   }

}

onCancel() {
  this.router.navigate(['/']);
}


  ngOnDestroy() {
   this.validateStatusSub.unsubscribe();
  }
}
