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
    this._$container = $(`<div class="aims-map-ui-container"></div>`);
    this._$controlsContainer = $(`<div class="aims-map-controls-container"></div>`);

    this._leftControlsPanel = null;
    this._rightControlsPanel = null;
    this._rightSideBar = null;
    this._topRowPanel = null;
    this._bottomRowPanel = null;
  }

  /**
   * Return the left control panel
   * @returns {ControlsPanel}
   */
  getLeftControlsPanel() {
    if (this._leftControlsPanel === null) {
      this._leftControlsPanel = new ControlsPanel('left');
    }
    return this._leftControlsPanel;
  }

  /**
   * Return the right control panel
   * @returns {ControlsPanel}
   */
  getRightControlsPanel() {
    if (this._rightControlsPanel === null) {
      this._rightControlsPanel = new ControlsPanel('right');
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
    }
    return this._rightSideBar;
  }

  /**
   * Return the top row panel
   * @returns {RowPanel}
   */
  getTopRowPanel() {
    if (this._topRowPanel === null) {
      this._topRowPanel = new RowPanel('top');
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
    }
    return this._bottomRowPanel;
  }

  /**
   * Append all elements to the container and return the container
   * @returns {*|jQuery|HTMLElement}
   */
  render() {
    if (this._rightSideBar) {
      this._$container.append(this._rightSideBar.render());
    }

    if (this._topRowPanel) {
      this._$container.append(this._topRowPanel.render());
    }

    if (this._bottomRowPanel) {
      this._$container.append(this._bottomRowPanel.render());
    }

    if (this._leftControlsPanel) {
      this._$controlsContainer.append(this._leftControlsPanel.render());
    }

    if (this._rightControlsPanel) {
      this._$controlsContainer.append(this._rightControlsPanel.render());
    }

    this._$container.append(this._$controlsContainer);
    return this._$container;
  }
}
