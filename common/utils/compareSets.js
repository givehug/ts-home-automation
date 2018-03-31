/**
 * Compare two sets
 * @param {Set} setA
 * @param {Set} setB
 * @returns true if sets are equal, false if not
 */
function compareSets(setA, setB) {
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
