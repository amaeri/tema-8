//Oppgave 1

const vitser = (vits, svar) => vits + svar
console.log(vitser('Ka sa den ene tørrfesken te den andre? ', 'long time no sea'))


//Oppgave 2

const songs = (songs, name) => songs + name
console.log(songs('Ground Control To Major ', 'New song'))

//Oppgave 3

const tallene = [2, 6, 10, 15, 30, 45, 60, 75, 90, 100]

const tjueÅtti = tallene.filter(
    tall => (tall > 20) && (tall < 80)
)

if(tjueÅtti.length === 0) {    
    console.log('Oi! Ingen tall mellom 20 og 80?')
}else if(tjueÅtti.length === tallene.length){
  console.log('Oi! Alle tallene var mellom 20 og 80')  
} else {
    console.log('Disse tallene var mellom 20 og 80: ' 
    + tjueÅtti)
}

//Oppgave 4

const musikere = [
    {navn: "Annifrid", rating: 6},
    {navn: "Agnethe", rating: 3},
    {navn: "Benny", rating: 5},
    {navn: "Bjørn", rating: 2}
]

console.log(musikere.filter(musiker => musiker.rating > 4))

//Oppgave 5

const skurker = [
    {navn: "Billy the Kid", egenskap: "Rask på avtrekkeren"},
    {navn: "Jesse James", egenskap: "Iskald"},
    {navn: "Brødrene Dalton", egenskap: "Jobber godt sammen"}
]

console.log(skurker.find(skurk => skurk.egenskap === "Iskald"))

//Oppgave 6

const ulMatretter = document.querySelector("#ulMatretter")

const matretter = ["Kapteinens favoritt", "Kjøtt utklemt i panne", "Biff Stroganof"]

matretter.map(matrett => {
    let matLi = document.createElement('li')
    matLi.innerHTML = matrett
    ulMatretter.appendChild(matLi)
})

//Oppgave 7

const words1 = ["The", "way", "you"]
const words2 = ["make", "me", "feel"]

const theTitle = [words1 + words2]
console.log(theTitle)

//Oppgave 8