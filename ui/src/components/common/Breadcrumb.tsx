import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import { Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { BreadcrumbLevel } from '~/enums/BreadcrumbLevel';
import { UserRole } from '~/enums/UserRole';
import { useAppSelector } from '~/hooks';
import { Hackathon } from '~/interfaces/Hackathon';
import { baseRoute, hackathonRoute } from '~/routing/Routes';
import { selectUserRole } from '~/slices/authSlice';

interface BreadcrumbProps {
  breadcrumbLevel: BreadcrumbLevel | undefined;
  gameTitle?: string;
  hackathon: Hackathon | undefined;
}

const Breadcrumb = ({
  breadcrumbLevel,
  gameTitle,
  hackathon,
}: BreadcrumbProps) => {
  const isAdminRole = useAppSelector(selectUserRole) === UserRole.ADMIN;

  const homeLink = (homeText: string) => <Link to={baseRoute}>{homeText}</Link>;
  const hackathonDetails = hackathon && (
    <span data-testid='hackathonBreadcrumb'>
      <strong>{hackathon?.name}</strong> (<strong>Current Milestone: </strong>
      {`Map: ${hackathon?.currentMilestoneMap} - Bot: ${hackathon?.readableCurrentMilestoneClassName}`}
      )
    </span>
  );
  const currentGame = <span data-testid='gameBreadcrumb'>{gameTitle}</span>;

  const adminUserBreadcrumb = () => {
    return (
      <>
        {homeLink('Hackathons')}
        {hackathon && (
          <>
            <KeyboardArrowRight />
            {breadcrumbLevel === BreadcrumbLevel.HACKATHON ? (
              hackathonDetails
            ) : (
              <>
                <Link to={hackathonRoute(hackathon.id)}>
                  {hackathonDetails}
                </Link>
                <KeyboardArrowRight />
                {currentGame}
              </>
            )}
          </>
        )}
      </>
    );
  };

  const teamUserBreadcrumb = () => {
    return (
      <>
        {homeLink('Hackathon')}
        {breadcrumbLevel === BreadcrumbLevel.GAME && (
          <>
            <KeyboardArrowRight />
            {currentGame}
          </>
        )}
      </>
    );
  };

  return (
    <>
      <Grid item xs={12}>
        <Typography
          sx={{
            display: 'inline-flex',
            fontWeight: 'normal',
          }}
        >
          {isAdminRole ? adminUserBreadcrumb() : teamUserBreadcrumb()}
        </Typography>
      </Grid>
    </>
  );
};

export default Breadcrumb;
