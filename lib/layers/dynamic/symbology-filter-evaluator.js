/**
 * Utility class that evaluates filter configurations to identify symbology to use when rendering a
 * dynamic data point.
 */
export default function evaluate(filter, parentFieldName, dataRecord) {

  // Identify the field name to use for evaluation. If it is not defined at the Filter-level, use
  // the specified parentFieldName.
  const fieldName = filter.fieldName || parentFieldName;
  return Object.keys(filter).every((key) => {

    // Ignore if 'fieldName'.
    if (key !== 'fieldName') {

      const value = filter[key];

      switch (key) {
        case 'and':
          // An AND has sub-filters which must all return 'true' for the AND to return 'true'.
          return value.every((subFilter) => evaluate(subFilter, fieldName, dataRecord));

        case 'or':
          // An OR has sub-filters where at least one must return 'true' for the OR to return
          // 'true'.
          return value.some((subFilter) => evaluate(subFilter, fieldName, dataRecord));

        case 'equals':
          return dataRecord[fieldName] === value;

        case 'gt':
          return dataRecord[fieldName] > value;

        case 'gte':
          return dataRecord[fieldName] >= value;

        case 'lt':
          return dataRecord[fieldName] < value;

        case 'lte':
          return dataRecord[fieldName] <= value;

        case 'rangeInclusive':
          return dataRecord[fieldName] >= value.low && dataRecord[fieldName] <= value.high;

        case 'rangeExclusive':
          return dataRecord[fieldName] > value.low && dataRecord[fieldName] < value.high;

        default:
          return true;
      }

    } else {
      return true;
    }
  }, this);

}
