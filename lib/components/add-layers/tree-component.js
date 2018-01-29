/**
 * A component for displaying a list in a Tree structure.
 */
const EventEmitter = require('events').EventEmitter;
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

  };

  /**
   * Start the rendering by displaying the top level of nodes.
   */
  render() {

    // Add div wrapper to contain the tree.
    this._$el.append('<div class="aims-tree"></div>');
    const _$inner = this._$el.find('div');
    this._renderNodes(undefined, _$inner);
  }

  /**
   * Internal method to render the children of the specified parent node.
   */
  _renderNodes(parentId, $targetEl) {

    // Find the child nodes of the specified parent.
    const childNodes = this._listModel.filter((element, index, array) => {
      return element.parentId == parentId;
    });

    // Loop through the list of child nodes, adding them to the specified element.
    childNodes.forEach(function(_node) {
      if (_node.isParent) {
        $targetEl.append(`<div class="aims-tree-item branch closed" data-id="${_node.layerId}">
            <span>${_node.title}</span>
        </div>`);
      } else {
        $targetEl.append(`<div class="aims-tree-item leaf" data-id="${_node.layerId}">
            <input type="checkbox" id="${_node.layerId}">
            ${_node.title}
        </div>`);
      }
    }, this);

    // Attach toggle handler.
    $targetEl.find('div.branch span').click(this._toggleOpenClose.bind(this));

    // Handle click of any new leafs.
    $targetEl.find('div.leaf').click(function(event) {
      this.emit(this.EVENT_LEAF_CLICK, event);
    }.bind(this));

  }

  /**
   * Internal method to toggle open/close the selected branch.
   */
  _toggleOpenClose(event) {
    const _$targetEl = $(event.target).parent();
    const _layerId = _$targetEl.attr('data-id');
    const isOpen = _$targetEl.hasClass('open');
    if (isOpen) {
      // Branch is open, so close and remove children.
      _$targetEl.removeClass('open').addClass('closed');
      _$targetEl.find('div').remove();
    } else {
      // Branch is closed, so open and add children.
      _$targetEl.removeClass('closed').addClass('open');
      this._renderNodes(_layerId, _$targetEl);
    }

  }

}
