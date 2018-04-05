import SideBar from './side-bar';
import ControlsPanel from './controls-panel';
import RowPanel from './row-panel';

const $ = global.$ || global.jQuery || require('jquery');

/**
 * User interface component.
 * This component provides control panels for buttons and side bars to display information.
 */
export default class UserInterfaceComponent {

  /**
   * Constructor
   */
  constructor() {
    this._$container = $('<div class="aims-map-ui-container"></div>');
    this._$rowContainer = $('<div class="aims-map-ui-row-container"></div>');

    this._leftSideBar = null;
    this._leftControlsPanel = null;

    this._topRowPanel = null;
    this._bottomRowPanel = null;

    this._rightControlsPanel = null;
    this._rightSideBar = null;
  }

  /**
   * Return the left side bar
   * @returns {SideBar}
   */
  getLeftSideBar() {
    if (this._leftSideBar === null) {
      this._leftSideBar = new SideBar('left');
      this._$container.append(this._leftSideBar.render());
    }
    return this._leftSideBar;
  }

  /**
   * Return the left control panel
   * @returns {ControlsPanel}
   */
  getLeftControlsPanel() {
    if (this._leftControlsPanel === null) {
      this._leftControlsPanel = new ControlsPanel('left');
      this._$container.append(this._leftControlsPanel.render());
    }
    return this._leftControlsPanel;
  }

  /**
   * Return the top row panel
   * @returns {RowPanel}
   */
  getTopRowPanel() {
    if (this._topRowPanel === null) {
      this._topRowPanel = new RowPanel('top');
      this._$rowContainer.append(this._topRowPanel.render());
    }
    return this._topRowPanel;
  }

  /**
   * Return the top row panel
   * @returns {RowPanel}
   */
  getBottomRowPanel() {
    if (this._bottomRowPanel === null) {
      this._bottomRowPanel = new RowPanel('bottom');
      this._$rowContainer.append(this._bottomRowPanel.render());
    }
    return this._bottomRowPanel;
  }

  /**
   * Return the right control panel
   * @returns {ControlsPanel}
   */
  getRightControlsPanel() {
    if (this._rightControlsPanel === null) {
      this._rightControlsPanel = new ControlsPanel('right');
      this._$container.append(this._rightControlsPanel.render());
    }
    return this._rightControlsPanel;
  }

  /**
   * Return the right side bar
   * @returns {SideBar}
   */
  getRightSideBar() {
    if (this._rightSideBar === null) {
      this._rightSideBar = new SideBar('right');
      this._$container.append(this._rightSideBar.render());
    }
    return this._rightSideBar;
  }

  /**
   * Append all elements to the container and return the container
   * @returns {*|jQuery|HTMLElement}
   */
  render() {
    this._$container.append(this._$rowContainer);
    return this._$container;
  }
}
