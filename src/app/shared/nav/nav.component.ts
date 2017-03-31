import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { View } from './view.model';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  @Input() backTo: string[];
  @Input() loading?: boolean;
  loadingShowing: boolean;
  private loadingShowingTimeout;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: any) {
    if (this.loading && !this.loadingShowingTimeout) {
      this.loadingShowingTimeout = setTimeout(() => {
        this.loadingShowing = true;
      }, 500)
    } else if (!this.loading) {
      clearTimeout(this.loadingShowingTimeout);
      this.loadingShowingTimeout = undefined;
      this.loadingShowing = false;
    }
  }

  views: View[] = [{
    name: "Statistik",
    description: "",
    icon: "timeline",
    path: "metrics"
  }, {
    name: "Einstellungen",
    description: "",
    icon: "settings",
    path: "config"
  }]

}
