// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // URL GATEWAY
  // apiUrl: 'http://localhost:9000/',

  // URL BACKEND
  // apiUrl: 'http://localhost:8000/api/',

  // URL SERVER TEST
  apiUrl: 'http://test.banxaas.com:9000/',

  // URL WebSocket
  // webSocketUrl: 'ws://localhost:9000/ws/',

  // URL Websocket
  webSocketUrl: 'ws://test.banxaas.com:9000/ws/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
