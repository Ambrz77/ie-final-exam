const jwt = require("jsonwebtoken");
const adminToken = "myapp_jwtPrivateKey";
const superToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MWU5Njg3Zjc4MTExZDk1OTM0NWI5YTQiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE2NDI2ODY1OTF9.FMGXiYDWpLhcAJUiHBs9fglRdCJJ1yJoL8wRtXhJaXU"
// const config = require("config");

function auth(req, res, next){
    // Reading JWT (Json Web Token) in header

    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access Denied. No token found!')

    // See if we can pass through this condition for verifying
    try
    {
        const decoded = jwt.verify(token, adminToken);
        req.user = decoded;
        next();
    }

    catch (ex)
    {
        res.status(401).send('Invalid Token!');
    }
}

module.exports = auth;