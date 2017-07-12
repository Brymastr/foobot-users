const 
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

module.exports = mongoose.model('User', Schema({
  first_name: String,
  last_name: String,
  phone: Number,
  email: String,
  gender: String,
  facebook_token: String,
  foobot_token: String,
  platform_ids: [Number],
  date_created: { type: Date, default: Date.now },
}));