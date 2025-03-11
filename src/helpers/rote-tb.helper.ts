function averageCharacterGPOverRelic5ByPlayer(player: GuildPlayer) {
    let unitsOverRelic5 = player.units.filter((unit) => unit.data.relic_tier && unit.data.relic_tier >= 5);
    const totalGpOverRelic5 = unitsOverRelic5.reduce((count, unit) => count + unit.data.power, 0);
    return [totalGpOverRelic5, unitsOverRelic5.length];
}

async function averageShipsGPByPlayer(player: GuildPlayer) {
    const shipList = await getShipsList();
    const playerShips = player.units.filter((unit) => shipList.includes(unit.data.base_id));
    const totalGpShips = playerShips.reduce((count, unit) => count + unit.data.power, 0);
    return [totalGpShips, playerShips.length];
}

async function getShipsList() {
    try {
        let shipDataResponse = UrlFetchApp.fetch('https://swgoh.gg/api/ships', {
            method: 'get',
            muteHttpExceptions: false
        });
        if (shipDataResponse.getResponseCode() >= 200 && shipDataResponse.getResponseCode() <= 299) {
            const json = shipDataResponse.getContentText();
            let shipData = JSON.parse(json);
            return shipData.map((ship) => ship.base_id);
        }
    } catch (error) {
        Logger.log(error);
    }
}

function hasLordVaderOverRelic5(player: GuildPlayer, totalCount: number) {
    if (getCharacterByBaseIdAndRelicLevel(player, 'LORDVADER', 5)) {
        totalCount++;
    }
    return totalCount;
}

function hasGeosOverRelic7(player: GuildPlayer, totalCount: number) {
    const geoBroodAlphaOverRelic = getCharacterByBaseIdAndRelicLevel(player, 'GEONOSIANBROODALPHA', 7);
    const sunfacOverRelic = getCharacterByBaseIdAndRelicLevel(player, 'SUNFAC', 7);
    const soldierOverRelic = getCharacterByBaseIdAndRelicLevel(player, 'GEONOSIANSOLDIER', 7);
    const spyOverRelic = getCharacterByBaseIdAndRelicLevel(player, 'GEONOSIANSPY', 7);
    const poggleOverRelic = getCharacterByBaseIdAndRelicLevel(player, 'POGGLETHELESSER', 7);
    if (geoBroodAlphaOverRelic && sunfacOverRelic && soldierOverRelic && spyOverRelic && poggleOverRelic) {
        totalCount++;
    }
    return totalCount;
}

function hasEmpireOverRelic7(player: GuildPlayer, totalCount: number) {
    const empireFactionCharacters = getCharactersBaseIdByFaction('Empire');
    const empireCharactersValid = player.units.filter(
        (character) => empireFactionCharacters.includes(character.data.base_id) && character.data.relic_tier && character.data.relic_tier >= 7
    );
    if (empireCharactersValid.length >= 5) {
        totalCount++;
    }
    return totalCount;
}

function hasFennecOverRelic7(player, totalCount) {
    const fennecOverRelic = getCharacterByBaseIdAndRelicLevel(player, 'FENNECSHAND', 7);
    if (fennecOverRelic) {
        totalCount++;
    }
    return totalCount;
}

function hasInquisitors57And8OverRelic9(player: GuildPlayer, totalCount: number) {
    const inquisitor5Found = getCharacterByBaseIdAndRelicLevel(player, 'FIFTHBROTHER', 9);
    const inquisitor7Found = getCharacterByBaseIdAndRelicLevel(player, 'SEVENTHSISTER', 9);
    const inquisitor8Found = getCharacterByBaseIdAndRelicLevel(player, 'EIGHTHBROTHER', 9);
    if (inquisitor5Found && inquisitor7Found && inquisitor8Found) {
        totalCount++;
    }
    return totalCount;
}

function hasDarthVaderOverRelic9(player: GuildPlayer, totalCount: number) {
    const darthVaderFound = getCharacterByBaseIdAndRelicLevel(player, 'VADER', 9);
    if (darthVaderFound) {
        totalCount++;
    }
    return totalCount;
}

function hasIdenOverRelic9(player: GuildPlayer, totalCount: number) {
    const idenFound = getCharacterByBaseIdAndRelicLevel(player, 'IDENVERSIOEMPIRE', 9);
    if (idenFound) {
        totalCount++;
    }
    return totalCount;
}

function hasScytheOver7Stars(player: GuildPlayer, totalCount: number) {
    const scytheFound = getCharacterByBaseIdRarity(player, 'SCYTHE', 7);
    if (scytheFound) {
        totalCount++;
    }
    return totalCount;
}

function hasImperialTieFighterOver7Stars(player: GuildPlayer, totalCount: number) {
    const tieFound = getCharacterByBaseIdRarity(player, 'TIEFIGHTERIMPERIAL', 7);
    if (tieFound) {
        totalCount++;
    }
    return totalCount;
}

