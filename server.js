// @see: https://gist.github.com/branneman/8048520
require('app-module-path').addPath(__dirname + '/lib');
const Baby = require('babyparse');
const server = require('nodebootstrap-server');
const appConfig = require('./appConfig');
var app = require('express')();
var Items = require('./lib/items/models/items.js');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/arkadia');

app = require('nodebootstrap-htmlapp').setup(app);

server.setup(app, appConfig.setup);

// Parse single file
let parsed = Baby.parseFiles('test.csv');

let rows = parsed.data;

Items.remove({},(err) => {
	if (err){
		return;
	}
	rows.forEach((item, i, rows)=>{
		let obj_item = {
			date: item[0],
			department: item[1],
			item: item[2],
			price: item[3],
			quanity: item[4]
		};
		let mongo_item = new Items(obj_item);
		mongo_item.save((err)=>{
			if (err){
				return;
			}
		});
	});
});
console.log(rows);