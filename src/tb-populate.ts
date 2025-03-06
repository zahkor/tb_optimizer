function onOpen() {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('Update spreadsheets').addItem('Reimport data from SWGOH.GG', 'menuItem1').addToUi();
}

async function menuItem1() {
    let guildMembers: { players: GuildPlayer[] } = { players: [] };

    let guild: Guild | undefined = undefined;

    const spreadSheet = SpreadsheetApp.getActive(); //Open Google Sheet
    const report = spreadSheet.getSheetByName('Guild');
    if (!report) {
        return;
    }
    const swgohURL = report.getRange(2, 1).getValue().replace('https://swgoh.gg/g/', '');

    guild = getGuildFromUrl(swgohURL);

    if (guild == undefined) {
        SpreadsheetApp.getUi().alert('Unable to get guild data from swgoh.gg');
        return 0;
    }

    const guildName = guild.data.name;
    report.getRange(4, 3).setValue(guildName);
    report.getRange(5, 3).setValue(new Date());

    //FETCH GUILD MEMBES
    guildMembers = await fetchGuildMembers(guild);

    //ATTRIBUTION
    updateGeoSheet(guildMembers, spreadSheet);
    updateRoTESHeet(guildMembers, spreadSheet);
}

function updateRoTESHeet(guildMembers: { players: GuildPlayer[] }, speadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet) {
    const RoTETBSheet = speadsheet.getSheetByName('RotE TB');

    const [guildCharactersGPAsMillions, guildShipsGPAsMillions] = getGuildStatistics(guildMembers);

    let totalCharacterGPOverRelic5: number = 0;
    let totalCharacterCountOverRelic5: number = 0;
    for (const player of guildMembers.players) {
        const [playerCharacterGp, playerUnitCountOverRelic5] = averageCharacterGPOverRelic5(player);
        totalCharacterGPOverRelic5 += playerCharacterGp;
        totalCharacterCountOverRelic5 += playerUnitCountOverRelic5;
    }

    RoTETBSheet?.getRange(4, 2).setValue(guildMembers.players.length);
    RoTETBSheet?.getRange(5, 2).setValue(guildCharactersGPAsMillions + guildShipsGPAsMillions);
    RoTETBSheet?.getRange(13, 2).setValue(totalCharacterGPOverRelic5 / totalCharacterCountOverRelic5);
}

function updateGeoSheet(guildMembers: { players: GuildPlayer[] }, speadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet) {
    const geoTBSheet = speadsheet.getSheetByName('DS GEO TB');
    if (!geoTBSheet) {
        return;
    }

    const [guildCharactersGPAsMillions, guildShipsGPAsMillions] = getGuildStatistics(guildMembers);

    let geosOver6 = 0;
    let dookuAsajjOver6And16500 = 0;
    let grievousTeam = 0;
    let dookuAndSepOver7And16500 = 0;
    for (const player of guildMembers.players) {
        geosOver6 = countGeosByMinRarity(player, 6, geosOver6);
        dookuAsajjOver6And16500 = countDookuAsajjByMinRarityAndPower(player, 6, 16500, dookuAsajjOver6And16500);
        grievousTeam = countGGTeamByMinRarity(player, 7, grievousTeam);
        dookuAndSepOver7And16500 = countDookuAndSepTeamByMinRarityAndPower(player, 7, 16500, dookuAndSepOver7And16500);
    }

    geoTBSheet.getRange(5, 2).setValue(guildMembers.players.length);
    geoTBSheet.getRange(6, 2).setValue(guildCharactersGPAsMillions);
    geoTBSheet.getRange(8, 2).setValue(guildShipsGPAsMillions);
    geoTBSheet.getRange(5, 10).setValue(geosOver6);
    geoTBSheet.getRange(6, 10).setValue(dookuAsajjOver6And16500);
    geoTBSheet.getRange(7, 10).setValue(grievousTeam);
    geoTBSheet.getRange(8, 10).setValue(dookuAndSepOver7And16500);
}

