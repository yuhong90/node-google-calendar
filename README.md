# node-google-calender
Simple node module that manages google calender events

## Using Service Accounts
This module does server to server authentication with Google APIs without any users being involved. 
When using Google APIs from the server (or any non-browser based application), authentication is performed through a Service Account, which is a special account representing your application. 

1. Create a service account if you dont have one. For more information about service accounts and server-to-server interactions such as those between a web application and a Google service: https://developers.google.com/identity/protocols/OAuth2ServiceAccount#authorizingrequests

2. A public/private key pair is generated for the service account, which is created from the Google API console. Take note of the service account's email address and store the service account's P12 private key file in a location accessible to your application. Your application needs them to make authorized API calls.

3. If a user wants to give access to his Google Calendar to your application, he must give specific permission for that calender to the the Service Account using the supplied email address.

## Authentication to Google APIs done with JWT
When using OAuth2, authentication is performed using a token that has been obtained first by submitting a JSON Web Token (JWT), using [google-oauth-jwt](https://github.com/extrabacon/google-oauth-jwt).


