const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/";

/* GET users listing. */
router.get("/", function (req, res, next) {

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    const dbo = db.db("project");

    dbo
      .collection("users")
      .find({}, { projection: { password: 0 } })
      .toArray(function (err, result) {
        if (err) throw err;

        if (result.length <= 0) {
          const data = {
            error: "no user found",
          };
          res.status(401);
          res.end(JSON.stringify(data));
        } else {
          res.status(200);
          res.end(JSON.stringify(result));
        }

        db.close();
      });
  });

});

router.post("/", function (req, res, next) {
  res.end("try Get request");
});


module.exports = router;
