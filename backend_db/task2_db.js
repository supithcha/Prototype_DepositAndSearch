const express = require('express');
const path = require('path');
const dotenv = require("dotenv");
const app = express();
dotenv.config();
const router = express.Router();
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const secret = "ThaiRailways";

const cors = require('cors');
app.use(cors());

var dbConn = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    // host: '127.0.0.1',
    // user: 'root',
    // database: process.env.MYSQL_DATABASE
});

dbConn.connect(function (err) {
    if (err) throw err;
    console.log(`Connect DB: ${process.env.MYSQL_DATABASE}`)
});

app.use(router);
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

app.listen(process.env.PORT, function () {
    console.log(`Server listening on port: ${process.env.PORT}`)
});

router.use(express.static(__dirname));
router.get('/', (req, res) => {
    res.send('Port work');
    console.log('Someone accessed localhost: 3000')
});


router.post('/db_login', function (req, res) {
    let username = req.body.username;
    dbConn.query('SELECT * FROM user_account WHERE USER_USERNAME = ? AND USER_PW = ?', [req.body.username, req.body.password],
        function (error, results, fields) {
            if (error) {
                res.json({ 'status': 'error', 'message': error })
            } else if (results.length == 0) {
                res.json({ 'status': 'error', 'message': 'Invalid username or password' })
            } else {
                //create token
                let tokens = jwt.sign({ username }, 'secretkey', { expiresIn: '1h' });
                res.json({ status: 'success', token: tokens, message: 'Login Success' })
                console.log(req.body.username);
                console.log(req.body.password);
            }
        });
});

router.post('/db_authen', function (req, res) {
    try {
        let checktoken = req.headers.authorization.split(' ')[1];
        let decoded = jwt.verify(checktoken, 'secretkey');
        res.json({ status: 'success', message: 'Token is valid' })
    }
    catch (err) {
        res.json({ status: 'error', message: 'Token is invalid' })
    }
});

//SELECT ticket
router.post('/gettickets', function (req, res) {
    let ORI_STATION = req.body.destation;
    let DEST_STATION = req.body.terstation;
    let DEPART_DATE = req.body.datesearch;
    dbConn.query('SELECT * FROM train_schedule', function (error, results, fields) {
        if (error)
            throw error;
        else {
            console.log(results)
            //create empty json
            let query_json = [];
            let count = 0;
            for (let i = 0; i < results.length; i++) {
                if (ORI_STATION != "" && ORI_STATION != results[i].ORI_STATION) {
                    continue;
                }
                if (DEST_STATION != "" && DEST_STATION != results[i].DEST_STATION) {
                    continue;
                }
                if (DEPART_DATE != "" && DEPART_DATE != results[i].DEPART_DATE) {
                    continue;
                }
                query_json[count] = results[i];
                count++;
            }
            return res.send({ status: 'success', data: query_json, message: 'Tickets list.' });
        }
    });
});

router.get('/userinfo', (req, res) => {
    // const user_id = req.session.user_id; // retrieve user_id from the session
    //console.log("Session Object before deposit:", req.session);
    // console.log("User ID:", user_id);
    // Extract the token from the authorization header
    const token = req.headers.authorization.split(' ')[1];
    // Verify the token to get the payload, which includes the username
    jwt.verify(token, 'secretkey', function (err, decoded) {
        if (err) {
            res.json({ 'status': 'error', 'message': 'Token is invalid' });
        } else {
            // Retrieve the username from the decoded payload
            const username = decoded.username;
            // First query to get USER_ID
            dbConn.query('SELECT * FROM user_account WHERE USER_USERNAME = ?', [username], function (error, results, fields) {
                if (error) {
                    res.json({ 'status': 'error', 'message': error });
                } else {
                    if (results.length > 0) {
                        return res.send({ status: 'success', data: results, message: 'Credit card' });

                    } else {
                        res.json({ 'status': 'error', 'message': 'User not found' });
                    }
                }
            });
        }
    });
});

//Get deposit balance
router.post('/deposit', function (req, res) {
    // Extract the token from the authorization header
    const token = req.headers.authorization.split(' ')[1];

    // Verify the token to get the payload, which includes the username
    jwt.verify(token, 'secretkey', function (err, decoded) {
        if (err) {
            res.json({ 'status': 'error', 'message': 'Token is invalid' });
        } else {
            // Retrieve the username from the decoded payload
            const username = decoded.username;

            // First query to get USER_ID
            dbConn.query('SELECT * FROM user_account WHERE USER_USERNAME = ?', [username], function (error, results, fields) {
                if (error) {
                    res.json({ 'status': 'error', 'message': error });
                } else {
                    if (results.length > 0) {
                        const USER_ID = results[0].USER_ID; // Retrieve USER_ID from the result
                        const USER_CREDITCARDNUM = results[0].USER_CREDITCARDNUM;
                        const depositAmount = req.body.amountmoney;
                        // Second query to get wallet information using USER_ID
                        dbConn.query('SELECT * FROM virtual_wallet WHERE USER_ID = ?', [USER_ID], function (error, walletResults, fields) {
                            if (error) {
                                throw error;
                            } else {
                                if (walletResults.length > 0) {
                                    // Extract wallet details
                                    const WALLET_ID = walletResults[0].WALLET_ID;
                                    let previousBalance = walletResults[0].TOTAL_WALLET_BALANCE;
                                    const rewardBalance = walletResults[0].TOTOAL_REWARD_BALANCE;
                                    // Calculate the new balance
                                    const newBalance = parseFloat(previousBalance) + depositAmount;
                                    // Check if the total balance exceeds the limit
                                    if (newBalance > 1000000) {
                                        return res.send({
                                            'status': 'error',
                                            data: [{
                                                USER_ID: USER_ID,
                                                WALLET_ID: WALLET_ID,
                                                TOTAL_WALLET_BALANCE: previousBalance,
                                                TOTOAL_REWARD_BALANCE: rewardBalance
                                            }],
                                            'message': 'Total balance exceeds 1,000,000 Baht'
                                        });
                                    }
                                    // Update the wallet with the new balance
                                    dbConn.query('UPDATE virtual_wallet SET TOTAL_WALLET_BALANCE = ? WHERE USER_ID = ?', [newBalance, USER_ID], function (error, updateResult, fields) {
                                        if (error) {
                                            throw error;
                                        }
                                        else {
                                            // Return the updated wallet information
                                            return res.send({
                                                status: 'success',
                                                data: [{
                                                    USER_ID: USER_ID,
                                                    WALLET_ID: WALLET_ID,
                                                    TOTAL_WALLET_BALANCE: newBalance,
                                                    TOTOAL_REWARD_BALANCE: rewardBalance,
                                                    amountmoney: depositAmount
                                                }],
                                                message: 'Deposit success.'
                                            });
                                        }
                                    });
                                } else {
                                    res.json({ 'status': 'error', 'message': 'Wallet not found for the user' });
                                }
                            }
                        });
                    } else {
                        res.json({ 'status': 'error', 'message': 'User not found' });
                    }
                }
            });
        }
    });
});


router.use((req, res, next) => {
    res.status(404)
})

module.exports = router;

