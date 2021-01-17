const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CourseSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    credits: {
        type: Number,
        required: true,
        min:0
    },
    description: {
        type: String,
        required: true
    },
    instructor_name: {
        type: String,
        required: true
    },
    students: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    capacity: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("Course",CourseSchema)