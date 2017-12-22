const mongoose = require('mongoose');
const User = require('./user');
const grid = require('gridfs-stream');
const async = require('async'); 

var ProjectSchema = new mongoose.Schema({
	title:{
		type: String,
		required: true
	},
	artist:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	audioList:{
		type: Array,
		default: []
	},
	createdAt:{
		type: Date
	},
	updatedAt:{
		type: Date
	}

});

ProjectSchema.pre('save', function(next){
	now = Date();
	this.updatedAt = now;
	if(!this.createdAt){
		this.createdAt = now;
	}
	next();
});

ProjectSchema.pre('remove', function(next){
	grid.mongo = mongoose.mongo;
	var gfs = grid(conn.db);
	var arr = this.audioList;
	async.forEachOf(arr, function(value, key, callback){
		gfs.exists({'_id': new ObjectID(value)}, function(err, found){
			if(err){
				console.log(err);
				return;
			}else if(!found){
				console.log('Audio not found');
				return;
			}else{
				gfs.remove({'_id': new ObjectID(value)}, function(err){
					console.log(err);
					return;
				})
			}
			callback();
		})
	}, function(err){
		if(err){
			console.log('For each error', err);
			return;
		}
	})
})




















var Project = mongoose.model('Project', ProjectSchema);
module.exports = {Project};