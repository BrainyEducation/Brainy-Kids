const mongoose = require('mongoose');

const schema = mongoose.Schema(
	{
		// 2-character unique ID for this student
		student_id: {
			type: String,
			required: true,
		},
		// Student's name + Initial (First + Last Initial)
		student_name: {
			type: String,
			required: false,
		},
		// Reference to teacher
		teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Teacher',
			required: true,
		},
		// Defines if this student has been deleted or not. true = deleted
		deleted: {
			type: Boolean,
			default: false
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Student', schema);
