'use strict';

const DateRange = function (from, to) {
  this.contains = function (date) {
    return date >= this.from && date <= this.to;
  };

  this.from = from;
  this.to = to;
};

DateRange.widen = function () {
  const args = Array.prototype.slice.call(arguments, 0);
  const froms = args.map((range) => range.from);
  const tos = args.map((range) => range.to);

  const earliestFrom = froms.reduce((a, b) => a < b ? a : b);
  const latestTo = tos.reduce((a, b) => a > b ? a : b);

  return new DateRange(earliestFrom, latestTo);
};
module.exports = DateRange;
