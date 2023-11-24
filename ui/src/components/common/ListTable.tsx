import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import { listTableStyles } from '~/components/commonStyles';
import { colours } from '~/theme';

interface ListTableProps {
  dataType: string;
  headerRows: string[];
  tableRows: JSX.Element[] | undefined;
  isError: boolean;
  isFixed?: boolean;
  isLoading: boolean;
  isNoData: boolean;
}

const ListTable = ({
  dataType,
  headerRows,
  tableRows,
  isError,
  isFixed,
  isLoading,
  isNoData,
}: ListTableProps) => {
  return (
    <Box
      sx={{
        background: 'white',
        // 10px border radius, margin and padding
        borderRadius: 2.5,
        my: 1.25,
        px: 1.25,
        py: 1.25,
      }}
    >
      <TableContainer sx={{ height: '60vh', overflowY: 'auto' }}>
        <Table
          aria-label={`List of ${dataType}`}
          size='small'
          stickyHeader
          style={{ tableLayout: isFixed ? 'fixed' : 'initial' }}
        >
          <TableHead>
            <TableRow>
              {headerRows.map((row) => (
                <TableCell key={row}>{row}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading || isError || isNoData ? (
              <TableRow sx={listTableStyles.rowStyles}>
                <TableCell align='center' colSpan={headerRows.length}>
                  <Box
                    sx={{
                      minHeight: '3rem',
                      mt: 5,
                    }}
                  >
                    {isLoading && <CircularProgress />}
                    {isError && (
                      <p style={{ color: colours.errorRed }}>
                        Failed to fetch {dataType}. Please try again later.
                      </p>
                    )}
                    {isNoData && <p>No {dataType} to display.</p>}
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              tableRows
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ListTable;
