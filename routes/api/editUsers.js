var express = require("express");
var router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/";



/* GET users listing. */
router.post("/", function (req, res, next) {
  if (req.body.email == "" ||
    req.body.email == "" ||
    req.body.name == "" ||
    req.body.name == "" ||
    req.body.oldEmail == "" ||
    req.body.oldEmail == "" ||
    req.body.oldName == "" ||
    req.body.oldName == "") {
    const data = {
      error: "email not found",
    };

    res.status(403);
    res.end(JSON.stringify(data));
  } else {
    const email = req.body.email;
    const name = req.body.name;
    const oldEmail = req.body.oldEmail;
    const oldName = req.body.oldName;

    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      const dbo = db.db("project");
      dbo
        .collection("users")
        .find({ email: oldEmail }, {})
        .toArray(function (err, result) {
          if (err) throw err;

          if (result.length <= 0) {
            const data = {
              error: "User dosent exist",
            };

            res.status(401);

            res.end(JSON.stringify(data));
          } else {
            MongoClient.connect(url, function (err, db) {
              if (err) throw err;
              var dbo = db.db("project");
              var query = { email: oldEmail, name: oldName };
              var newvalues = { $set: { name: name, email: email } };
              dbo.collection("users").updateOne(query, newvalues, function (err, result) {
                if (err) throw err;
                const data = {
                  status: "success",
                  message: "User Details Updated",
                };
                console.log("user updated");

                res.status(200);
                res.end(JSON.stringify(data));
                db.close();
              });
            });
          }

          db.close();
        });
    });
  }
});

module.exports = router;
