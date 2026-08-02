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
    //this.frequency = 440;
    this.context = context;
    /*
    this.osc = this.context.createOscillator();
    this.gain = this.context.createGain();
    this.osc.frequency.setValueAtTime(this.frequency, this.context.currentTime);
    this.osc.connect(this.gain);
    this.gain.connect(this.destination);    
    */
  }

//  start(){
    //this.osc.start();
 // }

  noteOn(fq, length){
    console.log("noteOn ", fq, length)
    var osc = this.context.createOscillator();
    var gain = this.context.createGain();
    osc.frequency.setValueAtTime(fq, this.context.currentTime);
    osc.connect(gain);
    gain.connect(this.destination);
    osc.start();
    osc.frequency.setValueAtTime(fq, this.context.currentTime);
    /*
    if(fq !== null){
      this.frequency = fq;
      this.osc.frequency.setValueAtTime(this.frequency, this.context.currentTime);
    }
    */
    this.ar(gain.gain, length * 0.5, length * 0.5);
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
      // FIXME:
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

export {Voice, Buzzard}
