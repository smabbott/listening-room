What if the digital footprint of visitors to a web space could be turned into music? What might that sound like? There are countless ways visitor data might be interpreted to generate sound, and dare I say, even music. Listening Room is a playground for turning the data browsers give away into something we can hear. It is a curious "why not" response to a "what if" question that serves as a set of constraints for composing real-time generative music. 

### how it works
When a browser loads Listening Room certain pieces of non-sensitive information about that connection are shared with the server
- operating system
- time of connection
- browser
- etc.

This information is translated into different musical parameters related to a voice or instrument such as a sequence of notes, a rhythmic pattern, harmonic relationships and so on. That information is then fed back to all connected clients which then synthesize sound based on those parameters. Everyone connected to the site at that moment can hear a sonic representation of all other connected clients.

### Installation
This repo is really just that. It isn't intended to be installed anywhere but in one server (coming soon). But, if you are inclined to play around and you're familiar with Flask, you are welcome to clone it and run it yourself. 
`python app.py`
