# Discord Notification System

## Status
Designed but not implemented.

## Context
Currently there is not immediate confirmation that a note has been added to the database without performing a query on the table itself to check. This means that if a note is not actually added and the user quits the program, than the user will lose that note.

## Decision
Due to this, we decided to design a notification system that would allow the user to recieve a notification on Discord that their note has been added to the system. This is based on the assumption that the user has a Discord account and the company's firewall allows the user to access the service.

## Consequences
As the design has not been implemented, there are no consequences to the user or system at the moment. If the system was to be implemented, the consequences would include an additional post request in a function that is triggered when a note is added (see aaf-internal-notes-system/notification.md for full write up) causing ever so slightly more data traffic on the system, but not a significant amount.
