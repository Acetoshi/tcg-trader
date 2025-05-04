import { Component, Inject, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { environment } from "../../../../environments/environment";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { HttpClient, HttpParams } from "@angular/common/http";
import { PaginatedResponse, PaginationDefault, PaginationObject } from "../../../core/services/pagination.model";
import { PokedexEntry } from "./pokedex.models";



@Component({
  selector: "app-select-avatar-dialog",
  templateUrl: "./select-avatar-dialog.component.html",
  styleUrls: ["./select-avatar-dialog.component.scss"],
  imports: [CommonModule, TranslateModule, MatDialogModule, MatButtonModule],
})
export class SelectAvatarDialogComponent implements OnInit {
  fileServerBaseUrl = environment.fileServerUrl;
  private apiUrl = environment.apiUrl;

  pokemons = signal<PokedexEntry[]>([]);
  pokemonsPagination = signal<PaginationObject>(PaginationDefault);

  constructor(
    public dialogRef: MatDialogRef<SelectAvatarDialogComponent>,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.fetchPokemons();
  }

  confirm() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }

  fetchPokemons(search?: string) : void{
    let params = new HttpParams();
    if (search) params = params.set("search", search);

    this.http
      .get<PaginatedResponse<PokedexEntry>>(`${this.apiUrl}/pokedex`, { params })
      .subscribe(response => {
        this.pokemonsPagination.set({ next: response.next, previous: response.previous });
        this.pokemons.set(response.results);
      });
  }
}