function hasExecutorOver7Stars(player: GuildPlayer, totalCount: number) {
    const executorFound = getCharacterByBaseIdRarity(player, 'CAPITALEXECUTOR', 7);
    if (executorFound) {
        totalCount++;
    }
    return totalCount;
}
function hasProfundityOver7Stars(player: GuildPlayer, totalCount: number) {
    const profundityFound = getCharacterByBaseIdRarity(player, 'CAPITALPROFUNDITY', 7);
    if (profundityFound) {
        totalCount++;
    }
    return totalCount;
}

function hasOutriderOver7Stars(player: GuildPlayer, totalCount: number) {
    const outriderFound = getCharacterByBaseIdRarity(player, 'OUTRIDER', 7);
    if (outriderFound) {
        totalCount++;
    }
    return totalCount;
}

function hasAphraOverRelic5(player: GuildPlayer, totalCount: number) {
    return hasAphraOverRelic(player, 5, totalCount);
}

function hasAphraOverRelic7(player: GuildPlayer, totalCount: number) {
    return hasAphraOverRelic(player, 7, totalCount);
}

function hasAphraOverRelic(player: GuildPlayer, relic: number, totalCount: number) {
    const aphraRelicFound = getCharacterByBaseIdAndRelicLevel(player, 'DOCTORAPHRA', relic);
    if (aphraRelicFound) {
        totalCount++;
    }
    return totalCount;
}

function hasAphra000AndBt01OverRelic9(player: GuildPlayer, totalCount: number) {
    const aphraRelic9Found = getCharacterByBaseIdAndRelicLevel(player, 'DOCTORAPHRA', 9);
    const tripleZeroRelic9Found = getCharacterByBaseIdAndRelicLevel(player, 'TRIPLEZERO', 9);
    const bt1Relic9Found = getCharacterByBaseIdAndRelicLevel(player, 'BT1', 9);
    if (aphraRelic9Found && tripleZeroRelic9Found && bt1Relic9Found) {
        totalCount++;
    }
    return totalCount;
}

function hasHondoOverRelic6(player: GuildPlayer, totalCount: number) {
    const hondoRelic6Found = getCharacterByBaseIdAndRelicLevel(player, 'HONDO', 6);
    if (hondoRelic6Found) {
        totalCount++;
    }
    return totalCount;
}

function hasYoungLandoOverRelic6(player: GuildPlayer, totalCount: number) {
    const youngLandoRelic6Found = getCharacterByBaseIdAndRelicLevel(player, 'YOUNGLANDO', 6);
    if (youngLandoRelic6Found) {
        totalCount++;
    }
    return totalCount;
}

function hasJabbaOverRelic5(player: GuildPlayer, totalCount: number) {
    return hasJabbaOverRelic(player, 5, totalCount);
}

function hasJabbaOverRelic6(player: GuildPlayer, totalCount: number) {
    return hasJabbaOverRelic(player, 6, totalCount);
}

function hasJabbaOverRelic7(player: GuildPlayer, totalCount: number) {
    return hasJabbaOverRelic(player, 7, totalCount);
}

function hasJabbaOverRelic8(player: GuildPlayer, totalCount: number) {
    return hasJabbaOverRelic(player, 8, totalCount);
}

function hasJabbaOverRelic9(player: GuildPlayer, totalCount: number) {
    return hasJabbaOverRelic(player, 9, totalCount);
}

function hasJabbaOverRelic(player: GuildPlayer, relic: number, totalCount: number) {
    const jabbaRelicFound = getCharacterByBaseIdAndRelicLevel(player, 'JABBATHEHUTT', relic);
    if (jabbaRelicFound) {
        totalCount++;
    }
    return totalCount;
}

function hasLandoFalconOver7Stars(player: GuildPlayer, totalCount: number) {
    const landoFalconFound = getCharacterByBaseIdRarity(player, 'MILLENNIUMFALCONPRISTINE', 7);
    if (landoFalconFound) {
        totalCount++;
    }
    return totalCount;
}

function hasGhostOver7Stars(player: GuildPlayer, totalCount: number) {
    const ghostFound = getCharacterByBaseIdRarity(player, 'GHOST', 7);
    if (ghostFound) {
        totalCount++;
    }
    return totalCount;
}

function hasJediRelic5(player: GuildPlayer, totalCount: number) {
    return hasJediOverRelic(player, 5, totalCount);
}

function hasJediRelic6(player: GuildPlayer, totalCount: number) {
    return hasJediOverRelic(player, 6, totalCount);
}

function hasJediRelic8(player: GuildPlayer, totalCount: number) {
    return hasJediOverRelic(player, 8, totalCount);
}

function hasJediOverRelic(player: GuildPlayer, relic: number, totalCount: number) {
    const jediFactionCharacters = getCharactersBaseIdByFaction('Jedi');
    const jediCharactersValid = player.units.filter(
        (character) => jediFactionCharacters.includes(character.data.base_id) && character.data.relic_tier && character.data.relic_tier >= relic
    );
    if (jediCharactersValid.length >= 5) {
        totalCount++;
    }
    return totalCount;
}

