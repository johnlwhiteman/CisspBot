"use strict";
let sqlite3 = require("sqlite3").verbose();
let fs = require("fs");

class Database {

    constructor(dbPath, dbDataPath) {
        this.dbPath = dbPath;
        this.dbDataPath = dbDataPath;
        this.db = null;
    }

    create(deleteIfExists=false) {

        if (this.exists() && !deleteIfExists) {
            console.log("Database->create(): Database already exists");
            return 0;
        }

        this.drop();

        let db = new sqlite3.Database(this.dbPath);
        let json = require(this.dbDataPath);
        let cb = function(error) {if (error){console.log(error);}};

        db.serialize(function() {

            // Create Question Types Table
            db.run(`CREATE TABLE IF NOT EXISTS Type (
                    id INTEGER PRIMARY KEY,
                    instruct TEXT NOT NULL,
                    multiple INTEGER NOT NULL,
                    attachment TEXT NOT NULL);`, cb);

            // Create References Table
            db.run(`CREATE TABLE IF NOT EXISTS Reference (
                    id TEXT PRIMARY KEY,
                    apa TEXT NOT NULL);`, cb);

            // Create Questions Table
            db.run(`CREATE TABLE IF NOT EXISTS Question (
                    id INTEGER PRIMARY KEY NOT NULL,
                    typeID INTEGER NOT NULL,
                    question TEXT NOT NULL,
                    a TEXT NOT NULL,
                    b TEXT NULL,
                    c TEXT NULL,
                    d TEXT NULL,
                    e TEXT NULL,
                    answer TEXT NOT NULL,
                    allnoneabove INTEGER NOT NULL,
                    domain TEXT NULL,
                    referenceID TEXT NULL,
                    CONSTRAINT fkType
                        FOREIGN KEY(typeID)
                        REFERENCES Type(id)
                        ON UPDATE CASCADE,
                    CONSTRAINT fkReference
                        FOREIGN KEY(referenceID)
                        REFERENCES Reference(id)
                        ON DELETE CASCADE);`, cb);

            // Insert Question Types
            for (let i in json.Type) {
                let id = parseInt(json.Type[i].id.trim());
                let instruct = json.Type[i].instruct.trim();
                let multiple = parseInt(json.Type[i].multiple.trim());
                let attachment = json.Type[i].attachment.trim();
                let stmt = db.prepare(`INSERT INTO Type VALUES (?, ?, ?, ?)`, cb);
                stmt.run(id, instruct, multiple, attachment, cb);
                stmt.finalize(cb);
            }

            db.each("SELECT instruct FROM Type", function(err, row) {
                console.log("Type: " + row.instruct);
            });

            // Insert References
            for (let i in json.Reference) {
                let id = json.Reference[i].id.trim();
                let apa = json.Reference[i].apa.trim();
                let stmt = db.prepare(`INSERT INTO Reference VALUES (?, ?)`, cb);
                stmt.run(id, apa, cb);
                stmt.finalize(cb);
            }

            db.each("SELECT apa FROM Reference", function(err, row) {
                console.log("Reference: " + row.apa);
            });

            // Insert Questions
            for (let i in json.Question) {
                let q = json.Question[i];
                let typeID = parseInt(q.typeID.trim());
                let question = q.question.trim();
                let a = q.a.trim();
                let b = q.b.trim();
                let c = q.c.trim();
                let d = q.d.trim();
                let e = q.e.trim();
                let answer = q.answer.join();
                let allnoneabove = parseInt(q.allnoneabove);
                let domain = q.domain.trim();
                let referenceID = q.referenceID.trim();
                let stmt = db.prepare(
                `INSERT INTO Question(typeID, question, a, b, c, d, e, answer, allnoneabove, domain, referenceID)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, cb);
                stmt.run(typeID, question, a, b, c, d, e, answer, allnoneabove, domain, referenceID, cb);
                stmt.finalize(cb);
            }

            db.each("SELECT question FROM Question", function(err, row) {
                console.log("Question: " + row.question);
            });

        });

        db.close();
    }

    drop() {
        if (fs.existsSync(this.dbPath)) {
            fs.unlinkSync(this.dbPath);
        }
    }

    handleError(error) {
        if (error) {
            console.log("Error: ", error);
        }
    }

    exists() {
        return fs.existsSync(this.dbPath);
    }

    static _handleError(error) {
        if (error) {
            console.log(error);
        }
    }
}
const DBPATH = "./cissp.db";
const DBDATAPATH = "./cissp.json";
let db = new Database(DBPATH, DBDATAPATH);
db.create(true);
