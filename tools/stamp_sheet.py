# Preview sheet of every stamp with a center crosshair. Usage: python3 tools/stamp_sheet.py out.png (needs Playwright). Oct 24, 2026.
import sys, re, json, importlib
sys.path.insert(0,'' + __import__('os').path.join(__import__('os').path.dirname(__import__('os').path.abspath(__file__)), '..', 'page-embeds') + '')
import stamps
from playwright.sync_api import sync_playwright
names=[n for n in re.findall(r'if name == "(\w+)"', open('' + __import__('os').path.join(__import__('os').path.dirname(__import__('os').path.abspath(__file__)), '..', 'page-embeds') + '/stamps.py').read())]
cells=''
for i,n in enumerate(names):
    for year in ('',):
        s=stamps.stamp('s%d'%i,'DATE NIGHT','LA, YOUR WAY',n,year,'#7A3FA0')
        cells+=f'<div style="position:relative;width:190px;margin:6px;text-align:center;font:12px sans-serif">{s.replace("<svg ","<svg width=190 height=190 ",1)}<svg width=190 height=190 viewBox="0 0 200 200" style="position:absolute;left:0;top:0"><line x1="100" y1="0" x2="100" y2="200" stroke="red" stroke-width=".5"/><line x1="0" y1="100" x2="200" y2="100" stroke="red" stroke-width=".5"/></svg>{n}</div>'
html='<body style="margin:10px;background:#FFF3E4;display:flex;flex-wrap:wrap;width:1300px;font-family:Fredoka">'+cells
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':1320,'height':900}); pg.set_content(html); pg.wait_for_timeout(500); pg.screenshot(path=sys.argv[1],full_page=True); b.close()
