const mongoose = require('mongoose');
const Joi = require('joi');
//const { number } = require('joi');

// Connecting to dedicated DB
mongoose.connect('mongodb://localhost/coronaDB')
    .then(()=> console.log('Connected to the Country-Database'))
    .catch(err => console.error('Could not Connect to DB', err));

// Make a schema for countries
const countrySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    todayCases:{
        type: Number,
        required: true,
    },
    todayDeaths:{
        type: Number,
        required: true,
    },
    todayRecovered:{
        type: Number,
        required: true,
    },
    critical:{
        type: Number,
        required: true,
    },
    date: {required: true, type: Date, defualt: Date.now}
});

const Country = mongoose.model('Country', countrySchema);

// Validation using Joi package
function validateCountry(country){
    const schema = Joi.object({
        //name: Joi.string().min(5).max(50).required(),
        todayCases: Joi.number().required(),
        todayDeaths: Joi.number().required(),
        todayRecovered: Joi.number().required(),
        critical: Joi.number().required(),
        //date: Joi.required()
    });

    return schema.validate(country);
}

// Export to use the output in index.js
exports.Country = Country;
exports.countryValidate = validateCountry;




