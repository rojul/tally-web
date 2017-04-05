import { Component, OnInit } from '@angular/core';

import { ApiService } from '../../api.service';

@Component({
  selector: 'app-general-config',
  templateUrl: './general-config.component.html',
  styleUrls: ['./general-config.component.css']
})
export class GeneralConfigComponent implements OnInit {

  loading = true;
  config = {
    title: '',
    theme: ''
  }
  savedConfig = {};
  themes = [
    {id: 'default', name: 'Kaffee Braun'},
    {id: 'kos', name: 'KOS Blau'}
  ];

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.getConfig();
  }

  cancel() {
    this.getConfig()
  }

  save() {
    let config = this.cloneConfig();
    config.title = config.title.trim();
    if (config.title === '') {
      config.title = null;
    }

    for (let key of Object.keys(config)) {
      if (config[key] === this.savedConfig[key]) {
        delete config[key];
      }
    }

    this.loading = true;
    this.apiService.updateGeneralConfig(config).then(() => {
      this.getConfig();
    }).catch(err => {
      this.loading = false;
    })
  }

  isChanged() {
    for (let key of Object.keys(this.config)) {
      if (this.config[key] !== this.savedConfig[key]) {
        return true;
      }
    }
    return false;
  }

  private cloneConfig(): any {
    let config = {};
    for (let key of Object.keys(this.config)) {
      config[key] = this.config[key];
    }
    return config;
  }

  private getConfig() {
    this.loading = true;
    this.apiService.getConfig().subscribe(config => {
      this.config.title = config.title;
      this.config.theme = config.theme;

      this.savedConfig = this.cloneConfig();
      this.loading = false;
    }, err => {
      this.loading = false;
    })
  }

}
