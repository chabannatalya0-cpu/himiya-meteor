/* Ядро симуляції хімічної рівноваги (частинки + зіткнення). Без DOM, щоб можна було перевіряти окремо. */
(function(root){
const MODES={
  no2:{ // 2NO2 ⇌ N2O4; ΔH < 0 (пряма екзотермічна)
    title:"2NO₂ ⇌ N₂O₄", dh:"ΔH < 0",
    species:{A:{f:"NO₂",r:7,color:"#c2410c",glow:"#fb923c"},B:{f:"N₂O₄",r:10,color:"#fde68a",glow:"#fef3c7"}},
    init:{A:60,B:45}
  },
  hi:{ // H2 + I2 ⇌ 2HI; ΔH > 0 (як у підручнику, № 151)
    title:"H₂ + I₂ ⇌ 2HI", dh:"ΔH > 0",
    species:{H:{f:"H₂",r:5,color:"#e0f2fe",glow:"#ffffff"},I:{f:"I₂",r:9,color:"#7c3aed",glow:"#c4b5fd"},P:{f:"HI",r:7,color:"#f472b6",glow:"#fbcfe8"}},
    init:{H:45,I:45,P:30}
  }
};
function Sim(mode){
  this.mode=mode; this.M=MODES[mode];
  this.W=680; this.floor=460; this.ceilMin=40; this.ceil=40; // поршень: ceil — y верхньої стінки
  this.T=300; this.cat=false; this.p=[]; this.t=0;
  for(const [k,n] of Object.entries(this.M.init)) for(let i=0;i<n;i++) this.add(k);
}
Sim.prototype.speed=function(){return 95*Math.sqrt(this.T/300)};
Sim.prototype.add=function(k,x,y){
  const a=Math.random()*Math.PI*2,v=this.speed()*(0.6+Math.random()*0.8);
  this.p.push({k,x:x??(20+Math.random()*(this.W-40)),y:y??(this.ceil+15+Math.random()*(this.floor-this.ceil-30)),vx:Math.cos(a)*v,vy:Math.sin(a)*v,rot:Math.random()*6.28,born:this.t});
};
Sim.prototype.removeSome=function(k,n){let c=0;for(let i=this.p.length-1;i>=0&&c<n;i--) if(this.p[i].k===k){this.p.splice(i,1);c++;}};
Sim.prototype.count=function(){const c={};for(const k in this.M.species)c[k]=0;for(const q of this.p)c[q.k]++;return c};
Sim.prototype.volume=function(){return (this.floor-this.ceil)/(this.floor-this.ceilMin)};
Sim.prototype.pressure=function(){ // відносний тиск: N·T/V, нормований так, що на старті ≈ 1 атм
  const n=this.p.length,base=this.N0||(this.N0=n);return n*this.T/(this.volume()*base*300)};
Sim.prototype.rates=function(){
  const T=this.T,c=this.cat?2.5:1;
  if(this.mode==="no2") return {pf:Math.min(1,0.03*c), kd:447*Math.exp(-2400/T)*c};
  return {pf:Math.min(1,22.3*Math.exp(-1500/T)*c), pr:Math.min(1,0.79*Math.exp(-500/T)*c)};
};
Sim.prototype.step=function(dt){
  this.t+=dt; const sp=this.speed(), L=20, R=this.W-20+20, top=this.ceil, bot=this.floor;
  for(const q of this.p){
    const v=Math.hypot(q.vx,q.vy)||1, target=sp*(q.k==="B"||q.k==="I"?0.8:q.k==="H"?1.25:1);
    const nv=v+(target-v)*Math.min(1,dt*1.5); q.vx*=nv/v; q.vy*=nv/v;  // плавне «підлаштування» до температури
    q.x+=q.vx*dt; q.y+=q.vy*dt; q.rot+=dt*2;
    const r=this.M.species[q.k].r;
    if(q.x<20+r){q.x=20+r;q.vx=Math.abs(q.vx)} if(q.x>this.W-r){q.x=this.W-r;q.vx=-Math.abs(q.vx)}
    if(q.y<top+r){q.y=top+r;q.vy=Math.abs(q.vy)} if(q.y>bot-r){q.y=bot-r;q.vy=-Math.abs(q.vy)}
  }
  const r=this.rates(), P=this.p, kill=new Set(), born=[];
  const hit=(a,b,d)=>{const dx=a.x-b.x,dy=a.y-b.y;return dx*dx+dy*dy<d*d};
  if(this.mode==="no2"){
    for(let i=0;i<P.length;i++){const a=P[i];if(a.k!=="A"||kill.has(i))continue;
      for(let j=i+1;j<P.length;j++){const b=P[j];if(b.k!=="A"||kill.has(j))continue;
        if(hit(a,b,15)&&Math.random()<r.pf){kill.add(i);kill.add(j);born.push({k:"B",x:(a.x+b.x)/2,y:(a.y+b.y)/2,vx:(a.vx+b.vx)/2,vy:(a.vy+b.vy)/2});break;}}}
    for(let i=0;i<P.length;i++){const a=P[i];if(a.k==="B"&&!kill.has(i)&&Math.random()<r.kd*dt){kill.add(i);
      const ang=Math.random()*6.28,c=Math.cos(ang),s=Math.sin(ang);born.push({k:"A",x:a.x+c*8,y:a.y+s*8,vx:a.vx+c*60,vy:a.vy+s*60});born.push({k:"A",x:a.x-c*8,y:a.y-s*8,vx:a.vx-c*60,vy:a.vy-s*60});}}
  } else {
    for(let i=0;i<P.length;i++){const a=P[i];if(kill.has(i))continue;
      for(let j=i+1;j<P.length;j++){const b=P[j];if(kill.has(j))continue;
        const pair=a.k+b.k;
        if((pair==="HI"||pair==="IH")&&hit(a,b,14)&&Math.random()<r.pf){kill.add(i);kill.add(j);born.push({k:"P",x:a.x,y:a.y,vx:a.vx,vy:a.vy},{k:"P",x:b.x,y:b.y,vx:b.vx,vy:b.vy});break;}
        if(pair==="PP"&&hit(a,b,14)&&Math.random()<r.pr){kill.add(i);kill.add(j);born.push({k:"H",x:a.x,y:a.y,vx:a.vx,vy:a.vy},{k:"I",x:b.x,y:b.y,vx:b.vx,vy:b.vy});break;}
      }}
  }
  if(kill.size){this.p=P.filter((_,i)=>!kill.has(i)); for(const b of born) this.p.push({...b,rot:Math.random()*6.28,born:this.t,flash:1});}
  for(const q of this.p) if(q.flash) q.flash=Math.max(0,q.flash-dt*2.5);
};
root.EqSim={Sim,MODES};
})(typeof window!=="undefined"?window:globalThis);
