// TODO: 
// - define parameters which "compose the sound"
//  - these are global parameters determining 
//    - key, 
//    - chord changes, 
// - a way of storing and retrieving different envelope shapes
// - set default octave range and note length
// - global dynamics

import { Voice, Buzzard } from './modules/voices.js';
import { Clock, Sequencer } from './modules/sequencer.js';

const sequencer = new Sequencer();
const scale = [110, 220, 330, 440, 550, 660, 770, 880];
sequencer.setScale(scale);


addEventListener("DOMContentLoaded", (event) => {

  // establish a websocket connection
  const socket = io();
  // gather information about the client 
  // that we will then interperate as musical parameters
  var voice = "Voice";
  var cpu = navigator.platform.toLowerCase();

  if (/linux/.test(cpu)) {
    voice = "Buzzard";
  } else if (/windows/.test(cpu)) {
    //…
  }

  socket.emit("join", {
    cpu: navigator.platform.toLowerCase(),
    browser: navigator.appCodeName, // Mozilla
    codename: navigator.appVersion, // 5.0 (Xll)
    productSub: navigator.productSub, //  "20181001000000"
    timestamp: Date.now().toString(),
    language: clientInformation.language, // en-US
    cores: clientInformation.hardwareConcurrency, // 8
    touchpoints: clientInformation.maxTouchPoints, // 5
    height: window.innerHeight, // 263
    width: window.innerWidth // 736

  });

  // when a client connects it receives this message for initializing any existing voices in the room
  // 
  socket.on("init_voices", (voices) => {
    //console.log(vs);

    for (const [key, voice] of Object.entries(voices)) {
      addVoice(voice);
    }
  });

  socket.on("add_voice", addVoice);

  socket.on("remove_voice", (id) => {
    console.log("remove voice", id)
    sequencer.removeTrack(id);
  });


  function addVoice(v) {
    console.log("add voice")
    if (!sequencer.hasTrack(v.alias)) {
      var rhythm = v.rhythm.split("");
      var voice;
      switch (v.voice) {
        case "Voice":
          voice = new Voice(context, compressor);
          break;
        case "Buzzard":
          voice = new Buzzard(context, compressor);
        default:
          break;
      }

      sequencer.addTrack({ voice: voice, mask: rhythm, melody: v.melody, id: v.alias });
      let hud = document.querySelector('.hud');
      hud.innerHTML += renderVoiceDisplay(v);
    }
  }


  const context = new AudioContext();
  const compressor = context.createDynamicsCompressor();

  compressor.connect(context.destination, compressor);

  const startButton = document.querySelector(".start");
  startButton.addEventListener("click", startAudio);

  const stopButton = document.querySelector(".stop");
  stopButton.addEventListener("click", stopAudio);

  function renderVoiceDisplay(voice) {
    let icon = "static/img/icons/";
    switch (voice.type) {
      case "Voice":
        icon += "triangle.svg";
      case "Buzzard":
        icon += "square.svg";
      default:
        icon += "triangle.svg";
    }

    let displayContent = `<li class="voice-display"><img class="icon" src="${icon}"/><ul>`;
    for (const [k, v] of Object.entries(voice)) {
      displayContent +=
        `<li>
          ${parseInt(v).toString(16).padStart(2, "0").toUpperCase()}
        </li>`
    }
    displayContent += `</ul></li>`;
    return displayContent;
  }

  function startAudio() {
    //sequencer.tracks[0].voice.start();

    // TODO: move this to the internals of the sequencer class
    const clock = new Clock(2000, () => {
      sequencer.tick();
    });
    clock.start();

  }


  function stopAudio() {
  }

});


