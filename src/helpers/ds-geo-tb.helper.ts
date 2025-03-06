function countGeosByMinRarity(player: GuildPlayer, rarity, totalCount) {
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

function countDookuAsajjByMinRarityAndPower(player: GuildPlayer, rarity, power, totalCount) {
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

function countGGTeamByMinRarity(player: GuildPlayer, rarity, totalCount) {
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

function countDookuAndSepTeamByMinRarityAndPower(player: GuildPlayer, rarity, power, totalCount) {
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

