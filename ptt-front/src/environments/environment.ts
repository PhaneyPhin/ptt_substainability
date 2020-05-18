// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

declare var api_endpoint: any;
declare var api_winauthendpoint: any;

export const environment = {
  production: false,
  cookieToken: '15bb723f2da17f8670d528ec1f6fa1b3',
  apiEndPoint: api_endpoint,
  apiWinAuthEndPoint: api_winauthendpoint,
  cookieExpire: 9999999999999
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
