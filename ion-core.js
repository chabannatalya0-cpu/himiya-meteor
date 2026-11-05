/* Ядро лабораторії «Реакції йонного обміну»: реактиви, правила за йонами, рівняння. Без DOM. */
(function(root){
const RG={ // id: формула, назва, йони в 1 порції, колір розчину
  AgNO3:{f:"AgNO₃",n:"аргентум нітрат",ions:{"Ag⁺":1,"NO₃⁻":1}},
  BaCl2:{f:"BaCl₂",n:"барій хлорид",ions:{"Ba²⁺":1,"Cl⁻":2}},
  CaCl2:{f:"CaCl₂",n:"кальцій хлорид",ions:{"Ca²⁺":1,"Cl⁻":2}},
  NaCl:{f:"NaCl",n:"натрій хлорид",ions:{"Na⁺":1,"Cl⁻":1}},
  Na2SO4:{f:"Na₂SO₄",n:"натрій сульфат",ions:{"Na⁺":2,"SO₄²⁻":1}},
  Na2CO3:{f:"Na₂CO₃",n:"натрій карбонат",ions:{"Na⁺":2,"CO₃²⁻":1}},
  CuSO4:{f:"CuSO₄",n:"купрум(II) сульфат",ions:{"Cu²⁺":1,"SO₄²⁻":1},tint:"#38bdf8"},
  FeCl3:{f:"FeCl₃",n:"ферум(III) хлорид",ions:{"Fe³⁺":1,"Cl⁻":3},tint:"#eab308"},
  NaOH:{f:"NaOH",n:"натрій гідроксид",ions:{"Na⁺":1,"OH⁻":1}},
  HCl:{f:"HCl",n:"хлоридна кислота",ions:{"H⁺":1,"Cl⁻":1}},
  H2SO4:{f:"H₂SO₄",n:"сульфатна кислота",ions:{"H⁺":2,"SO₄²⁻":1}},
  KNO3:{f:"KNO₃",n:"калій нітрат",ions:{"K⁺":1,"NO₃⁻":1}},
  PHPH:{f:"ф-ф",n:"фенолфталеїн (індикатор)",ions:{},ind:true}
};
const PPT={ // осади: колір, опис
  "AgCl":{f:"AgCl",c:"#f8fafc",d:"білий сирнистий осад"},
  "BaSO4":{f:"BaSO₄",c:"#ffffff",d:"білий дрібнокристалічний осад"},
  "BaCO3":{f:"BaCO₃",c:"#f1f5f9",d:"білий осад"},
  "CaCO3":{f:"CaCO₃",c:"#f1f5f9",d:"білий осад"},
  "Ag2CO3":{f:"Ag₂CO₃",c:"#fef3c7",d:"світло-жовтий осад"},
  "CuOH2":{f:"Cu(OH)₂",c:"#3b82f6",d:"синій драглистий осад"},
  "FeOH3":{f:"Fe(OH)₃",c:"#a16207",d:"бурий осад"},
  "Ag2O":{f:"Ag₂O",c:"#4a3222",d:"темно-бурий осад"},
  "CuCO":{f:"(CuOH)₂CO₃",c:"#5eead4",d:"блакитно-зелений осад"}
};
/* Правила (порядок важливий): need — йони, ppt — осад-реагент, make — осад-продукт, give — йони-продукти */
const RULES=[
 {id:"neut",need:{"H⁺":1,"OH⁻":1},water:1,obs:"видимих змін немає",short:"H⁺ + OH⁻ → H₂O",inf:"Утворюється слабкий електроліт — вода (реакція нейтралізації)."},
 {id:"gas",need:{"H⁺":2,"CO₃²⁻":1},gas:1,water:1,short:"2H⁺ + CO₃²⁻ → H₂O + CO₂↑",obs:"виділяються бульбашки газу",inf:"Утворюється газ CO₂ і вода."},
 {id:"dCu",ppt:"CuOH2",need:{"H⁺":2},give:{"Cu²⁺":1},water:2,short:"Cu(OH)₂ + 2H⁺ → Cu²⁺ + 2H₂O",obs:"синій осад розчиняється, розчин стає блакитним",inf:"Нерозчинна основа реагує з кислотою, утворюється вода."},
 {id:"dFe",ppt:"FeOH3",need:{"H⁺":3},give:{"Fe³⁺":1},water:3,short:"Fe(OH)₃ + 3H⁺ → Fe³⁺ + 3H₂O",obs:"бурий осад розчиняється, розчин стає жовтим",inf:"Нерозчинна основа реагує з кислотою, утворюється вода."},
 {id:"dCa",ppt:"CaCO3",need:{"H⁺":2},give:{"Ca²⁺":1},gas:1,water:1,short:"CaCO₃ + 2H⁺ → Ca²⁺ + H₂O + CO₂↑",obs:"осад розчиняється, виділяється газ",inf:"Карбонат розкладається кислотою з утворенням CO₂."},
 {id:"dBa",ppt:"BaCO3",need:{"H⁺":2},give:{"Ba²⁺":1},gas:1,water:1,short:"BaCO₃ + 2H⁺ → Ba²⁺ + H₂O + CO₂↑",obs:"осад розчиняється, виділяється газ",inf:"Карбонат розкладається кислотою з утворенням CO₂."},
 {id:"dAgC",ppt:"Ag2CO3",need:{"H⁺":2},give:{"Ag⁺":2},gas:1,water:1,short:"Ag₂CO₃ + 2H⁺ → 2Ag⁺ + H₂O + CO₂↑",obs:"осад розчиняється, виділяється газ",inf:"Карбонат розкладається кислотою з утворенням CO₂."},
 {id:"dAgO",ppt:"Ag2O",need:{"H⁺":2},give:{"Ag⁺":2},water:1,short:"Ag₂O + 2H⁺ → 2Ag⁺ + H₂O",obs:"бурий осад розчиняється",inf:"Оксид реагує з кислотою."},
 {id:"AgCl",need:{"Ag⁺":1,"Cl⁻":1},make:"AgCl",short:"Ag⁺ + Cl⁻ → AgCl↓",inf:"Йони Ag⁺ і Cl⁻ зв'язуються в нерозчинну сполуку AgCl."},
 {id:"BaSO4",need:{"Ba²⁺":1,"SO₄²⁻":1},make:"BaSO4",short:"Ba²⁺ + SO₄²⁻ → BaSO₄↓",inf:"Йони Ba²⁺ і SO₄²⁻ зв'язуються в нерозчинну сполуку BaSO₄."},
 {id:"Ag2CO3",need:{"Ag⁺":2,"CO₃²⁻":1},make:"Ag2CO3",short:"2Ag⁺ + CO₃²⁻ → Ag₂CO₃↓",inf:"Утворюється нерозчинний аргентум карбонат."},
 {id:"CuOH2",need:{"Cu²⁺":1,"OH⁻":2},make:"CuOH2",short:"Cu²⁺ + 2OH⁻ → Cu(OH)₂↓",inf:"Утворюється нерозчинна основа Cu(OH)₂."},
 {id:"FeOH3",need:{"Fe³⁺":1,"OH⁻":3},make:"FeOH3",short:"Fe³⁺ + 3OH⁻ → Fe(OH)₃↓",inf:"Утворюється нерозчинна основа Fe(OH)₃."},
 {id:"Ag2O",need:{"Ag⁺":2,"OH⁻":2},make:"Ag2O",water:1,short:"2Ag⁺ + 2OH⁻ → Ag₂O↓ + H₂O",inf:"AgOH нестійкий і одразу розкладається на Ag₂O та воду."},
 {id:"BaCO3",need:{"Ba²⁺":1,"CO₃²⁻":1},make:"BaCO3",short:"Ba²⁺ + CO₃²⁻ → BaCO₃↓",inf:"Йони Ba²⁺ і CO₃²⁻ утворюють нерозчинний карбонат."},
 {id:"CaCO3",need:{"Ca²⁺":1,"CO₃²⁻":1},make:"CaCO3",short:"Ca²⁺ + CO₃²⁻ → CaCO₃↓",inf:"Йони Ca²⁺ і CO₃²⁻ утворюють нерозчинний карбонат."},
 {id:"CuCO",need:{"Cu²⁺":2,"CO₃²⁻":2},make:"CuCO",gas:1,short:null,obs:"блакитно-зелений осад і бульбашки газу",inf:"Складніша реакція (за участю води), її вивчають у старших класах."},
 {id:"FeCO",need:{"Fe³⁺":2,"CO₃²⁻":3},make:"FeOH3",makeK:2,gas:1,short:null,obs:"бурий осад і бульбашки газу",inf:"Складніша реакція (за участю води): утворюються Fe(OH)₃ і CO₂. Її вивчають у старших класах."}
];
/* Молекулярні рівняння для пар (ключ — відсортовані id) */
const E=(L,R)=>({L,R});
const PAIRS={
 "AgNO3|NaCl":E([[1,"AgNO₃"],[1,"NaCl"]],[[1,"AgCl↓"],[1,"NaNO₃"]]),
 "AgNO3|HCl":E([[1,"AgNO₃"],[1,"HCl"]],[[1,"AgCl↓"],[1,"HNO₃"]]),
 "AgNO3|BaCl2":E([[2,"AgNO₃"],[1,"BaCl₂"]],[[2,"AgCl↓"],[1,"Ba(NO₃)₂"]]),
 "AgNO3|CaCl2":E([[2,"AgNO₃"],[1,"CaCl₂"]],[[2,"AgCl↓"],[1,"Ca(NO₃)₂"]]),
 "AgNO3|FeCl3":E([[3,"AgNO₃"],[1,"FeCl₃"]],[[3,"AgCl↓"],[1,"Fe(NO₃)₃"]]),
 "AgNO3|Na2CO3":E([[2,"AgNO₃"],[1,"Na₂CO₃"]],[[1,"Ag₂CO₃↓"],[2,"NaNO₃"]]),
 "AgNO3|NaOH":E([[2,"AgNO₃"],[2,"NaOH"]],[[1,"Ag₂O↓"],[2,"NaNO₃"],[1,"H₂O"]]),
 "BaCl2|Na2SO4":E([[1,"BaCl₂"],[1,"Na₂SO₄"]],[[1,"BaSO₄↓"],[2,"NaCl"]]),
 "BaCl2|H2SO4":E([[1,"BaCl₂"],[1,"H₂SO₄"]],[[1,"BaSO₄↓"],[2,"HCl"]]),
 "BaCl2|CuSO4":E([[1,"BaCl₂"],[1,"CuSO₄"]],[[1,"BaSO₄↓"],[1,"CuCl₂"]]),
 "BaCl2|Na2CO3":E([[1,"BaCl₂"],[1,"Na₂CO₃"]],[[1,"BaCO₃↓"],[2,"NaCl"]]),
 "CaCl2|Na2CO3":E([[1,"CaCl₂"],[1,"Na₂CO₃"]],[[1,"CaCO₃↓"],[2,"NaCl"]]),
 "CuSO4|NaOH":E([[1,"CuSO₄"],[2,"NaOH"]],[[1,"Cu(OH)₂↓"],[1,"Na₂SO₄"]]),
 "FeCl3|NaOH":E([[1,"FeCl₃"],[3,"NaOH"]],[[1,"Fe(OH)₃↓"],[3,"NaCl"]]),
 "HCl|NaOH":E([[1,"NaOH"],[1,"HCl"]],[[1,"NaCl"],[1,"H₂O"]]),
 "H2SO4|NaOH":E([[2,"NaOH"],[1,"H₂SO₄"]],[[1,"Na₂SO₄"],[2,"H₂O"]]),
 "HCl|Na2CO3":E([[1,"Na₂CO₃"],[2,"HCl"]],[[2,"NaCl"],[1,"H₂O"],[1,"CO₂↑"]]),
 "H2SO4|Na2CO3":E([[1,"Na₂CO₃"],[1,"H₂SO₄"]],[[1,"Na₂SO₄"],[1,"H₂O"],[1,"CO₂↑"]]),
 "CuOH2|HCl":E([[1,"Cu(OH)₂"],[2,"HCl"]],[[1,"CuCl₂"],[2,"H₂O"]]),
 "CuOH2|H2SO4":E([[1,"Cu(OH)₂"],[1,"H₂SO₄"]],[[1,"CuSO₄"],[2,"H₂O"]]),
 "FeOH3|HCl":E([[1,"Fe(OH)₃"],[3,"HCl"]],[[1,"FeCl₃"],[3,"H₂O"]]),
 "FeOH3|H2SO4":E([[2,"Fe(OH)₃"],[3,"H₂SO₄"]],[[1,"Fe₂(SO₄)₃"],[6,"H₂O"]]),
 "CaCO3|HCl":E([[1,"CaCO₃"],[2,"HCl"]],[[1,"CaCl₂"],[1,"H₂O"],[1,"CO₂↑"]]),
 "BaCO3|HCl":E([[1,"BaCO₃"],[2,"HCl"]],[[1,"BaCl₂"],[1,"H₂O"],[1,"CO₂↑"]])
};
const PAIR_RULE={"AgNO3|NaCl":"AgCl","AgNO3|HCl":"AgCl","AgNO3|BaCl2":"AgCl","AgNO3|CaCl2":"AgCl","AgNO3|FeCl3":"AgCl","AgNO3|Na2CO3":"Ag2CO3","AgNO3|NaOH":"Ag2O",
 "BaCl2|Na2SO4":"BaSO4","BaCl2|H2SO4":"BaSO4","BaCl2|CuSO4":"BaSO4","BaCl2|Na2CO3":"BaCO3","CaCl2|Na2CO3":"CaCO3","CuSO4|NaOH":"CuOH2","FeCl3|NaOH":"FeOH3",
 "HCl|NaOH":"neut","H2SO4|NaOH":"neut","HCl|Na2CO3":"gas","H2SO4|Na2CO3":"gas","CuOH2|HCl":"dCu","CuOH2|H2SO4":"dCu","FeOH3|HCl":"dFe","FeOH3|H2SO4":"dFe","CaCO3|HCl":"dCa","BaCO3|HCl":"dBa"};
/* Йони для повного йонного рівняння (розчинні сильні електроліти) */
const SP={"AgNO₃":[[1,"Ag⁺"],[1,"NO₃⁻"]],"NaCl":[[1,"Na⁺"],[1,"Cl⁻"]],"HCl":[[1,"H⁺"],[1,"Cl⁻"]],"BaCl₂":[[1,"Ba²⁺"],[2,"Cl⁻"]],"CaCl₂":[[1,"Ca²⁺"],[2,"Cl⁻"]],
 "FeCl₃":[[1,"Fe³⁺"],[3,"Cl⁻"]],"Na₂CO₃":[[2,"Na⁺"],[1,"CO₃²⁻"]],"NaOH":[[1,"Na⁺"],[1,"OH⁻"]],"NaNO₃":[[1,"Na⁺"],[1,"NO₃⁻"]],"HNO₃":[[1,"H⁺"],[1,"NO₃⁻"]],
 "Ba(NO₃)₂":[[1,"Ba²⁺"],[2,"NO₃⁻"]],"Ca(NO₃)₂":[[1,"Ca²⁺"],[2,"NO₃⁻"]],"Fe(NO₃)₃":[[1,"Fe³⁺"],[3,"NO₃⁻"]],"Na₂SO₄":[[2,"Na⁺"],[1,"SO₄²⁻"]],"H₂SO₄":[[2,"H⁺"],[1,"SO₄²⁻"]],
 "CuSO₄":[[1,"Cu²⁺"],[1,"SO₄²⁻"]],"CuCl₂":[[1,"Cu²⁺"],[2,"Cl⁻"]],"Fe₂(SO₄)₃":[[2,"Fe³⁺"],[3,"SO₄²⁻"]]};
const term=(c,f)=>(c>1?c:"")+f;
function molecular(eq){return eq.L.map(([c,f])=>term(c,f)).join(" + ")+" → "+eq.R.map(([c,f])=>term(c,f)).join(" + ")}
function full(eq){const side=s=>s.map(([c,f])=>{const k=f.replace(/[↓↑]/g,"");return SP[k]?SP[k].map(([n,i])=>term(c*n,i)).join(" + "):term(c,f)}).join(" + ");return side(eq.L)+" → "+side(eq.R)}

function Tube(){this.ions={};this.ppt={};this.added=[];this.phph=false;this.vol=0}
Tube.prototype.oh=function(){return this.ions["OH⁻"]||0};
/* Додати порцію реактиву; повертає список подій */
Tube.prototype.add=function(id){
  const r=RG[id];this.vol++;this.added.push(id);
  if(r.ind){this.phph=true;const ev=[];if(this.oh()>0.05) ev.push({id:"phOn",obs:"розчин стає малиновим",inf:"Фенолфталеїн у лужному середовищі (є йони OH⁻) — малиновий."});return ev}
  const ohBefore=this.oh();
  for(const [i,n] of Object.entries(r.ions)) this.ions[i]=(this.ions[i]||0)+n;
  const fired={};
  for(let loop=0;loop<30;loop++){let any=false;
    for(const R of RULES){
      if(R.ppt&&!(this.ppt[R.ppt]>1e-6)) continue;
      let k=Infinity;for(const [i,n] of Object.entries(R.need)) k=Math.min(k,(this.ions[i]||0)/n);
      if(R.ppt) k=Math.min(k,this.ppt[R.ppt]);
      if(!(k>1e-6)) continue;
      for(const [i,n] of Object.entries(R.need)) this.ions[i]-=n*k;
      if(R.ppt) this.ppt[R.ppt]-=k;
      if(R.give) for(const [i,n] of Object.entries(R.give)) this.ions[i]=(this.ions[i]||0)+n*k;
      if(R.make) this.ppt[R.make]=(this.ppt[R.make]||0)+k*(R.makeK||1);
      fired[R.id]=(fired[R.id]||0)+k;any=true;
    }
    if(!any) break;
  }
  for(const i in this.ions) if(this.ions[i]<1e-6) this.ions[i]=0;
  for(const p in this.ppt) if(this.ppt[p]<1e-6) delete this.ppt[p];
  const ev=Object.keys(fired).map(rid=>{const R=RULES.find(x=>x.id===rid);
    return {id:rid,obs:R.obs||(R.make?PPT[R.make].d:"видимих змін немає"),inf:R.inf,short:R.short,ppt:R.make,gas:!!R.gas,dissolve:!!R.ppt}});
  if(this.phph){const ohAfter=this.oh();
    if(ohBefore>0.05&&ohAfter<=0.05) ev.push({id:"phOff",obs:"малинове забарвлення зникає",inf:"Йони OH⁻ витратилися: луг нейтралізовано кислотою."});
    if(ohBefore<=0.05&&ohAfter>0.05) ev.push({id:"phOn",obs:"розчин стає малиновим",inf:"Фенолфталеїн у лужному середовищі (є йони OH⁻) — малиновий."});
  }
  return ev;
};
/* Пошук молекулярного рівняння для події */
function pairFor(ev,newId,tubeBefore){
  const keys=[];
  if(ev.dissolve){const pptId=RULES.find(r=>r.id===ev.id).ppt;keys.push([pptId,newId].sort().join("|"))}
  else for(const other of new Set(tubeBefore)) keys.push([other,newId].sort().join("|"));
  for(const k of keys) if(PAIRS[k]&&PAIR_RULE[k]===ev.id) return PAIRS[k];
  return null;
}
root.IonLab={RG,PPT,RULES,PAIRS,Tube,molecular,full,pairFor};
})(typeof window!=="undefined"?window:globalThis);
