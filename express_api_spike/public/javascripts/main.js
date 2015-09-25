var List = function() {
  this.items = [];
};

List.prototype.add = function(item) {
  this.items.push(item);
};

List.prototype.clear = function() {
  this.items = [];
};
