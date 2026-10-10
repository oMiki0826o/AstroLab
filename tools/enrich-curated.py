#!/usr/bin/env python3
"""File: enrich-curated.py
Modification: 2026-10-11 - Migrated practical finding guidance and relationships.
"""
import json
from pathlib import Path
path=Path(__file__).resolve().parent.parent/'content/astro/catalog.json'
entries=json.loads(path.read_text())
data={
'm31':('先由仙后座或秋季四邊形辨認仙女座，沿星鏈尋找橢圓形淡光斑。','Find the Andromeda star chain from Cassiopeia or the Great Square.',['m33']),
'm42':('找到獵戶座腰帶後往南移至劍部，中間朦朧的亮斑就是 M42。','Find Orion’s Belt, then look south along the sword for the nebula.',['betelgeuse','rigel','ngc2024']),
'm45':('冬季在金牛座附近尋找一小群肉眼可辨的明亮藍白色恆星。','Look for a compact group of bright stars in Taurus in winter.',['m1']),
'm8':('夏季在南方人馬座茶壺附近，沿銀河帶尋找大型星雲。','Follow the summer Milky Way near the Sagittarius Teapot.',['m20','m17']),
'm13':('先找武仙座四邊形，使用低倍率搜尋邊緣附近的球狀星團。','Find the Hercules Keystone, then sweep at low magnification.',['vega']),
'm27':('由牛郎星向北找狐狸座，低倍定位後再放大。','Start near Altair and move north toward Vulpecula.',['altair','m57']),
'm57':('在天琴座平行四邊形的兩顆星之間搜尋；高倍率較易分辨輪廓。','Find the target between the two lower stars of the Lyra parallelogram.',['vega','m27']),
'ngc7000':('由天津四附近向東側搜尋，大視野與窄頻濾鏡較合適。','Search east of Deneb; a wide field and narrowband filters help.',['ngc6960','ngc6992']),
'm1':('先找金牛座，使用星圖從金牛座 ζ 星附近精確跳轉。','Use a detailed chart near Zeta Tauri in Taurus.',['m45']),
'm20':('找到 M8 後往北移動，在同一片夏季銀河區域搜尋。','After finding M8, move north along the summer Milky Way.',['m8','m17']),
'm51':('從北斗七星斗柄末端的常陳一附近向南搜尋。','Sweep south from Alkaid at the end of the Big Dipper handle.',['m101']),
'm81':('在大熊座方向以低倍率找 M81 與 M82 這對鄰近星系。','Sweep Ursa Major for the nearby M81–M82 pair.',['m82']),
'm82':('先定位 M81，再找附近細長的 M82。','Find M81 first and then seek the thin M82 galaxy nearby.',['m81']),
'm16':('沿人馬座北側的夏季銀河向北移動，接近 M17 一帶。','Move north from Sagittarius along the summer Milky Way, beyond M17.',['m17','m20']),
'm17':('從 M8 沿銀河向北，依序經過 M20、M16 附近。','Travel north from M8 along the Milky Way near M20 and M16.',['m8','m20','m16']),
'm33':('由仙女座往南找三角座，低表面亮度需要良好暗空。','Look south of Andromeda toward Triangulum; dark skies are important.',['m31']),
'm101':('由北斗七星斗柄附近向外移動，須搭配可靠星圖。','Work outward from the Big Dipper handle with a reliable finder chart.',['m51']),
'ngc2024':('靠近獵戶座腰帶東側的參宿一，注意旁邊的 IC 434。','Look immediately beside Alnitak near the eastern end of Orion’s Belt.',['ic434','b33','m42']),
'ic434':('參宿一附近的 Hα 發射星雲，馬頭暗星雲 B33 是前景不同天體。','An H-alpha emission region near Alnitak; the dark Horsehead B33 is distinct.',['b33','ngc2024']),
'b33':('馬頭暗星雲 B33 位在 IC 434 前方，需要專業星圖與攝影設備定位。','The dark cloud B33 lies in front of IC 434; imaging gear and a finder chart help.',['ic434','ngc2024']),
'ic1805':('在仙后座附近搜尋，與 IC 1848 常合併規劃廣角構圖。','Near Cassiopeia; often framed with IC 1848.',['ic1848']),
'ic1848':('在心臟星雲 IC 1805 一旁，適合廣角構圖。','Look beside Heart Nebula IC 1805 for wide-field framing.',['ic1805']),
'ngc869':('從仙后座沿銀河向英仙座移動；與 NGC 884 同框。','Move along the Milky Way from Cassiopeia toward Perseus.',['ngc884']),
'ngc884':('與 NGC 869 相鄰，可用雙筒望遠鏡同時觀察。','View it close to NGC 869, often in the same binocular field.',['ngc869']),
'procyon':('冬季大三角的一角，從獵戶座向東尋找。','Part of the Winter Triangle, east of Orion.',['sirius','betelgeuse']),
'altair':('夏季大三角的一角，位於天鷹座。','One corner of the Summer Triangle in Aquila.',['vega']),
'polaris':('沿北斗七星斗口兩星向北延長約五倍距離。','Extend a line from the Big Dipper pointer stars.',['mizar']),
'vega':('夏季大三角中明亮的藍白色恆星，位於天琴座。','The bright blue-white star in Lyra and the Summer Triangle.',['altair','m57']),
}
for obj in entries:
    key=obj['id']
    if key in data:
        zh,en,rel=data[key]
    else:
        zh=f'先確認{obj["constellation"]["zh-TW"]}的主要亮星，再使用 J2000 座標與獨立星圖核對位置。'
        en=f'Identify {obj["constellation"]["en"]}, then verify this J2000 position with an independent sky chart.'
        rel=[]
    obj['guide']={'zh-TW':zh,'en':en}
    obj['related']=rel
path.write_text(json.dumps(entries,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
print(f'enriched {len(entries)} entries')
