var mongoose = require("mongoose");

var schema = new mongoose.Schema({
    id: Number,
    name: String,
    full_name: {
        type: String,
        unique: true
    },
    html_url: String,
    description: String,
    fork: Boolean,
    created_at: Date,
    updated_at: Date,
    pushed_at: Date,
    stargazers_count: Number,
    watchers_count: Number,
    default_branch: String
});

module.exports.Repo = mongoose.model("Repo", schema);
