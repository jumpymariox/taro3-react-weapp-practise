import React, { useEffect, useImperativeHandle, useReducer } from "react";
import Taro from "@tarojs/taro";
import { Editor, View } from "@tarojs/components";
import classNames from "classnames";
import { AtIcon } from "taro-ui";
import "./note-editor.scss";

const NoteEditor = React.forwardRef(
  (
    { defaultValue, placeholder } = {
      defaultValue: "",
      placeholder: "开始笔记",
    },
    ref
  ) => {
    const initialState = {
      keyboardHeight: 0,
      isIOS: false,
      usingKeyboard: false,
      focusing: false,
      editorCtx: null,
      formats: {},
      test: false,
    };
    const reducer = (state, { type, payload }) => {
      switch (type) {
        case "setKeyboardHeight":
          return { ...state, keyboardHeight: payload.keyboardHeight };
        case "setIsIOS":
          return { ...state, isIOS: payload.isIOS };
        case "setUsingKeyboard":
          return { ...state, usingKeyboard: payload.usingKeyboard };
        case "setFocusing":
          return { ...state, focusing: payload.focusing };
        case "setEditorCtx":
          return { ...state, editorCtx: payload.editorCtx };
        case "setFormats":
          return { ...state, formats: payload.formats };
        case "setTest":
          return { ...state, test: payload.test };
      }
    };
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
      let keyboardHeight = 0;
      Taro.onKeyboardHeightChange((res) => {
        if (res.height === keyboardHeight) return;
        dispatch({
          type: "setKeyboardHeight",
          payload: { keyboardHeight: res.height },
        });

        const duration = res.height > 0 ? res.duration * 1000 : 0;
        setTimeout(() => {
          Taro.pageScrollTo({
            scrollTop: 0,
            success() {
              state.editorCtx.scrollIntoView();
            },
          });
        }, duration);
      });
    });
    useEffect(() => {
      setDefaultValue(defaultValue);
    }, [state.editorCtx]);

    useImperativeHandle(ref, () => ({
      insertDivider: () => {
        state.editorCtx.insertDivider({
          success: function () {
            console.log("insert divider success");
          },
        });
      },
      clear: () => {
        state.editorCtx.clear({
          success: function () {
            console.log("clear success");
          },
        });
      },
      removeFormat: () => {
        state.editorCtx.removeFormat();
      },
      insertDate: () => {
        const date = new Date();
        const formatDate = `${date.getFullYear()}/${
          date.getMonth() + 1
        }/${date.getDate()}`;
        state.editorCtx.insertText({
          text: formatDate,
        });
      },
      getContents: () => {
        return new Promise((resolve) => {
          state.editorCtx.getContents({
            success(editorContents) {
              resolve(editorContents);
            },
          });
        });
      },
    }));

    const onEditorReady = () => {
      Taro.createSelectorQuery()
        .select("#editor")
        .context((res) => {
          dispatch({
            type: "setEditorCtx",
            payload: { editorCtx: res.context },
          });
        })
        .exec();
    };
    const onStatusChange = (e) => {
      dispatch({ type: "setFormats", payload: { formats: e.detail } });
    };
    const focus = () => {
      dispatch({ type: "setFocusing", payload: { focusing: true } });
    };
    const blur = () => {
      dispatch({ type: "setFocusing", payload: { focusing: false } });
    };
    const format = ({ name, value }) => {
      if (!state.editorCtx) return;
      state.editorCtx.format(name, value);
    };
    const insertImage = () => {
      Taro.chooseImage({
        count: 1,
        success: function (res) {
          state.editorCtx.insertImage({
            src: res.tempFilePaths[0],
            data: {
              id: "abcd",
              role: "god",
            },
            width: "80%",
            success: function () {
              console.log("insert image success");
            },
          });
        },
      });
    };
    const setDefaultValue = (value) => {
      if (!state.editorCtx) {
        return;
      }
      state.editorCtx.setContents({ html: value });
    };

    return (
      <>
        <View
          className={classNames({
            "editor-container": true,
            "has-tooltip": state.usingKeyboard,
          })}
        >
          <Editor
            id="editor"
            className="ql-container"
            placeholder={placeholder}
            onStatuschange={onStatusChange}
            onReady={onEditorReady}
            onFocus={focus}
            onBlur={blur}
          ></Editor>
        </View>
        <View
          className="toolbar"
          hidden={state.keyboardHeight <= 0}
          style={{ bottom: (state.isIOS ? state.keyboardHeight : 0) + "px" }}
        >
          <AtIcon value="image" onTouchEnd={insertImage}></AtIcon>
          <AtIcon
            value="blocked"
            className={classNames({
              "ql-active": state.formats.header === 2,
            })}
            onClick={() => {
              format({ name: "header", value: "2" });
            }}
          ></AtIcon>
          <AtIcon
            value="blocked"
            className={classNames({
              "ql-active": state.formats.header === 3,
            })}
            onClick={() => {
              format({ name: "header", value: "3" });
            }}
          ></AtIcon>
          <AtIcon
            value="star-2"
            className={classNames({
              "ql-active": state.formats.bold,
            })}
            onClick={() => {
              format({ name: "bold" });
            }}
          ></AtIcon>
          <AtIcon
            value="text-italic"
            className={classNames({
              "ql-active": state.formats.italic,
            })}
            onClick={() => {
              format({ name: "italic" });
            }}
          ></AtIcon>
          <AtIcon
            value="text-underline"
            className={classNames({
              "ql-active": state.formats.underline,
            })}
            onClick={() => {
              format({ name: "underline" });
            }}
          ></AtIcon>
          <AtIcon
            value="list"
            className={classNames({
              "ql-active": state.formats.list,
            })}
            onClick={() => {
              format({ name: "list" });
            }}
          ></AtIcon>
          <AtIcon
            value="numbered-list"
            className={classNames({
              "ql-active": state.formats.list === "ordered",
            })}
            onClick={() => {
              format({ name: "list", value: "ordered" });
            }}
          ></AtIcon>
        </View>
      </>
    );
  }
);

export default NoteEditor;
