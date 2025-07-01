// logic/acceleration.js

class AccelerationCalculator {
  /**
   * Convert speed from km/h to m/s.
   * @param {number} kmh 
   * @returns {number}
   */
  kmhToMs(kmh) {
    return kmh / 3.6;
  }

  /**
   * Compute acceleration (m/s²) given two speed readings and the time difference.
   * @param {number} prevKmh  - previous speed in km/h
   * @param {number} currKmh  - current speed in km/h
   * @param {number} deltaSec - time difference in seconds (must be > 0)
   * @returns {number} acceleration in m/s²
   */
  computeAcceleration(prevKmh, currKmh, deltaSec) {
    if (deltaSec <= 0) {
      throw new Error('deltaSec must be positive');
    }
    const v0 = this.kmhToMs(prevKmh);
    const v1 = this.kmhToMs(currKmh);
    return (v1 - v0) / deltaSec;
  }
}

module.exports = new AccelerationCalculator();
