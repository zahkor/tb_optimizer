function getCharacterByBaseIdRarityAndPower(player, base_id, rarity, power) {
    return player.units.some((unit) => unit.data.base_id == base_id && unit.data.rarity >= rarity && unit.data.power >= power);
}

function getCharacterByBaseIdRarity(player, base_id, rarity) {
    return player.units.some((unit) => unit.data.base_id == base_id && unit.data.rarity >= rarity);
}

function getCharacterByBaseIdAndRelicLevel(player, base_id, relicTier) {
    return player.units.some((unit) => unit.data.base_id == base_id && unit.data.relic_tier && unit.data.relic_tier >= relicTier);
}

function getCharactersBaseIdByFaction(faction) {
    const characterDataResponse = UrlFetchApp.fetch('https://swgoh.gg/api/characters', {
        method: 'get',
        muteHttpExceptions: false
    });
    const json = characterDataResponse.getContentText();
    const characterData = JSON.parse(json);
    return characterData.filter((character) => character.categories.some((categorie) => categorie == faction)).map((character) => character.base_id);
}

function getCharactersBaseIdByFactionAndAlignement(faction, alignment) {
    const characterDataResponse = UrlFetchApp.fetch('https://swgoh.gg/api/characters', {
        method: 'get',
        muteHttpExceptions: false
    });
    const json = characterDataResponse.getContentText();
    const characterData = JSON.parse(json);
    return characterData
        .filter((character) => character.categories.includes(faction) && character.alignment === alignment)
        .map((character) => character.base_id);
}

