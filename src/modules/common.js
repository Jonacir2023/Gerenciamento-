// Ponte exclusiva do Gerenciamento: nenhuma chave de armazenamento anterior é acessada.
function gerNotice(message){if(typeof notify==='function')notify(message);else if(typeof toast==='function')toast(message);}
const gerNativeFetch=window.fetch.bind(window);
window.fetch=async function(input,options={}){const url=new URL(String(input));url.searchParams.set('obra_id',window.__obraId);url.searchParams.set('obra',parent.GerenciamentoModules.getWork(__obraId).nome);if(options.body){const data=JSON.parse(options.body);data.obra_id=__obraId;options={...options,body:JSON.stringify(data),headers:{'Content-Type':'text/plain;charset=utf-8',...(options.headers||{})}};}return gerNativeFetch(url,{...options,signal:AbortSignal.timeout(25000)});};
function gerRequest(path,action,body){return parent.GerenciamentoModules.request(__obraId,path,action,body);}
window.addEventListener('DOMContentLoaded',()=>{
 const report=()=>parent.GerenciamentoModules.resize(window,Math.max(document.body.scrollHeight,document.body.offsetHeight)+30);
 const observer=new ResizeObserver(report);observer.observe(document.body);report();window.addEventListener('pagehide',()=>observer.disconnect(),{once:true});
 document.querySelectorAll('.tab[onclick],.atab[onclick]').forEach(el=>{el.tabIndex=0;el.setAttribute('role','button');el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click();}});});
 document.querySelectorAll('input:not([aria-label]),select:not([aria-label]),textarea:not([aria-label])').forEach(el=>{const title=el.closest('.frow')?.querySelector('label')?.textContent||el.previousElementSibling?.textContent||el.id;if(title)el.setAttribute('aria-label',title.trim().slice(0,100));});
 if(__moduleKind==='checkin'){
  if(__startTab){const button=[...document.querySelectorAll('.tab')].find(x=>(x.getAttribute('onclick')||'').includes("'"+__startTab+"'"));if(button)button.click();}
  if(__editId)editarAssunto(__editId);
 }
 gerFixModalPositioning();
});

// O iframe do módulo é redimensionado para caber todo o conteúdo (sem scroll
// interno), então "position:fixed" dentro dele passa a valer contra a altura
// TOTAL do conteúdo, não contra o que o usuário está vendo na janela real —
// um modal centralizado/fixo pode renderizar longe da rolagem atual da
// página. Esta função recalcula, a cada mudança de classe do overlay e a
// cada rolagem/redimensionamento da página pai, qual fatia do iframe está
// realmente visível e restringe o overlay a essa fatia, mantendo o modal
// sempre dentro da área visível.
function gerFixModalPositioning(){
  const overlays=Array.from(document.querySelectorAll('.modal-overlay'));
  if(!overlays.length)return;
  let frameEl;
  try{ frameEl=parent.document.getElementById('module-frame'); }
  catch(e){ return; } // sem acesso ao pai: mantém o comportamento padrão (fixed simples)
  if(!frameEl)return;

  function reposicionar(){
    const rect=frameEl.getBoundingClientRect();
    const vh=parent.window.innerHeight||parent.document.documentElement.clientHeight;
    const topoVisivelNoPai=Math.max(0,rect.top);
    const fimVisivelNoPai=Math.min(vh,rect.bottom);
    const topoLocal=topoVisivelNoPai-rect.top;
    const alturaLocal=Math.max(0,fimVisivelNoPai-topoVisivelNoPai);
    overlays.forEach(ov=>{
      if(!ov.classList.contains('open')&&!ov.classList.contains('show'))return;
      ov.style.top=topoLocal+'px';
      ov.style.height=alturaLocal+'px';
    });
  }

  reposicionar();
  parent.window.addEventListener('scroll',reposicionar,{passive:true});
  parent.window.addEventListener('resize',reposicionar);
  const mo=new MutationObserver(reposicionar);
  overlays.forEach(ov=>mo.observe(ov,{attributes:true,attributeFilter:['class']}));
  window.addEventListener('pagehide',()=>{
    parent.window.removeEventListener('scroll',reposicionar);
    parent.window.removeEventListener('resize',reposicionar);
    mo.disconnect();
  },{once:true});
}
