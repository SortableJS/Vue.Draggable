## Element props

`element` has been deprecated and you should use `tag` props instead. The motivation is to comply with widespread convention.

Migrate from:

```HTML
<draggable v-for="list" element="ul">
    <!-- -->
</draggable>
```

To:

```HTML
<draggable v-for="list" tag="ul">
  <!-- -->
</draggable>
```

## Options props

`options` props has been deprecated in version v2.20. 

Vue.draggable starting from that release will use [transparent wrapper](https://zendev.com/2018/05/31/transparent-wrapper-components-in-vue.html) to pass props to the Sortable instance.


So [Sortable options](https://github.com/SortableJS/Sortable#options) can directly be attached to Vue.draggable instance.

Example 1:

Migrate from:

```HTML
<draggable v-for="list" :options="{handle: '.handle'}">
  <!-- -->
</draggable>
```

To:

```HTML
<draggable v-for="list" handle=".handle">
  <!-- -->
</draggable>
```

Example 2:

Migrate from:

```HTML
<draggable v-for="list" :options="getOptions()">
   <!-- -->
</draggable>
```

To:

```HTML
<draggable v-for="list" v-bind="getOptions()">
   <!-- -->
</draggable>
```




