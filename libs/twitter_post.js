"use strict";

var config = require('../config');
var logger = require('../logger');
var crypto = require('crypto');
var Twit = require('twit');

var T = new Twit(config.twitter.api_keys);

module.exports = {

    reply: function(status, request) {
	this.update( {
       		"status": "@" + request.fromUser + " " + status,
         	in_reply_to_status_id: request.id
        });	
    },

    update:function(param) {
	var token = crypto.randomBytes(4).toString('hex');
	param.status = param.status + " " + token;
        if (!config.twitter.deactivate_all_statuses_updates) {
            T.post('statuses/update', param, function(err, data, response) {
                if (err) {
                    logger.error("Error sending tweet: " + err.message);
                } 
            });
        } else {
            logger.warn("Status update deactivated");
        }
    }

}

