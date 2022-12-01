import {Component} from '@angular/core';

@Component({
  selector: '[app-hamburger]',
  templateUrl: './hamburger.component.html',
  host: {
    'class': 'inline-flex items-center p-2 text-white rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-green-600',
    'data-drawer-target': 'menu-container',
    'data-drawer-show': 'menu-container',
    'data-drawer-backdrop': 'false',
    'data-drawer-placement': 'right',
    'aria-controls': 'menu-container'
  }
})

export class HamburgerComponent {
  constructor() {}
}