#!/bin/bash

# Inicia servidor HTTP local para testes
cd dist
python3 -m http.server 8765 > /tmp/server.log 2>&1 &
SERVER_PID=$!
sleep 1

echo "✓ Servidor em http://localhost:8765"
echo "✓ PID: $SERVER_PID"
echo "✓ Logs: /tmp/server.log"

# Cria script Puppeteer para teste headless
cat > /tmp/test-gerenciamento.js << 'PUPPETEER'
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: 'new'});
  const page = await browser.newPage();
  
  // Configurar console log
  page.on('console', msg => console.log(`[BROWSER] ${msg.text()}`));
  page.on('error', err => console.error(`[ERROR] ${err}`));
  
  try {
    console.log('\n=== TESTE 1: Carregamento ===');
    await page.goto('http://localhost:8765/Gerenciamento.html', {waitUntil: 'networkidle2', timeout: 10000});
    console.log('✓ Página carregada');
    
    // Aguarda IndexedDB iniciado
    await page.waitForTimeout(2000);
    
    console.log('\n=== TESTE 2: Interface Shell ===');
    const hasShell = await page.evaluate(() => {
      return document.querySelector('[id="shell"]') !== null || 
             document.querySelector('.sidebar') !== null ||
             document.querySelector('nav') !== null;
    });
    console.log(hasShell ? '✓ Shell/navegação encontrada' : '✗ Shell/navegação ausente');
    
    console.log('\n=== TESTE 3: Seletor de Obras ===');
    const hasObraSelect = await page.evaluate(() => {
      return document.querySelector('[id*="obra"]') !== null ||
             document.querySelector('select') !== null ||
             document.body.innerText.includes('Selecione uma obra');
    });
    console.log(hasObraSelect ? '✓ Seletor de obras encontrado' : '✗ Seletor de obras ausente');
    
    console.log('\n=== TESTE 4: Módulos Acessíveis ===');
    const modules = await page.evaluate(() => {
      const result = {};
      result.pauta = document.querySelector('[id*="pauta"]') !== null;
      result.checkin = document.querySelector('[id*="checkin"]') !== null;
      result.diario = document.querySelector('[id*="diario"]') !== null;
      result.abas = document.querySelectorAll('[role="tab"], .tab, [class*="tab"]').length;
      return result;
    });
    console.log(`Pauta: ${modules.pauta ? '✓' : '✗'}, Check-in: ${modules.checkin ? '✓' : '✗'}, Diário: ${modules.diario ? '✓' : '✗'}, Abas: ${modules.abas}`);
    
    console.log('\n=== TESTE 5: IndexedDB ===');
    const dbStatus = await page.evaluate(() => {
      return new Promise((resolve) => {
        const req = indexedDB.databases ? indexedDB.databases() : null;
        if (req && req.then) {
          req.then(dbs => resolve(dbs.map(db => db.name))).catch(() => resolve(['IndexedDB indisponível']));
        } else {
          resolve(['API databases() não suportada']);
        }
      });
    });
    console.log(`Bancos: ${dbStatus.join(', ')}`);
    
    console.log('\n=== TESTE 6: Erro de Rede ou Script ===');
    const hasErrors = await page.evaluate(() => {
      return window.onerror !== null || (window.__errors && window.__errors.length > 0);
    });
    console.log(hasErrors ? '⚠ Possíveis erros JavaScript' : '✓ Sem erros evidentes');
    
    await page.close();
  } catch (err) {
    console.error(`[FATAL] ${err.message}`);
  }
  
  await browser.close();
  process.exit(0);
})();
PUPPETEER

# Tenta com Puppeteer (se instalado)
if command -v node &>/dev/null; then
  echo ""
  echo "=== TESTE HEADLESS COM PUPPETEER ==="
  npm list puppeteer >/dev/null 2>&1 && node /tmp/test-gerenciamento.js || echo "Puppeteer não disponível; teste manual necessário"
fi

kill $SERVER_PID 2>/dev/null
