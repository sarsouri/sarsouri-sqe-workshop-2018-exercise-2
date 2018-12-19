import {parseCode, UnparseCode} from './code-analyzer';

export {iv};
//var glopmap;
var parmsmap;
var xx;
var colortheline;
let ihavereturn;
//let index;
function iv(parsecode1,myparms,parms){
    xx= myparms.split(',');
    parmsmap=parms;
    colortheline=new Map();
    ihavereturn=false;
    //console.log(UnparseCode(parsecode1));
    f(parsecode1);
    //console.log(parmsmap);
    //console.log(colortheline);
    return colortheline;
    /* for (let i=0;i<xx.length;i++) {

    }*/
}

function  f(x) {
    //console.log(locmap.size);
    //console.log('map length'+mymap.size);

    if (x.type == 'Program') {
        for (let i = 0; i < x.body.length; i++) {
            f(x.body[i]);
        }
    }else
    if (x.type == 'FunctionDeclaration') { x=functiondeclaration(x);}else
        x=variabledeclaration(x);

    //return x;

}
function functiondeclaration(x){
    for (let i=0;i<x.params.length;i++) {
        let thelet =parseCode(xx[i],false);
        thelet.value=eval(xx[i]);
        thelet=thelet.body[0].expression;
       //console.log(UnparseCode(thelet));
        parmsmap.set(x.params[i].name,thelet);
       // console.log(parmsmap);
    }
    for(let i=0;i<x.body.body.length&&!ihavereturn;i++){
        //console.log(x.body.body[i]);
        f1(x.body.body[i]);
    }
}

function variabledeclaration(x) {
    for (let i=0;i<x.declarations.length;i++){
        if (x.declarations[i].init==null) {
            let thelet =null;
            parmsmap.set(x.declarations[i].id.name,thelet);
        }else {
            parmsmap.set(x.declarations[i].id.name,x.declarations[i].init);
        }
    }
}
function f1(x) {
    if (x.type=='ExpressionStatement') {expressionstatement(x);}else
    if (x.type=='IfStatement'){ifstatement(x);}else
    if (x.type=='ReturnStatement') {returnstatsment();}else
        whilestatment(x);
}
function ifstatement(x) {
   // console.log('213546512132312154');
    //console.log(x.test.operator);
    if (istrue(x.test)){
        //console.log(x.test.loc.end.line);
        colortheline.set(x.test.loc.end.line,true);
        blockornot(x.consequent);
    }else {
        colortheline.set(x.test.loc.end.line,false);
        if(x.alternate!=null) {
            if (x.alternate.type == 'IfStatement') {
                ifstatement(x.alternate);
            } else {
                blockornot(x.alternate);
            }
        }
    }
}
function expressionstatement(x) {
   // console.log('zhkan7yate');
   // console.log(x.expression.right);
    //console.log(t1(x.expression.right));
    let l=t1(x.expression.right);
    //console.log(l);
   // console.log(l+'5555555555555555555555');
    /*while (l.includes(';'))
        l=l.replace(';','');
        */
    //console.log(eval(l)+'*****');
    let thelet =parseCode(eval(l).toString(),false);
    thelet=thelet.body[0].expression;
    //console.log(thelet);
    parmsmap.set(x.expression.left.name,thelet);
}
function returnstatsment() {
    ihavereturn=true;
}
function whilestatment(x) {
    let i=0;
   /// console.log(x.test);
    while (istrue(x.test)) {
      //  console.log(parmsmap);
        blockornot(x.body);
        i++;
    }
}
function istrue(x) {
    let t;
    if (x.type=='BinaryExpression') {
        let l = t1(x.left);
        let r = t1(x.right);
        t = l + x.operator + r;
    }else {
        if (x.type=='UnaryExpression') {
            t=x.operator+t1(x.argument);
        }else  t=t1(x);
    }
    if (eval(t)) {
        return true;
    }
   // console.log('********************');
    return false;
}
function blockornot(x) {
    if (x.type=='BlockStatement') {
        for (let i = 0; i < x.body.length&&!ihavereturn; i++) {
            f1(x.body[i]);
        }
    }else{
        f1(x);
    }
}
function t1(x) {
    let str;
    if (x.type=='BinaryExpression') {
        str='('+t1(x.left)+x.operator+t1(x.right)+')';
    }else {
        if (x.type == 'Identifier') {
            str =  t3(x);
        }else{
            str=t4(x);
        }
    }
    //console.log(str);
    return str;
}
function t3(x) {
    let l= UnparseCode(parmsmap.get(x.name));
    //while (l.includes(';'))
    //   l=l.replace(';','');
    return l;
}
function t4(x) {
    let l= UnparseCode(x);
    //while (l.includes(';'))
    //    l=l.replace(';','');
    return l;
}
/*function getvalue(x) {
    if (x.type=='BinaryExpression') {
        x.left=  setvaluebinary(x.left);
        x.right= setvaluebinary(x.right);
    }
    if (x.type=='Identifier'){
        if (parmsmap.has(x.name)) {
            x=parmsmap.get(x.name);
        }
    }
    return x;
}
function setvaluebinary(x) {
    // console.log(mymap);
   // console.log(parmsmap);
    //console.log(x.type+'2222222222222222222');

    if (x.type=='Identifier'){
        //console.log(mymap.size);
        if (parmsmap.has(x.name)) {
            x= sd(x);
            //  let t=UnparseCode(x);
            //  console.log(t);
        }
    }else {
        if (x.type=='BinaryExpression') {
            x.left= setvaluebinary(x.left);
            x.right=  setvaluebinary(x.right);
        }
    }
    return x;
}
function sd(x) {
    //console.log(x.name+'1121545');
   // console.log(mymap);
    if (parmsmap.has(x.name)) {
       // console.log('hhhhhhhhhhhhhhhhh');
       // console.log(x.name+'******ddddd');
        x = parmsmap.get(x.name);
      //  console.log(UnparseCode(x));
    }else {
      //  console.log('dddddddddddddddddd');
        x=parmsmap.get(x.name);
    }
  //  let t=UnparseCode(x);
    //console.log(t);
    //console.log(x.type);
    return x;
}
*/