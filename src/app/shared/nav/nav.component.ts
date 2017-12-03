import { Component, OnInit, OnDestroy, OnChanges, Input, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/platform-browser';

import { View } from './view.model';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy, OnChanges {
  @Input() backTo: string[];
  @Input() loading?: boolean;

  loadingShowing: boolean;
  private loadingShowingTimeout;
  config$;
  config = {
    title: '',
    theme: ''
  };
  views: View[] = [{
    name: 'Statistik',
    description: '',
    icon: 'timeline',
    path: 'metrics'
  }, {
    name: 'Einstellungen',
    description: '',
    icon: 'settings',
    path: 'config'
  }];

  constructor(
    private router: Router,
    private apiService: ApiService,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.setTheme();
  }

  ngOnInit() {
    this.config$ = this.apiService.getConfig().subscribe(
      config => {
        this.config = config;
        this.setTheme();
      },
      err => {
      });
  }

  setTheme() {
    this.document.body.className = this.config.theme + '-theme';
  }

  ngOnChanges(changes: any) {
    if (this.loading && !this.loadingShowingTimeout) {
      this.loadingShowingTimeout = setTimeout(() => {
        this.loadingShowing = true;
      }, 500);
    } else if (!this.loading) {
      clearTimeout(this.loadingShowingTimeout);
      this.loadingShowingTimeout = undefined;
      this.loadingShowing = false;
    }
  }

  ngOnDestroy() {
    this.config$.unsubscribe();
  }

}
