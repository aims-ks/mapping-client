import SideBar from './side-bar';
import ControlsPanel from './controls-panel';

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

    this._leftControlsPanel = new ControlsPanel('left');
    this._rightControlsPanel = new ControlsPanel('right');
    this._rightSideBar = new SideBar('right');
  }

  /**
   * Return the left control panel
   * @returns {ControlsPanel}
   */
  getLeftControlsPanel() {
    return this._leftControlsPanel;
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
    this._$container.append(this._rightSideBar.render());

    this._$controlsContainer.append(this._leftControlsPanel.render());
    this._$controlsContainer.append(this._rightControlsPanel.render());
    this._$container.append(this._$controlsContainer);

    return this._$container;
  }
}
