let name = document.querySelector('#name')
let email = document.querySelector('#email')
let submit = document.querySelector('#submit')
let form = document.querySelector('#form')

submit.addEventListener('click', okButton)

function okButton() {
    console.log(name.value, email.value)
    greet()   
}

// += legger teksten i tillegg til det andre
function greet() {
    form.innerHTML = '<h1>Hei ' + name.value + ' </h1>' // denne stringen med + gjør det mulig med h1
    form.innerHTML += '<p>Det var veldig hyggelig at du ville være med i prosjektet.</p>'
    form.innerHTML += '<p>Om jeg forstår det korrekt, er navnet ditt ' + name.value + ' og eposten din er: ' + email.value + '</p>'

    const newOkButton = document.createElement('button')
    newOkButton.innerHTML = 'Ok'
    newOkButton.addEventListener('click', function(){
        form.innerHTML = '<h1>Supert</h1>'
    })
    form.appendChild(newOkButton)

    const newCancelButton = document.createElement('button')
    newCancelButton.innerHTML = 'Cancel'
    newCancelButton.addEventListener('click', function(){
        form.innerHTML = ''
        form.appendChild(name)
        form.appendChild(email)
        form.appendChild(submit)
    })
    form.appendChild(newCancelButton)
}