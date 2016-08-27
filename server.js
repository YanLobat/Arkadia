require('app-module-path').addPath(__dirname + '/lib');
// require('v8-profiler');
const server = require('nodebootstrap-server');
const appConfig = require('./appConfig');
let app = require('express')();
let fs = require('fs')
    , util = require('util')
    , stream = require('stream')
    , es = require('event-stream')
    ,async = require('async');
let Items = require('./lib/items/models/items.js');
let Departments = require('./lib/departments/models/departments.js');
let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/arkadia');

app = require('nodebootstrap-htmlapp').setup(app);

server.setup(app, appConfig.setup);

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
Items.remove({},(err) => {
	if (err){
		throw new Error('Whoops');
	}
	Departments.remove({},(err) => {
		if (err){
			throw new Error('Whoops');
		}
		const stream = require('stream'); 
		let readableStream = fs.createReadStream('test.csv', 'utf-8');
		let liner = es.split();
		class MyTransform extends stream.Transform {
			constructor() {
				super({readableObjectMode: true, writableObjectMode: true});
				this.item_names = [];
				this.dept_names = [];
				this.counter = 0;
			}
			itemsFilter(row, item_names, done) {
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
						purchases: [],
						total_quanity: row[4]
					};
					temp.purchases.push(obj_item);
					this.push({item: temp});
					return;
					// return done();
				}
				else{		
					Items.findOne({name: row[2]}, (err,item) => {
						if (err){
							return;
							// return done(err);
						}
						if (!item){
							return;
							// return done();
						}
						item.purchases.push(obj_item);
						item.total_quanity += parseInt(row[4]);
						this.push({item: item});
						return;
						// return done();
					});
				}

			}
			deptsFilter(row, dept_names, done) {
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
					temp.purchases.push(obj_dept);
			 		this.push({dept: temp});
			 		return done();
				}
				else{
					Departments.findOne({name: row[1]}, (err,dept) => {
						if (err){
							return done(err);
						}
						if (!dept){
							return done();
						}
						dept.purchases.push(obj_dept);
						this.push({dept: dept});
						return done();
					});
				}
			}
			_transform(chunk, _, done) {
				console.log(this.counter++);
				let itemArray = chunk.split(",");// split the lines on delimiter
				this.itemsFilter(itemArray, this.item_names, done);//check will it be a new item 
				this.deptsFilter(itemArray, this.dept_names, done);//check will it be a new dept 
			}
		}
		class Bulker extends stream.Writable {
			constructor(coll, coll2, capacity) {
					super({ objectMode: true });
					this.coll = coll;
					this.coll2 = coll2;
					this.itemsCounter = 0;
					this.deptsCounter = 0;
					this.items = this.coll.initializeOrderedBulkOp();
					this.depts = this.coll2.initializeOrderedBulkOp();
					this.capacity = capacity;
			}
			insertItems(done) {
				this.items.execute((err,result) => {
					if (err) return done(err); 
					this.items = this.coll.initializeOrderedBulkOp();
					if (typeof done == 'Function')	
						return done();
					else
						return;
				});	
			}
			insertDepts(done) {
				this.depts.execute((err,result) => {
					if (err) return done(err); 
					this.items = this.coll2.initializeOrderedBulkOp();
					if (typeof done == 'Function')	
						return done();
					else {
						console.log('end');
						return;
					}
				});	
			}
			_write(element, _, done) {
				if (element.item !== undefined) {
					this.items.find( { name: element.item.name } ).upsert().update({'$set': element.item}); 
					this.itemsCounter++;
				}
				else {
					this.depts.find( { name: element.dept.name } ).upsert().update({'$set': element.dept}); 
					this.deptsCounter++;
				}
				console.log(this.itemsCounter);
				if (this.itemsCounter % this.capacity == 0 && element.item !== undefined) {
					this.insertItems(done);
				} 
				if (this.deptsCounter % this.capacity == 0 && element.dept !== undefined) {
					this.insertDepts(done);
				} 
				return done();
			}
			end(item, _, done) {
				return this.insertItems(done);
			}

		}
		let transformer = new MyTransform();
		let bulker = new Bulker(Items.collection,Departments.collection, 3000);
		readableStream
		.pipe(liner)
		.pipe(transformer)
		.pipe(bulker)
		.on('error', function(){
			console.log('Error while reading file.');
		})
		.on('end', function(){
			console.log('Read entire file.')
		});
		// .pipe(es.split())
		// .pipe(es.mapSync((line) => {
		// 	// async.series(
		// 	// 	[
		// 	// 		(callback) => {
		// 	// 			let row = line.split(",");     // split the lines on delimiter
		// 	// 			let obj = itemsAdd(row, item_names);            
		// 	// 			// other manipulation
		// 	// 			if (obj){
		// 	// 				bulk.find( { name: obj.name } ).upsert().update({'$set': obj}); 
		// 	// 			}

		// 	// 			lineNr++;

		// 	// 			if ((lineNr % 3000 == 0 ) && (bulk.length > 0)) {
		// 	// 				console.log(lineNr);
		// 	// 				bulk.execute((err,result) => {
		// 	// 					if (err) throw err;   // or do something
		// 	// 					// possibly do something with result
		// 	// 					bulk = Items.collection.initializeOrderedBulkOp();
		// 	// 					callback();
		// 	// 				});
		// 	// 			} else {

		// 	// 				callback();
		// 	// 			}
		// 	// 		}
		// 	// 	],
		// 	// 	(err) => {
		// 	// 	// each iteration is done
		// 	// 	}
		// 	// );

		// })
		// .on('error', function(){
		// 	console.log('Error while reading file.');
		// })
		// .on('end', function(){
		// 	console.log('Read entire file.')
		// })
		// );
	});
});


