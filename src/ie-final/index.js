// Add used stuff & middlewares (Used MongoDB for Database)

const express = require('express');
const app = express();
const Joi = require('joi');
const superToken = "myapp_jwtPrivateKey";
const mongoose = require('mongoose');
//const config = require('config');
const { User, userValidate } = require('./models/user');
const bcrypt = require('bcrypt');
const _ = require('lodash');
app.use(express.json());
const jwt = require('jsonwebtoken');
const auth = require('./middleware/auth');
const { Country, countryValidate } = require('./models/country');

//////-------------First Public API (Get Specific Country)-------------//////

app.get('/countries/:cname', async (req, res) => {

    // Get country name from recieved parameters
    const cname = req.params.cname;

    // Find the indicated country and throw the proper error in case
    let myCountry = await Country.findOne({ name: cname });
    if (!myCountry) return res.status(404).send('Country does not exists!');

    // Show
    const theCountry = await Country.find({ name: cname });
    res.send(_.pick(myCountry, ['todayCases', 'todayDeaths', 'todayRecovered', 'critical', 'date']));

});

//////-------------Second Public API (Get All Countries)-------------//////

app.get('/countries/', async (req, res) => {
    // app.get('/countries/:cname/?sort=:cvar', async (req, res) => {
    //const cvar = req.params.cvar;

    // Finds all of countries and print the needed details back
    const theCountry = await Country.find();
    // const theCountry = await Country.find({name: cname}).sort({cvar = 1});
    res.send(theCountry);

});

//////-------------First Private API (Add Admins)-------------//////

app.post('/admin', async (req, res) => {

    // Evaluate if entered credentials of admin (in body) has proper validation
    const { error } = userValidate(req.body);
    if (error) return res.status(403).send(error.details[0].message);

    // If there is already one, it will let u know
    let user = await User.findOne({ adminUsername: req.body.adminUsername });
    if (user) return res.status(403).send('User already registered!');

    // Make an object for new guy
    user = new User({
        adminUsername: req.body.adminUsername,
        adminPassword: req.body.adminPassword
    })

    // Making a hash of his password
    const salt = await bcrypt.genSalt(10);
    user.adminPassword = await bcrypt.hash(user.adminPassword, salt);

    // Save it to DB
    await user.save();

    // Make a valid token for new admin in order for him to use it in 
    // other API (Enter that in the header) and make changes
    const token = jwt.sign({ _id: user._id, role: 'admin' }, superToken);
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'adminUsername', 'adminPassword']));
    // We can access this value through the output header of this API
});

//////-------------Second Private API (Add Country)-------------//////

app.post('/countries/:cname', auth, async (req, res) => {
    // For default the current user had the super access in the previous API
    // But now we've added the "auth" middleware in order to authorize permission for adding countries
    
    // Get the new country name from sent parameter
    const cname = req.params.cname;

    // const { error } = countryValidate(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    // Validate if we already have a country with the given name and return if yes
    let myCountry = await Country.findOne({ name: cname });
    if (myCountry) return res.status(403).send('Country already Exists!');

    // Create new object with default values
    const country = new Country({
        name: cname,
        todayCases: 0,
        todayDeaths: 0,
        todayRecovered: 0,
        critical: 0,
        date: new Date()
    })

    // const salt = await bcrypt.genSalt(10);
    // country.adminPassword = await bcrypt.hash(country.adminPassword, salt);

    // Save in DB and print its details
    await country.save();
    res.send(_.pick(country, ['name', 'todayCases', 'todayDeaths', 'todayRecovered', 'critical', 'date']));
});

//////-------------Third Private API (Update Permissions)-------------//////

app.put('/countries', auth, async (req, res) => {
    //(Add "auth" middleware as always)
    // At this point we cant have two exact same endpoint for exact same
    // type of API (PUT in this case) so i passed countyName into body of
    // request and didnt complete and put screenshot of its output because of having same
    // endpoint as the next API
    const adminIDs = req.body.adminIDs;
    const add = req.body.add;
    const countryName = req.body.countryName;

    // Check if this user exists
    let user = await User.findOne({ adminUsername: req.body.adminIDs });
    if (!user) return res.status(404).send('User not found!');
});

//////-------------Fourth Private API (Update Country)-------------//////

app.put('/countries/:cname', auth, async (req, res) => {
    // Used a piece of middleware called "auth" in order to authorize permission for only admins

    // const { cname } = req.params;
    // const { todayCases, todayDeaths, todayRecovered, critical } = req.body;

    // Get the name of country to make changes
    const cname = req.params.cname;

    // Check if the sent body have the proper variables to make changes
    const { error } = countryValidate(req.body);
    if (error) return res.status(403).send(error.details[0].message);

    // Check if the country with the given name exists
    let myCountry = await Country.findOne({ name: cname });
    if (!myCountry) return res.status(404).send('Country does not exists!');

    const filter = { name: cname };
    const update = {
        //name: cname,
        todayCases: req.body.todayCases,
        todayDeaths: req.body.todayDeaths,
        todayRecovered: req.body.todayRecovered,
        critical: req.body.critical,
        date: new Date()
    }

    let newCountry = await Country.findOneAndUpdate(filter, update);
    let result = await Country.findOne({ name: cname });
    res.send(result);
});

app.listen(12345, () => console.log('Listening on port 12345...'));