import SideBar from './side-bar';
import ControlsPanel from './controls-panel';

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

  getLeftControlsPanel() {
    return this._leftControlsPanel;
  }

  getRightControlsPanel() {
    return this._rightControlsPanel;
  }

  getRightSideBar() {
    return this._rightSideBar;
  }

  render() {
    this._$container.append(this._rightSideBar.render());

    this._$controlsContainer.append(this._leftControlsPanel.render());
    this._$controlsContainer.append(this._rightControlsPanel.render());
    this._$container.append(this._$controlsContainer);

    return this._$container;
  }
}
