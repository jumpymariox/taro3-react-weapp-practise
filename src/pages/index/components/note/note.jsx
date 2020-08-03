import React from "react";
import { Text, View } from "@tarojs/components";
import classNames from "classnames";
import { AtIcon } from "taro-ui";
import "./note.scss";

export default function Note({
  note,
  editing,
  selected,
  _click,
  _longPress,
  _selectNote,
}) {
  return (
    <View className="note" onClick={_click} onLongPress={_longPress}>
      <View
        className={classNames({
          "select-checkbox": true,
          show: editing,
          selected: selected,
        })}
        value={selected}
        onClick={(e) => {
          e.stopPropagation();
          _selectNote({
            id: note.id,
            selected: !selected,
          });
        }}
        hover-class="select-checkbox-hover"
      >
        <AtIcon
          className="delete-checkbox-mp-icon"
          value="check"
          color="#fff"
          size="18"
        ></AtIcon>
      </View>
      <View className="container">
        <Text className="title">{note.title}</Text>
        <Text className="text">{note.text}</Text>
      </View>
    </View>
  );
}
