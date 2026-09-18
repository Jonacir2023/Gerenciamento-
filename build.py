"""Gera HTML portátil com os módulos funcionais, sem dependências externas de execução."""
from pathlib import Path
import json
root = Path(__file__).resolve().parent
shell = (root / 'src/shell.html').read_text()
for marker, filename in [('/*STYLE*/', 'style.css'), ('/*CORE*/', 'core.js'), ('/*APP*/', 'app.js')]:
    shell = shell.replace(marker, (root / 'src' / filename).read_text())
theme=(root/'src/modules/theme.css').read_text()
common=(root/'src/modules/common.js').read_text()
extra=(root/'src/modules/diary-extra.js').read_text()
vendor=(root/'src/vendor/html2canvas-1.4.1.min.js').read_text()
documents={}
for kind in ['checkin','pauta','diario']:
    html=(root/'src/modules'/f'{kind}.html').read_text()
    html=html.replace('<!--GER-THEME-->','<style>'+theme+'</style>').replace('<!--GER-COMMON-->','<script>'+common+'</script>')
    html=html.replace('<script src="__VENDOR_HTML2CANVAS__"></script>','<script>'+vendor+'</script>')
    html=html.replace('<!--GER-DIARY-EXTRA-->','<script>'+extra+'</script>')
    documents[kind]=html
modules='const MODULE_DOCUMENTS='+json.dumps(documents,ensure_ascii=True).replace('<','\\u003c')+';\n'+(root/'src/modules-host.js').read_text()
shell=shell.replace('/*MODULES*/',modules)
(root / 'dist').mkdir(exist_ok=True)
(root / 'dist/Gerenciamento.html').write_text(shell)
(root / 'dist/index.html').write_text(shell)
print('Gerenciamento 0.2.0 gerado com todos os módulos incorporados:',len(shell.encode()),'bytes')
