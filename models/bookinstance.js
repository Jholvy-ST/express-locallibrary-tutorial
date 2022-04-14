var mongoose = require('mongoose');
const { DateTime } = require("luxon");

var Schema = mongoose.Schema;

var BookInstanceSchema = new Schema(
  {
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true }, //reference to the associated book
    imprint: {type: String, required: true},
    status: {type: String, required: true, enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'], default: 'Maintenance'},
    due_back: {type: Date, default: Date.now}
  }
);

// Virtual for bookinstance's URL
BookInstanceSchema
.virtual('url')
.get(function () {
  return '/catalog/bookinstance/' + this._id;
});

BookInstanceSchema
.virtual('due_back_formatted')
.get(function () {
	const dt = new Date (this.due_back);

	const checkDate = (date) => {
		if (date < 10) {
			return '0' + date
		}

		return date;
	}
	const day = checkDate(dt.getUTCDate());
	const month = checkDate(dt.getUTCMonth());
	const year = dt.getUTCFullYear();
	const formattedDate = year + '-' + month + '-' + day;
  return formattedDate;
});

BookInstanceSchema
.virtual('due_back_form')
.get(function () {
	const dt = DateTime.fromJSDate(this.due_back).toUTC();
	return dt.toFormat('yyyy-MM-dd');
  //return DateTime.fromJSDate(this.due_back).toFormat('yyyy-MM-dd');
});

//Export model
module.exports = mongoose.model('BookInstance', BookInstanceSchema);