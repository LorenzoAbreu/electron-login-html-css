const { ipcRenderer } = require('electron');

const button = document.getElementById('enter');

button.addEventListener('click', function() {

    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    ipcRenderer.send('login', {
        username: username,
        password: password
    })
})

function loading(type){
    if (type == true){
        button.innerText = "CARREGANDO...";
        button.disabled = true;
    }
    else if (type == false){
        button.innerText = "ENTRAR";
        button.disabled = false;
    }
    else{
        button.innerHTML == "ENTRAR";
        button.disabled = false;
    }
}

ipcRenderer.on('loading', (e,a) => {
    loading(a);
})

function aviso(type, message=''){

    const username = document.getElementById('username');
    const password = document.getElementById('password');

    if (type == 'error'){
        username.style.border = "1px solid #AA0000"
        password.style.border = "1px solid #AA0000"
        username.placeholder = message
        password.placeholder = message
        username.value = "";
        password.value = "";
    }
    else{
        username.style.border = "none"
        password.style.border = "none"
        username.placeholder = "Usuário"
        password.placeholder = "Senha"
        username.value = "";
        password.value = "";
    }

    console.log(message)
}

ipcRenderer.on('aviso', (e,a) => {
    aviso(a.type, a.message);
})