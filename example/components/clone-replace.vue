<template>
  <div class="row">
    <div class="col-3">
      <h3>Draggable 1</h3>
      <draggable
        class="dragArea list-group"
        :list="list1"
        :group="{ name: 'people', pull: 'clone', put: false }"
        :clone="cloneDog"
        :sort="false"
      >
        <div class="list-group-item" v-for="element in list1" :key="element.id">
          <span>
            {{ element.name }}
          </span>
        </div>
      </draggable>
    </div>

    <div class="col-3">
      <h3>Draggable 2</h3>
      <draggable
        class="dragArea list-group"
        :list="list2"
        group="people"
        ghost-class="ghost-class"
        @change="log"
        @start="disabled=true"
        @end="disabled=false"
      >
        <div 
          class="list-group-item"
          :class="dragoverIndex===index && !disabled ? 'dragover' : ''"
          v-for="(element, index) in list2" 
          :key="element.id">
          <draggable
            :list="replaceList"
            :disabled="disabled"
            group="people"
            @change="onChange(index)"
            @dragover.native="onDragenter(index)"
            @drop.native="onDragleave"
            @dragleave.native="onDragleave"
          >
            {{ element.name }}
          </draggable>
        </div>
      </draggable>
    </div>

    <rawDisplayer class="col-3" :value="list1" title="List 1" />

    <rawDisplayer class="col-3" :value="list2" title="List 2" />
  </div>
</template>

<script>
import draggable from "@/vuedraggable";
let idGlobal = 8;
export default {
  name: "clone-replace",
  display: "Clone Replace",
  order: 18,
  components: {
    draggable
  },
  data() {
    return {
      list1: [
        { name: "dog 1", id: 1 },
        { name: "dog 2", id: 2 },
        { name: "dog 3", id: 3 },
        { name: "dog 4", id: 4 }
      ],
      list2: [
        { name: "cat 5", id: 5 },
        { name: "cat 6", id: 6 },
        { name: "cat 7", id: 7 }
      ],
      replaceList: [],
      disabled: false,
      dragoverIndex: null,
    };
  },
  methods: {
    log (evt) {
      console.log('log', evt);
    },
    cloneDog(data) {
      return {
        ...data,
        id: idGlobal++
      };
    },
    onChange (index) {
      console.log('replace', index);
      this.$set(this.list2, index, this.replaceList.pop())
    },
    onDragenter (index) {
      this.dragoverIndex = index
    },
    onDragleave () {
       this.dragoverIndex = null
    }
  }
};
</script>
<style scoped>
.ghost-class {
  background-color: antiquewhite !important;
}
.ghost-class span {
  display: none;
}
.list-group-item .list-group-item {
  display: none;
}
.list-group-item.dragover {
  background-color: antiquewhite !important;
}
</style>
