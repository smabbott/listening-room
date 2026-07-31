  // TODO: 
  // - emit events?
  // - a way of storing and retrieving different envelope shapes
  // - find a way to handle interruption of note. 
  // - set default octave range and note length
  // - global dynamics
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
  }

  noteOff(){
    this.gain.gain.linearRampTpValueAtTime(0, this.context.currentTime + 0.1);
  }

  stop(){
    this.osc.stop();
  }

  asdr(property, attack, delay, sustain, release){
    let now = this.context.currentTime;
    property.linearRampToValueAtTime(1, now + attack); //0.1);
    property.linearRampToValueAtTime(0.3, now + attack +delay); //0.5);
    property.setValueAtTime(0.3, now + attack + delay + sustain);
    property.linearRampToValueAtTime(0, now + attack + delay + sustain + release); //0.5);    
  }

  // FIXME: 
    // Sometimes there is a click as if a note has not finished before the next note is started.
    // This occurs more frequently when the tempo is higher.
    // Create a new oscillator for each note?
  ar(property, attack, release){
    let now = this.context.currentTime;
    property.linearRampToValueAtTime(1, now + attack); 
    property.linearRampToValueAtTime(0, now + attack + release); 
  }

}

class Buzzard extends Voice{
  constructor(context, destination){
      super(context, destination);
      this.filter = new BiquadFilterNode(context, {
        type:'bandpass',
        Q:10
      });
      this.osc.type = "sawtooth";
      this.osc.disconnect();
      this.osc.connect(this.filter);
      this.filter.connect(this.destination);
    }
  
  noteOn(fq, length){
      // TODO: ramp filter frequency down over length of note
    //this.ar(this.filter.frequency, length/2, length/2);
    this.filter.frequency.setValueAtTime(fq, this.context.currentTime);
    this.ar(this.filter.frequency, length*0.5, length*0.5);
    super.noteOn(fq/2, length);
  }

}


class Clock{
    constructor(rate = 100, callback){
      this.rate = rate;
      this.id;
      this.callback = callback;
    }

    start(){
      const cb = this.callback;
      this.id = window.setInterval(function(){
        cb();
      }, this.rate);
    }

    stop(){
      clearInterval(this.id);
    }

  }

// TODO: should track be its own class?
class Sequencer{
    constructor(){
      this.tracks =[];
      // track = {voice:v1, mask:[1,0,1,0,], length, frequency, emphasis}
      this.tickCount = 0;

    }

    tick(){
      for(let t in this.tracks) {
        const track = this.tracks[t];
        // get the next beat in the track. 
        // Using the modulus of the track lenght 
        // allows for tracks of different length to play simultaneously
        // slipping in and out of sync
        let beat = this.tickCount%track.mask.length-1;
        if(track.mask[beat] !== 0){
          console.log("note on");
          let note = scale[Math.floor(Math.random()*scale.length)];
          track.voice.noteOn(note, 1);

        }else{
          console.log("skip beat");
        }
      }
      this.tickCount += 1;
    }

    addTrack(track){
      this.tracks.push(track);
    }

  }

const sequencer = new Sequencer();
const scale = [110, 220, 330, 440, 550, 660, 770, 880];

addEventListener("DOMContentLoaded", (event) => { 
  // TODO: 
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
//  const voice = new Buzzard(context, compressor);
  //const voice2 = new Voice(context, compressor);
  const voice3 = new Voice(context, compressor);

  //sequencer.addTrack({voice:voice, mask:[1,0,1,0,1,0]});
  //sequencer.addTrack({voice:voice2, mask:[0,1,0,1,0,1]});
  sequencer.addTrack({voice:voice3, mask:[1,0,0,1,0,0]});

  compressor.connect(context.destination, compressor);

  const startButton = document.querySelector(".start");
  startButton.addEventListener("click", startAudio);

  const stopButton = document.querySelector(".stop");
  stopButton.addEventListener("click", stopAudio);

  function startAudio(){
  //  voice.start();
   // voice2.start();
    voice3.start();


    const clock = new Clock(2000, ()=>{
      sequencer.tick();
    });
    clock.start();

  }


  function stopAudio(){
    //voice.stop();
    //voice2.stop();
    voice3.stop();
  }



});


