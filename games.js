'use strict';
/* ===== Outils DOM ===== */
const $=document.getElementById('app'),NR=s=>s.trim().toLowerCase().replace(/\s+/g,' ');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const h=(t,c,x,k)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.innerHTML=x;(k||[]).forEach(n=>e.append(n));return e};
const txt=(t,c,x)=>{const e=h(t,c);e.textContent=x;return e};
const btn=(x,f,c)=>{const b=h('button',c||'btn',x);b.type='button';b.onclick=f;return b};
const strip=s=>s.replace(/[.,!?]/g,'').trim();

/* ===== Sauvegarde locale ===== */
const KEY='champions-ce1-p2';let ST={};
try{ST=JSON.parse(localStorage.getItem(KEY))||{}}catch(e){}
ST=Object.assign({coins:0,g:{},tr:{},parties:0,w:{},flawless:0,d10:0},ST);
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(ST))}catch(e){}};
const RK=[["Apprenti",0],["Explorateur",100],["Expert",300],["Champion du CE1",500],["Super champion",1000]];
const rk=()=>RK.reduce((r,x,i)=>ST.coins>=x[1]?i:r,0);
const GM={},NM={};DATA.matieres.forEach(m=>m.n.forEach(n=>{NM[n.id]={n,m};n.j.forEach(g=>GM[g[0]]={g,n,m})}));
const ALL=Object.keys(GM),gs=re=>ALL.filter(i=>re.test(i)).map(i=>ST.g[i]).filter(Boolean);
const wst=x=>{const s=ST.w[fl(x)];return !s||!s.n?['À découvrir','🔍']:s.ok>=3?['Maîtrisé','🏆']:!s.last?['À retravailler','🔁']:["En cours d'apprentissage",'🌱']};
const wstat=(x,ok)=>{const s=ST.w[fl(x)]=ST.w[fl(x)]||{n:0,ok:0,last:null};s.n++;if(ok)s.ok++;s.last=ok;save()};

/* ===== Trophées ===== */
const TR=[
['t1','Premier pas','👣','Terminer un premier jeu',()=>ST.parties>0],
['t2','Petit détective','🔍','Terminer un jeu de grammaire',()=>gs(/^G/).length>0],
['t3','Roi des verbes','👑','3 étoiles à un jeu de conjugaison',()=>gs(/^C/).some(r=>r.s>=3)],
['t4','Champion des sons','🎵','3 étoiles à un jeu d\'orthographe',()=>gs(/^O/).some(r=>r.s>=3)],
['t5','Explorateur des mots','🧭','Terminer 5 jeux de vocabulaire différents',()=>gs(/^V/).length>=5],
['t6','Apprenti écrivain','🖋️','Terminer un atelier d\'écriture',()=>gs(/^E0[48]$/).length>0],
['t7','Sans faute','💎','Réussir une partie sans erreur',()=>!!ST.flawless],
['t8','Persévérant','💪','Terminer 10 parties',()=>ST.parties>=10],
['t9','Super champion','🚀','Atteindre 1 000 pièces',()=>ST.coins>=1000],
['t10','Maître du français','🎓','3 étoiles dans au moins un jeu de chaque notion',()=>DATA.matieres.every(m=>m.n.every(n=>n.j.some(g=>(ST.g[g[0]]||{}).s>=3)))],
['t11','Petit champion de la dictée','🐣','Terminer une première dictée',()=>!!(ST.g.D08&&ST.g.D08.p)],
['t12','Sans faute en dictée','🏵️','Obtenir 10/10 à la dictée',()=>!!ST.d10],
['t13','Maître des mots','📜','Maîtriser les dix mots',()=>DW.every(x=>(ST.w[fl(x)]||{}).ok>=3)]];
const trophies=()=>{const n=[];TR.forEach(t=>{if(!ST.tr[t[0]]&&t[4]()){ST.tr[t[0]]=1;n.push(t)}});return n};

