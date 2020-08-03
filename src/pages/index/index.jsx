import Taro from "@tarojs/taro";
import React, { Component } from "react";
import { Button, ScrollView, View } from "@tarojs/components";
import { AtIcon } from "taro-ui";
import classNames from "classnames";
import NoteList from "./components/note-list/note-list";
import { noteService } from "../../services/noteService";
import "./index.scss";

export default class Index extends Component {
  state = {
    notes: [],
    showAddBtn: true,
    showUndoBtn: false,
    showDeleteBtn: false,
    editing: false,
  };

  componentDidShow() {
    this.fetchAndStoreNotes().then(() => {});
  }

  createNote() {
    Taro.navigateTo({ url: "/pages/note/note" });
  }
  readyToEditNotes() {
    this.setState({
      showAddBtn: false,
      showDeleteBtn: true,
      showUndoBtn: true,
      editing: true,
    });
  }
  cancelEditNotes() {
    this.setState({
      showAddBtn: true,
      showDeleteBtn: false,
      showUndoBtn: false,
      editing: false,
    });
  }
  deleteNotes() {
    this.cancelEditNotes();
    noteService.deleteNotes(this.state.selectedNoteIds).then(() => {
      this.fetchAndStoreNotes();
    });
  }
  selectedNotesChange = (e) => {
    this.setState({ selectedNoteIds: e.selectedNoteIds });
  };
  fetchAndStoreNotes = () => {
    Taro.showLoading({ title: "加载中" });
    return new Promise((resolve, reject) => {
      noteService
        .fetchNotes()
        .then(({ notes }) => {
          this.setState({ notes });
          Taro.hideLoading();
          resolve();
        })
        .catch(() => {
          Taro.hideLoading();
          Taro.showToast({
            title: "网络出小差了\\o(╯□╰)o/ ",
            duration: 5000,
            icon: "none",
          });
          reject();
        });
    });
  };

  render() {
    const {
      notes,
      showAddBtn,
      showUndoBtn,
      showDeleteBtn,
      editing,
    } = this.state;
    return (
      <View>
        <ScrollView scrollY style="height: 100%;">
          <NoteList
            notes={notes}
            editing={editing}
            _selectedNotesChange={(e) => {
              this.selectedNotesChange(e);
            }}
            _readyToEditNotes={() => {
              this.readyToEditNotes();
            }}
          ></NoteList>
        </ScrollView>

        <View className="button-container">
          <Button
            className={classNames({ "add-btn": true, show: showAddBtn })}
            size="mini"
            onClick={this.createNote}
          >
            <AtIcon value="add" color="#fff" size="26"></AtIcon>
          </Button>

          <Button
            className={classNames({ "undo-btn": true, show: showUndoBtn })}
            size="mini"
            onClick={() => {
              this.cancelEditNotes();
            }}
          >
            <AtIcon value="chevron-left" color="#fff" size="26"></AtIcon>
          </Button>

          <Button
            className={classNames({ "delete-btn": true, show: showDeleteBtn })}
            size="mini"
            onClick={() => {
              this.deleteNotes();
            }}
          >
            <AtIcon value="trash" color="#fff" size="26"></AtIcon>
          </Button>
        </View>
      </View>
    );
  }
}
