import { TableRow } from '@mui/material';

import { useGetHackathonTeamsQuery } from '~/api/api';
import MenuTableCell from '~/components/common/MenuTableCell';
import TeamMenu from '~/components/menus/TeamMenu';
import { Team } from '~/interfaces/Team';
import ListTable from '../common/ListTable';
import { listTableStyles } from '../commonStyles';

interface TeamListTableProps {
  hackathonId: string;
}

const TeamListTable = ({ hackathonId }: TeamListTableProps) => {
  const {
    data: teams,
    isLoading,
    isError,
  } = useGetHackathonTeamsQuery(hackathonId);

  const tableRows = teams?.map((row: Team) => (
    <TableRow key={row.id} sx={listTableStyles.rowStyles}>
      <MenuTableCell
        text={row.name}
        menu={<TeamMenu hackathonId={hackathonId} selectedTeamId={row.id} />}
      />
    </TableRow>
  ));

  return (
    <ListTable
      dataType='teams'
      headerRows={['Name']}
      tableRows={tableRows}
      isError={isError}
      isLoading={isLoading}
      isNoData={teams?.length === 0}
    />
  );
};

export default TeamListTable;
