var fs = require("fs");
var express = require("express");
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);
var bodyParser = require("body-parser");

var models = require("./models/");

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(session({
    secret: "Hrlusrz1GkVKG8NCXn2xD11YtO311",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        mongooseConnection: models._connection
    })
}));

app.use(function(req, res, next) {
    res.locals.session = req.session;
    if(req.session.user && req.session.user.login == "montyanderson") res.locals.admin = true;
    next();
});

app.engine("handlebars", require("./engine"));
app.set("layout", "layout");
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));

app.use(function(req, res, next) {
    models.Project.find({}).sort({date:-1}).select({title: 1, uri: 1}).exec(function(err, projects) {
        if(err) return next();
        res.locals.projects = projects;
        console.log(projects);
        next();
    });
});

fs.readdirSync(__dirname + "/routes").forEach(function(file) {
    app.use(require("./routes/" + file));
});

app.listen(8200, "127.0.0.1");
