declare module 'vuedraggable' {
  import Vue from 'vue';
  class Draggable extends Vue {
    static install(vue: typeof Vue): void;
    
    noTransitionOnDrag: boolean;
    
    element: string;
    
    tag: string;
    
    options: object;
    
    componentData: object;
    
    clone: any;
    
    move: any;

    list: any[];

    value: any[];
  }

  export = Draggable;
}
