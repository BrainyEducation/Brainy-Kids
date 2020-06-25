const mongoose = require('mongoose');

const schema = mongoose.Schema(
	{
    // reference to the student
		student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
			required: true,
		},
		// reference to the focus item
		focus_item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Focus_Item',
			required: false,
        },
        
        // alternative to focus_item id
        //Name of the focus item
        focus_item_name: {
            type: String,
            required: false,
        },

        // Unit this focus item is in
        focus_item_unit: {
            type: String,
            required: false,
        },
        // Subunit this focus item is in
        focus_item_subunit: {
            type: String,
            required: false,
        },


		// Reference to the program
		program: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Program',
			required: true,
        },
        
        /**
         * The required logic below should communicate:
         * There are two pairs of stats. Correct_on and time_spent are one pair
         * time watching and total video time is another pair.
         * Exactly one pair must be specified, meaning both fields must be non-null
         */


        // How many guesses needed until the correct answer was gotten?
        correct_on: {
            type: Number,
            required: function() {return !(this.time_watching && this.total_video_time)},
        },
        //time spent on this item in millis
        time_spent: {
            type: Number,
            required: function() {return !(this.time_watching && this.total_video_time)},
        },
        //time watching in millis. applicable to watching videos
        time_watching: {
            type: Number,
            required: function() {return !(this.correct_on && this.time_spent)},
        },
        //length of video in millis. applicable to watching videos
        total_video_time: {
            type: Number,
            required: function() {return !(this.correct_on && this.time_spent)},
        },
        //optional created_at to pass in previous time (device not connected to internet)
        created_at: {
            type: Date,
            required: false
        },
        //optional updated_at to pass in previous time (device not connected to internet)
        updated_at: {
            type : Date,
            required: false
        }
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Analytic', schema);
