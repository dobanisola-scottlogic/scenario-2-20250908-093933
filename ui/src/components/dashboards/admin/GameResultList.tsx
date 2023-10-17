import { Container } from '@mui/material';

import AddButton from '../../common/AddButton';
import SnackbarAlert from '../../common/SnackbarAlert';
import GameResultListTable from '../../tables/GameResultListTable';

interface GameResultListProps {
  hackathonId: string;
}

const GameResultList = ({ hackathonId }: GameResultListProps) => {
  return (
    <>
      <SnackbarAlert />

      <Container maxWidth={false} style={{ padding: '10px 0' }}>
        <AddButton
          onClick={() => {
            alert('Feature not yet implemented');
          }}
          text='Add a new game'
        />
        <GameResultListTable hackathonId={hackathonId} />
      </Container>
    </>
  );
};

export default GameResultList;
