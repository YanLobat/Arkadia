require('app-module-path').addPath(__dirname + '/lib');
const server = require('nodebootstrap-server');
const appConfig = require('./appConfig');
let app = require('express')();
let LineInputStream = require("line-input-stream");
let fs = require('fs')
    , util = require('util')
    , stream = require('stream')
    , es = require('event-stream')
    , async = require('async');
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
		return temp;
	}
	else{
		Items.findOne({name: row[2]}, (err,item) => {
			if (err){
				throw new Error('Whoops');
			}
			if (item){
				item.purchases.push(obj_item);
				item.total_quanity += parseInt(row[4]);
				item.save((err)=>{
					if (err){
						throw new Error('Whoops');
					}
					return 0;
				})
			}
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
let counter = 0;
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
		let bulk = Items.collection.initializeUnorderedBulkOp();
		let stream = LineInputStream(fs.createReadStream('test.csv',{flags: "r"}));
		stream.setDelimiter("\n");
		stream.on("error",function(err) {
	        console.log(err); // or otherwise deal with it
	    });
		stream.on("line",function(line) {

	        async.series(
	            [
	                function(callback) {
	                    var row = line.split(",");     // split the lines on delimiter
	                    let item  = itemsAdd(row, item_names);          
	                    // other manipulation
	                    if (item)
	                    	bulk.insert(item);  // Bulk is okay if you don't need schema
	                                       // defaults. Or can just set them.

	                    counter++;
	                    console.log(counter);
	                    if ( counter % 1000 == 0 ) {
	                        bulk.execute(function(err,result) {
	                            if (err) {
	                            	console.log(result);
	                            	throw err;   // or do something
	                           	}
	                            // possibly do something with result
	                            bulk = Items.collection.initializeUnorderedBulkOp();
	                            callback();
	                        });
	                    } else {
	                        callback();
	                    }
	               }
	           ],
	           function (err) {
	               // each iteration is done
	           }
	       );

	    });
	    stream.on("end",function() {

	        if ( counter % 1000 != 0 ){
	            bulk.execute(function(err,result) {
	                if (err) throw err;   // or something
	                // maybe look at result
	            });
	        }
	    });
	});
});


