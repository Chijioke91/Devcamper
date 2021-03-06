const { model, Schema } = require('mongoose');
const { ObjectId } = Schema.Types;
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

const BootcampSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please Add A Name'],
      trim: true,
      unique: true,
      maxlength: [50, 'Name cannot be longer than 50 Characters'],
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'Please Add A Description'],
      maxlength: [500, 'Description cannot be more than 500 Characters'],
    },
    website: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'Please use a valid URL with HTTP or HTTPS',
      ],
    },
    phone: {
      type: String,
      maxlength: [20, 'Phone Number cannot be more than 20 characters'],
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    address: {
      type: String,
      required: [true, 'Please add an address'],
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
      },

      coordinates: {
        type: [Number],
        index: '2dsphere',
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    careers: {
      type: [String],
      required: true,
      enum: [
        'Web Development',
        'Mobile Development',
        'UI/UX',
        'Data Science',
        'Business',
        'Other',
      ],
    },
    averageRating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [10, 'Rating must can not be more than 10'],
    },

    averageCost: Number,

    photo: {
      type: String,
      default: 'no-photo.jpg',
    },

    housing: {
      type: Boolean,
      default: false,
    },

    jobAssistance: {
      type: Boolean,
      default: false,
    },

    jobGuarantee: {
      type: Boolean,
      default: false,
    },

    acceptGi: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// create bootcamp slug from name
BootcampSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Geocode and create location field
BootcampSchema.pre('save', async function (next) {
  const loc = await geocoder.geocode(this.address);

  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };

  // do not save address on db
  // this.address = undefined;

  next();
});

// delete all courses associated with a bootcamp when a bootcamp is deleted
BootcampSchema.pre('remove', async function (next) {
  await this.model('Course').deleteMany({ bootcamp: this._id });
  next();
});

// add a courses virtual field in order to fetch all courses for a bootcamp
BootcampSchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'bootcamp',
  justOne: false,
});

const Bootcamp = model('Bootcamp', BootcampSchema);

module.exports = Bootcamp;
