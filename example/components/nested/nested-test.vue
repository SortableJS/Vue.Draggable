<style scoped>
.item-container {
  border: solid black 1px;
  min-height: 2rem;
}

.item {
  padding: 1rem;

}
.item-sub {
  padding:1rem;
  margin: 0 0 0 1rem
}
</style>


<template>
  <draggable v-bind="dragOptions" class="item-container" :list="list" :value="value" @input="emitter">
    <div class="item-group" :key="el.id" v-for="(el, i) in realValue">
      <div class="item">{{ el.name }}</div>
      <nested-test class="item-sub" :list="el.elements"/>
    </div>
  </draggable>
</template>

<script>
import draggable from "@/vuedraggable";
export default {
  name: "nested-test",
  methods: {
    emitter(value) {
      this.$emit("input", value);
    }
  },
  components: {
    draggable
  },
  computed: {
    dragOptions() {
      return {transition: 200,}
    },
    realValue() {
      const test = this.value ? this.value : this.list;
      return test;
    }
  },
  props: {
    value: {
      required: false,
      type: Array,
      default: null
    },
    list: {
      required: false,
      type: Array,
      default: null
    }
  }
};
</script>
