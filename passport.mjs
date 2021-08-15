import dotenv from 'dotenv'
dotenv.config();

import passport from 'passport';
import google from 'passport-google-oauth20';

const GoogleStrategy = google.Strategy;

passport.serializeUser(function(user, done) {
    done(null,user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, cb) {
        return cb(null, profile);
    }
));
