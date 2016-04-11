'use strict';

function DateRange(from, to) {
  this.contains = function (date) {
    return date >= this.from && date <= this.to
  };

  this.from = from;
  this.to = to;
}

module.exports = DateRange;
