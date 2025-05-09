import { Component, computed, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";
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
import { environment } from "../../../../environments/environment";

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

  fileServerBaseUrl = environment.fileServerUrl;

  avatarUrl = computed(() => {
    const user = this.authService.user();
    if (!user) return "";
    if (user.avatarUrl) return user.avatarUrl;
    return "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/001.png";
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private translateService: TranslateService,
    private dialog: MatDialog
  ) {
    this.publicInfoForm = this.fb.group({
      username: ["", [Validators.minLength(4), Validators.maxLength(20)]],
      tcgpId: ["", [Validators.minLength(19)]], // 16 digits + 3 dashes
      bio: ["", [Validators.maxLength(200)]],
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
    this.filterTrainerIdInput();
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

  onSubmit() {
    this.authService.updateUser(this.publicInfoForm.value).subscribe({
      next: () => {
        this.toastService.showSuccess("Profile updated with success");
        this.resetForm();
      },
      error: error => {
        console.error("Error updating your profile:", error);
        this.toastService.showError(this.translateService.instant("accountSettings.errors.updateUser"));
      },
    });
  }

  filterTrainerIdInput() {
    this.publicInfoForm.get("tcgpId")?.valueChanges.subscribe(value => {
      if (value) {
        const digitsOnly = value.replace(/\D/g, "").slice(0, 16);
        const formatted = digitsOnly.match(/.{1,4}/g)?.join("-") || "";
        if (formatted !== value) {
          this.publicInfoForm.get("tcgpId")?.setValue(formatted);
        }
      }
    });
  }

  openAvatarSelectionDialog(e: MouseEvent) {
    e.preventDefault();
    const dialogRef = this.dialog.open(SelectAvatarDialogComponent, {
      maxWidth: "95vw",
      autoFocus: false,
      backdropClass: "blurred-dialog-backdrop",
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return; // user cancelled the dialog
      this.authService.updateUser({ avatarUrl: result }).subscribe({
        next: () => {
          this.toastService.showSuccess("Avatar updated with success");
          this.resetForm();
        },
        error: error => {
          console.error("Error updating your avatar:", error);
          this.toastService.showError(this.translateService.instant("accountSettings.errors.updateUser"));
        },
      });
    });
  }
}
