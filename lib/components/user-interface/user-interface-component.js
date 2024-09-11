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
    this._$container = $('<div class="mapping-client-ui-container"></div>');
    this._$rowContainer = $('<div class="mapping-client-ui-row-container"></div>');

    this._leftSideBar = new SideBar('left');
    this._rightSideBar = new SideBar('right');

    this._leftControlsPanel = new ControlsPanel('left');
    this._rightControlsPanel = new ControlsPanel('right');

    this._topRowPanel = new RowPanel('top');
    this._bottomRowPanel = new RowPanel('bottom');
    this._$rowContainer.append(this._topRowPanel.render());
    this._$rowContainer.append(this._bottomRowPanel.render());

    this._$container.append(this._rightControlsPanel.render());
    this._$container.append(this._leftControlsPanel.render());
    this._$container.append(this._$rowContainer);
    this._$container.append(this._rightSideBar.render());
    this._$container.append(this._leftSideBar.render());
  }

  /**
   * Return the left side bar
   * @returns {SideBar}
   */
  getLeftSideBar() {
    return this._leftSideBar;
  }

  /**
   * Return the left control panel
   * @returns {ControlsPanel}
   */
  getLeftControlsPanel() {
    return this._leftControlsPanel;
  }

  /**
   * Return the top row panel
   * @returns {RowPanel}
   */
  getTopRowPanel() {
    return this._topRowPanel;
  }

  /**
   * Return the top row panel
   * @returns {RowPanel}
   */
  getBottomRowPanel() {
    return this._bottomRowPanel;
  }

  /**
   * Return the right control panel
   * @returns {ControlsPanel}
   */
  getRightControlsPanel() {
    return this._rightControlsPanel;
  }

  /**
   * Return the right side bar
   * @returns {SideBar}
   */
  getRightSideBar() {
    return this._rightSideBar;
  }

  /**
   * Append all elements to the container and return the container
   * @returns {*|jQuery|HTMLElement}
   */
  render() {
    return this._$container;
  }
}
