# The system is only intended for one user. 

## Status
Fully implemented.

## Context
Currently, there is no authentication needed in order to view the system, edit or delete any notes. This means that anyone who gains access to the program can change what notes are stored in the database which potentially means losing valuable data.

## Decision
We assumed that the program runs locally on to a system and stores information on a database that does not interact with databases of other users.

## Consequences
The consequences of this assumption is that we, as programmers, are able to focus on developing the program for the cloud as opposed to on a feature that the customer did not ask for. If time allowed, this could be improved upon by creating a login page and authenticating users before any changes are made to the database as well as before allowing a user to access it.
