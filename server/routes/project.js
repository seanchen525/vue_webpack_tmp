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
		console.log('GridFS connection Error:' + error);
	});





					///////////////
					//PROJECT API//
					///////////////


// Create a new Project
//Params: title -- Project Name
//        audioList -- All tracks in Project
router.post('/', authenticate, function(req, res){
	
	var newProject = new Project();
	newProject.title = req.body["title"];
	newProject.artist = req.user._id;
	newProject.audioList = req.body["audioList[]"];
	newProject.save(function(err, project){
		if(err){
			res.status(500).send({
				message: err
			});
			return;
		}
		User.findOne({'_id': new ObjectID(req.user._id)}, function(err, user){
			if(err){
				res.status(500).send({
					message: err
				});
				return;
			} else if(!user){
				res.status(500).send({
					message: 'error'
				});
				return;
			} else {
				user.projectList.push(new ObjectID(project.id));
				user.save(function(err){
					if(err){
						res.status(500).send({
							message: err
						});
						return;
					}
					res.status(200).send({
						projectId: project.id,
						message: 'successful'
					});
				});
			}
		});
	});
});



//Update a Project
//Params: id -- Project id
//		  audioList -- Array of tracks id
router.put('/',authenticate,function(req, res){
	console.log(req.body.id);
	Project.findOne({'_id': req.body.id}, function(err, project){
		if(err){
			res.status(500).send({
				message: err
			})
		} else if(!project){
			res.status(404).send({
				message: 'Project not found.'
			});
		}else if(JSON.stringify(project.artist) != JSON.stringify(req.user._id)){
			console.log(project.artist);
			console.log(req.user._id);
			console.log(new ObjectID(req.user._id))
			res.status(404).send({
				message: "This user is not the owner of this project."
			});
		} else {
			project.title = req.body.title;
			project.audioList = req.body.audioList;
			project.save(function(err){
				if(err){
					res.status(500).send({
						message: err
					});
				}

				res.status(200).send({
					message: 'successful'
				});
			});
		}
	});
});


//Get meta data of a Project
router.get('/:projectId', authenticate, (req, res) => {
	var pid = req.params.projectId
	Project.findOne({'_id': new ObjectID(pid)}, function(err, project){
		if(err){
			res.status(500).send({
				message: err
			});
			return;
		}else if(!project){
			res.status(404).send({
				message: 'Project not exists'
			});
			return;
		}else{
			res.status(200).send({
				message: 'Successful',
				title: project.title,
				audioList: project.audioList
			});
		}
	})
});


//Delete a Project
router.delete('/:projectId', authenticate, function(req, res){
	if(req.params.projectId !== undefined){
			var pid = req.params.projectId		
	}else{
		res.status(404).send({
			message: "Project Undefined."
		});
	}
	Project.remove({'_id': new ObjectID(pid)}, function(err){
		if(err){
			res.status(500).send({
				message: err
			});
			return;
		} else {
			User.findOne({'_id': req.user._id}, function(err, user){
				if(err){
					res.status(500).send({
						message: err
					});
					return;
				} else if(!user){
					res.status(500).send({
						message: 'error'
					});
					return;
				} else {
					var idx = user.projectList ? user.projectList.indexOf(pid) : -1;
					console.log(idx);
					if(idx !== -1){
						user.projectList.splice(idx, 1);
						user.save(function(err){
							if(err){
								res.status(500).send({
									message: err
								});
								return;
							}

							res.status(200).send({
								message: 'successful'
							});
						});
					}
				}

			});
		}
	});
});


module.exports = router