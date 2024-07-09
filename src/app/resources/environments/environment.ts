// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  payfastEndpoint: 'https://sandbox.payfast.co.za/eng/process',
  payfastOnsiteEndpoint: 'https://sandbox.payfast.co.za/onsite/process',

  squareEndpoint: 'https://connect.squareupsandbox.com/v2',
  squareLocationId: 'LY08KERFHW5CH',
  squareApplicationId : 'sandbox-sq0idb-_U1VgYf_ka9bIXDwk-g7MA'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
