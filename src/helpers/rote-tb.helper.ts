function averageCharacterGPOverRelic5(player: GuildPlayer) {
    let unitsOverRelic5 = player.units.filter((unit) => unit.data?.relicTier && unit.data?.relicTier >= 5);
    const totalGpOverRelic5 = unitsOverRelic5.reduce((count, unit) => count + unit.data.power, 0);
    return [totalGpOverRelic5, unitsOverRelic5.length];
}

