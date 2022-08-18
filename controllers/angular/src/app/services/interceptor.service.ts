import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  hostname: string;
  port: string;
  formattedAgentUrl: string;

  constructor() {
    this.hostname = $ENV.ALICE_AGENT_HOST || 'localhost';
    this.port = $ENV.RUNMODE === 'pwd' ? '' : ':8031';
    this.formattedAgentUrl = `http://${this.hostname}` + this.port;
    console.log('Agent is running on: ' + this.formattedAgentUrl);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    req = req.clone({
      url: this.formattedAgentUrl + req.url
    });
    return next.handle(req);
  }
}
