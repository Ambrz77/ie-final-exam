//hash.js file for hasing password using salt and dedicated tools

const bcrypt = require('bcrypt');

async function run(){
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash('adminPassword', salt);
    console.log(salt);
    console.log(hashed);
}

run();