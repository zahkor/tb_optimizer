function getGuildFromUrl(swgohURL: string): Guild | undefined {
    const guildInitialResponse = UrlFetchApp.fetch('http://swgoh.gg/api/guild-profile/' + swgohURL);

    if (guildInitialResponse.getResponseCode() >= 200 && guildInitialResponse.getResponseCode() <= 299) {
        const json = guildInitialResponse.getContentText();
        return JSON.parse(json);
    } else {
        Logger.log('Response code not between 200 and 299 - Guild');
    }
}

async function fetchGuildMembers(guild) {
    const playerRequests: any[] = [];
    let playerRequestsResponse: any[] = [];
    const guildMembers: { players: GuildPlayer[] } = { players: [] };
    for (const member of guild.data.members) {
        if (member.ally_code) playerRequests.push({ url: 'http://swgoh.gg/api/player/' + member.ally_code, method: 'get' });
    }

    playerRequestsResponse = UrlFetchApp.fetchAll(playerRequests);
    for (const response of playerRequestsResponse) {
        guildMembers.players.push(await JSON.parse(response));
    }
    return guildMembers;
}

function getGuildStatistics(guildMembers) {
    const guildCharactersGP = guildMembers.players.reduce((count, player) => count + player.data.character_galactic_power, 0);
    const guildCharactersGPAsMillions = Math.round((guildCharactersGP / 1000000) * 10) / 10;
    const guildShipsGP = guildMembers.players.reduce((count, player) => count + player.data.ship_galactic_power, 0);
    const guildShipsGPAsMillions = Math.round((guildShipsGP / 1000000) * 10) / 10;

    return [guildCharactersGPAsMillions, guildShipsGPAsMillions];
}