/* ===== Navigation ===== */
let nav=[['home']],ses=null;const V={};
const go=(v,a)=>{nav.push([v,a]);draw()},back=()=>{if(nav.length>1)nav.pop();draw()},home=()=>{nav=[['home']];draw()};
function draw(){const [v,a]=nav[nav.length-1];window.scrollTo(0,0);V[v](a)}
const bar=t=>h('div','top',null,[...(nav.length>1?[btn('← Retour',back,'btn small')]:[]),btn('🏠',home,'btn small'),txt('div','ttl',t||''),txt('div','coins','🪙 '+ST.coins)]);
const conf=()=>h('div','confetti',Array.from({length:30},(_,i)=>`<i style="left:${i*3.3}%;animation-delay:${(i%7)*.12}s;background:${['#FFE6A2','#E87979','#4CAF80','#E9E0FF','#FBE1EB','#E3EBFF'][i%6]}"></i>`).join(''));
const mCard=(m,f)=>{const b=btn(`<span class="big">${m.i}</span><b>${m.nom||m.t}</b>`,f,'card mc');b.style.background=m.c;return b};

V.home=()=>{const r=rk(),nx=RK[r+1],p=nx?(ST.coins-RK[r][1])/(nx[1]-RK[r][1])*100:100;
 $.replaceChildren(bar(),h('header','hero','<h1>Les champions du CE1</h1><p>Apprends, joue et deviens un champion !</p><span class="pill">Période 2</span>'),
 h('div','card rank',`<b>🏅 ${RK[r][0]}</b> · 🪙 ${ST.coins} pièces<div class="pb"><i style="width:${p}%"></i></div><small>${nx?`Encore ${nx[1]-ST.coins} pièces pour devenir ${nx[0]}`:'Tu es au sommet !'}</small>`),
 h('div','grid',null,DATA.matieres.map(m=>{const b=mCard(m,()=>go('mat',m.id));b.append(h('small',null,`${m.n.length} notion${m.n.length>1?'s':''}`));return b})),
 h('div','row',null,[btn('🏆 Grand défi',()=>go('defi'),'btn go'),btn('🎖️ Mes trophées',()=>go('trop')),btn('📈 Mes progrès',()=>go('prog'))]))};
V.mat=id=>{const m=DATA.matieres.find(x=>x.id===id);
 $.replaceChildren(bar(m.nom),h('div','grid',null,m.n.map(n=>{const pl=n.j.filter(g=>ST.g[g[0]]&&ST.g[g[0]].p).length,ev=n.j.filter(g=>g[4]!=='atelier').length,st=n.j.reduce((a,g)=>a+((ST.g[g[0]]||{}).s||0),0);
 const b=btn(`<span class="big">${n.i}</span><b>${n.t}</b><small>${n.j.length} jeux · ${pl}/${n.j.length} terminés</small><small>⭐ ${st}/${ev*3}</small>`,()=>go('not',n.id),'card mc');b.style.background=m.c;return b})))};
V.not=id=>{const {n,m}=NM[id],rap=h('div','card rap',n.r);rap.hidden=true;
 $.replaceChildren(bar(n.t),h('div','row',null,[btn('📖 Je révise ma leçon',()=>{rap.hidden=!rap.hidden},'btn go'),...(id==='n12'?[btn('🗒️ Mes mots à retravailler',()=>go('mots'))]:[])]),rap,
 h('div','grid',null,n.j.map(g=>{const r=ST.g[g[0]],best=!r||!r.p?'Pas encore joué':g[4]==='atelier'?'Terminé ✓':`Meilleur : ${r.b[0]}/${r.b[1]} · ${'★'.repeat(r.s)}${'☆'.repeat(3-r.s)}`;
 const b=btn(`<span class="big">${g[2]}</span><b>${g[1]}</b><small>${g[3]}</small><em>${best}</em>`,()=>play(g[0]),'card gc');b.style.background=m.c;return b})))};
