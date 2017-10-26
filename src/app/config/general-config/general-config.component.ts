import { Component, OnInit, OnDestroy } from '@angular/core';

import { ApiService } from '../../api.service';

@Component({
  selector: 'app-general-config',
  templateUrl: './general-config.component.html',
  styleUrls: ['./general-config.component.css']
})
export class GeneralConfigComponent implements OnInit, OnDestroy {

  loading = true;
  config = {
    title: '',
    theme: '',
    funChanceToWin: 0
  };
  savedConfig = {};
  themes = [{
    id: 'default',
    name: 'Kaffee Braun'
  }, {
    id: 'kos',
    name: 'KOS Blau'
  }];
  config$;

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.getConfig();
  }

  cancel() {
    this.getConfig();
  }

  save() {
    const config = this.cloneConfig();
    config.title = config.title.trim();
    if (config.title === '') {
      config.title = null;
    }

    for (const key of Object.keys(config)) {
      if (config[key] === this.savedConfig[key]) {
        delete config[key];
      }
    }

    this.loading = true;
    this.apiService.updateGeneralConfig(config).then(() => {
      this.getConfig();
    }).catch(err => {
      this.loading = false;
    });
  }

  isChanged() {
    for (const key of Object.keys(this.config)) {
      if (this.config[key] !== this.savedConfig[key]) {
        return true;
      }
    }
    return false;
  }

  getFunChanceToWinSubtitle() {
    const funChanceToWin = Number(this.config.funChanceToWin);
    if (funChanceToWin !== NaN && funChanceToWin !== 0) {
      const percent = 1 / this.config.funChanceToWin * 100;
      return (percent === 100 ? 100 : percent.toPrecision(2)) + '%';
    } else {
      return 'keine';
    }
  }

  private cloneConfig(): any {
    const config = {};
    for (const key of Object.keys(this.config)) {
      config[key] = this.config[key];
    }
    return config;
  }

  private getConfig() {
    this.loading = true;
    this.config$ = this.apiService.getConfig(true).subscribe(config => {
      this.config.title = config.title;
      this.config.theme = config.theme;
      this.config.funChanceToWin = config.funChanceToWin;

      this.savedConfig = this.cloneConfig();
      this.loading = false;
    }, err => {
      this.loading = false;
    });
  }

  ngOnDestroy() {
    this.config$.unsubscribe();
  }

}
