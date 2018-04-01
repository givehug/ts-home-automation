// check SpeechSynthesisUtterance support
const SpeechSynthesisUtterance = window && (
  window.webkitSpeechSynthesisUtterance
    || window.mozSpeechSynthesisUtterance
    || window.msSpeechSynthesisUtterance
    || window.oSpeechSynthesisUtterance
  || window.SpeechSynthesisUtterance
);

export default SpeechSynthesisUtterance;
