import {
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
} from '@mui/material';

import { useGetHackathonTeamsQuery, useGetMilestonesQuery } from '~/api/api';
import { commonStyles } from '~/components/commonStyles';
import { UserRole } from '~/enums/UserRole';
import { useAppSelector } from '~/hooks';
import { selectUserRole } from '~/slices/authSlice';

interface PlayerSelectProps {
  disableSelect?: boolean;
  hackathonId: string;
  isOptional?: boolean;
  playerName: string;
  playerNumber: number;
  setPlayerName: (name: string) => void;
}

const PlayerSelect = ({
  disableSelect,
  hackathonId,
  isOptional,
  playerName,
  playerNumber,
  setPlayerName,
}: PlayerSelectProps) => {
  const { data: milestoneBots } = useGetMilestonesQuery();
  const { data: teams } = useGetHackathonTeamsQuery(hackathonId);
  const isAdminRole = useAppSelector(selectUserRole) === UserRole.ADMIN;
  const showTeams = isAdminRole || disableSelect;

  return (
    <FormControl
      fullWidth
      required={!isOptional}
      sx={commonStyles.spacingStyle}
    >
      <InputLabel id={`player-${playerNumber}-select-label`}>
        {`Select player ${playerNumber}`}
      </InputLabel>

      <Select
        data-testid={`player-${playerNumber}`}
        disabled={disableSelect}
        id={`player-${playerNumber}`}
        label={`Select player ${playerNumber}`}
        labelId={`player-${playerNumber}-select-label`}
        value={playerName}
        onChange={(event) => setPlayerName(event.target.value)}
      >
        {isOptional && (
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
        )}

        {/* Rendering the ListSubheader and MenuItem elements separately avoids the "Fragment as child" error: */}
        {showTeams && <ListSubheader>Teams</ListSubheader>}

        {showTeams &&
          teams?.map((bot) => (
            <MenuItem key={bot.id} value={bot.name}>
              {bot.name}
            </MenuItem>
          ))}

        <ListSubheader>Milestones</ListSubheader>
        {milestoneBots?.map((bot) => (
          <MenuItem key={bot.id} value={bot.milestoneClassName}>
            {bot.readableMilestoneClassName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default PlayerSelect;
