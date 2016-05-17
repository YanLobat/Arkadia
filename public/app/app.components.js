"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var router_deprecated_1 = require('@angular/router-deprecated');
var api_1 = require('./api');
var app_items_1 = require('./app.items');
var app_depts_1 = require('./app.depts');
var AppComponent = (function () {
    function AppComponent() {
        this.title = 'Test Task';
    }
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            template: "\n    <h1>{{title}}</h1>\n    <nav>\n      <a [routerLink]=\"['AppItems']\">Items</a>\n      <a [routerLink]=\"['AppDepts']\">Departments</a>\n    </nav>\n    <router-outlet></router-outlet>\n  ",
            directives: [router_deprecated_1.ROUTER_DIRECTIVES],
            providers: [
                router_deprecated_1.ROUTER_PROVIDERS,
                api_1.Api
            ]
        }),
        router_deprecated_1.RouteConfig([
            {
                path: '/',
                name: 'AppItems',
                component: app_items_1.AppItems,
                useAsDefault: true
            },
            {
                path: '/departments',
                name: 'AppDepts',
                component: app_depts_1.AppDepts
            }
        ]), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.components.js.map