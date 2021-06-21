const express = require('express');
const Discord = require('discord.js');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
require('dotenv').config()
const { prefix, BaseAPI, db } = require('./config');
const { database } = require('./actions')
const { help, play, join, leave } = require('./commands')

const queue = new Map();

// Database Authentication
/* database.run(); */

/* Express */
let app = express();

/* Passport Initialize */
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

var userProfile;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        userProfile=profile;
        return done(null, userProfile);
    }
));

// set the view engine to ejs
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(bodyParser.json())
app.use(cookieParser());

app.get('/', function(req, res) {
    res.send('This is Ranthm');
});

app.get('/auth/google', 
    passport.authenticate('google', { scope : ['profile', 'email'] })
);

app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/error' }),
    function(req, res) {
        // Successful authentication, redirect success.
        res.redirect('/success');
    }
);

app.get('/success', (req, res) => res.render('success', {user: userProfile}));

app.use('/v1', require('./routes/index'))

app.use((req, res, next) => {
    res.status(404).send('We think you are lost!')
})

app.use((err, req, res, next) => {
    console.error(err.stack)
})


/* ============================= Discord Client Commands ============================= */
const client = new Discord.Client();

client.on("ready", () =>{
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({
        status: "idle",
        game: {
            name: "!help",  
            type: "WATCHING" 
        }
    });
    client.user.setActivity("Randomizing Playlists by Shaun Mak"); 
});

client.on('message', async message => {

    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const serverQueue = queue.get(message.guild.id);

    if(message.content.includes(`${prefix}help`)){
        help(message)
    }else if(message.content.includes(`${prefix}join`)){
        join.joinVoiceChannel(message);
    }else if(message.content.includes(`${prefix}play`)){
        play.playYoutubePlaylist(message, serverQueue);
    }else if(message.content.includes(`${prefix}leave`)){
        leave.leaveVoiceChannel(message);
    }
});

client.login(process.env.TOKEN);

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.info(`Server has started on ${PORT}`))