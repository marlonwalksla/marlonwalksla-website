# Copies postcard-forms.css (the "reply postcard" look for booking and inquiry cards) into the embeds that need it
# outside Home: the Private page form intro and the Team page calendar. Home gets it through build_home_hero.py.
# Kept out of global-vars.css on purpose: that file is live on marlonwalksla.com as soon as it is pushed.
import re
CSS = open("postcard-forms.css", encoding="utf-8").read()
BLOCK = ('<!-- PC-FORMS:START (built by build_postcard_forms.py from postcard-forms.css) -->\n'
         '<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap" rel="stylesheet">\n'
         '<style>\n' + CSS + '</style>\n<!-- PC-FORMS:END -->')
for name in ("private-form-intro.html", "team-cal.html"):
    s = open(name, encoding="utf-8").read()
    if "<!-- PC-FORMS:START" in s:
        s = re.sub(r"<!-- PC-FORMS:START.*?<!-- PC-FORMS:END -->", lambda m: BLOCK, s, flags=re.S)
    else:
        s = s.rstrip() + "\n" + BLOCK + "\n"
    open(name, "w", encoding="utf-8").write(s)
    print("wrote", name, len(s))
