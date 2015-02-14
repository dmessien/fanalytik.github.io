
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:

Parse.Cloud.define('registerUser', function(request, response){
    var UserClass = Parse.Object.extend("_User");
    var newUser = new UserClass();
    //Parse.Cloud.useMasterKey();
    newUser.save(request.params, {
        success: function(user) {
            response.success(user);
        },
        error: function(error) {
            response.error(error);
        }
    })
});

Parse.Cloud.define('savePost', function(request, response) {
    var PostsClass = Parse.Object.extend("Posts");
    var post = new PostsClass();
    post.save(request.params, 
    {
        success: function(order) {
            response.success(order);
        },
        error: function(error) {
            response.error(error);
        }
    })
});

Parse.Cloud.define('saveReply', function(request, response) {
	var ReplyClass = Parse.Object.extend("Replies");
	var reply = new ReplyClass();
	reply.save(request.params, 
	{
		success: function(reply) {
			response.success(reply);
		},
		error: function(error){
			response.error(error);
		}
	})
});

Parse.Cloud.define('getReplies', function(request, response) {
	var replies = Parse.Object.extend("Replies");
    var query = new Parse.Query(replies);
    query.equalTo("post_id", request.params.objectId);
    query.find({
    	success: function(results) {
    		response.success(results);
    	},
    	error: function(error) {
    		response.error(error);
    	}
    });
});

Parse.Cloud.define('incrementReplies', function(request, response) {
    var posts = Parse.Object.extend("Posts");
    var query = new Parse.Query(posts);
    query.equalTo("objectId", request.params.objectId);
    query.find({
        success: function(results) {
            console.log(results[0]);
            if(results[0].replyCount){
                results[0].increment("replyCount", 1);
            }else{
                results[0].set("replyCount", 1);
            }
            results[0].save();
            response.success(results[0]);
        },
        error: function(error) {
            response.error(error);
        }
    })
});

Parse.Cloud.define('postAgree', function(request, response) {
    var posts = Parse.Object.extend("Posts");
    var query = new Parse.Query(posts);
    query.equalTo("objectId", request.params.objectId);
    query.find({
        success: function(results) {
            if(results[0].attributes.agreeUsers != null){
                if(results[0].attributes.agreeUsers.indexOf(request.params.userId) < 0) {                 
                    results[0].add("agreeUsers", request.params.userId);
                    results[0].increment("agrees", 1);
                    results[0].save();
                    response.success(results[0]);

                }
                else{
                    results[0].remove("agreeUsers", request.params.userId);
                    results[0].increment("agrees", -1);
                    results[0].save();
                    response.success(results[0]);
                }
            }
            else{
                results[0].set("agreeUsers", []);
                results[0].add("agreeUsers", request.params.userId);
                results[0].set("agrees", 1);
                results[0].save();
                response.success(results[0]);
            }
        },
        error: function(error) {
            response.error(error);
        }
    })
});

Parse.Cloud.define('postDisagree', function(request, response) {
    var posts = Parse.Object.extend("Posts");
    var query = new Parse.Query(posts);
    query.equalTo("objectId", request.params.objectId);
    query.find({
        success: function(results) {
            if(results[0].attributes.disagreeUsers != null){
                if(results[0].attributes.disagreeUsers.indexOf(request.params.userId) < 0) {                 
                    results[0].add("disagreeUsers", request.params.userId);
                    results[0].increment("disagrees", 1);
                    results[0].save();
                    response.success(results[0]);

                }
                else{
                    results[0].remove("disagreeUsers", request.params.userId);
                    results[0].increment("disagrees", -1);
                    results[0].save();
                    response.success(results[0]);
                }
            }
            else{
                results[0].set("disagreeUsers", []);
                results[0].add("disagreeUsers", request.params.userId);
                results[0].set("disagrees", 1);
                results[0].save();
                response.success(results[0]);
            }
        },
        error: function(error) {
            response.error(error);
        }
    })
});

Parse.Cloud.define('replyAgree', function(request, response) {
    var replies = Parse.Object.extend("Replies");
    var query = new Parse.Query(replies);
    query.equalTo("objectId", request.params.objectId);
    query.find({
        success: function(results) {
            if(results[0].attributes.agreeUsers != null){
                if(results[0].attributes.agreeUsers.indexOf(request.params.userId) < 0) {                 
                    results[0].add("agreeUsers", request.params.userId);
                    results[0].increment("agrees", 1);
                    results[0].save();
                    response.success(results[0]);

                }
                else{
                    results[0].remove("agreeUsers", request.params.userId);
                    results[0].increment("agrees", -1);
                    results[0].save();
                    response.success(results[0]);
                }
            }
            else{
                results[0].set("agreeUsers", []);
                results[0].add("agreeUsers", request.params.userId);
                results[0].set("agrees", 1);
                results[0].save();
                response.success(results[0]);
            }
        },
        error: function(error) {
            response.error(error);
        }
    })
});

Parse.Cloud.define('replyDisagree', function(request, response) {
    var replies = Parse.Object.extend("Replies");
    var query = new Parse.Query(replies);
    query.equalTo("objectId", request.params.objectId);
    query.find({
        success: function(results) {
            if(results[0].attributes.disagreeUsers != null){
                if(results[0].attributes.disagreeUsers.indexOf(request.params.userId) < 0) {                 
                    results[0].add("disagreeUsers", request.params.userId);
                    results[0].increment("disagrees", 1);
                    results[0].save();
                    response.success(results[0]);

                }
                else{
                    results[0].remove("disagreeUsers", request.params.userId);
                    results[0].increment("disagrees", -1);
                    results[0].save();
                    response.success(results[0]);
                }
            }
            else{
                results[0].set("disagreeUsers", []);
                results[0].add("disagreeUsers", request.params.userId);
                results[0].set("disagrees", 1);
                results[0].save();
                response.success(results[0]);
            }
        },
        error: function(error) {
            response.error(error);
        }
    })
});