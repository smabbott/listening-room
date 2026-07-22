  // TODO: 
  // - emit events?
  // - a way of storing and retrieving different envelope shapes
  // - find a way to handle interruption of note. 

class Voice{
  constructor(context){
    // gain
    // pan
    // waveshape

    this.frequency = 440;
    this.context = context;
    this.osc = this.context.createOscillator();
    this.gain = this.context.createGain();
    this.osc.frequency.setValueAtTime(this.frequency, this.context.currentTime);
    this.osc.connect(this.gain);
    this.gain.connect(this.context.destination)    
  }

  start(){
    this.osc.start();
  }

  noteOn(fq){
    if(fq !== null){
      this.frequency = fq;
      this.osc.frequency.setValueAtTime(this.frequency, this.context.currentTime);
    }
    console.log(this.frequency);
    this.ar(0.5, 0.5);
  }

  noteOff(){
    console.log("noteoff")
    this.gain.gain.linearRampTpValueAtTime(0, this.context.currentTime + 0.1);
  }

  stop(){
    this.osc.stop();
  }

  // TODO: not just gain but any parameter
  asdr(attack, delay, sustain, release){
    let now = this.context.currentTime;
    //this.gain.gain.setValueAtTime(0, now);
    this.gain.gain.linearRampToValueAtTime(1, now + attack); //0.1);
    this.gain.gain.linearRampToValueAtTime(0.3, now + attack +delay); //0.5);
    this.gain.gain.setValueAtTime(0.3, now + attack + delay + sustain);
    this.gain.gain.linearRampToValueAtTime(0, now + attack + delay + sustain + release); //0.5);    
  }

  ar(attack, release){
    let now = this.context.currentTime;
    this.gain.gain.linearRampToValueAtTime(1, now + attack); 
    this.gain.gain.linearRampToValueAtTime(0, now + attack + release); 
  }



}

const scale = [110, 220, 330, 440, 550, 660, 770, 880];


addEventListener("DOMContentLoaded", (event) => { 
  // TODO: 
  // - set up context
  // - create a system (factory?) for generating voices
  // - define parameters which "compose the sound"
  //  - these are global parameters determining 
  //    - tempo / clock, 
  //    - key, 
  //    - chord changes, 
  //    - scales, 
  //    - voice types
  //
  const context = new AudioContext();
  const voice = new Voice(context);

  const startButton = document.querySelector(".start");
  startButton.addEventListener("click", startAudio);

  const stopButton = document.querySelector(".stop");
  stopButton.addEventListener("click", stopAudio);

  function startAudio(){
    voice.start();
    console.log("start");
  }

  function stopAudio(){
    voice.stop();
  }

window.setInterval(function() {
    let note = Math.floor(Math.random()*scale.length);
      console.log(note);
    voice.noteOn(scale[note]);
  }, 1000);

});


