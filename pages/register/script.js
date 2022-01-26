const { ipcRenderer } = require('electron');

const button = document.getElementById('enter');

button.addEventListener('click', function() {

    var username = document.getElementById('username').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    ipcRenderer.send('register', {
        username: username,
        email: email,
        password: password
    })
})

function loading(type){
    if (type == true){
        button.innerText = "CARREGANDO...";
        button.disabled = true;
    }
    else if (type == false){
        button.innerText = "CRIAR CONTA";
        button.disabled = false;
    }
    else{
        button.innerHTML == "CRIAR CONTA";
        button.disabled = false;
    }
}

ipcRenderer.on('loading', (e,a) => {
    loading(a);
})

function aviso(type, message=''){

    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    if (type == 'error'){
        username.style.border = "1px solid #AA0000"
        email.style.border = "1px solid #AA0000"
        password.style.border = "1px solid #AA0000"
        username.placeholder = message
        email.placeholder = message
        password.placeholder = message
        username.value = "";
        email.value = "";
        password.value = "";
    }
    else if (type == 'success'){
        username.style.border = "1px solid #005500"
        email.style.border = "1px solid #005500"
        password.style.border = "1px solid #005500"
        username.placeholder = message
        email.placeholder = message
        password.placeholder = message
        username.value = "";
        email.value = "";
        password.value = "";
    }
    else if (type == ''){
        username.style.border = "none"
        email.style.border = "none"
        password.style.border = "none"
        username.placeholder = "Usuário"
        email.placeholder = "Email"
        password.placeholder = "Senha"
        username.value = "";
        email.value = "";
        password.value = "";
    }
    else if (type = 'warn'){
        username.style.border = "1px solid #AA6E00"
        email.style.border = "1px solid #AA6E00"
        password.style.border = "1px solid #AA6E00"
        username.placeholder = message
        email.placeholder = message
        password.placeholder = message
        username.value = "";
        email.value = "";
        password.value = "";
    }
}

ipcRenderer.on('aviso', (e,a) => {
    aviso(a.type, a.message);
})