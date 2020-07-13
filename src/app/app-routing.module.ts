import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PostListComponent } from "./posts/post-list/post-list.component";
import { ProfileComponent } from "./profile/profile.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { ValidateComponent } from "./auth/validate/validate.component";
import { ValidatedComponent } from "./auth/validated/validated.component";
import { ResetpasswordComponent} from "./auth/resetpassword/resetpassword.component";
import { ResetpwdComponent} from "./auth/resetpwd/resetpwd.component";
import { ResetpasswordloginComponent} from "./auth/resetpasswordlogin/resetpasswordlogin.component";
import { DeleteAccountComponent } from "./auth/deleteaccount/deleteaccount.component";

import { AuthGuard } from "./auth/auth.guard";

const routes: Routes = [
  { path: "", component: PostListComponent },
  { path: "profile/:profileId", component: ProfileComponent, canActivate: [AuthGuard] },
  { path: "create", component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: "edit/:postId", component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: "auth", loadChildren: "./auth/auth.module#AuthModule"},
  { path: "validate/:validcode", component: ValidateComponent},
  { path: "validate", component: ValidateComponent},
  { path: "validated", component: ValidatedComponent},
  { path: "resetpassword", component: ResetpasswordComponent , canActivate: [AuthGuard]  },
  { path: "resetpasswordlogin", component: ResetpasswordloginComponent },
  { path: "resetpwd/:validcode", component: ResetpwdComponent },
  { path: "deleteaccount", component: DeleteAccountComponent, canActivate: [AuthGuard] },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
