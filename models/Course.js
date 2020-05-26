const { model, Schema } = require('mongoose');
const { ObjectId } = Schema.Types;

const CourseSchema = new Schema({
  title: {
    type: String,
    required: [true, 'please add a course title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'please add a course description'],
  },
  weeks: {
    type: String,
    required: [true, 'please add number of weeks'],
  },
  tuition: {
    type: Number,
    required: [true, 'please add a tuition cost'],
  },
  minimumSkill: {
    type: String,
    required: [true, 'please add a skill'],
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  scholarhipsAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: ObjectId,
    ref: 'Bootcamp',
    required: true,
  },
});

const Course = model('Course', CourseSchema);

module.exports = Course;
