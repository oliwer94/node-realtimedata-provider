/*jshint esversion: 6 */
const axios = require('axios');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const _ = require('lodash');

const { Users } = require('./utils/user');
const port = process.env.PORT || 6001;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(bodyParser.json());

app.enable('trust proxy');

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", process.env.CORS); //<-- you can change this with a specific url like http://localhost:4200
    res.header("Access-Control-Allow-Credentials", "true");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});


//to everyone in the room
//io.to(params.room).emit();
//to everyone but sender in the room
//socket.broadcast.to(params.room).emit();

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('join', (params, callback) => {

        //country or region ranking live feed
        socket.join(params.room.toLowerCase());
        console.log(params.name, socket.id, params.room);

        //global live feed
        socket.join("global");

        users.removeUser(socket.id);
        users.removeUserByName(socket.id);
        users.adduser(socket.id, params.name, params.room.toLowerCase());

        callback();
    });

    socket.on('disconnect', () => {
        var user = users.removeUser(socket.id);
        console.log(socket.id + " disconnected");
        if (user != undefined && user.name) {
            io.sockets.emit('users_count', user.name);
        }
    });
});

app.get('/getCountry', function (req, res) {

    axios.get(`https://ipinfo.io/${req.ip}`).then((info) => {
        var obj = JSON.parse(`{"BD": "Bangladesh", "BE": "Belgium", "BF": "Burkina Faso", "BG": "Bulgaria", "BA": "Bosnia and Herzegovina", "BB": "Barbados", "WF": "Wallis and Futuna", "BL": "Saint Barthelemy", "BM": "Bermuda", "BN": "Brunei", "BO": "Bolivia", "BH": "Bahrain", "BI": "Burundi", "BJ": "Benin", "BT": "Bhutan", "JM": "Jamaica", "BV": "Bouvet Island", "BW": "Botswana", "WS": "Samoa", "BQ": "Bonaire, Saint Eustatius and Saba ", "BR": "Brazil", "BS": "Bahamas", "JE": "Jersey", "BY": "Belarus", "BZ": "Belize", "RU": "Russia", "RW": "Rwanda", "RS": "Serbia", "TL": "East Timor", "RE": "Reunion", "TM": "Turkmenistan", "TJ": "Tajikistan", "RO": "Romania", "TK": "Tokelau", "GW": "Guinea-Bissau", "GU": "Guam", "GT": "Guatemala", "GS": "South Georgia and the South Sandwich Islands", "GR": "Greece", "GQ": "Equatorial Guinea", "GP": "Guadeloupe", "JP": "Japan", "GY": "Guyana", "GG": "Guernsey", "GF": "French Guiana", "GE": "Georgia", "GD": "Grenada", "GB": "United Kingdom", "GA": "Gabon", "SV": "El Salvador", "GN": "Guinea", "GM": "Gambia", "GL": "Greenland", "GI": "Gibraltar", "GH": "Ghana", "OM": "Oman", "TN": "Tunisia", "JO": "Jordan", "HR": "Croatia", "HT": "Haiti", "HU": "Hungary", "HK": "Hong Kong", "HN": "Honduras", "HM": "Heard Island and McDonald Islands", "VE": "Venezuela", "PR": "Puerto Rico", "PS": "Palestinian Territory", "PW": "Palau", "PT": "Portugal", "SJ": "Svalbard and Jan Mayen", "PY": "Paraguay", "IQ": "Iraq", "PA": "Panama", "PF": "French Polynesia", "PG": "Papua New Guinea", "PE": "Peru", "PK": "Pakistan", "PH": "Philippines", "PN": "Pitcairn", "PL": "Poland", "PM": "Saint Pierre and Miquelon", "ZM": "Zambia", "EH": "Western Sahara", "EE": "Estonia", "EG": "Egypt", "ZA": "South Africa", "EC": "Ecuador", "IT": "Italy", "VN": "Vietnam", "SB": "Solomon Islands", "ET": "Ethiopia", "SO": "Somalia", "ZW": "Zimbabwe", "SA": "Saudi Arabia", "ES": "Spain", "ER": "Eritrea", "ME": "Montenegro", "MD": "Moldova", "MG": "Madagascar", "MF": "Saint Martin", "MA": "Morocco", "MC": "Monaco", "UZ": "Uzbekistan", "MM": "Myanmar", "ML": "Mali", "MO": "Macao", "MN": "Mongolia", "MH": "Marshall Islands", "MK": "Macedonia", "MU": "Mauritius", "MT": "Malta", "MW": "Malawi", "MV": "Maldives", "MQ": "Martinique", "MP": "Northern Mariana Islands", "MS": "Montserrat", "MR": "Mauritania", "IM": "Isle of Man", "UG": "Uganda", "TZ": "Tanzania", "MY": "Malaysia", "MX": "Mexico", "IL": "Israel", "FR": "France", "IO": "British Indian Ocean Territory", "SH": "Saint Helena", "FI": "Finland", "FJ": "Fiji", "FK": "Falkland Islands", "FM": "Micronesia", "FO": "Faroe Islands", "NI": "Nicaragua", "NL": "Netherlands", "NO": "Norway", "NA": "Namibia", "VU": "Vanuatu", "NC": "New Caledonia", "NE": "Niger", "NF": "Norfolk Island", "NG": "Nigeria", "NZ": "New Zealand", "NP": "Nepal", "NR": "Nauru", "NU": "Niue", "CK": "Cook Islands", "XK": "Kosovo", "CI": "Ivory Coast", "CH": "Switzerland", "CO": "Colombia", "CN": "China", "CM": "Cameroon", "CL": "Chile", "CC": "Cocos Islands", "CA": "Canada", "CG": "Republic of the Congo", "CF": "Central African Republic", "CD": "Democratic Republic of the Congo", "CZ": "Czech Republic", "CY": "Cyprus", "CX": "Christmas Island", "CR": "Costa Rica", "CW": "Curacao", "CV": "Cape Verde", "CU": "Cuba", "SZ": "Swaziland", "SY": "Syria", "SX": "Sint Maarten", "KG": "Kyrgyzstan", "KE": "Kenya", "SS": "South Sudan", "SR": "Suriname", "KI": "Kiribati", "KH": "Cambodia", "KN": "Saint Kitts and Nevis", "KM": "Comoros", "ST": "Sao Tome and Principe", "SK": "Slovakia", "KR": "South Korea", "SI": "Slovenia", "KP": "North Korea", "KW": "Kuwait", "SN": "Senegal", "SM": "San Marino", "SL": "Sierra Leone", "SC": "Seychelles", "KZ": "Kazakhstan", "KY": "Cayman Islands", "SG": "Singapore", "SE": "Sweden", "SD": "Sudan", "DO": "Dominican Republic", "DM": "Dominica", "DJ": "Djibouti", "DK": "Denmark", "VG": "British Virgin Islands", "DE": "Germany", "YE": "Yemen", "DZ": "Algeria", "US": "United States", "UY": "Uruguay", "YT": "Mayotte", "UM": "United States Minor Outlying Islands", "LB": "Lebanon", "LC": "Saint Lucia", "LA": "Laos", "TV": "Tuvalu", "TW": "Taiwan", "TT": "Trinidad and Tobago", "TR": "Turkey", "LK": "Sri Lanka", "LI": "Liechtenstein", "LV": "Latvia", "TO": "Tonga", "LT": "Lithuania", "LU": "Luxembourg", "LR": "Liberia", "LS": "Lesotho", "TH": "Thailand", "TF": "French Southern Territories", "TG": "Togo", "TD": "Chad", "TC": "Turks and Caicos Islands", "LY": "Libya", "VA": "Vatican", "VC": "Saint Vincent and the Grenadines", "AE": "United Arab Emirates", "AD": "Andorra", "AG": "Antigua and Barbuda", "AF": "Afghanistan", "AI": "Anguilla", "VI": "U.S. Virgin Islands", "IS": "Iceland", "IR": "Iran", "AM": "Armenia", "AL": "Albania", "AO": "Angola", "AQ": "Antarctica", "AS": "American Samoa", "AR": "Argentina", "AU": "Australia", "AT": "Austria", "AW": "Aruba", "IN": "India", "AX": "Aland Islands", "AZ": "Azerbaijan", "IE": "Ireland", "ID": "Indonesia", "UA": "Ukraine", "QA": "Qatar", "MZ": "Mozambique"}`);
        res.send(obj[info.data.country]);
    });
});

