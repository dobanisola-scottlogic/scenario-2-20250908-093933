import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';

interface AddButtonProps {
  disabled?: boolean;
  onClick: () => void;
  text: string;
}

const AddButton = ({ disabled, onClick, text }: AddButtonProps) => (
  <Button
    disabled={disabled}
    variant='outlined'
    onClick={onClick}
    startIcon={<AddIcon />}
  >
    {text}
  </Button>
);

export default AddButton;
