import {Component} from '@angular/core';

@Component({
  selector: '[app-menu]',
  templateUrl: './menu.component.html',
  host: {
    'class': 'fixed md:relative z-40 h-screen md:h-auto p-4 md:p-0 overflow-y-auto bg-white md:bg-transparent w-80 md:w-auto transition-transform right-0 top-0 translate-x-full md:translate-x-0 md:justify-between md:items-center',
    'id': 'menu-container',
    'tabindex': '-1',
    'aria-hidden': 'true'
  }
})

export class MenuComponent {
  constructor() {}
}