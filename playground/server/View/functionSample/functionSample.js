window.onload = init;

var context;
var bufferLoader;
var offlineCtx;

function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
    );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i);
}


function init() {
    try {
        context = new AudioContext();
    }
    catch(e) {
        alert("Web Audio API is not supported in this browser");
    }
    
    // Start loading the drum kit.
    bufferLoader = new BufferLoader(
        context,
        [
        "/sounds/kick.mp3",
        "/sounds/snare.mp3",
        "/sounds/hihat.mp3",
        "/sounds/Pop.mp3",
        "/sounds/alone.mp3",
        "/sounds/dtd.mp3",
        ],
        bufferLoadCompleted  
    );

    bufferLoader.load();
}

function playSound(buffer, time) {
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(time);
}

// Plays Rhythm 1
function startPlayingRhythm1(bufferList) {
    var kick = bufferList[0];
    var snare = bufferList[1];
    var hihat = bufferList[2];
    var pop = bufferList[3];
    
    // We'll start playing the rhythm 100 milliseconds from "now"
    var startTime = context.currentTime + 0.100;
    
    var tempo = 120; // BPM (beats per minute)
    var quarterNoteTime = 60 / tempo;

    // Play the kick drum on beats 1, 2, 3, 4
    playSound(kick, startTime);
    playSound(kick, startTime + quarterNoteTime);
    playSound(kick, startTime + 2*quarterNoteTime);
    playSound(kick, startTime + 3*quarterNoteTime);

    // Play the snare drum on beats 2, 4
    playSound(snare, startTime + quarterNoteTime);
    playSound(snare, startTime + 3*quarterNoteTime);
    
    // Play the hi-hat every 16th note.
    for (var i = 0; i < 16; ++i) {
        playSound(hihat, startTime + i*0.25*quarterNoteTime);
    }
}

// Plays Rhythm 2
function startPlayingRhythm2(bufferList) {
    var kick = bufferList[0];
    var snare = bufferList[1];
    var hihat = bufferList[2];
    
    // We'll start playing the rhythm 100 milliseconds from "now"
    var startTime = context.currentTime + 0.100;
    
    var tempo = 80; // BPM (beats per minute)
    var quarterNoteTime = 60 / tempo;

    // Play the kick drum on beats 1, 2, 3, 4
    playSound(kick, startTime);
    playSound(kick, startTime + 0.5*quarterNoteTime);	
    playSound(kick, startTime + 1.75*quarterNoteTime);
    playSound(kick, startTime + 2*quarterNoteTime);
    playSound(kick, startTime + 2.5*quarterNoteTime);
	
    // Play the snare drum on beats 2, 4
    playSound(snare, startTime + quarterNoteTime);
    playSound(snare, startTime + 3*quarterNoteTime);
    playSound(snare, startTime + 3.75*quarterNoteTime);	
    
    // Play the hi-hat every 16th note.
    for (var i = 0; i < 16; ++i) {
        playSound(hihat, startTime + i*0.25*quarterNoteTime);
    }
    playSound(hihat, startTime + 3.125*quarterNoteTime);
	
}

//function init() {

  /**
   * Appends list of  ArrayBuffers into a new one.
   * 
   * @param {ArrayBuffer} buffer1 The first buffer.
   * @param {ArrayBuffer} buffer2 The second buffer.
   */
  function  _concatAudio(buffers) {
    let output = context.createBuffer(1, 44100*_totalDuration(buffers), 44100),
      offset = 0;
    buffers.map(buffer => {
      output.getChannelData(0).set(buffer.getChannelData(0), offset);
      offset += buffer.length;
    });
    return output;
  }

    function _totalDuration(buffers) {
    return buffers.map(buffer => buffer.duration).reduce((a, b) => a + b, 0);
  }

  function _mergeAudio(buffers) {
    maxDuration = Math.max.apply(Math, buffers.map(buffer => buffer.duration));
    let output = context.createBuffer(1, 44100*maxDuration, 44100);

    buffers.map(buffer => {
      for (let i = buffer.getChannelData(0).length - 1; i >= 0; i--) {
        //console.log(buffer.getChannelData(0)[i]);
        output.getChannelData(0)[i] += buffer.getChannelData(0)[i];
      }
    });
    return output;
  }

  function _interleave(input) {
    let buffer = input.getChannelData(0),
      length = buffer.length*2,
      result = new Float32Array(length),
      index = 0, inputIndex = 0;

    while (index < length){
      result[index++] = buffer[inputIndex];
      result[index++] = buffer[inputIndex];
      inputIndex++;
    }
    return result;
  }

    function _writeHeaders(buffer) {
    let arrayBuffer = new ArrayBuffer(44 + buffer.length * 2),
      view = new DataView(arrayBuffer);

    _writeString(view, 0, 'RIFF');
    view.setUint32(4, 32 + buffer.length * 2, true);
    _writeString(view, 8, 'WAVE');
    _writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 2, true);
    view.setUint32(24, 44100, true);
    view.setUint32(28, 44100 * 4, true);
    view.setUint16(32, 4, true);
    view.setUint16(34, 16, true);
    _writeString(view, 36, 'data');
    view.setUint32(40, buffer.length * 2, true);

    return _floatTo16BitPCM(view, buffer, 44);
  }

  function _floatTo16BitPCM(dataview, buffer, offset) {
    for (var i = 0; i < buffer.length; i++, offset+=2){
      let tmp = Math.max(-1, Math.min(1, buffer[i]));
      dataview.setInt16(offset, tmp < 0 ? tmp * 0x8000 : tmp * 0x7FFF, true);
    }
    return dataview;
  }

  function _writeString(dataview, offset, header) {
    let output;
    for (var i = 0; i < header.length; i++){
      dataview.setUint8(offset + i, header.charCodeAt(i));
    }
  }


  function _renderURL(blob) {
    return (window.URL || window.webkitURL).createObjectURL(blob);
  }

  function _renderAudioElement(blob, type) {
    const audio = document.createElement('audio');
    audio.controls = 'controls';
    audio.type = type;
    audio.src = _renderURL(blob);
    return audio;
  }


  function _exportAudio(buffer, audioType){
    const type = audioType || 'audio/mp3';
    const recorded = _interleave(buffer);
    const dataview = _writeHeaders(recorded);
    const audioBlob = new Blob([dataview], { type: type });

    return {
      blob: audioBlob,
      url: _renderURL(audioBlob),
      element: _renderAudioElement(audioBlob, type),
    }
  }


   function download(blob, filename) {
    const name = filename || 'crunker';
    const a = document.createElement("a");
    a.style = "display: none";
    a.href = _renderURL(blob);
        a.download = `${name}.${blob.type.split('/')[1]}`;
    a.click();
    return a;
  }

function Play(buffer){

  var source = context.createBufferSource();
    
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(0);
    
}

function downloadMusic(buffer,filename){
    var output = _exportAudio(buffer,'audio/wav');
    download(output.blob, filename);
    console.log(output.url);
}

function merge(bufferList){
  var buffer = _mergeAudio(bufferList);
  Play(buffer);
}

function appendAudio(bufferList){
  Play(_concatAudio(bufferList));
}

function bufferLoadCompleted() {
	console.log("BufferList load completed!!!")
}