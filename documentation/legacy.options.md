#### options props [deprecated]
**Deprecated: use Sortable options as props; see [below section for more](https://github.com/SortableJS/Vue.Draggable#all-sortable-options)**

Type: `Object`<br>
Required: `false`

Option used to initialize the sortable object see: [sortable option documentation](https://github.com/RubaXa/Sortable#options)<br>
Note that all the method starting by "on" will be ignored as draggable component expose the same API via events.

As an example, a drag handle can be added using this binding `:options="{handle:'.handle'}"`. Read the linked documentation for other options available to you.