V.mots=()=>$.replaceChildren(bar('Mes mots à retravailler'),h('div','card',"<p>Un mot est <b>maîtrisé</b> après 3 écritures correctes sans modèle, dans des parties différentes.</p>"),h('div','list',null,DW.map(x=>{const [s,i]=wst(x),k=Math.min(3,(ST.w[fl(x)]||{}).ok||0);return h('div','card word',`<span class="big">${x.e||'🔤'}</span><b>${fl(x)}</b><span>${i} ${s}</span><small>Écritures réussies : ${k}/3</small>`)})),btn('Réviser avec la dictée audio',()=>go('not','n12')));
V.trop=()=>$.replaceChildren(bar('Mes trophées'),h('div','grid',null,TR.map(t=>h('div','card tro'+(ST.tr[t[0]]?' got':''),`<span class="big">${ST.tr[t[0]]?t[2]:'🔒'}</span><b>${t[1]}</b><small>${t[3]}</small><em>${ST.tr[t[0]]?'✓ Obtenu':'À débloquer'}</em>`))));
V.prog=()=>{const pl=ALL.filter(i=>ST.g[i]&&ST.g[i].p).length,stars=ALL.reduce((a,i)=>a+((ST.g[i]||{}).s||0),0),tr=Object.keys(ST.tr).length,bad=[];
 DATA.matieres.forEach(m=>m.n.forEach(n=>{const r=n.j.map(g=>ST.g[g[0]]).filter(x=>x&&x.b);if(r.length&&r.reduce((a,x)=>a+x.b[0]/x.b[1],0)/r.length<.7)bad.push(n.t)}));
 if(DW.some(x=>wst(x)[0]==='À retravailler')&&!bad.includes(NM.n12.n.t))bad.push(NM.n12.n.t);
 $.replaceChildren(bar('Mes progrès'),h('div','card',`<b>Progression globale</b><div class="pb"><i style="width:${pl/ALL.length*100}%"></i></div>${pl} jeux différents terminés sur ${ALL.length}<br>⭐ ${stars} étoiles · 🎖️ ${tr}/${TR.length} trophées · 🎮 ${ST.parties} parties`),
 ...DATA.matieres.map(m=>{const t=m.n.reduce((a,n)=>a+n.j.length,0),p=m.n.reduce((a,n)=>a+n.j.filter(g=>ST.g[g[0]]&&ST.g[g[0]].p).length,0),c=h('div','card',`${m.i} <b>${m.nom}</b> : ${p}/${t}<div class="pb"><i style="width:${p/t*100}%"></i></div>`);c.style.background=m.c;return c}),
 h('div','card',`<b>Notions à retravailler</b><br>${bad.length?bad.join('<br>'):'Rien pour l\'instant, continue à jouer !'}`),h('small','note','Ta progression est enregistrée uniquement sur cet appareil.'))};
V.defi=()=>$.replaceChildren(bar('Grand défi'),h('div','card','<b>Mélange toutes les notions !</b> Choisis ton défi.'),h('div','grid',null,[[10,'Petit défi','🥉'],[24,'Grand défi','🥈'],[36,'Super défi','🥇']].map(([n,t,i])=>btn(`<span class="big">${i}</span><b>${t}</b><small>${n} questions</small>`,()=>startDefi(n),'card gc'))));

/* ===== Parties ===== */
function setup(id,g,items,defiN){const e=g[4],it=items;ses={id,g,items:it,i:0,ok:0,total:0,gain:0,errs:[],rk:rk(),defiN,eng:e,
 n:e==='memory'||e==='association'?it[0].p.length:e==='classement'?it[0].it.length:e==='atelier'?1:it.length};nav.push(['game']);draw()}
const play=(id,items)=>setup(id,GM[id].g,items||G[GM[id].g[5]]());
function startDefi(N){const NL=DATA.matieres.flatMap(m=>m.n.map(n=>({n,m}))),used=new Set();
 const d1=o=>{for(let t=0;t<30;t++){const g=one(o.n.j.filter(g=>g[4]==='quiz'||g[4]==='trous')),it=one(G[g[5]]());if(!used.has(it.q)){used.add(it.q);return{...it,m:`${o.m.nom} · ${o.n.t}`}}}};
 const items=sh(N===10?pick(NL,10).map(d1):NL.flatMap(o=>Array.from({length:N/12},()=>d1(o)))).filter(Boolean);
 setup('defi'+N,['defi'+N,N===10?'Petit défi':N===24?'Grand défi':'Super défi','🏆','','quiz'],items,N)}
