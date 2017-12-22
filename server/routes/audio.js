const express = require('express');
var router = express.Router();
var {authenticate} = require('../data/middleware/authenticate');
var {User} = require('../data/models/user');
var {Project} = require('../data/models/project');
const _ = require('lodash');
var q = require('q');
var mongo = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
var Grid = require('gridfs-stream');
var mg = require('../data/config/mongoose');
var gridFS2 = require('../data/config/gridFS');
//var mongoose = require('mongoose');
var gridFS = gridFS2(q,mongo,Grid,mg);
var multer = require('multer');
var streamifier = require('streamifier');
var fs = require('fs');
var uid = require('uid');
// var probe = require('node-ffprobe');
var async = require('async'); 

const upload = multer();
var {authenticate} = require('../data/middleware/authenticate');
//mongoose.connect('mongodb://localhost:27017/MusicApp');
let grid = null;
	gridFS.then(function(g){
		grid = g;
	}, function(error){
		console.log('Error:' + error);
	});








router.get('/music', (req, res) =>{
	res.status(200).send('Hello World!');

});


			/////////////
			//Audio API//
			/////////////


//GET list of  Audio meta data from DB by Project id


router.get('/info/:projectId', (req, res)=> {
	var items = []
	var pid = req.params.projectId;

	Project.findOne({'_id': pid}, function(err, project){
		if(err){
			req.status(400).send({
				message: err
			})
		}else if(!project){
			req.status(404).send({
				message: 'Project not exists'
			})
		}else{
			var arr = project.audioList;
			async.forEachOf(arr, function(value, key, callback){
				grid.findOne({'_id': value}, function(err, item){
					if(err){
						return callback(err);
					}else{
						items.push(item);
					}
					callback();
				});
			}, function(errs) {
				if(err){
					res.status(400).send({
						message: err
					})
				}else{
					res.status(200).json(items);
				}
			});
		}
	})
});




// Download audio file
router.get('/:audioId', function(req, res){
	var fid = req.params.audioId;
	grid.exist({'_id': fid}, function(err, found){
		if(err){
			res.status(500).send({
					message: err
				});
		}else if(!found){
			res.status(404).send({
				message: 'Audio not exists'
			});
		}else{
			grid.createReadStream({_id: fid}).pipe(res);
		}
	})
});



// Save List of  audio tracks  of a project into DB FS
router.post('/', authenticate, upload.any(), (req, res) => {
	

		console.log('addMusic');
		var IDlist = new Array();
		//var file = req.files[0];
		//console.log(file);
		async.forEachOf(req.files,function(file, key, callback){
					var writestream = grid.createWriteStream({
						filename: file.originalname
						,metadata: {
							title: file.originalname,
						 	username: req.user.username,
						 	userID: req.user._id,
						 	projectID: req.body.projectID,
						 	instrument: req.body.instrument,
						 	startTime: req.body.startTime,
						 	track: req.body.track
						// 	duration: probeData.streams[0].duration
						 }
					});

					var readable = streamifier.createReadStream(file.buffer);
					var pipe = readable.pipe(writestream);

					readable.on('end', function(){
						var userID = req.user._id;
						Project.findOne({'_id':req.body.projectID}, function(err,project){
							if(err){
								res.status(404).send({
									message:'Project not found!'
								});
							}else{
								project.audioList.push(writestream.id);
								project.save(function(err){
									if(err){
										res.status(404).send({
											message:'Project save failed'
										})
									}
									console.log('!!!!!!!!!!!!!!!!!!!!!!');
									console.log(writestream.id);
									IDlist.push(writestream.id);
									console.log(IDlist);
									// res.status(200).send({
									// 	message:'Prject save successful',
									// 	audio_id: writestream.id
									// });
								});
							}
						});
						//res.end();
					})
					callback();

		}, function(err){
			if(err){
				res.status(500).send({
					message: err
				});
			}else{
				res.status(200).send({
					message:'Successful',
					//IDlist: JSON.stringify(IDlist)    //???
				});

				console.log('Finished!!!')
			}	
		});

});

router.delete('/:audioId',(req, res) => {
	
	grid.remove({
		'_id' : new ObjectID(req.params.audioId)
	}, function(err){
		if(err){
			console.log('remove error:', err);
			return res.status(404).send({
						message: 'File not found'
				});	
		} 
		return res.status(200).send({
			message:'File deleted'
		});
	})
})




module.exports = router