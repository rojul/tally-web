import { Component, OnInit, OnDestroy, Input, EventEmitter } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-idle-redirector',
  templateUrl: './idle-redirector.component.html',
  styleUrls: ['./idle-redirector.component.css']
})
export class IdleRedirectorComponent implements OnInit, OnDestroy {
  @Input() fastRedirect?: EventEmitter<void>;

  idleState: string;

  constructor(
    private idle: Idle,
    private router: Router
  ) {}

  ngOnInit() {
    this.initIdle();

    if (this.fastRedirect) {
      this.fastRedirect.subscribe(() => {
        this.setIdle(true);
      });
    }
  }

  ngOnDestroy() {
    this.idle.ngOnDestroy();
  }

  private initIdle() {
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onInterrupt.subscribe(() => {
      this.setIdle();
    });

    this.idle.onIdleEnd.subscribe(() => {
      this.idleState = undefined;
    });

    this.idle.onTimeout.subscribe(() => {
      this.idleState = undefined;
      this.router.navigate(['/']);
    });

    this.idle.onTimeoutWarning.subscribe(countdown => {
      this.idleState = 'Keine Aktivität. Umleitung in ' + countdown + ' Sekunden';
    });

    this.setIdle();
  }

  private setIdle(fastRedirect = false) {
    const idle = fastRedirect ? 2 : 15;
    const timeout = fastRedirect ? 1 : 5;
    if (this.idle.getIdle() !== idle) {
      this.idle.setIdle(idle);
      this.idle.setTimeout(timeout);
      this.idle.watch();
    }
  }
}