function hasMaceKitAndJediRelic5(player: GuildPlayer, totalCount: number) {
    const maceRelic5Found = getCharacterByBaseIdAndRelicLevel(player, 'MACEWINDU', 7);
    const kitRelic5Found = getCharacterByBaseIdAndRelicLevel(player, 'KITFISTO', 7);
    const jediFactionCharacters = getCharactersBaseIdByFaction('Jedi');
    const jediCharactersValid = player.units.filter(
        (character) => jediFactionCharacters.includes(character.data.base_id) && character.data.relic_tier && character.data.relic_tier >= 5
    );
    if (maceRelic5Found && kitRelic5Found && jediCharactersValid.length >= 3) {
        totalCount++;
    }
    return totalCount;
}

function hasLightSideWookies(player: GuildPlayer, totalCount: number) {
    const lightSideWookiees = getCharactersBaseIdByFactionAndAlignement('Wookiee', 'Light Side');
    const wookieesCharactersValid = player.units.filter(
        (character) => lightSideWookiees.includes(character.data.base_id) && character.data.relic_tier && character.data.relic_tier >= 7
    );
    if (wookieesCharactersValid.length >= 5) {
        totalCount++;
    }
    return totalCount;
}

function hasJediKnightCalKestis(player: GuildPlayer, totalCount: number) {
    const hasJediKnightCalKestisRelic7Found = getCharacterByBaseIdAndRelicLevel(player, 'JEDIKNIGHTCAL', 7);
    if (hasJediKnightCalKestisRelic7Found) {
        totalCount++;
    }
    return totalCount;
}

function hasLightSideUFU(player: GuildPlayer, totalCount: number) {
    const lightSideUFUs = getCharactersBaseIdByFactionAndAlignement('Unaligned Force User', 'Light Side');
    const UFUCharactersValid = player.units.filter(
        (character) => lightSideUFUs.includes(character.data.base_id) && character.data.relic_tier && character.data.relic_tier >= 7
    );
    if (UFUCharactersValid.length >= 5) {
        totalCount++;
    }
    return totalCount;
}

function hasCassianK2R9(player: GuildPlayer, totalCount: number) {
    const hasCassianR9 = getCharacterByBaseIdAndRelicLevel(player, 'CASSIANANDOR', 9);
    const hasK2SOR9 = getCharacterByBaseIdAndRelicLevel(player, 'K2SO', 9);
    if (hasCassianR9 && hasK2SOR9) {
        totalCount++;
    }
    return totalCount;
}

function hasCassianK2PaoR9(player: GuildPlayer, totalCount: number) {
    const hasCassianR9 = getCharacterByBaseIdAndRelicLevel(player, 'CASSIANANDOR', 9);
    const hasK2SOR9 = getCharacterByBaseIdAndRelicLevel(player, 'K2SO', 9);
    const hasPAOR9 = getCharacterByBaseIdAndRelicLevel(player, 'PAO', 9);
    if (hasCassianR9 && hasK2SOR9 && hasPAOR9) {
        totalCount++;
    }
    return totalCount;
}

function hasBazeChirrutSRPR9(player: GuildPlayer, totalCount: number) {
    const hasBazeR9 = getCharacterByBaseIdAndRelicLevel(player, 'BAZEMALBUS', 9);
    const hasChirrutR9 = getCharacterByBaseIdAndRelicLevel(player, 'CHIRRUTIMWE', 9);
    const hasSRPR9 = getCharacterByBaseIdAndRelicLevel(player, 'SCARIFREBEL', 9);
    if (hasBazeR9 && hasChirrutR9 && hasSRPR9) {
        totalCount++;
    }
    return totalCount;
}

function hasNegotiatorOver7Stars(player: GuildPlayer, totalCount: number) {
    const negotiatorFound = getCharacterByBaseIdRarity(player, 'CAPITALNEGOTIATOR', 7);
    if (negotiatorFound) {
        totalCount++;
    }
    return totalCount;
}

function hasBoMandalorOverRelic9(player: GuildPlayer, totalCount: number) {
    const hasBoR9 = getCharacterByBaseIdAndRelicLevel(player, 'MANDALORBOKATAN', 9);
    if (hasBoR9) {
        totalCount++;
    }
    return totalCount;
}

function hasDarkTrooperMoffGideonOverRelic8(player: GuildPlayer, totalCount: number) {
    const hasDTMGR9 = getCharacterByBaseIdAndRelicLevel(player, 'MOFFGIDEONS3', 8);
    if (hasDTMGR9) {
        totalCount++;
    }
    return totalCount;
}

function hasGauntlet7Stars(player: GuildPlayer, totalCount: number) {
    const gauntletFound = getCharacterByBaseIdRarity(player, 'GAUNTLETSTARFIGHTER', 7);
    if (gauntletFound) {
        totalCount++;
    }
    return totalCount;
}

