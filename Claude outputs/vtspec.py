"""Verbatempus 2.0 reconciled phrasing spec - reference generator.
Single source of truth: emits every phrase for all 1440 minutes x 4 levels.
"""
ONES=["","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve",
      "thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"]
TENS=["","","twenty","thirty","forty","fifty"]
def n2w(n):
    if n<20: return ONES[n]
    t,o=divmod(n,10)
    return f"{TENS[t]} {ONES[o]}" if o else TENS[t]

HOURWORD={0:"midnight",12:"noon"}
def hour_word(h):                       # h in 0..23
    if h%24 in HOURWORD: return HOURWORD[h%24]
    return ONES[h%12 if h%12 else 12]
def is_landmark_hour(h): return h%24 in (0,12)
def suffix(h):
    h%=24
    if 1<=h<=11:  return "in the morning"
    if 13<=h<=16: return "in the afternoon"
    if 17<=h<=23: return "in the evening"
    return ""                            # 0 and 12 carry no suffix
def meridiem(h): return "" if is_landmark_hour(h) else ("am" if h%24<12 else "pm")

def tail(h, oclock):
    """hour phrase for verbose/lengthy: '<word> oclock <suffix>' or bare landmark"""
    if is_landmark_hour(h): return hour_word(h)
    parts=[hour_word(h)]
    if oclock: parts.append("oclock")
    s=suffix(h)
    if s: parts.append(s)
    return " ".join(parts)

def minword_past(m):                     # 15 and 30 get names
    if m==15: return "a quarter"
    if m==30: return "half"
    return n2w(m)
def minword_to(r):
    if r==15: return "a quarter"
    return n2w(r)

def verbose(h,m):
    nh=(h+1)%24
    if m==0:  return f"it is {tail(h,True)}"
    if m<=10:
        u="minute" if m==1 else "minutes"
        return f"it is {n2w(m)} {u} after {tail(h,True)}"
    if m<=44:
        if m in (15,30): return f"it is {minword_past(m)} past {tail(h,True)}"
        return f"it is {n2w(m)} minutes past {tail(h,True)}"
    r=60-m
    if r in (10,5) and is_landmark_hour(nh):      # TILL only toward midnight/noon
        return f"it is {n2w(r)} till {tail(nh,True)}"
    if r==15: return f"it is a quarter to {tail(nh,True)}"
    u="minute" if r==1 else "minutes"
    return f"it is {n2w(r)} {u} to {tail(nh,True)}"

def lengthy(h,m):
    nh=(h+1)%24
    if m==0:  return f"it is {tail(h,False)}"
    if m<=10: return f"it is {n2w(m)} after {tail(h,False)}"
    if m<=44:
        if m in (15,30): return f"it is {minword_past(m)} past {tail(h,False)}"
        return f"it is {n2w(m)} past {tail(h,False)}"
    r=60-m
    if r in (10,5) and is_landmark_hour(nh):
        return f"it is {n2w(r)} till {tail(nh,False)}"
    if r==15: return f"it is a quarter to {tail(nh,False)}"
    return f"it is {n2w(r)} to {tail(nh,False)}"

# ---- SHORT: landmark + band table -------------------------------------------
# landmarks :00 :05 :10 :15 :30 :45 :50 :55 ; linger 5 after :15/:45, 10 after :30
# just-about = final 1 minute ; :50/:55 approach words point at the hour
def short_label(h,m):
    nh=(h+1)%24
    def L(x,nxt=False):
        hh=nh if nxt else h
        mer=meridiem(hh)
        return (f"{x} {hour_word(hh)}"+(f" {mer}" if mer else "")).strip() if x else \
               (f"{hour_word(hh)}"+(f" {mer}" if mer else "")).strip()
    hourP=L("");  nextP=(lambda: (f"{hour_word(nh)}"+(f" {meridiem(nh)}" if meridiem(nh) else "")).strip())()
    if m==0:            return hourP
    if m<=4:            return f"just after {hourP}"
    if m==5:            return f"five past {hourP}"
    if m<=8:            return f"almost ten past {hourP}"
    if m==9:            return f"just about ten past {hourP}"
    if m==10:           return f"ten past {hourP}"
    if m<=13:           return f"almost quarter past {hourP}"
    if m==14:           return f"just about quarter past {hourP}"
    if m<=19:           return f"quarter past {hourP}"
    if m<=28:           return f"almost half past {hourP}"
    if m==29:           return f"just about half past {hourP}"
    if m<=39:           return f"half past {hourP}"
    if m<=43:           return f"almost quarter to {nextP}"
    if m==44:           return f"just about quarter to {nextP}"
    if m<=49:           return f"quarter to {nextP}"
    if m==50:           return f"ten to {nextP}"
    if m<=53:           return f"almost {nextP}"
    if m==54:           return f"just about {nextP}"
    if m==55:           return f"five to {nextP}"
    if m<=58:           return f"almost {nextP}"
    return f"just about {nextP}"
def short(h,m): return "it is "+short_label(h,m)

# ---- TERSE ------------------------------------------------------------------
def terse(h,m):
    nh=(h+1)%24; cur=hour_word(h); nxt=hour_word(nh)
    if m==0:   return f"its {cur}"
    if m<=5:   return f"its just after {cur}"
    if m<=14:  return f"its after {cur}"
    if m<=24:  return f"its quarter after {cur}"
    if m<=39:  return f"its half past {cur}"
    if m<=49:  return f"its quarter to {nxt}"
    return f"its almost {nxt}"

LEVELS={"verbose":verbose,"lengthy":lengthy,"short":short,"terse":terse}
