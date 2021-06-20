const ytdl = require('ytdl-core');

const playMusic = async(message) => {
    const musicLink = message.content.split(" ")[1];

    const songInfo = await ytdl.getInfo(musicLink);
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
    };
    console.log(song)
    return song
}   

module.exports = {
    playMusic
}