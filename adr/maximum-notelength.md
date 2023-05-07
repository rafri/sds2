# Set a maximum note length of 16,384 characters

## Status

Accepted & Implemented

## Context

It is currently possible for notes to be of an unlimited length, which means it's possible for anyone to submit a note of obscene length (100,000+ characters), which will then be rendered on the page.

This means that if a malicious user were to get access to the system, they would be able to flood the system with long notes (especially as there's no form of cooldown or rate-limiting), which will make it near impossible for legitimate users to view their own notes or utilise the system at all.

Furthermore, if the database does get flooded, the SQL database will significantly increase in size and take up more unnecessary drive space.

## Decision

What is the change that we're proposing and/or doing?

We're proposing a maximum limit on the number of characters that can be submitted in a note, which would prevent malicious users from flooding the page (and the database) with nonsensical notes, which would disrupt the operations of the finance team.

We suggest the maximum character limit should be 16,384, as our testing has shown that notes of this length won't absolutely flood the screen, and that number should be more than enough for the day-to-day note taking activities of the finance team.

## Consequences

There is no longer a risk of the notes page becoming flooded with notes that could be potentially tens of thousands of characters long, however, the truncation down to approximately 16,384 characters could potentially impact the legitimate use of the application **if** anyone on the finance team does want to create a note that's incredibly long for whatever reason.

However, if this does prove to be an issue for anyone, it can easily be mitigated by changing the maximum length on one line of code.