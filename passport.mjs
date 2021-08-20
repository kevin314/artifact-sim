import dotenv from 'dotenv'
dotenv.config();

import passport from 'passport';
import google from 'passport-google-oauth20';
import discord from 'passport-discord';

const GoogleStrategy = google.Strategy;
const DiscordStrategy = discord.Strategy;

passport.serializeUser(function(user, done) {
    done(null,user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
    function(accessToken, refreshToken, profile, cb) {
        return cb(null, profile);
    }
));

passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.DISCORD_CALLBACK_URL,
    scope: ['identify'],
    prompt: 'consent'
},
    function(accessToken, refreshToken, profile, cb){
        return cb(null, profile);
    }
));

//export{authGoogle, authDiscord};
