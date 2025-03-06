function readCombatData() {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Raw HotUtil Table');
    var data = sheet.getDataRange().getValues();
    let increment = 1;
    if (data[1][0] == '') {
        increment = 2;
    }
    var result = [];

    for (var i = 0; i < data.length; i += increment) {
        var rowData = [
            data[i][0], // Name
            parseInt(data[i][1]), // Attempts
            parseInt(data[i][2].toString().replace(/\s+/g, '')) / parseInt(data[i][5].toString().replace(/\s+/g, '')), // Efficiency
            data[i][7], // Planet
            data[i][8], // Path
            parseInt(data[i][9]) // Zone
        ];
        result.push(rowData);
    }
    return result;
}

function writeCombatData(results, mission2Cell) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Rote TB');

    var combatName = '';
    var efficiency = 0;
    var attempts = 0;
    var path = '';
    var zone = '';
    var prevRound = false;
    var totPhase = 0;
    var keyUsed = [];
    var error = '';

    const pathDict = {
        Dark: 0,
        Mixed: 1,
        Light: 2,
        Bonus: 3
    };

    for (var row of results) {
        // Data arrives in this format:
        // combatName1 Attempts  Efficiency  Planet  Path  Zone
        // RoundX Attempts  Efficiency  Planet  Path  Zone
        // RoundY Attempts  Efficiency  Planet  Path  Zone
        // combatName1 Attempts  Efficiency  Planet  Path  Zone
        //...

        if (row[0].indexOf('Round') !== -1) {
            // If combatName contains "Round"
            attempts += row[1];
            prevRound = true;
            totPhase++;
        } else if (prevRound) {
            //If the combatName is not round and previous line was Round => New combat node. Therefore process previous combat node
            let averageAttempts = parseInt(attempts / totPhase);

            // Use mission2Cell[path][zone] to get the cell name
            let keyFound = false;
            for (var key in mission2Cell[path][zone - 1]) {
                if (combatName.includes(key) && !keyUsed.includes(key)) {
                    keyFound = true;
                    keyUsed.push(key);
                    break;
                }
            }
            if (keyFound) {
                var cellName = mission2Cell[path][zone - 1][key];

                // Write the value of efficiency in the cell
                sheet.getRange(cellName).setValue(efficiency);

                // Write the value of average attempts in the cell to the right
                sheet.getRange(cellName).offset(0, 1).setValue(averageAttempts);
            } else {
                error = errorHotUtil(path, zone, combatName, error);
            }

            //Write new combat node info
            combatName = row[0];
            if (!isNaN(row[2])) {
                efficiency = row[2];
            } else {
                efficiency = 0;
            }
            if (zone != row[5] || path != pathDict[row[4]]) {
                path = pathDict[row[4]];
                zone = row[5];
                keyUsed = [];
            }

            //Reset tracking variables
            attempts = 0;
            prevRound = false;
            totPhase = 0;
        } else {
            //If the combatName is not round and previous line was not Round => New combat node on a new planet
            combatName = row[0];
            if (!isNaN(row[2])) {
                efficiency = row[2];
            } else {
                efficiency = 0;
            }
            if (zone != row[5] || path != pathDict[row[4]]) {
                path = pathDict[row[4]];
                zone = row[5];
                keyUsed = [];
            }
        }
    }

    //Last combat node
    if (prevRound) {
        //If the combatName is not round and previous line was Round
        let averageAttempts = parseInt(attempts / totPhase);

        // Use mission2Cell[path][zone] to get the cell name
        let keyFound = false;
        for (var key in mission2Cell[path][zone - 1]) {
            if (combatName.includes(key) && !keyUsed.includes(key)) {
                keyFound = true;
                keyUsed.push(key);
                break;
            }
        }
        if (keyFound) {
            var cellName = mission2Cell[path][zone - 1][key];

            // Write the value of efficiency in the cell
            sheet.getRange(cellName).setValue(efficiency);

            // Write the value of average attempts in the cell to the right
            sheet.getRange(cellName).offset(0, 1).setValue(averageAttempts);
        } else {
            error = errorHotUtil(path, zone, combatName, error);
        }
    }
    if (error.length > 1) {
        SpreadsheetApp.getUi().alert(error);
    } else SpreadsheetApp.getUi().alert('Combat data loaded properly');
}

function errorHotUtil(path, zone, combatName, error) {
    const revesePathDict = {
        0: 'Dark',
        1: 'Mixed',
        2: 'Light',
        3: 'Bonus'
    };
    if (path == 1 && zone == 4 && combatName.includes("Qi'ra")) {
        //ignore (bad HotUtil report, this is a SM)
    } else if (path == 2 && zone == 4 && combatName.includes('Phoenix')) {
        //ignore (bad HotUtil report, they report PX twice)
    } else if (path == 1 && zone == 5 && combatName.includes('CARTELSPY')) {
        //ignore (bad HotUtil report, they report Nest twice)
    } else {
        error += 'Could not find combat called ' + combatName + ' in ' + revesePathDict[path] + ' path and sector' + zone.toString() + '\n';
    }
    return error;
}

