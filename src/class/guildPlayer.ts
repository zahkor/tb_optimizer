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
