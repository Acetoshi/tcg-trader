import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CardFilterBarComponent } from "../../cards/card-filter-bar/card-filter-bar.component";
import { CollectionService } from "../../../core/services/collection.service";
import { CollectionItemComponent } from "../collection-item/collection-item.component";

@Component({
  selector: "app-my-collection",
  templateUrl: "./my-collection.component.html",
  styleUrls: ["./my-collection.component.scss"],
  imports: [CommonModule, CardFilterBarComponent, CollectionItemComponent],
})
export class MyCollectionComponent implements OnInit {
  constructor(public collectionService: CollectionService) {}

  ngOnInit(): void {
    this.collectionService.fetchMyCollection(this.collectionService.filters());
  }
}
