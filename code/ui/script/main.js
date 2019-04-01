// Generatore di colori opposti usando una Neural Network //////////////////////////////////////////////////////////////////////////////

let brain; // la Neural Network
let r, g, b; // I tre valori per il colore (RED, GREEN, BLUE)
let neurons;
let isShown = true;

function pickColor() { // genero un COLORE casuale
   r = random(255);
   g = random(255);
   b = random(255);
}

const Swal = require('sweetalert2');

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setup(n) {
   brain = new NeuralNetwork(3, n, 3); // viene inizializzata con 3 neuroni di input, ? nascosti e 3 di output
   neurons = n;
}

function train(iterations) {
   Swal.fire({
      title: "Training Session",
      html: "<div prc><strong id=\"percent\"></strong> done</div>",
      allowOutsideClick: false,
      confirmButtonText: '<div style="margin: auto;">OK</div>',
      onBeforeOpen: () => {
         Swal.enableLoading()
         const content = Swal.getContent()
         const $ = content.querySelector.bind(content);

         let percent = $("#percent");
         percent.innerHTML = "0%";

         for (let i = 0; i < iterations; i++) { // alleno la neural network

            setTimeout(() => {
               percent.innerHTML = `${Math.round( (i/iterations)*100 )}%`;

               let trainColor = [random(255), random(255), random(255)];
               let trainResult = [(255 - trainColor[0]), (255 - trainColor[1]), (255 - trainColor[2])]; // Genero anche il colore opposto REALE
      
               brain.train(
                  [(trainColor[0] / 255), (trainColor[1] / 255), (trainColor[2] / 255)], // Input generici
                  [(trainResult[0] / 255), (trainResult[1] / 255), (trainResult[2] / 255)] // Output CORRETTI
               );
            }, 0);
            
   
            /*
               
               Ora (ad ogni passo dell'allenamento) avviene un processo chiamato BACKPROPAGATION:
               - Dati gli input con i rispettivi output CORRETTI, la rete neurale calcola il TASSO di ERRORE
                  con i suoi output generati
               - Quindi modifica il 'PESO' delle connessioni fra i neuroni proprio con quel valore di ERRORE
               - Fatto cio`, ora i valori di OUTPUT saranno piu` corretti
            
            */
         }
         setTimeout(() => (Swal.disableLoading()), 1)
      }
   }).then(() => (document.getElementById('log').innerHTML += `<div>New train .............. Trained the <strong info>Perceptron</strong> for <strong success>${iterations}</strong> times</div>`));

   
}

function getNewData() {
   pickColor();
   let res = brain.predict([r / 255, g / 255, b / 255]); // Interrogo la rete neurale per un risultato
   let vvv = res;
   for (let i = 0; i < 3; i++) {
      vvv[i] = Math.round(res[i] * 255);
   } // Rendo INTERI i valori

   let fgColor = `rgb(${(vvv[0]) < 255 ? vvv[0] : 255}, ${(vvv[1]) < 255 ? vvv[1] : 255}, ${(vvv[2]) < 255 ? vvv[2] : 255})`;
   document.getElementById('bg').style.background = `rgb(${r}, ${g}, ${b})`;
   document.getElementById('text').style.color = fgColor;
   document.getElementById('text').innerHTML = fgColor;
   
   let real = `rgb(${r}, ${g}, ${b})`;
   let opposite = `rgb(${255-r}, ${255-g}, ${255-b})`;

   let err = `<strong err>${ Math.round((Math.abs((r/255)-((255-res[0])/255)) + Math.abs((g/255)-((255-res[1])/255)) + Math.abs((b/255)-((255-res[2])/255))) * (100/3)) }%</strong>`;
   let row = `<div>New color prediction ... Error: ${err}, click <label link onclick="showDetails('${real}', '${opposite}', '${fgColor}')">here</label> for details</div>`;
   document.getElementById("log").innerHTML += row;
}

function resetConsole() {
   document.getElementById("log").innerHTML = `<div class="row train"> New <strong info>Perceptron</strong> created with <strong success>3</strong> input neurons, <strong success>${neurons}</strong> hidden neurons and <strong success>3</strong> output neurons </div><div style="color: rgba(50, 50, 50, .5)">  // Click GENERATE to predict a new color!</div>`
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function trainAlert() {
   Swal.fire({
      input: 'number',
      title: 'Training:',
      html: 'Inserisci il numero di <strong>iterazioni</strong> per l\'allenamento',
      inputValidator: (val) => {
         return new Promise(
            (resolve) => {
               if (val < 1) 
                  resolve('ERRORE: input non valido (minore di 1)');
               else {
                  // setTimeout( () => train(val), 1/10 );
                  train(val)
               }
            }
         );
      }
   });
}

function showDetails( real, opposite, predicted ) {

   Swal.fire({
      title: "Color prediction:",
      html: 
         `
         <div>Real color ... <strong shadow style="color:${real}">${real}</strong></div>
         <div>Opposite color ... <strong shadow style="color:${opposite}">${opposite}</strong></div>
         <div>Predicted color ... <strong shadow style="color:${predicted}">${predicted}</strong></div>
         `
   });
}
u
function toggleLog() {
   
   if (isShown) {
      document.getElementById('log').style.bottom = '-220px';
      document.getElementById('log').style.opacity = 0;
      document.getElementById('reset-wr').style.bottom = '2.5px';

      document.getElementsByClassName('reset')[0].style.opacity = '0';
      document.getElementsByClassName('reset')[0].style.visibility = 'hidden';
      document.getElementsByClassName('hide')[0].innerHTML = 'Show Console';
      isShown = false;
   } else {
      document.getElementById('log').style.bottom = '0px';
      document.getElementById('log').style.opacity = 1;
      document.getElementById('reset-wr').style.bottom = '220px';

      document.getElementsByClassName('reset')[0].style.opacity = '1';
      document.getElementsByClassName('reset')[0].style.visibility = 'visible';
      document.getElementsByClassName('hide')[0].innerHTML = 'Hide Console';
      isShown = true;
   }
}

function random(max) {
   return Math.round(Math.random() * max);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

   Copyright®:
    - NeuralNetwork libraries: Daniel Shiffmann
    - NeuralNetwork code:      Massimo Vettori

*/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
