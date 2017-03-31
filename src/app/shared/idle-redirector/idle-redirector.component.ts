import { Component, OnInit } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-idle-redirector',
  templateUrl: './idle-redirector.component.html',
  styleUrls: ['./idle-redirector.component.css']
})
export class IdleRedirectorComponent implements OnInit {

  idleState: string;

  constructor(
    private idle: Idle,
    private router: Router
  ) {}

  ngOnInit() {
    this.idle.setIdle(30);
    this.idle.setTimeout(5);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleEnd.subscribe(() => {
      this.idleState = undefined
    })
    this.idle.onTimeout.subscribe(() => {
      this.idleState = undefined
      this.router.navigate(['/']);
    })
    this.idle.onTimeoutWarning.subscribe(countdown => {
      this.idleState = 'Keine Aktivität. Umleitung in ' + countdown + ' Sekunden'
    })

    this.idle.watch();
  }

  ngOnDestroy() {
    this.idle.ngOnDestroy();
  }

}
