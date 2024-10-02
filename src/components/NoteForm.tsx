import { Box, Button, TextField } from "@mui/material";
import { Note } from "../App";
import { useEffect, useState } from "react";

interface NoteFormProps {
  addNote: (message: string, deadline: Date) => void;
  editingNote: Note | null;
  handleCloseModal: () => void;
}
const NoteForm: React.FC<NoteFormProps> = ({
  addNote,
  editingNote,
  handleCloseModal,
}: NoteFormProps) => {
  const [message, setMessage] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");

  useEffect(() => {
    if (editingNote) {
      setMessage(editingNote.message);
      setDeadline(editingNote.deadline.toISOString().slice(0, 10));
    } else {
      setMessage("");
      setDeadline("");
    }
  }, [editingNote]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || !deadline) return;
    addNote(message, new Date(deadline));
    setMessage("");
    setDeadline("");
    handleCloseModal();
  };
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        gap: "20px",
        margin: "20px 0",
        flexDirection: "column",
      }}
    >
      <Box sx={{ display: "flex", width: "100%", gap: "20px" }}>
        <TextField
          id="outlined-basic"
          label="note"
          variant="outlined"
          value={message}
          onChange={e => setMessage(e.target.value)}
          sx={{ width: "50%" }}
        />
        <TextField
          id="outlined-basic"
          label="deadline"
          variant="outlined"
          type="date"
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
          sx={{ width: "50%" }}
        />
      </Box>
      <Button type="submit" variant="contained">
        {editingNote ? "Update Note" : "Add Note"}
      </Button>
    </Box>
  );
};

export default NoteForm;
