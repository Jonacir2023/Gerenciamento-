// Campos e serviços do contrato v5 que complementam as telas disponíveis do Diário.
const gerExtraKeys=['localObra','descricaoLocal','observacoes','apontador','rdoNum'];
const originalFill=preencherCampos;
preencherCampos=function(){originalFill();gerFillExtra();};
const originalSave=salvarDiarioDia;
salvarDiarioDia=function(notifySave){originalSave(false);if(currentDay&&gerExtraKeys.some(k=>currentDay[k])||currentDay?.fotos?.length){history[currentDay.data]=JSON.parse(JSON.stringify(currentDay));saveHistory();}if(notifySave){toast('Diário salvo no histórico');backupAutomatico();}};
const originalBuildReport=buildRelatorio;
buildRelatorio=function(day){return originalBuildReport(day)+['',day.rdoNum?'RDO Nº: '+day.rdoNum:'',day.localObra?'Local da obra: '+day.localObra:'',day.descricaoLocal?'Descrição do local: '+day.descricaoLocal:'',day.observacoes?'Observações do dia: '+day.observacoes:'',day.apontador?'Apontador: '+day.apontador:'',day.fotos?.length?'Fotos: '+day.fotos.length+' anexo(s)\n'+day.fotos.map(p=>'• '+(p.legenda||'(sem legenda)')).join('\n'):''].filter(Boolean).join('\n');};
function gerApontadoresFiltrados(){
  const lista=[];
  (state.colaboradores.categorias||[]).forEach(cat=>{
    const catIsApontador=cat.nome.toLowerCase().includes('apontador');
    (cat.itens||[]).forEach(c=>{
      if(catIsApontador||(c.funcao||'').toLowerCase().includes('apontador'))lista.push(`${c.mat} – ${c.nome}`);
    });
  });
  return lista;
}
function gerFillExtra(){
  if(!currentDay)return;
  gerExtraKeys.forEach(k=>{const el=document.getElementById('ger-'+k);if(el)el.value=currentDay[k]||'';});
  const selApontador=document.getElementById('ger-apontador');
  if(selApontador){
    const atual=currentDay.apontador||'';
    selApontador.innerHTML='<option value="">— Selecionar apontador —</option>'+gerApontadoresFiltrados().map(nome=>`<option ${nome===atual?'selected':''}>${escapeHtml(nome)}</option>`).join('');
    selApontador.value=atual;
  }
  gerRenderPhotos();
}
function gerRenderPhotos(){
  const el=document.getElementById('ger-photo-list');if(!el||!currentDay)return;
  el.innerHTML=(currentDay.fotos||[]).map((p,i)=>`<div class="ger-photo"><img src="${escapeHtml(p.dataUrl)}" alt="${escapeHtml(p.name)}"><p>${escapeHtml(p.name)}</p><input type="text" placeholder="Legenda..." value="${escapeHtml(p.legenda||'')}" data-photo-legenda="${i}" maxlength="200"><button type="button" class="btn btn-ghost" data-remove-photo="${i}">Remover</button></div>`).join('');
  el.querySelectorAll('[data-remove-photo]').forEach(b=>b.onclick=()=>{if(!confirm('Remover esta foto do diário?'))return;currentDay.fotos.splice(Number(b.dataset.removePhoto),1);salvarDiarioDia(false);gerRenderPhotos();});
  el.querySelectorAll('[data-photo-legenda]').forEach(inp=>inp.addEventListener('change',()=>salvarLegendaFoto(Number(inp.dataset.photoLegenda),inp.value)));
}
function salvarLegendaFoto(idx,valor){
  if(!currentDay.fotos||!currentDay.fotos[idx])return;
  currentDay.fotos[idx].legenda=(valor||'').trim();
  salvarDiarioDia(false);
}
// Reduz a imagem antes de guardar (máx. 1280px, JPEG 72%) — mesmos parâmetros do
// aplicativo original. Ajuda a evitar estourar a cota do navegador com fotos grandes.
function gerComprimirFoto(file,maxDim=1280,qualidade=0.72){
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=()=>{
      const img=new Image();
      img.onload=()=>{
        let w=img.width,h=img.height;
        if(w>maxDim||h>maxDim){const r=Math.min(maxDim/w,maxDim/h);w=Math.round(w*r);h=Math.round(h*r);}
        const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
        canvas.getContext('2d').drawImage(img,0,0,w,h);
        resolve(canvas.toDataURL('image/jpeg',qualidade));
      };
      img.onerror=()=>reject(new Error('Imagem inválida'));
      img.src=reader.result;
    };
    reader.onerror=()=>reject(new Error('Falha ao ler arquivo'));
    reader.readAsDataURL(file);
  });
}
async function gerPhotos(files){
  currentDay.fotos=currentDay.fotos||[];
  let salvas=0,falhas=0;
  for(const f of files){
    if(!['image/jpeg','image/png','image/webp'].includes(f.type)||f.size>5*1024*1024){
      falhas++;toast(`"${f.name}": use JPG, PNG ou WebP de até 5 MB.`);continue;
    }
    let dataUrl;
    try{
      dataUrl=await gerComprimirFoto(f);
    }catch(e){falhas++;toast(`Falha ao processar "${f.name}".`);continue;}

    const foto={id:uid('foto'),name:f.name,mime:'image/jpeg',legenda:'',dataUrl};
    currentDay.fotos.push(foto);
    try{
      salvarDiarioDia(false);
      salvas++;
    }catch(e){
      // Sem espaço no navegador (ou outra falha de gravação): descarta
      // só esta foto em memória para não deixar um anexo "fantasma"
      // que parece salvo mas não persistiu.
      currentDay.fotos.pop();
      falhas++;
      const semEspaco=e && (e.name==='QuotaExceededError'||/quota/i.test(e.message||''));
      toast(semEspaco
        ? `Sem espaço no navegador para "${f.name}". Remova fotos antigas deste diário ou envie para a nuvem antes de continuar.`
        : `Não foi possível salvar "${f.name}": ${e.message||'erro desconhecido'}.`);
      if(semEspaco) break; // não adianta tentar as próximas se a cota já estourou
    }
  }
  gerRenderPhotos();
  if(salvas&&!falhas)toast(`${salvas} foto(s) salva(s) neste navegador.`);
  else if(salvas)toast(`${salvas} foto(s) salva(s), ${falhas} não salva(s) — veja os avisos acima.`);
}
function gerBuildPayload(day=currentDay){
  const cat=state.colaboradores.categorias.flatMap(c=>c.itens),present=cat.filter(c=>day.efetivo[c.id]);
  const by={};present.forEach(c=>by[c.funcao]=(by[c.funcao]||0)+1);
  const atividadesTexto=state.atividades.filter(a=>day.atividadesMarcadas[a.id]).map(a=>`${a.desc} | ${a.local} | ${day.atividadesQtd?.[a.id]||''} ${a.unidade}`)
    .concat((day.atividadesAvulsas||[]).map(a=>a.desc||JSON.stringify(a)),day.atividadesExtra||'')
    .concat((day.atividadesParalisadas||[]).length?['PARALISADAS: '+day.atividadesParalisadas.map(p=>`${p.desc} — ${p.just||'sem justificativa'}`).join('; ')]:[])
    .join('\n');
  // Campo 19 do contrato: equipamentos e veículos leves cadastrados sem uso hoje, com justificativa.
  const parados=day.veiculosParados||{};
  const equipsParados=state.equipamentos.filter(e=>!day.equipamentos?.[e.id]);
  const vlParados=(state.veiculosFrota||[]).filter(v=>!(day.veiculosLeves||[]).some(x=>x.frotaId===v.id));
  const veiculosParadosTexto=[
    ...equipsParados.map(e=>`${e.numero?e.numero+' — ':''}${e.desc}${parados[e.id]?': '+parados[e.id]:''}`),
    ...vlParados.map(v=>`${v.desc}${v.placa?' ('+v.placa+')':''}${parados[v.id]?': '+parados[v.id]:''}`)
  ].join('\n');
  return {id:'diario-'+day.data,data:day.data,diaSemana:diaDaSemana(day.data),obra:state.obra.nome,empresa:state.obra.empresa,local:state.obra.local,localObra:day.localObra||'',descricaoLocal:day.descricaoLocal||'',tempo:tempoLabel(day.tempo,day.tempoVento),jornada:`Café ${day.cafeInicio}–${day.cafeFim}; almoço ${day.almocoInicio}–${day.almocoFim}; encerramento ${day.encerramento}`,dssHorario:day.dssHorario,dssMinistrou:day.dssMinistrou,dssTema:day.dssTema,atividades:atividadesTexto,efetivoTotal:present.length,efetivoPorFuncao:JSON.stringify(by),colaboradoresPresentes:present.map(c=>`${c.mat} · ${c.nome} · ${c.funcao}`).join('\n'),equipamentos:JSON.stringify(day.equipamentos||{}),veiculosLeves:JSON.stringify(day.veiculosLeves||[]),veiculosParados:veiculosParadosTexto,eventosSeguranca:JSON.stringify(day.eventosSeguranca||[]),eventosMeioAmbiente:JSON.stringify(day.eventosAmbiente||[]),observacoes:day.observacoes||'',apontador:day.apontador||'',fotos:(day.fotos||[]).filter(p=>p.url).map(p=>(p.legenda?p.legenda+' — ':'')+p.url).join('\n'),rdoNum:day.rdoNum||'',registroCompleto:JSON.parse(JSON.stringify(day))};
}
// ============================================================
// PDF DO RDO (html2canvas + jsPDF, ambos embutidos — sem CDN) e
// assinatura em canvas. A assinatura é só um registro visual de que
// alguém tocou a tela naquele momento: não tem valor jurídico por si
// só (ver docs/Prompt_Global_Gerenciamento.md §7) — o próprio texto do
// PDF deixa isso explícito.
// ============================================================
let gerPadCtx=null,gerPadDesenhando=false,gerPadSlotAtual=null,gerPadTemTraco=false;