V.game=()=>{const box=h('div','stage'),p=h('div','prog');ses.pe=p;$.replaceChildren(bar(ses.g[1]),p,box);upd();ENG[ses.g[4]](box)};
function upd(){if(ses.pe)ses.pe.innerHTML=ses.eng==='atelier'?'':`<div class="pb"><i style="width:${Math.min(100,(ses.eng==='dictee'&&ses.g[6]==='defi'?ses.i:ses.total)/ses.n*100)}%"></i></div><span>${ses.total}/${ses.n}</span> <span>⭐ ${ses.ok} réussie(s)</span>`}
function unit(first,final,err){ses.total++;if(first)ses.ok++;if(final){ses.gain+=10;ST.coins+=10}if(!first&&err)ses.errs.push(err);save();upd()}
const nxt=()=>btn(ses.i+1<ses.items.length?'Suivant →':'Voir mon résultat',()=>{ses.i++;ses.i<ses.items.length?draw():finish()},'btn go');
function finish(){const ev=ses.g[4]!=='atelier',pct=ses.total?ses.ok/ses.total:0,st=ev?1+(pct>=.6)+(pct>=.9):0;
 const r=ST.g[ses.id]=ST.g[ses.id]||{p:0,s:0,b:null};r.p++;r.s=Math.max(r.s,st);if(ev&&(!r.b||pct>r.b[0]/r.b[1]))r.b=[ses.ok,ses.total];
 ST.parties++;if(ev&&ses.total&&ses.ok===ses.total)ST.flawless=1;if(ses.id==='D08'&&ses.items.length===10&&ses.ok===10)ST.d10=1;
 ses.st=st;ses.newT=trophies();ses.newR=rk()>ses.rk;save();nav[nav.length-1]=['res'];draw()}
V.res=()=>{const s=ses,ev=s.g[4]!=='atelier',r=ST.g[s.id],good=s.st===3;
 const msg=!ev?'Bravo, ton texte est terminé !':s.st===3?'Bravo, tu es un vrai champion !':s.st===2?'Très bien, continue comme ça !':'Bien joué, tu as terminé la partie ! Avec de l\'entraînement, tu vas progresser.';
 const k=[bar('Résultats'),...(good||s.newR||s.newT.length?[conf()]:[])];
 const c=h('div','card res',`<h2>${msg}</h2>`+(ev?`<p class="score">Score : <b>${s.ok}/${s.total}</b></p><p class="stars" aria-label="${s.st} étoiles sur 3">${'★'.repeat(s.st)}${'☆'.repeat(3-s.st)}</p><p>🪙 +${s.gain} pièces d'or</p><p>Meilleur score : ${r.b[0]}/${r.b[1]}</p>`:''));
 if(s.res){const ko=s.res.filter(x=>!x.ok);c.append(h('div','dres',`<h3>Note : ${s.ok}/${s.res.length}</h3><p>✅ <b>Bien écrits :</b> ${s.res.filter(x=>x.ok).map(x=>fl(x.x)).join(', ')||'aucun pour l\'instant'}</p>`+ko.map(x=>`<p>❌ ${diff(x.v,fl(x.x))} → <b>${fl(x.x)}</b><br><small>À retravailler : ${x.x.h}</small></p>`).join('')));
  if(ko.length)c.append(btn('🔁 Réviser mes erreurs',()=>{nav.pop();play('D08',ko.map(x=>x.x))},'btn go'));c.append(btn('🔄 Refaire la dictée',()=>{nav.pop();play('D08')}))}
 if(s.newR)c.append(h('div','banner',`🎉 Nouveau rang : <b>${RK[rk()][0]}</b> !`));
 s.newT.forEach(t=>c.append(h('div','banner',`${t[2]} Nouveau trophée : <b>${t[1]}</b> !`)));
 const row=h('div','row');if(!s.res)row.append(btn('🔄 Rejouer',()=>{nav.pop();s.defiN?startDefi(s.defiN):play(s.id)},'btn go'));
 if(s.errs.length&&!s.res)row.append(btn('🧐 Revoir mes erreurs',()=>go('err')));
 row.append(btn('🎮 Choisir un autre jeu',back),btn('🏠 Accueil',home));c.append(row);$.replaceChildren(...k,c)};
