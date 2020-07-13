import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from "rxjs";

import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  wizardIsAuthenticated = false;
  private authListenerSubs: Subscription;
  public wizardId : string;

  constructor(
    private authService: AuthService,
    private router: Router 
    ) {}

  ngOnInit() {
    this.wizardIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.wizardIsAuthenticated = isAuthenticated;
        this.wizardId = this.authService.getWizardId()
      }
      );
  }

  onProfile() {
    this.wizardId = this.authService.getWizardId()
    if (this.wizardIsAuthenticated != null){
      this.router.navigate(['profile/'+ this.wizardId ]);
    } else {
      console.log ('Something is borked. wizardId is ' + this.wizardId )
    }
  }
  
  onLogout() {
    this.authService.logout();
  }
  
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
