var http = require('http');
var querystring = require('querystring');
var escape_html = require('escape-html');
var serveStatic = require('serve-static');
var crypto = require('crypto');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('notes.sqlite');


// Serve up public folder
var servePublic = serveStatic('public', {
  'index': false
});

function renderNotes(req, res, authCode) {
    db.all("SELECT rowid AS id, text FROM notes", function(err, rows) {
        if (err) {
            res.end('<h1>Error: ' + err + '</h1>');
            return;
        }
        res.write('<link rel="stylesheet" href="style.css">' +
                  '<h1>AAF Notebook</h1>' +
                  '<form method="POST">' +
                  '<label>Note: <input name="note" value=""></label>' +
                  '<button>Add</button>' +
                  '</form>'
                  );
        if (res.statusCode == 400) {
            res.write('Please provide a note to add.')
        }
        res.write(                    
            '<form method=POST>' +
            `<button type="submit" name="id" value="-1|${authCode}">Delete All</button>` +
            '</form>'
        );
        res.write('<ul class="notes">');
        rows.forEach(function (row) {
            //console.log(row.id);
            res.write('<li>' + escape_html(row.text) +
                      '<form method=POST>' +
                      `<button type="submit" name="id" value="${row.id}|${authCode}"> DELETE </button>` +
                      '</form>' +
                      '</li>'
            );
        });
        res.end('</ul>');
    });
}

var authCode = null;

var server = http.createServer(function (req, res) {

    function setAuthCode() {
        authCode = null;
        values = crypto.webcrypto.getRandomValues(new Uint8Array(10));
        for (val of values) {
            authCode += val
        }

        return authCode;
    }

    function checkAuthCode(code) {
        return code == authCode;
    }

    servePublic(req, res, function () {
        if (req.method == 'GET') {
            res.writeHead(200, {'Content-Type': 'text/html'});
            renderNotes(req, res);
        }
        else if (req.method == 'POST') {
            var body = '';
            req.on('data', function (data) {
                body += data;
                if (body.length > 16384) {
                    body = body.substring(0, 16384)
                }
            });
            req.on('end', function () {
                var form = querystring.parse(body);

                if (!form.id) {
                    if (form.note.length > 1) {
                        db.run('INSERT INTO notes VALUES (?);',[form.note], function (err) {
                    
                        console.error(err);
                        res.writeHead(201, {'Content-Type': 'text/html'});
                        renderNotes(req, res, setAuthCode());
                    });
                    } else {
                        res.writeHead(400, {'Content-Type': 'text/html'});
                        renderNotes(req, res, setAuthCode());
                    }
                }

                if (form.id && body.includes('%7C')) {
                    formArray = body.split('%7C')
                    var formId = formArray[0].substring(3)
                    var auth = formArray[1]

                    if (!checkAuthCode(auth)) {
                        res.writeHead(401, {'Content-Type': 'text/html'});
                        renderNotes(req, res, setAuthCode());
                        return;
                    }

                    if (formId == -1) {
                        db.exec("DELETE FROM notes", function (err) {
                            console.log(err);
                            res.writeHead(200, {'Content-Type': 'text/html'});
                            renderNotes(req, res, setAuthCode());
                        });
                    } else {
                        db.exec(`DELETE FROM notes WHERE rowid="${formId}"`, function(err) {
                            console.log(err);
                            res.writeHead(200, {'Content-Type': 'text/html'});
                            renderNotes(req, res, setAuthCode());
                        });
                    }
                }
            });
        }
    });
});


// initialize database and start the server
db.on('open', function () {
    db.run("CREATE TABLE notes (text TEXT)", function (err) {
        console.log('Server running at http://127.0.0.1:8080/');
        server.listen(8080);
    });
});