V.err=()=>$.replaceChildren(bar('Mes erreurs'),...ses.errs.map(e=>h('div','card',`<p class="pre">${esc(e.q)}</p>✅ Bonne réponse : <b>${esc(e.a)}</b>`)),btn('← Retour aux résultats',back,'btn go'));

/* ===== Moteurs de jeux ===== */
const fbk=(ok,html)=>{const f=h('div','fb '+(ok?'ok':'ko'),html);f.setAttribute('aria-live','polite');return f};
const goodMsg=()=>'✅ <b>Bravo !</b> +10 🪙';
function inp(){const i=h('input','inp');i.type='text';['autocomplete','autocorrect','autocapitalize'].forEach(a=>i.setAttribute(a,'off'));i.spellcheck=false;i.placeholder='Écris ici…';return i}
function diff(u,t){u=NR(u||'');let s='';for(let k=0;k<Math.max(u.length,t.length);k++){const a=u[k]||'',b=t[k]||'';s+=a===b?`<span class="lg">${esc(a)}</span>`:`<span class="lr">${esc(a||'_')}</span>`}return s}
function onEnter(i,f){i.onkeydown=e=>{if(e.key==='Enter')f()}}

function eQ(box){const it=ses.items[ses.i];let done=0;const bs=[],card=h('div','card q');
 if(it.m)card.append(txt('small','meta',it.m));card.append(txt('div','qt',it.q));
 const end=(ok,mark)=>{if(done)return;done=1;unit(ok,ok,ok?null:{q:it.q,a:it.a});if(mark)mark();
  card.append(fbk(ok,ok?goodMsg()+(it.ex?`<br><small>${esc(it.ex)}</small>`:''):`❌ <b>Pas tout à fait.</b> La bonne réponse : <b>${esc(it.a)}</b>.<br>${esc(it.ex||'')}<br>Tu vas y arriver !`),nxt())};
 if(it.s){const i=inp(),v=()=>{if(done)return;end(NR(i.value)===NR(it.a),()=>{i.disabled=true})};onEnter(i,v);card.append(i,btn('Valider',v,'btn go'));setTimeout(()=>i.focus(),50)}
 else it.o.forEach(o=>{const b=btn(esc(o),()=>end(o===it.a,()=>bs.forEach(x=>{x.disabled=true;if(x.dataset.o===it.a){x.classList.add('good');x.prepend('✓ ')}else if(x===b){x.classList.add('bad');x.prepend('✗ ')}})),'btn opt');b.dataset.o=o;bs.push(b);card.append(b)});
 box.append(card)}
function eC(box){const r=ses.items[0],bank=h('div','chips'),cats=h('div','cats'),fb=h('div','fb'),slots={};let rest=sh(r.it),sel=null;fb.setAttribute('aria-live','polite');
 const dr=()=>bank.replaceChildren(...rest.map(w=>btn(esc(w[0]),()=>{sel=w;dr()},'btn chipb'+(sel===w?' sel':''))));
 const put=c=>{if(!sel){fb.className='fb';fb.textContent='👆 Choisis d\'abord un mot.';return}
  const w=sel,ok=w[1]===c;sel=null;rest=rest.filter(x=>x!==w);unit(ok,ok,ok?null:{q:`« ${w[0]} » : quelle catégorie ?`,a:w[1]});
  slots[w[1]].append(txt('span','chip '+(ok?'good':'bad'),(ok?'✓ ':'✗ ')+w[0]));fb.className='fb '+(ok?'ok':'ko');
  fb.innerHTML=ok?goodMsg():`❌ « ${esc(w[0])} » va dans <b>${esc(w[1])}</b>. Tu vas y arriver !`;dr();if(!rest.length)box.append(btn('Voir mon résultat',finish,'btn go'))};
 r.cats.forEach(c=>{const s=h('div','slot');slots[c]=s;cats.append(h('div','cat',null,[btn(esc(c),()=>put(c),'btn catb'),s]))});
 dr();box.append(h('p','hint','1. Choisis un mot.  2. Choisis sa catégorie.'),bank,cats,fb)}
