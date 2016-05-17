import { Component } from '@angular/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';

import { Api } from './api';
import { AppItems } from './app.items';
import { AppDepts } from './app.depts';


@Component({
  selector: 'my-app',
  template: `
    <h1>{{title}}</h1>
    <nav>
      <a [routerLink]="['AppItems']">Items</a>
      <a [routerLink]="['AppDepts']">Departments</a>
    </nav>
    <router-outlet></router-outlet>
  `,
  directives: [ROUTER_DIRECTIVES],
  providers: [
    ROUTER_PROVIDERS,
    Api
  ]
})
@RouteConfig([
  {
    path: '/',
    name: 'AppItems',
    component: AppItems,
    useAsDefault: true
  },
  {
    path: '/departments',
    name: 'AppDepts',
    component: AppDepts
  }
])
export class AppComponent {
  title = 'Test Task';
}