function gerPdfCard(v,t){return `<div style="background:#f4f5f7;border:1px solid var(--line);border-radius:8px;padding:10px;text-align:center"><div style="font-size:20px;font-weight:800;color:var(--accent)">${escapeHtml(String(v))}</div><div style="font-size:10px;color:var(--ink-soft);text-transform:uppercase;letter-spacing:.3px">${escapeHtml(t)}</div></div>`;}
function gerPdfSec(titulo,corpo){return `<div style="margin-bottom:14px"><div style="font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;color:var(--ink);border-bottom:2px solid var(--accent);padding-bottom:4px;margin-bottom:8px">${escapeHtml(titulo)}</div>${corpo}</div>`;}
function gerPdfTabela(linhas){return `<table style="width:100%;border-collapse:collapse;font-size:11px">${linhas}</table>`;}
function gerPdfAssinaturaBox(slot,titulo,subtitulo,day){
  const img=(day.assinaturas||{})[slot];
  const conteudo=img
    ?`<img src="${img}" style="height:50px;display:block;margin:0 auto 4px">`
    :`<div style="height:50px;display:flex;align-items:flex-end;justify-content:center;color:#999;font-size:10px">Toque para assinar</div>`;
  return `<div class="ger-ass-box" data-ass-slot="${slot}" style="cursor:pointer;flex:1;min-width:140px">${conteudo}<div style="border-top:1.5px solid #1a1a1a;padding-top:4px;font-size:11px;text-align:center">${escapeHtml(titulo)}<br><span style="color:#666;font-size:10px">${escapeHtml(subtitulo)}</span></div></div>`;
}

