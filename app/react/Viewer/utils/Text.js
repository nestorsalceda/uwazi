import TextRange from 'batarange';
import wrapper from 'app/utils/wrapper';

export default function (container) {
  return {
    container,
    renderedReferences: {},

    selected() {
      return window.getSelection().toString() !== '';
    },

    getSelection() {
      let range = window.getSelection().getRangeAt(0);
      return TextRange.serialize(range, container);
    },

    simulateSelection(range) {
      this.removeSimulatedSelection();
      if (!range) {
        return;
      }

      let restoredRange = TextRange.restore(range, container);
      let elementWrapper = document.createElement('span');
      elementWrapper.classList.add('fake-selection');
      this.fakeSelection = wrapper.wrap(elementWrapper, restoredRange);
      this.removeSelection();
    },

    removeSimulatedSelection() {
      if (this.fakeSelection) {
        this.fakeSelection.unwrap();
        this.fakeSelection = null;
      }
    },

    removeSelection() {
      if (window.getSelection) {
        if (window.getSelection().empty) {
          window.getSelection().empty();
        } else if (window.getSelection().removeAllRanges) {
          window.getSelection().removeAllRanges();
        }
      }
    },

    renderReferences(references) {
      let ids = [];
      references.forEach((reference) => {
        ids.push(reference._id);
        if (this.renderedReferences[reference._id]) {
          return;
        }
        let restoredRange = TextRange.restore(reference.sourceRange, container);
        let elementWrapper = document.createElement('span');
        elementWrapper.classList.add('reference');
        this.renderedReferences[reference._id] = wrapper.wrap(elementWrapper, restoredRange);
      });

      Object.keys(this.renderedReferences).forEach((id) => {
        if (ids.indexOf(id) === -1) {
          this.renderedReferences[id].unwrap();
          delete this.renderedReferences[id];
        }
      });
    }
  };
}
