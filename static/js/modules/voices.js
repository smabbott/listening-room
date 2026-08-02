class Voice{
  constructor(context, destination){
    if(destination === null){
        this.destination = context.destination;
      }else{
        this.destination = destination;
      }
    
    this.destination = destination;
    this.context = context;
  }


  noteOn(fq, length, delay=0){
    var osc = this.context.createOscillator();
    var gain = this.context.createGain();
    var now = this.context.currentTime;
    gain.gain.setValueAtTime(0, now);
    osc.frequency.setValueAtTime(fq, now);
    osc.connect(gain);
    gain.connect(this.destination);
    osc.start();
    this.ar(gain.gain, length * 0.5, length * 0.5, delay);
  }

  noteOff(){
    this.gain.gain.linearRampTpValueAtTime(0, this.context.currentTime + 0.1);
  }

  stop(){
    this.osc.stop();
  }

  asdr(property, attack, decay, sustain, release){
    let now = this.context.currentTime;
    property.linearRampToValueAtTime(1, now + attack); //0.1);
    property.linearRampToValueAtTime(0.3, now + attack +decay); //0.5);
    property.setValueAtTime(0.3, now + attack + decay + sustain);
    property.linearRampToValueAtTime(0, now + attack + decay + sustain + release); //0.5);    
  }

  // TODO: option to set peak value
  ar(property, attack, release, delay){
    var startTime = this.context.currentTime + delay;
    property.setValueAtTime(0, startTime);
    property.linearRampToValueAtTime(1, startTime + attack); 
    property.linearRampToValueAtTime(0, startTime + attack + release); 
  }

}

class Buzzard extends Voice{
  
  // TODO: rather than repeating, this should be calling super()
  // However, this has not been working. 
  // Maybe there is a way to do it with a callback or a seperate construct
  noteOn(fq, length, delay=0){
    var frequency = fq/2;
    var osc = this.context.createOscillator();
    var gain = this.context.createGain();
    var now = this.context.currentTime;
    var filter = new BiquadFilterNode(this.context, {
      type:'bandpass',
      Q:10
    });
    osc.type="sawtooth";
    gain.gain.setValueAtTime(0, now);
    osc.frequency.setValueAtTime(frequency, now);
    filter.frequency.setValueAtTime(frequency, now);
    osc.connect(gain);
    gain.connect(filter);
    filter.connect(this.destination);
    osc.start();
    this.ar(gain.gain, length * 0.5, length * 0.5, delay);
    filter.frequency.linearRampToValueAtTime(40, now + length + delay);
  }

}

export {Voice, Buzzard}
