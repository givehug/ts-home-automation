/**
 * Test SpeechSynthesisUtterance browser support
 */
const SpeechSynthesisUtterance = window && (
  (window as any).webkitSpeechSynthesisUtterance
    || (window as any).mozSpeechSynthesisUtterance
    || (window as any).msSpeechSynthesisUtterance
    || (window as any).oSpeechSynthesisUtterance
    || (window as any).SpeechSynthesisUtterance
);

export default SpeechSynthesisUtterance;
