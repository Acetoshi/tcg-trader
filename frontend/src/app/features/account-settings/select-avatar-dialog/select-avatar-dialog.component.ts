import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { environment } from "../../../../environments/environment";
import { PaginatedResponse, PaginationDefault, PaginationObject } from "../../../core/services/pagination.model";
import { PokedexEntry } from "./pokedex.models";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { HttpClient, HttpParams } from "@angular/common/http";
import { ScrollListenerComponent } from "../../../shared/components/scroll-listener/scroll-listener.component";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatIcon } from "@angular/material/icon";
import { debounceTime } from "rxjs";

@Component({
  selector: "app-select-avatar-dialog",
  templateUrl: "./select-avatar-dialog.component.html",
  styleUrls: ["./select-avatar-dialog.component.scss"],
  imports: [
    CommonModule,
    TranslateModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIcon,
    MatInput,
    ScrollListenerComponent,
    ReactiveFormsModule,
  ],
})
export class SelectAvatarDialogComponent implements OnInit {
  fileServerBaseUrl = environment.fileServerUrl;
  private apiUrl = environment.apiUrl;

  searchForm!: FormGroup;

  pokemons = signal<PokedexEntry[]>([]);
  pokemonsPagination = signal<PaginationObject>(PaginationDefault);

  selectedAvatarUrl = signal<string>(
    "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/detail/003.png"
  );

  constructor(
    public dialogRef: MatDialogRef<SelectAvatarDialogComponent>,
    private http: HttpClient,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.fetchPokemons();

    // Debounce the input and fetch pokemons
    // when the user types in the search field
    this.searchForm
      .get("search")
      ?.valueChanges.pipe(debounceTime(600))
      .subscribe(() => {
        this.fetchPokemons(this.searchForm.get("search")?.value);
      });
  }

  confirm() {
    this.dialogRef.close(this.selectedAvatarUrl());
  }

  cancel() {
    this.dialogRef.close(false);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
  }

  createForm() {
    this.searchForm = this.fb.group({ search: "" });
  }

  fetchPokemons(search?: string): void {
    let params = new HttpParams();
    if (search) params = params.set("search", search);

    this.http.get<PaginatedResponse<PokedexEntry>>(`${this.apiUrl}/pokedex`, { params }).subscribe(response => {
      this.pokemonsPagination.set({ next: response.next, previous: response.previous });
      this.pokemons.set(response.results);
    });
  }

  fetchPokemonsNextPage(): void {
    if (this.pokemonsPagination().next) {
      this.http.get<PaginatedResponse<PokedexEntry>>(this.pokemonsPagination().next as string).subscribe(response => {
        this.pokemonsPagination.set({ next: response.next, previous: response.previous });
        this.pokemons.set([...this.pokemons(), ...response.results]);
      });
    }
  }
}
