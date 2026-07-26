  // TODO: 
  // - emit events?
  // - a way of storing and retrieving different envelope shapes
  // - find a way to handle interruption of note. 

class Voice{
  constructor(context, destination){
    // gain
    // pan
    // waveshape
    if(destination === null){
        this.destination = context.destination;
      }else{
        this.destination = destination;
      }
    
    this.destination = destination;
    this.frequency = 440;
    this.context = context;
    this.osc = this.context.createOscillator();
    this.gain = this.context.createGain();
    this.osc.frequency.setValueAtTime(this.frequency, this.context.currentTime);
    this.osc.connect(this.gain);
    this.gain.connect(this.destination);    
    console.log("Voice Constructor");
  }

  start(){
    this.osc.start();
  }

  noteOn(fq, length){
    if(fq !== null){
      this.frequency = fq;
      this.osc.frequency.setValueAtTime(this.frequency, this.context.currentTime);
    }

    this.ar(this.gain.gain, length * 0.5, length * 0.5);
    //this.asdr(this.gain.gain, 0.2, 0.2, 0.5, 0.5);
    //this.ar(this.osc.frequency, this.frequency, this.frequency/2);
  }

  noteOff(){
    console.log("noteoff")
    this.gain.gain.linearRampTpValueAtTime(0, this.context.currentTime + 0.1);
  }

  stop(){
    this.osc.stop();
  }

  // TODO: not just gain but any parameter
  asdr(property, attack, delay, sustain, release){
    let now = this.context.currentTime;
    //this.gain.gain.setValueAtTime(0, now);
    property.linearRampToValueAtTime(1, now + attack); //0.1);
    property.linearRampToValueAtTime(0.3, now + attack +delay); //0.5);
    property.setValueAtTime(0.3, now + attack + delay + sustain);
    property.linearRampToValueAtTime(0, now + attack + delay + sustain + release); //0.5);    
  }

  ar(property, attack, release){
    let now = this.context.currentTime;
    property.linearRampToValueAtTime(1, now + attack); 
    property.linearRampToValueAtTime(0, now + attack + release); 
  }


}

class Buzzard extends Voice{
  constructor(context, destination){
      super(context, destination);
      console.log("Buzzard Constructor");
      this.filter = new BiquadFilterNode(context, {
        type:'bandpass',
        Q:10
      });
      this.osc.type = "sawtooth";
      this.osc.connect(this.filter);
      this.filter.connect(this.destination)
    }
  
  noteOn(fq, length){
      // TODO: ramp filter frequency down over length of note
    //this.ar(this.filter.frequency, length/2, length/2);
    this.filter.frequency.setValueAtTime(fq, this.context.currentTime);
    this.ar(this.filter.frequency, length/2, length/2);
    super.noteOn(fq, length);
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
  const compressor = context.createDynamicsCompressor();
  const voice = new Buzzard(context, compressor);
  const voice2 = new Voice(context, compressor);
  const voice3 = new Voice(context, compressor);

  compressor.connect(context.destination, compressor);

  const startButton = document.querySelector(".start");
  startButton.addEventListener("click", startAudio);

  const stopButton = document.querySelector(".stop");
  stopButton.addEventListener("click", stopAudio);

  function startAudio(){
    voice.start();
    voice2.start();
    voice3.start();
    console.log("start");
    // TODO: this should probably be a tick event that is listened for by all voices.
    window.setInterval(function() {
      let note = Math.floor(Math.random()*scale.length);
      voice.noteOn(scale[note]*0.75, 1);
    }, 1000);

    window.setInterval(function(){
      let note = Math.floor(Math.random()*scale.length);
      voice2.noteOn(scale[note], 0.5);
    }, 500);

    window.setInterval(function(){
        let note = Math.floor(Math.random()*scale.length);
        voice3.noteOn(scale[note], 0.1)
      }, 333.33);
  }



  function stopAudio(){
    voice.stop();
    voice2.stop();
    voice3.stop();
  }



});


