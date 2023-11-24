import { Breakpoint, Container } from '@mui/material';
import { ContainerRole } from '~/enums/ContainerRole';

interface CommonContainerProps {
  children: React.ReactNode;
  containerRole: ContainerRole;
}

export const CommonContainer = ({
  children,
  containerRole,
}: CommonContainerProps) => {
  let containerSx;
  let maxWidth: Breakpoint | boolean = false;
  switch (containerRole) {
    case ContainerRole.DASHBOARD:
      containerSx = { px: 5, py: 5 }; // Adds 40px padding
      break;
    case ContainerRole.LIST:
      containerSx = { px: 1.25, py: 1.25 }; // Adds 10px padding
      break;
    case ContainerRole.LOGIN:
      containerSx = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '90vh',
      };
      maxWidth = 'xs';
      break;
    default:
      containerSx = { px: 1, py: 1 }; // Adds 8px padding
      break;
  }

  return (
    <Container disableGutters maxWidth={maxWidth} sx={containerSx}>
      {children}
    </Container>
  );
};
