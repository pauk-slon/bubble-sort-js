function extend(child, parent) {
    var F = function() {};
    F.prototype = parent.prototype;
    var f = new F();
    for (var prop in child.prototype) {
        f[prop] = child.prototype[prop];
    }
    child.prototype = f;
    child.prototype[parent.prototype.__class_name] = parent.prototype;
}

function StepByStepSorter(elements) {
    this._elements = elements;
}

StepByStepSorter.prototype = {
    __class_name: "StepByStepSorter",
    constructor: StepByStepSorter,
    doNextStep: function(){
        throw "method is not implemented";
    }
};


function BubbleStepByStepSorter(elements) {
    StepByStepSorter.call(this, elements);
    this._result = [];
    for (var i = 0; i <= this._getMaxIndex(); i++) {
        this._result.push(i);
    }
    this._startNewPass(this._elements.length);
}

BubbleStepByStepSorter.prototype = {
    __class_name: "BubbleStepByStepSorter",
    constructor: BubbleStepByStepSorter,
    _startNewPass: function() {
        this._swapped = false;
        this._currentIndex = 0;
    },
    _getMaxIndex: function() {
        return this._elements.length - 1
    },
    _getElement: function(index) {
        var elementIndex = this._result[index];
        return this._elements[elementIndex];
    },
    _changeOrder: function(index1, index2) {
        var firstElementIndex = this._result[index1];
        this._result[index1] = this._result[index2];
        this._result[index2] = firstElementIndex;
    },
    doNextStep: function() {
        var maxIndex = this._getMaxIndex();
        if (this._currentIndex >= maxIndex) {
            if (this._swapped)
                this._startNewPass();
            else
                return null;
        }
        var currentElementIndex = this._currentIndex;
        var currentElement = this._getElement(currentElementIndex);
        var nextElementIndex = this._currentIndex + 1;
        var nextElement = this._getElement(nextElementIndex);
        this._currentIndex++;
        // если текущий элемент, оказался больше следующего, то меняем их местами
        if (currentElement.weight > nextElement.weight) {
            this._changeOrder(currentElementIndex, nextElementIndex);
            return [
                {element: currentElement, position: nextElementIndex},
                {element: nextElement, position: currentElementIndex}
            ];
        }
        else return [
            {element: currentElement, position: null},
            {element: nextElement, position: null}
        ]
    }
};

extend(BubbleStepByStepSorter, StepByStepSorter);
