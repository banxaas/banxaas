import { Component } from '@angular/core';

@Component({
  selector: '[app-menu]',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  host: {
    class:
      'md:p-0 md:bg-transparent transition-transform md:justify-between md:items-center',
    id: 'menu-container',
    tabindex: '-1',
    'aria-hidden': 'true',
  },
})
export class MenuComponent {
  constructor() {}
}
