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
  osc.type="square";
  osc.frequency.setValueAtTime(440, context.currentTime);
  osc.connect(context.destination);

  const startButton = document.querySelector(".start");
  startButton.addEventListener("click", startAudio);

  function startAudio(){
    osc.start();
  }

});