function eM(box){const P=ses.items[0].p,grid=h('div','grid mem'),fb=h('div','fb'),miss={};let open=[],lock=0,found=0;
 sh(P.flatMap((p,i)=>[[p[0],i],[p[1],i]])).forEach(([t,i])=>{const b=btn('❓',()=>{if(lock||b.classList.contains('up'))return;b.classList.add('up');b.textContent=t;open.push([b,i]);
  if(open.length<2)return;const [a,c]=open;open=[];
  if(a[1]===c[1]){[a[0],c[0]].forEach(x=>{x.classList.add('good');x.textContent='✓ '+x.textContent});unit(!miss[i],true,{q:`Paire : ${P[i][0]}`,a:`${P[i][0]} ↔ ${P[i][1]}`});fb.className='fb ok';fb.innerHTML=goodMsg();if(++found===P.length)box.append(btn('Voir mon résultat',finish,'btn go'))}
  else{miss[a[1]]=miss[c[1]]=1;lock=1;[a[0],c[0]].forEach(x=>x.classList.add('bad'));fb.className='fb ko';fb.innerHTML='❌ Ce n\'est pas une paire. Essaie encore !';
   setTimeout(()=>{[a[0],c[0]].forEach(x=>{x.classList.remove('up','bad');x.textContent='❓'});lock=0},900)}},'btn mcard');grid.append(b)});
 box.append(h('p','hint','Retourne deux cartes et retrouve les paires.'),grid,fb)}
function eA(box){const P=ses.items[0].p,L=h('div','col'),R=h('div','col'),fb=h('div','fb'),miss={};let sel=null,done=0;fb.setAttribute('aria-live','polite');
 P.forEach((p,i)=>{const b=btn(esc(p[0]),()=>{if(b.disabled)return;if(sel)sel.b.classList.remove('sel');sel={b,i};b.classList.add('sel')},'btn as');L.append(b)});
 sh(P.map((p,i)=>[p[1],i])).forEach(([t,i])=>{const b=btn(esc(t),()=>{if(!sel||b.disabled)return;
  if(sel.i===i){const l=sel.b;[l,b].forEach(x=>{x.disabled=true;x.classList.remove('sel');x.classList.add('good');x.prepend('✓ ')});sel=null;unit(!miss[i],true,{q:P[i][0],a:`${P[i][0]} ↔ ${P[i][1]}`});fb.className='fb ok';fb.innerHTML=goodMsg();if(++done===P.length)box.append(btn('Voir mon résultat',finish,'btn go'))}
  else{miss[sel.i]=1;fb.className='fb ko';fb.innerHTML='❌ Ce n\'est pas la bonne paire. Essaie encore !'}},'btn as');R.append(b)});
 box.append(h('p','hint','Clique à gauche, puis sur son correspondant à droite.'),h('div','two',null,[L,R]),fb)}
function eD(box){const it=ses.items[ses.i],card=h('div','card q');let done=0;const bs=[];card.append(txt('div','qt',it.q));const w=h('div','chips');
 it.c.forEach(c=>{const b=btn(esc(c),()=>{if(done)return;done=1;const ok=strip(c)===strip(it.a);unit(ok,ok,ok?null:{q:it.c.join(' '),a:it.a});
  bs.forEach(x=>{x.disabled=true;if(strip(x.dataset.c)===strip(it.a)){x.classList.add('good');x.prepend('✓ ')}});if(!ok){b.classList.add('bad');b.prepend('✗ ')}
  card.append(fbk(ok,ok?goodMsg():`❌ <b>Pas tout à fait.</b> La bonne réponse : <b>${esc(it.a)}</b>. Tu vas y arriver !`),nxt())},'btn chipb');b.dataset.c=c;bs.push(b);w.append(b)});
 card.append(w);box.append(card)}
