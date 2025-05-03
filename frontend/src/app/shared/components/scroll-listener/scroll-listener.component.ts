import { Component, ElementRef, ViewChild, Inject, PLATFORM_ID, OnInit, Output, EventEmitter } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

@Component({
  selector: "app-scroll-listener",
  template: '<div #scrollAnchor class="scroll-anchor"></div>',
  styleUrl: "./scroll-listener.component.scss",
})
export class ScrollListenerComponent implements OnInit {
  @ViewChild("scrollAnchor") scrollAnchor: ElementRef | undefined;
  @Output() reachedBottom = new EventEmitter<void>();

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit() {
    setTimeout(() => {
      this.setupScrollListener();
    }, 5);
  }

  setupScrollListener() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.scrollAnchor) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          this.reachedBottom.emit();
        }
      },
      { root: null, rootMargin: "100px", threshold: 0.1 }
    );

    observer.observe(this.scrollAnchor.nativeElement);
  }
}
