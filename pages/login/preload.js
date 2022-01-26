const Store = require('electron-store');
const store = new Store();

if (store.get('username') == undefined || store.get('password') == undefined){

}
else{
    document.getElementById('username').value = store.get('username');
    document.getElementById('password').value = store.get('password');
}

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'blpzxfte4qnz5w9cyqf8-mysql.services.clever-cloud.com',
    user: 'uwe0moaategoxust',
    password: '9wE1pK3bX2KzZ4sRdRPE',
    database: 'blpzxfte4qnz5w9cyqf8',
    timeout: false
})

const getmac = require('getmac');

connection.connect((e) => {
    connection.query(`SELECT * FROM users where mac='${getmac.default()}'`, (e, r, f) => {
        if (r){
            
        }
        else{
            return;
        }
    })
})