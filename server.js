var express = require("express");
var server = express();
var bodyParser = require('body-parser');
server.listen(8888);
console.log("Listening on port 8888!")

server.use(bodyParser.urlencoded({ extended: true }));

var mongoose	=	require('mongoose');
mongoose.connect('mongodb://localhost/Users');

var db=	mongoose.connection;

server.use(express.static(__dirname));

db.on('error',function(err){
    console.log('connection	error:',err.message);
});
db.once('open',function callback(){
    console.log("Connected to DB!");
});
var schema=	new	mongoose.Schema({
    login: String,
    password:	String,
    email:	String,
});

var User = mongoose.model('User',schema);

server.get('/findAll', function(req, res){
    User.find(function (err, allUsers) {
        if(err){
            res.send("No Users in DB");
        }else{
            res.send(allUsers);
        }
    });
});



server.post('/saveUser', function(req, res){

    var user_info = req.body;

    var newUser = new User({
        login:user_info.login,
        password:user_info.password,
        email:user_info.email
    });

    newUser.save(function (err, newUs) {
        if (err){
            console.log("Something goes wrong with User" + newUs.login);
        }

        res.send("Ok");
    });

})
