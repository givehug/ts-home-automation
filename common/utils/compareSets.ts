/**
 * Compare two sets
 * @param setA
 * @param setB
 * @returns true if sets are equal, false if not
 */
function compareSets(setA: Set<any>, setB: Set<any>) {
  if (setA.size !== setB.size) {
    return false;
  }

  for (const a of setA) {
    if (!setB.has(a)) {
      return false;
    }
  }

  return true;
}

export default compareSets;
