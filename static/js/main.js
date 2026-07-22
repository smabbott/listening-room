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
  const osc = context.createOscillator();
  const gain = context.createGain();

  osc.type="square";
  osc.frequency.setValueAtTime(440, context.currentTime);
  
  

  const startButton = document.querySelector(".start");
  startButton.addEventListener("click", startAudio);

  const stopButton = document.querySelector(".stop");
  stopButton.addEventListener("click", stopAudio);

  function startAudio(){
    osc.start();
    osc.connect(gain);
    gain.connect(context.destination);
    const now = context.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(1, now + 0.01);
    gain.gain.linearRampToValueAtTime(0.3, now+0.05);
    gain.gain.linearRampToValueAtTime(0, now + 0.5);
  }

  function stopAudio(){
    osc.stop();
  }

});





