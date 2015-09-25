describe('List model', function() {

  beforeEach(function() {
    this.list = new List();
  });

  it('should initialise with an empty list', function() {
    var list = this.list;

    expect(list.items.length).toBe(0);
  });

  it('should add an item to the list', function() {
    var list = this.list;

    list.add('text');

    expect(list.items.length).toBe(1);
    expect(list.items[0]).toBe('text');
  });

  it('should clear a populated list', function() {
    var list = this.list;

    list.add('text');

    expect(list.items.length).toBe(1);

    list.clear();

    expect(list.items.length).toBe(0);

  });

});
