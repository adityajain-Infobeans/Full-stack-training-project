const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/";

/* GET users listing. */
router.get("/", function (req, res, next) {
    if (req.query.email == "" || req.query.email === undefined) {
        const data = {
            error: "email not found",
        };

        res.status(403);
        res.end(JSON.stringify(data));
    } else {
        const email = req.query.email;

        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            const dbo = db.db("project");

            dbo
                .collection("users")
                .find({ email: email }, { projection: { password: 0 } })
                .toArray(function (err, result) {
                    if (err) throw err;

                    if (result.length > 0) {
                        MongoClient.connect(url, function (err, db) {
                            if (err) throw err;
                            var dbo = db.db("project");
                            dbo.collection("users").deleteOne({ email: email }, function (err, obj) {
                                if (err) throw err;
                                res.status(200);
                                let data = {
                                    status: "success",
                                    message: "User Successfully deleted"
                                }
                                res.end(JSON.stringify(data));
                                db.close();
                            });
                        });
                    } else {
                        res.status(404);
                        let data = {
                            status: "error",
                            message: "User dosent exist"
                        }
                        res.end(JSON.stringify(data));
                    }

                    db.close();
                });
        });
    }
});

router.post("/", function (req, res, next) {
    res.end("try Get request");
});

module.exports = router;
