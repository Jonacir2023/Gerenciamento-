// Campos e serviços do contrato v5 que complementam as telas disponíveis do Diário.
const gerExtraKeys=['localObra','descricaoLocal','observacoes','apontador','rdoNum'];
const originalFill=preencherCampos;
preencherCampos=function(){originalFill();gerFillExtra();};
const originalSave=salvarDiarioDia;
salvarDiarioDia=function(notifySave){originalSave(false);if(currentDay&&gerExtraKeys.some(k=>currentDay[k])||currentDay?.fotos?.length){history[currentDay.data]=JSON.parse(JSON.stringify(currentDay));saveHistory();}if(notifySave){toast('Diário salvo no histórico');backupAutomatico();}};
const originalBuildReport=buildRelatorio;
buildRelatorio=function(day){return originalBuildReport(day)+['',day.rdoNum?'RDO Nº: '+day.rdoNum:'',day.localObra?'Local da obra: '+day.localObra:'',day.descricaoLocal?'Descrição do local: '+day.descricaoLocal:'',day.observacoes?'Observações do dia: '+day.observacoes:'',day.apontador?'Apontador: '+day.apontador:'',day.fotos?.length?'Fotos: '+day.fotos.length+' anexo(s)':''].filter(Boolean).join('\n');};
function gerFillExtra(){if(!currentDay)return;gerExtraKeys.forEach(k=>{const el=document.getElementById('ger-'+k);if(el)el.value=currentDay[k]||'';});gerRenderPhotos();}
function gerRenderPhotos(){const el=document.getElementById('ger-photo-list');if(!el||!currentDay)return;el.innerHTML=(currentDay.fotos||[]).map((p,i)=>`<div class="ger-photo"><img src="${escapeHtml(p.dataUrl)}" alt="${escapeHtml(p.name)}"><p>${escapeHtml(p.name)}</p><button type="button" class="btn btn-ghost" data-remove-photo="${i}">Remover</button></div>`).join('');el.querySelectorAll('[data-remove-photo]').forEach(b=>b.onclick=()=>{if(!confirm('Remover esta foto do diário?'))return;currentDay.fotos.splice(Number(b.dataset.removePhoto),1);salvarDiarioDia(false);gerRenderPhotos();});}
async function gerPhotos(files){
  currentDay.fotos=currentDay.fotos||[];
  let salvas=0,falhas=0;
  for(const f of files){
    if(!['image/jpeg','image/png','image/webp'].includes(f.type)||f.size>5*1024*1024){
      falhas++;toast(`"${f.name}": use JPG, PNG ou WebP de até 5 MB.`);continue;
    }
    let dataUrl;
    try{
      dataUrl=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(f);});
    }catch(e){falhas++;toast(`Falha ao ler "${f.name}".`);continue;}

    const foto={id:uid('foto'),name:f.name,mime:f.type,dataUrl};
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
function gerBuildPayload(day=currentDay){const cat=state.colaboradores.categorias.flatMap(c=>c.itens),present=cat.filter(c=>day.efetivo[c.id]);const by={};present.forEach(c=>by[c.funcao]=(by[c.funcao]||0)+1);return {id:'diario-'+day.data,data:day.data,diaSemana:diaDaSemana(day.data),obra:state.obra.nome,empresa:state.obra.empresa,local:state.obra.local,localObra:day.localObra||'',descricaoLocal:day.descricaoLocal||'',tempo:tempoLabel(day.tempo,day.tempoVento),jornada:`Café ${day.cafeInicio}–${day.cafeFim}; almoço ${day.almocoInicio}–${day.almocoFim}; encerramento ${day.encerramento}`,dssHorario:day.dssHorario,dssMinistrou:day.dssMinistrou,dssTema:day.dssTema,atividades:state.atividades.filter(a=>day.atividadesMarcadas[a.id]).map(a=>`${a.desc} | ${a.local} | ${day.atividadesQtd?.[a.id]||''} ${a.unidade}`).concat((day.atividadesAvulsas||[]).map(a=>a.desc||JSON.stringify(a)),day.atividadesExtra||'').join('\n'),efetivoTotal:present.length,efetivoPorFuncao:JSON.stringify(by),colaboradoresPresentes:present.map(c=>`${c.mat} · ${c.nome} · ${c.funcao}`).join('\n'),equipamentos:JSON.stringify(day.equipamentos||{}),veiculosLeves:JSON.stringify(day.veiculosLeves||[]),veiculosParados:JSON.stringify(Object.fromEntries(Object.entries(day.equipamentos||{}).filter(([,v])=>v.status&&v.status!=='Operando'))),eventosSeguranca:JSON.stringify(day.eventosSeguranca||[]),eventosMeioAmbiente:JSON.stringify(day.eventosAmbiente||[]),observacoes:day.observacoes||'',apontador:day.apontador||'',fotos:(day.fotos||[]).filter(p=>p.url).map(p=>p.url).join('\n'),rdoNum:day.rdoNum||'',registroCompleto:JSON.parse(JSON.stringify(day))};}
async function gerAction(button,fn){button.disabled=true;try{const result=await fn();toast(result||'Operação concluída.');}catch(e){toast(e.message||'Falha na operação.');}finally{button.disabled=false;}}
window.addEventListener('DOMContentLoaded',()=>{
 state.obra={...state.obra,...parent.GerenciamentoModules.getWork(__obraId)};atualizarHeader();
 const section=document.createElement('section');section.className='section';section.innerHTML=`<div class="section-title"><div class="section-title-text">Identificação, observações e fotos</div></div><div class="ger-grid">${[['localObra','Local da obra'],['descricaoLocal','Descrição do local'],['apontador','Apontador'],['rdoNum','RDO Nº']].map(([key,label])=>`<label>${label}<input id="ger-${key}" maxlength="500"></label>`).join('')}</div><label>Observações do dia<textarea id="ger-observacoes"></textarea></label><label>Fotos do diário<input type="file" id="ger-fotos" accept="image/jpeg,image/png,image/webp" multiple></label><div id="ger-photo-list" class="ger-photos"></div>`;
 const save=document.querySelector('[onclick="salvarDiarioDia(true)"]');save.before(section);gerExtraKeys.forEach(k=>document.getElementById('ger-'+k).oninput=e=>{currentDay[k]=e.target.value;salvarDiarioDia(false);});document.getElementById('ger-fotos').onchange=e=>gerPhotos(e.target.files);gerFillExtra();
 const services=document.createElement('section');services.className='section';services.innerHTML=`<div class="section-title"><div class="section-title-text">Planilha, arquivos e consulta aos dados</div></div><p class="ger-local">Usa somente o serviço próprio configurado em Conexões. As fotos continuam disponíveis localmente.</p><div class="ger-actions"><button class="btn btn-primary" id="ger-cloud-save">Salvar diário na planilha</button><button class="btn btn-secondary" id="ger-cloud-photos">Enviar fotos para a nuvem</button><button class="btn btn-secondary" id="ger-cloud-backup">Backup na nuvem</button><button class="btn btn-secondary" id="ger-cloud-restore">Buscar último backup</button></div><label>Mês para consulta <input id="ger-query-month" type="month" value="${todayISO().slice(0,7)}"></label><button class="btn btn-secondary" id="ger-cloud-month">Consultar diários do mês</button><pre id="ger-cloud-result" style="white-space:pre-wrap;overflow-wrap:anywhere"></pre><label>Pergunta sobre os registros da obra<textarea id="ger-question" placeholder="Digite sua pergunta"></textarea></label><button class="btn btn-primary" id="ger-ask">Consultar IA</button><p id="ger-answer" style="white-space:pre-wrap"></p>`;
 document.getElementById('view-gerar').appendChild(services);
 const on=(id,fn)=>{const b=document.getElementById(id);b.onclick=()=>gerAction(b,fn);};
 on('ger-cloud-save',async()=>{salvarDiarioDia(false);await gerRequest('diario','salvar',gerBuildPayload());return 'Diário confirmado na planilha.';});
 on('ger-cloud-photos',async()=>{if(!currentDay.fotos?.length)throw Error('Adicione fotos primeiro.');for(const p of currentDay.fotos.filter(p=>!p.url)){const result=await gerRequest('foto','salvar',{path:'foto',obra:state.obra.nome,data:currentDay.data,base64:p.dataUrl.split(',')[1],mime:p.mime,nome:p.name});p.url=result.url;p.fileId=result.fileId;salvarDiarioDia(false);}return 'Fotos confirmadas na nuvem.';});
 on('ger-cloud-backup',async()=>{await gerRequest('backup','salvar',{path:'backup',obra:state.obra.nome,conteudo:JSON.stringify({state,history,versao:'Gerenciamento-0.2'})});return 'Backup confirmado na nuvem.';});
 on('ger-cloud-restore',async()=>{const d=await gerRequest('backup','buscar-ultimo');if(!d.conteudo)throw Error('Nenhum backup encontrado.');const backup=JSON.parse(d.conteudo);if(!backup.state||!backup.history)throw Error('Backup inválido.');if(!confirm('Restaurar o backup encontrado? Uma cópia atual será exportada antes.'))return 'Restauração cancelada.';exportarBackup(true);state=mergeDefaults(backup.state);history=backup.history;saveState();saveHistory();initCurrentDay(todayISO());return 'Backup restaurado.';});
 on('ger-cloud-month',async()=>{const month=document.getElementById('ger-query-month').value;const d=await gerRequest('diario','lista-mes',{mes:month});document.getElementById('ger-cloud-result').textContent=JSON.stringify(d.diarios||[],null,2);return 'Consulta concluída.';});
 on('ger-ask',async()=>{const pergunta=document.getElementById('ger-question').value.trim();if(!pergunta)throw Error('Digite uma pergunta.');const d=await gerRequest('ia','perguntar',{pergunta});document.getElementById('ger-answer').textContent=d.resposta||'Sem resposta.';return 'Consulta concluída.';});
});
