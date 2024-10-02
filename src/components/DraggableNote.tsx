import React from "react";
import { Note } from "../App";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  IconButton,
  Typography,
} from "@mui/material";

interface DraggableNoteProps {
  note: Note;
  index: number;
  editNote: (note: Note) => void;
  deleteNote: (id: number) => void;
  handleOpenModal: () => void;
}

const DraggableNote: React.FC<DraggableNoteProps> = ({
  note,
  editNote,
  deleteNote,
  handleOpenModal,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: note.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const getNoteStatus = (deadline: Date) => {
    const now = new Date();
    const differenceInTime = deadline.getTime() - now.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

    if (differenceInDays < 0) {
      return { status: "Expired", color: "red" };
    } else {
      return { status: `${differenceInDays} days left`, color: "yellow" };
    }
  };
  const { status, color } = getNoteStatus(note.deadline);
  return (
    <Card sx={{ minWidth: 345 }} ref={setNodeRef} style={style}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Chip label={status} sx={{ background: color }} />
          <Box
            {...listeners}
            {...attributes}
            sx={{ cursor: "grab", padding: "4px", borderRadius: "4px" }}
          >
            <Typography variant="body2" color="textSecondary">
              Drag Here
            </Typography>
          </Box>
          <Box>
            <IconButton
              onClick={event => {
                event.stopPropagation();
                editNote(note);
                handleOpenModal();
              }}
              draggable={false}
              color="primary"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={event => {
                event.stopPropagation();
                deleteNote(note.id);
              }}
              draggable={false}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
        <Typography variant="h6" sx={{ color: "black" }}>
          {note.message}
        </Typography>
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography>createdAt:</Typography>
        <Typography>{note.createdAt.toLocaleDateString()}</Typography>
      </CardActions>
      <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography>Deadline:</Typography>
        <Typography>{note.deadline.toLocaleDateString()}</Typography>
      </CardActions>
    </Card>
  );
};

export default DraggableNote;
