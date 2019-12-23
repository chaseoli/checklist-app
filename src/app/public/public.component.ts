import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  templateUrl: './public.component.html'
})
export class PublicComponent implements OnInit {

  @HostBinding('attr.class') cls = 'flex-fill';

  constructor() { }
  ngOnInit() { }

}