function getCombatCellDict() {
    let dict = [];
    //Dark side (0)
    dict.push([]);
    //Zone 0: Mustafar
    dict[0].push([]);
    dict[0][0] = {
        'Lord Vader': 'AA3',
        'Wat Tambor': 'AA4',
        'Nute Gunray': 'AA5',
        'Battle Droid': 'AA6',
        Fleet: 'AA7'
    };
    //Zone 1: Geonosis
    dict[0].push([]);
    dict[0][1] = {
        Geonosian: 'AE3',
        Acklay: 'AE4',
        Reek: 'AE5',
        Nexu: 'AE6',
        Fleet: 'AE7'
    };
    //Zone 2: Dathromir
    dict[0].push([]);
    dict[0][2] = {
        Empire: 'AI3',
        Aphra: 'AI4',
        Enemy: 'AI5',
        'Enemy:': 'AI6'
    };
    //Zone 3: Haven-Class Medical
    dict[0].push([]);
    dict[0][3] = {
        Rex: 'AA22',
        ' Rex': 'AA23',
        'and Rex': 'AA24',
        '50R-T': 'AA25'
    };
    //Zone 4: Malachor
    dict[0].push([]);
    dict[0][4] = {
        Brother: 'AE22',
        Enemy: 'AE23',
        'Enemy:': 'AE24',
        'Enemy: ': 'AE25'
    };
    //Zone 5: Death Star
    dict[0].push([]);
    dict[0][5] = {
        Iden: 'AI22',
        Vader: 'AI23',
        'Enemy:': 'AI24',
        'Enemy: ': 'AI25',
        Fleet: 'AI26'
    };

    //Mixed side (1)
    dict.push([]);
    //Zone 0: Corellia
    dict[1].push([]);
    dict[1][0] = {
        Jabba: 'AA8',
        Aphra: 'AA9',
        'Imperial Officer': 'AA10',
        Fleet: 'AA11'
    };
    //Zone 1: Felucia
    dict[1].push([]);
    dict[1][1] = {
        Jabba: 'AE8',
        'Young Lando': 'AE10',
        Enemy: 'AE11',
        Hondo: 'AE9',
        Fleet: 'AE12'
    };
    //Zone 2: Tatooine
    dict[1].push([]);
    dict[1][2] = {
        Jabba: 'AI7',
        Fennec: 'AI8',
        Enemy: 'AI9',
        Fleet: 'AI10'
    };
    //Zone 3: Kessel
    dict[1].push([]);
    dict[1][3] = {
        Jabba: 'AA26',
        Enemy: 'AA27',
        'Enemy:': 'AA28',
        Fleet: 'AA29'
    };
    //Zone 4: Vandor
    dict[1].push([]);
    dict[1][4] = {
        Jabba: 'AE26',
        Enemy: 'AE27',
        'Enemy:': 'AE28',
        Fleet: 'AE29'
    };
    //Zone 5: Hoth
    dict[1].push([]);
    dict[1][5] = {
        Jabba: 'AI27',
        Aphra: 'AI28',
        Enemy: 'AI29',
        'Enemy:': 'AI30',
        Fleet: 'AI31'
    };

    //Light side (2)
    dict.push([]);
    //Zone 0: Coruscant
    dict[2].push([]);
    dict[2][0] = {
        Mace: 'AA12',
        Jedi: 'AA13',
        Enemy: 'AA14',
        'Enemy:': 'AA15',
        Fleet: 'AA16'
    };
    //Zone 1: Braca
    dict[2].push([]);
    dict[2][1] = {
        Jedi: 'AE13',
        'Second Sister': 'AE14',
        Stormtrooper: 'AE15',
        Fleet: 'AE16'
    };
    //Zone 2: Kashyyyk
    dict[2].push([]);
    dict[2][2] = {
        Wookiee: 'AI11',
        Mara: 'AI12',
        Stormtrooper: 'AI13',
        Fleet: 'AI14'
    };
    //Zone 3: Lothal
    dict[2].push([]);
    dict[2][3] = {
        Phoenix: 'AA30',
        Jedi: 'AA31',
        Stormtrooper: 'AA32',
        Fleet: 'AA33'
    };
    //Zone 4: Ring of Kafrene
    dict[2].push([]);
    dict[2][4] = {
        Cassian: 'AE30',
        Enemy: 'AE31',
        'Enemy:': 'AE32',
        'Enemy: ': 'AE33',
        Fleet: 'AE34'
    };
    //Zone 5: Scarif
    dict[2].push([]);
    dict[2][5] = {
        Cassian: 'AI32',
        Baze: 'AI33',
        Enemy: 'AI34',
        'Enemy:': 'AI35',
        Fleet: 'AI36'
    };

    //Bonus
    dict.push(['', '']);
    //Zeffo
    dict[3].push([]);
    dict[3][2] = {
        'Jedi Knight Cal Kestis': 'AI15',
        Unaligned: 'AI16',
        Enemy: 'AI17',
        Fleet: 'AI18'
    };
    //Mandalore
    dict[3].push([]);
    dict[3][3] = {
        Bo: 'AA34',
        Dark: 'AA35',
        'Enemy:': 'AA36',
        Fleet: 'AA37'
    };
    return dict;
}

