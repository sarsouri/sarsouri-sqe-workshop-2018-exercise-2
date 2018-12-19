import {pv} from '../src/js/ast';
import assert from 'assert';

function tostring(color,n) {
    var s='{';
    for (let i=1;i<n;i++) {
        if (color.has(i)){
            if (color.get(i)) {
                s=s+'(line '+i.toString()+':green'+'),';
            }else {
                s=s+'(line '+i.toString()+':red'+'),';
            }
        }

    }
    s=s+'}';
    return s;
}
describe('The javascript parser', () => {
    it('we want to test this statement : 1', () => {  assert.equal( tostring(pv('function foo(x, y, z){\n' + '    let a = x + 1;\n' + '    let b = a + y;\n' + '    let c = 0;\n' + '    \n' + '    if (b < z) {\n' + '        c = c + 5;\n' + '        return x + y + z + c;\n' + '    } else if (b < z * 2) {\n' + '        c = c + x + 5;\n' + '        return x + y + z + c;\n' + '    } else {\n' + '        c = c + z + 5;\n' + '        return x + y + z + c;\n' + '    }\n' + '}\n','2,3,5'),9),'{(line 2:red),(line 4:green),}'); });
    it('we want to test this statement : 1', () => {  assert.equal( tostring(pv('var t=15;\n' + 'var tt=22;\n' + 'function foo(x, y, z){\n' + '    let a = x + 1;\n' + '    let b = a + y;\n' + '    let c = 0;\n' + '    \n' + '    if (b < z) {\n' + '        c = c + 5;\n' + '        return x + y + z + c;\n' + '    } else if (b < z * 2) {\n' + '        c = c + x + 5;\n' + '        return x + y + z + c;\n' + '    } else {\n' + '        c = c + z + 5;\n' + '        return x + y + z + c;\n' + '    }\n' + '}','2,3,15'),11),'{(line 4:green),}'); });
    it('we want to test this statement : 1', () => {  assert.equal( tostring(pv('function foo(x, y, z){\n' + '    let a = 15;\n' + '    let b = 22;\n' + '    let c ;\n' + '    if (b<z)\n' + '       return x ;\n' + '}','2,15,23'),5),'{(line 2:green),}'); });
    it('we want to test this statement : 1', () => {  assert.equal( tostring(pv('function foo(x, y, z){\n' + '    let a = x;\n' + '    let b = a + y;\n' + '    let c ;\n' + '    c=15;\n' + '    if (b < z) \n' + '        return x;\n' + '}\n','2,22,15'),9),'{(line 2:red),}'); });
    it('we want to test this statement : 1', () => {  assert.equal( tostring(pv('function foo(x, y, z){\n' + '    let a = x;\n' + '    let b = a + y;\n' + '    let c ;\n' + '    c=b;\n' + '    if (b < z) \n' + '        return x;\n' + '    if (!true)\n' + '      x=a;\n' + '}\n','2,3,5'),9),'{(line 2:red),(line 4:red),}'); });
    it('we want to test this statement : 1', () => {  assert.equal( tostring(pv('function foo(x, y, z){\n' + '    if (true)\n' + '      x=25;\n' + '}','1,1,1'),9),'{(line 2:green),}'); });
    it('we want to test this statement : 1', () => {  assert.equal( tostring(pv('function foo(x, y, z){\n' + '    let a = x + 1;\n' + '    let b = a + y;\n' + '    let c = 0;\n' + '    \n' + '    while (x < z) {\n' + '        c = a + b;\n' + '        x = c * 2;\n' + '    }\n' + '    \n' + '    return z;\n' + '}\n','2,2,15'),9),'{}'); });
    it('we want to test this statement : 1', () => {  assert.equal( tostring(pv('function foo(x, y, z){\n' + '    let a = x + 1;\n' + '    let b = a + y;\n' + '    let c = 0;\n' + '    \n' + '    if (b < z) {\n' + '        c = c + 5;\n' + '        return x + y + z + c;\n' + '    } else  {\n' + '        return x + y + z + c;\n' + '    }\n' + '}\n','2,2,5'),9),'{(line 2:red),}'); });
    it('we want to test this statement : 1', () => {  assert.equal( tostring(pv('let tt;\n' + 'function foo(x, y, z){\n' + '    let a = x + 1;\n' + '    let b = a + y;\n' + '    let c = 0;\n' + '    \n' + '    if (b < z) {\n' + '        c = c + 5;\n' + '        return x + y + z + c;\n' + '    } else  {\n' + '        return x + y + z + c;\n' + '    }\n' + '}\n','2,2,15'),9),'{(line 3:green),}'); });
    it('we want to test this statement : 1', () => {  assert.equal( tostring(pv('function foo(x, y, z){\n' + '    let a = x + 1;\n' + '    let b = a + y;\n' + '    let c = 15;\n' + '    \n' + '    if (b < z) {\n' + '        c = c + 5;\n' + '        return x + y + z + c;\n' + '    } else if (b < z * 2) {\n' + '        c = c + x + 5;\n' + '        return x + y + z + c;\n' + '    } else {\n' + '        c = c + z + 5;\n' + '        return x + y + z + c;\n' + '    }\n' + '}\n','2,2,15'),9),'{(line 2:green),}'); });

});