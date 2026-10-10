#!/usr/bin/env python3
"""File: build-curated.py
Modification: 2026-10-11 - One-off migration of curated legacy catalogue entries.
"""
import json
from pathlib import Path

# id | zh name | en name | type | constellation zh | constellation en | RA | Dec | magnitude | size | distance | aliases
rows = '''m31|仙女座星系|Andromeda Galaxy|galaxy|仙女座|Andromeda|00:42:44|+41:16|3.44|3.2° × 1.0°|254 萬光年|NGC 224
m42|獵戶座大星雲|Orion Nebula|nebula|獵戶座|Orion|05:35:17|-05:23|4|65′ × 60′|1,340 光年|NGC 1976
m45|昴宿星團|Pleiades|cluster|金牛座|Taurus|03:47:24|+24:07|1.6|110′|444 光年|七姊妹星團
m8|礁湖星雲|Lagoon Nebula|nebula|人馬座|Sagittarius|18:03:37|-24:23|6|90′ × 40′|4,100 光年|NGC 6523
m13|武仙座大球狀星團|Great Hercules Cluster|cluster|武仙座|Hercules|16:41:41|+36:27|5.8|20′|25,000 光年|NGC 6205
m27|啞鈴星雲|Dumbbell Nebula|planetary|狐狸座|Vulpecula|19:59:37|+22:43|7.5|8′ × 6′|1,360 光年|NGC 6853
m57|環狀星雲|Ring Nebula|planetary|天琴座|Lyra|18:53:35|+33:02|8.8|1.4′|2,300 光年|NGC 6720
ngc7000|北美星雲|North America Nebula|nebula|天鵝座|Cygnus|20:59:17|+44:31|4|120′ × 100′|2,590 光年|Caldwell 20
sirius|天狼星|Sirius|star|大犬座|Canis Major|06:45:09|-16:42|-1.46|—|8.6 光年|Alpha Canis Majoris
vega|織女星|Vega|star|天琴座|Lyra|18:36:56|+38:47|0.03|—|25 光年|Alpha Lyrae
betelgeuse|參宿四|Betelgeuse|star|獵戶座|Orion|05:55:10|+07:24|0.5|—|約 640 光年|Alpha Orionis
rigel|參宿七|Rigel|star|獵戶座|Orion|05:14:32|-08:12|0.13|—|約 860 光年|Beta Orionis
polaris|北極星|Polaris|star|小熊座|Ursa Minor|02:31:49|+89:16|1.98|—|約 433 光年|Alpha Ursae Minoris
antares|心宿二|Antares|star|天蠍座|Scorpius|16:29:24|-26:26|0.96|—|約 550 光年|Alpha Scorpii
m1|蟹狀星雲|Crab Nebula|remnant|金牛座|Taurus|05:34:32|+22:01|8.4|6′ × 4′|6,500 光年|NGC 1952
m20|三裂星雲|Trifid Nebula|nebula|人馬座|Sagittarius|18:02:23|-23:02|6.3|28′|5,200 光年|NGC 6514
m51|渦狀星系|Whirlpool Galaxy|galaxy|獵犬座|Canes Venatici|13:29:53|+47:12|8.4|11′ × 7′|2,300 萬光年|NGC 5194
m81|波德星系|Bode's Galaxy|galaxy|大熊座|Ursa Major|09:55:33|+69:04|6.9|27′ × 14′|1,170 萬光年|NGC 3031
m82|雪茄星系|Cigar Galaxy|galaxy|大熊座|Ursa Major|09:55:52|+69:40|8.4|11′ × 5′|1,150 萬光年|NGC 3034
m16|鷹星雲|Eagle Nebula|nebula|巨蛇座|Serpens|18:18:48|-13:47|6.4|35′|7,000 光年|NGC 6611
m17|奧米加星雲|Omega Nebula|nebula|人馬座|Sagittarius|18:20:48|-16:11|6|46′ × 37′|5,500 光年|NGC 6618,Swan Nebula
m33|三角座星系|Triangulum Galaxy|galaxy|三角座|Triangulum|01:33:50|+30:39|5.72|73′ × 45′|273 萬光年|NGC 598
m101|風車星系|Pinwheel Galaxy|galaxy|大熊座|Ursa Major|14:03:13|+54:20|7.9|29′ × 27′|2,100 萬光年|NGC 5457
ngc1499|加州星雲|California Nebula|nebula|英仙座|Perseus|04:03:18|+36:22|6|145′ × 40′|1,000 光年|Sh2-220
ngc2024|火焰星雲|Flame Nebula|nebula|獵戶座|Orion|05:41:54|-01:51|10|30′|1,400 光年|Sh2-277
ic434|IC 434 發射星雲|IC 434 Emission Nebula|nebula|獵戶座|Orion|05:41:00|-02:27||60′ × 10′|1,375 光年|IC 434
b33|馬頭星雲|Horsehead Nebula|dark|獵戶座|Orion|05:40:59|-02:28||8′ × 6′|1,375 光年|Barnard 33,Horsehead
ic1805|心臟星雲|Heart Nebula|nebula|仙后座|Cassiopeia|02:33:00|+61:27||150′|7,500 光年|Sh2-190
ic1848|胎兒星雲|Soul Nebula|nebula|仙后座|Cassiopeia|02:51:00|+60:26||150′|7,500 光年|Sh2-199
ngc6992|東面紗星雲|Eastern Veil Nebula|remnant|天鵝座|Cygnus|20:56:19|+31:43||70′ × 6′|2,400 光年|Veil Nebula East
ngc6960|西面紗星雲|Western Veil Nebula|remnant|天鵝座|Cygnus|20:45:38|+30:43||210′ × 3′|2,400 光年|Witch's Broom
ngc869|英仙座 h 星團|Double Cluster h|cluster|英仙座|Perseus|02:19:00|+57:08|5.3|30′|7,600 光年|Caldwell 14
ngc884|英仙座 χ 星團|Double Cluster chi|cluster|英仙座|Perseus|02:22:00|+57:07|6.1|30′|7,500 光年|Caldwell 23
ngc2392|小丑星雲|Clown Nebula|planetary|雙子座|Gemini|07:29:11|+20:55|9.2|48″|6,500 光年|Eskimo Nebula
ngc4565|針狀星系|Needle Galaxy|galaxy|后髮座|Coma Berenices|12:36:21|+25:59|9.6|16′ × 2′|4,200 萬光年|Caldwell 38
mizar|開陽星|Mizar|star|大熊座|Ursa Major|13:23:55|+54:55|2.23|—|78 光年|Zeta Ursae Majoris
procyon|北河三|Procyon|star|小犬座|Canis Minor|07:39:18|+05:13|0.34|—|11.5 光年|Alpha Canis Minoris
altair|牛郎星|Altair|star|天鷹座|Aquila|19:50:47|+08:52|0.77|—|16.7 光年|Alpha Aquilae
arcturus|大角星|Arcturus|star|牧夫座|Bootes|14:15:40|+19:11|-0.05|—|36.7 光年|Alpha Bootis
spica|角宿一|Spica|star|室女座|Virgo|13:25:12|-11:09|0.98|—|250 光年|Alpha Virginis'''

def deg_ra(v):
    h,m,s=map(int,v.split(':'))
    return round(15*(h+m/60+s/3600), 8)

def deg_dec(v):
    sign = -1 if v.startswith('-') else 1
    d,m=map(int,v[1:].split(':'))
    return round(sign*(d+m/60), 8)

items=[]
for line in rows.splitlines():
    id,zh,en,kind,zhconst,enconst,ra,dec,mag,size,distance,aliases=line.split('|')
    items.append({
        'id':id,'name':{'zh-TW':zh,'en':en},'aliases':[a.strip() for a in aliases.split(',') if a.strip()],
        'type':kind,'constellation':{'zh-TW':zhconst,'en':enconst},
        'raDeg':deg_ra(ra),'decDeg':deg_dec(dec),'epoch':'J2000',
        'magnitude':float(mag) if mag else None,'angularSize':size,'distance':distance,
        'dataStatus':'needs-review', 'source':'AstroLab legacy curated data',
    })
path=Path(__file__).resolve().parent.parent/'content/astro/catalog.json'
path.write_text(json.dumps(items,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print(f'Wrote {len(items)} unique migrated entries')
