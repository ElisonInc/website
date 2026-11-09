#!/usr/bin/env python3
"""Generate a coordinated family of JPEG social preview cards (1200x630)."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import random

W,H=1200,630
INK=(30,29,28); COPPER=(173,69,29); PAPER=(244,238,225)
SERIF='/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'
SERIF_IT='/usr/share/fonts/truetype/dejavu/DejaVuSerif-Italic.ttf'
SANS='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
OUT=Path('assets/og'); OUT.mkdir(parents=True,exist_ok=True)

CARDS={
 'home':{'lines':[('Independent thinking.',69,INK),('Working products.',77,COPPER)],'subtitle':'AI, media, music, and original digital ventures.','footer':'DEVHOUSE AI  /  SHORTHOUSE  /  ELISON  /  SONGSPLIT'},
 'consulting':{'lines':[('Founder-led',91,INK),('technology consulting.',68,COPPER)],'subtitle':'Strategy, AI workflows, websites, and execution.','footer':'DISCOVERY CALLS  /  PAID STRATEGY  /  INFO@ELISONINC.COM'},
 'shorthouse':{'lines':[('ShortHouse',115,INK)],'subtitle':'Original vertical drama, built for mobile audiences.','footer':'B2 IN PRODUCTION  /  PLATFORM PRE-LAUNCH','label':'SHORTHOUSE  /  PROJECT STUDY'},
 'devhouse':{'lines':[('DevHouse',113,INK),('AI front office.',70,COPPER)],'subtitle':'Workflows for home-service contractors.','footer':'WEBSITES  /  BOOKING  /  CRM FOLLOW-UP  /  VOICE AI','label':'DEVHOUSE AI  /  PROJECT STUDY'},
 'privacy':{'lines':[('Privacy &',100,INK),('contact data.',89,COPPER)],'subtitle':'How inquiries, bookings, and third parties are handled.','footer':'INQUIRIES ROUTE TO INFO@ELISONINC.COM'}
}

def font(path,size): return ImageFont.truetype(path,size)
def shrink(d,text,target_size,max_width,path=SERIF):
 s=target_size
 while s>20 and d.textbbox((0,0),text,font=font(path,s))[2]>max_width: s-=2
 return font(path,s)

def card(kind,opt):
 rng=random.Random(2206)
 base=Image.new('RGB',(W,H),PAPER)
 pix=base.load()
 for y in range(H):
  for x in range(W):
   n=rng.randrange(-4,5)
   pix[x,y]=tuple(max(0,min(255,c+n)) for c in PAPER)
 d=ImageDraw.Draw(base,'RGBA')
 sx,sy,r=1120,240,224
 for rr in range(r,3,-1):
  k=(r-rr)/r
  color=(194-int(35*k),82-int(21*k),38-int(9*k),218)
  d.ellipse((sx-rr,sy-rr,sx+rr,sy+rr),fill=color)
 for base_y,color,seed in [
  (382,(177,170,158,100),3),
  (430,(137,131,123,145),17),
  (465,(80,77,73,160),37),
  (502,(44,42,40,210),55)]:
  rnd=random.Random(seed)
  pts=[(-20,H)]
  for x in range(-20,W+100,42):
   envelope=(max(0,x)/W)**1.25
   h=base_y-envelope*125+rnd.randint(-16,16)
   pts.append((x,int(h)))
  pts +=[(W+40,H)]
  d.polygon(pts,fill=color)
 fog=Image.new('RGBA',(W,H),(0,0,0,0))
 fd=ImageDraw.Draw(fog,'RGBA')
 for i in range(24):
  y=475+i*5
  fd.rectangle((0,y,W,y+4),fill=(244,238,225,int(14+2*i)))
 fog=fog.filter(ImageFilter.GaussianBlur(18))
 base=Image.alpha_composite(base.convert('RGBA'),fog)
 fade=Image.new('RGBA',(W,H),(0,0,0,0))
 fdraw=ImageDraw.Draw(fade,'RGBA')
 for y in range(464,H):
  t=(y-464)/(H-464)
  a=int(252*min(1,t**0.78))
  fdraw.line((0,y,W,y),fill=(*PAPER,a),width=1)
 base=Image.alpha_composite(base,fade)
 d=ImageDraw.Draw(base)
 d.line((64,48,75,31),fill=COPPER,width=7)
 d.text((91,29),'Elison Inc.',font=font(SERIF,33),fill=INK)
 if opt.get('label'):
  d.text((64,116),opt['label'],font=font(SANS,13),fill=COPPER)
 headline_y=145 if not opt.get('label') else 175
 for line,size,color in opt['lines']:
  f=shrink(d,line,size,1085)
  d.text((64,headline_y),line,font=f,fill=color)
  headline_y+=int(f.size*.99)+4
 subfont=shrink(d,opt['subtitle'],30,1010,SERIF_IT)
 d.text((67,headline_y+9),opt['subtitle'],font=subfont,fill=INK)
 footfont=shrink(d,opt['footer'],17,1080,SANS)
 d.rectangle((64,554,1136,555),fill=(150,120,96))
 d.text((65,567),opt['footer'],font=footfont,fill=INK)
 out=OUT/f'og-{kind}.jpg'
 base.convert('RGB').save(out,'JPEG',quality=88,optimize=True,progressive=True,subsampling=0)
 print(out,out.stat().st_size)

if __name__=='__main__':
 for kind,conf in CARDS.items(): card(kind,conf)
