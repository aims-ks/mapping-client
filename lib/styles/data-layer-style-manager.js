/**
 * A specialised helper class for providing the DataLayerView with the appropriate style to use
 * when rendering a point. This class is expected to abstract all decisions away from the
 * DataLayerView. Extending classes must populate the {@link #_stylesCache} for use by
 * {@link #identifyStyle(Record)}.
 */
module.exports = class DataLayerStyleManager {

  /**
   * Constructor to define the internal properties ({@link #_internalCache} and {@link #_fieldName})
   * that must be populated by extending classes.
   */
  constructor() {
    this._internalCache = [];
    this._fieldName = null;
  }

  /**
   * Method invoked to identify the style to apply to the data point.
   *
   * @param dataRecord {Object} an object representing a single data record.
   */
  identifyStyle(dataRecord) {
    const cachedItem = this._internalCache.find(function(_cachedItem) {
      return this.evaluateFilter(this._fieldName, _cachedItem.filter, dataRecord);
    }, this);
    if (cachedItem) {
      return cachedItem.style;
    } else {
      return null;
    }
  };

  evaluateFilter(parentFieldName, filter, dataRecord) {

    // Grab the top-level fieldName if it is defined.
    const fieldName = filter.fieldName || parentFieldName;
    return Object.keys(filter).every(function(key) {

      // Ignore if 'fieldName'.
      if (key != 'fieldName') {

        const value = filter[key];

        switch (key) {
          case 'and':
            // An AND has sub-filters which must all return 'true' for the AND to return 'true'.
            return Object.keys(value).every(function(subFilter) {
              return this.evaluateFilter(fieldName, subFilter, dataRecord);
            }, this);
            break;

          case 'or':
            // An OR has sub-filters where at least one must return 'true' for the OR to return
            // 'true'.
            return Object.keys(value).some(function(subFilter) {
              return this.evaluateFilter(fieldName, subFilter, dataRecord);
            }, this);
            break;

          case 'equals':
            return dataRecord[fieldName] == value;
            break;

          case 'gt':
            return dataRecord[fieldName] > value;
            break;

          case 'gte':
            return dataRecord[fieldName] >= value;
            break;

          case 'lt':
            return dataRecord[fieldName] < value;
            break;

          case 'lte':
            return dataRecord[fieldName] <= value;
            break;

          case 'rangeInclusive':
            return dataRecord[fieldName] >= value.low && dataRecord[fieldName] <= value.high;
            break;

          case 'rangeExclusive':
            return dataRecord[fieldName] > value.low && dataRecord[fieldName] < value.high;
            break;

          default:
            return true;
        }

      } else {
        return true;
      }
    }, this);

  }

};
