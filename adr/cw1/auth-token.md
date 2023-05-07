# Require a form of authentication for all POST operations

## Status

Accepted & Implemented

## Context

It's currently possible for someone to carry out a CSRF (Cross-Site Request Forgery) attack against the application by submitting a HTTP POST request to the server using `curl` or any other utility that allows you to carry out HTTP methods.

This means that anyone who knows the IP of the web server is free to create or delete notes as they please.

## Decision

To fix this, we propose implementing some form of authentication between the client and the server to ensure that only authorised users accessing the notes system through the web interface are able to create and delete notes.

The use of cookies was originally considered, but that would require converting the application to run off ExpressJS for the backend, and the backend would also need to be almost completely re-written to accommodate this.

Instead, we're going with a simpler solution - when the client <-> server connection is made, the server will generate a cryptographically secure authentication code. This code will be passed between server and client, will be updated with each request to make sniffing ineffective, and all POST requests to the server will contain this code.
If there is a mismatch between the server's auth token and the client's auth token, then the POST operation (Create note, delete note, or delete all notes) will not go ahead, and instead a HTTP 401 Unauthorized will be returned.

We believe that our chosen method of authentication works for the application as it is now, but it's not as secure as cookie-based authentication, and if the application was going to be updated to be multi-user in the future, then cookies are definitely something worth considering.

## Consequences

This has no consequences for legitimate users of the application - they will be able to access and use it exactly as they were before this change.

However, anyone trying to submit a POST request to the server without a valid authentication key will be rejected, and the only way to interact with the database & server backend from now on will be through the website.