app.post('/global', (req, res) => {
    var body = _.pick(req.body, ['data']);
    io.to("global").emit('global', body.data);
    res.sendStatus(200);
});


app.post('/notification', (req, res) => {

    var body = _.pick(req.body, ['notification', 'username']);
    var notification = body.notification;
    var onlineUsers = users.users.map(user => user);
    onlineUsers.forEach(function (element) {
        if (body.username === element.name) {
            io.sockets.connected[element.id].emit("notification", notification);
        }
    }, this);
    res.sendStatus(200);
});

app.post('/getFriends', (req, res) => {
    var body = _.pick(req.body, ['friends']);

    var onlineFriends = [];
    var onlineUsers = users.users.map(user => user.name);

    body.friends.forEach((element) => {
        if (onlineUsers.includes(element)) {
            onlineFriends.push(element)
        }
    });

    res.send({ onlineFriends });
});

app.post('/friends', (req, res) => {

    var body = _.pick(req.body, ['username', 'friends']);
    var onlineUsers = users.users.map(user => user);
    onlineUsers.forEach(function (element) {
        if (body.friends.includes(element.name)) {
            io.sockets.connected[element.id].emit("onlineFriend", body.username);
        }
    }, this);
    res.sendStatus(200);
});

app.post('/offlinefriend', (req, res) => {

    var body = _.pick(req.body, ['username', 'friends']);
    var onlineUsers = users.users.map(user => user);
    onlineUsers.forEach(function (element) {
        if (body.friends.includes(element.name)) {
            io.sockets.connected[element.id].emit("offlineFriend", body.username);
        }
    }, this);
    res.sendStatus(200);
});


app.post('/sent-friendrequest', (req, res) => {

    var room = req.params.room;
    var body = _.pick(req.body, ['data']);
    io.to(room.toLowerCase()).emit("local", body.data);
    res.sendStatus(200);
});


app.post('/friendrequest-accepted', (req, res) => {

    var room = req.params.room;
    var body = _.pick(req.body, ['data']);
    io.to(room.toLowerCase()).emit("local", body.data);
    res.sendStatus(200);
});

app.post('/room/:room', (req, res) => {

    var room = req.params.room;
    var body = _.pick(req.body, ['data']);
    io.to(room.toLowerCase()).emit("local", body.data);
    res.sendStatus(200);
});

app.get('/ping', (req, res) => {
    res.send("realtime date provider is up and running");
    console.log("asd");
});


server.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
});