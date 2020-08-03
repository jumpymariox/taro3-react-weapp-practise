export default {
  pages: ["pages/index/index", "pages/note/note"],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
  tabBar: {
    color: "#000",
    selectedColor: "#03dac5",
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
        iconPath: "./assets/img/note.png",
        selectedIconPath: "./assets/img/note_active.png",
      },
      {
        pagePath: "pages/index/index",
        text: "个人",
        iconPath: "./assets/img/user.png",
        selectedIconPath: "./assets/img/user_active.png",
      },
    ],
  },
};
