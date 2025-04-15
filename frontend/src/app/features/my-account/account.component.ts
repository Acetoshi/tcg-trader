import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, FormGroup } from "@angular/forms";

// Angular Material Modules
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatIconModule } from "@angular/material/icon";
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.scss"],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatIconModule,
  ],
})
export class AccountComponent implements OnInit {
  publicInfoForm: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.publicInfoForm = this.fb.group({
      username: [""],
      tcgpId: [""],
      bio: [""],
    });
  }

  ngOnInit(): void {
    const user = this.authService.user();
    if (user) {
      this.publicInfoForm.patchValue({
        username: user.username ?? "",
        tcgpId: user.tcgpId ?? "",
        bio: user.bio ?? "",
      });
    }
  }

  get user() {
    return this.authService.user();
  }
}
