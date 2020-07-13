import { Component, NgModule, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { ProfileService } from '../services/profile.service';
import { Profile } from '../models/profile.model';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit, OnDestroy {
  profile: Profile;
  isLoading = false;
  form: FormGroup;

  private profileId: string;
  private authStatusSub: Subscription;

  constructor(
    public profilesService: ProfileService,
    public route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  private formatDate(dateIn){
    if (dateIn != null){
      return new DatePipe('en-US').transform(dateIn, 'MM/dd/yyyy');
    } else {
      return '';
    }
  }

   ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      email: new FormControl({value: '', disabled: true, }),
      firstname: new FormControl({value: '', disabled: true, }),
      lastname: new FormControl({value: '', disabled: true, }),
      dob: new FormControl({value: '', disabled: true, }),
      lastLogin: new FormControl({value: '', disabled: true, }),
      signupDate: new FormControl({value: '', disabled: true, })
      });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('profileId')){
        this.profileId = paramMap.get('profileId');
        this.isLoading = true;
        this.profilesService.getProfile(this.profileId).subscribe(profileData => {
          this.isLoading = false;
          this.profile = {
            id: profileData._id,
            email: profileData.email,
            firstname: profileData.firstname,
            lastname: profileData.lastname,
            dob: profileData.dob,
            lastLogin: profileData.lastLogin,
            signupDate: profileData.signupDate
          };
          this.form.setValue({
            email: this.profile.email,
            firstname: this.profile.firstname,
            lastname: this.profile.lastname,
            dob: this.formatDate(this.profile.dob),
            lastLogin: this.formatDate(this.profile.lastLogin),
            signupDate: this.formatDate(this.profile.signupDate)

          });
        });
      } else{
        this.profileId = null;
      }
    });
   }

resetPassword(e){
  console.log('Resetting Password: ' + this.profile.id);
  this.router.navigate(['/resetpassword']);
}

deleteAccount(e){
  this.router.navigate(['/deleteaccount']);
}
 onSaveProfile() {
   console.log('This fires too');
  //   if (this.form.invalid) {
  //     return;
  //   }
  //   this.isLoading = true;
  //      this.profilesService.updateProfile(
  //       this.profileId,
  //       this.form.value.name,
  //       this.form.value.bio,
  //       this.form.value.image
  //      );

  //   this.form.reset();
   }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
