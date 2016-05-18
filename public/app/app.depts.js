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
var KeysPipe = (function () {
    function KeysPipe() {
    }
    KeysPipe.prototype.transform = function (value, args) {
        var keys = [];
        for (var key in value) {
            keys.push({ key: key, value: value[key] });
        }
        return keys;
    };
    KeysPipe = __decorate([
        core_1.Pipe({ name: 'keys' }), 
        __metadata('design:paramtypes', [])
    ], KeysPipe);
    return KeysPipe;
}());
exports.KeysPipe = KeysPipe;
var Dept = (function () {
    function Dept(_id, years) {
        this._id = _id;
        this.years = years;
    }
    return Dept;
}());
exports.Dept = Dept;
var AppDepts = (function () {
    function AppDepts(api) {
        this.api = api;
    }
    AppDepts.prototype.ngOnInit = function () {
        this.deparments();
    };
    AppDepts.prototype.deparments = function () {
        var _this = this;
        this.api.deparments()
            .subscribe(function (depts) { return _this.depts = depts; }, function (error) { return _this.errorMessage = error; });
        console.log(this.depts);
    };
    AppDepts.prototype.generateArray = function (obj) {
        return Object.keys(obj).map(function (key) { return obj[key]; });
    };
    AppDepts = __decorate([
        core_1.Component({
            selector: 'depts',
            template: "<ul>\n                <li *ngFor=\"let dept of depts\">\n\n                \t<h2>{{dept.name}}</h2>\n\t\t\t\t\t<ul>\n\t\t\t\t\t\t<li *ngFor=\"let year of dept.years | keys \">\n\t\t\t\t\t\t\t<details>\n\t\t\t\t\t\t\t<summary>{{ year.key }}</summary>\t\n\t\t\t\t\t\t\t<ol>\n\t\t\t\t\t\t\t\t<li *ngFor=\"let purchase of year.value\">\n\t\t\t\t\t\t\t\t\t<p>{{purchase.date}}</p>\n\t\t\t\t\t\t\t\t\t<p>{{purchase.item}}</p>\n\t\t\t\t\t\t\t\t\t<p>{{purchase.price}}</p>\n\t\t\t\t\t\t\t\t\t<p>{{purchase.quanity}}</p>\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t</ol>\n\t\t\t\t\t\t\t</details>\t \t\t\t\t\n\t\t\t\t\t\t</li>\n\t\t \t\t\t</ul>\n             </ul>",
            providers: [http_1.HTTP_PROVIDERS, api_1.Api],
            pipes: [KeysPipe]
        }), 
        __metadata('design:paramtypes', [api_1.Api])
    ], AppDepts);
    return AppDepts;
}());
exports.AppDepts = AppDepts;
//# sourceMappingURL=app.depts.js.map