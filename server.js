// @see: https://gist.github.com/branneman/8048520
require('app-module-path').addPath(__dirname + '/lib');
const Baby = require('babyparse');
const server = require('nodebootstrap-server');
const appConfig = require('./appConfig');
var app = require('express')();
var Items = require('./lib/items/models/items.js');
var Departments = require('./lib/departments/models/departments.js');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/arkadia');

app = require('nodebootstrap-htmlapp').setup(app);

server.setup(app, appConfig.setup);

// Parse single file
let parsed = Baby.parseFiles('test.csv');

let rows = parsed.data;

Items.remove({},(err) => {
	if (err){
		throw new Error('Whoops');
	}
	Departments.remove({},(err) => {
		if (err){
			throw new Error('Whoops');
		}
		rows.forEach((row, i, rows)=>{
			Items.findOne({name: row[2]}, (err,item) => {
				if (err){
					throw new Error('Whoops');
				}
				let obj_item = {
					date: row[0],
					department: row[1],
					price: row[3],
					quanity: row[4]
				};
				if (item){
					item.purchases.push(obj_item);
					item.total_quanity += parseInt(row[4]);
				}
				else{
					let temp = {
						name: row[2],
						purchases: obj_item,
						total_quanity: row[4]
					};
					let mongo_item = new Items(temp);
					mongo_item.save((err)=>{
						if (err){
							return;
						}
					});
				}
			});
			Departments.findOne({name: row[1]}, (err,dept) => {
				if (err){
					throw new Error('Whoops');
				}
				let obj_dept = {
					date: row[0],
					item: row[2],
					price: row[3],
					quanity: row[4]
				};
				if (dept){
					dept.purchases.push(obj_dept);
				}
				else{
					let temp = {
						name: row[1],
						purchases: obj_dept
					};
					let mongo_dept = new Departments(temp);
					mongo_dept.save((err)=>{
						if (err){
							return;
						}
					});
				}
			});
		});
	});
});