function eO(box){const it=ses.items[ses.i],tk=sh(it.seq.map((t,i)=>({t,i}))),ans=h('div','ans'),pool=h('div','chips'),fb=h('div','fb');let put=[],done=0;
 const Lb=o=>it.up?o.t.toUpperCase():o.t;
 const dr=()=>{ans.replaceChildren(...put.map(o=>txt('span','chip',Lb(o))),...it.seq.slice(put.length).map(()=>txt('span','chip empty','·')));
  pool.replaceChildren(...tk.filter(o=>!put.includes(o)).map(o=>btn(esc(Lb(o)),()=>{if(!done){put.push(o);dr()}},'btn chipb')))};
 const pre=it.pre?it.pre+' ':'',ctl=h('div','row',null,[btn('⌫ Effacer la dernière',()=>{if(!done){put.pop();dr()}}),btn('↺ Recommencer',()=>{if(!done){put=[];dr()}}),
  btn('Valider',()=>{if(done)return;if(put.length<it.seq.length){fb.className='fb';fb.textContent='Place tous les éléments avant de valider.';return}
   done=1;const ok=put.map(o=>o.t).join(it.j)===it.seq.join(it.j);unit(ok,ok,ok?null:{q:'Remise en ordre : '+tk.map(Lb).join(' '),a:pre+it.seq.join(it.j)});
   fb.className='fb '+(ok?'ok':'ko');fb.innerHTML=ok?goodMsg():`❌ <b>Pas tout à fait.</b> Le bon ordre : <b>${esc(pre+it.seq.join(it.j))}</b>. Tu vas y arriver !`;box.append(nxt())},'btn go')]);
 dr();box.append(h('p','hint',esc(it.hint||'Clique dans le bon ordre.')),...(it.pre?[txt('div','pre big',it.pre)]:[]),ans,pool,ctl,fb)}
function eW(box){const it=ses.items[0],after=h('div');box.append(h('div','card',it.fiche),h('div','card','<b>'+it.consigne+'</b>'));
 const t=Array.from({length:it.lines||1},()=>{const x=h('textarea','ta');x.rows=it.lines?1:6;x.placeholder='Écris ici…';return x});box.append(...t,
 btn("J'ai terminé mon texte",()=>after.replaceChildren(h('div','card','<b>Vérifie ton travail :</b>'+it.crit.map(c=>`<label class="chk"><input type="checkbox"> ${c}</label>`).join('')),h('div','card ex','<b>Exemple :</b><br>'+it.ex),btn("Terminer l'atelier",finish,'btn go')),'btn go'),after)}

/* ===== Dictée ===== */
const frv=()=>window.speechSynthesis&&speechSynthesis.getVoices().find(v=>/^fr/i.test(v.lang));
const vok=()=>!!window.speechSynthesis&&(speechSynthesis.getVoices().length===0||!!frv());
function say(t,r){if(!window.speechSynthesis)return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='fr-FR';const v=frv();if(v)u.voice=v;u.rate=r;speechSynthesis.speak(u)}
function eX(box){const m=ses.g[6];
 if(m!=='look'&&!vok()){box.append(h('div','card','🔇 <b>La voix française n\'est pas disponible sur cet appareil.</b><br>Tu peux jouer au jeu de mémorisation visuelle à la place.'),btn("Jouer à « L'œil de lynx »",()=>{nav.pop();play('D01')},'btn go'));return}
 m==='look'?xLook(box):m==='audio'?xAudio(box):xDefi(box)}
const listen=(x,row)=>row.append(btn('🔊 Écouter le mot',()=>say(fl(x),.8),'btn go'),btn('🔁 Réécouter',()=>say(fl(x),.8)),btn('🐢 Plus lentement',()=>say(fl(x),.5)));
function xLook(box){const x=ses.items[ses.i];let tm,first=0;
 const show=()=>{let n=5;box.replaceChildren(h('div','card dict',`<div class="em">${x.e||'🔤'}</div><div class="big">${fl(x)}</div><p>Regarde bien ! Il disparaît dans <b id="cd">5</b> s.</p>`),btn("Je l'ai retenu, je le cache",hide,'btn go'));
  tm=setInterval(()=>{if(!box.isConnected){clearInterval(tm);return}n--;const c=document.getElementById('cd');if(c)c.textContent=n;if(n<=0)hide()},1000)};
 const hide=()=>{clearInterval(tm);ask()};
 const ask=()=>{const i=inp(),v=()=>chk(i.value);onEnter(i,v);box.replaceChildren(h('div','card dict',`<div class="em">${x.e||'🔤'}</div><p>Écris le mot, sans modèle.<br><small>${esc(cap(x.d))}</small></p>`,[i]),btn('Valider',v,'btn go'));i.focus()};
 const chk=v=>{const ok=NR(v)===fl(x),f=!first;if(f){first=1;unit(ok,ok,{q:`Écrire : « ${x.d} »`,a:fl(x)});wstat(x,ok)}
  box.replaceChildren(fbk(ok,ok?`✅ <b>Bravo !</b> « ${fl(x)} »${f?' +10 🪙':''}`:`❌ <b>Presque !</b><br>Ton écriture : ${diff(v,fl(x))}<br>Écriture correcte : <b>${fl(x)}</b><br>À retenir : ${x.h}.<br>Tu vas y arriver !`),...(ok?[]:[btn('👀 Revoir le modèle et recommencer',show)]),nxt())};
 show()}
