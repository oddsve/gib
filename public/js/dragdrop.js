// http://blog.parkji.co.uk/2013/08/11/native-drag-and-drop-in-angularjs.html
angular.module('gib.dragdrop', [])

.directive('draggable', function () {
  return function (scope, element) {
    // this gives us the native JS object
    var el = element[0];

    el.draggable = true;

    el.addEventListener(
      'dragstart',
      function (e) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('json', this.dataset.json);
        this.classList.add('drag');
        return false;
      },
      false
    );

    el.addEventListener(
      'dragend',
      function (e) {
        this.classList.remove('drag');
        return false;
      },
      false
    );
  };
})

.directive('droppable', function () {
  return {
    scope: {
      drop: '&',
      bin: '='
    },
    link: function (scope, element) {
      // again we need the native object
      var el = element[0];

      el.addEventListener(
        'dragover',
        function (e) {
          e.preventDefault();
        },
        false
      );

      el.addEventListener(
        'dragenter',
        function (e) {
          e.dataTransfer.dropEffect = 'move';
          this.classList.add('over');
          return false;
        },
        false
      );

      el.addEventListener(
        'dragleave',
        function (e) {
          this.classList.remove('over');
          return false;
        },
        false
      );

      el.addEventListener(
        'drop',
        function (e) {
          // Stops some browsers from redirecting.
          if (e.stopPropagation) e.stopPropagation();

          this.classList.remove('over');

          var data = JSON.parse(e.dataTransfer.getData('json'));
          var item = document.getElementById(data.id);

          var dropEl, lastChild;

          // dropped on ul, below last element
          if (this.tagName.toLowerCase() == 'ul') {
            dropEl = this;
            lastChild = this.children[this.children.length - 1];
            dropEl.insertBefore(item, lastChild);
          }
          // droped on li, reordering
          else {
            dropEl = this.parentElement;
            dropEl.insertBefore(item, this);
          }

          var station = JSON.parse(dropEl.dataset.json);

          // call the passed drop function
          scope.$apply(function (scope) {
            var fn = scope.drop();
            if ('undefined' !== typeof fn) {
              fn(data, station);
            }
          });

          return false;
        },
        false
      );
    }
  };
});
