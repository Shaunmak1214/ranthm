const express = require('express');
const Discord = require('discord.js');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config()
const { prefix, BaseAPI, db } = require('./config');
const { database } = require('./actions')
const { help, play, join, leave } = require('./commands')

const queue = new Map();

// Database Authentication
/* database.run(); */

/* Express */
let app = express();
// set the view engine to ejs
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(bodyParser.json())
app.use(cookieParser());
app.get('/', function(req, res) {
    res.render('This is Ranthm');
});
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