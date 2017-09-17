CREATE TABLE IF NOT EXISTS Type (
    id INTEGER PRIMARY KEY, 
    instruct TEXT NOT NULL,
    multiple INTEGER NOT NULL,
    attachment TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Reference (
    id TEXT PRIMARY KEY, 
    apa TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Question (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
        ON DELETE CASCADE
); 
