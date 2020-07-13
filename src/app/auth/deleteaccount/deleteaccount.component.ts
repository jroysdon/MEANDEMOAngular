import { Component,  OnInit, OnDestroy } from '@angular/core';
import { NgForm , FormGroup, FormControl, FormGroupDirective, Validators } from '@angular/forms';
import { Router  } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-deleteaccount',
  templateUrl: './deleteaccount.component.html',
  styleUrls: ['./deleteaccount.component.css']
})
export class DeleteAccountComponent implements OnInit , OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  private profileId: string;
  // private deleteAccountForm: FormGroup;
  deleteAccountForm = new FormGroup({
    password: new FormControl(''),
    deleteContent: new FormControl('True')
  });

  constructor(
    public authService: AuthService,
    private router: Router

  ) { }

  ngOnInit() {
    this.deleteAccountForm;
    this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe(authStatus => {
      this.isLoading = false;
    });
  }

  onDeleteAccount(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = false;
    // tslint:disable-next-line: max-line-length
    this.authService.deleteWizard(this.authService.getWizardId(), this.deleteAccountForm.value.password, this.deleteAccountForm.value.deleteContent);
  }


  ngOnDestroy() {

  }
}
