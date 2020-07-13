import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "../../environments/environment";
import { Profile } from "../models/profile.model";

const BACKEND_URL = environment.apiUrl + '/wizard';

@Injectable({ providedIn: "root" })
export class ProfileService {
  private profile: Profile[] = [];
  private profileUpdated = new Subject<{ profile: Profile[]; profileCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getProfileUpdateListener() {
    return this.profileUpdated.asObservable();
  }

  getProfile(id: string) {
    console.log('id: ' + id);
    return this.http.get<{
      _id: string;
      email:  string;
      firstname:  string;
      lastname: string;
      dob: Date;
      lastLogin: Date;
      signupDate: Date
    }>(BACKEND_URL + '/profile/' + id);
  }

  deleteprofile(profileId: string) {
    return this.http.delete(BACKEND_URL + profileId);
  }
}
