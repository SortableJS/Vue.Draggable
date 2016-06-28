(function(){

  function copyMethod(target, source, preserve){
      for (var property in source) {
            if (!source.hasOwnProperty(property) || preserve.indexOf(property)!==-1)
                continue;

            var value = source[property];
            if (typeof value !== "function")
                continue;

            target[property] = function(){
              return value.apply(this, arguments);
            }
        }
  }

  var forDirective = Vue.directive('for');
  var clonedForDirective = _.clone(forDirective);

  function mix(source, functions){
    _.forEach(['bind', 'update', 'unbind'],function(value){
        var original = clonedForDirective[value];
        clonedForDirective[value] = function(){
          functions[value].apply(this, arguments);
          return original.apply(this, arguments);
        };
    });
  }

   mix(clonedForDirective, {
      bind : function () {
        this.sortable = new Sortable(this.el.parentElement, {});
      },
      update : function(){
        console.log(this.sortable)
      },
      unbind : () => console.log('unbind'),
   });
     
  Vue.directive('dragable-for', clonedForDirective);

})();
