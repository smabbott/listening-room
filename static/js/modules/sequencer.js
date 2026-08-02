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
      // default scale: Cmaj (C, D, E, F, G, A, B)
      this.scale = [65.4, 73.4, 82.4, 87.3, 97.99, 110, 123.5];
      this.tracks =[];
      // track = {voice:v1, mask:[1,0,1,0,], length, frequency, emphasis}
      this.tickCount = 0;

    }

    // scale Array of frequencies, traditionally 8 notes but could be any practacal length
    setScale(scale){
      this.scale = scale;
    }

    tick(){
      for(let t in this.tracks) {
        const track = this.tracks[t];
        // get the next beat in the track. 
        // Using the modulus of the track lenght 
        // allows for tracks of different length to play simultaneously
        // slipping in and out of sync
        let beat = this.tickCount%track.mask.length-1;
        // TODO: interperate numbers as fractional beats rather than simply on or off
        // - shold this support odd polyrhythms or quantize to a given set of "safe" subdivisions?
        // - could there be a way to dynamically change this quantization over time as a gobal parameter?
        if(track.mask[beat] !== 0){
          let note = this.scale[Math.floor(Math.random()*this.scale.length)];
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

// TODO: Is it necessary to export clock. Maybe it's only needed internally for the sequencer
export {Clock, Sequencer}
