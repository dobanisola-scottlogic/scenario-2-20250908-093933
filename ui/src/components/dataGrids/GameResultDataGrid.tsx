import { GridRenderCellParams } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import { useGetHackathonGamesQuery } from '~/api/api';
import ListDataGrid from '~/components/common/ListDataGrid';
import { GameResult } from '~/interfaces/GameResult';
import { hackathonGameRoute } from '~/routing/Routes';
import { getGameTimeString } from '~/utils/game-utils';

interface GameResultListTableProps {
  customHeight?: number;
  hackathonId: string;
  openLinksInNewTab?: boolean;
  teamName?: string;
}

interface GameResultRowType {
  id: string;
  teams: string;
  link: string;
  mapName: string;
  startTime: string;
}

const GameResultDataGrid = ({
  customHeight,
  hackathonId,
  openLinksInNewTab,
  teamName,
}: GameResultListTableProps) => {
  const {
    data: gameResults,
    isLoading,
    isError,
  } = useGetHackathonGamesQuery(hackathonId);

  const getGamesByTeam = () =>
    gameResults?.filter((gameResult: GameResult) =>
      gameResult.game.teams.some((team) => team.teamName === teamName)
    );
  const games = teamName ? getGamesByTeam() : gameResults;

  const targetAndRelAttributes = openLinksInNewTab
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  const columns = [
    { field: 'id', headerName: 'ID' },
    {
      field: 'teams',
      headerName: 'Teams',
      width: 600,
      renderCell: (params: GridRenderCellParams<GameResultRowType>) => (
        <Link to={params.row.link} {...targetAndRelAttributes}>
          {params.row.teams}
        </Link>
      ),
      type: 'string',
    },
    { field: 'mapName', headerName: 'Map', width: 200 },
    { field: 'startTime', headerName: 'Start Time', width: 200 },
  ];

  const tableRows = games?.map((row: GameResult) => {
    const gameViewerLink = hackathonGameRoute(row.game.hackathonId, row.id);

    return {
      id: row.id,
      teams: row.game.title ?? '',
      link: gameViewerLink,
      mapName: row?.game?.map?.name,
      startTime: getGameTimeString(row?.game?.gameTime),
    };
  });

  return (
    <ListDataGrid<GameResultRowType>
      customHeight={customHeight}
      dataType='games'
      columns={columns}
      rows={tableRows}
      isError={isError}
      isLoading={isLoading}
    />
  );
};

export default GameResultDataGrid;
