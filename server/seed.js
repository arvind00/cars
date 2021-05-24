const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { DB_URL, DB_NAME } = require("./constants");


const init = async function () {
    const client = await MongoClient.connect(DB_URL, {
        userUnifiedTopolgy: true
    });

    console.log("connected successfully to db.");
    const db = client.db(DB_NAME);
    const result = await initiateSeeding(client, db);
    console.log("sedding completed");
    client.close();
};
init();


function initiateSeeding(client, db) {
    db.dropDatabase();
    console.log('database dropped successfully');
    db = client.db(DB_NAME);

    const folder = "./seeds/";
    let promiseArr = [];
    fs.readdirSync(folder).forEach(file => {
        let p = insertDocumentFromFile(db, folder, file);
        promiseArr.push(p);
    });
    return new Promise((resolve, reject) => {
        Promise.all(promiseArr).then(() => {
            console.log("all promises done");
            resolve("resolved");
        });
    });
}

function insertDocumentFromFile(db, folder, file) {
    let fileType = path.extname(file);
    const collectionName = getCollectionName(file);
    fileType = fileType.toUpperCase();
    let document = null;
    let filePath = path.join(folder, file);

    try {
        switch (fileType) {
            case ".JSON":
                console.log("got JSON file " + collectionName);
                let rawData = fs.readFileSync(filePath, { encoding: "utf8" });
                document = JSON.parse(JSON.stringify(rawData));
                document = transformToArray(document);
                break;
            case ".JS":
                console.log("got .JS file " + collectionName);
                const dataGetter = require(path.resolve(__dirname, filePath));
                document = dataGetter();
                break;
            default:
                console.log("supporte only json or js file types");
        }
    } catch (error) {
        console.log("Some error occuredd while reading file content ", error);
    }
    return new Promise((resolve, reject) => {
        if (document) {
            db.createCollection(collectionName, function (err, result) {
                if (err) reject(err);
                assert.equal(null, err);
                console.log(collectionName + " collection created");
                // now inserte data - document will alwasy be an array
                db.collection(collectionName).insertMany(document, (e, r) => {
                    assert.equal(null, e);
                    assert.equal(document.length, r.insertedCount);
                    console.log("data inserted into collection ", collectionName);
                    resolve(r);
                })
            })
        } else {
            resolve('resolve');
        }
    })
}

function getCollectionName(file) {
    let collectionName = file.split(".")[0];
    let index = collectionName.indexOf("_");
    if (index >= 1) {
        collectionName = collectionName.substring(index + 1);
    }
    return collectionName;
}

function transformToArray(document) {
    return eval(document);
}