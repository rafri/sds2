# aaf-internal-notes-system
ACME Automotive Finance's internal notes system

This is the in-house software used by our accounting team to record their daily activites. It allows staff to add and delete notes from a centralized database accessible via the web.

---

## Installation

Node.JS is required to run this software, which can be downloaded [here](https://nodejs.org/en/download/).

Then, once installed, navigate to your chosen folder and execute these commands in the terminal:

```
git clone https://github.com/Curtis73/aaf-internal-notes-system.git
cd 01-notebook
npm install
npm start
```

Once running, you can access the web interface at http://127.0.0.1:8080 by default.

Should you wish to modify the code, all of the JavaScript is contained in the `server.js` file, and the css is contained under `public/style.css`.

---

## Database Schema
This software uses a single, simple SQLite3 Database. The schema is as follows:

| rowid (PK) | note                 |
| ---        | ---                  |
| 0          | This is a note.      |
| 1          | This is also a note. |

The **rowid** column stores the primary key, used to identify each note, and the **notes** column contains the note.
