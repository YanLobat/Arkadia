require('app-module-path').addPath(__dirname + '/lib');
const Baby = require('babyparse');
const server = require('nodebootstrap-server');
const appConfig = require('./appConfig');
let app = require('express')();
let Items = require('./lib/items/models/items.js');
let Departments = require('./lib/departments/models/departments.js');
let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/arkadia');

app = require('nodebootstrap-htmlapp').setup(app);

server.setup(app, appConfig.setup);

let itemsAdd = (i, row, item_names) => {
	let obj_item = {
		date: row[0],
		department: row[1],
		quanity: row[4]
	};
	if (!item_names.includes(row[2])){
		item_names.push(row[2]);
		let temp = {
			name: row[2],
			price: row[3],
			purchases: obj_item,
			total_quanity: row[4]
		};
		let mongo_item = new Items(temp);
		mongo_item.save((err)=>{
			if (err){
				throw new Error('Whoops');
			}
		});
	}
	else{
		Items.findOne({name: row[2]}, (err,item) => {
			if (err){
				throw new Error('Whoops');
			}
			item.purchases.push(obj_item);
			item.total_quanity += parseInt(row[4]);
			item.save((err)=>{
				if (err){
					throw new Error('Whoops');
				}
			})
		});
	}
};

let deptsAdd = (i, row, dept_names) => {
	let obj_dept = {
		date: row[0],
		item: row[2],
		price: row[3],
		quanity: row[4]
	};
	if (!dept_names.includes(row[1])){
		dept_names.push(row[1]);
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
	else{
		Departments.findOne({name: row[1]}, (err,dept) => {
			if (err){
				throw new Error('Whoops');
			}
			dept.purchases.push(obj_dept);
			dept.save((err)=>{
				if (err){
					throw new Error('Whoops');
				}
			})
		});
	}
};

// Parse single file
let parsed = Baby.parseFiles('test.csv');

let rows = parsed.data;
if (rows[rows.length-1] == ''){
	rows.length--;
}
Items.remove({},(err) => {
	if (err){
		throw new Error('Whoops');
	}
	Departments.remove({},(err) => {
		if (err){
			throw new Error('Whoops');
		}
		let item_names = []; //just temp var
		let dept_names = []; //just temp var
		for (let i = 0; i < rows.length; i++){  //don't use forEach to avoid callback hell :)
			let row = rows[i];
			itemsAdd(i, row, item_names);
			deptsAdd(i, row, dept_names);
		}
	});
});

