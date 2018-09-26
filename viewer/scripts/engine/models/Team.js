class Team {
    constructor(teamId, teamName, colour) {
        this.teamId = teamId;
        this.teamName = teamName;
        this.colour = colour;
    }
    getTeamName() {
        return this.teamName;
    }
    getTeamColour() {
        return this.colour;
    }
}

module.exports = Team;
