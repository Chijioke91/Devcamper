const { model, Schema } = require('mongoose');
const { ObjectId } = Schema.Types;

const ReviewSchema = new Schema({
  title: {
    type: String,
    required: [true, 'please add a review title'],
    trim: true,
    maxlength: 100,
  },
  text: {
    type: String,
    required: [true, 'please add a some text'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, 'please add a rating between 1 and 10'],
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
  user: {
    type: ObjectId,
    ref: 'User',
    required: true,
  },
});

// allow user to submit just one review for a bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// get average rating
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: {
        bootcamp: bootcampId,
      },
    },
    {
      $group: {
        _id: '$bootcamp',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageRating: obj[0].averageRating,
    });
  } catch (e) {
    console.log(e.message);
  }
};

ReviewSchema.post('save', function () {
  this.constructor.getAverageRating(this.bootcamp);
});

ReviewSchema.pre('remove', function () {
  this.constructor.getAverageRating(this.bootcamp);
});

module.exports = model('Review', ReviewSchema);
