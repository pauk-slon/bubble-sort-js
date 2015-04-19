function SortingDialogController(controls) {
    this.$elementsContainer = controls.elementsContainer;
    this.$elementTemplate = controls.elementTemplate;
    this.$elementWeight = controls.elementWeight;
    this.ELEMENT_CSS_CLASS = "sorting-element";
    this.ACTIVE_ELEMENT_CSS_CLASS = "sorting-element-active";
    this.MIN_RANDOM_ELEMENT_COUNT = 3;
    this.MAX_RANDOM_ELEMENT_COUNT = 18;
    this.MAX_RANDOM_ELEMENT_VALUE = 5000;
    this._sorter = null;
}


SortingDialogController.prototype = {
    _addElement: function(weight) {
        if (isNaN(weight))
            return;
        var $element = this.$elementTemplate.clone();
        $element.addClass(this.ELEMENT_CSS_CLASS);
        $element.appendTo(this.$elementsContainer);
        $element.dblclick({controller: this}, this._removeElement);
        $element.text(weight).removeAttr('hidden');
        this.resetSorter();
    },
    addElement: function() {
        var weight = this.$elementWeight.val();
        this._addElement(weight);
    },
    _getRandomInt: function (min, max) {
        var delta = max - min + 1;
        return Math.floor(Math.random() * delta) + min;
    },
    addAFewRandomElements: function() {
        var elementCount = this._getRandomInt(
            this.MIN_RANDOM_ELEMENT_COUNT,
            this.MAX_RANDOM_ELEMENT_COUNT
        );
        for (var i = 0; i <= elementCount; i++) {
            var weight = this._getRandomInt(1, this.MAX_RANDOM_ELEMENT_VALUE);
            this._addElement(weight)
        }
    },
    _removeElement: function(eventObject) {
        var $element = eventObject.target;
        var data = eventObject.data;
        var controller = data.controller;
        $element.remove();
        controller.resetSorter();
    },
    _getElements: function() {
        var elementSelector = "." + this.ELEMENT_CSS_CLASS;
        return this.$elementsContainer.children(elementSelector);
    },
    sort: function() {
        if (this._sorter == null)
        {
            var $elements = this._getElements();
            var elements = [];
            $elements.each(function (index, element) {
                var weightText = $(element).text();
                elements.push({
                    domElement: element,
                    weight: parseFloat(weightText)
                });
            });
            this._sorter = new BubbleStepByStepSorter(elements);
        }
        this._doSortingStep();
    },
    _unmarkActiveElements: function() {
        var $elements = this._getElements();
        $elements.removeClass(this.ACTIVE_ELEMENT_CSS_CLASS);
    },
    resetSorter: function() {
        this._unmarkActiveElements();
        this._sorter = null;
    },
    _rearrange_neighbor_elements: function($leftElement, $rightElement){
        $leftElement.fadeTo(250, 0.3, function() {
            $rightElement.insertBefore($leftElement);
            $leftElement.fadeTo(100, 1);
        });
        $rightElement.fadeTo(250, 0.3, function() {
            $rightElement.fadeTo(100, 1);
        });
    },
    _doSortingStep: function() {
        this._unmarkActiveElements();
        var sorter = this._sorter;
        var sortingUpdates = sorter.doNextStep();
        if (sortingUpdates != null) {
            var item1 = sortingUpdates[0];
            var item2 = sortingUpdates[1];
            var $element1 = $(item1.element.domElement);
            $element1.addClass(this.ACTIVE_ELEMENT_CSS_CLASS);
            var $element2 = $(item2.element.domElement);
            $element2.addClass(this.ACTIVE_ELEMENT_CSS_CLASS);
            if (item1.position != null && item2.position != null) {
                if (item1.position > item2.position)
                    this._rearrange_neighbor_elements($element1, $element2);
                else
                    this._rearrange_neighbor_elements($element2, $element1);
            }
        }
        else {
            this.resetSorter();
        }
    }
};
