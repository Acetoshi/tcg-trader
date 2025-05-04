import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, FormGroup } from "@angular/forms";
import { TranslateModule, TranslateService } from "@ngx-translate/core";

// Angular Material Modules
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatIconModule } from "@angular/material/icon";
import { AuthService } from "../../../core/services/auth.service";
import { ToastService } from "../../../core/services/toast.service";
import { SelectAvatarDialogComponent } from "../select-avatar-dialog/select-avatar-dialog.component";
import { MatDialog } from "@angular/material/dialog";

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
    TranslateModule,
  ],
})
export class AccountComponent implements OnInit {
  publicInfoForm: FormGroup;
  userNameUnicityError = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private translateService: TranslateService,
    private dialog: MatDialog,
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
        username: user?.username ?? "",
        tcgpId: user?.tcgpId ?? "",
        bio: user?.bio ?? "",
      });
    }
  }

  get user() {
    return this.authService.user();
  }

  resetForm() {
    const user = this.authService.user();
    this.publicInfoForm.reset({
      username: user?.username ?? "",
      tcgpId: user?.tcgpId ?? "",
      bio: user?.bio ?? "",
    });
  }

  async onSubmit() {
    const { username, tcgpId, bio } = this.publicInfoForm.value;

    const { success, message } = await this.authService.updateUser(username, tcgpId, bio);
    if (success) {
      this.toastService.showSuccess(message);
      this.resetForm();
    } else {
      this.toastService.showError(message);
    }
  }

  openAvatarSelectionDialog(e: MouseEvent) {
    e.preventDefault();
    console.log("Opening avatar selection dialog");
      const dialogRef = this.dialog.open(SelectAvatarDialogComponent, {
        maxWidth: "95vw",
        autoFocus: false,
        backdropClass: "blurred-dialog-backdrop",
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log("Dialog closed with result:", result);
    })}
}
