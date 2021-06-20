const leaveVoiceChannel = async(message) => {
    message.channel.send(`Leaving ${message.channel}`)

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
        return message.channel.send("You need to be in a voice channel to ditch me!");
    const permissions = voiceChannel.permissionsFor(message.client.user);

    var connection = await voiceChannel.leave();
}

module.exports = {
    leaveVoiceChannel
}