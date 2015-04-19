function SortingDialogController(controls) {
    this.$elementsContainer = controls.elementsContainer;
    this.$elementTemplate = controls.elementTemplate;
    this.$elementWeight = controls.elementWeight;
    this.ELEMENT_CSS_CLASS = "sorting-element";
    this.ACTIVE_ELEMENT_CSS_CLASS = "sorting-element-active";
    this._sorter = null;
}


SortingDialogController.prototype = {
    addElement: function() {
        var weight = this.$elementWeight.val();
        if (isNaN(weight))
            return;
        var $element = this.$elementTemplate.clone();
        $element.addClass(this.ELEMENT_CSS_CLASS);
        $element.appendTo(this.$elementsContainer);
        $element.dblclick({controller: this}, this._removeElement);
        $element.text(weight).removeAttr('hidden');
        this.resetSorter();
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
                    $element2.insertBefore($element1);
                else
                    $element1.insertBefore($element2);
            }
        }
        else {
            this.resetSorter();
        }
    }
};
