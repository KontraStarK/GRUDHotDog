var mongoose = require("../mongoose");
var schemaItem = mongoose.Schema({
	name:{
		type: String,
		unique: true,
		required: true
	}
},{versionKey:false});
var Item = mongoose.model("Item",schemaItem);
module.exports = Item;