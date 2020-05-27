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

// get average cost of courses
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: {
        bootcamp: bootcampId,
      },
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' },
      },
    },
  ]);

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost * 10) / 10,
    });
  } catch (e) {
    console.log(e.message);
  }
};

CourseSchema.post('save', function () {
  this.constructor.getAverageCost(this.bootcamp);
});

CourseSchema.pre('remove', function () {
  this.constructor.getAverageCost(this.bootcamp);
});

const Course = model('Course', CourseSchema);

module.exports = Course;