function readCombatHotUtil() {
    let results = readCombatData();
    let mission2Cell = getCombatCellDict();
    writeCombatData(results, mission2Cell);
}

function onOpen() {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('Load HotUtil').addItem('Load Combat Table', 'readCombatHotUtil').addToUi();
    ui.createMenu('Update Database').addItem('Reimport data from SWGOH.GG', 'menuItem1').addToUi();
}

async function menuItem1() {
    let playerRequests = [];
    let playerRequestsResponse = [];
    let guildData = {};
    guildData.players = [];

    let guildInitialResponse;
    let guildInitial;

    let characterData;
    let shipData;

    let characterDataResponse;
    let shipDataResponse;

    let characterSuccess;
    let guildSuccess;
    let shipSuccess;

    //SpreadsheetApp.getUi().alert('Database is being updated.');

    const ss = SpreadsheetApp.getActive(); //Open Google Sheet
    const workbookSheets = ss.getSheets(); //Retrieve all sheets
    const charactersandShipsRange = ss.getSheetByName('Characters & Ships');
    const report = ss.getSheetByName('Guild');

    const swgohURL = report.getRange(2, 1).getValue().replace('https://swgoh.gg/g/', '');

    let options = {
        method: 'get',
        muteHttpExceptions: false
    };

    for (
        let i = 1;
        i <= 3;
        i++ //Retry if fetch fails
    ) {
        guildSuccess = false;
        try {
            guildInitialResponse = UrlFetchApp.fetch('http://swgoh.gg/api/guild-profile/' + swgohURL, options);

            if (guildInitialResponse.getResponseCode() >= 200 && guildInitialResponse.getResponseCode() <= 299) {
                const json = guildInitialResponse.getContentText();
                guildInitial = JSON.parse(json);
                i = 4;
                guildSuccess = true;
            } else {
                Logger.log('Response code not between 200 and 299 - Guild');
                Utilities.sleep(500 * Math.pow(2, i + 1));
            }
        } catch (error) {
            Logger.log(error);
            Utilities.sleep(500 * Math.pow(2, i + 1));
        }
    }

    if (guildInitial == undefined) {
        SpreadsheetApp.getUi().alert('Unable to get guild data from swgoh.gg');
        return 0;
    }

    const guildName = guildInitial.data.name;
    report.getRange(4, 3).setValue(guildName);
    report.getRange(5, 3).setValue(new Date());

    //FETCH GUILD MEMBES
    for (member of guildInitial.data.members) {
        if (member.ally_code) playerRequests.push({ url: 'http://swgoh.gg/api/player/' + member.ally_code, method: 'get' });
    }
    playerRequestsResponse = UrlFetchApp.fetchAll(playerRequests);
    for (response of playerRequestsResponse) {
        guildData.players.push(await JSON.parse(response));
    }

    //ATTRIBUTION
    let geosOver6 = 0;
    let dookuAsajjOver6And16500 = 0;
    let grievousTeam = 0;
    let dookuAndSepOver7And16500 = 0;
    for (const player of guildData.players) {
        geosOver6 = countGeosByMinRarity(player, 6, geosOver6);
        dookuAsajjOver6And16500 = countDookuAsajjByMinRarityAndPower(player, 6, 16500, dookuAsajjOver6And16500);
        grievousTeam = countGGTeamByMinRarity(player, 7, grievousTeam);
        dookuAndSepOver7And16500 = countDookuAndSepTeamByMinRarityAndPower(player, 7, 16500, dookuAndSepOver7And16500);
    }

    const geoTBSheet = ss.getSheetByName('DS GEO TB');
    const guildCharactersGP = guildData.players.reduce((count, player) => count + player.data.character_galactic_power, 0);
    const guildCharactersGPAsMillions = Math.round((guildCharactersGP / 1000000) * 10) / 10;
    const guildShipsGP = guildData.players.reduce((count, player) => count + player.data.ship_galactic_power, 0);
    const guildShipsGPAsMillions = Math.round((guildShipsGP / 1000000) * 10) / 10;

    geoTBSheet.getRange(5, 2).setValue(guildData.players.length);
    geoTBSheet.getRange(6, 2).setValue(guildCharactersGPAsMillions);
    geoTBSheet.getRange(8, 2).setValue(guildShipsGPAsMillions);
    geoTBSheet.getRange(5, 10).setValue(geosOver6);
    geoTBSheet.getRange(6, 10).setValue(dookuAsajjOver6And16500);
    geoTBSheet.getRange(7, 10).setValue(grievousTeam);
    geoTBSheet.getRange(8, 10).setValue(dookuAndSepOver7And16500);
}

