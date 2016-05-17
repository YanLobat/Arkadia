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
var api_1 = require('./api');
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
exports.Item = Item;
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
            templateUrl: "/",
            template: "<ul>\n                <li *ngFor=\"let item of items\">\n\n                \t<h2>{{item.name}}</h2>\n\t\t \t\t\t<p> {{item.price}} \u0440\u0443\u0431.</p>\n\t\t\t\t\t<p> {{item.total_quanity}} \u0448\u0442.</p>\n\t\t\t\t\t<ol>\n\t\t\t\t\t\t<li *ngFor=\"let purchase of item.purchases \">\n\t\t \t\t\t\t\t\t<p> {{purchase.date}}</p>\n\t\t \t\t\t\t\t\t<p> {{purchase.department}}</p>\n\t\t \t\t\t\t\t\t<p> {{purchase.quanity}}</p>\n\t\t \t\t\t\t</li>\n\t\t \t\t\t</ol>\n             </ul>",
            providers: [http_1.HTTP_PROVIDERS, api_1.Api],
        }), 
        __metadata('design:paramtypes', [api_1.Api])
    ], AppItems);
    return AppItems;
}());
exports.AppItems = AppItems;
//# sourceMappingURL=app.items.js.map