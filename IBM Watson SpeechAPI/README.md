IBM Watson Speech API für JavaScript - Node.JS
===========================================

[![Build Status](https://travis-ci.org/watson-developer-cloud/speech-javascript-sdk.svg?branch=master)](https://travis-ci.org/watson-developer-cloud/speech-javascript-sdk)
[![npm-version](https://img.shields.io/npm/v/watson-speech.svg)](https://www.npmjs.com/package/watson-speech)

Vorrausetzungen:

Plattform Anforderungen: Nose.js und npm

Downloadlink: https://nodejs.org/en/

## Setup Node.js

1.Wechsel mit dem cd Befehl in der Konsole (Terminal cmd) in den examples/ Verzeichnis des heruntergeladenen IBM Speech-To-Text Projektes und führe anschließend npm install aus, um die Dependencies herzuholen.

2.Bearbeite stt-token.js, um den zuvor erstellen Benachrichtigungsnachweis einzufügen.

3.Starte die Applikation mit npm start

4.Öffnen einen Browser und rufe http://localhost:3000/ auf, um die Beispiele aufzuführen.

Die Beispiele verwenden einen Node.js Server, um einen Token zu generien. Die Beispiele müssen nicht zwingend in Nose.js geschrieben werden, jedoch ist ein serverseitiger Tokengenerator erforderlich.

Die Speech SDK kann in Browserfiy (Modularisierung des Codes) oder kann als Standalone Library genutzt werden. Die im Projektverzeichnis verwendeten Beispiele werden alle als Standalone Library genutzt. In dem Projektverzeichnis sind Node.js Beispiele drin, um Authentifizierungs-Tokens und mehrere html-Dateien (in static/) für die Verwendung des Speech-to-Text Dienste zu generieren.

Für alle API Methoden ist ein Authentifizierungs-Token erforderlich, das serverseitig erzeugt werden muss.

## Speech-To-Text Methoden

Es gibt grundlegend zwei Methoden um mit der JavaScript SDK zu interagieren:

·       recognizeMicrophone() für Live-Mikrofoninput

·       recognizeFile() für Datei <input>'s

## [`WatsonSpeech.SpeechToText`](http://watson-developer-cloud.github.io/speech-javascript-sdk/master/module-watson-speech_speech-to-text.html)


### [`.recognizeMicrophone({token})`](http://watson-developer-cloud.github.io/speech-javascript-sdk/master/module-watson-speech_speech-to-text_recognize-microphone.html) -> Stream

Options: 
* `keepMic`: if true, preserves the MicrophoneStream for subsequent calls, preventing additional permissions requests in Firefox
* Other options passed to [RecognizeStream]
* Other options passed to [WritableElementStream] if `options.outputElement` is set

Requires the `getUserMedia` API, so limited browser compatibility (see http://caniuse.com/#search=getusermedia) 
Also note that Chrome requires https (with a few exceptions for localhost and such) - see https://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features

Pipes results through a [FormatStream] by default, set `options.format=false` to disable.

Known issue: Firefox continues to display a microphone icon in the address bar after recording has ceased. This is a browser bug.

### [`.recognizeFile({data, token})`](http://watson-developer-cloud.github.io/speech-javascript-sdk/master/module-watson-speech_speech-to-text_recognize-file.html) -> Stream

Can recognize and optionally attempt to play a [File](https://developer.mozilla.org/en-US/docs/Web/API/File) or [Blob](https://developer.mozilla.org/en-US/docs/Web/API/Blob)
(such as from an `<input type="file"/>` or from an ajax request.)

Options: 
* `data`: a `Blob` or `File` instance. 
* `play`: (optional, default=`false`) Attempt to also play the file locally while uploading it for transcription 
* Other options passed to [RecognizeStream]
* Other options passed to [WritableElementStream] if `options.outputElement` is set

`play`requires that the browser support the format; most browsers support wav and ogg/opus, but not flac.) 
Will emit a `playback-error` on the RecognizeStream if playback fails. 
Playback will automatically stop when `.stop()` is called on the RecognizeStream.

Pipes results through a [TimingStream] by if `options.play=true`, set `options.realtime=false` to disable.

Pipes results through a [FormatStream] by default, set `options.format=false` to disable.


## Changes

There have been a few breaking changes in recent releases:

* Removed `SpeechToText.recognizeElement()` due to quality issues
* renamed `recognizeBlob` to `recognizeFile` to make the primary usage more apparent
* Changed `playFile` option of `recognizeBlob()` to just `play`, corrected default
* Changed format of objects emitted in objectMode to exactly match what service sends. Added `ResultStrean` class and `extract_results` option to enable older behavior.
* Changed `playback-error` event to just `error` when recognizing and playing a file. Check for `error.name == 'UNSUPPORTED_FORMAT'` to identify playback errors



