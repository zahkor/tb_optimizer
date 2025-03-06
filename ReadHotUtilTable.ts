function onOpen() {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('Update Database').addItem('Reimport data from SWGOH.GG', 'menuItem1').addToUi();
}

async function menuItem1() {
    let playerRequests: any[] = [];
    let playerRequestsResponse: any[] = [];
    let guildData: { players: GuildPlayer[] } = { players: [] };

    let guildInitialResponse;
    let guildInitial: Guild | undefined = undefined;

    const spreadSheet = SpreadsheetApp.getActive(); //Open Google Sheet
    const report = spreadSheet.getSheetByName('Guild');
    if (!report) {
        return;
    }
    const swgohURL = report.getRange(2, 1).getValue().replace('https://swgoh.gg/g/', '');

    guildInitial = getGuildFromUrl(swgohURL);

    if (guildInitial == undefined) {
        SpreadsheetApp.getUi().alert('Unable to get guild data from swgoh.gg');
        return 0;
    }

    const guildName = guildInitial.data.name;
    report.getRange(4, 3).setValue(guildName);
    report.getRange(5, 3).setValue(new Date());

    //FETCH GUILD MEMBES
    for (const member of guildInitial.data.members) {
        if (member.ally_code) playerRequests.push({ url: 'http://swgoh.gg/api/player/' + member.ally_code, method: 'get' });
    }

    playerRequestsResponse = UrlFetchApp.fetchAll(playerRequests);
    for (const response of playerRequestsResponse) {
        guildData.players.push(await JSON.parse(response));
    }

    //ATTRIBUTION
    updateGeoSheet(guildData, spreadSheet);
    updateRoTESHeet(guildData, spreadSheet);
}

function updateRoTESHeet(guildData: { players: GuildPlayer[] }, speadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet) {
    const RoTETBSheet = speadsheet.getSheetByName('RotE TB');

    const guildCharactersGP = guildData.players.reduce((count, player) => count + player.data.character_galactic_power, 0);
    const guildCharactersGPAsMillions = Math.round((guildCharactersGP / 1000000) * 10) / 10;
    const guildShipsGP = guildData.players.reduce((count, player) => count + player.data.ship_galactic_power, 0);
    const guildShipsGPAsMillions = Math.round((guildShipsGP / 1000000) * 10) / 10;
    let totalCharacterGPOverRelic5: number = 0;
    let totalCharacterCountOverRelic5: number = 0;
    guildData.players.forEach((player) => {
        const [playerCharacterGp, playerUnitCountOverRelic5] = averageCharacterGPOverRelic5(player);
        totalCharacterGPOverRelic5 += playerCharacterGp;
        totalCharacterCountOverRelic5 += playerUnitCountOverRelic5;
    });
    RoTETBSheet?.getRange(4, 2).setValue(guildData.players.length);
    RoTETBSheet?.getRange(5, 2).setValue(guildCharactersGPAsMillions + guildShipsGPAsMillions);
    RoTETBSheet?.getRange(13, 2).setValue(totalCharacterGPOverRelic5 / totalCharacterCountOverRelic5);
}

