const joinVoiceChannel = async(message) => {
    message.channel.send(`Joining ${message.channel}`)

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
        return message.channel.send("You need to be in a voice channel to play music!");
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send("I need the permissions to join and speak in your voice channel!");
    }

    try {
        // Here we try to join the voicechat and save our connection into our object.
        var connection = await voiceChannel.join();
        /* queueContruct.connection = connection;
        // Calling the play function to start a song
        play(message.guild, queueContruct.songs[0]); */
    } catch (err) {
        // Printing the error message if the bot fails to join the voicechat
        console.log(err);
        /* queue.delete(message.guild.id);
        return message.channel.send(err); */
    }
}

module.exports = {
    joinVoiceChannel
}