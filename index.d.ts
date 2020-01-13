// thanks sgarner    https://github.com/SortableJS/Vue.Draggable/issues/379#issuecomment-480109531 
// include this alongside the src/dist folders in the npm package to allow typescript users to 
// import draggable from "vuedraggable" , then it can be used just like in the
declare module 'vuedraggable' {
  import Vue, { ComponentOptions } from 'vue';

  export interface DraggedContext<T> {
    index: number;
    futureIndex: number;
    element: T;
  }

  export interface DropContext<T> {
    index: number;
    component: Vue;
    element: T;
  }

  export interface Rectangle {
    top: number;
    right: number;
    bottom: number;
    left: number;
    width: number;
    height: number;
  }

  export interface MoveEvent<T> {
    originalEvent: DragEvent;
    dragged: Element;
    draggedContext: DraggedContext<T>;
    draggedRect: Rectangle;
    related: Element;
    relatedContext: DropContext<T>;
    relatedRect: Rectangle;
    from: Element;
    to: Element;
    willInsertAfter: boolean;
    isTrusted: boolean;
  }

  const draggableComponent: ComponentOptions<Vue>;

  export default draggableComponent;
}
