## For Vue.js 1.0

Use it exactly as v-for directive, passing optional parameters using 'options' parameter.
Options parameter can be json string or a full javascript object.

  ``` html
  <div v-dragable-for="element in list1" options='{"group":"people"}'>
    <p>{{element.name}}</p>
  </div>
   ```
   
### Limitation

* This directive works only when applied to arrays and not to objects.
* `onStart`, `onUpdate`, `onAdd`, `onRemove` Sortable.js options hooks are used by v-dragable-for to update VM. As such these four options are not usable with v-dragable-for. If you need to listen to re-order events, you can watch the underlying view model collection. For example:
``` js
        watch: {
            'list1': function () {
                console.log('Collection updated!');
            },
```
### fiddle
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

- #### For Modules

  ``` js
  // ES6  
  //For Vue.js 1.0 only
  import VueDraggable from 'vuedraggable'
  import Vue from 'vue'
  Vue.use(VueDraggable)

  // ES5 
  //For Vue.js 1.0
  var Vue = require('vue')
  Vue.use(require('vuedraggable'))
  ```

- #### For `<script>` Include

  Include 'vue.dragable.for' after Vue and lodash(version >=3).<br>
