import $ from 'jquery';
//import {parseCode,UnparseCode} from './code-analyzer';
//import {iv} from './v';
import {pv} from './ast';
//module.exports={rules:{'no-console':'2',},};
// import * as escodegen from 'escodegen';
//var locmap;
//var parmsmap;
//let letral;
$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        // console.log(codeToParse);
        let myparms = $('#parmsPlaceholder').val();
        //console.log(myparms);
        let color =pv(codeToParse,myparms);
        let res = p(color,color.get(0));
        $('#parsedCode').html(res);
    });
});
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
}
/*function p(colors,s) {
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
}
function settheparams(x) {

    if (x.type == 'Program') {
        for (let i = 0; i < x.body.length; i++) {
            if (x.body[i].type=='VariableDeclaration') {
                x.body[i]=  variabledeclaration(x.body[i], parmsmap);
            }else {
                x.body[i]=f(x.body[i],locmap);
            }
        }
    }
    return x;
}
function  f(x,mymap) {
    //console.log(locmap.size);
   // console.log('map length'+mymap.size);

    if (x.type == 'Program') {
        for (let i = 0; i < x.body.length; i++) {
            x.body[i]= f(x.body[i],mymap);
        }
    }else
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
    if (x.type=='WhileStatement'){x=whilestatment(x,mymap);}
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
    //console.log('invarib');
   // console.log(mymap.size);
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
    if (x.expression.type=='AssignmentExpression'){
        if (locmap.has(x.expression.left.name)|| mymap.has(x.expression.left.name)){

            mymap.set(x.expression.left.name,getvalue(x.expression.right,mymap));
            //x=null;
        }else {
            x.expression.right=setvaluebinary(x.expression.right,mymap);
        }
    }
    return x;
}
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
    if (x.type=='Literal') {
        letral=x;
    }
    return x;
}
*/