function gerBuildPdfHtml(day){
  const efetivoPorCat=[];
  let totalEf=0;
  state.colaboradores.categorias.forEach(cat=>{
    const presentes=cat.itens.filter(c=>day.efetivo[c.id]);
    if(!presentes.length)return;
    totalEf+=presentes.length;
    efetivoPorCat.push(`<tr><td style="padding:3px 6px;border-bottom:1px solid #eee">${escapeHtml(cat.nome)}</td><td style="padding:3px 6px;border-bottom:1px solid #eee;text-align:right">${presentes.length}</td></tr>`);
  });
  const ativsMarc=state.atividades.filter(a=>day.atividadesMarcadas[a.id]);
  const linhasAtiv=ativsMarc.map(a=>{
    const qtd=day.atividadesQtd&&day.atividadesQtd[a.id];
    return `<tr><td style="padding:3px 6px;border-bottom:1px solid #eee">${escapeHtml(a.desc)}${a.local?' — '+escapeHtml(a.local):''}</td><td style="padding:3px 6px;border-bottom:1px solid #eee;text-align:right">${qtd?escapeHtml(String(qtd))+' '+escapeHtml(a.unidade||''):'—'}</td></tr>`;
  }).concat((day.atividadesAvulsas||[]).map(a=>`<tr><td style="padding:3px 6px;border-bottom:1px solid #eee">${escapeHtml(a.desc)}${a.local?' — '+escapeHtml(a.local):''}</td><td style="padding:3px 6px;border-bottom:1px solid #eee;text-align:right">—</td></tr>`)).join('');
  const linhasParalisadas=(day.atividadesParalisadas||[]).map(p=>`<tr><td style="padding:3px 6px;border-bottom:1px solid #eee">⏸️ ${escapeHtml(p.desc)}</td><td style="padding:3px 6px;border-bottom:1px solid #eee">${escapeHtml(p.just||'sem justificativa')}</td></tr>`).join('');
  const equipsAtivos=state.equipamentos.filter(e=>day.equipamentos?.[e.id]);
  const vlAtivos=(day.veiculosLeves||[]).map(v=>(state.veiculosFrota||[]).find(f=>f.id===v.frotaId)).filter(Boolean);
  const linhasOperacao=equipsAtivos.map(e=>{
    const d=day.equipamentos[e.id];
    return `<tr><td style="padding:3px 6px;border-bottom:1px solid #eee">🚜 ${escapeHtml((e.numero?e.numero+' — ':'')+e.desc)}</td><td style="padding:3px 6px;border-bottom:1px solid #eee">${escapeHtml(d.operadorNome||'—')}</td><td style="padding:3px 6px;border-bottom:1px solid #eee">${escapeHtml(d.status||'Operando')}${d.horimetro?' · '+escapeHtml(String(d.horimetro))+'h':''}</td></tr>`;
  }).concat(vlAtivos.map(v=>{
    const d=(day.veiculosLeves||[]).find(x=>x.frotaId===v.id);
    return `<tr><td style="padding:3px 6px;border-bottom:1px solid #eee">🚗 ${escapeHtml(v.desc)}${v.placa?' ('+escapeHtml(v.placa)+')':''}</td><td style="padding:3px 6px;border-bottom:1px solid #eee">${escapeHtml(d?.motoristaNome||'—')}</td><td style="padding:3px 6px;border-bottom:1px solid #eee">Em uso</td></tr>`;
  })).join('');
  const equipsParados=state.equipamentos.filter(e=>!day.equipamentos?.[e.id]);
  const vlParados=(state.veiculosFrota||[]).filter(v=>!(day.veiculosLeves||[]).some(x=>x.frotaId===v.id));
  const parados=day.veiculosParados||{};
  const linhasParados=[
    ...equipsParados.map(e=>`<tr><td style="padding:3px 6px;border-bottom:1px solid #eee">🚜 ${escapeHtml((e.numero?e.numero+' — ':'')+e.desc)}</td><td style="padding:3px 6px;border-bottom:1px solid #eee">${escapeHtml(parados[e.id]||'Sem justificativa')}</td></tr>`),
    ...vlParados.map(v=>`<tr><td style="padding:3px 6px;border-bottom:1px solid #eee">🚗 ${escapeHtml(v.desc)}${v.placa?' ('+escapeHtml(v.placa)+')':''}</td><td style="padding:3px 6px;border-bottom:1px solid #eee">${escapeHtml(parados[v.id]||'Sem justificativa')}</td></tr>`)
  ].join('');
  const eventos=(titulo,lista)=>{
    if(!lista||!lista.length)return '';
    const linhas=lista.map((ev,i)=>`<tr><td style="padding:3px 6px;border-bottom:1px solid #eee;width:5%">${i+1}</td><td style="padding:3px 6px;border-bottom:1px solid #eee">${escapeHtml(ev.tipo)} (${escapeHtml(ev.gravidade)})${ev.desc?'<br>'+escapeHtml(ev.desc):''}${ev.acao?'<br><em>Ação: '+escapeHtml(ev.acao)+'</em>':''}</td></tr>`).join('');
    return gerPdfSec(titulo+' — '+lista.length,gerPdfTabela(linhas));
  };
  const fotosHtml=(day.fotos||[]).length
    ?`<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px">${day.fotos.map(f=>`<div style="text-align:center"><img src="${f.dataUrl}" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:5px;border:1px solid #ddd"><div style="font-size:9px;color:#666;margin-top:2px">${escapeHtml(f.legenda||'')}</div></div>`).join('')}</div>`
    :'<p style="font-size:11px;color:#999">Nenhuma foto anexada.</p>';

  return `<div style="width:190mm;padding:10mm;box-sizing:border-box;background:#fff;font-family:Inter,sans-serif;color:#1c1a18">
    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid var(--accent);padding-bottom:10px;margin-bottom:14px">
      <div>
        <div style="font-size:18px;font-weight:800">RELATÓRIO DIÁRIO DE OBRA</div>
        <div style="font-size:12px;color:#555">${escapeHtml(state.obra.nome||'')} · ${escapeHtml(state.obra.empresa||'')}</div>
      </div>
      <div style="text-align:right;font-size:11px;color:#555">
        <div><strong>${day.rdoNum?'RDO Nº '+escapeHtml(day.rdoNum):'Rascunho — sem numeração oficial'}</strong></div>
        <div>${escapeHtml(formatDateBR(day.data))} · ${escapeHtml(diaDaSemana(day.data))}</div>
      </div>
    </div>
    <div style="background:#fff4e8;border:1px solid #efdecc;color:#83440e;font-size:10px;padding:8px 10px;border-radius:6px;margin-bottom:14px">
      Documento gerado pelo Gerenciamento em ambiente de avaliação — sem aprovação oficial, numeração definitiva ou validade jurídica. As assinaturas abaixo são apenas um registro visual de tela, não uma assinatura eletrônica qualificada.
    </div>
    ${gerPdfSec('Resumo geral',`<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">${[gerPdfCard(totalEf,'Efetivo'),gerPdfCard(ativsMarc.length+(day.atividadesAvulsas||[]).length,'Atividades'),gerPdfCard(equipsAtivos.length+vlAtivos.length,'Equip./Veíc.'),gerPdfCard((day.eventosSeguranca||[]).length+(day.eventosAmbiente||[]).length,'Ocorrências'),gerPdfCard((day.atividadesParalisadas||[]).length,'Paralisações'),gerPdfCard((day.fotos||[]).length,'Fotos'),gerPdfCard(tempoLabel(day.tempo,day.tempoVento)||'—','Tempo'),gerPdfCard(day.apontador?day.apontador.split('–')[1]?.trim()||day.apontador:'—','Apontador')].join('')}</div>`)}
    ${gerPdfSec('Jornada · DSS',gerPdfTabela(`<tr><td style="padding:3px 6px;border-bottom:1px solid #eee">Café ${escapeHtml(day.cafeInicio||'--')}–${escapeHtml(day.cafeFim||'--')} · Almoço ${escapeHtml(day.almocoInicio||'--')}–${escapeHtml(day.almocoFim||'--')} · Encerramento ${escapeHtml(day.encerramento||'--')}</td></tr><tr><td style="padding:3px 6px">DSS ${escapeHtml(day.dssHorario||'—')} · ${escapeHtml(day.dssTema||'sem tema registrado')}</td></tr>`))}
    ${gerPdfSec('Atividades do dia',linhasAtiv||linhasParalisadas?gerPdfTabela(linhasAtiv+linhasParalisadas):'<p style="font-size:11px;color:#999">Nenhuma atividade registrada.</p>')}
    ${gerPdfSec('Efetivo — '+totalEf,efetivoPorCat.length?gerPdfTabela(efetivoPorCat.join('')):'<p style="font-size:11px;color:#999">Nenhum efetivo registrado.</p>')}
    ${gerPdfSec('Equipamentos e veículos em operação',linhasOperacao?gerPdfTabela(linhasOperacao):'<p style="font-size:11px;color:#999">Nenhum em operação hoje.</p>')}
    ${linhasParados?gerPdfSec('Veículos/equipamentos parados',gerPdfTabela(linhasParados)):''}
    ${eventos('Eventos de segurança',day.eventosSeguranca)}
    ${eventos('Eventos de meio ambiente',day.eventosAmbiente)}
    ${day.observacoes?gerPdfSec('Observações do dia',`<p style="font-size:11px;white-space:pre-wrap">${escapeHtml(day.observacoes)}</p>`):''}
    ${gerPdfSec('Fotos',fotosHtml)}
    <div style="display:flex;gap:16px;margin-top:24px">
      ${gerPdfAssinaturaBox('apontador',day.apontador||'Apontador Responsável','Apontador — '+(state.obra.empresa||''),day)}
      ${gerPdfAssinaturaBox('fiscal','Fiscalização / Cliente',' ',day)}
    </div>
  </div>`;
}

function gerRenderAssinaturaBox(){
  const content=document.getElementById('ger-pdf-content');
  if(content&&content.innerHTML)content.innerHTML=gerBuildPdfHtml(currentDay);
}

function gerAbrirPdfPreview(){
  if(!currentDay||!currentDay.data){toast('Defina a data do diário primeiro.');return;}
  salvarDiarioDia(false);
  let overlay=document.getElementById('ger-pdf-overlay');
  if(!overlay){
    overlay=document.createElement('div');
    overlay.id='ger-pdf-overlay';
    overlay.style.cssText='display:none;position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:5000;overflow:auto;padding:16px 0';
    overlay.innerHTML=`<div style="max-width:210mm;margin:0 auto"><div style="display:flex;gap:8px;justify-content:flex-end;margin-bottom:8px;padding:0 8px"><button class="btn btn-primary" id="ger-pdf-baixar">⬇️ Baixar PDF</button><button class="btn btn-ghost" id="ger-pdf-fechar" style="background:#fff">✕ Fechar</button></div><div id="ger-pdf-content"></div></div>`;
    document.body.appendChild(overlay);
    document.getElementById('ger-pdf-fechar').onclick=()=>{overlay.style.display='none';};
    document.getElementById('ger-pdf-baixar').onclick=()=>gerAction(document.getElementById('ger-pdf-baixar'),gerGerarPdfArquivo);
    overlay.addEventListener('click',e=>{
      const box=e.target.closest('[data-ass-slot]');
      if(box)gerAbrirAssinatura(box.dataset.assSlot);
    });
  }
  document.getElementById('ger-pdf-content').innerHTML=gerBuildPdfHtml(currentDay);
  overlay.style.display='block';
}

async function gerGerarPdfArquivo(){
  const content=document.getElementById('ger-pdf-content');
  const canvas=await html2canvas(content,{scale:2,backgroundColor:'#ffffff',useCORS:true});
  const imgData=canvas.toDataURL('image/jpeg',0.92);
  const {jsPDF}=window.jspdf;
  const pdf=new jsPDF({unit:'mm',format:'a4'});
  const pageWidth=pdf.internal.pageSize.getWidth();
  const pageHeight=pdf.internal.pageSize.getHeight();
  const imgHeightMm=canvas.height*pageWidth/canvas.width;
  let heightLeft=imgHeightMm,position=0;
  pdf.addImage(imgData,'JPEG',0,position,pageWidth,imgHeightMm);
  heightLeft-=pageHeight;
  while(heightLeft>0){
    position=heightLeft-imgHeightMm;
    pdf.addPage();
    pdf.addImage(imgData,'JPEG',0,position,pageWidth,imgHeightMm);
    heightLeft-=pageHeight;
  }
  const obraSlug=(state.obra.nome||'Obra').replace(/[^a-zA-Z0-9]/g,'-');
  pdf.save(`RDO-${obraSlug}-${currentDay.data}.pdf`);
  return 'PDF gerado.';
}

// Assinatura em canvas — registro visual de tela, sem valor jurídico por si só.
function gerAbrirAssinatura(slot){
  gerPadSlotAtual=slot;
  let modal=document.getElementById('ger-ass-modal');
  if(!modal){
    modal=document.createElement('div');
    modal.id='ger-ass-modal';
    modal.style.cssText='display:none;position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:6000;align-items:center;justify-content:center';
    modal.innerHTML=`<div style="background:#fff;border-radius:10px;padding:16px;max-width:94vw"><div style="font-weight:800;margin-bottom:8px">Assinar em tela</div><p style="font-size:11px;color:#83440e;background:#fff4e8;border:1px solid #efdecc;border-radius:6px;padding:8px;margin-bottom:10px;max-width:340px">Registro visual de que alguém tocou a tela agora. Não é assinatura eletrônica qualificada nem tem validade jurídica por si só.</p><canvas id="ger-ass-canvas" width="320" height="140" style="border:1.5px solid #ccc;border-radius:6px;touch-action:none;display:block"></canvas><div class="btn-row" style="margin-top:10px;display:flex;gap:8px"><button class="btn btn-ghost" id="ger-ass-limpar">Limpar</button><button class="btn btn-ghost" id="ger-ass-cancelar">Cancelar</button><button class="btn btn-primary" id="ger-ass-salvar">Salvar</button></div></div>`;
    document.body.appendChild(modal);
    const canvas=document.getElementById('ger-ass-canvas');
    gerPadCtx=canvas.getContext('2d');
    gerPadCtx.lineWidth=2.2;gerPadCtx.lineCap='round';gerPadCtx.strokeStyle='#1c1a18';
    const pos=e=>{const r=canvas.getBoundingClientRect();const p=e.touches?e.touches[0]:e;return {x:p.clientX-r.left,y:p.clientY-r.top};};
    const start=e=>{e.preventDefault();gerPadDesenhando=true;gerPadTemTraco=true;const p=pos(e);gerPadCtx.beginPath();gerPadCtx.moveTo(p.x,p.y);};
    const move=e=>{if(!gerPadDesenhando)return;e.preventDefault();const p=pos(e);gerPadCtx.lineTo(p.x,p.y);gerPadCtx.stroke();};
    const end=()=>{gerPadDesenhando=false;};
    canvas.addEventListener('pointerdown',start);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',end);canvas.addEventListener('pointerleave',end);
    document.getElementById('ger-ass-limpar').onclick=gerLimparAssinatura;
    document.getElementById('ger-ass-cancelar').onclick=gerFecharAssinatura;
    document.getElementById('ger-ass-salvar').onclick=gerSalvarAssinatura;
  }
  gerLimparAssinatura();
  modal.style.display='flex';
}
function gerLimparAssinatura(){
  const canvas=document.getElementById('ger-ass-canvas');
  gerPadCtx.clearRect(0,0,canvas.width,canvas.height);
  gerPadTemTraco=false;
}
function gerFecharAssinatura(){
  document.getElementById('ger-ass-modal').style.display='none';
  gerPadSlotAtual=null;
}
function gerSalvarAssinatura(){
  if(!gerPadTemTraco){toast('Assine antes de salvar (ou Cancelar).');return;}
  const canvas=document.getElementById('ger-ass-canvas');
  currentDay.assinaturas=currentDay.assinaturas||{};
  currentDay.assinaturas[gerPadSlotAtual]=canvas.toDataURL('image/png');
  salvarDiarioDia(false);
  gerRenderAssinaturaBox();
  gerFecharAssinatura();
  toast('Assinatura registrada.');
}

async function gerAction(button,fn){button.disabled=true;try{const result=await fn();toast(result||'Operação concluída.');}catch(e){toast(e.message||'Falha na operação.');}finally{button.disabled=false;}}
function gerAppVazio(){
  const nColab=state.colaboradores.categorias.reduce((s,c)=>s+c.itens.length,0);
  const nEquip=state.equipamentos.length;
  const nAtiv=state.atividades.length;
  const nHist=Object.keys(history).length;
  return nColab===0&&nEquip===0&&nAtiv===0&&nHist===0;
}
async function gerRestaurarNuvem(perguntar){
  const d=await gerRequest('backup','buscar-ultimo');
  if(!d.conteudo)throw Error('Nenhum backup encontrado na nuvem.');
  const backup=JSON.parse(d.conteudo);
  if(!backup.state||!backup.history)throw Error('Backup inválido.');
  if(perguntar&&!confirm('Restaurar o backup encontrado? Uma cópia atual será exportada antes.'))return false;
  exportarBackup(true);
  state=mergeDefaults(backup.state);
  history=backup.history;
  saveState();saveHistory();
  initCurrentDay(todayISO());
  return true;
}
// Verificação silenciosa ao carregar: só oferece restaurar quando este
// aparelho está totalmente vazio (nada a perder) e nunca restaura sozinho —
// é sempre o usuário quem decide, clicando no botão do aviso.
function gerChecarRestauracaoAutomatica(){
  if(!gerAppVazio())return;
  if(sessionStorage.getItem('gerRestauracaoDispensada'))return;
  gerRequest('backup','buscar-ultimo').then(d=>{
    if(!d||!d.conteudo)return;
    const banner=document.createElement('div');
    banner.id='ger-banner-restaurar';
    banner.style.cssText='position:fixed;left:12px;right:12px;bottom:88px;z-index:9998;background:#20242a;border:1.5px solid var(--accent);border-radius:10px;padding:14px;box-shadow:0 4px 16px rgba(0,0,0,.3)';
    banner.innerHTML=`<div style="color:var(--accent);font-weight:800;font-size:13px;margin-bottom:4px">☁️ Dados não encontrados neste aparelho</div><div style="color:#e8e0d0;font-size:12px;margin-bottom:10px">Há um backup na nuvem${d.data?' de '+new Date(d.data).toLocaleString('pt-BR'):''}. Restaurar?</div><div style="display:flex;gap:8px"><button id="ger-banner-agora-nao" style="flex:1;padding:9px;border:none;border-radius:6px;background:#555;color:#fff;font-size:12px;font-weight:700">Agora não</button><button id="ger-banner-restaurar-btn" style="flex:1;padding:9px;border:none;border-radius:6px;background:var(--accent);color:#fff;font-size:12px;font-weight:700">☁️ Restaurar</button></div>`;
    document.body.appendChild(banner);
    document.getElementById('ger-banner-agora-nao').onclick=()=>{banner.remove();sessionStorage.setItem('gerRestauracaoDispensada','1');};
    document.getElementById('ger-banner-restaurar-btn').onclick=async()=>{
      try{await gerRestaurarNuvem(false);toast('☁️ Restaurado da nuvem.');}catch(e){toast(e.message||'Falha ao restaurar.');}
      banner.remove();
    };
  }).catch(()=>{});
}
window.addEventListener('DOMContentLoaded',()=>{
 state.obra={...state.obra,...parent.GerenciamentoModules.getWork(__obraId)};atualizarHeader();
 const section=document.createElement('section');section.className='section';section.innerHTML=`<div class="section-title"><div class="section-title-text">Identificação, observações e fotos</div></div><div class="ger-grid">${[['localObra','Local da obra'],['descricaoLocal','Descrição do local'],['rdoNum','RDO Nº']].map(([key,label])=>`<label>${label}<input id="ger-${key}" maxlength="500"></label>`).join('')}<label>Apontador<select id="ger-apontador"></select></label></div><label>Observações do dia<textarea id="ger-observacoes"></textarea></label><label>Fotos do diário<input type="file" id="ger-fotos" accept="image/jpeg,image/png,image/webp" multiple></label><div id="ger-photo-list" class="ger-photos"></div>`;
 const save=document.querySelector('[onclick="salvarDiarioDia(true)"]');save.before(section);gerExtraKeys.forEach(k=>{const el=document.getElementById('ger-'+k);el.addEventListener('input',e=>{currentDay[k]=e.target.value;salvarDiarioDia(false);});el.addEventListener('change',e=>{currentDay[k]=e.target.value;salvarDiarioDia(false);});});document.getElementById('ger-fotos').onchange=e=>gerPhotos(e.target.files);gerFillExtra();
 const services=document.createElement('section');services.className='section';services.innerHTML=`<div class="section-title"><div class="section-title-text">Planilha, arquivos e consulta aos dados</div></div><p class="ger-local">Usa somente o serviço próprio configurado em Conexões. As fotos continuam disponíveis localmente.</p><div class="ger-actions"><button class="btn btn-primary" id="ger-cloud-save">Salvar diário na planilha</button><button class="btn btn-secondary" id="ger-cloud-photos">Enviar fotos para a nuvem</button><button class="btn btn-secondary" id="ger-cloud-backup">Backup na nuvem</button><button class="btn btn-secondary" id="ger-cloud-restore">Buscar último backup</button></div><label>Mês para consulta <input id="ger-query-month" type="month" value="${todayISO().slice(0,7)}"></label><button class="btn btn-secondary" id="ger-cloud-month">Consultar diários do mês</button><pre id="ger-cloud-result" style="white-space:pre-wrap;overflow-wrap:anywhere"></pre><label>Pergunta sobre os registros da obra<textarea id="ger-question" placeholder="Digite sua pergunta"></textarea></label><button class="btn btn-primary" id="ger-ask">Consultar IA</button><p id="ger-answer" style="white-space:pre-wrap"></p>`;
 document.getElementById('view-gerar').appendChild(services);
 const btnPdf=document.createElement('button');btnPdf.className='btn btn-secondary';btnPdf.textContent='📄 Gerar PDF do RDO';btnPdf.onclick=gerAbrirPdfPreview;
 const stack=document.querySelector('.btn-stack');if(stack)stack.appendChild(btnPdf);
 const on=(id,fn)=>{const b=document.getElementById(id);b.onclick=()=>gerAction(b,fn);};
 on('ger-cloud-save',async()=>{salvarDiarioDia(false);await gerRequest('diario','salvar',gerBuildPayload());return 'Diário confirmado na planilha.';});
 on('ger-cloud-photos',async()=>{if(!currentDay.fotos?.length)throw Error('Adicione fotos primeiro.');for(const p of currentDay.fotos.filter(p=>!p.url)){const result=await gerRequest('foto','salvar',{path:'foto',obra:state.obra.nome,data:currentDay.data,base64:p.dataUrl.split(',')[1],mime:p.mime,nome:p.name});p.url=result.url;p.fileId=result.fileId;salvarDiarioDia(false);}return 'Fotos confirmadas na nuvem.';});
 on('ger-cloud-backup',async()=>{await gerRequest('backup','salvar',{path:'backup',obra:state.obra.nome,conteudo:JSON.stringify({state,history,versao:'Gerenciamento-0.2'})});return 'Backup confirmado na nuvem.';});
 on('ger-cloud-restore',async()=>{const ok=await gerRestaurarNuvem(true);return ok?'Backup restaurado.':'Restauração cancelada.';});
 on('ger-cloud-month',async()=>{const month=document.getElementById('ger-query-month').value;const d=await gerRequest('diario','lista-mes',{mes:month});document.getElementById('ger-cloud-result').textContent=JSON.stringify(d.diarios||[],null,2);return 'Consulta concluída.';});
 on('ger-ask',async()=>{const pergunta=document.getElementById('ger-question').value.trim();if(!pergunta)throw Error('Digite uma pergunta.');const d=await gerRequest('ia','perguntar',{pergunta});document.getElementById('ger-answer').textContent=d.resposta||'Sem resposta.';return 'Consulta concluída.';});
 gerChecarRestauracaoAutomatica();
});
