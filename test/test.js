require('node_modules/chai').should();

import Stateful from 'stateful';

describe('Stateful mixin', () => {

  let foo;

  beforeEach(() => {
    foo = new Stateful();
  });

  it("calls setState()", () => {
    foo.setState({a:1, b:2});
    foo.state.a.should.eql(1);
    foo.state.b.should.eql(2);
  });

  it("calls setState with an empty object.", () => {
    foo.setState({});
    foo.state.should.eql({});
  });

  it("throw an error on attempting to reassign @state", () => {
    foo.setState({});
    (() => {foo.state = {}}).should.throw();
  });

  it("performs an overwrite with setState()", () => {
    foo.setState({a: 1});
    foo.state.a.should.eql(1);
    foo.setState({a: 2});
    foo.state.a.should.eql(2);
  });

  it("detaches a handler function.", () => {
    let i = 0;
    let handler = () => i++;
    foo.on('change', handler);
    foo.setState({a: 1});
    foo.setState({a: 2});
    i.should.eql(2);
    foo.off('change', handler);
    foo.setState({a: 3});
    i.should.eql(2);
  });

  it("avoids triggering handlers on repeating the same state.", () => {
    let i = 0;
    foo.on('change', () => i++);
    foo.setState({a: 1});
    i.should.eql(1);
    foo.setState({a: 1});
    i.should.eql(1);
  });

  it("tests setState() with array values.", () => {
    let i = 0;
    foo.on('change', () => i++);
    let l = [1, 2];
    foo.setState({a: l});
    i.should.eql(1);
    foo.setState({a: l});
    i.should.eql(1);
    foo.setState({a: [1, 2]});
    i.should.eql(2);
    foo.setState({a: [1, 2]});
    i.should.eql(3);
  });

  it("returns true if setState triggers a change.", () => {
    foo.setState({foo: 1}).should.be.true;
    foo.setState({foo: 1}).should.be.false;
    foo.setState({foo: 2}).should.be.true;
    foo.setState({foo: 2}).should.be.false;
  });

  describe("getInitialState()", () => {
    class Bar extends Stateful {
      getInitialState() {return {a:1, b:2}}
    };
    it("defines an initial state.", () => {
      (new Bar()).state.should.eql({a:1, b:2});
    });
    it("merges passed state with initial state.", () => {
      (new Bar({b:3})).state.should.eql({a:1, b:3});
    });
  });


  describe("changed state", () => {
    it("triggers a callback on change state.", () => {
      let i = 0;
      foo.on('change', (newState) => i++);
      foo.setState({a: 1});
      i.should.eql(1);
      foo.setState({a: 2});
      i.should.eql(2);
    });
    it("triggers a change state with arrays.", () => {
      let i = 0;
      foo.on('change', (newState) => i++);
      foo.setState({a: [1]});
      i.should.eql(1);
      let a = [1];
      foo.setState({a});
      i.should.eql(2);
      foo.setState({a});
      i.should.eql(2);
    });
    it("triggers a change state with nested arrays.", () => {
      let i = 0;
      foo.on('change', (newState) => i++);
      foo.setState({a: [[0]]});
      i.should.eql(1);
      foo.setState({a: [[1]]});
      i.should.eql(2);
      let a = [[1]];
      foo.setState({a});
      i.should.eql(3);
      a[0][0] = 0;
      foo.setState({a});
      i.should.eql(3);
    });
    it("triggers a change state with JSON.parse and JSON.stringify.", () => {
      let i = 0;
      foo.on('change', (newState) => i++);
      let a = [[1]];
      foo.setState({a});
      i.should.eql(1);
      a = JSON.parse(JSON.stringify(a));
      foo.setState({a});
      i.should.eql(2);
    });
  });

});
