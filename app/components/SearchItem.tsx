import { ListItem, IconButton, ListItemText } from "@mui/material";
import { Undo } from "@mui/icons-material";
import moment from "moment";

const SearchItem = ({ task, onEdit }) => {
  const formattedDate = moment(task.id).format("YYYY-MM-DD HH:mm");
  return (
    <ListItem
      secondaryAction={
        <>
          <IconButton edge="end" color="info" onClick={() => onEdit(task.id)}>
            <Undo />
          </IconButton>
        </>
      }
    >
      <ListItemText primary={task.text} secondary={formattedDate} />
    </ListItem>
  );
};

export default SearchItem;

// “YYYY-MM-DD HH:mm