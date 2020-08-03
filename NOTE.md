# 学习总结

## 消失的Page
在原生微信小程序和小程序框架wepy中，页面有单独的类Page（继承自Component），Page比Component多出专属于页面逻辑的配置和页面事件，当也因此增加了web开发人员的上手难度，需要花费一些时间消化Page这一概念。
在Taro-react中，Page不复存在，所有的页面一致继承React.Component。
当然，这样的页面Component依然可以进行页面配置和适应页面事件，但Taro讲Page与Component的差异隐藏掉了，减少web react开发人员上手时与react的差异感，但也容易使不熟悉原生小程序的开发人员踩坑，毕竟他们不知道，页面Component和组件Component其实依然不同。

## 消息机制
Taro提供了的消息机制支持，其实就是event hub，可以实例化使用，可以使用全局event hub，支持简单应用足矣，但如果应用状态比较复杂，建议使用react hook或react redux；

## 全局全能的“Taro”
这不是准备赞美Taro的段落。
Taro中将所有的全局接口都封装在`Taro`这个全局实例上，这里包括了原生小程序中`wx`的所有接口，当然还提供了Taro额外支持的api；

## 支持hoc和react hook
与还在努力支持vue核心功能的wepy不同，taro-react支持的是完整版的react，这一点使得开发体验非常接近web react开发。

## 如何迁移
官方文档提供了cli指令将原生小程序项目迁移到Taro（明确表示不支持从wepy迁移），但不是一键迁移，文档也备注了如何一些手动修改的工作如何进行；
当我没有使用官网的迁移指令，而是自己手动迁移，因为我迁移的项目就是一个原wepy项目；
不过事实证明并不特别困难，迁移过程的工作如下：
- 替换所有`wx`为`Taro`，直接替换即可功能，无任何问题；
- 替换react语法，主要是vue语法转react语法，包括参数和事件（Taro统一了事件，catchtap事件并不支持）；
- 替换template原生组件标签，wepy支持常用的html标签并能只能转化为微信小程序标签，taro不支持，且taro将所有微信小程序的原生标签都做了封装，所以需要`<view> -> <View>`，这是一项很烦人的工作;
- 渲染组件时，wepy生成的会生成自定义组件标签，而taro不会，造成html结构差异需要处理，例如：
```$xslt
// wepy note.js
<template>
    <text>这是一个wepy的note组件</text>
</template>
// 渲染出来是这样
<note>
    <text>这是一个wepy的note组件</text>
</note>
```
```$xslt
// wepy note.js
export default function note(){
    return (<text>这是一个taro的note组件</text>)
}
// 渲染出来是这样，没有了<note></note>
<text>这是一个wepy的note组件</text>
```
- 
## 结论
非常成熟的小程序框架，考虑到它对多平台小程序的支持，和完全支持react的开发体验，个人认为是比wepy更加值得使用的框架；

