// check SpeechSynthesisUtterance support
export const SpeechSynthesisUtterance = window.webkitSpeechSynthesisUtterance
    || window.mozSpeechSynthesisUtterance
    || window.msSpeechSynthesisUtterance
    || window.oSpeechSynthesisUtterance
    || window.SpeechSynthesisUtterance;
