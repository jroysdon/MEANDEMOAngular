import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";

import { ValidateService} from "../../services/validate.service"


@Component({
  selector: "app-validate",
  templateUrl: "./validate.component.html",
  styleUrls: ["./validate.component.css"]
})

export class ValidateComponent implements OnInit, OnDestroy {
    isLoading = false;
    private validateStatusSub: Subscription;

    validCode;

    constructor(
        public validateService: ValidateService,
        public route: ActivatedRoute,
      ) {}

    ngOnInit() {
        this.validateStatusSub = this.validateService.getValidaterListener().subscribe(
            validateStatus => {
                this.isLoading = false;
               }
        )
        this.isLoading = true;
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has("validcode")) {
                this.validCode = paramMap.get("validcode");
                this.validateService.validateWizard(this.validCode)
            } else { 
                console.log('You are screwed')
                this.isLoading = false;
                this.validCode = 'No - such Code'
            }
        })
    }      


    ngOnDestroy() {
        this.validateStatusSub.unsubscribe();
    }
}