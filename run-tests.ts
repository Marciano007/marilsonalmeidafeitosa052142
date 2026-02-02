// Minimal test runner to execute our .spec.ts files without Jasmine
const path = require('path');

// Simple global test functions
(global as any).describe = (name: string, fn: () => any) => { console.log(name); fn(); };
const _before: Function[] = [];
const _after: Function[] = [];

(global as any).beforeEach = (fn: Function) => { _before.push(fn); };
(global as any).afterEach = (fn: Function) => { _after.push(fn); };

(global as any).it = (name: string, fn: (() => any) | Promise<any>) => {
  try {
    _before.forEach(f => { try { f(); } catch (e) { /* ignore */ } });
    try {
      if ((fn as any).length > 0) {
        // function expects a done callback
        return new Promise((resolve, reject) => {
          const done = (err?: any) => {
            if (err) { console.error('  ✗', name, err); reject(err); }
            else { console.log('  ✓', name); resolve(null); }
          };
          try { (fn as any)(done); } catch (e) { console.error('  ✗', name, e); reject(e); }
        }).then(() => { _after.forEach(f => { try { f(); } catch (e) { /* ignore */ } }); });
      }

      const res = (fn as any)();
      if (res && typeof res.then === 'function') {
        return res.then(() => { console.log('  ✓', name); _after.forEach(f => { try { f(); } catch (e) { /* ignore */ } }); }).catch((e: any) => { console.error('  ✗', name, e); _after.forEach(f => { try { f(); } catch (e) { /* ignore */ } }); });
      }
      console.log('  ✓', name);
      _after.forEach(f => { try { f(); } catch (e) { /* ignore */ } });
    } catch (e) {
      console.error('  ✗', name, e);
      _after.forEach(f => { try { f(); } catch (e) { /* ignore */ } });
    }
  } catch (e) {
    console.error('  ✗', name, e);
    _after.forEach(f => { try { f(); } catch (e) { /* ignore */ } });
  }
};

(global as any).expect = (actual: any) => {
  return {
    toBe: (expected: any) => { if (actual !== expected) throw new Error(`Expected ${actual} to be ${expected}`); },
    toBeNull: () => { if (actual !== null) throw new Error(`Expected ${actual} to be null`); },
    toHaveBeenCalled: () => { if (!actual || !actual.calls || actual.calls.length === 0) throw new Error('Expected spy to have been called'); },
    toHaveBeenCalledWith: (...args: any[]) => { if (!actual || !actual.calls) throw new Error('No calls'); const found = actual.calls.some((c: any) => JSON.stringify(c.args) === JSON.stringify(args)); if (!found) throw new Error('Expected call with ' + JSON.stringify(args)); }
  };
};

// Minimal spyOn implementation
(global as any).spyOn = (obj: any, method: string) => {
  const original = obj[method];
  const calls: any[] = [];
  const spyFn: any = function (...args: any[]) {
    calls.push({ args });
    if (spyFn._returnValueSet) return spyFn._returnValue;
    return original && original.apply(this, args);
  };
  spyFn.calls = calls;
  spyFn.and = {
    returnValue: (v: any) => { spyFn._returnValueSet = true; spyFn._returnValue = v; }
  };
  obj[method] = spyFn;
  // attach restore to the spy function and return the spy function (Jasmine-like)
  spyFn.restore = () => { obj[method] = original; };
  return spyFn;
};

// Run the spec files
(async () => {
  try {
    const spec1 = path.join(__dirname, 'src/app/services/auth.service.spec.ts');
    const spec2 = path.join(__dirname, 'src/app/services/api.service.spec.ts');
    await import(spec1);
    await import(spec2);
    console.log('\nAll tests executed');
  } catch (e) {
    console.error('Error running tests', e);
    process.exitCode = 1;
  }
})();
