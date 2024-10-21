let quotes = ['Como no estás experimentado en las cosas del mundo, todas las cosas que tienen algo de dificultad te parecen imposibles.',
'El que no sabe gozar de la ventura cuando le viene, no debe quejarse si se pasa.',
'El amor junta los cetros con los cayados; la grandeza con la bajeza; hace posible lo imposible; iguala diferentes estados y viene a ser poderoso como la muerte.',
'El amor y la afición con facilidad ciegan los ojos del entendimiento.',
'El amor no tiene edad; siempre está naciendo.',
'El amor, como ciego que es, impide a los amantes ver las divertidas tonterías que cometen.',
'El pobre está inhabilitado de poder mostrar la virtud de liberalidad con ninguno, aunque en sumo grado la posea.',
]

let words = []
let wordIndex = 0
let startTime = Date.now()
let scores = localStorage.getItem('scores') ? JSON.parse(localStorage.getItem('scores')) : []

const quoteElement = document.getElementById('quote')
const messageElement = document.getElementById('message')
const typedValueElement = document.getElementById('typed-value')
const closeButton = document.getElementById('close')
const modalDialog = document.getElementById('modal-dialog')
const overlay = document.getElementById('overlay')
const scoreList = document.getElementById('high-scores-list')    
const noScoresMessage = document.getElementById('no-scores-message')

let sortedScores = scores.sort((a,b) => a - b)
console.log(sortedScores);

function loadScores(){
    if (sortedScores.length === 0){
        noScoresMessage.style.display = 'block'
    }  else if (sortedScores.length < 3){
        scoreList.innerHTML = ''
        document.getElementById('high-scores').removeChild(noScoresMessage)
        for(let i = 0; i < sortedScores.length; i++){
            const li = document.createElement('li')
            li.innerText = ` ${sortedScores[i]} segundos`
            scoreList.appendChild(li)
        }
    } else {
        scoreList.innerHTML = ''
        for(let i = 0; i < 3; i++){
            const li = document.createElement('li')
            li.innerText = `${sortedScores[i]} segundos`
            scoreList.appendChild(li)
        }
    }
}

loadScores();

document.getElementById('start').addEventListener('click', ()=>{
    const quoteIndex = Math.floor(Math.random() * quotes.length)
    const quote = quotes[quoteIndex]
    words = quote.split(' ')
    wordIndex = 0
    typedValueElement.readOnly = false
    const spanWords = words.map(function(word) {return `<span>${word} </span>`})
    quoteElement.innerHTML = spanWords.join('')
    quoteElement.childNodes[0].className = 'highlight'
    messageElement.innerText = '';

    typedValueElement.value = ''

    typedValueElement.focus()
    startTime = new Date().getTime()
});

typedValueElement.addEventListener('input',()=>{
    const typedValue = typedValueElement.value
    const currentWord = words[wordIndex]
    if(typedValue === currentWord && wordIndex === words.length - 1){
        const elapsedTime = new Date().getTime() - startTime
        const message = `ENHORABUENA! Has terminado en ${elapsedTime / 1000} segundos!`
        messageElement.innerText = message
        typedValueElement.readOnly = true
        typedValueElement.value = ''
        modalDialog.style.display = 'block'
        overlay.style.display = 'block'
        closeButton.focus()
        scores.push(elapsedTime / 1000)
        localStorage.setItem('scores', JSON.stringify(scores))
    }
    else if (typedValue.endsWith(' ') && typedValue.trim() === currentWord){
        // End of word
        typedValueElement.value = '';
        wordIndex++;
        for(const wordElement of quoteElement.childNodes){
            wordElement.className = '';
        }
        quoteElement.childNodes[wordIndex].className = 'highlight';
    }else if(currentWord.startsWith(typedValue)){
        // Currently correct
        typedValueElement.className = ''
    }else{
        // Wrong typing
        typedValueElement.className = 'error'
    }
        
});

closeButton.addEventListener('click', ()=>{
    modalDialog.style.display = 'none'
    overlay.style.display = 'none'
    loadScores();
})