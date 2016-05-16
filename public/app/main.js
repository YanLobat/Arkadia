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
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
// import { AppItems } from './app.items';
// bootstrap(AppItems);
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var Observable_1 = require('rxjs/Observable');
require('rxjs/add/operator/map');
var Api = (function () {
    function Api(http) {
        this.http = http;
        this.endpoint = 'http://localhost:3000/get';
    }
    Api.prototype.topItems = function () {
        return this.http
            .get(this.endpoint)
            .map(function (res) { return res.json(); });
    };
    Api.prototype.extractData = function (res) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Response status: ' + res.status);
        }
        var body = res.json();
        return body.data || {};
    };
    Api.prototype.handleError = function (error) {
        // In a real world app, we might use a remote logging infrastructure
        var errMsg = error.message || 'Server error';
        console.error(errMsg); // log to console instead
        return Observable_1.Observable.throw(errMsg);
    };
    Api = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], Api);
    return Api;
}());
var Item = (function () {
    function Item(_id, name, price, total_quanity, purchases) {
        this._id = _id;
        this.name = name;
        this.price = price;
        this.total_quanity = total_quanity;
        this.purchases = purchases;
    }
    return Item;
}());
var AppItems = (function () {
    function AppItems(api) {
        this.api = api;
    }
    AppItems.prototype.ngOnInit = function () {
        this.topItems();
    };
    AppItems.prototype.topItems = function () {
        var _this = this;
        this.api.topItems()
            .subscribe(function (items) { return _this.items = items; }, function (error) { return _this.errorMessage = error; });
        console.log(this.items);
    };
    AppItems = __decorate([
        core_1.Component({
            selector: 'top-items',
            template: "\n  \t\t\t<ul>\n                <li *ngFor=\"let item of items\"> {{item.name}} </li>\n             </ul>",
            providers: [http_1.HTTP_PROVIDERS, Api],
        }), 
        __metadata('design:paramtypes', [Api])
    ], AppItems);
    return AppItems;
}());
core_1.enableProdMode();
platform_browser_dynamic_1.bootstrap(AppItems)
    .catch(function (err) { return console.error(err); });
//# sourceMappingURL=main.js.map