function countGeosByMinRarityAndPlayer(player: GuildPlayer, rarity, totalCount) {
    const geoBroodAlphaOverRarity = getCharacterByBaseIdRarity(player, 'GEONOSIANBROODALPHA', rarity);
    const sunfacOverRarity = getCharacterByBaseIdRarity(player, 'SUNFAC', rarity);
    const soldierOverRarity = getCharacterByBaseIdRarity(player, 'GEONOSIANSOLDIER', rarity);
    const spyOverRarity = getCharacterByBaseIdRarity(player, 'GEONOSIANSPY', rarity);
    const poggleOverRarity = getCharacterByBaseIdRarity(player, 'POGGLETHELESSER', rarity);
    if (geoBroodAlphaOverRarity && sunfacOverRarity && soldierOverRarity && spyOverRarity && poggleOverRarity) {
        totalCount++;
    }
    return totalCount;
}

function countDookuAsajjByMinRarityAndPowerAndPlayer(player: GuildPlayer, rarity, power, totalCount) {
    const asajjOverRarityAndPower = getCharacterByBaseIdRarityAndPower(player, 'ASAJVENTRESS', rarity, power);
    const dokuuOverRarityAndPower = getCharacterByBaseIdRarityAndPower(player, 'COUNTDOOKU', rarity, power);
    if (asajjOverRarityAndPower && dokuuOverRarityAndPower) {
        totalCount++;
    }
    return totalCount;
}

function countGGTeamByMinRarityAndPlayer(player: GuildPlayer, rarity, totalCount) {
    const grievousOverRarity = getCharacterByBaseIdRarity(player, 'GRIEVOUS', rarity);
    const b1OverRarity = getCharacterByBaseIdRarity(player, 'B1BATTLEDROIDV2', rarity);
    const b2OverRarity = getCharacterByBaseIdRarity(player, 'B2SUPERBATTLEDROID', rarity);
    const magnaOverRarity = getCharacterByBaseIdRarity(player, 'MAGNAGUARD', rarity);
    const droidekaOverRarity = getCharacterByBaseIdRarity(player, 'DROIDEKA', rarity);
    const stapOverRarity = getCharacterByBaseIdRarity(player, 'STAP', rarity);
    const watOverRarity = getCharacterByBaseIdRarity(player, 'WATTAMBOR', rarity);
    const separatistDroidsFound = [
        grievousOverRarity,
        b1OverRarity,
        b2OverRarity,
        magnaOverRarity,
        droidekaOverRarity,
        stapOverRarity,
        watOverRarity
    ];
    const countTrue = separatistDroidsFound.reduce((count, value) => count + (value ? 1 : 0), 0);
    if (countTrue >= 5) {
        totalCount++;
    }
    return totalCount;
}

function countDookuAndSepTeamByMinRarityAndPowerAndPlayer(player: GuildPlayer, rarity, power, totalCount) {
    const separatistsBaseId = getCharactersBaseIdByFaction('Separatist');
    const dokuuOverRarityAndPower = getCharacterByBaseIdRarityAndPower(player, 'COUNTDOOKU', rarity, power);
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

