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

async function updateRoTESHeet(guildMembers: { players: GuildPlayer[] }, speadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet) {
    const RoTETBSheet = speadsheet.getSheetByName('RotE TB');

    const [guildCharactersGPAsMillions, guildShipsGPAsMillions] = getGuildStatistics(guildMembers);

    let totalCharacterGPOverRelic5: number = 0;
    let totalShipsGP: number = 0;
    let totalCharacterCountOverRelic5: number = 0;
    let totalShipsCount: number = 0;
    let totalLordVaderOverR5: number = 0;
    let totalGeosOverR7: number = 0;
    let totalEmpireOverR7: number = 0;
    let fennecOverR7: number = 0;
    let InquisitorsOverR9: number = 0;
    let darthVaderOverRelic9 = 0;
    let idenOverR9: number = 0;
    let scythe7Stars: number = 0;
    let imperialTieFighter7Stars: number = 0;
    let executor7Stars: number = 0;
    let profundity7Stars: number = 0;
    let outrider7Stars: number = 0;
    let aphraOverR5: number = 0;
    let aphraOverR7: number = 0;
    let aphraTeamOverR9: number = 0;
    let hondoOverR6: number = 0;
    let youngLandoOverR6: number = 0;
    let jabbaOverR5: number = 0;
    let jabbaOverR6: number = 0;
    let jabbaOverR7: number = 0;
    let jabbaOverR8: number = 0;
    let jabbaOverR9: number = 0;
    let landoFalcon7Stars: number = 0;
    let ghost7Stars: number = 0;
    let jediOverR5: number = 0;
    let jediOverR6: number = 0;
    let jediOverR8: number = 0;
    let jediMaceKitOverR5: number = 0;
    let lightSideWookieeOverRelic7: number = 0;
    let jediKnightCalKestisOverRelic7: number = 0;
    let lightSideUfuOverRelic7: number = 0;
    let cassianK2OverRelic9: number = 0;
    let cassianK2PaoOverRelic9: number = 0;
    let bazeChirrutSrpOverRelic9: number = 0;
    let negotiator7Stars: number = 0;
    let BoKatanOverRelic9: number = 0;
    let DTMGOverRelic8: number = 0;
    let gauntlet7Stars: number = 0;

    for (const player of guildMembers.players) {
        const [playerCharactersGp, playerUnitCountOverRelic5] = averageCharacterGPOverRelic5ByPlayer(player);
        const [playerShipsGp, playerShipsCount] = await averageShipsGPByPlayer(player);
        totalLordVaderOverR5 = hasLordVaderOverRelic5(player, totalLordVaderOverR5);
        totalGeosOverR7 = hasGeosOverRelic7(player, totalGeosOverR7);
        totalEmpireOverR7 = hasEmpireOverRelic7(player, totalEmpireOverR7);
        fennecOverR7 = hasFennecOverRelic7(player, fennecOverR7);
        InquisitorsOverR9 = hasInquisitors57And8OverRelic9(player, InquisitorsOverR9);
        darthVaderOverRelic9 = hasDarthVaderOverRelic9(player, darthVaderOverRelic9);
        idenOverR9 = hasIdenOverRelic9(player, idenOverR9);
        scythe7Stars = hasScytheOver7Stars(player, scythe7Stars);
        imperialTieFighter7Stars = hasImperialTieFighterOver7Stars(player, imperialTieFighter7Stars);
        executor7Stars = hasExecutorOver7Stars(player, executor7Stars);
        profundity7Stars = hasProfundityOver7Stars(player, profundity7Stars);
        outrider7Stars = hasOutriderOver7Stars(player, outrider7Stars);
        aphraOverR5 = hasAphraOverRelic5(player, aphraOverR5);
        aphraOverR7 = hasAphraOverRelic7(player, aphraOverR7);
        aphraTeamOverR9 = hasAphra000AndBt01OverRelic9(player, aphraTeamOverR9);
        hondoOverR6 = hasHondoOverRelic6(player, hondoOverR6);
        youngLandoOverR6 = hasYoungLandoOverRelic6(player, youngLandoOverR6);
        jabbaOverR5 = hasJabbaOverRelic5(player, jabbaOverR5);
        jabbaOverR6 = hasJabbaOverRelic6(player, jabbaOverR6);
        jabbaOverR7 = hasJabbaOverRelic7(player, jabbaOverR7);
        jabbaOverR8 = hasJabbaOverRelic8(player, jabbaOverR8);
        jabbaOverR9 = hasJabbaOverRelic9(player, jabbaOverR9);
        landoFalcon7Stars = hasLandoFalconOver7Stars(player, landoFalcon7Stars);
        ghost7Stars = hasGhostOver7Stars(player, ghost7Stars);
        jediOverR5 = hasJediRelic5(player, jediOverR5);
        jediOverR6 = hasJediRelic6(player, jediOverR6);
        jediOverR8 = hasJediRelic8(player, jediOverR8);
        jediMaceKitOverR5 = hasMaceKitAndJediRelic5(player, jediMaceKitOverR5);
        lightSideWookieeOverRelic7 = hasLightSideWookies(player, lightSideWookieeOverRelic7);
        jediKnightCalKestisOverRelic7 = hasJediKnightCalKestis(player, jediKnightCalKestisOverRelic7);
        lightSideUfuOverRelic7 = hasLightSideUFU(player, lightSideUfuOverRelic7);
        cassianK2OverRelic9 = hasCassianK2R9(player, cassianK2OverRelic9);
        cassianK2PaoOverRelic9 = hasCassianK2PaoR9(player, cassianK2PaoOverRelic9);
        bazeChirrutSrpOverRelic9 = hasBazeChirrutSRPR9(player, bazeChirrutSrpOverRelic9);
        negotiator7Stars = hasNegotiatorOver7Stars(player, negotiator7Stars);
        BoKatanOverRelic9 = hasBoMandalorOverRelic9(player, BoKatanOverRelic9);
        DTMGOverRelic8 = hasDarkTrooperMoffGideonOverRelic8(player, DTMGOverRelic8);
        gauntlet7Stars = hasGauntlet7Stars(player, gauntlet7Stars);

        totalCharacterGPOverRelic5 += playerCharactersGp;
        totalCharacterCountOverRelic5 += playerUnitCountOverRelic5;
        totalShipsGP += playerShipsGp;
        totalShipsCount += playerShipsCount;
    }

    let averagePowerPerCharacters = totalCharacterGPOverRelic5 / totalCharacterCountOverRelic5;
    let averagePowerPerShips = totalShipsGP / totalShipsCount;

    RoTETBSheet?.getRange(4, 2).setValue(guildMembers.players.length);
    RoTETBSheet?.getRange(5, 2).setValue(guildCharactersGPAsMillions + guildShipsGPAsMillions);
    RoTETBSheet?.getRange(13, 2).setValue(Math.round((averagePowerPerCharacters / 1000) * 10) / 10);
    RoTETBSheet?.getRange(14, 2).setValue(Math.round((averagePowerPerShips / 1000) * 10) / 10);
    RoTETBSheet?.getRange(16, 17).setValue(totalLordVaderOverR5);
    RoTETBSheet?.getRange(17, 17).setValue(totalGeosOverR7);
    RoTETBSheet?.getRange(18, 17).setValue(totalEmpireOverR7);
    RoTETBSheet?.getRange(19, 17).setValue(fennecOverR7);
    RoTETBSheet?.getRange(20, 17).setValue(InquisitorsOverR9);
    RoTETBSheet?.getRange(21, 17).setValue(darthVaderOverRelic9);
    RoTETBSheet?.getRange(22, 17).setValue(idenOverR9);
    RoTETBSheet?.getRange(23, 17).setValue(scythe7Stars);
    RoTETBSheet?.getRange(24, 17).setValue(imperialTieFighter7Stars);
    RoTETBSheet?.getRange(25, 17).setValue(executor7Stars);
    RoTETBSheet?.getRange(26, 17).setValue(profundity7Stars);
    RoTETBSheet?.getRange(27, 17).setValue(outrider7Stars);

    RoTETBSheet?.getRange(16, 19).setValue(aphraOverR5);
    RoTETBSheet?.getRange(17, 19).setValue(aphraOverR7);
    RoTETBSheet?.getRange(18, 19).setValue(aphraTeamOverR9);
    RoTETBSheet?.getRange(19, 19).setValue(hondoOverR6);
    RoTETBSheet?.getRange(20, 19).setValue(youngLandoOverR6);
    RoTETBSheet?.getRange(21, 19).setValue(jabbaOverR5);
    RoTETBSheet?.getRange(22, 19).setValue(jabbaOverR6);
    RoTETBSheet?.getRange(23, 19).setValue(jabbaOverR7);
    RoTETBSheet?.getRange(24, 19).setValue(jabbaOverR8);
    RoTETBSheet?.getRange(25, 19).setValue(jabbaOverR9);
    RoTETBSheet?.getRange(26, 19).setValue(landoFalcon7Stars);
    RoTETBSheet?.getRange(27, 19).setValue(ghost7Stars);

    RoTETBSheet?.getRange(16, 21).setValue(jediOverR5);
    RoTETBSheet?.getRange(17, 21).setValue(jediMaceKitOverR5);
    RoTETBSheet?.getRange(18, 21).setValue(jediOverR6);
    RoTETBSheet?.getRange(19, 21).setValue(lightSideWookieeOverRelic7);
    RoTETBSheet?.getRange(20, 21).setValue(jediKnightCalKestisOverRelic7);
    RoTETBSheet?.getRange(21, 21).setValue(lightSideUfuOverRelic7);
    RoTETBSheet?.getRange(22, 21).setValue(jediOverR8);
    RoTETBSheet?.getRange(23, 21).setValue(0);
    RoTETBSheet?.getRange(24, 21).setValue(cassianK2OverRelic9);
    RoTETBSheet?.getRange(25, 21).setValue(cassianK2PaoOverRelic9);
    RoTETBSheet?.getRange(26, 21).setValue(bazeChirrutSrpOverRelic9);
    RoTETBSheet?.getRange(27, 21).setValue(negotiator7Stars);

    RoTETBSheet?.getRange(16, 23).setValue(BoKatanOverRelic9);
    RoTETBSheet?.getRange(17, 23).setValue(DTMGOverRelic8);
    RoTETBSheet?.getRange(18, 23).setValue(gauntlet7Stars);
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
        geosOver6 = countGeosByMinRarityAndPlayer(player, 6, geosOver6);
        dookuAsajjOver6And16500 = countDookuAsajjByMinRarityAndPowerAndPlayer(player, 6, 16500, dookuAsajjOver6And16500);
        grievousTeam = countGGTeamByMinRarityAndPlayer(player, 7, grievousTeam);
        dookuAndSepOver7And16500 = countDookuAndSepTeamByMinRarityAndPowerAndPlayer(player, 7, 16500, dookuAndSepOver7And16500);
    }

    geoTBSheet.getRange(5, 2).setValue(guildMembers.players.length);
    geoTBSheet.getRange(6, 2).setValue(guildCharactersGPAsMillions);
    geoTBSheet.getRange(8, 2).setValue(guildShipsGPAsMillions);
    geoTBSheet.getRange(5, 10).setValue(geosOver6);
    geoTBSheet.getRange(6, 10).setValue(dookuAsajjOver6And16500);
    geoTBSheet.getRange(7, 10).setValue(grievousTeam);
    geoTBSheet.getRange(8, 10).setValue(dookuAndSepOver7And16500);
}

