import { Container } from '@mui/material';
import { useState } from 'react';

import AddButton from '~/components/common/AddButton';
import CreateUpdateTeam from '~/components/popups/CreateUpdateTeam';
import TeamListTable from '~/components/tables/TeamListTable';

interface TeamListProps {
  hackathonId: string;
}

const TeamList = ({ hackathonId }: TeamListProps) => {
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);
  const handleAddTeamOpen = () => setIsAddTeamOpen(true);

  return (
    <>
      <Container maxWidth={false} style={{ padding: '10px 0' }}>
        <AddButton onClick={handleAddTeamOpen} text='Add a new team' />
        <CreateUpdateTeam
          isOpen={isAddTeamOpen}
          hackathonId={hackathonId}
          setIsOpen={setIsAddTeamOpen}
        />
        <TeamListTable hackathonId={hackathonId} />
      </Container>
    </>
  );
};

export default TeamList;
