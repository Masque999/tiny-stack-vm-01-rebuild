const fs=require('fs');
const I=process.env.MAKEFUN_INPUT_DIR||'/input',O=process.env.MAKEFUN_OUTPUT_DIR||'/output';
const VLD=new Uint8Array(256),IML=new Uint8Array(256);
for(let i=0;i<=7;i++)VLD[i]=1;
for(let i=16;i<=34;i++)VLD[i]=1;
for(let i=48;i<=52;i++)VLD[i]=1;
VLD[64]=VLD[65]=1;
for(let i=80;i<=83;i++)VLD[i]=1;
IML[1]=1;IML[2]=4;IML[48]=IML[49]=IML[50]=IML[51]=2;
function run(p,q){
 let s=[],c=[],m=new Int32Array(256),pc=0,n=0,ip=0,o=Buffer.alloc(65536),ol=0;
 const T=e=>[e,o.subarray(0,ol)];
 for(;;){
  if(n>=1e6)return T(10);
  if(pc<0||pc>=p.length)return T(9);
  let op=p[pc];
  if(!VLD[op])return T(5);
  let il=IML[op];
  if(pc+1+il>p.length)return T(9);
  n++;
  let a,b,v,t;
  switch(op){
   case 0:return T(0);
   case 1:if(s.length>=256)return T(3);v=p[pc+1];s.push(v>=128?v-256:v);pc+=2;break;
   case 2:if(s.length>=256)return T(3);s.push(p.readInt32LE(pc+1));pc+=5;break;
   case 3:if(s.length<1)return T(2);s.pop();pc++;break;
   case 4:if(s.length<1)return T(2);if(s.length>=256)return T(3);s.push(s[s.length-1]);pc++;break;
   case 5:if(s.length<2)return T(2);b=s.pop();a=s.pop();s.push(b,a);pc++;break;
   case 6:if(s.length<2)return T(2);if(s.length>=256)return T(3);s.push(s[s.length-2]);pc++;break;
   case 7:if(s.length<3)return T(2);a=s[s.length-3];b=s[s.length-2];v=s[s.length-1];s[s.length-3]=b;s[s.length-2]=v;s[s.length-1]=a;pc++;break;
   case 0x10:case 0x11:case 0x12:case 0x13:case 0x14:case 0x15:case 0x16:case 0x18:case 0x19:case 0x1a:case 0x1c:case 0x1d:case 0x1e:case 0x20:case 0x21:case 0x22:
    if(s.length<2)return T(2);b=s.pop();a=s.pop();
    if(op===0x10)v=(a+b)|0;
    else if(op===0x11)v=(a-b)|0;
    else if(op===0x12)v=Math.imul(a,b);
    else if(op===0x13){if(b===0)return T(4);v=(a/b)|0;}
    else if(op===0x14){if(b===0)return T(4);v=(a%b)|0;}
    else if(op===0x15){if(b===0)return T(4);v=((a>>>0)/(b>>>0))|0;}
    else if(op===0x16){if(b===0)return T(4);v=((a>>>0)%(b>>>0))|0;}
    else if(op===0x18)v=a&b;
    else if(op===0x19)v=a|b;
    else if(op===0x1a)v=a^b;
    else if(op===0x1c)v=a<<(b&31);
    else if(op===0x1d)v=a>>(b&31);
    else if(op===0x1e)v=(a>>>(b&31))|0;
    else if(op===0x20)v=a===b?1:0;
    else if(op===0x21)v=a<b?1:0;
    else v=(a>>>0)<(b>>>0)?1:0;
    s.push(v);pc++;break;
   case 0x17:if(s.length<1)return T(2);s.push((-s.pop())|0);pc++;break;
   case 0x1b:if(s.length<1)return T(2);s.push(~s.pop());pc++;break;
   case 0x30:pc=pc+3+p.readInt16LE(pc+1);break;
   case 0x31:if(s.length<1)return T(2);v=s.pop();pc=v===0?pc+3+p.readInt16LE(pc+1):pc+3;break;
   case 0x32:if(s.length<1)return T(2);v=s.pop();pc=v!==0?pc+3+p.readInt16LE(pc+1):pc+3;break;
   case 0x33:if(c.length>=64)return T(7);c.push(pc+3);pc=p.readUInt16LE(pc+1);break;
   case 0x34:if(c.length<1)return T(8);pc=c.pop();break;
   case 0x40:if(s.length<1)return T(2);a=s.pop();if(a<0||a>255)return T(6);s.push(m[a]);pc++;break;
   case 0x41:if(s.length<2)return T(2);a=s.pop();v=s.pop();if(a<0||a>255)return T(6);m[a]=v;pc++;break;
   case 0x50:if(s.length<1)return T(2);v=s.pop();t=String(v);if(ol+t.length>65536)return T(11);o.write(t,ol);ol+=t.length;pc++;break;
   case 0x51:if(s.length<1)return T(2);v=s.pop();if(ol>=65536)return T(11);o[ol++]=v&255;pc++;break;
   case 0x52:if(s.length>=256)return T(3);s.push(ip<q.length?q[ip++]:-1);pc++;break;
   case 0x53:if(s.length<1)return T(2);return T(s.pop()&255);
  }
 }
}
for(let n=1;n<=40;n++){
 let id='i'+String(n).padStart(3,'0'),d=I+'/'+id,q;
 let p=fs.readFileSync(d+'/program.bin');
 try{q=fs.readFileSync(d+'/input.bin')}catch(e){q=Buffer.alloc(0)}
 let r=run(p,q);
 fs.mkdirSync(O+'/'+id,{recursive:true});
 fs.writeFileSync(O+'/'+id+'/stdout.bin',r[1]);
 fs.writeFileSync(O+'/'+id+'/exit.txt',r[0]+'\n');
}
