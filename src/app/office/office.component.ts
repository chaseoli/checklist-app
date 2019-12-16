import { Component, OnInit } from '@angular/core';
import { MediaObserver, MediaChange } from '@angular/flex-layout';

@Component({
  selector: 'app-office',
  templateUrl: './office.component.html',
  styleUrls: ['./office.component.scss']
})
export class OfficeComponent implements OnInit {

  name = 'Office';
  brand = 'Project';
  hasHamburger = true;
  options: [
    {
      content: 'Option 1',
      value: 1,
    },
    {
      content: 'Option 2',
      value: 2,
    },
    {
      content: 'Option 3',
      value: 3,
    }
  ];

  showTerminal: boolean;

  // page resize watcher
  resizeWatcher: any;
  activeMediaQuery: any;

  constructor(
    public mediaObserver: MediaObserver
  ) {


    this.resizeWatcher = mediaObserver.media$.subscribe((change: MediaChange) => {
      this.activeMediaQuery = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
      if (this.activeMediaQuery) {
        this.resizeView(change.mqAlias);
      }

    });
  }

  ngOnInit() {
  }

  /**
   * Open and close panel for terminal
   *
   * @memberof AppComponent
   */
  toggleTerminal() {
    this.showTerminal = !this.showTerminal;
  }

  /**
   * clean up angular processes
   *
   * @memberof AppComponent
   */
  ngOnDestroy() {
    this.resizeWatcher.unsubscribe();
  }

  /**
   * Fires function when the view port size changes
   *
   * @param {string} size
   * @memberof AppComponent
   */
  resizeView(size: string) {

    // Do something special since the viewport is currently
    // using mobile display sizes
    console.log('is ' + size);

    if (size === 'xs') {
      this.name = ''
    } else {
      this.name = 'Office'
    }

  }

  /**
   * Takes in url and opens it in a new tab
   *
   * @memberof AppComponent
   */
  newTab(url: string) {
    window.open(url, "_blank");
  }

}
