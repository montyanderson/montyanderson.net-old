"use strict";
const redis = require("redis");
const got = require("got");

const db = redis.createClient();

function getRepos() {
	return new Promise(function(resolve, reject) {
		got("https://api.github.com/users/montyanderson/repos?sort=pushed").then(function(response) {
			const sorted = ["repos:pushed"];
			const hash = ["repos"];

			const repos = JSON.parse(response.body).map(function(repo) {
				repo = {
					id: repo.id,
					name: repo.name,
					full_name: repo.full_name,
					owner: repo.owner.login,
					html_url: repo.html_url,
					description: repo.description,
					fork: repo.fork,
					created_at: repo.created_at,
					updated_at: repo.updated_at,
					pushed_at: repo.pushed_at,
					homepage: repo.homepage,
					size: repo.size,
					stargazers_count: repo.stargazers_count,
					language: repo.language,
					open_issues: repo.open_issues
				};

				sorted.push(repo.full_name);
				hash.push(repo.full_name);
				hash.push(JSON.stringify(repo));

				return repo;
			});

			repos.sort(function(a, b) {
				if(a.stargazers_count > b.stargazers_count) {
					return -1;
				}

				return 1;
			});

			const starred = repos.map(function(repo) {
				return repo.full_name;
			});

			starred.unshift("repos:starred");

			db.multi()
				.del("repos:pushed")
				.rpush(sorted)
				.del("repos:starred")
				.rpush(starred)
				.del("repos")
				.hmset(hash)
				.exec(resolve);
		}).catch(reject);
	});
}

function loop() {
	function callback() {
		setTimeout(loop, 1000 * 60 * 5);
	}

	getRepos().then(callback).catch(callback);
}

loop();