function countGeosByMinRarity(player, rarity, totalCount) {
    const geoBroodAlphaOverRarity = player.units.some((char) => {
        return char.data.base_id == 'GEONOSIANBROODALPHA' && char.data.rarity >= rarity;
    });
    const sunfacOverRarity = player.units.some((char) => char.data.base_id == 'SUNFAC' && char.data.rarity >= rarity);
    const soldierOverRarity = player.units.some((char) => char.data.base_id == 'GEONOSIANSOLDIER' && char.data.rarity >= rarity);
    const spyOverRarity = player.units.some((char) => char.data.base_id == 'GEONOSIANSPY' && char.data.rarity >= rarity);
    const poggleOverRarity = player.units.some((char) => char.data.base_id == 'POGGLETHELESSER' && char.data.rarity >= rarity);
    if (geoBroodAlphaOverRarity && sunfacOverRarity && soldierOverRarity && spyOverRarity && poggleOverRarity) {
        totalCount++;
    }
    return totalCount;
}

function countDookuAsajjByMinRarityAndPower(player, rarity, power, totalCount) {
    const asajjOverRarityAndPower = player.units.some(
        (char) => char.data.base_id == 'ASAJVENTRESS' && char.data.rarity >= rarity && char.data.power >= power
    );
    const dokuuOverRarityAndPower = player.units.some(
        (char) => char.data.base_id == 'COUNTDOOKU' && char.data.rarity >= rarity && char.data.power >= power
    );
    if (asajjOverRarityAndPower && dokuuOverRarityAndPower) {
        totalCount++;
    }
    return totalCount;
}

function countGGTeamByMinRarity(player, rarity, totalCount) {
    const grievousOverRarity = player.units.some((char) => {
        return char.data.base_id == 'GRIEVOUS' && char.data.rarity >= rarity;
    });
    const b1OverRarity = player.units.some((char) => char.data.base_id == 'B1BATTLEDROIDV2' && char.data.rarity >= rarity);
    const b2OverRarity = player.units.some((char) => char.data.base_id == 'B2SUPERBATTLEDROID' && char.data.rarity >= rarity);
    const magnaOverRarity = player.units.some((char) => char.data.base_id == 'MAGNAGUARD' && char.data.rarity >= rarity);
    const droidekaOverRarity = player.units.some((char) => char.data.base_id == 'DROIDEKA' && char.data.rarity >= rarity);
    const stapOverRarity = player.units.some((char) => char.data.base_id == 'STAP' && char.data.rarity >= rarity);
    const separatistDroidsFound = [grievousOverRarity, b1OverRarity, b2OverRarity, magnaOverRarity, droidekaOverRarity, stapOverRarity];
    const countTrue = separatistDroidsFound.reduce((count, value) => count + (value ? 1 : 0), 0);
    if (countTrue >= 5) {
        totalCount++;
    }
    return totalCount;
}

function countDookuAndSepTeamByMinRarityAndPower(player, rarity, power, totalCount) {
    const characterDataResponse = UrlFetchApp.fetch('https://swgoh.gg/api/characters', {
        method: 'get',
        muteHttpExceptions: false
    });
    const json = characterDataResponse.getContentText();
    const characterData = JSON.parse(json);
    const separatistsBaseId = characterData
        .filter((character) => character.categories.some((categorie) => categorie == 'Separatist'))
        .map((character) => character.base_id);
    const dokuuOverRarityAndPower = player.units.some(
        (char) => char.data.base_id == 'COUNTDOOKU' && char.data.rarity >= rarity && char.data.power >= power
    );
    const separatists = player.units.filter((unit) => separatistsBaseId.includes(unit.data.base_id) && unit.data.base_id != 'COUNTDOOKU');
    const separatistFound = [dokuuOverRarityAndPower];
    separatists.forEach((separatist) => {
        separatistFound.push(separatist.data.rarity >= rarity && separatist.data.power >= power);
    });
    const countTrue = separatistFound.reduce((count, value) => count + (value ? 1 : 0), 0);
    if (countTrue >= 5) {
        totalCount++;
    }
    return totalCount;
}
