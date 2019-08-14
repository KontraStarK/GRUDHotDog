var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(express.static(__dirname))
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
// app.use(express.json())


var Item = require("./models/item");

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html')
});
app.get('/hotdogs/all', function (req, res) {
	Item.find(function (err, data) {
		console.log(data);
		res.send(data);
	})
});
app.post('/hotdogs/add', function (req, res) {
	console.log(req.body);
	var item = new Item(req.body);
	item.save(function (err, data) {
		console.log(data);
		res.send(data);
	})
});
app.delete("/hotdogs/remove", function (req, res) {
	console.log(req.body);
	Item.deleteOne({
		_id: req.body.id
	}, function (err, data) {
		res.send();
	})
});
app.put('/hotdogs/edit', function (req, res) {
	console.log(req.body);
	var item = new Item(req.body);
	Item.findOneAndUpdate({
		_id: req.body.id
	}, {
		name: req.body.name
	}, {    
		new: true
	}, function (err, data) {
		res.send(data);
	})
});
app.listen(process.env.PORT || 8080,function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
console.log("Server run!");