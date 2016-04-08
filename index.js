"use strict";
const path = require("path");
const express = require("express");
const redis = require("redis");

const db = global.db = redis.createClient();
const app = express();

app.set("view engine", "jade");

//app.use(express.static(path.join(__dirname, "public")));

app.use(function(req, res, next) {
	db.hkeys("repos", function(err, repos) {
		if(err) return next();

		res.locals.repos = repos.map(function(repo) {
			return {
				owner: repo.split("/")[0],
				name: repo.split("/")[1]
			};
		}).sort(function(a, b) {
			if(a.name > b.name) {
				return 1;
			}

			return -1;
		});

		next();
	});
});

app.get("/", function(req, res, next) {
	db.lrange("repos:pushed", 0, 2, function(err, keys) {
		if(err) return next();

		keys.unshift("repos");

		db.hmget(keys, function(err, repos) {
			if(err) return next();

			res.locals.pushed = repos.map(JSON.parse);
			next();
		});
	});
}, function(req, res, next) {
	db.lrange("repos:starred", 0, 2, function(err, keys) {
		if(err) return next();

		keys.unshift("repos");

		db.hmget(keys, function(err, repos) {
			if(err) return next();

			res.locals.starred = repos.map(JSON.parse);
			next();
		});
	});
}, function(req, res) {
	res.render("index");
});

app.listen(process.env.PORT || 8080, process.env.IP || "127.0.0.1");
