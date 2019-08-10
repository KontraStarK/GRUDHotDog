var mongoose = require("mongoose");
mongoose.connect("mongodb://items:k6244056@ds143971.mlab.com:43971/hotdog");
console.log("mongoDB connect....");
module.exports = mongoose;