require('app-module-path').addPath(__dirname + '/lib');
const server = require('nodebootstrap-server');
const appConfig = require('./appConfig');
let app = require('express')();
let fs = require('fs')
    , util = require('util')
    , stream = require('stream')
    , es = require('event-stream');
let Items = require('./lib/items/models/items.js');
let Departments = require('./lib/departments/models/departments.js');
let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/arkadia');

app = require('nodebootstrap-htmlapp').setup(app);

server.setup(app, appConfig.setup);

let itemsAdd = (row, item_names) => {
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

let deptsAdd = (row, dept_names) => {
	let temp_date = new Date(row[0]);
	let year = temp_date.getFullYear();
	let obj_dept = {
		date: row[0],
		item: row[2],
		price: row[3],
		quanity: row[4],
		year: year
	};
	if (!dept_names.includes(row[1])){
		dept_names.push(row[1]);
		let temp = {
			name: row[1],
			purchases: []
		};
		temp['purchases'] = [];
		temp['purchases'].push(obj_dept);
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
			dept['purchases'].push(obj_dept);
			dept.save((err)=>{
				if (err){
					console.log(dept);
					throw new Error(err);
				}
			})
		});
	}
};
let lineNr = 0;
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
		let s = fs.createReadStream('test.csv')
		    .pipe(es.split())
		    .pipe(es.mapSync((line) => {

		        // pause the readstream
		        s.pause();
		        let row = line.split(',');
		        itemsAdd(row, item_names);
				deptsAdd(row, dept_names);
		        lineNr += 1;
		        console.log(lineNr+' '+row);
		        // resume the readstream, possibly from a callback
		        s.resume();
		    })
		    .on('error', function(){
		        console.log('Error while reading file.');
		    })
		    .on('end', function(){
		        console.log('Read entire file.')
		    })
		);
	});
});


