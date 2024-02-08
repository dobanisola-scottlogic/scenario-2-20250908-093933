import { Alert } from '@mui/material';
import { useEffect, useState } from 'react';
import { commonStyles } from '~/components/commonStyles';
import { GameEndState } from '~/components/game/GameEndState';
import GameOverPanel from '~/components/game/GameOverPanel';
import { HackathonPhaserGame } from '~/components/game/HackathonPhaserGame';
import { ParsedGameResult } from '~/components/game/ParsedGameResult';
import { ParsedGameState } from '~/components/game/ParsedGameState';
import { Cell } from '~/interfaces/Cell';
import { GameResult } from '~/interfaces/GameResult';

interface GamePlaybackProps {
  gameResult: GameResult;
  height: number;
  width: number;
  setGameState: React.Dispatch<
    React.SetStateAction<ParsedGameState | undefined>
  >;
}

const gameElementId = 'phaser-game';

// Declare game variable outside of the component to ensure it is rendered once:
let game: HackathonPhaserGame | null = null;

const GamePlayback = ({
  gameResult,
  height,
  width,
  setGameState,
}: GamePlaybackProps) => {
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [gameEndState, setGameEndState] = useState<GameEndState>();

  useEffect(() => {
    // Only create a new game if one doesn't already exist:
    if (!game) {
      try {
        const gameData: ParsedGameResult = ParsedGameResult.parse(gameResult);

        game = new HackathonPhaserGame(
          gameData,
          gameElementId,
          setGameState,
          setGameEndState
        );
      } catch (error) {
        setFormError(`Error creating game: ${error as string}`);
      }
    }
  }, [gameResult, setGameState]);

  return (
    <div>
      {formError && (
        <Alert severity='error' sx={commonStyles.alertStyle}>
          {formError}
        </Alert>
      )}

      <div
        id={gameElementId}
        style={{
          height: height * Cell.CellHeight,
          width: width * Cell.CellWidth,
          margin: '0 auto',
        }}
      >
        <GameOverPanel
          gameEndState={gameEndState}
          width={width * Cell.CellWidth}
        />
      </div>
    </div>
  );
};

export default GamePlayback;
