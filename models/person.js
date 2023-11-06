const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
require('dotenv').config();

const url = process.env.MONGODB_URI;

mongoose.connect(url).then(() => {
    console.log('connected');
}).catch(err => {
    console.log(err);
})

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true,
    },
    number: {
        type: String,
        validate: {
            validator: function(v) {
                return (/^\d{2,3}-\d{6,}$/).test(v)
            }
        },
        required: true,
    },
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema);