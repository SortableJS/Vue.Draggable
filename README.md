# Vue.Dragable.For


[![GitHub open issues](https://img.shields.io/github/issues/David-Desmaisons/Vue.Dragable.For.svg?maxAge=2592000)]()
[![GitHub closed issues](https://img.shields.io/github/issues-closed/David-Desmaisons/Vue.Dragable.For.svg?maxAge=2592000)]()
[![Npm download](https://img.shields.io/npm/dt/vuedragablefor.svg?maxAge=2592000)](https://www.npmjs.com/package/vuedragablefor)
[![Npm version](https://img.shields.io/npm/v/vuedragablefor.svg?maxAge=2592000)](https://www.npmjs.com/package/vuedragablefor)
[![Package Quality](http://npm.packagequality.com/shield/vuedragablefor.svg)](http://packagequality.com/#?package=vuedragablefor)
[![MIT License](https://img.shields.io/github/license/David-Desmaisons/Vue.Dragable.For.svg)](https://github.com/David-Desmaisons/Vue.Dragable.For/blob/master/LICENSE)


Vue directive for lists allowing drag-and-drop sorting in sync with View-Model. Based on [Sortable.js](https://github.com/RubaXa/Sortable)


##Motivation

Create a directive that displays a dragable list and keeps in sync the view and underlying view model.

##Demo

![demo gif](https://raw.githubusercontent.com/David-Desmaisons/Vue.Dragable.For/master/example.gif)

Simple:

https://jsfiddle.net/dede89/j62g58z7/

Two Lists:

https://jsfiddle.net/dede89/hqxranrd/

Example with list clone:

https://jsfiddle.net/dede89/u5ecgtsj/

##Features

* Full support of [Sortable.js](https://github.com/RubaXa/Sortable) options via options parameters
* Keeps in sync view model and view
* No jquery dependency

##Usage

Use it exactly as v-for directive, passing optional parameters using 'options' parameter.
Option parameter can be json string or a full javascript object.

  ``` html
  <div v-dragable-for="element in list1" options='{"group":"people"}'>
    <p>{{element.name}}</p>
  </div>
   ```
   
##Limitation

* This directive works only when applied to arrays and not to objects.
* `onStart`, `onUpdate`, `onAdd`, `onRemove` Sortable.js options hooks are used by v-dragable-for to update VM. As such these four options are not usable with v-dragable-for. If you need to listen to re-order events, you can watch the underlying view model collection. For example:
``` js
        watch: {
            'list1': function () {
                console.log('Collection updated!');
            },
```

## Installation
- Available through:
``` js
 npm install vuedragablefor
```
``` js
 Bower install vue.dragable.for
```
- #### For Modules

  ``` js
  // ES6
  import Vue from 'vue'
  import VueDragableFor from 'vuedragablefor'
  Vue.use(VueDragableFor)

  // ES5
  var Vue = require('vue')
  Vue.use(require('vuedragablefor'))
  ```

- #### For `<script>` Include

  Just include `vue.dragable.for.js` after Vue and lodash(version >=3).
