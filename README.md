# Vue.Draggable


[![GitHub open issues](https://img.shields.io/github/issues/David-Desmaisons/Vue.Draggable.svg?maxAge=2592000)]()
[![GitHub closed issues](https://img.shields.io/github/issues-closed/David-Desmaisons/Vue.Draggable.svg?maxAge=2592000)]()
[![Npm download](https://img.shields.io/npm/dt/vuedraggable.svg?maxAge=2592000)](https://www.npmjs.com/package/vuedraggable)
[![Npm version](https://img.shields.io/npm/v/vuedraggable.svg?maxAge=2592000)](https://www.npmjs.com/package/vuedraggable)
[![Package Quality](http://npm.packagequality.com/shield/vuedragablefor.svg)](http://packagequality.com/#?package=vuedraggable)
[![MIT License](https://img.shields.io/github/license/David-Desmaisons/Vue.Draggable.svg)](https://github.com/David-Desmaisons/Vue.Draggable/blob/master/LICENSE)


Vue component (Vue.js 2.0) or directive (Vue.js 1.0) allowing drag-and-drop and synchronization with view model array.

Based on and offering all features of [Sortable.js](https://github.com/RubaXa/Sortable)

##Demo

![demo gif](https://raw.githubusercontent.com/David-Desmaisons/Vue.Dragable.For/master/example.gif)


##Features

* Full support of [Sortable.js](https://github.com/RubaXa/Sortable) features
* Keeps in sync view model and view
* No jquery dependency
* Plays nicely with Vue.js 2.0 transition-group

##For Vue.js 2.0

Use draggable component:

Tipical use:
``` html
<draggable  :list="list" :options="{group:'people'}" @start="dragging=true" @end="dragging=false">
   <div v-for="element in list">{{element.name}}</div>
</draggable>
```

With `transition-group`:
``` html
<draggable :list="list"> 
	<transition-group>
		<div v-for="element in list" :key="element.id">
			{{element.name}}
		</div>
	</transition-group>
</draggable>
```

Draggable component should directly wrap the draggable elements, or a `transition-component` containing the draggable elements.

### Props
#### list
Type: `Array`<br>
Required: `false`<br>
Default: `null`

Array to be synchronized with drag-and-drop. Typically same array as referenced by inner element v-for directive.<br>
Note that this prop is not required and that draggable component can be used without a list prop.

#### options
Type: `Object`<br>
Required: `false`

Option used to inicialize the sortable object see: [sortable option documentation](https://github.com/RubaXa/Sortable#options)<br>
Note that all the method starting by "on" will be ignored as draggable component expose the same API via events.

#### element
Type: `String`<br>
Default: `'div'`

HTML root element that draggable component create as outer element for the included slot.

#### clone
Type: `Function`<br>
Required: `false`<br>
Default: `(original) => { return original;}`<br>

Function called on the source component to clone element when clone option is true. The unique argument is the viewModel element to be cloned and the returned value should be its cloned version.<br>
By default vue.draggable reuse the viewmodel element, so you have to use this hook if you want to clone or deep clone it.

#### move
Type: `Function`<br>
Required: `false`<br>
Default: `null`<br>

If not null this function will be called in a similar way as [Sortable onMove callback](https://github.com/RubaXa/Sortable#move-event-object).
Returning false will cancel the drag operation.

```javascript
function onMoveCallback(evt, originalEvent){
   ...
    // return false; — for cancel
}
```
evt object has same property as [Sortable onMove event](https://github.com/RubaXa/Sortable#move-event-object), plus two addicional properties:
`move event` object addicional properties:
 - `draggedContext`:  context linked to dragged element
 	- `index`: dragged element index
	- `element`: dragged element underlying view model element
 - `relatedContext`: context linked to current drag position
 	- `index`: target element index
	- `element`: target element view model element
	- `list`: target list
	- `component`: target VueComponent
	
Ex:

HTML:
```HTML
	<draggable :list="list" :move="checkMove"> 
```
javascript:
```javascript
checkMove: function(evt){
	return (evt.draggedContext.element.name!=='apple');
}
```
See complete example: [Cancel.html](https://github.com/SortableJS/Vue.Draggable/blob/master/examples/Cancel.html), [cancel.js](https://github.com/SortableJS/Vue.Draggable/blob/master/examples/script/cancel.js)


### Events
`start`, `add`, `remove`, `update`, `end`, `choose`, `sort`, `filter`, `clone`<br>
events are called when respectivelly onStart, onAdd, onRemove, onUpdate, onEnd, onChoose, onSort, onClone are fired by Sortabe.js with the same argument.<br>
[See here for reference](https://github.com/RubaXa/Sortable#event-object-demo)

The OnMove callback is mapped with the [move prop]()

Ex:
HTML:
```HTML
	<draggable :list="list" @end="onEnd"> 
```

###Fiddle
Simple:
https://jsfiddle.net/dede89/sqssmhtz/

Two Lists:
https://jsfiddle.net/dede89/32ao2rpm/

Example with list clone:
https://jsfiddle.net/dede89/t3m5krea/

Example with transition-group:
https://jsfiddle.net/dede89/m2v0orcn/

##For Vue.js 1.0

Use it exactly as v-for directive, passing optional parameters using 'options' parameter.
Options parameter can be json string or a full javascript object.

  ``` html
  <div v-dragable-for="element in list1" options='{"group":"people"}'>
    <p>{{element.name}}</p>
  </div>
   ```
   
###Limitation

* This directive works only when applied to arrays and not to objects.
* `onStart`, `onUpdate`, `onAdd`, `onRemove` Sortable.js options hooks are used by v-dragable-for to update VM. As such these four options are not usable with v-dragable-for. If you need to listen to re-order events, you can watch the underlying view model collection. For example:
``` js
        watch: {
            'list1': function () {
                console.log('Collection updated!');
            },
```
###fiddle
Simple:
https://jsfiddle.net/dede89/j62g58z7/

Two Lists:
https://jsfiddle.net/dede89/hqxranrd/

Example with list clone:
https://jsfiddle.net/dede89/u5ecgtsj/

## Installation
- Available through:
``` js
 npm install vuedraggable
```
``` js
 Bower install vue.draggable
```

Version 1.0.9 is Vue.js 1.0 compatible <br>
Version 2.0.2 is Vue.js 2.0 compatible 

- #### For Modules

  ``` js
  // ES6
  //For Vue.js 2.0
  import draggable from 'vuedraggable'
  ...
  export default {
        components: {
            draggable,
            ...
        }
        ...
  
  //For Vue.js 1.0 only
  import VueDraggable from 'vuedraggable'
  import Vue from 'vue'
  Vue.use(VueDraggable)

  // ES5 
  //For Vue.js 1.0
  var Vue = require('vue')
  Vue.use(require('vuedraggable'))
  
  //For Vue.js 2.0
  var draggable = require('vuedraggable')
  ```

- #### For `<script>` Include

  Just include `vuedraggable.min.js` or 'vue.dragable.for' after Vue.<br>
  lodash(version >=3) is needed only for Vuejs. 1.0 version of the library.
