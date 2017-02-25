module.exports = function(user) {
	user.getuser = function(username, cb){
		user.findOne({fields: {id: false}, where:{username:username}},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else{
					cb(null,instance);
				}
			});
	};

	user.getLeaderboard = function(cb){
		user.find({fields: {id: true, username: true, name: true, poin: true, badges: true, badgeCount: true, photo: true}, order: 'poin DESC'},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else{
					cb(null,instance);
				}
			});
	};

	user.getContacts = function(cb){
		user.find({fields: {id:true, username: true, name: true, division:true, photo:true}, order: 'name asc'},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else{
					cb(null,instance);
				}
			});
	};

	user.addComment = function(postId, userId, userName, userPhoto, content, cb){
		var userComment = user.app.models.Comment;
		date = new Date();
		dateJSON = date.toJSON();
		userComment.create({postId: postId, userId: userId, userName: userName, userPhoto: userPhoto, content: content, date: dateJSON},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else{
					commentInstance = instance;
					console.log(commentInstance);
					// cb(null,instance);
					user.findOne({where: {id: userId}},
					function(err,instance){
						if(instance===null){
							cb(null,null);
						}else{
							// cb(null,commentInstance,userInstance);
							dataPoin = instance['poin']; //get every poin he got
							dataPoin = dataPoin+5;
							dataBadges = instance['badges']; //get every badges he achieved
							badgeCount = instance['badgeCount'];
							counterComment = 0;
							userComment.count({userId: userId},
								function(err, count){
									counterComment = count;
									console.log(counterComment);
									if(counterComment==10){
										//if this is the first badge he got
										if(dataBadges.toString()==="[{}]"){
											newBadge = '{"badgeName": "The Aspiring Handwriting [BRONZE]", "achieved_date": "'+dateJSON+'"}';
											badgeCount = badgeCount+1;
											user.updateAll({id: userId}, {poin: dataPoin, badges: '['+newBadge+']', badgeCount: badgeCount}, //update poin +5, newBadge
											function(err,info){
												user.findOne({where:{id: userId}},
													function(err,instance){
														if(instance===null){
															cb(null,null);
														}else{
															userInstance = instance;
															console.log(userInstance);
															cb(null,commentInstance,userInstance);
														}
													})
											});
										}else{ //last badge to achieve
											newBadge = '{"badgeName": "The Aspiring Handwriting [BRONZE]", "achieved_date": "'+dateJSON+'"}';
											badgeCount = badgeCount+1;
											dataBadges.push(JSON.parse(newBadge));
											badgesNow = dataBadges.toString();
											user.updateAll({id: userId}, {poin: dataPoin, badges: badgesNow, badgeCount: badgeCount}, //update poin +5, newBadge
											function(err,info){
												user.findOne({where:{id: userId}},
													function(err,instance){
														if(instance===null){
															cb(null,null);
														}else{
															userInstance = instance;
															console.log(userInstance);
															cb(null,commentInstance,userInstance);
														}
													})
											});
										}
										
									}else if(counterComment==30){ //if he has commented has been 30, he get silver
										//since it's impossible to get silver badge without bronze first, we didn't include the first badge he got
										 //last badge to achieve
										newBadge = '{"badgeName": "The Aspiring Handwriting [SILVER]", "achieved_date": "'+dateJSON+'"}';
										badgeCount = badgeCount+1;	
										dataBadges.push(JSON.parse(newBadge));
										badgesNow = dataBadges.toString();
										user.updateAll({id: userId}, {poin: dataPoin, badges: badgesNow, badgeCount: badgeCount}, //update poin +5, newBadge
										function(err,info){
											user.findOne({where:{id: userId}},
												function(err,instance){
													if(instance===null){
														cb(null,null);
													}else{
														userInstance = instance;
														console.log(userInstance);
														cb(null,commentInstance,userInstance);
													}
												})
										});
									}else if(counterComment==50){ //if posts he liked has been 50, he get gold
										//since it's impossible to get bold badge without bronze or silver first, we didn't include the first badge he got
										 //last badge to achieve
										newBadge = '{"badgeName": "The Aspiring Handwriting [GOLD]", "achieved_date": "'+dateJSON+'"}';
										badgeCount = badgeCount+1;
										dataBadges.push(JSON.parse(newBadge));
										badgesNow = dataBadges.toString();
										user.updateAll({id: userId}, {poin: dataPoin, badges: badgesNow, badgeCount: badgeCount}, //update poin +5, newBadge
										function(err,info){
											user.findOne({where:{id: userId}},
												function(err,instance){
													if(instance===null){
														cb(null,null);
													}else{
														userInstance = instance;
														console.log(userInstance);
														cb(null,commentInstance,userInstance);
													}
												})
										});
									}

									else{ //posts he liked is not 10, 30, or 50
										user.updateAll({id: userId}, {poin: dataPoin}, //update and poin +5
										function(err,info){
											user.findOne({where:{id: userId}},
												function(err,instance){
													if(instance===null){
														cb(null,null);
													}else{
														userInstance = instance;
														console.log(userInstance);
														cb(null,commentInstance,userInstance);
													}
												})
										});
									}
								})
							// cb(null,instance);
						}
					});
				}
			});
	};

	user.addLike = function(userId, postId, cb){
		user.findOne({where:{id: userId}},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else{
					dataPostLiked = instance['postLiked']; //get every posts he has liked
					postLikedNow = dataPostLiked.toString();
					dataPoin = instance['poin']; //get every poin he got
					dataPoin = dataPoin+3;
					dataBadges = instance['badges']; //get every badges he achieved
					badgeCount = instance['badgeCount'];
					// if postId has been liked
					if(postLikedNow.includes(postId)){
						cb("Post id has been registered, you cannot like a post twice");
					}
					//if this is the first post he like
					else if(postLikedNow === ''){
						postLikedNow = postId;
						user.updateAll({id: userId}, {postLiked: postLikedNow, poin: dataPoin}, //update postLikedNow, and poin +3
						function(err,info){
							user.findOne({where:{id: userId}},
								function(err,instance){
									if(instance===null){
										cb(null,null);
									}else{
										cb(null,instance);
									}
								})
						});
					}
					//it's only the last post he liked
					else{
						postLikedNow = postLikedNow + ',' + postId;
						splitPostLiked = postLikedNow.split(','); //split postLikedNow to array to make it easier to be counted
						counterLike = splitPostLiked.length;
						console.log(counterLike);
						//if posts he liked has been 10, he got bronze
						if(counterLike==10){
							date = new Date();
							dateJSON = date.toJSON();
							//if this is the first badge he got
							if(dataBadges.toString()==="[{}]"){
								newBadge = '{"badgeName": "The Twin Thumbs Up [BRONZE]", "achieved_date": "'+dateJSON+'"}';
								badgeCount = badgeCount+1;
								user.updateAll({id: userId}, {postLiked: postLikedNow, poin: dataPoin, badges: '['+newBadge+']', badgeCount: badgeCount}, //update postLikedNow, poin +3, newBadge
								function(err,info){
									user.findOne({where:{id: userId}},
										function(err,instance){
											if(instance===null){
												cb(null,null);
											}else{
												cb(null,instance);
											}
										})
								});
							}else{ //last badge to achieve
								newBadge = '{"badgeName": "The Twin Thumbs Up [BRONZE]", "achieved_date": "'+dateJSON+'"}';
								badgeCount = badgeCount+1;
								dataBadges.push(JSON.parse(newBadge));
								badgesNow = dataBadges.toString();
								user.updateAll({id: userId}, {postLiked: postLikedNow, poin: dataPoin, badges: badgesNow, badgeCount: badgeCount}, //update postLikedNow, poin +3, newBadge
								function(err,info){
									user.findOne({where:{id: userId}},
										function(err,instance){
											if(instance===null){
												cb(null,null);
											}else{
												cb(null,instance);
											}
										})
								});
							}
							
						}else if(counterLike==30){ //if posts he liked has been 30, he get silver
							date = new Date();
							dateJSON = date.toJSON();
							//since it's impossible to get silver badge without bronze first, we didn't include the first badge he got
							 //last badge to achieve
							newBadge = '{"badgeName": "The Twin Thumbs Up [SILVER]", "achieved_date": "'+dateJSON+'"}';
							badgeCount = badgeCount+1;	
							dataBadges.push(JSON.parse(newBadge));
							badgesNow = dataBadges.toString();
							user.updateAll({id: userId}, {postLiked: postLikedNow, poin: dataPoin, badges: badgesNow, badgeCount: badgeCount}, //update postLikedNow, poin +3, newBadge
							function(err,info){
								user.findOne({where:{id: userId}},
									function(err,instance){
										if(instance===null){
											cb(null,null);
										}else{
											cb(null,instance);
										}
									})
							});
						}else if(counterLike==50){ //if posts he liked has been 50, he get gold
							date = new Date();
							dateJSON = date.toJSON();
							//since it's impossible to get bold badge without bronze or silver first, we didn't include the first badge he got
							 //last badge to achieve
							newBadge = '{"badgeName": "The Twin Thumbs Up [GOLD]", "achieved_date": "'+dateJSON+'"}';
							badgeCount = badgeCount+1;
							dataBadges.push(JSON.parse(newBadge));
							badgesNow = dataBadges.toString();
							user.updateAll({id: userId}, {postLiked: postLikedNow, poin: dataPoin, badges: badgesNow, badgeCount: badgeCount}, //update postLikedNow, poin +3, newBadge
							function(err,info){
								user.findOne({where:{id: userId}},
									function(err,instance){
										if(instance===null){
											cb(null,null);
										}else{
											cb(null,instance);
										}
									})
							});
						}

						else{ //posts he liked is not 10, 30, or 50
							user.updateAll({id: userId}, {postLiked: postLikedNow, poin: dataPoin}, //update postLikedNow, and poin +3
							function(err,info){
								user.findOne({where:{id: userId}},
									function(err,instance){
										if(instance===null){
											cb(null,null);
										}else{
											cb(null,instance);
										}
									})
							});
						}						
					}
				}				
			});
	};

	user.addUnlike = function(userId, postId, cb){
		user.findOne({where:{id: userId}},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else{
					dataPostLiked = instance['postLiked']; //get every posts he has liked
					postLikedNow = dataPostLiked.toString(); //store all post he has liked now to string
					dataPoin = instance['poin'];
					dataPoin = dataPoin-3;
					//if the postId is in mid
					if(postLikedNow.includes(postId + ',')){
						postLikedNow = postLikedNow.replace(postId + ',','');
					}
					//if the postId at the last
					else if(postLikedNow.includes(',' + postId)){
						postLikedNow = postLikedNow.replace(',' + postId,'');
					}
					//postId is at the first
					else {						
						postLikedNow = postLikedNow.replace(postId,'');
					}
					user.updateAll({id: userId}, {postLiked: postLikedNow, poin: dataPoin}, //update
					function(err,info){
						user.findOne({where:{id: userId}},
							function(err,instance){
								if(instance===null){
									cb(null,null);
								}else{
									cb(null,instance);
								}
							})
					});
				}				
			});
	};

	user.likeCounter = function(userId, cb){
		user.findOne({fields: {postLiked: true}, where: {id: userId}},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else if(instance['postLiked'] === ""){
						cb(null,0);
				}else {
					data = instance['postLiked'].split(",");
					cb(null,data.length);
				}
			});
	};

	user.addSeen = function(userId, postId, cb){
		user.findOne({where:{id: userId}},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else{
					dataPostseen = instance['postSeen']; //get every posts he has seen
					postSeenNow = dataPostseen.toString();
					dataPoin = instance['poin']; //get every poin he got
					dataPoin = dataPoin+1;
					dataBadges = instance['badges']; //get every badges he achieved
					badgeCount = instance['badgeCount'];
					//if postId has been seen
					if(postSeenNow.includes(postId)){
						cb(null,instance);
					}
					//if this is the first post he see
					else if(postSeenNow === ''){
						postSeenNow = postId;
						user.updateAll({id: userId}, {postSeen: postSeenNow, poin: dataPoin}, //update
						function(err,info){
							user.findOne({where:{id: userId}},
								function(err,instance){
									if(instance===null){
										cb(null,null);
									}else{
										cb(null,instance);
									}
								})
						});
					}
					//it's only the last post he's seen
					else{
						postSeenNow = postSeenNow + ',' + postId;
						splitPostSeen = postSeenNow.split(','); //split
						counterSeen = splitPostSeen.length;
						if(counterSeen==10){
							date = new Date();
							dateJSON = date.toJSON();
							// if this is the first badge
							if (dataBadges.toString()==="[{}]"){
								newBadge = '{"badgeName" : "The Most Seeing Eye [BRONZE]", "achieved_date" : "'+dateJSON+'"}';
								badgeCount = badgeCount+1;
								user.updateAll({id:userId}, {postSeen: postSeenNow, poin: dataPoin, badges: '['+newBadge+']', badgeCount: badgeCount}, // update postSeenNow, poin+1, new Badge
								function(err,info){
									user.findOne({where:{id: userId}},
										function(err,instance){
											if(instance===null){
												cb(null,null);
											}else{
												cb(null,instance);
											}
										})
								});
							} else {
								newBadge = '{"badgeName": "The Most Seeing Eye [BRONZE]", "achieved_date": "'+dateJSON+'"}';
								badgeCount = badgeCount+1;
								dataBadges.push(JSON.parse(newBadge));
								badgesNow = dataBadges.toString();
								user.updateAll({id:userId}, {postSeen: postSeenNow, poin: dataPoin, badges: badgesNow, badgeCount: badgeCount}, // update postSeenNow, poin+1, newBadge
								function(err,info){
									user.findOne({where:{id: userId}}, 
										function(err,instance){
											if(instance===null){
												cb(null,null);
											} else {
												cb(null, instance);
											}
										})
								});
							}
						}
						else if (counterSeen==30){
								date = new Date();
								dateJSON = date.toJSON();
								newBadge = '{"badgeName": "The Most Seeing Eye [SILVER]", "achieved_date": "'+dateJSON+'"}';
								badgeCount = badgeCount+1;
								dataBadges.push(JSON.parse(newBadge)); // add new badge
								badgesNow = dataBadges.toString();
								user.updateAll({id:userId}, {postSeen:postSeenNow, poin: dataPoin, badges: badgesNow, badgeCount: badgeCount}, // update postSeenNow, poin+1, new Badge
								function(err,info){
									user.findOne({where:{id: userId}}, 
										function(err,instance){
											if(instance===null){
												cb(null,null);
											} else {
												cb(null, instance);
											}
										})
								});
						} else if (counterSeen==50){
								date = new Date();
								dateJSON = date.toJSON();
								newBadge = '{"badgeName": "The Most Seeing Eye[GOLD]", "achieved_date": "'+dateJSON+'"}';
								badgeCount = badgeCount+1;
								dataBadges.push(JSON.parse(newBadge)); // add new badge
								badgesNow = dataBadges.toString();
								user.updateAll({id:userId}, {postSeen:postSeenNow, poin: dataPoin, badges: badgesNow, badgeCount: badgeCount}, // update postSeenNow, poin+1, new Badge
								function(err,info){
									user.findOne({where:{id: userId}}, 
										function(err,instance){
											if(instance===null){
												cb(null,null);
											} else {
												cb(null, instance);
											}
										})
								});
						} else {
							user.updateAll({id:userId}, {postSeen:postSeenNow, poin: dataPoin}, // update postSeenNow, poin+1
								function(err,info){
									user.findOne({where:{id: userId}}, 
										function(err,instance){
											if(instance===null){
												cb(null,null);
											} else {
												cb(null, instance);
											}
										})
								});
						}
					}			
				}

		});
	};

	user.seenCounter = function(userId, cb){
		user.findOne({fields: {postSeen: true}, where: {id: userId}},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else if(instance['postSeen'] === ""){
						cb(null,0);
				}else {
					data = instance['postSeen'].split(",");
					cb(null,data.length);
				}
			});
	};

	user.addShared = function(userId, postId, cb){
		user.findOne({where:{id: userId}},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else{
					data = instance['postShared']; //get every posts he has shared
					postSharedNow = data.toString();
					dataPoin = instance['poin']; //get every poin he got
					dataPoin = dataPoin+7;
					dataBadges = instance['badges']; //get every badges he achieved
					badgeCount = instance['badgeCount'];
					//if postId has been shared
					if(postSharedNow.includes(postId)){
						cb(null,instance);
					}
					//if this is the first post he share
					else if(postSharedNow === ''){
						postSharedNow = postId;
						user.updateAll({id: userId}, {postShared: postSharedNow, poin:dataPoin}, //update
						function(err,info){
							user.findOne({where:{id: userId}},
								function(err,instance){
									if(instance===null){
										cb(null,null);
									}else{
										cb(null,instance);
									}
								})
						});
					}
					//it's only the last post he's shared
					else{
						postSharedNow = postSharedNow + ',' + postId;
						splitPostShared = postSharedNow.split(','); //split
						counterShared = splitPostShared.length;
						if(counterShared==10){
							date = new Date();
							dateJSON = date.toJSON();
								if (dataBadges.toString()==="[{}]"){
									newBadge = '{"badgeName" : "The Human Handbook [BRONZE]", "achieved_date" : "'+dateJSON+'"}';
									badgeCount = badgeCount+1;
									user.updateAll({id:userId}, {postShared: postSharedNow, poin: dataPoin, badges: '['+newBadge+']', badgeCount: badgeCount}, // update postSharedNow, poin+1, new Badge
									function(err,info){
										user.findOne({where:{id: userId}},
											function(err,instance){
												if(instance===null){
													cb(null,null);
												}else{
													cb(null,instance);
												}
											})
									});
								} else {
									newBadge = '{"badgeName": "The Human Handbook [BRONZE]", "achieved_date": "'+dateJSON+'"}';
									badgeCount = badgeCount+1;
									dataBadges.push(JSON.parse(newBadge));
									badgesNow = dataBadges.toString();
									user.updateAll({id:userId}, {postShared: postSharedNow, poin: dataPoin, badges: badgesNow, badgeCount: badgeCount}, // update postSharedNow, poin+1, newBadge
									function(err,info){
										user.findOne({where:{id: userId}}, 
											function(err,instance){
												if(instance===null){
													cb(null,null);
												} else {
													cb(null, instance);
												}
											})
									});
								}
						}
						else if (counterShared==30){
								date = new Date();
								dateJSON = date.toJSON();
								newBadge = '{"badgeName": "The Human Handbook [SILVER]", "achieved_date": "'+dateJSON+'"}';
								badgeCount = badgeCount+1;
								dataBadges.push(JSON.parse(newBadge)); // add new badge
								badgesNow = dataBadges.toString();
								user.updateAll({id:userId}, {postShared:postSharedNow, poin: dataPoin, badges: badgesNow, badgeCount: badgeCount}, // update postSeenNow, poin+1, new adge
								function(err,info){
									user.findOne({where:{id: userId}}, 
										function(err,instance){
											if(instance===null){
												cb(null,null);
											} else {
												cb(null, instance);
											}
										})
								});
						} else if (counterShared==50){
							date = new Date();
							dateJSON = date.toJSON();
							newBadge = '{"badgeName": "The Human Handbook[GOLD]", "achieved_date": "'+dateJSON+'"}';
							badgeCount = badgeCount+1;
							dataBadges.push(JSON.parse(newBadge)); // add new badge
							badgesNow = dataBadges.toString();
							user.updateAll({id:userId}, {postShared:postSharedNow, poin: dataPoin, badges: badgesNow, badgeCount: badgeCount}, // update postSeenNow, poin+1, new Badge
							function(err,info){
								user.findOne({where:{id: userId}}, 
									function(err,instance){
										if(instance===null){
											cb(null,null);
										} else {
											cb(null, instance);
										}
									})
							});
						} else {
							user.updateAll({id:userId}, {postShared:postSharedNow, poin: dataPoin}, // update postSeenNow, poin+1
								function(err,info){
									user.findOne({where:{id: userId}}, 
										function(err,instance){
											if(instance===null){
												cb(null,null);
											} else {
												cb(null, instance);
											}
										})
								});
						}
					}		
				}				
			});
	};

	user.sharedCounter = function(userId, cb){
		user.findOne({fields: {postShared: true}, where: {id: userId}},
			function(err,instance){
				if(instance===null){
					cb(null,null);
				}else if(instance['postShared'] === ""){
						cb(null,0);
				}else {
					data = instance['postShared'].split(",");
					cb(null,data.length);
				}
			});
	};

	user.saveOneSignalId = function(userId, oneSignalId, cb){
		user.updateAll({id:userId}, {oneSignalId: oneSignalId},
			function(err,info){
				user.findOne({where:{id: userId}}, 
					function(err,instance){
						if(instance===null){
							cb(null,null);
						} else {
							cb(null, instance);
						}
					})
			});
	}

	user.updatePassword = function (ctx, email, oldPassword, newPassword, cb) {
	  var newErrMsg, newErr;
	  try {
	    this.findOne({where: {id: ctx.req.accessToken.userId, email: email}}, function (err, user) {
	      if (err) {
	        cb(err);
	      } else if (!user) { // if 
	        newErrMsg = "No match between provided current logged user and email";
	        newErr = new Error(newErrMsg);
	        newErr.statusCode = 401;
	        newErr.code = 'LOGIN_FAILED_EMAIL';
	        cb(newErr);
	      } else {
	        user.hasPassword(oldPassword, function (err, isMatch) {
	          if (isMatch) {

	            // TODO ...further verifications should be done here (e.g. non-empty new password, complex enough password etc.)...

	            user.updateAttributes({'password': newPassword}, function (err, instance) { // if inputted email current password is match with database
	              if (err) {
	                cb(err);
	              } else {
	                cb(null, true);
	              }
	            });
	          } else {
	            newErrMsg = 'User specified wrong current password !';
	            newErr = new Error(newErrMsg);
	            newErr.statusCode = 401;
	            newErr.code = 'LOGIN_FAILED_PWD';
	            return cb(newErr);
	          }
	        });
	      }
	    });
	  } catch (err) {
	    logger.error(err);
	    cb(err);
	  }

	};

	// user.getDevices = function (userId,cb){
	// 	var http = require('https');
	// 	var headers = {
	// 	  "Content-Type": "application/json",
	// 	  "Authorization": "Basic YzIxZTYwOWEtNmU3Zi00ZTZiLTlhZWEtYjFjYTRhMjA3NzMy"
	// 	};
	// 	function getDevices(callback) {
	// 	    return http.get({
	// 	        host: "onesignal.com",
	// 	       	port: 443,
	// 	       	path: "/api/v1/players?app_id=0010ee59-1672-4d84-acaf-2256df52939c",
 //   				headers: headers
	// 	    }, function(response) {
	// 	        // Continuously update stream with data
	// 	        var body = '';
	// 	        response.on('data', function(d) {
	// 	            body += d;
	// 	        });
	// 	        response.on('end', function() {

	// 	            // Data reception is done, do whatever with it!
	// 	            // paserd1 = JSON.stringify(body);
	// 	            var parsed = JSON.parse(body);

	// 	            // console.log(parsed.players[0].id);

	// 	            // cb(null, parsed);
	// 	            // return parsed;
	// 	            // var oneSignalId = parsed.id;
	// 	            // var session_count = parsed.session_count;
	// 	            // var last_active = parsed.last_active;

	// 	            // var allMessages = []; // array of string, this variabel combines senderMessage & receiverMessage

	// 	            oneSignalId = [];
	// 	            user.findOne({where:{id: userId}}, 
	// 	            			function(err,instance){
	// 	            				if(instance===null){
	// 	            					// cb(null,null);
	// 	            				} else {
	// 	            					// cb(null, instance);
	// 	            					oneSignalId = instance['oneSignalId'];
	// 	            				}
	// 	            			})

	// 	            var session_count;
	// 	            var last_active;
	// 	            for(var x in parsed.players){
	// 	            	if(parsed.players[x].id === oneSignalId){
	// 	            		session_count = parsed.players[x].session_count;
	// 	            		session_count = parsed.players[x].last_active;

	// 	            	}
	// 	              // allMessages.push(parsed[x].id); // push senderMessage to allMessages
	// 	              // console.log(parsed[x].id);
	// 	            }
	// 	            // device_model : parsed.device_model;
	// 	            // console.log(allMessages);

	// 	            user.updateAll({id:userId}, {session_count : session_count, last_active : last_active},
	// 	            	function(err,info){
	// 	            		user.findOne({where:{id: userId}}, 
	// 	            			function(err,instance){
	// 	            				if(instance===null){
	// 	            					cb(null,null);
	// 	            				} else {
	// 	            					cb(null, instance);
	// 	            				}
	// 	            			})
	// 	            });

	// 	            // callback({
	// 	            //     oneSignalId : parsed.id,
	// 	            //     session_count : parsed.session_count,
	// 	            //     last_active : parsed.last_active
	// 	            // });
	// 	        });
	// 	    });

	// 	}

	// 	var result = getDevices(cb);
	// 	// console.log(result);
	// 	// console.log(cb);
					
	// }


	user.remoteMethod(
		'getuser',
		{
			accepts: {arg: 'username', type: 'string'},
			returns: {arg: 'id', type: 'string', root: true},
			http: {path: '/getuser', verb: 'get', source: 'query'},
			description: "Get user instance by username"
		}
	);


	user.remoteMethod(
		'getContacts',
		{
			// accepts: {arg: 'id', type: 'string'},
			returns: {arg: 'id', type: 'string', root: true},
			http: {path: '/getContacts', verb: 'get', source: 'query'},
			// description: "G"
		}
	);

	user.remoteMethod(
		'getLeaderboard',
		{
			returns: {arg: 'id', type: 'string', root: true},
			http: {path: '/getLeaderboard', verb: 'get', source: 'query'},
			description: "Get leaderboard of all users"
		}
	);

	user.remoteMethod(
		'addComment',
		{
			accepts: [
					{arg: 'postId', type: 'string'},
					{arg: 'userId', type: 'string'},
					{arg: 'userName', type: 'string'},
					{arg: 'userPhoto', type: 'string'},
					{arg: 'content', type: 'string'}
					],
			returns: [
					{arg: 'comment', type: 'string'},
					{arg: 'user', type: 'string'}
					],
			http: {path: '/addComment', verb: 'put', source: 'query'}
		}
	);

	user.remoteMethod(
		'addLike',
		{
			accepts: [
					{arg: 'userId', type: 'string'},
					{arg: 'postId', type: 'string'}
					],
			returns: {arg: 'postLiked', type: 'string', root: true},
			http: {path: '/addLike', verb: 'put'}
		}
	);

	user.remoteMethod(
		'addUnlike',
		{
			accepts: [
					{arg: 'userId', type: 'string'},
					{arg: 'postId', type: 'string'}
					],
			returns: {arg: 'postLiked', type: 'string', root: true},
			http: {path: '/addUnlike', verb: 'put'}
		}
	);

	user.remoteMethod(
		'likeCounter',
		{
			accepts: {arg: 'userId', type: 'string'},
			returns: {arg: 'count', type: 'number'},
			http: {path: '/likeCounter', verb: 'get', source: 'query'},
			description: "Get how many post user{id} has liked"
		}
	);

	user.remoteMethod(
		'seenCounter',
		{
			accepts: {arg: 'userId', type: 'string'},
			returns: {arg: 'count', type: 'number'},
			http: {path: '/seenCounter', verb: 'get', source: 'query'},
			description: "Get how many post user{id} has seen"
		}
	);

	user.remoteMethod(
		'sharedCounter',
		{
			accepts: {arg: 'userId', type: 'string'},
			returns: {arg: 'count', type: 'number'},
			http: {path: '/sharedCounter', verb: 'get', source: 'query'},
			description: "Get how many post user{id} has shared"
		}
	);

	user.remoteMethod(
		'addSeen',
		{
			accepts: [
					{arg: 'userId', type: 'string'},
					{arg: 'postId', type: 'string'}
					],
			returns: {arg: 'postSeen', type: 'string', root: true},
			http: {path: '/addSeen', verb: 'put'}
		}
	);

	user.remoteMethod(
		'addShared',
		{
			accepts: [
					{arg: 'userId', type: 'string'},
					{arg: 'postId', type: 'string'}
					],
			returns: {arg: 'postSeen', type: 'string', root: true},
			http: {path: '/addShared', verb: 'put'}
		}
	);

	user.remoteMethod(
		'saveOneSignalId',
		{
			accepts: [
					{arg: 'userId', type: 'string'},
					{arg: 'oneSignalId', type: 'string'}
					],
			returns: {type: 'string', root: true},
			http: {path: '/saveOneSignalId', verb: 'put'}
		}
	);

	user.remoteMethod(
		'updatePassword',
		  {
		    description: "Allows a logged user to change his password.",
		    http: {verb: 'put'},
		    accepts: [
		      {arg: 'ctx', type: 'object', http: {source: 'context'}},
		      {arg: 'email', type: 'string', required: true, description: "The user email, just for verification"},
		      {arg: 'oldPassword', type: 'string', required: true, description: "The user old password"},
		      {arg: 'newPassword', type: 'string', required: true, description: "The user new password"}
		    ],
		    returns: {arg: 'passwordChange', type: 'boolean'}
		  }
	);

	// user.remoteMethod(
	// 	'getDevices',
	// 	{
	// 		arg: 'userId', type: 'string',
	// 		returns : {arg: 'result', type: 'object', root: true},
	// 		http : {path: '/getDevices', verb: 'get'}
	// 	}
	// );

};
