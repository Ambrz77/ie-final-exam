const mongoose = require('mongoose');
const Joi = require('joi');

// Connecting to dedicated DB
mongoose.connect('mongodb://localhost/coronaDB')
    .then(()=> console.log('Connected to the Admin-Database'))
    .catch(err => console.error('Could not Connect to DB', err));

// Make a schema for admins
const adminSchema = new mongoose.Schema({
    adminUsername:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },

    adminPassword:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024 
    }
});

const User = mongoose.model('User', adminSchema);

// Validation using Joi package
function validateUser(user){
    const schema = Joi.object({
        adminUsername: Joi.string().min(5).max(50).required(),
        adminPassword: Joi.string().min(5).max(255). required()
        //password: passwordComplexity(complexityOptions)
    });

    return schema.validate(user);
}

// Export to use the output in index.js
exports.User = User;
exports.userValidate = validateUser;




