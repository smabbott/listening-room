
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
    const now = this.context.currentTime;
    this.gain.gain.setValueAtTime(0, now);
    this.gain.gain.linearRampToValueAtTime(1, now + 0.01);
    this.gain.gain.linearRampToValueAtTime(0.3, now+0.05);
    this.gain.gain.linearRampToValueAtTime(0, now + 0.5); 
  }

  noteOff(){
    console.log("noteoff")
    this.osc.stop();
  }

  // TODO: 
  // - emit events?
  // - a way of storing and retrieving different envelope shapes


}



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

  /*
  const osc = context.createOscillator();
  const gain = context.createGain();

  osc.type="square";
  osc.frequency.setValueAtTime(440, context.currentTime);
  

*/
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
    let fq = Math.random()*1000+200;
    voice.noteOn(fq);
  }, 500);

});


