require('app-module-path').addPath(__dirname + '/lib');
require('v8-profiler');
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
		const readableStream = fs.createReadStream('test.csv',{encoding: 'utf-8'});
		const Transform = require('stream').Transform;
		const myTransform = new Transform({
			readableObjectMode: true,

			transform(chunk, encoding, callback) {
				let row = chunk.toString().split(",");// split the lines on delimiter
				this.push(row);
			    // Push the data onto the readable queue.
			    callback();
			}
		});

		myTransform.setEncoding('utf8');
		const stream = require('stream'); 
		class Bulker extends stream.Writable {
			constructor(coll, capacity=3000) {

					super({ objectMode: true });
					this.lineNr = 0;
					this.encoding = 'utf-8';
					this.coll = coll;

					this.bulk = coll.initializeOrderedBulkOp();

					this.capacity = capacity;
					this.item_names = [];
					this.dept_names = [];

			}
			itemsAdd(row, item_names) {
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
						if (!item){
							return 0;
						}
						item.purchases.push(obj_item);
						item.total_quanity += parseInt(row[4]);
						return item;
						item.save((err)=>{
							if (err){
								throw new Error('Whoops');
							}
							return 0;
						})
					});
				}
			}
			insert(that, coll, done) {
				that.bulk.execute((err,result) => {
					if (err) throw err;   // or do something
					// possibly do something with result
					that.bulk = that.coll.initializeOrderedBulkOp();
					
					done();
				});	
			}
			_write(item, encoding, done) {
				item.toString();
				let obj = this.itemsAdd(item, this.item_names);            
				// other manipulation
				if (obj){
					this.bulk.find( { name: obj.name } ).upsert().update({'$set': obj}); 
				}

				this.lineNr++;
				console.log(this.insert);
				if ((this.lineNr % 3000 === this.capacity) && (this.bulk.length > 0)){
					this.insert(this,this.coll, done)

				} 
				else {
					done();
				}
			}
			end(item, encoding, done) {
				item.toString();
				let obj = itemsAdd(item, this.item_names);            
				// other manipulation
				if (obj){
					this.bulk.find( { name: obj.name } ).upsert().update({'$set': obj}); 
				}

				this.lineNr++;

				if ((this.lineNr % 3000 === this.capacity) && (this.bulk.length > 0)){
					this.insert(this,this.coll, done)

				} 
				else{
					done();
				} 
			}

		}
		let bulker = new Bulker(Items.collection, 3000);
		readableStream.on('readable', write);
		function write() {
			let chunk;
			while (null !== (chunk = readableStream.read())) {
				console.log(chunk);
				chunk.toString();
				if (chunk && !bulker._write(chunk)){
					readableStream.removeListener('readable', write);
					bulker.once('drain', () => {
						readableStream.on('readable', write);
						write();
					});
				}
			}
		}
		readableStream
		.pipe(es.split())
		.pipe(myTransform)
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


