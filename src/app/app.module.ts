import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, Injector, NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {DisplayComponent} from './modules/dashboard/display/display.component';
import {SettingsComponent} from './modules/dashboard/settings/settings.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule, MatDividerModule, MatExpansionModule,
  MatFormFieldModule,
  MatIconModule, MatInputModule,
  MatMenuModule,
  MatOptionModule, MatProgressBarModule,
  MatSelectModule,
  MatSidenavModule,
  MatToolbarModule
} from '@angular/material';
import {StateWatchService} from './services/state-watch.service';
import {SocketIoModule, SocketIoConfig} from 'ngx-socket-io';
import {Box1Component} from './dynamic-components/box1/box1.component';

import {createCustomElement} from '@angular/elements';

const config: SocketIoConfig = {url: 'http://localhost:3700', options: {}};

@NgModule({
  declarations: [
    AppComponent,
    DisplayComponent,
    SettingsComponent,
    Box1Component
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatDividerModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [
    StateWatchService
  ],
  entryComponents: [
    Box1Component
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(private injector: Injector) {

    const elmt = createCustomElement(Box1Component, {injector: this.injector});
    customElements.define('customer-box1', elmt);

  }
}
