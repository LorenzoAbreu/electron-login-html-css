const { app, BrowserWindow, screen, ipcMain, ipcRenderer } = require('electron');
const Store = require('electron-store');
const store = new Store();
const package = require('./package.json');
const path = require('path');

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

store.set('name', package.name);
store.set('version', package.version);

function percentage(num, per){
  return (num / 100) * per;
}

let window;

let positionX;
let positionY;
let sizeX;
let sizeY;

const mainWindow = () => {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    window = new BrowserWindow({
        x: store.get('positionX') || null,
        y: store.get('positionY') || null,
        width:  store.get('sizeX') || percentage(width, 80),
        height: store.get('sizeY') || percentage(height, 80),
        minWidth: 500,
        minHeight: 550,
        autoHideMenuBar: true,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    window.loadFile(path.join(__dirname, 'pages/login/index.html'))

    window.once('ready-to-show', () => {
        window.show();
    })

    setInterval(() => {
        if (BrowserWindow.getAllWindows().length == 0){
            return;
        }
        else{
            let windowPosition = window.getPosition();
            let windowSize = window.getSize();
            positionX = windowPosition[0];
            positionY = windowPosition[1];
            sizeX = windowSize[0];
            sizeY = windowSize[1];
        }
    }, 100);
}

app.on('ready', () => {
    mainWindow();
})

app.on('window-all-closed', () => {
    store.set('positionX', positionX);
    store.set('positionY', positionY);
    store.set('sizeX', sizeX);
    store.set('sizeY', sizeY);

    if (process.platform != 'darwin'){
        app.quit();
    }
    else{
        return;
    }
})

// EMAIL

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'lorenzoabreu.envios@gmail.com',
        pass: 'https://accounts.google.com/'
    }
})

// IPC CONNECTIONS

const mysql = require('mysql');
const getmac = require('getmac');
const md5 = require('md5');



const login = (username, password) => {
    window.webContents.send('loading', true)

    const connection = mysql.createConnection({
        host: 'blpzxfte4qnz5w9cyqf8-mysql.services.clever-cloud.com',
        user: 'uwe0moaategoxust',
        password: '9wE1pK3bX2KzZ4sRdRPE',
        database: 'blpzxfte4qnz5w9cyqf8',
        timeout: 1
    })
    
    connection.connect((err) => {
        if (err == 'Error: Cannot enqueue Handshake after already enqueuing a Handshake.'){
            console.log('Connection is already opened.');
        }
        else if (err){
            console.log(err);
        }
        connection.query(`SELECT * FROM users where usuario='${username}'`, function (err, result, fields) {
            if (err) console.log(err);

            const user = result[0];
            
            if (user){
                if (user.senha == md5(password)){
                    store.set('username', username);
                    store.set('password', password);
                    connection.end();
                    window.loadURL(path.join(__dirname, 'pages/main/index.html'))
                    window.webContents.send('loading', false)
                }
                else{
                    console.log('Senha inválida.')
                    window.webContents.send('loading', false)
                    window.webContents.send('aviso', {
                        type: 'error',
                        message: 'Usuário ou senha inválidos'
                    });
                    connection.end();
                }
            }
            else{
                window.webContents.send('aviso', {
                    type: 'error',
                    message: 'Usuário ou senha inválidos'
                });
                window.webContents.send('loading', false)
                connection.end();
            }
        });
      });
}

const register = (username, password, email) => {

    const mailoptions = {
        from: 'lorenzoabreu.envios@gmail.com',
        to: email,
        subject: 'teste',
        html: `
            <h1>Conta criada com sucesso!</h1>
            <h3>Dados da conta:</h3>
            <span><b>Usuário:</b> ${username}</span> <br>
            <span><b>Senha:</b> ${password}</span>

        `
    }

    const connection = mysql.createConnection({
        host: 'blpzxfte4qnz5w9cyqf8-mysql.services.clever-cloud.com',
        user: 'uwe0moaategoxust',
        password: '9wE1pK3bX2KzZ4sRdRPE',
        database: 'blpzxfte4qnz5w9cyqf8',
        timeout: 1
    })

    window.webContents.send('loading', true)
    connection.connect(function(err) {
        if (err == 'Error: Cannot enqueue Handshake after already enqueuing a Handshake.'){
            console.log('Connection is already opened.');
        }
        else if (err){
            console.log(err);
        }

        // Checando se é de fato um email
        if (username == ''){
            window.webContents.send('loading', false)
            window.webContents.send('aviso', {
                type: 'warn',
                message: 'Preencha todos os campos'
            });
            connection.end();
        }
        else{
            if (email == ''){
                window.webContents.send('loading', false)
                window.webContents.send('aviso', {
                    type: 'warn',
                    message: 'Preencha todos os campos'
                });
                connection.end();
                
            }
            else{
                if (password == ''){
                    window.webContents.send('loading', false)
                    window.webContents.send('aviso', {
                        type: 'warn',
                        message: 'Preencha todos os campos'
                    });
                    connection.end();
                }
                else{
                    if (email.includes('@') && email.includes('.') && email.length > 10){
                            if (err == 'Error: Cannot enqueue Handshake after already enqueuing a Handshake.'){
                                console.log('Connection is already opened.');
                            }
                            else if (err){
                                console.log(err);
                            }
                            connection.query(`SELECT * FROM users where usuario='${username}'`, function (err, result, fields) {
                                if (result[0]){
                                    window.webContents.send('loading', false)
                                    window.webContents.send('aviso', {
                                        type: 'warn',
                                        message: 'Este usuário já está sendo usado'
                                    });
                                    connection.end();
                                }
                                else{
                                    connection.query(`SELECT * FROM users where email='${email}'`, function (err, result, fields) {
                                        if (result[0]){
                                            window.webContents.send('loading', false)
                                            window.webContents.send('aviso', {
                                                type: 'warn',
                                                message: 'Este email já está sendo usado'
                                            });
                                            connection.end();
                                        }
                                        else{
                                            // Executando a função para adicionar no banco de dados
                                            connection.query(`INSERT INTO users (usuario, senha, email, mac, avatar) VALUES ('${username}', '${md5(password)}', '${email}', '${getmac.default()}', LOAD_FILE('https://i.stack.imgur.com/sUrTF.jpg'))`, function (err, result) {
                                                if (err) console.log(err);
                                                window.webContents.send('aviso', {
                                                    type: 'success',
                                                    message: 'Sua conta foi criada com sucesso'
                                                });
                                                window.webContents.send('loading', false)
                                                
                                                transporter.sendMail(mailoptions, function(e, i) {
                                                    if (e){
                                                        console.log('email: error')
                                                    }
                                                    else{
                                                        console.log('email: ok')
                                                    }
                                                })

                                                store.set('username', username);
                                                store.set('email', email);
                                                store.set('password', password);
                                                connection.end();
                                                setTimeout(() => {window.loadFile(path.join(__dirname, 'pages/login/index.html'))},1000)
                                            });
                                        }
                                    });
                                }
                            });
                    }
                    else{
                        window.webContents.send('loading', false)
                        window.webContents.send('aviso', {
                            type: 'warn',
                            message: 'Email inválido'
                        });
                        connection.end();
                    }
                }
            }
        }
        
      });
}

ipcMain.on('login', (e,a) => {
    login(a.username, a.password);
})

ipcMain.on('register', (e,a) => {
    register(a.username, a.password, a.email);
})
