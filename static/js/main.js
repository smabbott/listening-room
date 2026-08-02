   // TODO: 
  // - define parameters which "compose the sound"
  //  - these are global parameters determining 
  //    - key, 
  //    - chord changes, 
  // - a way of storing and retrieving different envelope shapes
  // - set default octave range and note length
  // - global dynamics

import {Voice, Buzzard} from './modules/voices.js';
import {Clock, Sequencer} from './modules/sequencer.js';


const sequencer = new Sequencer();
const scale = [110, 220, 330, 440, 550, 660, 770, 880];
sequencer.setScale(scale);

addEventListener("DOMContentLoaded", (event) => { 

  // establish a websocket connection
  const socket = io();
  // gather information about the client 
  // that we will then interperate as musical parameters
  socket.emit("join", {
      voice:"Buzzard",//navigator.oscpu, // Linux x86_64
      browser:navigator.appCodeName, // Mozilla
      codename:navigator.appVersion, // 5.0 (Xll)
      rhythm:navigator.buildID, //  "20181001000000"
      sequence:Date.now.toString(), // 1785606925292
      language:clientInformation.language, // en-US
      hw:clientInformation.hardwareConcurrency, // 8
      tp:clientInformation.maxTouchPoints, // 5
      height:window.innerHeight, // 263
      width:window.innerWidth // 736
   });

  socket.on("message", (msg)=>{
    console.log(msg)
  })

  socket.on("add_voice", (d)=>{
    
    var rhythm = d.rhythm.split("");
    var voice;
    switch (d.voice) {
      case "Voice":
        voice = new Voice(context, compressor);
        break;
      case "Buzzard":
        voice = new Buzzard(context, compressor);
      default:
        break;
    }

    sequencer.addTrack({voice:voice, mask:rhythm})

  });

  const context = new AudioContext();
  const compressor = context.createDynamicsCompressor();

  compressor.connect(context.destination, compressor);

  const startButton = document.querySelector(".start");
  startButton.addEventListener("click", startAudio);

  const stopButton = document.querySelector(".stop");
  stopButton.addEventListener("click", stopAudio);

  function startAudio(){
    //sequencer.tracks[0].voice.start();

    // TODO: move this to the internals of the sequencer class
    const clock = new Clock(2000, ()=>{
      sequencer.tick();
    });
    clock.start();

  }


  function stopAudio(){
  }

});