function averageCharacterGPOverRelic5(player: GuildPlayer) {
    let unitsOverRelic5 = player.units.filter((unit) => unit.data?.relicTier && unit.data?.relicTier >= 5);
    const totalGpOverRelic5 = unitsOverRelic5.reduce((count, unit) => count + unit.data.power, 0);
    return [totalGpOverRelic5, unitsOverRelic5.length];
}
function updateGeoSheet(guildData: { players: GuildPlayer[] }, speadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet) {
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

    const geoTBSheet = speadsheet.getSheetByName('DS GEO TB');
    if (!geoTBSheet) {
        return;
    }
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

function getGuildFromUrl(swgohURL: string): Guild | undefined {
    const guildInitialResponse = UrlFetchApp.fetch('http://swgoh.gg/api/guild-profile/' + swgohURL);

    if (guildInitialResponse.getResponseCode() >= 200 && guildInitialResponse.getResponseCode() <= 299) {
        const json = guildInitialResponse.getContentText();
        return JSON.parse(json);
    } else {
        Logger.log('Response code not between 200 and 299 - Guild');
    }
}

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

class Guild {
    data: GuildData = new GuildData();

    constructor(init?: Partial<Guild>) {
        Object.assign(this, init);
    }
}

class GuildData {
    guild_id!: string;
    name!: string;
    external_message!: string;
    banner_color_id!: string;
    banner_logo_id!: string;
    enrollment_status!: number;
    galactic_power!: number;
    guild_type!: string | null;
    level_requirement!: number;
    member_count!: number;
    members!: GuildMember[];
    avg_galactic_power!: number;
    avg_arena_rank!: number;
    avg_fleet_arena_rank!: number;
    avg_skill_rating!: number;
    last_sync!: string;

    constructor(init?: Partial<GuildData>) {
        Object.assign(this, init);
    }
}

class GuildMember {
    galactic_power!: number;
    guild_join_time!: string;
    lifetime_season_score!: number;
    member_level!: number;
    ally_code!: number;
    player_level!: number;
    player_name!: string;
    league_id!: string;
    league_name!: string | null;
    league_frame_image!: string | null;
    portrait_image!: string;
    title!: string;
    squad_power!: number;

    constructor(init?: Partial<GuildMember>) {
        Object.assign(this, init);
    }
}

class GuildPlayer {
    data: PlayerProfile = new PlayerProfile();
    units: Unit[] = [];

    constructor(init?: Partial<GuildPlayer>) {
        Object.assign(this, init);
    }
}

class PlayerProfile {
    allyCode!: number;
    arenaLeaderBaseId!: string;
    arenaRank!: number;
    level!: number;
    name!: string;
    lastUpdated!: string;
    galacticPower!: number;
    character_galactic_power!: number;
    ship_galactic_power!: number;
    shipBattlesWon!: number;
    pvpBattlesWon!: number;
    pveBattlesWon!: number;
    pveHardWon!: number;
    galacticWarWon!: number;
    guildRaidWon!: number;
    guildContribution!: number;
    guildExchangeDonations!: number;
    seasonFullClears!: number;
    seasonSuccessfulDefends!: number;
    seasonLeagueScore!: number;
    seasonUndersizedSquadWins!: number;
    seasonPromotionsEarned!: number;
    seasonBannersEarned!: number;
    seasonOffensiveBattlesWon!: number;
    seasonTerritoriesDefeated!: number;
    url!: string;
    arena!: Arena;
    fleetArena!: FleetArena;
    skillRating!: number;
    leagueName!: string;
    leagueFrameImage!: string;
    leagueBlankImage!: string;
    leagueImage!: string;
    divisionNumber!: number;
    divisionImage!: string;
    portraitImage!: string;
    title!: string;
    guildId!: string;
    guildName!: string;
    guildUrl!: string;
    mods!: any[];
    units!: Unit[];

    constructor(init?: Partial<PlayerProfile>) {
        Object.assign(this, init);
    }
}

class Arena {
    rank!: number;
    leader!: string;
    members!: string[];

    constructor(init?: Partial<Arena>) {
        Object.assign(this, init);
    }
}

class FleetArena {
    rank!: number;
    leader!: string;
    members!: string[];
    reinforcements!: string[];

    constructor(init?: Partial<FleetArena>) {
        Object.assign(this, init);
    }
}

class Unit {
    data!: UnitData;

    constructor(init?: Partial<Unit>) {
        Object.assign(this, init);
    }
}

class UnitData {
    base_id!: string;
    name!: string;
    gearLevel!: number;
    level!: number;
    power!: number;
    rarity!: number;
    gear!: GearItem[];
    url!: string;
    stats!: Record<string, number | null>;
    statDiffs!: Record<string, number | null>;
    zetaAbilities!: string[];
    omicronAbilities!: string[];
    abilityData!: Ability[];
    modSetIds!: number[];
    combatType!: number;
    relicTier!: number | null;
    hasUltimate!: boolean;
    isGalacticLegend!: boolean;

    constructor(init?: Partial<UnitData>) {
        Object.assign(this, init);
    }
}

class GearItem {
    slot!: number;
    isObtained!: boolean;
    baseId!: string;

    constructor(init?: Partial<GearItem>) {
        Object.assign(this, init);
    }
}

class Ability {
    id!: string;
    abilityTier!: number;
    isOmega!: boolean;
    isZeta!: boolean;
    isOmicron!: boolean;
    hasOmicronLearned!: boolean;
    hasZetaLearned!: boolean;
    name!: string;
    tierMax!: number;

    constructor(init?: Partial<Ability>) {
        Object.assign(this, init);
    }
}

