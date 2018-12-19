import * as esprima from 'esprima';
import * as escodegen from 'escodegen';

const parseCode = (codeToParse,theline) => {
    return esprima.parseScript(codeToParse,{loc:theline});
};
const UnparseCode = (codeToUnParse) => {
    return escodegen.generate(codeToUnParse);
};

export {parseCode,UnparseCode};
