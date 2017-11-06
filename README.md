<p align="center"><img width="100"src="https://raw.githubusercontent.com/SortableJS/Vue.Draggable/master/logo.png"></p>
<h1 align="center">Vue.Draggable</h1>

[![GitHub open issues](https://img.shields.io/github/issues/SortableJS/Vue.Draggable.svg?maxAge=2592000)](https://github.com/SortableJS/Vue.Draggable/issues?q=is%3Aopen+is%3Aissue)
[![npm download](https://img.shields.io/npm/dt/vuedraggable.svg?maxAge=2592000)](https://www.npmjs.com/package/vuedraggable)
[![npm download per month](https://img.shields.io/npm/dm/vuedraggable.svg)](https://www.npmjs.com/package/vuedraggable)
[![npm version](https://img.shields.io/npm/v/vuedraggable.svg?maxAge=2592000)](https://www.npmjs.com/package/vuedraggable)
[![Package Quality](http://npm.packagequality.com/shield/vuedragablefor.svg)](http://packagequality.com/#?package=vuedraggable)
[![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)
[![MIT License](https://img.shields.io/github/license/SortableJS/Vue.Draggable.svg)](https://github.com/SortableJS/Vue.Draggable/blob/master/LICENSE)


Vue component (Vue.js 2.0) or directive (Vue.js 1.0) allowing drag-and-drop and synchronization with view model array.

Based on and offering all features of [Sortable.js](https://github.com/RubaXa/Sortable)

## Demo

![demo gif](https://raw.githubusercontent.com/SortableJS/Vue.Draggable/master/example.gif)


## Features

* Full support of [Sortable.js](https://github.com/RubaXa/Sortable) features:
    * Supports touch devices
    * Supports drag handles and selectable text
    * Smart auto-scrolling
    * Support drag and drop between different lists
    * No jQuery dependency
* Keeps in sync HTML and view model list
* Compatible with Vue.js 2.0 transition-group
* Cancellation support
* Events reporting any changes when full control is needed

## For Vue.js 2.0

Use draggable component:

### Typical use:
``` html
<draggable v-model="myArray" :options="{group:'people'}" @start="drag=true" @end="drag=false">
   <div v-for="element in myArray">{{element.name}}</div>
</draggable>
```
.vue file:
``` js
  import draggable from 'vuedraggable'
  ...
  export default {
        components: {
            draggable,
        },
  ...
```

### With `transition-group`:
``` html
<draggable v-model="myArray">
    <transition-group>
        <div v-for="element in myArray" :key="element.id">
            {{element.name}}
        </div>
    </transition-group>
</draggable>
```

Draggable component should directly wrap the draggable elements, or a `transition-component` containing the draggable elements.


### With footer slot:
``` html
<draggable v-model="myArray" :options="{draggable:'.item'}">
    <div v-for="element in myArray" :key="element.id" class="item">
        {{element.name}}
    </div>
    <button slot="footer" @click="addPeople">Add</button>
</draggable>
```


### With Vuex:

```html
<draggable v-model='myList'>
``` 

```javascript
computed: {
    myList: {
        get() {
            return this.$store.state.myList
        },
        set(value) {
            this.$store.commit('updateList', value)
        }
    }
}
```


### Props
#### value
Type: `Array`<br>
Required: `false`<br>
Default: `null`

Input array to draggable component. Typically same array as referenced by inner element v-for directive.<br>
This is the preferred way to use Vue.draggable as it is compatible with Vuex.<br>
It should not be used directly but only though the `v-model` directive:
```html
<draggable v-model="myArray">
```

#### list
Type: `Array`<br>
Required: `false`<br>
Default: `null`

Altenative to the `value` prop, list is an array to be synchronized with drag-and-drop.<br>
The main diference is that `list` prop is updated by draggable component using splice method, whereas `value` is immutable.<br>
**Do not use in conjunction with value prop.**

#### options
Type: `Object`<br>
Required: `false`

Option used to initialize the sortable object see: [sortable option documentation](https://github.com/RubaXa/Sortable#options)<br>
Note that all the method starting by "on" will be ignored as draggable component expose the same API via events.

#### element
Type: `String`<br>
Default: `'div'`

HTML node type of the element that draggable component create as outer element for the included slot.

#### clone
Type: `Function`<br>
Required: `false`<br>
Default: `(original) => { return original;}`<br>

Function called on the source component to clone element when clone option is true. The unique argument is the viewModel element to be cloned and the returned value is its cloned version.<br>
By default vue.draggable reuses the viewModel element, so you have to use this hook if you want to clone or deep clone it.

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
evt object has same property as [Sortable onMove event](https://github.com/RubaXa/Sortable#move-event-object), and 3 additional properties:
 - `draggedContext`:  context linked to dragged element
   - `index`: dragged element index
   - `element`: dragged element underlying view model element
   - `futureIndex`:  potential index of the dragged element if the drop operation is accepted
 - `relatedContext`: context linked to current drag operation
   - `index`: target element index
   - `element`: target element view model element
   - `list`: target list
   - `component`: target VueComponent

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

* Support for Sortable events:

  `start`, `add`, `remove`, `update`, `end`, `choose`, `sort`, `filter`, `clone`<br>
  Events are called whenever onStart, onAdd, onRemove, onUpdate, onEnd, onChoose, onSort, onClone are fired by Sortable.js with the same argument.<br>
  [See here for reference](https://github.com/RubaXa/Sortable#event-object-demo)

  Note that SortableJS OnMove callback is mapped with the [move prop](https://github.com/SortableJS/Vue.Draggable/blob/master/README.md#move)

HTML:
```HTML
<draggable :list="list" @end="onEnd">
```

* change event

  `change` event is triggered when list prop is not null and the corresponding array is altered due to drag-and-drop operation.<br>
  This event is called with one argument containing one of the following properties:
  - `added`:  contains information of an element added to the array
    - `newIndex`: the index of the added element
    - `element`: the added element
  - `removed`:  contains information of an element removed from to the array
    - `oldIndex`: the index of the element before remove
    - `element`: the removed element
  - `moved`:  contains information of an element moved within the array
    - `newIndex`: the current index of the moved element
    - `oldIndex`: the old index of the moved element
    - `element`: the moved element

### Slots
Use the `footer` slot to add none-draggable element inside the vuedraggable component.
Important: it should be used in conjunction with draggable option to tag draggable element.
Note that footer slot will always be added after the default slot.
Ex:

``` html
<draggable v-model="myArray" :options="{draggable:'.item'}">
    <div v-for="element in myArray" :key="element.id" class="item">
        {{element.name}}
    </div>
    <button slot="footer" @click="addPeople">Add</button>
</draggable>
```

### Gotchas
  - Drag operation with empty list:

    To be able to drag items on an empty draggable component, set a min-height greater than 0 on the `draggable` component or the `transition-group` if any and ensure the transition group has display: block; otherwise height won't work.

### Fiddle

- Simple:
https://jsfiddle.net/dede89/sqssmhtz/

- Two Lists:
https://jsfiddle.net/dede89/32ao2rpm/

- Example with list clone:
https://jsfiddle.net/dede89/t3m5krea/

- Example with transition-group:
https://jsfiddle.net/dede89/m2v0orcn/

- Example with table:
https://jsfiddle.net/dede89/L54yu3L9/

### Full demo example

[draggable-example](https://github.com/David-Desmaisons/draggable-example)

## For Vue.js 1.0

[See here](documentation/Vue.draggable.for.ReadME.md)

## Installation
- Available through:
``` js
 npm install vuedraggable
```
``` js
 Bower install vue.draggable
```

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

  //For Vue.js 2.0
  var draggable = require('vuedraggable')
  ```

- #### For `<script>` Include

```HTML

<!-- CDNJS :: Vue (https://cdnjs.com/) -->
<script src="//cdnjs.cloudflare.com/ajax/libs/vue/2.5.2/vue.min.js"></script>

<!-- CDNJS :: Sortable (https://cdnjs.com/) -->
<script src="//cdnjs.cloudflare.com/ajax/libs/Sortable/1.7.0/Sortable.min.js"></script>

<!-- CDNJS :: Vue.Draggable (https://cdnjs.com/) -->
<script src="//cdnjs.cloudflare.com/ajax/libs/Vue.Draggable/2.15.0/vuedraggable.min.js"></script>

```
