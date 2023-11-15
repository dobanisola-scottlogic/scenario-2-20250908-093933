import { useState } from 'react';

import KebabMenu from '~/components/common/KebabMenu';
import CreateUpdateTeam from '~/components/popups/CreateUpdateTeam';
import DeleteTeam from '~/components/popups/DeleteTeam';

interface TeamMenuProps {
  hackathonId: string;
  selectedTeamId: string;
}

const TeamMenu = ({ hackathonId, selectedTeamId }: TeamMenuProps) => {
  const [isDeleteTeamOpen, setIsDeleteTeamOpen] = useState(false);
  const [isEditTeamOpen, setIsEditTeamOpen] = useState(false);

  const handleIsDeleteTeamOpen = () => {
    setIsDeleteTeamOpen(true);
  };

  const handleIsEditTeamOpen = () => {
    setIsEditTeamOpen(true);
  };

  const kebabMenuOptions = [
    { name: 'Edit...', onClick: handleIsEditTeamOpen },
    { name: 'Delete...', onClick: handleIsDeleteTeamOpen },
  ];

  return (
    <>
      <KebabMenu options={kebabMenuOptions} />
      <CreateUpdateTeam
        isOpen={isEditTeamOpen}
        hackathonId={hackathonId}
        id={selectedTeamId}
        setIsOpen={setIsEditTeamOpen}
      />
      <DeleteTeam
        isOpen={isDeleteTeamOpen}
        id={selectedTeamId}
        setIsOpen={setIsDeleteTeamOpen}
      />
    </>
  );
};

export default TeamMenu;