function xAudio(box){const x=ses.items[ses.i],i=inp(),row=h('div','row');let first=0;listen(x,row);
 const v=()=>{const ok=NR(i.value)===fl(x),f=!first;if(f){first=1;unit(ok,ok,{q:`Dictée audio : « ${x.d} »`,a:fl(x)});wstat(x,ok)}
  box.append(fbk(ok,ok?`✅ <b>Bravo !</b> « ${fl(x)} »${f?' +10 🪙':''}`:`❌ <b>Presque !</b><br>Ton écriture : ${diff(i.value,fl(x))}<br>Écriture correcte : <b>${fl(x)}</b><br>À retenir : ${x.h}.<br>Tu vas y arriver !`));if(!box.querySelector('.nx'))box.append(Object.assign(nxt(),{className:'btn go nx'}))};
 onEnter(i,v);box.append(h('div','card dict','<div class="em">🎧</div><p>Écoute le mot, puis écris-le.</p>',[row,i]),btn('Valider',v,'btn go'))}
function xDefi(box){const x=ses.items[ses.i],i=inp(),row=h('div','row'),last=ses.i+1===ses.items.length;ses.ans=ses.ans||[];i.value=ses.ans[ses.i]||'';listen(x,row);
 const nx=()=>{ses.ans[ses.i]=i.value;if(!last){ses.i++;draw()}else{ses.res=ses.items.map((w,k)=>{const v=ses.ans[k]||'',ok=NR(v)===fl(w);unit(ok,ok,{q:`Écrire : « ${w.d} »`,a:fl(w)});wstat(w,ok);return{x:w,v,ok}});finish()}};
 onEnter(i,nx);box.append(h('div','card dict',`<div class="em">🎧</div><p>Mot ${ses.i+1} sur ${ses.items.length}<br><small>Écris sans modèle. La correction arrive à la fin.</small></p>`,[row,i]),btn(last?'Terminer la dictée':'Mot suivant →',nx,'btn go'))}
const ENG={quiz:eQ,trous:eQ,classement:eC,memory:eM,association:eA,detective:eD,ordre:eO,atelier:eW,dictee:eX};
/* ===== Code d'accès (vérifié dans le navigateur : discret, pas une vraie sécurité) ===== */
const CODE='SAVOIRCE1',AKEY='champions-ce1-acces';
const unlocked=()=>{try{return localStorage.getItem(AKEY)===CODE}catch(e){return false}};
function gate(){const i=inp(),fb=h('div','fb'),v=()=>{if(i.value.trim().toUpperCase()===CODE){try{localStorage.setItem(AKEY,CODE)}catch(e){}draw()}else{fb.className='fb ko';fb.innerHTML="❌ Ce n'est pas le bon code. Demande-le à ta maîtresse ou à ton maître !";i.select()}};
 i.placeholder='Écris le code ici…';i.setAttribute('aria-label','Code d\'accès');onEnter(i,v);
 $.replaceChildren(h('header','hero','<h1>Les champions du CE1</h1><p>Apprends, joue et deviens un champion !</p>'),h('div','card dict','<div class="em">🔑</div><p><b>Entre le code pour jouer</b></p>',[i,btn('Entrer',v,'btn go'),fb]));setTimeout(()=>i.focus(),50)}
unlocked()?draw():gate();
