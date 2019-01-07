import {parseCode, UnparseCode} from './code-analyzer';
//import $ from 'jquery';
import {iv} from './v';
export {pv};
var locmap;
var parmsmap;
//let letral;
function pv(codeToParse,myparms) {
    //codeToParse= changethestring(codeToParse);
    let parsedCode = parseCode(codeToParse,true);
    //$('#parsedCodeOld').val(JSON.stringify(parsedCode, null, 2));
    locmap = new Map();
    parmsmap=new  Map();
    parsedCode= settheparams(parsedCode);
    let s=UnparseCode(parsedCode);
    let parsecode1=parseCode(s,true);
    var color=iv(parsecode1,myparms,parmsmap);
    //console.log(tostring(color,10));
    color.set(0,s);
    //let res = p(color,s);
    return color;
}
/*function changethestring(s) {
    let x=s.split('/n');
    let i=0;
    while (i<x.length){
        console.log(x[i].substring(1,3));
        console.log(x[i]);
        if (x[i].substring(1,3)=='++') {
            console.log(x[i]);
            x[i]=x[i].indexOf(0)+'='+x[i].indexOf(0)+'+1;'
            console.log(x[i]);
        }
        if (x[i].search('--')!=-1) {
            console.log(x[i]);
            x[i]=x[i].indexOf(0)+'='+x[i].indexOf(0)+'-1;'
            console.log(x[i]);
        }
        i++;
    }
}*/
/*function tostring(color,n) {
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
function p(colors,s) {
    var res='';
    var xx= s.split('\n');
    for (let i=0;i<xx.length;i++) {
        if(colors.has(i+1)){
            if (colors.get(i+1))
                res+='<span style=background:green>'+xx[i]+'</span></br>';
            else res+='<span style=background:red>'+xx[i]+'</span></br>';
        } else res+=xx[i]+'</br>';
    }
    return res;
}*/
function settheparams(x) {

    //if (x.type == 'Program') {
    for (let i = 0; i < x.body.length; i++) {
        if (x.body[i].type=='VariableDeclaration') {
            x.body[i]=  variabledeclaration(x.body[i], parmsmap);
        }else {
            x.body[i]=f(x.body[i],locmap);
        }
    }
    //}
    return x;
}
function  f(x,mymap) {
    //console.log(locmap.size);
    // console.log('map length'+mymap.size);

    /* if (x.type == 'Program') {
        for (let i = 0; i < x.body.length; i++) {
            x.body[i]= f(x.body[i],mymap);
        }
    }else
        */
    if (x.type == 'FunctionDeclaration') { x=functiondeclaration(x,mymap);}else
    if (x.type == 'VariableDeclaration') { x=variabledeclaration(x,mymap);}else {
        x = f1(x,mymap);
    }
    return x;

}
function f1(x,mymap) {
    if (x.type=='ExpressionStatement') {x=expressionstatement(x,mymap);}else
    if (x.type=='IfStatement'){x=ifstatement(x,mymap);}else
    if (x.type=='ReturnStatement') {x=returnstatsment(x,mymap);}else
        x=whilestatment(x,mymap);
    return x;
}
function functiondeclaration(x,mymap) {
    //console.log('iminfun');
    for (let i=0;i<x.params.length;i++) {
        parmsmap.set(x.params[i].name,0);
    }
    for(let i=0;i<x.body.body.length;i++){
        x.body.body[i]= f(x.body.body[i],mymap);
    }
    x.body.body=cleanthbodey(x.body);
    return x;
}
function cleanthbodey(x) {
    var xx=[];
    let i =0;
    let j=0;
    while (i<x.body.length) {
        if (x.body[i].type!='VariableDeclaration') {
            if (iftrue(x,i)) {
                i++;
                continue;
            }
            //  console.log(x.body[i].type);
            xx[j]=x.body[i];
            j++;
        }
        i++;
    }
    return xx;
}
function iftrue(x,i) {
    if (x.body[i].type=='ExpressionStatement'&&x.body[i].expression.type=='AssignmentExpression'&&!parmsmap.has(x.body[i].expression.left.name)) {
        return true;
    }
    return false;
}
function variabledeclaration(x,mymap) {
    for (let i=0;i<x.declarations.length;i++){
        if (x.declarations[i].init==null) {
            mymap.set(x.declarations[i].id.name,null);
        }else {

            mymap.set(x.declarations[i].id.name,getvalue(x.declarations[i].init,mymap));
        }
    }

    return x;
}
function ifstatement(x,mymap) {
    // console.log('inifim');
    var mymap2=new Map();
    x.test=setthetest(x.test,mymap);
    x.consequent=blockornot(x.consequent,mymap2);
    if (x.alternate!=null) {
        if (x.alternate.type=='IfStatement'){ifstatement(x.alternate,mymap);}else {
            x.alternate=blockornot(x.alternate,mymap);
        }
    }
    return x;
}
function whilestatment(x,mymap) {
    var mymap2=new Map();
    x.test=setthetest(x.test,mymap);
    x.body=blockornot(x.body,mymap2);
    return x;
}
function expressionstatement(x,mymap) {
    // console.log(12);
    //if (x.expression.type=='AssignmentExpression'){
    if (locmap.has(x.expression.left.name)|| mymap.has(x.expression.left.name)) {
        mymap.set(x.expression.left.name, getvalue(x.expression.right, mymap));
    }else {
        x.expression.right = setvaluebinary(x.expression.right, mymap);
    }
    /*}else {
        x=change(x);
        x=expressionstatement(x,mymap);
        //mymap.set(x.argument.name, getvalue(x.argument.name, mymap));
    }*/
    return x;
}
/*function change(x) {
    let s=x.expression.argument.name+'='+x.expression.argument.name;
    //x[i]=x[i].indexOf(0)+'='+x[i].indexOf(0)+'+1;'
    if (x.expression.operator=='++'){
        s=s+'+1;';
    }else {
        s=s+'-1;';
    }
    let thelet =parseCode(s,false);
    thelet=thelet.body[0];
    return thelet;
}*/
function returnstatsment(x,mymap){
    // console.log('***************************');
    /// console.log(13);
    x.argument=  setvaluebinary(x.argument,mymap);
    return x;
}
function blockornot(x,mymap) {
    if (x.type=='BlockStatement') {
        for (let i = 0; i < x.body.length; i++) {
            x.body[i]=f(x.body[i],mymap);
        }
        x.body=cleanthbodey(x);
    }else{
        x=f(x,mymap);
    }
    return x;
}
function setthetest(x,mymap) {
    // console.log('inthetest00');
    if (x.type=='BinaryExpression') {
        x.left=setvaluebinary(x.left,mymap);
        x.right=setvaluebinary(x.right,mymap);
    }else {
        if (x.type == 'UnaryExpression') {
            x.argument=  setvaluebinary(x.argument,mymap);
        }else {
            x= setvaluebinary(x,mymap);
        }
    }
    return x;
}
function getvalue(x,mymap) {
    if (x.type=='BinaryExpression') {
        x.left=  setvaluebinary(x.left,mymap);
        x.right= setvaluebinary(x.right,mymap);
    }
    if (x.type=='Identifier'){
        if (mymap.has(x.name)) {
            x=mymap.get(x.name);
        }
    }
    return x;
}

function setvaluebinary(x,mymap) {
    // console.log(mymap);
    if (x.type=='Identifier'){
        //   console.log(mymap.size);
        if (mymap.has(x.name)||locmap.has(x.name)) {
            x= sd(x,mymap);
            //  let t=UnparseCode(x);
            //  console.log(t);
        }
    }else {
        if (x.type=='BinaryExpression') {
            x.left= setvaluebinary(x.left,mymap);
            x.right=  setvaluebinary(x.right,mymap);
        }
    }

    return x;
}
function sd(x,mymap) {
    // console.log(x.name+'1121545');
    // console.log(mymap);
    if (mymap.has(x.name)) {
        x = mymap.get(x.name);
    }else {
        x=locmap.get(x.name);
    }
    //let t=UnparseCode(x);
    // console.log(t);
    // console.log(x.type);
    /* if (x.type=='Literal') {
       let letral=x;
    }*/
    return x;
}
