import { Directive, Input, EventEmitter, ElementRef, Renderer, Inject, OnInit } from '@angular/core';

@Directive({
  selector: '[appFocus]'
})
export class FocusDirective implements OnInit {
  @Input() appFocus: EventEmitter<boolean>;

  constructor(@Inject(ElementRef) private element: ElementRef, private renderer: Renderer) { }

  ngOnInit() {
    this.appFocus.subscribe(event => {
      this.renderer.invokeElementMethod(this.element.nativeElement, 'focus', []);
    });
  }
}
