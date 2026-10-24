/* Start-up and event wiring. Loaded last. */
const HUB_URL='https://bena-games.vercel.app/';   /* link to the games hub page. Leave it empty and the back button stays hidden. */
function bindGame(){
  card.addEventListener('click',()=>{if(phase()==='flip'&&canAct())act({...FR(),fl:true})});
  sk.addEventListener('click',()=>{const it=cur();if(canAct()&&it&&it.j===undefined&&S.fl&&S.fo==null&&!S.dn&&!S.sx)act({fo:S.fc,fc:S.fc+1})});
  $('tk').addEventListener('click',()=>{const it=cur();if(!canAct()||!it||it.j!==undefined||!S.fl||S.dn||S.sx||S.tk[S.turn]<1)return;const tk=[...S.tk];tk[S.turn]--;act({sx:true,dn:true,tk})});
  $('sw').addEventListener('click',()=>{const it=cur();if(!canAct()||!it||it.j!==undefined||!S.fl||S.dn||S.sx||S.fo!=null||S.sw[S.turn]<1)return;const sw=[...S.sw];sw[S.turn]--;act({sw,turn:1-S.turn})});
  nx.addEventListener('click',()=>{
    if(phase()!=='next')return;
    const rd=rdFlow(cur());
    if(!(rd?canOther():canAct()))return;   /* online question: the reader (the other player) taps; otherwise the player whose turn it is */
    const n=itemsOf().length;
    if(S.i>=n-1){act({i:S.i+1});return}
    const nt=S.dbl?S.turn:1-S.turn;
    if(rd)nKey=S.sd+':'+(S.i+1)+':'+nt;   /* no "your turn" bell for the player who just tapped */
    act({i:S.i+1,turn:nt,dbl:false,...FR()});
  });
  $('dn').addEventListener('click',()=>{
    if(!canAct()||phase()!=='answer')return;clearTimeout(anT);send({t:'an',k:lastKey,a:AN});const it=cur();
    if(it.j!==undefined){const tk=[...S.tk],sw=[...S.sw];if(it.j===0)tk[S.turn]++;if(it.j===1)sw[S.turn]++;act({dn:true,tk,sw,dbl:it.j===3})}else act({dn:true});
  });
  $('at').addEventListener('input',()=>{AN=$('at').value.slice(0,400);save();if(LOG[lastKey])LOG[lastKey].a=AN;clearTimeout(anT);anT=setTimeout(()=>send({t:'an',k:lastKey,a:AN}),250);if(R&&S.fo==null)$('dn').disabled=!AN.trim()});
  document.querySelectorAll('.rbt').forEach(b=>b.addEventListener('click',()=>{const e=b.dataset.e;if(!RX.includes(e)||Date.now()-rxT<250)return;rxT=Date.now();if(R&&R.open)RXC[R.idx]++;floatE(e);play('pop');send({t:'rx',e})}));
  $('cp').addEventListener('click',async()=>{$('cp').textContent=(await copyText(recapText()))?T('copied'):T('copyFail');setTimeout(()=>{$('cp').textContent=T('copyAns')},2000)});
  $('memobtn').addEventListener('click',openMemo);
  $('memox').addEventListener('click',()=>{$('memo').hidden=true});
  $('memosave').addEventListener('click',downloadMemo);
  $('memoshare').addEventListener('click',shareMemo);
  $('rs').addEventListener('click',()=>act({i:0,turn:0,go:false,...FR(),...Z0(),sd:newSd()}));
}

function bindHome(){
  $('start').addEventListener('click',()=>{if(!S.go&&!(R&&!R.open))act({go:true})});
  $('cqa').addEventListener('click',addQ);
  $('cqi').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();addQ()}});
  $('tm').addEventListener('change',()=>{if(S.go&&S.fl){$('tm').checked=S.tm;return}act({tm:$('tm').checked})});
  $('snd').addEventListener('click',()=>{SND=!SND;if(SND)ac();render()});
  $('langb').addEventListener('click',()=>setLang(LANG==='ar'?'en':'ar'));
  $('themeb').addEventListener('click',cycleTheme);
  $('share').addEventListener('click',shareInvite);
  $('how').addEventListener('click',()=>{closeD();showIntro()});
  ['n0','n1'].forEach((id,i)=>$(id).addEventListener('input',()=>{if(!R){if(!GM[i])GD[i]=gGuess($(id).value);render()}}));
  [0,1].forEach(i=>$('a'+i).addEventListener('click',()=>{
    if(R){if(i!==R.idx)return;myG=myG==='f'?'m':'f';myGM=true;R.gd[i]=myG;send({t:'nm',nm:myName(),gd:myG});render()}
    else{GD[i]=GD[i]==='f'?'m':'f';GM[i]=true;render()}
  }));
}

function bindChrome(){
  $('menu').addEventListener('click',openD);$('dx').addEventListener('click',closeD);$('scrim').addEventListener('click',closeD);
  $('ix').addEventListener('click',closeIntro);$('intro').addEventListener('click',e=>{if(e.target===$('intro'))closeIntro()});
  if(document.addEventListener){
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeD();closeIntro();$('memo').hidden=true}});
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)document.title=T('docTitle')});
  }
  let rstT=0;
  $('rst').addEventListener('click',()=>{
    const n=Date.now();
    if(rstT&&n-rstT<4000){rstT=0;$('rst').textContent=T('rst');act({i:0,turn:0,go:false,...FR(),...Z0(),sd:newSd()});closeD()}
    else{rstT=n;$('rst').textContent=T('rstSure');setTimeout(()=>{if(rstT===n){rstT=0;$('rst').textContent=T('rst')}},4000)}
  });
}

function init(){
  if(HUB_URL){['hubl','hubh'].forEach(id=>{const a=$(id);a.href=HUB_URL;a.hidden=false})}
  try{THEME=localStorage.getItem('bena_theme')||'classic'}catch(e){}
  if(!THEMES.includes(THEME))THEME='classic';
  load();applyLang();applyTheme();buildChips();
  bindGame();bindHome();bindChrome();bindNet();bindRoom();setupInstall();
  render();setInterval(tick,250);roomAutoJoin();
  try{if(!localStorage.getItem('bena_intro')&&!S.go)showIntro()}catch(e){}
  try{if('serviceWorker' in navigator&&/^https?:/.test(location.protocol))navigator.serviceWorker.register('sw.js').catch(()=>{})}catch(e){}
}
init();
