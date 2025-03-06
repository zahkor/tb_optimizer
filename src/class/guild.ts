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
