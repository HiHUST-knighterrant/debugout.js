import { Debugout } from './debugout';

describe('Debugout', () => {

  let debugout;
  const subjects = {
    string: 'A string',
    number: 26.2,
    boolean: false,
    date: new Date('2020-06-26T10:33:15Z'),
    array: [0, 'string', {}],
    object: { a: 'apple', b: 2, c: {}, d: [] },
    function: () => 'it works',
    regex: new RegExp(/debugout/),
    null: null,
    undef: undefined
  };

  describe('# determineType', () => {

    beforeEach(() => {
      debugout = new Debugout();
    });

    it('should properly type a string', () => {
      expect(debugout.determineType(subjects.string)).toEqual('string');
    });
    it('should properly type a number', () => {
      expect(debugout.determineType(subjects.number)).toEqual('number');
    });
    it('should properly type a boolean', () => {
      expect(debugout.determineType(subjects.boolean)).toEqual('boolean');
    });
    it('should properly type a date', () => {
      expect(debugout.determineType(subjects.date)).toEqual('Date');
    });
    it('should properly type an array', () => {
      expect(debugout.determineType(subjects.array)).toEqual('Array');
    });
    it('should properly type an object', () => {
      expect(debugout.determineType(subjects.object)).toEqual('Object');
    });
    it('should properly type a function', () => {
      expect(debugout.determineType(subjects.function)).toEqual('function');
    });
    it('should properly type a regex', () => {
      expect(debugout.determineType(subjects.regex)).toEqual('RegExp');
    });
    it('should properly type null', () => {
      expect(debugout.determineType(subjects.null)).toEqual('null');
    });
    it('should properly type undefined', () => {
      expect(debugout.determineType(subjects.undef)).toEqual('undefined');
    });
  });

  describe('# indentsForDepth', () => {

    beforeEach(() => {
      debugout = new Debugout();
    });

    it('should work', () => {
      expect(debugout.indentsForDepth(1)).toEqual('  ');
      expect(debugout.indentsForDepth(2)).toEqual('    ');
      expect(debugout.indentsForDepth(3)).toEqual('      ');
    });
  });

  describe('# stringify', () => {

    beforeEach(() => {
      debugout = new Debugout();
    });

    it('should properly stringify a string', () => {
      expect(debugout.stringify(subjects.string)).toEqual('"A string"');
    });
    it('should properly stringify a number', () => {
      expect(debugout.stringify(subjects.number)).toEqual('26.2');
    });
    it('should properly stringify a boolean', () => {
      expect(debugout.stringify(subjects.boolean)).toEqual('false');
    });
    it('should properly stringify a date', () => {
      const result = debugout.stringify(subjects.date);
      expect(result.substring(0, 16)).toEqual('"Fri Jun 26 2020');
    });
    it('should properly stringify an array', () => {
      const expected = '[0, "string", {}]';
      expect(debugout.stringify(subjects.array)).toEqual(expected);
    });
    it('should properly stringify an object', () => {
      const expected = '{\n  a: "apple",\n  b: 2,\n  c: {},\n  d: []\n}';
      expect(debugout.stringify(subjects.object)).toEqual(expected);
    });
    it('should properly stringify a function', () => {
      expect(debugout.stringify(subjects.function)).toEqual('function () { return \'it works\'; }');
    });
    it('should properly stringify a regex', () => {
      expect(debugout.stringify(subjects.regex)).toEqual('/debugout/');
    });
    it('should properly stringify null', () => {
      expect(debugout.stringify(subjects.null)).toEqual('null');
    });
    it('should properly stringify undefined', () => {
      expect(debugout.stringify(subjects.undef)).toEqual('undefined');
    });
    it('can handle objects nested in objects', () => {
      const subj = { nested: subjects.object };
      const nested = '{\n    a: "apple",\n    b: 2,\n    c: {},\n    d: []\n  }';
      const expected = `{\n  nested: ${nested}\n}`;
      expect(debugout.stringify(subj)).toEqual(expected);
    });
    it('can handle arrays nested in objects', () => {
      const subj = { nested: subjects.array };
      const nested = '[0, "string", {}]';
      const expected = `{\n  nested: ${nested}\n}`;
      expect(debugout.stringify(subj)).toEqual(expected);
    });
    it('can handle arrays nested in arrays', () => {
      const subj = [subjects.array];
      const nested = '[0, "string", {}]';
      const expected = `[\n  ${nested}\n]`;
      expect(debugout.stringify(subj)).toEqual(expected);
    });
    it('can handle objects nested in arrays', () => {
      const subj = [subjects.object];
      const nested = '{\n    a: "apple",\n    b: 2,\n    c: {},\n    d: []\n  }';
      const expected = `[\n  ${nested}\n]`;
      expect(debugout.stringify(subj)).toEqual(expected);
    });

  });

  describe('# log', () => {

    it('caches logs in memory', () => {
      debugout = new Debugout({ includeSessionMetadata: false });
      debugout.log('a test');
      const result = debugout.getLog();
      expect(result).toEqual('"a test"\n');
    });

    it('can handle multiple args', () => {
      debugout = new Debugout({ includeSessionMetadata: false });
      debugout.log('a string', subjects.string);
      debugout.log('2 numbers', 26.2, 98.6);
      const results = debugout.getLog().split('\n');
      expect(results[0]).toEqual('"a string" "A string"');
      expect(results[1]).toEqual('"2 numbers" 26.2 98.6');
    });
  });

  describe('# getLog', () => {

    it('gets the log', () => {
      debugout = new Debugout({ includeSessionMetadata: false });
      debugout.log('a string', subjects.string);
      const result = debugout.getLog();
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('# clear', () => {

    it('clears the log', () => {
      debugout = new Debugout({ includeSessionMetadata: false });
      debugout.log('a string', subjects.string);
      debugout.clear();
      const result = debugout.getLog();
      expect(result.length).toEqual(0);
    });
  });

  describe('# trimLog', () => {

    it('trims the log', () => {
      debugout = new Debugout({ includeSessionMetadata: false, maxLines: 1 });
      debugout.log('a string', subjects.string);
      debugout.log('a number', 26.2);
      debugout.log('a number', 98.6);
      expect(debugout.getLog()).toEqual('"a number" 98.6\n');
    });
  });

  describe('# tail', () => {

    it('gets the tail', () => {
      debugout = new Debugout({ includeSessionMetadata: false });
      debugout.log('a string', subjects.string);
      debugout.log('a number', 26.2);
      debugout.log('a number', 98.6);
      expect(debugout.tail(2)).toEqual('"a number" 26.2\n"a number" 98.6\n');
    });
  });

  describe('# search', () => {

    it('finds all occurences of a search term', () => {
      debugout = new Debugout({ includeSessionMetadata: false });
      debugout.log('zebra, giraffe, gorilla');
      debugout.log('jeep, moab, utah');
      debugout.log('apple, orange, banana');
      debugout.log('hells revenge, fins n things, moab');
      expect(debugout.search('Moab')).toEqual('[0] "jeep, moab, utah"\n[1] "hells revenge, fins n things, moab"');
    });
  });

  describe('# slice', () => {

    it('gets a slice', () => {
      debugout = new Debugout({ includeSessionMetadata: false });
      debugout.log('zebra, giraffe, gorilla');
      debugout.log('jeep, moab, utah');
      debugout.log('apple, orange, banana');
      debugout.log('hells revenge, fins n things, moab');
      expect(debugout.slice(1, 3)).toEqual('"jeep, moab, utah"\n"apple, orange, banana"');
    });
  });

});
