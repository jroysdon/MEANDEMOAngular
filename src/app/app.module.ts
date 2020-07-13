import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { AppRoutingModule } from "./app-routing.module";
import { AuthInterceptor } from "./auth/auth-interceptor";
import { ErrorInterceptor } from "./error-interceptor";
import { ErrorComponent } from "./error/error.component";
import { AngularMaterialModule } from "./angular-material.module";
import { PostsModule } from "./posts/posts.module";
import { MountainStatComponent } from "./mountainStat/mountainStat.component";
import { ProfileStatComponent } from "./profilestats/profilestats.component";
import { FooterComponent } from "./footer/footer.component";
import { ProfileComponent } from "./profile/profile.component";
import { ReactiveFormsModule } from '@angular/forms';
import { ValidateComponent } from "./auth/validate/validate.component";
import { ValidatedComponent } from "./auth/validated/validated.component";
import { ResetpasswordComponent } from './auth/resetpassword/resetpassword.component';
import { DeleteAccountComponent } from './auth/deleteaccount/deleteaccount.component';
import { ResetpasswordloginComponent } from './auth/resetpasswordlogin/resetpasswordlogin.component';
import { ResetpwdComponent } from './auth/resetpwd/resetpwd.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent,
    MountainStatComponent,
    ProfileStatComponent,
    FooterComponent,
    ProfileComponent,
    ValidateComponent,
    ValidatedComponent,
    ResetpasswordComponent,
    DeleteAccountComponent,
    ResetpasswordloginComponent,
    ResetpwdComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    PostsModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule {}
