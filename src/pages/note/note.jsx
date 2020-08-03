import React from "react";
import Taro from "@tarojs/taro";
import { Button, Form, Input, View } from "@tarojs/components";
import classNames from "classnames";
import { AtIcon } from "taro-ui";
import { noteService } from "../../services/noteService";
import NoteEditor from "./component/note-editor";
import "./note.scss";

export default class Note extends React.Component {
  noteEditorRef = null;

  state = {
    note: {},
    isCreate: true,
    showSaveBtn: true,
  };

  componentDidMount() {
    const params = Taro.getCurrentInstance().router.params;
    if (!params) {
      return;
    }
    if (typeof params.id === "string") {
      Taro.showLoading({ title: "加载中" });
      this.setState({ isCreate: false });
      noteService
        .fetchNote(params.id)
        .then(({ note }) => {
          this.setState({ note: note });
          Taro.hideLoading();
        })
        .catch(() => {
          Taro.hideLoading();
        });
    } else {
      this.setState({ isCreate: true });
    }
  }

  async saveNote(e) {
    let content = "";
    let text = "";
    await this.noteEditorRef.current.getContents().then((editorContent) => {
      content = editorContent.html;
      text = editorContent.text;
    });
    const title = e.detail.value.title;

    if (this.state.isCreate) {
      this.createNote({ title, content, text });
    } else if (this.state.note) {
      const updatedNote = {
        id: this.state.note.id,
        content,
        title,
        text,
      };
      this.updateNote(updatedNote);
    }
  }

  createNote({ title, content, text }) {
    if (!content && !title) {
      return;
    }
    noteService.createNote({ title, content, text }).then(() => {
      Taro.navigateBack();
    });
  }

  updateNote(note) {
    const { title, content } = note;
    if (!content && !title) {
      return;
    }
    noteService.updateNote(note).then(() => {
      Taro.navigateBack();
    });
  }

  render() {
    const { showSaveBtn, note } = this.state;
    this.noteEditorRef = React.createRef();

    return (
      <View class="container">
        <Form
          id="form"
          class="note-form"
          onSubmit={(e) => {
            this.saveNote(e);
          }}
        >
          <View class="note-cells">
            <View class="note-input-cell">
              <Input
                name="title"
                class="note-input"
                maxlength="50"
                data-field="title"
                value={note.title}
                onChange={(event) => {
                  this.setState({
                    note: { ...note, title: event.target.value },
                  });
                }}
                placeholder="标题"
              />
            </View>
            <View class="note-editor-cell">
              <NoteEditor
                ref={this.noteEditorRef}
                name="content"
                class="note-editor"
                defaultValue={note.content}
              ></NoteEditor>
            </View>
          </View>
          <View class="button-container">
            <Button
              formType="submit"
              className={classNames({ "save-btn": true, show: showSaveBtn })}
              size="mini"
            >
              <AtIcon value="check" color="#fff" size="26"></AtIcon>
            </Button>
          </View>
        </Form>
      </View>
    );
  }
}
