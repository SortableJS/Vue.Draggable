<p align="center"><img width="140"src="https://raw.githubusercontent.com/SortableJS/Vue.Draggable/master/logo.svg?sanitize=true"></p>
<h1 align="center">Vue.Draggable</h1>

[![CircleCI](https://circleci.com/gh/SortableJS/Vue.Draggable.svg?style=shield)](https://circleci.com/gh/SortableJS/Vue.Draggable)
[![Coverage](https://codecov.io/gh/SortableJS/Vue.Draggable/branch/master/graph/badge.svg)](https://codecov.io/gh/SortableJS/Vue.Draggable)
[![codebeat badge](https://codebeat.co/badges/7a6c27c8-2d0b-47b9-af55-c2eea966e713)](https://codebeat.co/projects/github-com-sortablejs-vue-draggable-master)
[![GitHub open issues](https://img.shields.io/github/issues/SortableJS/Vue.Draggable.svg)](https://github.com/SortableJS/Vue.Draggable/issues?q=is%3Aopen+is%3Aissue)
[![npm download](https://img.shields.io/npm/dt/vuedraggable.svg?maxAge=30)](https://www.npmjs.com/package/vuedraggable)
[![npm download per month](https://img.shields.io/npm/dm/vuedraggable.svg)](https://www.npmjs.com/package/vuedraggable)
[![npm version](https://img.shields.io/npm/v/vuedraggable.svg)](https://www.npmjs.com/package/vuedraggable)
[![MIT License](https://img.shields.io/github/license/SortableJS/Vue.Draggable.svg)](https://github.com/SortableJS/Vue.Draggable/blob/master/LICENSE)


Vue 组件 (Vue.js 2.0) or 指令 (Vue.js 1.0) 允许拖放与视图模型数组同步.

基于并且支持所有 [Sortable.js](https://github.com/RubaXa/Sortable)功能

Languages: 简体中文 | [English](./README.md)


## 演示

![demo gif](https://raw.githubusercontent.com/SortableJS/Vue.Draggable/master/example.gif)

## 在线实例

https://sortablejs.github.io/Vue.Draggable/

https://david-desmaisons.github.io/draggable-example/

## 功能

* 全面支持 [Sortable.js](https://github.com/RubaXa/Sortable) 的功能:
    * 支持触摸设备
    * 支持拖动手柄和可选择的文本
    * 智能自动滚动
    * 支持在不同的列表之间拖放
    * 无需jQuery
* 保持HTML和视图模型列表的同步
* 兼容 Vue.js 2.0 列表过渡
* 支持取消
* 在需要完全控制时，提供任何更改事件参数
* 重用现有的UI库组件 (例如 [vuetify](https://vuetifyjs.com), [element](http://element.eleme.io/), 或者 [vue material](https://vuematerial.io) 等等...) 让他们可以拖动，并且使用 `tag` 和 `componentData` 传参

## 赞助

 <a href="https://flatlogic.com/admin-dashboards">
 <img width="190" style="margin-top: 10px;" src="https://flatlogic.com/assets/logo-d9e7751df5fddd11c911945a75b56bf72bcfe809a7f6dca0e32d7b407eacedae.svg">
 </a>

使用Vue、React和Angular创建的管理仪表板模板。


## 捐赠

觉得这个项目有用吗?你可以请我喝 :coffee: 或者 :beer:

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=GYAEKQZJ4FQT2&currency_code=USD&source=url)


## 安装

### 使用npm或者yarn 

```bash
yarn add vuedraggable

npm i -S vuedraggable
```

**注意 vuedraggable 支持的是 Vue 2.0 ， vue-draggable 是支持 1.0**

### 直接使用连接 
```html

<script src="//cdnjs.cloudflare.com/ajax/libs/vue/2.5.2/vue.min.js"></script>
<!-- CDNJS :: Sortable (https://cdnjs.com/) -->
<script src="//cdn.jsdelivr.net/npm/sortablejs@1.8.4/Sortable.min.js"></script>
<!-- CDNJS :: Vue.Draggable (https://cdnjs.com/) -->
<script src="//cdnjs.cloudflare.com/ajax/libs/Vue.Draggable/2.20.0/vuedraggable.umd.min.js"></script>

```

[cf示例部分](https://github.com/SortableJS/Vue.Draggable/tree/master/example)

## For Vue.js 2.0

使用可拖动的组件:

### 典型的使用:
``` html
<draggable v-model="myArray" group="people" @start="drag=true" @end="drag=false">
   <div v-for="element in myArray" :key="element.id">{{element.name}}</div>
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

### 使用 `transition-group`:
``` html
<draggable v-model="myArray">
    <transition-group>
        <div v-for="element in myArray" :key="element.id">
            {{element.name}}
        </div>
    </transition-group>
</draggable>
```

可拖动组件应该直接包装可拖动元素，, 或者一个包含可拖动元素的 `transition-component` 。


### 使用 footer 插槽:
``` html
<draggable v-model="myArray" draggable=".item">
    <div v-for="element in myArray" :key="element.id" class="item">
        {{element.name}}
    </div>
    <button slot="footer" @click="addPeople">Add</button>
</draggable>
```
### 使用 header 插槽:
``` html
<draggable v-model="myArray" draggable=".item'">
    <div v-for="element in myArray" :key="element.id" class="item">
        {{element.name}}
    </div>
    <button slot="header" @click="addPeople">Add</button>
</draggable>
```

### 使用 Vuex:

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


### 传参
#### value
类型： `Array`<br>
必需的：`false`<br>
默认值：`null`

可拖动组件的输入数组。通常情况下，内部元素v-for指令引用相同的数组。<br>
这是使用Vue的首选方式。可拖动，因为它与Vuex兼容。<br>
它不应该直接使用，但只能通过 `v-model` 指令:
```html
<draggable v-model="myArray">
```

#### list
类型： `Array`<br>
必需的：`false`<br>
默认值：`null`

作为 `value` prop的替代，list是一个拖放同步的数组。<br>
主要的区别是 `list` prop是由可拖放组件使用splice方法更新的, 而 `value` 是不可变的。<br>
**不要与 value prop结合使用。**

#### 所有 sortable 选项
在 2.19 版本中的新功能

2.19 之后的版本中 Sortable 选项可以直接通过 vue.draggable props 设置

这意味着所有 [sortable 选项](https://github.com/RubaXa/Sortable#options) 都是有效的sortable props，值得注意的是，所有方法均以“on”开头，因为可拖动组件通过事件公开了相同的API 。

支持kebab-case属性：例如， `ghost-class` props 将转换为 `ghostClass` sortable 选项。

设置 handle 示例, 可排序和组选项:
```HTML
<draggable
        v-model="list"
        handle=".handle"
        :group="{ name: 'people', pull: 'clone', put: false }"
        ghost-class="ghost"
        :sort="false"
        @change="log"
      >
      <!-- -->
</draggable>
```

#### tag
类型： `String`<br>
默认值：`'div'`

可拖动组件创建的作为所包含槽的外部元素的元素的HTML节点类型。<br>
也可以将vue组件的名称作为元素传递。在本例中，draggable属性将被传递给create组件。<br>
如果需要为创建的组件设置道具或事件，请参见 [componentData](#componentdata) 。

#### clone
类型： `Function`<br>
必需的：`false`<br>
默认值：`(original) => { return original;}`<br>

当克隆选项为 true 时，在源组件上调用克隆元素的函数。唯一的参数是要克隆的 viewModel 元素，返回的值是克隆的版本。<br>
在默认情况下 vue.draggable 重用了 viewModel 元素，所以如果您想克隆或深度克隆它，就必须使用这个hook。

#### move
类型： `Function`<br>
必需的：`false`<br>
默认值：`null`<br>

如果非 null，此函数将以类似 [Sortable onMove callback](https://github.com/RubaXa/Sortable#move-event-object) 的方式调用。

如果返回 false，将取消拖动操作。

```javascript
function onMoveCallback(evt, originalEvent){
   ...
    // return false; — 如果要取消拖动
}
```
evt 对象类似 [Sortable onMove event](https://github.com/RubaXa/Sortable#move-event-object), 另外还有3个属性:
 - `draggedContext`:  当前被拖动的元素
   - `index`: 被拖动的元素索引
   - `element`: 在视图模型元素基础上拖动的元素
   - `futureIndex`:  如果拖放操作被接受，被拖放元素的潜在索引
 - `relatedContext`: 拖放到位置的目标元素
   - `index`: 目标元素索引
   - `element`: 目标元素视图模型元素
   - `list`: 目标列表
   - `component`: 目标 VueComponent

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
查看完整示例: [Cancel.html](https://github.com/SortableJS/Vue.Draggable/blob/master/examples/Cancel.html), [cancel.js](https://github.com/SortableJS/Vue.Draggable/blob/master/examples/script/cancel.js)

#### componentData
类型： `Object`<br>
必需的：`false`<br>
默认值：`null`<br>

此 props 通过 [tag props](#tag)将附加信息传递给由声明的子组件<br>
Value:
* `props`: 传递给子组件的 props
* `attrs`: 传递给子组件的 attrs
* `on`: 在子组件中要订阅的事件

示例 (使用 [element UI 组件](http://element.eleme.io/#/en-US)):
```HTML
<draggable tag="el-collapse" :list="list" :component-data="getComponentData()">
    <el-collapse-item v-for="e in list" :title="e.title" :name="e.name" :key="e.name">
        <div>{{e.description}}</div>
     </el-collapse-item>
</draggable>
```
```javascript
methods: {
    handleChange() {
      console.log('changed');
    },
    inputChanged(value) {
      this.activeNames = value;
    },
    getComponentData() {
      return {
        on: {
          change: this.handleChange,
          input: this.inputChanged
        },
        attrs:{
          wrap: true
        },
        props: {
          value: this.activeNames
        }
      };
    }
  }
```

### Events

* 支持 Sortable 的事件:

  `start`, `add`, `remove`, `update`, `end`, `choose`, `unchoose`, `sort`, `filter`, `clone`<br>
  当 Sortable.js 用相同的参数触发onStart, onAdd, onRemove, onUpdate, onEnd, onChoose, onUnchoose, onSort, onClone时，事件将会被调用。<br>
  [请参阅此处以供参考](https://github.com/RubaXa/Sortable#event-object-demo)

  Note that SortableJS OnMove callback is mapped with the [move prop](https://github.com/SortableJS/Vue.Draggable/blob/master/README.md#move)

HTML:
```HTML
<draggable :list="list" @end="onEnd">
```

* 变更事件

  当list prop不为null，并且由于拖放操作改变了相应的数组时触发 `change`  事件。<br>
  此事件的调用带有一个参数，该参数包含以下属性之一:
  - `added`:  包含添加到数组中的元素的信息
    - `newIndex`: 添加元素的索引
    - `element`: 添加的元素
  - `removed`:  包含从数组中删除的元素的信息
    - `oldIndex`: 移除前元素的索引
    - `element`: 删除的元素
  - `moved`:  包含数组中被移动的元素的信息
    - `newIndex`: 移动元素的当前索引
    - `oldIndex`: 已移动元素的旧索引
    - `element`: 被移动的元素

### Slots

限制: `header` 或 `footer` 插槽都不能与过度列表一起工作。

#### Header
使用 `header` 插槽在vuedraggable组件中添加不可拖动的元素。
重要提示:它应该与可拖动选项一起使用，以标记可拖动元素。
注意 `header` 插槽总是在默认槽之前添加，不管它在模板中的位置如何。
例:

``` html
<draggable v-model="myArray" draggable=".item">
    <div v-for="element in myArray" :key="element.id" class="item">
        {{element.name}}
    </div>
    <button slot="header" @click="addPeople">Add</button>
</draggable>
```

#### Footer
使用 `footer` 插槽在vuedraggable组件中添加不可拖动元素。
重要提示:它应该与可拖动选项一起使用，以标记可拖动元素。
请注意， `footer` 插槽总是添加在默认插槽之后，而不管它在模板中的位置如何。
例:

``` html
<draggable v-model="myArray" draggable=".item">
    <div v-for="element in myArray" :key="element.id" class="item">
        {{element.name}}
    </div>
    <button slot="footer" @click="addPeople">Add</button>
</draggable>
```
 ### 须知
 
 - Vue.draggable 子元素应该总是使用 `v-for` 指令映射 `list` 或 `value prop`
   * 您可以使用 [header](https://github.com/SortableJS/Vue.Draggable#header) 和 [footer](https://github.com/SortableJS/Vue.Draggable#footer) 插槽绕过此限制。
 
 - v-for中的子元素应该像 `vuv .js` 中的任何元素一样被键入键。在提供相关关键值时要小心，特别是:
    * 通常提供数组索引作为键不会工作作为键应该链接到项目的内容
    * 克隆的元素应提供更新的密钥，例如可以使用 [clone props](#clone) 来完成


 ### 示例 
  * [Clone](https://sortablejs.github.io/Vue.Draggable/#/custom-clone)
  * [Handle](https://sortablejs.github.io/Vue.Draggable/#/handle)
  * [Transition](https://sortablejs.github.io/Vue.Draggable/#/transition-example-2)
  * [Nested](https://sortablejs.github.io/Vue.Draggable/#/nested-example)
  * [Table](https://sortablejs.github.io/Vue.Draggable/#/table-example)
 
 ### 完整示例

[draggable-example](https://github.com/David-Desmaisons/draggable-example)

## For Vue.js 1.0

[See here](documentation/Vue.draggable.for.ReadME.md)

```
