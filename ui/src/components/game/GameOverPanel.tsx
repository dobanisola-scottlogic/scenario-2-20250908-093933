import { Chip } from '@mui/material';
import { viewerStyles } from '~/components/commonStyles';
import { GameEndState } from '~/components/game/GameEndState';

interface GameOverPanelProps {
  gameEndState?: GameEndState;
  width: number;
}

const GameOverPanel = ({ gameEndState, width }: GameOverPanelProps) => {
  return (
    <div
      style={{
        color: '#ffffff',
        fontSize: '1.25rem',
        position: 'absolute',
        textAlign: 'center',
        marginTop: 200,
        width: width,
      }}
    >
      {gameEndState && (
        <div
          style={{
            backgroundColor: 'rgba(102, 102, 102, 0.88)',
            padding: 20,
            textAlign: 'center',
          }}
        >
          <h1>Game Over</h1>
          <h2>{gameEndState.result}</h2>
          <p>{gameEndState.gameOverReason}</p>
          <table
            style={{ margin: '0 auto', tableLayout: 'fixed', width: '66%' }}
          >
            <tbody>
              {gameEndState.teamStats
                .sort(
                  (a, b) => b.playersRemainingCount - a.playersRemainingCount
                )
                .map((teamStat, index) => (
                  <tr key={index}>
                    <td style={{ textAlign: 'right', width: '50%' }}>
                      <Chip
                        label={teamStat.teamName}
                        sx={{
                          ...viewerStyles.chipStyles,
                          backgroundColor: teamStat.teamColour,
                          marginRight: 1,
                        }}
                      />
                    </td>
                    <td style={{ textAlign: 'left', width: '50%' }}>
                      {teamStat.disqualificationReason
                        ? `Disqualified: ${teamStat.disqualificationReason}`
                        : `Players remaining ${teamStat.playersRemainingCount}`}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GameOverPanel;
