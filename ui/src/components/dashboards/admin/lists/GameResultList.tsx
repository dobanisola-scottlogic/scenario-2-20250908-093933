import { useState } from 'react';

import AddButton from '~/components/common/AddButton';
import { CommonContainer } from '~/components/common/CommonContainer';
import CreateGame from '~/components/popups/CreateGame';
import GameResultListTable from '~/components/tables/GameResultListTable';
import { ContainerRole } from '~/enums/ContainerRole';

interface GameResultListProps {
  hackathonId: string;
}

const GameResultList = ({ hackathonId }: GameResultListProps) => {
  const [isAddGameOpen, setIsAddGameOpen] = useState(false);
  const handleAddGameOpen = () => setIsAddGameOpen(true);

  return (
    <>
      <CommonContainer containerRole={ContainerRole.LIST}>
        <AddButton onClick={handleAddGameOpen} text='Add a new game' />
        <CreateGame
          isOpen={isAddGameOpen}
          hackathonId={hackathonId}
          setIsOpen={setIsAddGameOpen}
        />
        <GameResultListTable hackathonId={hackathonId} />
      </CommonContainer>
    </>
  );
};

export default GameResultList;
