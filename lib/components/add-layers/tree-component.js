/**
 * A component for displaying a list in a Tree structure.
 */
const { EventEmitter } = require('events');
const $ = global.$ || global.jQuery || require('jquery');

export default class TreeComponent extends EventEmitter {

  /**
   * Constructor.
   */
  constructor(listModel, $el) {
    super();

    // Capture the references.
    this._listModel = listModel;
    this._$el = $el;

    // Declare the events that are emitted from this class.
    this.EVENT_LEAF_CLICK = 'aims.components.tree.leaf-click';
  }

  /**
   * Start the rendering by displaying the top level of nodes.
   */
  render() {

    // Add div wrapper to contain the tree.
    this._$el.append('<div class="aims-tree"></div>');
    const $inner = this._$el.find('div');
    this._renderNodes(undefined, $inner);
  }

  /**
   * Internal method to render the children of the specified parent node.
   */
  _renderNodes(parentId, $targetEl) {

    // Find the child nodes of the specified parent.
    const childNodes = this._listModel.filter((element) => element.parentId === parentId);

    // Loop through the list of child nodes, adding them to the specified element.
    childNodes.forEach((node) => {
      if (node.isParent) {
        $targetEl.append(`<div class="aims-tree-item branch closed" data-id="${node.layerId}">
            <span>${node.title}</span>
        </div>`);
      } else {
        $targetEl.append(`<div class="aims-tree-item leaf" data-id="${node.layerId}">
            <input type="checkbox" id="${node.layerId}">
            ${node.title}
        </div>`);
      }
    }, this);

    // Attach toggle handler.
    $targetEl.find('div.branch span').click(this._toggleOpenClose.bind(this));

    // Handle click of any new leafs.
    $targetEl.find('div.leaf').click((event) => {
      this.emit(this.EVENT_LEAF_CLICK, event);
    });
  }

  /**
   * Internal method to toggle open/close the selected branch.
   */
  _toggleOpenClose(event) {
    const $targetEl = $(event.target).parent();
    const layerId = $targetEl.attr('data-id');
    const isOpen = $targetEl.hasClass('open');
    if (isOpen) {
      // Branch is open, so close and remove children.
      $targetEl.removeClass('open').addClass('closed');
      $targetEl.find('div').remove();
    } else {
      // Branch is closed, so open and add children.
      $targetEl.removeClass('closed').addClass('open');
      this._renderNodes(layerId, $targetEl);
    }

  }

}
