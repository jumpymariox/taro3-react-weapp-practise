import Taro from "@tarojs/taro";
import React, { useState } from "react";
import { View } from "@tarojs/components";
import pickBy from "lodash.pickby";
import keys from "lodash.keys";
import Note from "../note/note";
import "./note-list.scss";

export default function NoteList({
  notes,
  editing,
  _readyToEditNotes,
  _selectedNotesChange,
}) {
  const [selectedNoteMap, setSelectedNoteMap] = useState({});

  const redirectToNotePage = (noteId) => {
    Taro.navigateTo({ url: `/pages/note/note?id=${noteId}` });
  };
  const readyToEditNotes = () => {
    if (editing) {
      return;
    }
    _readyToEditNotes();
  };
  const selectNode = (e) => {
    const { id, selected } = e;
    setSelectedNoteMap({
      ...selectedNoteMap,
      [id]: selected,
    });

    const selectedNoteIds = keys(pickBy(selectedNoteMap, (value) => !!value));
    _selectedNotesChange({
      selectedNoteIds: selectedNoteIds,
    });
  };

  const noteEls = notes.map((note) => (
    <Note
      key={note.id}
      id={note.id}
      note={note}
      editing={editing}
      selected={!!selectedNoteMap[note.id]}
      _click={() => {
        redirectToNotePage(note.id);
      }}
      _longPress={readyToEditNotes}
      _selectNote={(e) => {
        selectNode(e);
      }}
    ></Note>
  ));
  return <View class="note-list">{noteEls}</View>;
}
