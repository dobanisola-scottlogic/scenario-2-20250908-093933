import { InputAdornment, TextField } from '@mui/material';
import CopyToClipboardButton from './CopyToClipboardButton';

interface CopyTextFieldProps {
  label: string;
  value: string;
}

const CopyTextField = ({ label, value }: CopyTextFieldProps) => {
  return (
    <TextField
      margin='normal'
      fullWidth
      id={`copy-${label.replace(/[\s_]+/g, '-').toLowerCase()}`}
      label={label}
      aria-label={label}
      type='text'
      value={value}
      InputProps={{
        inputProps: {
          'data-testid': 'copy-text-input',
          readOnly: true,
        },
        endAdornment: (
          <InputAdornment position='end'>
            <CopyToClipboardButton text={value} />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default CopyTextField;
