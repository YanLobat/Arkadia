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
var http_1 = require('@angular/http');
require('rxjs/add/operator/map');
var Api = (function () {
    function Api(http) {
        this.http = http;
    }
    Api.prototype.topItems = function () {
        var endpoint = 'http://localhost:3000/';
        return this.http
            .get(endpoint, {})
            .map(function (res) { return res.json().response.docs; });
    };
    return Api;
}());
var AppItems = (function () {
    function AppItems(api) {
        this.api = api;
    }
    AppItems.prototype.ngOnInit = function () {
        this.items = this.api.topItems();
    };
    AppItems = __decorate([
        core_1.Component({
            selector: 'top-items',
            template: "<ul>\n                <li *ngFor=\"let item of items | async\"> {{item.name}} </li>\n             </ul>",
            providers: [http_1.HTTP_PROVIDERS, Api],
        }), 
        __metadata('design:paramtypes', [Api])
    ], AppItems);
    return AppItems;
}());
exports.AppItems = AppItems;
core_1.enableProdMode();
//# sourceMappingURL=app.items.js.map