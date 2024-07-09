## Programme notes

users cannot register like conventional websites thus

the program comes set up with a default user or alternatively can use your personal email for two factor auth to work
username/email: [admin@admin]
or
username/email: [personalemail@example.com]
password: [Admin123!]

password to downloaded reports is [123456]

[NB] DO NOT MODIFY AUTHENTICATION SERVICE, API SERVICE, OR AUTH-SERVICES

## Still to do:

[0] delete restrict is needed on stock Category. i can delete a printer category and all the other stock will go along with it **_very important_**
the help button in navbar in techician and inventory clerk screens must be a pdf document not an FAQ **_important_**

indepth validation: parts request and other non crud components **_important_**
sales and purchase report datetime pickers dont work if the clear button is clicked as the value is empty and cannot compare the value with "" as it is of type date and not string. and when converted to a string an error is given for type conversions being invalid
determine how long the error codes will be for validation
fix cart values not displaying when page is refreshed **_important_**

[1] implement help across the system **_important_**

[2] client Interfaces: **_all important_**
chatbot to be made and error handling to be done for if its trying to be used without the api being connected
and then implement payment history for paid for repairs
view error log status screen to be created -- **_Done_**
client should be able to assign a printer to a branch
do something about payment methods when selecting
and Fix search function in payment history

[3] stock order delete for individual stock items needs to be implemented. currently deletes everyting in table in stock order page
and fix "No actions" text not showing up when technician cannot complete repair due to statuses on the technician pruchase order screen

[3.14159] eye lyk two mooove et mooove et

[4] Technician interface: 
must book out the printer before leaving the depo on top of the inventory clerk doing it **_important_**

[5] Inventory Clerk Interface:
must change screen so book in and out printer are under a button called printer management, and book in and out stock, parts requests and stock orders(to be created) are under a button called stock management

[6] 
tweakk all other search funtions to seach on getAll...() api calls and filter in the typescript files
Fix loading screen. first implemented in client.component


[7] Fix repair report to look like the rest.
get a spell checker or text predictor on input fields.

[8] make sales and purchase report (control break section) more readable and make sure it works **_important_**

[9] 

[10] ting tang walla walla bing bang

[999] optimise code:
fix view table responsiveness on smaller screens and fix table column sizing for cells overlapping like email addresses and fix button sizes on smaller screens like .btnSecondary and .btnSubmit **_important_**
and create, update and other table button need to be styled as they use the default bootstrap styling.
might have to find a new way of implimenting the navbar entirely and furthermore decide on whether to have it as a sticky element or fixed.
navbar needs ease out feature. btnSubmitText class might be removable when styling is done.
Delete/Confirm button toggle functionality needs to be copied from [view-client.componant] to all other view screens (may need to be removed if cannot be fixed)
pagination or scroll bar to be added on all view and crud tables throughout programme instead of scroll bar
move `async getEmployee()` to the employee service
implements get functions and other service function in the ngOnInit() functions throughout the programme to optimise api retreivals otherwise there is a chance of failure and programme crashing
why was technician name not displayed on the tsr????? **_important_**
indicate important field **_important_**
completely rework the entire programme and add a boolean value to the token being sent for logged in users to know if they are verfied from the two factor auth. currently logging in twice. once to check if user is correct and a second time after checking the two factor code to be correct
must make the login and two factor code screen children components of one component
implement lazy loading: `https://angular.io/guide/lazy-loading-ngmodules` to make the application faster **_would be nice_**

## Colour Pallate:

Primary pallete:

Orange: `rgb(162, 125, 55)`
DarkSlateGray: `rgb(45, 78, 86)`
Light Blue:`rgb(48,238,226)`
white: `rgb(255, 255, 255)`
black:

Secondary pallete:

Gold:
Goldenrod: `rgb(183, 144, 71)`
Navy-black: `rgb(35, 31, 31)`

## Helpful Sites:

https://www.tiny.cloud/docs/tinymce/6/installation/
https://ckeditor.com/export-to-pdf-word/#demos

[padfMake_playground] http://pdfmake.org/playground.html
[jspdf_playground] https://rawgit.com/MrRio/jsPDF/master/

[materialforms_design] https://www.youtube.com/watch?v=8ThVof0Rz64
->https://www.youtube.com/playlist?list=PLMfYS2BAyfF96g4OTUORf1jdr-FPZe7Q0

https://cheatsheets.shecodes.io/
https://gradients.shecodes.io/
https://palettes.shecodes.io/

https://uiverse.io

https://moderncss.dev/

https://mdbootstrap.com/
https://material.angular.io/
https://m2.material.io/components
https://www.angularjswiki.com/angular/angular-material-icons-list-mat-icon-list/

https://developers.google.com/fonts/docs/material_icons

https://developer.squareup.com/docs/build-basics/access-tokens

https://fonts.google.com/?selected=Material+Symbols+Outlined:arrow_back:FILL@0;wght@0;GRAD@0;opsz@NaN&icon.platform=web&icon.query=back&icon.style=Outlined&icon.set=Material+Symbols

https://www.w3schools.com/cssref/css_entities.php

reactive forms:
https://youtu.be/d39mapIdLes

## page styles

[NB] overall new application desing:
https://codepen.io/havardob/pen/ExvwGBr

landing page design:
https://codepen.io/Sicontis/pen/WNOWeXL

vat and labour rate interface style:
https://codepen.io/equinusocio/pen/MYNaNx

mobile app menu:
https://codepen.io/virgilpana/pen/NPzodr/

FAQ interface style:
https://codepen.io/ludmila-tretyakova/pen/pozgNOq

on page help (popovers):
https://ng-bootstrap.github.io/#/components/popover/examples

contact us:
https://codepen.io/JonLehman/pen/yOdbOG

smtp
https://www.youtube.com/watch?v=uWQcgmkezRk

## payfast payment gateway api

https://sandbox.payfast.co.za/dashboard
https://developers.payfast.co.za/documentation/

## barcode scanner api's:

https://www.scandit.com/developers/

[nb] https://www.dynamsoft.com/barcode-reader/sdk-javascript/?utm_term=barcode%20scanner%20api%20for%20web%20application&utm_campaign=19805640930&utm_source=google&utm_medium=cpc&hsa_acc=1000814248&hsa_cam=19805640930&hsa_grp=152570725408&hsa_ad=651144528368&hsa_src=g&hsa_tgt=kwd-1238666360554&hsa_kw=barcode%20scanner%20api%20for%20web%20application&hsa_mt=b&hsa_net=adwords&hsa_ver=3&gad=1&gclid=EAIaIQobChMIvtC1wdbR_wIV1uZ3Ch2wnQBpEAAYASAAEgKC4_D_BwE

-> https://www.dynamsoft.com/barcode-reader/docs/web/programming/javascript/samples-demos/HelloWorld-angular.html?ver=latest
--> use Hello Wotld folder

[nb] https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API

## Installations:

install angular materials... link for [Angular-cli] on google somewhere lol

run `npm install bootstrap bootstrap-icons` in terminal.
`npm install @angular/cdk`
`npm install @angular/material`

add the following code in the angular.json file:

"styles": [
"node_modules/bootstrap/scss/bootstrap.scss",
"node_modules/bootstrap-icons/font/bootstrap-icons.css",
"src/styles.scss"
],
"scripts": [
"node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
]

####then you can import in components:

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

imports: [
BrowserModule,
NgbModule,
AppRoutingModule,
],

OR!!!!!!!!!!!!!!!!!!!!!!!

use CDN in the index.html from:

https://getbootstrap.com/docs/4.6/getting-started/download/

and some other stuff.. i think
