import React, { useState } from "react";
import NoteForm from "./components/NoteForm";
import DraggableNote from "./components/DraggableNote";
import { AppBar, Box, Button, Modal, Toolbar, Typography } from "@mui/material";
import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "20px",
};

export interface Note {
  id: number;
  message: string;
  createdAt: Date;
  deadline: Date;
  color: string;
}

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingNote(null);
  };

  const addNote = (message: string, deadline: Date) => {
    if (editingNote) {
      updateNote(editingNote.id, message, deadline);
    } else {
      const newNote: Note = {
        id: Date.now(),
        message,
        createdAt: new Date(),
        deadline: new Date(deadline),
        color: "yellow",
      };
      setNotes([...notes, newNote]);
    }
  };

  const updateNote = (id: number, message: string, deadline: Date) => {
    const updatedNotes = notes.map(note =>
      note.id === id ? { ...note, message, deadline } : note
    );
    setNotes(updatedNotes);
    setEditingNote(null);
  };

  const deleteNote = (id: number) => {
    const filteredNotes = notes.filter(note => note.id !== id);
    setNotes(filteredNotes);
  };

  const editNote = (note: Note) => {
    setEditingNote(note);
  };

  const getNoteColor = (note: Note): string => {
    const now = new Date();
    if (now > new Date(note.deadline)) {
      return "#b2102f";
    }
    return "#ffea00";
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setNotes(items => {
        const oldIndex = items.findIndex(note => note.id === active.id);
        const newIndex = items.findIndex(note => note.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Wall Note
          </Typography>
          <Button
            variant="outlined"
            sx={{
              color: "white",
              borderColor: "white",
              "&:hover": {
                borderColor: "white",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
            onClick={handleOpenModal}
          >
            Add Note
          </Button>
        </Toolbar>
      </AppBar>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={notes} strategy={rectSortingStrategy}>
          <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <NoteForm
                addNote={addNote}
                editingNote={editingNote}
                handleCloseModal={handleCloseModal}
              />
            </Box>
          </Modal>
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginTop: "10px",
            }}
          >
            {notes.length === 0 ? (
              <Typography variant="h6" color="text.secondary">
                No notes available. Please add some.
              </Typography>
            ) : (
              notes.map((note, index) => (
                <DraggableNote
                  key={note.id}
                  note={{ ...note, color: getNoteColor(note) }}
                  index={index}
                  editNote={editNote}
                  deleteNote={deleteNote}
                  handleOpenModal={handleOpenModal}
                />
              ))
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default App;
