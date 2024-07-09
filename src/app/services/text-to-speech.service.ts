import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextToSpeechService {
  private synth: SpeechSynthesis;

  constructor() {
    this.synth = window.speechSynthesis;
  }

  speak(text: string) {
    if (this.synth && text) {
      const utterance = new SpeechSynthesisUtterance(text);
      this.synth.speak(utterance);
    }
  }

  stop() {
    if (this.synth) { this.synth.cancel(); }
  }

  resume() {
    if (this.synth.paused) { this.synth.resume(); }
  }

  // pausing does not work; speaking is always true
  checkPlayback(text: string) {
    if (this.synth.speaking) { this.synth.pause(); console.log(this.synth.speaking, "paused") }
    else if (this.synth.paused) { this.synth.resume(); console.log(this.synth.paused, "speaking") }
    else { this.speak(text); console.log("started")}
  }
}
