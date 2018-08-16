var express = require('express');
var app = express();
const fs = require('fs'), path = require('path');
const DATA_FILE = "data.json";
var moment = require('moment');

app.get('/get_rollnum', function (req, res) {
    fs.readFile(DATA_FILE, function (err, data) {
        if (err) {
            console.error(err);
        } else {
            const parseData = JSON.parse(data);
            res.send(parseData);
        }
    });
});

app.get('/get_record', function (req, res) {
    fs.readFile(DATA_FILE, function (err, data) {
        if (err) {
            console.error(err);
        } else {
            const parseData = JSON.parse(data);
            res.send(parseData);
        }
    });
});

app.get('/roll', function (req, res) {
    let rand = Math.random() * 1000
    let goodId = 9
    if (rand >= 0 && rand <= 40) {
        goodId = 1

    } else if (rand > 40 && rand <= 100) {
        goodId = 2

    } else if (rand > 100 && rand <= 180) {
        goodId = 3

    } else if (rand > 180 && rand <= 330) {
        goodId = 4

    } else if (rand > 330 && rand <= 480) {
        goodId = 5

    } else if (rand > 480 && rand <= 600) {
        goodId = 6

    } else if (rand > 600 && rand <= 730) {
        goodId = 7

    } else if (rand > 730 && rand <= 860) {
        goodId = 8

    } else if (rand > 860 && rand <= 1000) {
        goodId = 9

    }

    fs.readFile(DATA_FILE, function (err, data) {
        if (err) {
            console.error(err);
        } else {
            let timeStamp = moment();
            // let year = moment("2018-08-16T09:33:17.267Z").format('YYYY.MM.DD');
            // let time = (moment("2018-08-16T09:33:17.267Z").format('A') === 'AM' ? '上午' : '下午') + moment("2018-08-16T09:33:17.267Z").format('h:mm');
            // console.log(year + " " + time);
            const parseData = JSON.parse(data);

            if (parseData.rollNumber > 0) {
                parseData.rollNumber -= 1
                parseData.record.push({goodId: goodId, time_stamp: timeStamp, used: false})

                fs.writeFile(DATA_FILE, JSON.stringify(parseData), err => {
                    if (err) throw err;
                    res.send(parseData);
                });
            } else {
                res.send({rollNumber: 0, err: -1})
            }


        }
    });
});

var server = app.listen(3000, function () {

});