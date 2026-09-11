# CM01/02 Offsets Thread Notes

**Source:** https://champman0102.net/viewtopic.php?t=1540
**Total posts:** 764 across 31 pages
**Scraped:** 6 pages (150 posts) — partial coverage

---

## Page 1 (posts 1-25)

[Forums](https://champman0102.net/index.php "Forums")

# Championship Manager 2001/2002 Forums

Keeping the Game Alive

[Skip to content](https://champman0102.net/viewtopic.php?t=10635#start_here)

## [Database file read in](https://champman0102.net/viewtopic.php?t=10635)

We have provided installation instructions and FAQs for each of our downloads. Please take the time to read these then post in the relevant section if you have not found a solution for your issue.

**Moderator:** [Technical Support Team](https://champman0102.net/memberlist.php?mode=group&g=23)

[Post Reply](https://champman0102.net/posting.php?mode=reply&t=10635 "Post a reply")

- [Print view](https://champman0102.net/viewtopic.php?t=10635&view=print "Print view")

3 posts
• Page **1** of **1**

[jaymarvels](https://champman0102.net/memberlist.php?mode=viewprofile&u=90592)**Posts:** 2**Joined:** Sat Jul 13, 2024 8:27 pm

### [Database file read in](https://champman0102.net/viewtopic.php?p=160013\#p160013)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=160013 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=160013 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=160013#p160013 "Post") by **[jaymarvels](https://champman0102.net/memberlist.php?mode=viewprofile&u=90592)** » Thu May 21, 2026 2:37 am

Hi All,

Some of you may know me as one of the developers from the FMM community, mainly doing scout programs, save game editors and pre game editors.

I am posting this here as my first post seems to have vanished.

I have a little idea to do with CM0102 and have been looking into reading in the .dat files and I have a few questions - as I am "new" (lost my old account here) I cannot PM people directly.

I have looked at [https://github.com/archibalduk/TransferTool](https://github.com/archibalduk/TransferTool) which gives some great insight into what I am needing, but do have a couple of questions that I hope someone can help, this is specific around "Pregame" and not "saved games" :

\- I can see contract details are at staff level (which have actual "people", staff, players etc in at different pointers) what I cannot see are things like bonuses or clauses.

\- Are starting loans, injuries, retirements etc really all inside player\_setup.cfg ?

Are there any other gotcha's I should be aware of - probably an open ended question.

Thanks

[Here2Win79](https://champman0102.net/memberlist.php?mode=viewprofile&u=5734)Technical Support Team**Posts:** 4934**Joined:** Fri Dec 11, 2020 3:24 pm**Has thanked:** [2240 times](https://champman0102.net/app.php/thankslist/givens/5734/true)**Been thanked:** [2723 times](https://champman0102.net/app.php/thankslist/givens/5734/false)

### [Re: Database file read in](https://champman0102.net/viewtopic.php?p=160130\#p160130)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=160130 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=160130 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=160130#p160130 "Post") by **[Here2Win79](https://champman0102.net/memberlist.php?mode=viewprofile&u=5734)** » Fri May 22, 2026 11:09 pm

The answer to your second question is yes. When you say retirements I would clarify that it’s international retirements, I don’t think it’s manually possible to set a retire from (club) playing or staff position pre-game, the game engine drives that. And in game, no one ever retires from international duty, it’s just a pre game configurable option.

The main gotcha of the pre game editor that I’m aware of is don’t change anything whilst you have filters on, as this causes duplication errors so you can end up with additional ghost teams in leagues or duplicate players.

I think I’m also correct in saying that whenever you use the pre game editor it just randomly deletes some player histories, not sure of the how and why.

[jaymarvels](https://champman0102.net/memberlist.php?mode=viewprofile&u=90592)**Posts:** 2**Joined:** Sat Jul 13, 2024 8:27 pm

### [Re: Database file read in](https://champman0102.net/viewtopic.php?p=160138\#p160138)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=160138 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=160138 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=160138#p160138 "Post") by **[jaymarvels](https://champman0102.net/memberlist.php?mode=viewprofile&u=90592)** » Sat May 23, 2026 12:11 am

> [Here2Win79](https://champman0102.net/memberlist.php?mode=viewprofile&u=5734) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=160130#p160130) Fri May 22, 2026 11:09 pm
> The answer to your second question is yes. When you say retirements I would clarify that it’s international retirements, I don’t think it’s manually possible to set a retire from (club) playing or staff position pre-game, the game engine drives that. And in game, no one ever retires from international duty, it’s just a pre game configurable option.
>
> The main gotcha of the pre game editor that I’m aware of is don’t change anything whilst you have filters on, as this causes duplication errors so you can end up with additional ghost teams in leagues or duplicate players.
>
> I think I’m also correct in saying that whenever you use the pre game editor it just randomly deletes some player histories, not sure of the how and why.

Thanks for this, I am not actually talking about the pre game editor for CM0102 ![:)](https://champman0102.net/images/smilies/icon_e_smile.gif) \- I actually develop the pre game editor for the FMM series. My questions all surround CM0102 database files (.dat), reading these in and understanding some of the missing pieces e.g. contract bonus' and clauses, starting loans, injuries etc.

But appreciate someone replying to me!

[Post Reply](https://champman0102.net/posting.php?mode=reply&t=10635 "Post a reply")

- [Print view](https://champman0102.net/viewtopic.php?t=10635&view=print "Print view")

Display: All posts1 day7 days2 weeks1 month3 months6 months1 yearSort by: AuthorPost timeSubjectDirection: AscendingDescending

* * *

3 posts
• Page **1** of **1**

[Return to “Technical Support, Tutorials & FAQs”](https://champman0102.net/viewforum.php?f=43)

Jump to

- [The Website](https://champman0102.net/viewforum.php?f=71)
- [↳   Announcements](https://champman0102.net/viewforum.php?f=2)
- [↳   New Signings](https://champman0102.net/viewforum.php?f=7)
- [↳   Awards](https://champman0102.net/viewforum.php?f=5)
- [↳   Hall of Fame](https://champman0102.net/viewforum.php?f=88)
- [↳   Awards](https://champman0102.net/viewforum.php?f=90)
- [↳   Members](https://champman0102.net/viewforum.php?f=91)
- [↳   Stories](https://champman0102.net/viewforum.php?f=8)
- [Downloads](https://champman0102.net/viewforum.php?f=54)
- [↳   Downloads](https://champman0102.net/viewforum.php?f=57)
- [↳   Background Packs](https://champman0102.net/viewforum.php?f=79)
- [↳   Colour Schemes](https://champman0102.net/viewforum.php?f=78)
- [↳   Commentary Files](https://champman0102.net/viewforum.php?f=82)
- [↳   Databases](https://champman0102.net/viewforum.php?f=73)
- [↳   Documentation](https://champman0102.net/viewforum.php?f=80)
- [↳   Fonts](https://champman0102.net/viewforum.php?f=74)
- [↳   Game](https://champman0102.net/viewforum.php?f=76)
- [↳   Menubars](https://champman0102.net/viewforum.php?f=75)
- [↳   Patches](https://champman0102.net/viewforum.php?f=72)
- [↳   Tactics](https://champman0102.net/viewforum.php?f=81)
- [↳   Tactic Packs](https://champman0102.net/viewforum.php?f=84)
- [↳   Tools](https://champman0102.net/viewforum.php?f=77)
- [Technical Support, Tutorials & FAQs](https://champman0102.net/viewforum.php?f=13)
- [↳   Technical Support, Tutorials & FAQs](https://champman0102.net/viewforum.php?f=43)
- [↳   Tutorials](https://champman0102.net/viewforum.php?f=85)
- [The Office](https://champman0102.net/viewforum.php?f=3)
- [↳   Scouting and Research](https://champman0102.net/viewforum.php?f=34)
- [↳   Africa](https://champman0102.net/viewforum.php?f=37)
- [↳   Asia](https://champman0102.net/viewforum.php?f=38)
- [↳   Europe](https://champman0102.net/viewforum.php?f=52)
- [↳   North, Central America & Caribbean](https://champman0102.net/viewforum.php?f=53)
- [↳   Oceania](https://champman0102.net/viewforum.php?f=39)
- [↳   South America](https://champman0102.net/viewforum.php?f=40)
- [↳   Free Players and Staff](https://champman0102.net/viewforum.php?f=42)
- [↳   Histories](https://champman0102.net/viewforum.php?f=48)
- [↳   Research](https://champman0102.net/viewforum.php?f=41)
- [Championship Managers Club](https://champman0102.net/viewforum.php?f=11)
- [↳   Data Updates](https://champman0102.net/viewforum.php?f=33)
- [↳   General](https://champman0102.net/viewforum.php?f=26)
- [↳   Graphics](https://champman0102.net/viewforum.php?f=36)
- [↳   Network Games](https://champman0102.net/viewforum.php?f=27)
- [↳   Official Challenges](https://champman0102.net/viewforum.php?f=28)
- [↳   Patches](https://champman0102.net/viewforum.php?f=35)
- [↳   Stories](https://champman0102.net/viewforum.php?f=29)
- [↳   Tactics](https://champman0102.net/viewforum.php?f=30)
- [↳   Talents, Tips and Training](https://champman0102.net/viewforum.php?f=31)
- [↳   Other Championship Managers](https://champman0102.net/viewforum.php?f=32)
- [CM 01/02 Interactive](https://champman0102.net/viewforum.php?f=10)
- [↳   Championship Managers League](https://champman0102.net/viewforum.php?f=20)
- [↳   CM Forums United](https://champman0102.net/viewforum.php?f=21)
- [↳   Dream Team League](https://champman0102.net/viewforum.php?f=22)
- [↳   Trillionaires Toys](https://champman0102.net/viewforum.php?f=25)
- [The Community](https://champman0102.net/viewforum.php?f=9)
- [↳   Football](https://champman0102.net/viewforum.php?f=14)
- [↳   Gaming](https://champman0102.net/viewforum.php?f=15)
- [↳   General Chat](https://champman0102.net/viewforum.php?f=16)
- [↳   Other Sports](https://champman0102.net/viewforum.php?f=17)
- [↳   Soccer Manager](https://champman0102.net/viewforum.php?f=86)
- [↳   TV & Films](https://champman0102.net/viewforum.php?f=19)
- [Archives](https://champman0102.net/viewforum.php?f=87)
- [↳   Archives](https://champman0102.net/viewforum.php?f=83)

Powered by [phpBB](https://www.phpbb.com/) ® Forum Software © phpBB Limited

[Privacy](https://champman0102.net/ucp.php?mode=privacy "Privacy")
\|
[Terms](https://champman0102.net/ucp.php?mode=terms "Terms")

---

## Page 2 (posts 26-50)

[Forums](https://champman0102.net/index.php "Forums")

# Championship Manager 2001/2002 Forums

Keeping the Game Alive

[Skip to content](https://champman0102.net/viewtopic.php?t=1540#start_here)

## [Offsets](https://champman0102.net/viewtopic.php?t=1540)

**Moderator:** [Patch Team](https://champman0102.net/memberlist.php?mode=group&g=21)

[Post Reply](https://champman0102.net/posting.php?mode=reply&t=1540 "Post a reply")

- [Print view](https://champman0102.net/viewtopic.php?t=1540&view=print "Print view")

764 posts


- [Page **1** of **31**](https://champman0102.net/viewtopic.php?t=1540# "Click to jump to page…")










  - Jump to page:

- 1
- [2](https://champman0102.net/viewtopic.php?t=1540&start=25)
- [3](https://champman0102.net/viewtopic.php?t=1540&start=50)
- [4](https://champman0102.net/viewtopic.php?t=1540&start=75)
- [5](https://champman0102.net/viewtopic.php?t=1540&start=100)
- …
- [31](https://champman0102.net/viewtopic.php?t=1540&start=750)
- [Next](https://champman0102.net/viewtopic.php?t=1540&start=25)

[marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005)Youth Team Player**Posts:** 31**Joined:** Fri Nov 27, 2020 10:01 am**Has thanked:** [2 times](https://champman0102.net/app.php/thankslist/givens/2005/true)**Been thanked:** [6 times](https://champman0102.net/app.php/thankslist/givens/2005/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=6229\#p6229)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=6229 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=6229 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=6229#p6229 "Post") by **[marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005)** » Sat Nov 28, 2020 4:50 pm

didnt see such a thread here so lets get started ![:D](https://champman0102.net/images/smilies/icon_e_biggrin.gif)

[hodgy](https://champman0102.net/memberlist.php?mode=viewprofile&u=260)Hot Prospect for the Future**Posts:** 194**Joined:** Tue Nov 24, 2020 10:14 pm**Has thanked:** [110 times](https://champman0102.net/app.php/thankslist/givens/260/true)**Been thanked:** [60 times](https://champman0102.net/app.php/thankslist/givens/260/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=6286\#p6286)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=6286 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=6286 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=6286#p6286 "Post") by **[hodgy](https://champman0102.net/memberlist.php?mode=viewprofile&u=260)** » Sat Nov 28, 2020 9:13 pm

I believe it's being collated into something a little easier to navigate, then being moved over.

[![User avatar](https://champman0102.net/download/file.php?avatar=78_1632658985.jpg)](https://champman0102.net/memberlist.php?mode=viewprofile&u=78)

[Offside Trap](https://champman0102.net/memberlist.php?mode=viewprofile&u=78)Network Game Team**Posts:** 2953**Joined:** Sun May 10, 2020 7:42 pm**Has thanked:** [856 times](https://champman0102.net/app.php/thankslist/givens/78/true)**Been thanked:** [1597 times](https://champman0102.net/app.php/thankslist/givens/78/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=6295\#p6295)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=6295 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=6295 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=6295#p6295 "Post") by **[Offside Trap](https://champman0102.net/memberlist.php?mode=viewprofile&u=78)** » Sat Nov 28, 2020 10:33 pm

I must bookmark this sub folder - Offsets is key to retaining the game as close to real life as possible, I've a few to share, but Ill hold out until Nick gives the all clear, as he gave them to me

Find me on YouTube and enjoy CM related content - [https://www.youtube.com/channel/UCmoWKH ... wcF\_cLC70w](https://www.youtube.com/channel/UCmoWKHoM0y1YMwcF_cLC70w)

[John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338)Patch Team**Posts:** 326**Joined:** Wed Nov 25, 2020 12:26 am**Has thanked:** [175 times](https://champman0102.net/app.php/thankslist/givens/338/true)**Been thanked:** [169 times](https://champman0102.net/app.php/thankslist/givens/338/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=6325\#p6325)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=6325 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=6325 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=6325#p6325 "Post") by **[John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338)** » Sun Nov 29, 2020 12:03 pm

Offsets don't belong to the person that found them, so I think you should just post them.

[Mark](https://champman0102.net/memberlist.php?mode=viewprofile&u=2)Chairman**Posts:** 7953**Joined:** Mon Jan 20, 2020 12:12 pm**Has thanked:** [2343 times](https://champman0102.net/app.php/thankslist/givens/2/true)**Been thanked:** [2892 times](https://champman0102.net/app.php/thankslist/givens/2/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=6517\#p6517)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=6517 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=6517 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=6517#p6517 "Post") by **[Mark](https://champman0102.net/memberlist.php?mode=viewprofile&u=2)** » Mon Nov 30, 2020 3:45 pm

> [marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=6229#p6229) Sat Nov 28, 2020 4:50 pm
> didnt see such a thread here so lets get started ![:D](https://champman0102.net/images/smilies/icon_e_biggrin.gif)

[viewtopic.php?f=35&t=1395](https://champman0102.net/viewtopic.php?f=35&t=1395)

[marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005)Youth Team Player**Posts:** 31**Joined:** Fri Nov 27, 2020 10:01 am**Has thanked:** [2 times](https://champman0102.net/app.php/thankslist/givens/2005/true)**Been thanked:** [6 times](https://champman0102.net/app.php/thankslist/givens/2005/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=6650\#p6650)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=6650 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=6650 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=6650#p6650 "Post") by **[marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005)** » Tue Dec 01, 2020 1:49 pm

do any1 know ofssets where you can select leagues in new game?

e,g i copy\\paste russian league (all divisions + cup) and change 9CF values from russia to ukraine - how to add ukraine to starting screen?

[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)Hot Prospect for the Future**Posts:** 201**Joined:** Sun Nov 29, 2020 9:55 am**Has thanked:** [53 times](https://champman0102.net/app.php/thankslist/givens/3116/true)**Been thanked:** [59 times](https://champman0102.net/app.php/thankslist/givens/3116/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=6656\#p6656)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=6656 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=6656 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=6656#p6656 "Post") by **[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)** » Tue Dec 01, 2020 2:19 pm

To get Ukraine to display on the league selection screen change the 9CF code at offset 00668373 - pretty sure this is it. Saturn's league swap guide is the best to follow to make these league swaps easy.

[marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005)Youth Team Player**Posts:** 31**Joined:** Fri Nov 27, 2020 10:01 am**Has thanked:** [2 times](https://champman0102.net/app.php/thankslist/givens/2005/true)**Been thanked:** [6 times](https://champman0102.net/app.php/thankslist/givens/2005/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=6736\#p6736)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=6736 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=6736 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=6736#p6736 "Post") by **[marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005)** » Wed Dec 02, 2020 8:21 am

> [Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=6656#p6656) Tue Dec 01, 2020 2:19 pm
> To get Ukraine to display on the league selection screen change the 9CF code at offset 00668373 - pretty sure this is it. Saturn's league swap guide is the best to follow to make these league swaps easy.

but i dont want to **swap**, i want to **add** league ![:)](https://champman0102.net/images/smilies/icon_e_smile.gif)

[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)Hot Prospect for the Future**Posts:** 201**Joined:** Sun Nov 29, 2020 9:55 am**Has thanked:** [53 times](https://champman0102.net/app.php/thankslist/givens/3116/true)**Been thanked:** [59 times](https://champman0102.net/app.php/thankslist/givens/3116/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=6740\#p6740)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=6740 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=6740 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=6740#p6740 "Post") by **[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)** » Wed Dec 02, 2020 8:57 am

Ah. Okay, with you now. If you've managed to copy and paste all the russian league coding - well done!

For the league selection screen I would imagine it is the same area of code as that offset where you will need to add new code for Ukraine - doubt there's any room there though so you'd have to place it somewhere else and then it starts to get messy.

[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)Hot Prospect for the Future**Posts:** 201**Joined:** Sun Nov 29, 2020 9:55 am**Has thanked:** [53 times](https://champman0102.net/app.php/thankslist/givens/3116/true)**Been thanked:** [59 times](https://champman0102.net/app.php/thankslist/givens/3116/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=6759\#p6759)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=6759 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=6759 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=6759#p6759 "Post") by **[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)** » Wed Dec 02, 2020 10:25 am

Just a note on swapping offsets as I have recently managed to move competitions from one nation to another ie the Irish Munster Senior Cup I have rewritten it's format and moved it to Northern Ireland while moving the Northern Ireland League Cup to Ireland.

For this you will need to swap the following offsets (in NIFL Cup);

00835F4C - swap the 9CF value

00835F22 - Change the Push value from 0F6 to 0B2 (this is the value that exists where the Munster Cup currently is in Ireland comp coding)

00835F69 - Change the Call function to go to the correct competition (in this case the Munster Cup, 006387A0)

These are the three lines that need careful changing whenever swapping competitions between nations so they appear in the competition menu/drop down in game.

Not tried this with a league as yet.......

[ChairFloor](https://champman0102.net/memberlist.php?mode=viewprofile&u=2888)**Posts:** 2**Joined:** Sat Nov 28, 2020 6:27 pm

### [Offsets](https://champman0102.net/viewtopic.php?p=6856\#p6856)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=6856 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=6856 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=6856#p6856 "Post") by **[ChairFloor](https://champman0102.net/memberlist.php?mode=viewprofile&u=2888)** » Wed Dec 02, 2020 7:27 pm

Does anyone have a link to this Nick + Co patch?

Think I’m being thick and can’t find it.

[hodgy](https://champman0102.net/memberlist.php?mode=viewprofile&u=260)Hot Prospect for the Future**Posts:** 194**Joined:** Tue Nov 24, 2020 10:14 pm**Has thanked:** [110 times](https://champman0102.net/app.php/thankslist/givens/260/true)**Been thanked:** [60 times](https://champman0102.net/app.php/thankslist/givens/260/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=6859\#p6859)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=6859 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=6859 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=6859#p6859 "Post") by **[hodgy](https://champman0102.net/memberlist.php?mode=viewprofile&u=260)** » Wed Dec 02, 2020 7:38 pm

[viewtopic.php?f=72&t=1392](https://champman0102.net/viewtopic.php?f=72&t=1392)

[ChairFloor](https://champman0102.net/memberlist.php?mode=viewprofile&u=2888)**Posts:** 2**Joined:** Sat Nov 28, 2020 6:27 pm

### [Offsets](https://champman0102.net/viewtopic.php?p=6865\#p6865)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=6865 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=6865 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=6865#p6865 "Post") by **[ChairFloor](https://champman0102.net/memberlist.php?mode=viewprofile&u=2888)** » Wed Dec 02, 2020 8:49 pm

> [hodgy](https://champman0102.net/memberlist.php?mode=viewprofile&u=260) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=6859#p6859) Wed Dec 02, 2020 7:38 pm [viewtopic.php?f=72&t=1392](https://champman0102.net/viewtopic.php?f=72&t=1392)

Thanks mate.

[Arnie](https://champman0102.net/memberlist.php?mode=viewprofile&u=258)**Posts:** 3**Joined:** Tue Nov 24, 2020 10:13 pm

### [Offsets](https://champman0102.net/viewtopic.php?p=6916\#p6916)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=6916 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=6916 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=6916#p6916 "Post") by **[Arnie](https://champman0102.net/memberlist.php?mode=viewprofile&u=258)** » Thu Dec 03, 2020 12:05 pm

Hello. Can you please give me the offsets for (leagues prize money and tv) for Brazil and Turkey?

Thanks

[John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338)Patch Team**Posts:** 326**Joined:** Wed Nov 25, 2020 12:26 am**Has thanked:** [175 times](https://champman0102.net/app.php/thankslist/givens/338/true)**Been thanked:** [169 times](https://champman0102.net/app.php/thankslist/givens/338/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=6927\#p6927)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=6927 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=6927 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=6927#p6927 "Post") by **[John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338)** » Thu Dec 03, 2020 1:01 pm

All TV/prize offsets that I have (sorry about the format, it's from a config file for one of my apps):

Offsets are literal, add 0x400000 to get Olly values, e.g. 0x563d becomes 0x40563d.

Code: [Select all](https://champman0102.net/viewtopic.php?t=1540#)

```
Argentina.Premier.Prize		0x563D int "Argentinian Premier Division Prize Money (£)"
Argentina.Premier.TV		0x564B int "Argentinian Premier Division TV Money (£)"

//Australia

Belgium.First.Prize		0x1E9AD int "Belgian First Division Prize Money (£)"
Belgium.First.TV		0x1E9BB int "Belgian First Division TV Money (£)"

Belgium.Second.Prize		0x1FE6F int "Belgian Second Division Prize Money (£)"
Belgium.Second.TV		0x1FE7B int "Belgian Second Division TV Money (£)"

Brazil.First.TV			0x2A461 int "Brazilian First Division TV Money (£)"

Brazil.Second.TV		0x2CA51 int "Brazilian Second Division TV Money (£)"

//Brazil

Croatia.First.Prize		0x1148AD int "Croatian First Division Prize Money (£)"
Croatia.First.TV		0x1148BB int "Croatian First Division TV Money (£)"

Croatia.Second.North.Prize	0x115DAD int "Croatian Second Division North Prize Money (£)"
Croatia.Second.North.TV		0x115DBB int "Croatian Second Division North TV Prize Money (£)"

Croatia.Second.South.Prize	0x116ECD int "Croatian Second Division South Prize Money (£)"
Croatia.Second.South.TV		0x116EDB int "Croatian Second Division South TV Money (£)"

Denmark.Premier.Prize		0x1539CD int "Danish Premier Division Prize Money (£)"
Denmark.Premier.TV		0x1539DB int "Danish Premier Division TV Money (£)"

Denmark.Second.Prize		0x154B3D int "Danish Second Division Prize Money (£)"

England.Premier.Prize		0x174B1D int "English Premier Division Prize Money (£)"
England.Premier.TV		0x174B40 int "English Premier Division TV Money (£)"

England.Championship.Prize	0x172CEE int "English Championship Prize Money (£)"
England.Championship.TV		0x172D66 int "English Championship TV Money (£)"

England.First.Prize		0x17672D int "English First Division Prize Money (£)"
England.First.TV		0x176750 int "English First Division TV Money (£)"

England.Second.Prize		0x17806D int "English Second Division Prize Money (£)"
England.Second.TV		0x178090 int "English Second Division TV Money (£)"

England.Conference.Prize	0x16EDAD int "English Conference Prize Money (£)"
England.Conference.TV		0x16EDBB int "English Conference TV Money (£)"

England.ConferenceNorth.Prize	0x525C29 int "English Northern Conference / Welsh Premier Prize Money (£)"
England.ConferenceNorth.TV	0x525E81 int "English Northern Conference / Welsh Premier TV Money (£)"

England.FACup.Winner.Prize	 0x16FA93 int "English FA Cup Winner Prize Money (£)"
England.FACup.RunnerUp.Prize	 0x16FA9E int "English FA Cup Runner-Up Prize Money (£)"
England.FACup.SemiFinal.Prize	 0x16F9ED int "English FA Cup Semi-Final Prize Money (£)"
England.FACup.QuarterFinal.Prize 0x16F942 int "English FA Cup Quarter-Final Prize Money (£)"
England.FACup.5thRound.Prize	 0x16F896 int "English FA Cup 5th Round Prize Money (£)"
England.FACup.4thRound.Prize	 0x16F7D1 int "English FA Cup 4th Round Prize Money (£)"
England.FACup.3rdRound.Prize	 0x16F708 int "English FA Cup 3rd Round Prize Money (£)"
England.FACup.2ndRound.Prize	 0x16F5E8 int "English FA Cup 2nd Round Prize Money (£)"
England.FACup.1stRound.Prize	 0x16F4E6 int "English FA Cup 1st Round Prize Money (£)"
England.FACup.QualifyingRound.Prize	 0x16F44D int "English FA Cup Qualifying Round Prize Money (£)"

Finland.Premier.Prize		0x195C6D int "Finland Premier Division Prize Money (£)"

Germany.Bundesliga.Prize	0x1DB3C6 int "German Bundesliga Prize Money (£)"
Germany.Bundesliga.TV		0x1DB3D4 int "German Bundesliga TV Money (£)"

Germany.ZweiteBundesliga.Prize	0x1DF3AD int "German Zweite Bundesliga Prize Money (£)"
Germany.ZweiteBundesliga.TV	0x1DF3BB int "German Zweite Bundesliga TV Money (£)"

Germany.LeagueCupWinner.Prize	0x1DC1B5 int "German League Cup Winner Prize Money"

Greece.Superleague.Prize	0x1EAE5D int "Greek Superleague Prize Money (£)"
Greece.Superleague.TV		0x1EAE6B int "Greek Superleague TV Money (£)"

Greece.FootballLeague.Prize	0x1EBDAD int "Greek Football League Prize Money (£)"
Greece.FootballLeague.TV	0x1EBDBB int "Greek Football League TV Money (£)"

Ireland.Premier.Prize		0x23A8D4 int "League of Ireland Premier Division Prize Money (£)"

Italy.SerieA.Prize		0x24160D int "Italian Serie A Prize Money (£)"
Italy.SerieA.TV			0x24161B int "Italian Serie A TV Money (£)"

Italy.SerieB.Prize		0x24687D int "Italian Serie B Prize Money (£)"

Italy.CoppaItalia.Winner.Prize		0x23F3C5 int "Italian Coppa Italia Winner Prize Money (£)"
Italy.CoppaItalia.RunnerUp.Prize	0x23F10C int "Italian Cup Runner-Up Prize Money (£)"
Italy.CoppaItalia.SemiFinal.Prize	0x23F061 int "Italian Cup Semi-Final Prize Money (£)"
Italy.CoppaItalia.QuarterFinal.Prize	0x23EFC0 int "Italian Cup Quarter-Final Prize Money (£)"
Italy.CoppaItalia.Last16.Prize		0x23EF1B int "Italian Cup Last 16 Prize Money (£)"
Italy.CoppaItalia.4thRound.Prize	0x23EE83 int "Italian Cup 4th Round Prize Money (£)"

Japan.J1.Prize			0x2635E6 int "Japanese J.League Division 1 Prize Money (£)"
Japan.J1.TV			0x2635F4 int "Japanese J.League Division 1 TV Money (£)"

Netherlands.Premier.Prize	0x1F852D int "Dutch Premier Division Prize Money (£)"
Netherlands.Premier.TV		0x1F853B int "Dutch Premier Division TV Money (£)"

NorthernIreland.Premier.Prize	0x38ED5D int "IFA Premiership Prize Money (£)"

NorthernIreland.IrishCup.Winner.Prize		0x38AC65 int "Irish Cup Winner Prize (£)"
NorthernIreland.IrishCup.RunnerUp.Prize		0x38AC6F int "Irish Cup Runner-Up Prize (£)"
NorthernIreland.IrishCup.SemiFinal.Prize	0x38ABBF int "Irish Cup Semi-Final Prize (£)"
NorthernIreland.IrishCup.QuarterFinal.Prize	0x38AADF int "Irish Cup Quarter-Final Prize (£)"
NorthernIreland.IrishCup.Last16.Prize		0x38AA34 int "Irish Cup Last 16 Prize (£)"

Norway.Premier.Prize		0x3926DD int "Norwegian Premier League Prize Money (£)"

Poland.Premier.TV		0x3C966F int "Polish Premier League TV Money (£)"

Portugal.Premier.Prize		0x3CF8FD int "Portuguese Primeira Liga Prize Money (£)"
Portugal.Premier.TV		0x3CF90B int "Portuguese Primeira Liga TV Money (£)"

Russia.Premier.Prize		0x3EB71B int "Russian Premier League Prize Money (£)"
Russia.Premier.TV		0x3EB70D int "Russian Premier League TV Money (£)"

Scotland.Premier.Prize		0x3F293B int "Scottish Premier League Prize Money (£)"
Scotland.Premier.TV		0x3F2949 int "Scottish Premier League TV Money (£)"

Scotland.FACup.Winner.Prize	0x3EDAD7 int "Scottish FA Cup Winner Prize Money (£)"
Scotland.FACup.RunnerUp.Prize	0x3EDA2D int "Scottish FA Cup Runner-Up Prize Money (£)"
Scotland.FACup.SemiFinal.Prize	0x3ED985 int "Scottish FA Cup Semi-Final Prize Money (£)"
Scotland.FACup.QuarterFinal.Prize 0x3ED8DC int "Scottish FA Cup Quarter-Final Prize Money (£)"
Scotland.FACup.Last16.Prize 0x3ED793 int "Scottish FA Cup Last 16 Prize Money (£)"
Scotland.FACup.Last32.Prize 0x3ED6FA int "Scottish FA Cup Last 32 Prize Money (£)"

SouthKorea.KLeague.Prize	0x26BC93 int "South Korean K League Prize Money (£)"

Spain.Premier.Prize		0x44FDBA int "Spanish La Liga Prize Money (£)"
Spain.Premier.TV		0x44FDC8 int "Spanish La Liga TV Money (£)"

Sweden.Premier.Prize		0x49052D int "Swedish Premier (Allsvenskan) Prize Money (£)"

Turkey.First.TV			0x4FDF60 int "Turkish Süper Lig TV Money (£)"
Turkey.Second.TV		0x4FF24B int "Turkish First League TV Money (£)"

Turkey.TurkishCup.Winner.Prize		0x4FCB74 int "Turkish Cup Winner Prize Money (£)"
Turkey.TurkishCup.RunnerUp.Prize	0x4FCAC9 int "Turkish Cup Runner-Up Prize Money (£)"
Turkey.TurkishCup.SemiFinal.Prize	0x4FCA22 int "Turkish Cup Semi-Final Prize Money (£)"
Turkey.TurkishCup.QuarterFinal.Prize	0x4FC982 int "Turkish Cup Quarter-Final Prize Money (£)"
Turkey.TurkishCup.Last16.Prize		0x4FC8D7 int "Turkish Cup Last 16 Prize Money (£)"
Turkey.TurkishCup.Last32.Prize		0x4FC82E int "Turkish Cup Last 32 Prize Money (£)"
Turkey.TurkishCup.Last64.Prize		0x4FC79A int "Turkish Cup Last 64 Prize Money (£)"

//Wales

Europe.ChampionsLeague.Winner.Prize	0x184539 int "Champions League Winner Prize Money (£)"
Europe.ChampionsLeague.RunnerUp.Prize	0x184543 int "Champions League Runner-Up Prize Money (£)"
Europe.ChampionsLeague.SemiFinal.Prize	0x18445F int "Champions League Semi-Final Prize Money (£)"
Europe.ChampionsLeague.QuarterFinal.Prize 0x1843C0 int "Champions League Quarter-Final Prize Money (£)"

Europe.ChampionsLeague.2ndGroupStageA.Prize 0x186066 int "Champions League 2nd Group Stage Money (£) (1 of 2)"
Europe.ChampionsLeague.2ndGroupStageB.Prize 0x186085 int "Champions League 2nd Group Stage Money (£) (2 of 2)"

Europe.ChampionsLeague.1stGroupStageA.Prize 0x185804 int "Champions League 1st Group Stage Money (£) (1 of 2)"
Europe.ChampionsLeague.1stGroupStageB.Prize 0x185823 int "Champions League 1st Group Stage Money (£) (2 of 2)"

Europe.ChampionsLeague.DrawMoneyA	0x183BD7 int "Champions League Draw Money (£) (1 of 4)"
Europe.ChampionsLeague.DrawMoneyB	0x183BF2 int "Champions League Draw Money (£) (2 of 4)"
Europe.ChampionsLeague.DrawMoneyC	0x183C10 int "Champions League Draw Money (£) (3 of 4)"
Europe.ChampionsLeague.DrawMoneyD	0x183C29 int "Champions League Draw Money (£) (4 of 4)"

Europe.ChampionsLeague.WinMoneyA	0x183BAB int "Champions League Win Money (£) (1 of 2)"
Europe.ChampionsLeague.WinMoneyB	0x183BC6 int "Champions League Win Money (£) (2 of 2)"

Europe.UEFACup.Winner.Prize		0x502B6A int "UEFA Cup Winner Prize Money (£)"
Europe.UEFACup.RunnerUp.Prize		0x502AE7 int "UEFA Cup Runner-Up Prize Money (£)"
Europe.UEFACup.SemiFinal.Prize		0x502A64 int "UEFA Cup Semi-Final Prize Money (£)"

Europe.UEFACup.QuarterFinal.Prize	0x5029E1 int "UEFA Cup Quarter-Final Prize Money (£)"
Europe.UEFACup.4thRound.Prize		0x502960 int "UEFA Cup 4th Round Prize Money (£)"
Europe.UEFACup.3rdRound.Prize		0x5028CB int "UEFA Cup 3rd Round Prize Money (£)"
```

[Arnie](https://champman0102.net/memberlist.php?mode=viewprofile&u=258)**Posts:** 3**Joined:** Tue Nov 24, 2020 10:13 pm

### [Offsets](https://champman0102.net/viewtopic.php?p=6933\#p6933)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=6933 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=6933 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=6933#p6933 "Post") by **[Arnie](https://champman0102.net/memberlist.php?mode=viewprofile&u=258)** » Thu Dec 03, 2020 1:41 pm

Thank you very much John Locke.

[clipeus](https://champman0102.net/memberlist.php?mode=viewprofile&u=408)Hot Prospect for the Future**Posts:** 192**Joined:** Wed Nov 25, 2020 7:15 am**Has thanked:** [74 times](https://champman0102.net/app.php/thankslist/givens/408/true)**Been thanked:** [28 times](https://champman0102.net/app.php/thankslist/givens/408/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=6935\#p6935)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=6935 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=6935 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=6935#p6935 "Post") by **[clipeus](https://champman0102.net/memberlist.php?mode=viewprofile&u=408)** » Thu Dec 03, 2020 2:08 pm

John sorry can you upload again your annotated exe? please

[John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338)Patch Team**Posts:** 326**Joined:** Wed Nov 25, 2020 12:26 am**Has thanked:** [175 times](https://champman0102.net/app.php/thankslist/givens/338/true)**Been thanked:** [169 times](https://champman0102.net/app.php/thankslist/givens/338/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=6938\#p6938)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=6938 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=6938 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=6938#p6938 "Post") by **[John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338)** » Thu Dec 03, 2020 2:31 pm

[https://www.sendspace.com/file/woms2b](https://www.sendspace.com/file/woms2b)

[Arnie](https://champman0102.net/memberlist.php?mode=viewprofile&u=258)**Posts:** 3**Joined:** Tue Nov 24, 2020 10:13 pm

### [Offsets](https://champman0102.net/viewtopic.php?p=6948\#p6948)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=6948 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=6948 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=6948#p6948 "Post") by **[Arnie](https://champman0102.net/memberlist.php?mode=viewprofile&u=258)** » Thu Dec 03, 2020 3:51 pm

I'm sorry John but i can't find the offsets for Brazil or Turkey.

With Olly i can change, for example, the English offset with "00574b1c" but with your list the offset is" 0x174B1D " and i can't change anything. Same thing for Brazil or Turkey

[John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338)Patch Team**Posts:** 326**Joined:** Wed Nov 25, 2020 12:26 am**Has thanked:** [175 times](https://champman0102.net/app.php/thankslist/givens/338/true)**Been thanked:** [169 times](https://champman0102.net/app.php/thankslist/givens/338/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=6957\#p6957)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=6957 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=6957 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=6957#p6957 "Post") by **[John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338)** » Thu Dec 03, 2020 5:13 pm

You need to add 0x400000, so 0x174B1D becomes 0x574b1d - which is: PUSH 3D090 (250,000 decimal).

[marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005)Youth Team Player**Posts:** 31**Joined:** Fri Nov 27, 2020 10:01 am**Has thanked:** [2 times](https://champman0102.net/app.php/thankslist/givens/2005/true)**Been thanked:** [6 times](https://champman0102.net/app.php/thankslist/givens/2005/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=7477\#p7477)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=7477 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=7477 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=7477#p7477 "Post") by **[marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005)** » Sat Dec 05, 2020 8:09 pm

can anyone give a link to saturn swap league tutorial

[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)Hot Prospect for the Future**Posts:** 201**Joined:** Sun Nov 29, 2020 9:55 am**Has thanked:** [53 times](https://champman0102.net/app.php/thankslist/givens/3116/true)**Been thanked:** [59 times](https://champman0102.net/app.php/thankslist/givens/3116/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=7530\#p7530)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=7530 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=7530 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=7530#p7530 "Post") by **[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)** » Sun Dec 06, 2020 11:06 am

I don't have the link - but here is the post in it's entirety...

SWAPPING LEAGUES

Originally Posted by saturn

Previously, league patches were done by swapping all of one nation's attributes and clubs with another nation's. The following process patches a league by instead telling the game to load another nation's attributes and clubs directly, without the need to swap things around.

This method takes advantage of the fact that there are some competitions in the database but that are not used in the exe. The countries with competitions in the database are:

Austria

China

Czech Republic

Hong Kong

India

Indonesia

Luxembourg

Malaysia

Mexico

Singapore

South Africa

Switzerland

Thailand

Yugoslavia

It is possible to patch countries without leagues in the database, but I'll get to that later.

Each playable league and playable cup has a 9CF\*\*\*value in the cm0102.exe. The exe always uses these 9CF\*\*\* values when referencing leagues or cups. The 9CF\*\*\* value itself is simply the competition's ID#, which is taken from club\_comp.dat file in the Data folder. A competition's ID# can easily be found by opening the club\_comp.dat file in XVI32 and looking to the four bytes to the left of a competition's long name. For example, we can see here that the Belgian First Division A's ID# is 00, and that the English Premier League's is 07. The values are in hexadecimal and after reaching FF (or FF 00 00 00) the next ID# will be 00 01 (00 01 00 00), so the values are stored from right to left.

So every competition has an ID# but not every competition has a 9CF\*\*\* value. As we know, a competition's 9CF\*\*\* value is the same as their ID#. What this new method of league patching does is change all the references in the cm0102.exe of the old competition's 9CF\*\*\* values to the new competition's ID#. Let's look at a line of code in setup.cpp:

00835E51 MOV EDX,DWORD PTR DS:\[9CF8B0\]

This will load the Northern Ireland Premier Division when the Northern Ireland league has been selected. If you look for that competition in club\_comp.dat, you can see that its competition ID# is 9A. We can write the above line from setup.cpp as the following and the code will do the exact same thing:

00835E51 MOV EDX,9A

But of course, we want to change it to another competition's ID# entirely. So the following would load the Swiss National Division A instead:

00835E51 MOV EDX,0FA (note that in Olly when entering hexadecimal values that begin with a letter, a zero has to go before it).

Again the Swiss National Division A's ID# is taken from club\_comp.dat. So to summarise, for a Northern Ireland --> Switzerland swap, in the exe you would replace a lot of (not all) instances of:

Code:

Northern Ireland --> Switzerland 9CF3E4 --> 9CF4AC

Northern Ireland Premier Division --> Swiss National Division A 9CF8B0 --> 0FA

Northern Ireland First Division --> Swiss National Division B 9CF8B4 --> 0FB

Northern Ireland Lower Division --> Swiss Lower Division 9CF8B8 --> 0FC

Northern Irish Cup --> Swiss Cup 9CF8C0 --> 0FD

(The 9CF\*\*\* value for Switzerland can be found in the 9CF\*\*\* thread linked above.)

The easiest way to find all instances of the 9CF\*\*\* values is by downloading the cm0102.exe.txt file here and just CTRL+F each value.

The lines to change to convert Northern Ireland to Switzerland are:

Spoiler!

Code:

Northern Ireland --> Switzerland 9CF3E4 --> 9CF4AC

00413E40 MOV EAX,DWORD PTR DS:\[9CF3E4\] award\_manager

0055DEF0 MOV EAX,DWORD PTR DS:\[9CF3E4\] discipline

005EF483 CMP EAX,DWORD PTR DS:\[9CF3E4\] hall\_of\_fame

00668619 MOV EAX,DWORD PTR DS:\[9CF3E4\] key\_nation

0078D8B6 MOV ECX,DWORD PTR DS:\[9CF3E4\] nir\_lge\_cup

0078D95E MOV ECX,DWORD PTR DS:\[9CF3E4\] nir\_lge\_cup

00792DAE MOV EAX,DWORD PTR DS:\[9CF3E4\] northern\_ireland\_awards

007934A4 MOV EAX,DWORD PTR DS:\[9CF3E4\] northern\_ireland\_awards

007E0B11 MOV EDX,DWORD PTR DS:\[9CF3E4\] rb\_northern\_ireland

007E0DEB MOV EAX,DWORD PTR DS:\[9CF3E4\] rb\_northern\_ireland

008D2B63 MOV EDX,DWORD PTR DS:\[9CF3E4\] transfer\_manager

Northern Ireland Premier Division --> Swiss National Division A 9CF8B0 --> 0FA

0078A2D5 MOV EAX,DWORD PTR DS:\[9CF8B0\] nir\_charity

0078AD81 MOV EBP,DWORD PTR DS:\[9CF8B0\] nir\_cup

0078BDC8 MOV EDI,DWORD PTR DS:\[9CF8B0\] nir\_first

0078C055 MOV EAX,DWORD PTR DS:\[9CF8B0\] nir\_first

0078C06F MOV ECX,DWORD PTR DS:\[9CF8B0\] nir\_first

0078C19D MOV EAX,DWORD PTR DS:\[9CF8B0\] nir\_first

0078C30B MOV ECX,DWORD PTR DS:\[9CF8B0\] nir\_first

0078C498 MOV EAX,DWORD PTR DS:\[9CF8B0\] nir\_first

0078C4E7 MOV EAX,DWORD PTR DS:\[9CF8B0\] nir\_first

0078C54C MOV ECX,DWORD PTR DS:\[9CF8B0\] nir\_first

0078C5DA MOV EDX,DWORD PTR DS:\[9CF8B0\] nir\_first

0078C6BF MOV ECX,DWORD PTR DS:\[9CF8B0\] nir\_first

0078ED0D MOV EAX,DWORD PTR DS:\[9CF8B0\] nir\_prm

00792FE3 MOV EDX,DWORD PTR DS:\[9CF8B0\] northern\_ireland\_awards

00793040 MOV EDX,DWORD PTR DS:\[9CF8B0\] northern\_ireland\_awards

0079309F MOV EDX,DWORD PTR DS:\[9CF8B0\] northern\_ireland\_awards

007930FE MOV EDX,DWORD PTR DS:\[9CF8B0\] northern\_ireland\_awards

0079315D MOV EDX,DWORD PTR DS:\[9CF8B0\] northern\_ireland\_awards

007931D2 MOV EDX,DWORD PTR DS:\[9CF8B0\] northern\_ireland\_awards

007934D1 MOV ECX,DWORD PTR DS:\[9CF8B0\] northern\_ireland\_awards

007934F5 MOV ECX,DWORD PTR DS:\[9CF8B0\] northern\_ireland\_awards

00793519 MOV ECX,DWORD PTR DS:\[9CF8B0\] northern\_ireland\_awards

0079353D MOV EDX,DWORD PTR DS:\[9CF8B0\] northern\_ireland\_awards

00793630 MOV EAX,DWORD PTR DS:\[9CF8B0\] northern\_ireland\_awards

00835E51 MOV EDX,DWORD PTR DS:\[9CF8B0\] setup

Northern Ireland First Division --> Swiss National Division B 9CF8B4 --> 0FB

0078AD8B CMP EDX,DWORD PTR DS:\[9CF8B4\] nir\_cup

0078BCFD MOV EAX,DWORD PTR DS:\[9CF8B4\] nir\_first

0078C3BC MOV ECX,DWORD PTR DS:\[9CF8B4\] nir\_first

0078C42C MOV EAX,DWORD PTR DS:\[9CF8B4\] nir\_first

0078C44A MOV EAX,DWORD PTR DS:\[9CF8B4\] nir\_first

0078EDED MOV EDX,DWORD PTR DS:\[9CF8B4\] nir\_prm

0078EFA9 MOV EDX,DWORD PTR DS:\[9CF8B4\] nir\_prm

0079322A MOV EDX,DWORD PTR DS:\[9CF8B4\] northern\_ireland\_awards

00793287 MOV EDX,DWORD PTR DS:\[9CF8B4\] northern\_ireland\_awards

007932E6 MOV EDX,DWORD PTR DS:\[9CF8B4\] northern\_ireland\_awards

00793345 MOV EDX,DWORD PTR DS:\[9CF8B4\] northern\_ireland\_awards

007933A4 MOV EDX,DWORD PTR DS:\[9CF8B4\] northern\_ireland\_awards

00793413 MOV EDX,DWORD PTR DS:\[9CF8B4\] northern\_ireland\_awards

00793566 MOV ECX,DWORD PTR DS:\[9CF8B4\] northern\_ireland\_awards

00793577 MOV ECX,DWORD PTR DS:\[9CF8B4\] northern\_ireland\_awards

0079359B MOV ECX,DWORD PTR DS:\[9CF8B4\] northern\_ireland\_awards

007935BF MOV EDX,DWORD PTR DS:\[9CF8B4\] northern\_ireland\_awards

0079366B MOV ECX,DWORD PTR DS:\[9CF8B4\] northern\_ireland\_awards

00835EA6 MOV EDX,DWORD PTR DS:\[9CF8B4\] setup

Northern Ireland Lower Division --> Swiss Lower Division 9CF8B8 --> 0FC

0078AD61 CMP EBP,DWORD PTR DS:\[9CF8B8\] nir\_cup

Northern Irish Cup --> Swiss Cup 9CF8C0 --> 0FD

006686E9 MOV EAX,DWORD PTR DS:\[9CF8C0\] key\_nation

0078A26E MOV EAX,DWORD PTR DS:\[9CF8C0\] nir\_charity

0078A345 MOV EAX,DWORD PTR DS:\[9CF8C0\] nir\_charity

00835EF9 MOV EDX,DWORD PTR DS:\[9CF8C0\] setup

00836018 MOV EAX,DWORD PTR DS:\[9CF8C0\] setup

Other

00835F4A JE 00835F70 --> JMP 00835F70 Prevents NI League Cup from loading

00835F9D JE 00835FC3 --> JMP 00835FC3 Prevents NI Charity Shield from loading

Changing ~60 lines of code might seem like a lot, but remember you only have to do this once to create a .patch file, which you can then use on any .68 database. In this example all you would have to do was remove two clubs from both Swiss divisions to have an up to date version of the league (along with renaming of the competitions/awards with the Names Editor).

Note that not every reference to Northern Ireland has been changed to Switzerland, and knowing when not to change a value comes down to the experience of playing the game. For example, we know that NI regens can appear at British clubs, so if you see a reference to Northern Ireland in player\_regen.cpp and it's surrounded by British countries, it's pretty obvious that Switzerland shouldn't be swapped in for it. It is essential that countries are swapped in award\_manager, discipline, hall\_of\_fame, key\_nation and transfer\_manager parts of the code, and much of the rest is straightforward (awards, the actual competitions' code, ruling body etc).

For leagues not in the database, the easiest solution is to use other unused competitions already in the database. The Hong Kong cups are good candidates as there are no teams to move around or competition histories to clear. Just get the competition's ID# from club\_comp.dat, then add clubs to the competition in the Tri Wasano editor (and change its continent and nationality there too).

[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)Hot Prospect for the Future**Posts:** 201**Joined:** Sun Nov 29, 2020 9:55 am**Has thanked:** [53 times](https://champman0102.net/app.php/thankslist/givens/3116/true)**Been thanked:** [59 times](https://champman0102.net/app.php/thankslist/givens/3116/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=7532\#p7532)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=7532 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=7532 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=7532#p7532 "Post") by **[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)** » Sun Dec 06, 2020 11:08 am

Not sure why in this example Saturn chose to stop the Charity Shield from loading - I did this swap but then kept the charity shield to create a Swiss Super Cup.

I also managed to keep the NI League Cup working as the NI League Cup (swapped this with the Irish Munster Senior Cup - now the Austrian Cup - on game screen) - never been a fan of removing competitions from the game.

[hodgy](https://champman0102.net/memberlist.php?mode=viewprofile&u=260)Hot Prospect for the Future**Posts:** 194**Joined:** Tue Nov 24, 2020 10:14 pm**Has thanked:** [110 times](https://champman0102.net/app.php/thankslist/givens/260/true)**Been thanked:** [60 times](https://champman0102.net/app.php/thankslist/givens/260/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=7541\#p7541)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=7541 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=7541 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=7541#p7541 "Post") by **[hodgy](https://champman0102.net/memberlist.php?mode=viewprofile&u=260)** » Sun Dec 06, 2020 1:08 pm

Has anyone got the offsets for being offered managerial jobs? I know Nick incorporates the Saturn patch to increase the possibility of being offered jobs abroad easier but I'd like to tweak it a bit more.

[![User avatar](https://champman0102.net/download/file.php?avatar=78_1632658985.jpg)](https://champman0102.net/memberlist.php?mode=viewprofile&u=78)

[Offside Trap](https://champman0102.net/memberlist.php?mode=viewprofile&u=78)Network Game Team**Posts:** 2953**Joined:** Sun May 10, 2020 7:42 pm**Has thanked:** [856 times](https://champman0102.net/app.php/thankslist/givens/78/true)**Been thanked:** [1597 times](https://champman0102.net/app.php/thankslist/givens/78/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=7557\#p7557)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=7557 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=7557 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=7557#p7557 "Post") by **[Offside Trap](https://champman0102.net/memberlist.php?mode=viewprofile&u=78)** » Sun Dec 06, 2020 4:50 pm

Nick sent me a couple of these a while back, and I've also picked up another, so these might be of interest

\-\-\----------------------------------------------------------------------------------------------------------------------------

Reverting The Eng Transfer Window until the end of Aug:

00566F00: 00 8B

00566F01: 00 35

00566F02: 00 D4

00566F03: 00 23

00566F04: 00 AE

00566F06: 00 60

00566F07: 00 66

00566F08: 00 8B

00566F09: 00 15

00566F0A: 00 86

00566F0B: 00 33

00566F0C: 00 41

00566F0E: 00 66

00566F0F: 00 81

00566F10: 00 EA

00566F11: 00 D1

00566F12: 00 07

00566F13: 00 31

00566F14: 00 C0

00566F15: 00 89

00566F16: 00 CB

00566F17: 00 2B

00566F18: 00 1D

00566F19: 00 84

00566F1A: 00 23

00566F1B: 00 AE

00566F1D: 00 66

00566F1E: 00 01

00566F1F: 00 56

00566F20: 00 08

00566F21: 00 83

00566F22: 00 C6

00566F23: 00 1A

00566F24: 00 40

00566F25: 00 39

00566F26: 00 D8

00566F27: 00 75

00566F28: 00 F4

00566F29: 00 66

00566F2A: 00 F7

00566F2B: 00 C2

00566F2C: 00 01

00566F2E: 00 74

00566F30: 00 66

00566F31: 00 42

00566F32: 00 66

00566F33: 00 01

00566F34: 00 56

00566F35: 00 08

00566F36: 00 83

00566F37: 00 C6

00566F38: 00 1A

00566F39: 00 40

00566F3A: 00 39

00566F3B: 00 C8

00566F3C: 00 75

00566F3D: 00 F4

00566F3E: 00 61

00566F3F: 00 E9

00566F40: 00 AB

00566F41: 00 2B

00566F42: 00 BD

00566F43: 00 FF

\-\-\----------------------------------------------------------------------------------------------------------------------------

Prevent the Board cancelling deals:

004CDC56: 01 00

\-\-\----------------------------------------------------------------------------------------------------------------------------

Adjusting the Euro/WC History dates (new update)

00566F1C: 00 00

Find me on YouTube and enjoy CM related content - [https://www.youtube.com/channel/UCmoWKH ... wcF\_cLC70w](https://www.youtube.com/channel/UCmoWKHoM0y1YMwcF_cLC70w)

[Post Reply](https://champman0102.net/posting.php?mode=reply&t=1540 "Post a reply")

- [Print view](https://champman0102.net/viewtopic.php?t=1540&view=print "Print view")

Display: All posts1 day7 days2 weeks1 month3 months6 months1 yearSort by: AuthorPost timeSubjectDirection: AscendingDescending

* * *

764 posts


- [Page **1** of **31**](https://champman0102.net/viewtopic.php?t=1540# "Click to jump to page…")










  - Jump to page:

- 1
- [2](https://champman0102.net/viewtopic.php?t=1540&start=25)
- [3](https://champman0102.net/viewtopic.php?t=1540&start=50)
- [4](https://champman0102.net/viewtopic.php?t=1540&start=75)
- [5](https://champman0102.net/viewtopic.php?t=1540&start=100)
- …
- [31](https://champman0102.net/viewtopic.php?t=1540&start=750)
- [Next](https://champman0102.net/viewtopic.php?t=1540&start=25)

[Return to “Patches”](https://champman0102.net/viewforum.php?f=35)

Jump to

- [The Website](https://champman0102.net/viewforum.php?f=71)
- [↳   Announcements](https://champman0102.net/viewforum.php?f=2)
- [↳   New Signings](https://champman0102.net/viewforum.php?f=7)
- [↳   Awards](https://champman0102.net/viewforum.php?f=5)
- [↳   Hall of Fame](https://champman0102.net/viewforum.php?f=88)
- [↳   Awards](https://champman0102.net/viewforum.php?f=90)
- [↳   Members](https://champman0102.net/viewforum.php?f=91)
- [↳   Stories](https://champman0102.net/viewforum.php?f=8)
- [Downloads](https://champman0102.net/viewforum.php?f=54)
- [↳   Downloads](https://champman0102.net/viewforum.php?f=57)
- [↳   Background Packs](https://champman0102.net/viewforum.php?f=79)
- [↳   Colour Schemes](https://champman0102.net/viewforum.php?f=78)
- [↳   Commentary Files](https://champman0102.net/viewforum.php?f=82)
- [↳   Databases](https://champman0102.net/viewforum.php?f=73)
- [↳   Documentation](https://champman0102.net/viewforum.php?f=80)
- [↳   Fonts](https://champman0102.net/viewforum.php?f=74)
- [↳   Game](https://champman0102.net/viewforum.php?f=76)
- [↳   Menubars](https://champman0102.net/viewforum.php?f=75)
- [↳   Patches](https://champman0102.net/viewforum.php?f=72)
- [↳   Tactics](https://champman0102.net/viewforum.php?f=81)
- [↳   Tactic Packs](https://champman0102.net/viewforum.php?f=84)
- [↳   Tools](https://champman0102.net/viewforum.php?f=77)
- [Technical Support, Tutorials & FAQs](https://champman0102.net/viewforum.php?f=13)
- [↳   Technical Support, Tutorials & FAQs](https://champman0102.net/viewforum.php?f=43)
- [↳   Tutorials](https://champman0102.net/viewforum.php?f=85)
- [The Office](https://champman0102.net/viewforum.php?f=3)
- [↳   Scouting and Research](https://champman0102.net/viewforum.php?f=34)
- [↳   Africa](https://champman0102.net/viewforum.php?f=37)
- [↳   Asia](https://champman0102.net/viewforum.php?f=38)
- [↳   Europe](https://champman0102.net/viewforum.php?f=52)
- [↳   North, Central America & Caribbean](https://champman0102.net/viewforum.php?f=53)
- [↳   Oceania](https://champman0102.net/viewforum.php?f=39)
- [↳   South America](https://champman0102.net/viewforum.php?f=40)
- [↳   Free Players and Staff](https://champman0102.net/viewforum.php?f=42)
- [↳   Histories](https://champman0102.net/viewforum.php?f=48)
- [↳   Research](https://champman0102.net/viewforum.php?f=41)
- [Championship Managers Club](https://champman0102.net/viewforum.php?f=11)
- [↳   Data Updates](https://champman0102.net/viewforum.php?f=33)
- [↳   General](https://champman0102.net/viewforum.php?f=26)
- [↳   Graphics](https://champman0102.net/viewforum.php?f=36)
- [↳   Network Games](https://champman0102.net/viewforum.php?f=27)
- [↳   Official Challenges](https://champman0102.net/viewforum.php?f=28)
- [↳   Patches](https://champman0102.net/viewforum.php?f=35)
- [↳   Stories](https://champman0102.net/viewforum.php?f=29)
- [↳   Tactics](https://champman0102.net/viewforum.php?f=30)
- [↳   Talents, Tips and Training](https://champman0102.net/viewforum.php?f=31)
- [↳   Other Championship Managers](https://champman0102.net/viewforum.php?f=32)
- [CM 01/02 Interactive](https://champman0102.net/viewforum.php?f=10)
- [↳   Championship Managers League](https://champman0102.net/viewforum.php?f=20)
- [↳   CM Forums United](https://champman0102.net/viewforum.php?f=21)
- [↳   Dream Team League](https://champman0102.net/viewforum.php?f=22)
- [↳   Trillionaires Toys](https://champman0102.net/viewforum.php?f=25)
- [The Community](https://champman0102.net/viewforum.php?f=9)
- [↳   Football](https://champman0102.net/viewforum.php?f=14)
- [↳   Gaming](https://champman0102.net/viewforum.php?f=15)
- [↳   General Chat](https://champman0102.net/viewforum.php?f=16)
- [↳   Other Sports](https://champman0102.net/viewforum.php?f=17)
- [↳   Soccer Manager](https://champman0102.net/viewforum.php?f=86)
- [↳   TV & Films](https://champman0102.net/viewforum.php?f=19)
- [Archives](https://champman0102.net/viewforum.php?f=87)
- [↳   Archives](https://champman0102.net/viewforum.php?f=83)

Powered by [phpBB](https://www.phpbb.com/) ® Forum Software © phpBB Limited

[Privacy](https://champman0102.net/ucp.php?mode=privacy "Privacy")
\|
[Terms](https://champman0102.net/ucp.php?mode=terms "Terms")

---

## Page 3 (posts 51-75)

[Forums](https://champman0102.net/index.php "Forums")

# Championship Manager 2001/2002 Forums

Keeping the Game Alive

[Skip to content](https://champman0102.net/viewtopic.php?t=1540&start=50#start_here)

## [Offsets](https://champman0102.net/viewtopic.php?t=1540&start=50)

**Moderator:** [Patch Team](https://champman0102.net/memberlist.php?mode=group&g=21)

[Post Reply](https://champman0102.net/posting.php?mode=reply&t=1540 "Post a reply")

- [Print view](https://champman0102.net/viewtopic.php?t=1540&start=50&view=print "Print view")

764 posts


- [Page **3** of **31**](https://champman0102.net/viewtopic.php?t=1540&start=50# "Click to jump to page…")










  - Jump to page:

- [Previous](https://champman0102.net/viewtopic.php?t=1540&start=25)
- [1](https://champman0102.net/viewtopic.php?t=1540)
- [2](https://champman0102.net/viewtopic.php?t=1540&start=25)
- 3
- [4](https://champman0102.net/viewtopic.php?t=1540&start=75)
- [5](https://champman0102.net/viewtopic.php?t=1540&start=100)
- …
- [31](https://champman0102.net/viewtopic.php?t=1540&start=750)
- [Next](https://champman0102.net/viewtopic.php?t=1540&start=75)

[Okocha26](https://champman0102.net/memberlist.php?mode=viewprofile&u=1793)Youth Team Player**Posts:** 38**Joined:** Thu Nov 26, 2020 9:04 pm**Has thanked:** [6 times](https://champman0102.net/app.php/thankslist/givens/1793/true)**Been thanked:** [13 times](https://champman0102.net/app.php/thankslist/givens/1793/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=9242\#p9242)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=9242 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=9242 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=9242#p9242 "Post") by **[Okocha26](https://champman0102.net/memberlist.php?mode=viewprofile&u=1793)** » Sun Dec 20, 2020 12:02 pm

![Image](https://hizliresim.com/hBr0yz)

[Okocha26](https://champman0102.net/memberlist.php?mode=viewprofile&u=1793)Youth Team Player**Posts:** 38**Joined:** Thu Nov 26, 2020 9:04 pm**Has thanked:** [6 times](https://champman0102.net/app.php/thankslist/givens/1793/true)**Been thanked:** [13 times](https://champman0102.net/app.php/thankslist/givens/1793/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=9243\#p9243)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=9243 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=9243 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=9243#p9243 "Post") by **[Okocha26](https://champman0102.net/memberlist.php?mode=viewprofile&u=1793)** » Sun Dec 20, 2020 12:03 pm

[https://hizliresim.com/hBr0yz](https://hizliresim.com/hBr0yz) SCREEN SHOTS

[marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005)Youth Team Player**Posts:** 31**Joined:** Fri Nov 27, 2020 10:01 am**Has thanked:** [2 times](https://champman0102.net/app.php/thankslist/givens/2005/true)**Been thanked:** [6 times](https://champman0102.net/app.php/thankslist/givens/2005/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=9266\#p9266)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=9266 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=9266 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=9266#p9266 "Post") by **[marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005)** » Sun Dec 20, 2020 8:11 pm

> [Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=9235#p9235) Sun Dec 20, 2020 8:44 am
>
> > [marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=8693#p8693) Tue Dec 15, 2020 9:42 am
> >
> > > [Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=8691#p8691) Tue Dec 15, 2020 8:47 am
> > >
> > > Marcovanbast - how do you copy the ID numbers from the .dat file once you've added a new competition?
> >
> > same as IDs of existing comps.
> >
> > 1) create new comp
> >
> > 2) save
> >
> > 3) go to club\_comp.dat
> >
> > 4) find you new created comp (it 99% should be at the end of file)
> >
> > 5) 4 bytes left from **full name** (dont confuse with short name) - your id.
>
> Just FYI on this, not sure you've noticed. But the last competition listed on the club\_comp.dat file is Belgian Fourth Division D, Hex ID number 1B0
>
> If you create a new competition this is given the ID number 1B1....which is the ID number for 'B' Internationals. Now in theory (and when you view the .dat file for national\_comp, each competition should be shifted down by 1 ID number every time you add a competition to the clubs list). BUT, I added about 8 new competitions (to file teams into) and when you start a new game the European Championships Qualifying Tournament has been renamed. B Internationals now show up. U21 Internationals disappear. Utter chaos. I used the Tri-Wasano editor rather than the official editor to create the new competitions, not sure if that may have been the cause.

its weird man,

tbh i swapped leagues only in cm3, and new comps works flawless, but maybe its not best option for cm0102.

and yes maybe tri wasano is case coz it cm3 editor.

Last edited by [marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005) on Sun Dec 20, 2020 8:14 pm, edited 1 time in total.


[marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005)Youth Team Player**Posts:** 31**Joined:** Fri Nov 27, 2020 10:01 am**Has thanked:** [2 times](https://champman0102.net/app.php/thankslist/givens/2005/true)**Been thanked:** [6 times](https://champman0102.net/app.php/thankslist/givens/2005/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=9268\#p9268)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=9268 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=9268 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=9268#p9268 "Post") by **[marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005)** » Sun Dec 20, 2020 8:12 pm

Okocha26 its not enough to just add teams in editor.

you need to edit .exe file also

[Okocha26](https://champman0102.net/memberlist.php?mode=viewprofile&u=1793)Youth Team Player**Posts:** 38**Joined:** Thu Nov 26, 2020 9:04 pm**Has thanked:** [6 times](https://champman0102.net/app.php/thankslist/givens/1793/true)**Been thanked:** [13 times](https://champman0102.net/app.php/thankslist/givens/1793/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=10012\#p10012)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=10012 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=10012 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=10012#p10012 "Post") by **[Okocha26](https://champman0102.net/memberlist.php?mode=viewprofile&u=1793)** » Thu Dec 24, 2020 7:30 pm

> [marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=9268#p9268) Sun Dec 20, 2020 8:12 pm
> Okocha26 its not enough to just add teams in editor.
>
> you need to edit .exe file also

HOW CAN I DO THAT EDITING EXE?

[totallyaddicted](https://champman0102.net/memberlist.php?mode=viewprofile&u=8346)Youth Team Player**Posts:** 7**Joined:** Mon Dec 28, 2020 3:19 pm

### [Offsets](https://champman0102.net/viewtopic.php?p=10270\#p10270)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=10270 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=10270 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=10270#p10270 "Post") by **[totallyaddicted](https://champman0102.net/memberlist.php?mode=viewprofile&u=8346)** » Mon Dec 28, 2020 9:37 pm

hi there does anyone know how to find out how to change the teams participating in the inter american cup? thank you.

[totallyaddicted](https://champman0102.net/memberlist.php?mode=viewprofile&u=8346)Youth Team Player**Posts:** 7**Joined:** Mon Dec 28, 2020 3:19 pm

### [Offsets](https://champman0102.net/viewtopic.php?p=10369\#p10369)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=10369 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=10369 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=10369#p10369 "Post") by **[totallyaddicted](https://champman0102.net/memberlist.php?mode=viewprofile&u=8346)** » Tue Dec 29, 2020 9:08 pm

hi there anyone know what is wrong with my editor? so it was fine before i changed a few things and now when i load northern ireland the league cup loads random clubs into the groups, when in the editor for example it has glentoran in group d but they dont appear?

[fyunkul](https://champman0102.net/memberlist.php?mode=viewprofile&u=721)Youth Team Player**Posts:** 5**Joined:** Wed Nov 25, 2020 3:39 pm**Has thanked:** [20 times](https://champman0102.net/app.php/thankslist/givens/721/true)**Been thanked:** [1 time](https://champman0102.net/app.php/thankslist/givens/721/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=10759\#p10759)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=10759 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=10759 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=10759#p10759 "Post") by **[fyunkul](https://champman0102.net/memberlist.php?mode=viewprofile&u=721)** » Sun Jan 03, 2021 10:53 pm

Hi. I read league swapping post and trying to understand as I am a newbie (to be honest I didn't understand much of it yet unfortunately). But it gave me an idea that I am curious about why no one does it until now (I don't estimate time and work needed to do it.)

After checking Nick's patcher I noticed it was already done with Welsh and English leagues with replacing Welsh premier with some lower English league you select.

Isn't it possible to create a patcher or whatever you call it using same idea in which we are selecting leagues to replace and to be replaced and proceed with it?

[hodgy](https://champman0102.net/memberlist.php?mode=viewprofile&u=260)Hot Prospect for the Future**Posts:** 194**Joined:** Tue Nov 24, 2020 10:14 pm**Has thanked:** [110 times](https://champman0102.net/app.php/thankslist/givens/260/true)**Been thanked:** [60 times](https://champman0102.net/app.php/thankslist/givens/260/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=10793\#p10793)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=10793 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=10793 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=10793#p10793 "Post") by **[hodgy](https://champman0102.net/memberlist.php?mode=viewprofile&u=260)** » Mon Jan 04, 2021 11:21 am

It’s certainly possible. Nick’s patcher does already offer South Korea and China swap. The main issue here is that there’s not a lot of interest in other leagues. I’m sure if someone took the time to make one then Nick would incorporate it for the masses.

[BarryLarry](https://champman0102.net/memberlist.php?mode=viewprofile&u=7176)Youth Team Player**Posts:** 18**Joined:** Mon Dec 21, 2020 6:42 pm**Has thanked:** [5 times](https://champman0102.net/app.php/thankslist/givens/7176/true)**Been thanked:** [4 times](https://champman0102.net/app.php/thankslist/givens/7176/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=10832\#p10832)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=10832 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=10832 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=10832#p10832 "Post") by **[BarryLarry](https://champman0102.net/memberlist.php?mode=viewprofile&u=7176)** » Mon Jan 04, 2021 7:22 pm

Is it something i can change in the offsets, to stop the game from NOT registering any of my strikers goals, once they've scored more than 124 goals?

[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)Hot Prospect for the Future**Posts:** 201**Joined:** Sun Nov 29, 2020 9:55 am**Has thanked:** [53 times](https://champman0102.net/app.php/thankslist/givens/3116/true)**Been thanked:** [59 times](https://champman0102.net/app.php/thankslist/givens/3116/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=14500\#p14500)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=14500 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=14500 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=14500#p14500 "Post") by **[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)** » Fri Jan 29, 2021 8:37 pm

Not sure if this is something that has been found previously, but you can change Group Stage from numbers to letters.

Look for the code just above the fixture section of offsets for the cup competition. There is an offset written as ADD EDX,3E9 - this is to mark each group with a number ie Group 1, Group 2 etc. Change the 3E9 to 420 and then the groups will be marked Group A, Group B etc.

Accidentally discovered the above while still trying to get an extra group working in the Greek Cup - it's beating me now, so frustrating, keeps crashing after the last group game is played and always 3 teams in Group 1 play also in either Group 10,11 and 12.

[![User avatar](https://champman0102.net/download/file.php?avatar=384_1614080104.jpg)](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)

[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)Patch Team**Posts:** 2541**Joined:** Wed Nov 25, 2020 5:01 am**Has thanked:** [240 times](https://champman0102.net/app.php/thankslist/givens/384/true)**Been thanked:** [862 times](https://champman0102.net/app.php/thankslist/givens/384/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=14574\#p14574)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=14574 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=14574 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=14574#p14574 "Post") by **[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)** » Sat Jan 30, 2021 11:55 am

Hi All,

I lost my archieve&links from old website. If somebody has , please share it here so that we can record .

I need offset explanations with options for below blocks which Saturn sent in old website.

\\*\\*\\*\\*\\*\\*\\*\\*\\*\\*\\*\\* Cup any round settings\*\*\*\*\*\*\*\*\*\*

00929814 . 66:89AE D9000000 MOV WORD PTR DS:\[ESI+D9\],BP ; Round 3

0092981B . 66:89AE E8000000 MOV WORD PTR DS:\[ESI+E8\],BP ; Total teams in round

00929822 . 66:C786 D7000000 8C00 MOV WORD PTR DS:\[ESI+D7\],8C ; Third Place Playoff

0092982B . 5D POP EBP

0092982C . 66:899E DB000000 MOV WORD PTR DS:\[ESI+DB\],BX ; Open draw

00929833 . 66:C786 DD000000 8300 MOV WORD PTR DS:\[ESI+DD\],83 ; Game 1 tiebreak (Golden goal extra-time & penalties)

0092983C . C686 E7000000 17 MOV BYTE PTR DS:\[ESI+E7\],17

00929843 . 66:C786 EA000000 0100 MOV WORD PTR DS:\[ESI+EA\],1 ; Ties

0092984C . 66:899E EC000000 MOV WORD PTR DS:\[ESI+EC\],BX ; New teams entering round

00929853 . 66:899E DF000000 MOV WORD PTR DS:\[ESI+DF\],BX ; Game 2 tiebreak (none)

0092985A . 66:899E EE000000 MOV WORD PTR DS:\[ESI+EE\],BX ; Total teams already entered

00929861 . 889E F0000000 MOV BYTE PTR DS:\[ESI+F0\],BL ; Replays

00929867 . C686 F1000000 01 MOV BYTE PTR DS:\[ESI+F1\],1 ; Legs

0092986E . 889E F2000000 MOV BYTE PTR DS:\[ESI+F2\],BL ; Days between legs or replays

00929874 . 899E 2C010000 MOV DWORD PTR DS:\[ESI+12C\],EBX ; Prize money for reaching round

0092987A . C786 30010000 00093D00 MOV DWORD PTR DS:\[ESI+130\],3D0900 ; Prize money for winning round \[4,000,000\]

00929884 . C786 34010000 C0C62D00 MOV DWORD PTR DS:\[ESI+134\],2DC6C0 ; Prize money for losing round \[3,000,000\]

Last edited by [Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384) on Sat Jan 30, 2021 2:18 pm, edited 2 times in total.


[![User avatar](https://champman0102.net/download/file.php?avatar=384_1614080104.jpg)](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)

[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)Patch Team**Posts:** 2541**Joined:** Wed Nov 25, 2020 5:01 am**Has thanked:** [240 times](https://champman0102.net/app.php/thankslist/givens/384/true)**Been thanked:** [862 times](https://champman0102.net/app.php/thankslist/givens/384/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=14575\#p14575)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=14575 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=14575 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=14575#p14575 "Post") by **[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)** » Sat Jan 30, 2021 11:56 am

Need help about below block to find ?????? parts

\*\*\*\*\*\*\*\*\*\*\*\*Holland First Division league settings\*\*\*\*\*\*\*\*\*\*

005F6340 /$ 53 PUSH EBX

005F6341 \|. 56 PUSH ESI

005F6342 \|. 8BF1 MOV ESI,ECX

005F6344 \|. B8 02000000 MOV EAX,2

005F6349 \|. B1 03 MOV CL,3

005F634B \|. BB 01000000 MOV EBX,1

005F6350 \|. 66:8946 3C MOV WORD PTR DS:\[ESI+3C\],AX number of rounds

005F6354 \|. 8886 C4000000 MOV BYTE PTR DS:\[ESI+C4\],AL ?????

005F635A \|. 8886 C6000000 MOV BYTE PTR DS:\[ESI+C6\],AL second tiebreaker

005F6360 \|. 33C0 XOR EAX,EAX

005F6362 \|. 888E C2000000 MOV BYTE PTR DS:\[ESI+C2\],CL points for win.

005F6368 \|. 889E C3000000 MOV BYTE PTR DS:\[ESI+C3\],BL points for draw

005F636E \|. 885E 42 MOV BYTE PTR DS:\[ESI+42\],BL ?????

005F6371 \|. 889E C5000000 MOV BYTE PTR DS:\[ESI+C5\],BL first tiebreaker

005F6377 \|. 8886 C7000000 MOV BYTE PTR DS:\[ESI+C7\],AL ????? third tiebrekaer????

005F637D \|. 889E BE000000 MOV BYTE PTR DS:\[ESI+BE\],BL controls the amount of teams promoted automatically.

005F6383 \|. 8886 BF000000 MOV BYTE PTR DS:\[ESI+BF\],AL controls the amount of teams in promotion play-offs.

005F6389 \|. 8886 C0000000 MOV BYTE PTR DS:\[ESI+C0\],AL controls the amount of teams in relegation play-offs.

005F638F 8886 C1000000 MOV BYTE PTR DS:\[ESI+C1\],AL controls the amount of teams relegated automatically.

005F6395 8B15 68F59C00 MOV EDX,DWORD PTR DS:\[9CF568\] promotion to this league

005F639B \|. 8886 F1000000 MOV BYTE PTR DS:\[ESI+F1\],AL ???? possibly related with promotion/relegation play-offs

005F63A1 \|. 8886 F0000000 MOV BYTE PTR DS:\[ESI+F0\],AL ???? possibly related with promotion/relegation play-offs

005F63A7 \|. 8886 EF000000 MOV BYTE PTR DS:\[ESI+EF\],AL ???? possibly related with promotion/relegation play-offs

005F63AD \|. 8886 EE000000 MOV BYTE PTR DS:\[ESI+EE\],AL ???? possibly related with promotion/relegation play-offs

005F63B3 \|. 50 PUSH EAX

005F63B4 \|. 884E 4A MOV BYTE PTR DS:\[ESI+4A\],CL this line determines how many players you can actually sub

005F63B7 \|. 8D46 3A LEA EAX,DWORD PTR DS:\[ESI+3A\] ?????

005F63BA \|. 8D8E A9000000 LEA ECX,DWORD PTR DS:\[ESI+A9\] ????

005F63C0 \|. 8956 1C MOV DWORD PTR DS:\[ESI+1C\],EDX promote to EDX ( EDX is set as \[9CF568\] above)

005F63C3 \|. 8B16 MOV EDX,DWORD PTR DS:\[ESI\]

005F63C5 \|. 50 PUSH EAX

005F63C6 \|. 51 PUSH ECX

005F63C7 \|. 6A FF PUSH -1

005F63C9 \|. 8BCE MOV ECX,ESI

005F63CB \|. C746 20 FFFFFF>MOV DWORD PTR DS:\[ESI+20\],-1 relegation to this league ( here -1 means no league to relegate)

005F63D2 \|. C646 49 07 MOV BYTE PTR DS:\[ESI+49\],7 this line determines how many players you can register as subs

005F63D6 \|. FF52 3C CALL DWORD PTR DS:\[EDX+3C\]

005F63D9 \|. 8986 BA000000 MOV DWORD PTR DS:\[ESI+BA\],EAX ???? possibly related with promotion/relegation play-offs

005F63DF \|. 8BC3 MOV EAX,EBX

005F63E1 \|. 5E POP ESI

005F63E2 \|. 5B POP EBX

005F63E3 \\. C3 RETN

[![User avatar](https://champman0102.net/download/file.php?avatar=384_1614080104.jpg)](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)

[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)Patch Team**Posts:** 2541**Joined:** Wed Nov 25, 2020 5:01 am**Has thanked:** [240 times](https://champman0102.net/app.php/thankslist/givens/384/true)**Been thanked:** [862 times](https://champman0102.net/app.php/thankslist/givens/384/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=14635\#p14635)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=14635 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=14635 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=14635#p14635 "Post") by **[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)** » Sat Jan 30, 2021 7:09 pm

> [xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=14574#p14574) Sat Jan 30, 2021 11:55 am
> Hi All,
>
> I lost my archieve&links from old website. If somebody has , please share it here so that we can record .
>
> I need offset explanations with options for below blocks which Saturn sent in old website.
>
> \\*\\*\\*\\*\\*\\*\\*\\*\\*\\*\\*\\* Cup any round settings\*\*\*\*\*\*\*\*\*\*
>
> 00929814 . 66:89AE D9000000 MOV WORD PTR DS:\[ESI+D9\],BP ; Round 3
>
> 0092981B . 66:89AE E8000000 MOV WORD PTR DS:\[ESI+E8\],BP ; Total teams in round
>
> 00929822 . 66:C786 D7000000 8C00 MOV WORD PTR DS:\[ESI+D7\],8C ; Third Place Playoff
>
> 0092982B . 5D POP EBP
>
> 0092982C . 66:899E DB000000 MOV WORD PTR DS:\[ESI+DB\],BX ; Open draw
>
> 00929833 . 66:C786 DD000000 8300 MOV WORD PTR DS:\[ESI+DD\],83 ; Game 1 tiebreak (Golden goal extra-time & penalties)
>
> 0092983C . C686 E7000000 17 MOV BYTE PTR DS:\[ESI+E7\],17
>
> 00929843 . 66:C786 EA000000 0100 MOV WORD PTR DS:\[ESI+EA\],1 ; Ties
>
> 0092984C . 66:899E EC000000 MOV WORD PTR DS:\[ESI+EC\],BX ; New teams entering round
>
> 00929853 . 66:899E DF000000 MOV WORD PTR DS:\[ESI+DF\],BX ; Game 2 tiebreak (none)
>
> 0092985A . 66:899E EE000000 MOV WORD PTR DS:\[ESI+EE\],BX ; Total teams already entered
>
> 00929861 . 889E F0000000 MOV BYTE PTR DS:\[ESI+F0\],BL ; Replays
>
> 00929867 . C686 F1000000 01 MOV BYTE PTR DS:\[ESI+F1\],1 ; Legs
>
> 0092986E . 889E F2000000 MOV BYTE PTR DS:\[ESI+F2\],BL ; Days between legs or replays
>
> 00929874 . 899E 2C010000 MOV DWORD PTR DS:\[ESI+12C\],EBX ; Prize money for reaching round
>
> 0092987A . C786 30010000 00093D00 MOV DWORD PTR DS:\[ESI+130\],3D0900 ; Prize money for winning round \[4,000,000\]
>
> 00929884 . C786 34010000 C0C62D00 MOV DWORD PTR DS:\[ESI+134\],2DC6C0 ; Prize money for losing round \[3,000,000\]

I have found

[https://champman0102.co.uk/showthread.p ... post290845](https://champman0102.co.uk/showthread.php?t=68&page=74&p=290845#post290845)

[Paky87](https://champman0102.net/memberlist.php?mode=viewprofile&u=6157)Hot Prospect for the Future**Posts:** 105**Joined:** Sun Dec 13, 2020 6:09 pm**Has thanked:** [12 times](https://champman0102.net/app.php/thankslist/givens/6157/true)**Been thanked:** [1 time](https://champman0102.net/app.php/thankslist/givens/6157/false)

### [Guide](https://champman0102.net/viewtopic.php?p=14644\#p14644)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=14644 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=14644 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=14644#p14644 "Post") by **[Paky87](https://champman0102.net/memberlist.php?mode=viewprofile&u=6157)** » Sat Jan 30, 2021 7:45 pm

Guys is there a guide to disconnect divisions from league structures and insert them into another league?

[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)Hot Prospect for the Future**Posts:** 201**Joined:** Sun Nov 29, 2020 9:55 am**Has thanked:** [53 times](https://champman0102.net/app.php/thankslist/givens/3116/true)**Been thanked:** [59 times](https://champman0102.net/app.php/thankslist/givens/3116/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=14758\#p14758)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=14758 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=14758 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=14758#p14758 "Post") by **[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)** » Sun Jan 31, 2021 4:54 pm

It is possible to disconnect divisions, however nobody since Tapani has been able to add a division onto another league, very difficult.

[clipeus](https://champman0102.net/memberlist.php?mode=viewprofile&u=408)Hot Prospect for the Future**Posts:** 192**Joined:** Wed Nov 25, 2020 7:15 am**Has thanked:** [74 times](https://champman0102.net/app.php/thankslist/givens/408/true)**Been thanked:** [28 times](https://champman0102.net/app.php/thankslist/givens/408/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=15013\#p15013)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=15013 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=15013 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=15013#p15013 "Post") by **[clipeus](https://champman0102.net/memberlist.php?mode=viewprofile&u=408)** » Tue Feb 02, 2021 9:11 am

well, dear Footballer, i think that only Tapani or Saturn have the right answer.. maybe Giovani Santana may know something about this..

[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)Hot Prospect for the Future**Posts:** 201**Joined:** Sun Nov 29, 2020 9:55 am**Has thanked:** [53 times](https://champman0102.net/app.php/thankslist/givens/3116/true)**Been thanked:** [59 times](https://champman0102.net/app.php/thankslist/givens/3116/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=15032\#p15032)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=15032 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=15032 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=15032#p15032 "Post") by **[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)** » Tue Feb 02, 2021 11:04 am

Is there an offset somewhere that tells the game whether a league (or a teams league) is a winter season or summer season - for those leagues that are not playable in the game ie Paraguay, Canada, Serbia, Romania, etc?

[hodgy](https://champman0102.net/memberlist.php?mode=viewprofile&u=260)Hot Prospect for the Future**Posts:** 194**Joined:** Tue Nov 24, 2020 10:14 pm**Has thanked:** [110 times](https://champman0102.net/app.php/thankslist/givens/260/true)**Been thanked:** [60 times](https://champman0102.net/app.php/thankslist/givens/260/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=15101\#p15101)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=15101 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=15101 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=15101#p15101 "Post") by **[hodgy](https://champman0102.net/memberlist.php?mode=viewprofile&u=260)** » Tue Feb 02, 2021 7:03 pm

> [Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=15032#p15032) Tue Feb 02, 2021 11:04 am
> Is there an offset somewhere that tells the game whether a league (or a teams league) is a winter season or summer season - for those leagues that are not playable in the game ie Paraguay, Canada, Serbia, Romania, etc?

It's hard to say because player history rolls over at different times in these countries so there must be offsets for new league year dates, but all contracts seem to expire in February.

I would guess the offset for league start date is there, but it doesn't carry through to player contracts.

[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)Hot Prospect for the Future**Posts:** 201**Joined:** Sun Nov 29, 2020 9:55 am**Has thanked:** [53 times](https://champman0102.net/app.php/thankslist/givens/3116/true)**Been thanked:** [59 times](https://champman0102.net/app.php/thankslist/givens/3116/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=15182\#p15182)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=15182 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=15182 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=15182#p15182 "Post") by **[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)** » Wed Feb 03, 2021 11:36 am

Thanks Hodgy.

Had a look through original editor to see if I could spot anything in there as I remembered that there was a season update date for each country - however every country is set as the same; 0 - except for; Gibraltar (175), North Macedonia (171) and Serbia (175). Anybody got any idea why this is the case?

I'll keep looking through Olly to see if I can spot anything related to this.

Basically I'm trying to disconnect the State Championships in Brazil to create more national leagues ie Uruguay, Paraguay etc. Thought I had it cracked until suddenly the game loaded up at the Uruguayan league season was 2019/2020 not 2020 (ie calendar year). Not sure how that has just changed by changing the clubs in a competition and renaming it.

I checked your suggestion re contracts but all the players at Uruguayan clubs in the league their contracts end in December.

[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)Hot Prospect for the Future**Posts:** 201**Joined:** Sun Nov 29, 2020 9:55 am**Has thanked:** [53 times](https://champman0102.net/app.php/thankslist/givens/3116/true)**Been thanked:** [59 times](https://champman0102.net/app.php/thankslist/givens/3116/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=15482\#p15482)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=15482 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=15482 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=15482#p15482 "Post") by **[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)** » Fri Feb 05, 2021 12:25 pm

As an update to this. I swapped the details of a Uruguayan club with those of a Brazilian - ie made the nation of the Uruguay club Brazil and the Brazilian clubs nation set as Uruguay and their season structures changed with the Uruguayan club now showing as calendar year ie 2019 rather than winter season 2019/20. So there must be something in the coding which states what the default season is for each country if they are not a playable league

[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)Hot Prospect for the Future**Posts:** 201**Joined:** Sun Nov 29, 2020 9:55 am**Has thanked:** [53 times](https://champman0102.net/app.php/thankslist/givens/3116/true)**Been thanked:** [59 times](https://champman0102.net/app.php/thankslist/givens/3116/false)

### [Offsets - NORTHERN IRELAND LEAGUE CUP](https://champman0102.net/viewtopic.php?p=15673\#p15673)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=15673 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=15673 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=15673#p15673 "Post") by **[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)** » Sat Feb 06, 2021 11:52 am

Have managed to change the Northern Ireland League Cup so that it now has 24 teams rather than 20 (4 groups of 6 rather than 5).

The offsets to change are;

0078CFD9 \|. 68 62010000 PUSH 162

0078CFDE \|. 66:C746 3E 060>MOV WORD PTR DS:\[ESI+3E\],6

0078D4B5 \|. 83FF 05 \|CMP EDI,6

0078D529 \|. 6A 05 PUSH 6

0078D80B 6A 18 PUSH 18

0078D817 C785 F2000000 >MOV DWORD PTR SS:\[EBP+F2\],18

0078D8D9 B1 06 MOV CL,6

0078D8E5 B0 06 MOV AL,6

0078D8E7 B1 0C MOV CL,0C

0078D8F3 B0 0C MOV AL,0C

0078D8F5 B1 12 MOV CL,12

0078D901 B0 12 MOV AL,12

0078D903 B1 18 MOV CL,18

0078D983 66:83F8 18 CMP AX,18

Nothing else needs to be done with any of the game editors, the extra teams will be pulled directly from the Northern Irish League Lower Division

[![User avatar](https://champman0102.net/download/file.php?avatar=384_1614080104.jpg)](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)

[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)Patch Team**Posts:** 2541**Joined:** Wed Nov 25, 2020 5:01 am**Has thanked:** [240 times](https://champman0102.net/app.php/thankslist/givens/384/true)**Been thanked:** [862 times](https://champman0102.net/app.php/thankslist/givens/384/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=16076\#p16076)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=16076 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=16076 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=16076#p16076 "Post") by **[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)** » Tue Feb 09, 2021 12:18 pm

I move Saturn's explanation for the offsets which exist in all fixture blocks for cup competitions.

[https://champman0102.co.uk/showthread.p ... post290845](https://champman0102.co.uk/showthread.php?t=68&page=74&p=290845#post290845)

**Saturn's post:**

Here is an explanation for the offsets which exist in all fixture blocks for cup competitions. A lot of these were found by Golly but I've expanded on a few on a few of them.

**MOV WORD PTR DS:\[\*\*\*+7\],xxx Round name**

**MOV WORD PTR DS:\[\*\*\*+9\],xxx Round number**

**MOV WORD PTR DS:\[\*\*\*+B\],xxx Round draw type**

**MOV WORD PTR DS:\[\*\*\*+D\],xxx Game 1 tiebreak**

**MOV BYTE PTR DS:\[\*\*\*+17\],xxx ?**

**MOV WORD PTR DS:\[\*\*\*+18\],xxx Total teams in round**

**MOV WORD PTR DS:\[\*\*\*+1A\],xxx Ties**

**MOV WORD PTR DS:\[\*\*\*+1C\],xxx New teams entering round**

**MOV WORD PTR DS:\[\*\*\*+F\],xxx Game 2 tiebreak**

**MOV WORD PTR DS:\[\*\*\*+11\],xxx Game 3 tiebreak**

**MOV WORD PTR DS:\[\*\*\*+1E\],xxx Total teams already entered into cup**

**MOV BYTE PTR DS:\[\*\*\*+20\],xxx Replays**

**MOV BYTE PTR DS:\[\*\*\*+21\],xxx Legs**

**MOV BYTE PTR DS:\[\*\*\*+22\],xxx Days between legs or replays**

**MOV DWORD PTR DS:\[\*\*\*+5C\],xxx Prize money for reaching round**

**MOV DWORD PTR DS:\[\*\*\*+60\],xxx Prize money for winning this round**

**MOV DWORD PTR DS:\[\*\*\*+64\],xxx Prize money for losing this round**

The offsets mightn't be written in this order in the code (especially after the first block), but they will all follow the same order (the offset with the lowest \*\*\*+x figure will be the Round name, the second lowest \*\*\*+x will be the Round number etc).

Now to explain each a bit further.

**MOV WORD PTR DS:\[\*\*\*+7\],xxx - Round name**

The name of that cup competition's round, eg Qualifying Round, Second Round, Semi Final etc. A full list of available names can be located at 004B4919, but some of the main ones are below.

Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=50#)

```
0   = Used for competitions with just one round (Super Cups etc)
0A  = First Round
14  = Second Round
1E  = Third Round
28  = Fourth Round
32  = Fifth Round
3C  = Sixth Round
46  = Seventh Round
50  = Eighth Round
5A  = Ninth Round
64  = Tenth Round
6E  = Eleventh Round
78  = Quarter Final
82  = Semi Final
8C  = Third Place Playoff
96  = Final
A0  = Playoff
BE  = Playout
DC  = Qualifying Round
E6  = Preliminary Round
FA  = First Qualifying Phase
104 = Second Qualifying Phase
10E = Third Qualifying Phase
```

These are easily changed. For instance we can give the English FA Cup Quarter Final round its older title by editing:

0056F8CD - MOV WORD PTR DS:\[ESI+277\],78 -> 3C

Furthermore, we can create new round names by editing some unused ones that exist in the exe. At 004B627E we have the Interior Zone, a Round name used in Argentina from previous editions. The actual name Interior Zone is stored at 009A68C4, so by editing the ASCII here we can create...

...through renaming the round and changing 0092C95D - MOV WORD PTR DS:\[ESI+7\],14 -> 436.

Sometimes, the game will use an additional name to prefix all the Round names. These can be located at the beginning of the cup fixtures block, and are alongside the offset that determines the number of rounds in the competition. For example, in the English First Division's cup fixtures (the playoffs), we can find:

Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=50#)

```
00572A34	PUSH 0D0                                       ; 208 (2*104)
00572A39	MOV WORD PTR DS:[EAX],2                        ; Rounds
00572A3E	MOV WORD PTR DS:[ECX],0A0                      ; Playoff
```

These will be used alongside the Round name offsets at 00572AE5 - MOV WORD PTR DS:\[ESI+7\],82 and 00572B6E - MOV WORD PTR DS:\[ESI+6F\],96 to create the full Round names: Playoff Semi Final and Playoff Final.

The prefixed Round names are also located at 004B4919, a few of the most used ones are below:

Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=50#)

```
0   = Normal
1E  = Third Round
96  = Final
118 = Playoff 1
122 = Playoff 2
0A0 = Playoff
3E8 = Numeric Group Stage
40F = Carribean Zone
417 = MLS Cup
41D = Northern / Southern Section
420 = Alphabetic Group Stage
434 = Opening Stage
435 = Closing Stage
438 = Promotion
44B = Championship Group
44C = Relegation Group
452 = Relegation Playoff
453 = North / South / Central
458 = Promotion Playoff
45A = Second Promotion Playoff
45B = Third Promotion Playoff
45C = Fourth Promotion Playoff
473 = Central American Zone Group 1
475 = Classification Group 1
480 = East / West
```

They are often used for league offsets too.

**MOV WORD PTR DS:\[\*\*\*+9\],xxx - Round Number**

Simply the Round number of the competition. The number of rounds will be set at the beginning of the cup's fixture block, as mentioned above. The rounds progress in a chronological order as expected, apart from the Third Place Playoff which comes after the Final.

**MOV WORD PTR DS:\[\*\*\*+B\],xxx - Round draw type**

Sets whether the draw for this round of the competition is completely open or not. Most rounds are open, ie a fully random draw where anyone can draw anyone. Others are seeded (European club competitions), while others are biased towards lower division teams (lower division teams will not be drawn away to higher division teams). These are roughly what the values here mean:

Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=50#)

```
1 = Team from lower/equivalent division hosts
3 = Team from lower/equivalent division hosts
4 = Seeded teams
8 = Higher placed league position hosts
```

There are probably differences between 1 and 3.

A list of competitions that use non-open draws (probably incomplete):

Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=50#)

```
004212A6 MOV WORD PTR DS:[ESI+B],8
Belgian Super Cup

0042A38B MOV WORD PTR DS:[ESI+B],8
Brazilian First Division Playoffs

0042C97B MOV WORD PTR DS:[ESI+B],8
Brazilian Second Division Playoffs

00550D62 MOV WORD PTR DS:[ESI+B],1
Danish Cup (excluding Semi Final & Final)

00583D1D MOV WORD PTR DS:[ESI+B],4
European Cup Qualifying Rounds

005BA559 MOV WORD PTR DS:[ESI+73],1 (AX)
French Cup (excluding Sixth Round & Final)

005D8FD1 MOV WORD PTR DS:[ESI+B],1 (BP)
German Cup (excluding Final)

0078A95D MOV WORD PTR DS:[ESI+B],8
Northern Irish Cup (excluding Semi Final & Final)

007E9696 MOV WORD PTR DS:[ESI+73],8
Russian Cup Third Round

0084D312 MOV WORD PTR DS:[ESI+B],3 (BP)
Spanish Cup (excluding Final)

0088D015 MOV WORD PTR DS:[ESI+B],1
Swedish Cup (excluding Quarter Final, Semi Final & Final)

0090275E MOV WORD PTR DS:[ECX+B],4
UEFA Cup Qualifying Rounds

00927DA8 MOV WORD PTR DS:[ESI+B],8 (AX)
Welsh Premier Cup Semi Final
```

**MOV WORD PTR DS:\[\*\*\*+D\],xxx - Game 1 tiebreak**

This sets the tiebreak for games with one leg or no replays. The values are:

0 - No tiebreaker, means that there is a second leg or replay set in an offset further down.

1 - Penalties after 90 minutes.

2 - Extra-time (with no penalties - usually means it will go to a replay AET if scores are still level).

3 - Extra-time & penalties.

4 - ? (Only in Copa Libertadores and Copa Mercosur - might be why it goes straight to penalties in second leg)

83 - Golden goal extra-time & penalties.

**MOV WORD PTR DS:\[\*\*\*+F\],xxx - Game 2 tiebreak**

This sets the tiebreak for games with two legs or replays. The values are:

0 - No tiebreaker, means that there is a second replay or a decider.

1 - Penalties after 90 minutes of the second leg if scores and away goals are level (no extra-time used).

Penalties after 90 minutes of the second leg if scores are level (no away goals or extra-time used - Copa Libertadores and Copa Mercosur only).

3 - Away goals, extra-time and penalties.

7 - Extra-time and penalties used (no away goals)

83 - Away goals, golden goal extra-time and penalties.

**MOV WORD PTR DS:\[\*\*\*+11\],xxx - Game 3 tiebreak**

This sets the tiebreak for games undecided after two legs or a replay. This offset will usually not be present as only two competitions actually use it - the English FA Trophy and the Copa Mercosur Final.

3 - Extra-time and penalties used.

For now this only covers actual cup competitions. League playoffs (which the game sees as cups) aren't covered yet, so tiebreakers like US style shootouts or teams winning because of higher league positions aren't included. Generally though the other tiebreakers stay the same from what I've seen.

There are also values within the (true) cup offsets that I don't understand yet. For example the Italian Super Cup has a +D value of 0302. The 03 bit is extra-time and penalties, but I don't know what the 02 part (+E essentially) is. I've seen values of 00-04 for +E.

**MOV BYTE PTR DS:\[\*\*\*+17\],xxx - ?**

I don't know what this refers to. Its value can change within competitions from round to round, but I've noticed that it's always 0A for international competitions.

**MOV WORD PTR DS:\[\*\*\*+18\],xxx - Total teams in round**

Self-explanatory.

**MOV WORD PTR DS:\[\*\*\*+1A\],xxx - Ties**

Number of ties (xxx vs xxx) in the round.

**MOV WORD PTR DS:\[\*\*\*+1C\],xxx - New teams entering round**

Teams that are entering the competition without playing in a previous round, eg Premier League & First Division teams entering the FA Cup Third Round.

**MOV WORD PTR DS:\[\*\*\*+1E\],xxx - Total teams already entered into cup**

I struggled to put a label on this offset but this is the closest I can think of. It's only a non-zero figure if new teams are entered into the current round, in which case the value given is the \[New teams entering round\] figure from the previous round. The next round the value is the \[New teams entering round\] figure from the previous round plus the \[Total teams already entered into cup\] figure from the previous round. This goes on until no new teams are entered into the cup, in which case the value given is simply the \[Total teams already entered into cup\] figure from the previous round. After that the value reverts to zero again. ...I wouldn't dwell too much on this.

**MOV BYTE PTR DS:\[\*\*\*+20\],xxx - Replays**

Sets the number of replays.

**MOV BYTE PTR DS:\[\*\*\*+21\],xxx - Legs**

Sets whether a tie is one leg or two.

**MOV BYTE PTR DS:\[\*\*\*+22\],xxx - Days between legs or replays**

Self explanatory.

**MOV DWORD PTR DS:\[\*\*\*+5C\],xxx - Prize money for reaching round**

Self-explanatory.

**MOV DWORD PTR DS:\[\*\*\*+60\],xxx - Prize money for winning this round**

Self-explanatory for the most part. Sometimes this will be -1, which means the value will be a percentage of a prize pool set elsewhere in the competition's offsets.

**MOV DWORD PTR DS:\[\*\*\*+64\],xxx - Prize money for losing this round**

Self-explanatory. Further information on competitions' prize money figures can be found here [https://champman0102.co.uk/showthread.p ... post265990](https://champman0102.co.uk/showthread.php?t=6191&page=5&p=265990#post265990) .

**\\* \[TUTORIAL\] How to install and run the game CM0102?> [viewtopic.php?f=85&t=3571](https://champman0102.net/viewtopic.php?f=85&t=3571)** **Please use search bar for solution before posting your issue**

[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)Hot Prospect for the Future**Posts:** 201**Joined:** Sun Nov 29, 2020 9:55 am**Has thanked:** [53 times](https://champman0102.net/app.php/thankslist/givens/3116/true)**Been thanked:** [59 times](https://champman0102.net/app.php/thankslist/givens/3116/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=16442\#p16442)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=16442 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=16442 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=16442#p16442 "Post") by **[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)** » Thu Feb 11, 2021 6:35 pm

Can anyone point me towards the offsets that can be changed to show a human managers attributes, can't remember where I had copied this down previously.

[![User avatar](https://champman0102.net/download/file.php?avatar=384_1614080104.jpg)](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)

[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)Patch Team**Posts:** 2541**Joined:** Wed Nov 25, 2020 5:01 am**Has thanked:** [240 times](https://champman0102.net/app.php/thankslist/givens/384/true)**Been thanked:** [862 times](https://champman0102.net/app.php/thankslist/givens/384/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=16443\#p16443)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=16443 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=16443 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=16443#p16443 "Post") by **[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)** » Thu Feb 11, 2021 6:47 pm

> [Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=16442#p16442) Thu Feb 11, 2021 6:35 pm
> Can anyone point me towards the offsets that can be changed to show a human managers attributes, can't remember where I had copied this down previously.

00874A9A JL SHORT 00874AB9 >> JMP SHORT 00874AB9

00874AA2 JGE SHORT 00874AB9 >> JMP SHORT 00874AB9

Fill with NOP: 00874ABD, 00874ACA, 00874ACE, 00874C03, 0087A670 and 0087DE27

**\\* \[TUTORIAL\] How to install and run the game CM0102?> [viewtopic.php?f=85&t=3571](https://champman0102.net/viewtopic.php?f=85&t=3571)** **Please use search bar for solution before posting your issue**

[Post Reply](https://champman0102.net/posting.php?mode=reply&t=1540 "Post a reply")

- [Print view](https://champman0102.net/viewtopic.php?t=1540&start=50&view=print "Print view")

Display: All posts1 day7 days2 weeks1 month3 months6 months1 yearSort by: AuthorPost timeSubjectDirection: AscendingDescending

* * *

764 posts


- [Page **3** of **31**](https://champman0102.net/viewtopic.php?t=1540&start=50# "Click to jump to page…")










  - Jump to page:

- [Previous](https://champman0102.net/viewtopic.php?t=1540&start=25)
- [1](https://champman0102.net/viewtopic.php?t=1540)
- [2](https://champman0102.net/viewtopic.php?t=1540&start=25)
- 3
- [4](https://champman0102.net/viewtopic.php?t=1540&start=75)
- [5](https://champman0102.net/viewtopic.php?t=1540&start=100)
- …
- [31](https://champman0102.net/viewtopic.php?t=1540&start=750)
- [Next](https://champman0102.net/viewtopic.php?t=1540&start=75)

[Return to “Patches”](https://champman0102.net/viewforum.php?f=35)

Jump to

- [The Website](https://champman0102.net/viewforum.php?f=71)
- [↳   Announcements](https://champman0102.net/viewforum.php?f=2)
- [↳   New Signings](https://champman0102.net/viewforum.php?f=7)
- [↳   Awards](https://champman0102.net/viewforum.php?f=5)
- [↳   Hall of Fame](https://champman0102.net/viewforum.php?f=88)
- [↳   Awards](https://champman0102.net/viewforum.php?f=90)
- [↳   Members](https://champman0102.net/viewforum.php?f=91)
- [↳   Stories](https://champman0102.net/viewforum.php?f=8)
- [Downloads](https://champman0102.net/viewforum.php?f=54)
- [↳   Downloads](https://champman0102.net/viewforum.php?f=57)
- [↳   Background Packs](https://champman0102.net/viewforum.php?f=79)
- [↳   Colour Schemes](https://champman0102.net/viewforum.php?f=78)
- [↳   Commentary Files](https://champman0102.net/viewforum.php?f=82)
- [↳   Databases](https://champman0102.net/viewforum.php?f=73)
- [↳   Documentation](https://champman0102.net/viewforum.php?f=80)
- [↳   Fonts](https://champman0102.net/viewforum.php?f=74)
- [↳   Game](https://champman0102.net/viewforum.php?f=76)
- [↳   Menubars](https://champman0102.net/viewforum.php?f=75)
- [↳   Patches](https://champman0102.net/viewforum.php?f=72)
- [↳   Tactics](https://champman0102.net/viewforum.php?f=81)
- [↳   Tactic Packs](https://champman0102.net/viewforum.php?f=84)
- [↳   Tools](https://champman0102.net/viewforum.php?f=77)
- [Technical Support, Tutorials & FAQs](https://champman0102.net/viewforum.php?f=13)
- [↳   Technical Support, Tutorials & FAQs](https://champman0102.net/viewforum.php?f=43)
- [↳   Tutorials](https://champman0102.net/viewforum.php?f=85)
- [The Office](https://champman0102.net/viewforum.php?f=3)
- [↳   Scouting and Research](https://champman0102.net/viewforum.php?f=34)
- [↳   Africa](https://champman0102.net/viewforum.php?f=37)
- [↳   Asia](https://champman0102.net/viewforum.php?f=38)
- [↳   Europe](https://champman0102.net/viewforum.php?f=52)
- [↳   North, Central America & Caribbean](https://champman0102.net/viewforum.php?f=53)
- [↳   Oceania](https://champman0102.net/viewforum.php?f=39)
- [↳   South America](https://champman0102.net/viewforum.php?f=40)
- [↳   Free Players and Staff](https://champman0102.net/viewforum.php?f=42)
- [↳   Histories](https://champman0102.net/viewforum.php?f=48)
- [↳   Research](https://champman0102.net/viewforum.php?f=41)
- [Championship Managers Club](https://champman0102.net/viewforum.php?f=11)
- [↳   Data Updates](https://champman0102.net/viewforum.php?f=33)
- [↳   General](https://champman0102.net/viewforum.php?f=26)
- [↳   Graphics](https://champman0102.net/viewforum.php?f=36)
- [↳   Network Games](https://champman0102.net/viewforum.php?f=27)
- [↳   Official Challenges](https://champman0102.net/viewforum.php?f=28)
- [↳   Patches](https://champman0102.net/viewforum.php?f=35)
- [↳   Stories](https://champman0102.net/viewforum.php?f=29)
- [↳   Tactics](https://champman0102.net/viewforum.php?f=30)
- [↳   Talents, Tips and Training](https://champman0102.net/viewforum.php?f=31)
- [↳   Other Championship Managers](https://champman0102.net/viewforum.php?f=32)
- [CM 01/02 Interactive](https://champman0102.net/viewforum.php?f=10)
- [↳   Championship Managers League](https://champman0102.net/viewforum.php?f=20)
- [↳   CM Forums United](https://champman0102.net/viewforum.php?f=21)
- [↳   Dream Team League](https://champman0102.net/viewforum.php?f=22)
- [↳   Trillionaires Toys](https://champman0102.net/viewforum.php?f=25)
- [The Community](https://champman0102.net/viewforum.php?f=9)
- [↳   Football](https://champman0102.net/viewforum.php?f=14)
- [↳   Gaming](https://champman0102.net/viewforum.php?f=15)
- [↳   General Chat](https://champman0102.net/viewforum.php?f=16)
- [↳   Other Sports](https://champman0102.net/viewforum.php?f=17)
- [↳   Soccer Manager](https://champman0102.net/viewforum.php?f=86)
- [↳   TV & Films](https://champman0102.net/viewforum.php?f=19)
- [Archives](https://champman0102.net/viewforum.php?f=87)
- [↳   Archives](https://champman0102.net/viewforum.php?f=83)

Powered by [phpBB](https://www.phpbb.com/) ® Forum Software © phpBB Limited

[Privacy](https://champman0102.net/ucp.php?mode=privacy "Privacy")
\|
[Terms](https://champman0102.net/ucp.php?mode=terms "Terms")

---

## Page 4 (posts 76-100)

[Forums](https://champman0102.net/index.php "Forums")

# Championship Manager 2001/2002 Forums

Keeping the Game Alive

[Skip to content](https://champman0102.net/viewtopic.php?t=1540&start=75#start_here)

## [Offsets](https://champman0102.net/viewtopic.php?t=1540&start=75)

**Moderator:** [Patch Team](https://champman0102.net/memberlist.php?mode=group&g=21)

[Post Reply](https://champman0102.net/posting.php?mode=reply&t=1540 "Post a reply")

- [Print view](https://champman0102.net/viewtopic.php?t=1540&start=75&view=print "Print view")

764 posts


- [Page **4** of **31**](https://champman0102.net/viewtopic.php?t=1540&start=75# "Click to jump to page…")










  - Jump to page:

- [Previous](https://champman0102.net/viewtopic.php?t=1540&start=50)
- [1](https://champman0102.net/viewtopic.php?t=1540)
- [2](https://champman0102.net/viewtopic.php?t=1540&start=25)
- [3](https://champman0102.net/viewtopic.php?t=1540&start=50)
- 4
- [5](https://champman0102.net/viewtopic.php?t=1540&start=100)
- [6](https://champman0102.net/viewtopic.php?t=1540&start=125)
- …
- [31](https://champman0102.net/viewtopic.php?t=1540&start=750)
- [Next](https://champman0102.net/viewtopic.php?t=1540&start=100)

[![User avatar](https://champman0102.net/download/file.php?avatar=384_1614080104.jpg)](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)

[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)Patch Team**Posts:** 2541**Joined:** Wed Nov 25, 2020 5:01 am**Has thanked:** [240 times](https://champman0102.net/app.php/thankslist/givens/384/true)**Been thanked:** [862 times](https://champman0102.net/app.php/thankslist/givens/384/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=17818\#p17818)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=17818 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=17818 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=17818#p17818 "Post") by **[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)** » Sun Feb 21, 2021 11:18 am

Hi,

Because of game importance of nations is reversed by numbers in latest data updates (such as March 2018 Data Update, November 2020 Data Update) from the original 3.9.68 data, you can not arrange tour to major countries for pre-season.

If you do below change, you can arrange tour now to most of the countries. Applicable to save game and all patches.

00471E65 JL SHORT 00471E88

Note: If you see all countries even greyed out, there is no problem and no need to make offset change. This means that your database is probably based on 3.9.6x original database, not an updated one by database team. . If you promote to upper leagues and your finance is ok, you can go tour to all greyed countries without abobe offset change like original game.

Edit: offset change is updated for better solution

**\\* \[TUTORIAL\] How to install and run the game CM0102?> [viewtopic.php?f=85&t=3571](https://champman0102.net/viewtopic.php?f=85&t=3571)** **Please use search bar for solution before posting your issue**

[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)Hot Prospect for the Future**Posts:** 201**Joined:** Sun Nov 29, 2020 9:55 am**Has thanked:** [53 times](https://champman0102.net/app.php/thankslist/givens/3116/true)**Been thanked:** [59 times](https://champman0102.net/app.php/thankslist/givens/3116/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=17834\#p17834)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=17834 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=17834 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=17834#p17834 "Post") by **[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)** » Sun Feb 21, 2021 2:38 pm

Xeno,

Just on this. I have a saved game where I manage in Ireland. It's end of season (November) and I can only arrange tours to England, Scotland, Wales and Northern Ireland - there's about 100 countries greyed out. In Olly (for my database) the offset you have noted to change has 2 at the end. I changed this to 13 as you suggested and now in my save game I can only arrange tours to England and Scotland and there are only about 14 other countries listed (greyed out), so not sure this works or it might just be my save game.

[![User avatar](https://champman0102.net/download/file.php?avatar=384_1614080104.jpg)](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)

[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)Patch Team**Posts:** 2541**Joined:** Wed Nov 25, 2020 5:01 am**Has thanked:** [240 times](https://champman0102.net/app.php/thankslist/givens/384/true)**Been thanked:** [862 times](https://champman0102.net/app.php/thankslist/givens/384/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=17835\#p17835)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=17835 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=17835 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=17835#p17835 "Post") by **[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)** » Sun Feb 21, 2021 2:57 pm

@Footballer,

As I wrote below note, youR database is probably based on 3.9.6x original database.

I mean that if you see all countries even greyed out, there is no problem and no need to make offset change.

> [xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=17818#p17818) Sun Feb 21, 2021 11:18 am **Because of game importance of nations is reversed by numbers in latest data updates (such as March 2018 Data Update, November 2020 Data Update) from the original 3.9.68 data, you can not arrange tour to major countries for pre-season.**

For your below issue, you dont need to make my offset change as yours is related with your team reputation and finance. If you promote to upper leagues and your finance is ok, you can go tour to all greyed countries without my offset change.

> [Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=17834#p17834) Sun Feb 21, 2021 2:38 pm
> Just on this. I have a saved game where I manage in Ireland. It's end of season (November) and I can only arrange tours to England, Scotland, Wales and Northern Ireland - there's about 100 countries greyed out.

**\\* \[TUTORIAL\] How to install and run the game CM0102?> [viewtopic.php?f=85&t=3571](https://champman0102.net/viewtopic.php?f=85&t=3571)** **Please use search bar for solution before posting your issue**

[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)Hot Prospect for the Future**Posts:** 201**Joined:** Sun Nov 29, 2020 9:55 am**Has thanked:** [53 times](https://champman0102.net/app.php/thankslist/givens/3116/true)**Been thanked:** [59 times](https://champman0102.net/app.php/thankslist/givens/3116/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=17845\#p17845)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=17845 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=17845 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=17845#p17845 "Post") by **[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)** » Sun Feb 21, 2021 4:08 pm

Sorry, should have spotted that you'd mentioned it was original database - I'm on the March 2020 Saturn database.

Thanks for the explanation.

[![User avatar](https://champman0102.net/download/file.php?avatar=384_1614080104.jpg)](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)

[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)Patch Team**Posts:** 2541**Joined:** Wed Nov 25, 2020 5:01 am**Has thanked:** [240 times](https://champman0102.net/app.php/thankslist/givens/384/true)**Been thanked:** [862 times](https://champman0102.net/app.php/thankslist/givens/384/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=17852\#p17852)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=17852 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=17852 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=17852#p17852 "Post") by **[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)** » Sun Feb 21, 2021 5:35 pm

> [Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=17845#p17845) Sun Feb 21, 2021 4:08 pm
> Sorry, should have spotted that you'd mentioned it was original database - I'm on the March 2020 Saturn database.
>
> Thanks for the explanation.

@Footballer , offset change is updated in original post for better solution

**\\* \[TUTORIAL\] How to install and run the game CM0102?> [viewtopic.php?f=85&t=3571](https://champman0102.net/viewtopic.php?f=85&t=3571)** **Please use search bar for solution before posting your issue**

[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)Hot Prospect for the Future**Posts:** 201**Joined:** Sun Nov 29, 2020 9:55 am**Has thanked:** [53 times](https://champman0102.net/app.php/thankslist/givens/3116/true)**Been thanked:** [59 times](https://champman0102.net/app.php/thankslist/givens/3116/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=18747\#p18747)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=18747 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=18747 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=18747#p18747 "Post") by **[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)** » Fri Feb 26, 2021 4:08 pm

Bit of a long shot possibly, but does anyone have a list of the offsets for clubs in Olly - most of these are listed 9D0?? I tried using the club.dat file in Data but this does not correspond to the 9D0's that are listed in Olly - trying to replace the 4 English-based Welsh sides in the Welsh Premier Cup with 4 others (Cardiff, Swansea, Wrexham, Merthyr).

[![User avatar](https://champman0102.net/download/file.php?avatar=384_1614080104.jpg)](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)

[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)Patch Team**Posts:** 2541**Joined:** Wed Nov 25, 2020 5:01 am**Has thanked:** [240 times](https://champman0102.net/app.php/thankslist/givens/384/true)**Been thanked:** [862 times](https://champman0102.net/app.php/thankslist/givens/384/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=18751\#p18751)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=18751 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=18751 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=18751#p18751 "Post") by **[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)** » Fri Feb 26, 2021 4:17 pm

**\[DOCUMENTATION\] The \[9CF\*\*\*\] Thread** >>\> [viewtopic.php?f=35&t=2801](https://champman0102.net/viewtopic.php?f=35&t=2801)

will be updated if any more findings about 9CF / 9DO

**\\* \[TUTORIAL\] How to install and run the game CM0102?> [viewtopic.php?f=85&t=3571](https://champman0102.net/viewtopic.php?f=85&t=3571)** **Please use search bar for solution before posting your issue**

[![User avatar](https://champman0102.net/download/file.php?avatar=384_1614080104.jpg)](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)

[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)Patch Team**Posts:** 2541**Joined:** Wed Nov 25, 2020 5:01 am**Has thanked:** [240 times](https://champman0102.net/app.php/thankslist/givens/384/true)**Been thanked:** [862 times](https://champman0102.net/app.php/thankslist/givens/384/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=18753\#p18753)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=18753 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=18753 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=18753#p18753 "Post") by **[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)** » Fri Feb 26, 2021 4:18 pm

**\[DOCUMENTATION\] Offset Index : Decoding OllyDbg** >>\> [viewtopic.php?f=35&t=2802](https://champman0102.net/viewtopic.php?f=35&t=2802)

will be updated if any more findings

**\\* \[TUTORIAL\] How to install and run the game CM0102?> [viewtopic.php?f=85&t=3571](https://champman0102.net/viewtopic.php?f=85&t=3571)** **Please use search bar for solution before posting your issue**

**Deleted User 1932**

### [Offsets](https://champman0102.net/viewtopic.php?p=18754\#p18754)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=18754 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=18754 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=18754#p18754 "Post") by **Deleted User 1932** » Fri Feb 26, 2021 4:19 pm

> Welsh Premier Cup invites (untested):
>
> 00928A3D MOV EAX,DWORD PTR DS:\[9D0434\] (Cardiff City)
>
> 00928A62 MOV EAX,DWORD PTR DS:\[9D0430\] (Swansea City)
>
> 00928AA6 MOV EAX,DWORD PTR DS:\[9D0438\] (Merthyr Tydfil)
>
> 00928A85 MOV EAX,DWORD PTR DS:\[9D043C\] (Wrexham)

and

Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=75#)

```
006146CC MOV DWORD PTR DS:[9D00A4],EDI "MLS All Stars East" 009E1F08
006146E9 MOV DWORD PTR DS:[9D00A8],EDI "MLS All Stars West" 009E1EF4
00614706 MOV DWORD PTR DS:[9D00AC],EDI "River Plate" 009E1EE8
00614723 MOV DWORD PTR DS:[9D00B0],EDI "Vélez Sarsfield" 009E1ED8
00614740 MOV DWORD PTR DS:[9D00B4],EDI "Independiente" 009E1EC8
0061475D MOV DWORD PTR DS:[9D00B8],EDI "Independiente Rivadavia de Mendoza" 009E1EA4
0061477A MOV DWORD PTR DS:[9D00BC],EDI "Racing de Córdoba" 009E1E90
00614797 MOV DWORD PTR DS:[9D00C0],EDI "Villa Mitre de Bahía Blanca" 009E1E74
006147B4 MOV DWORD PTR DS:[9D00C4],EDI "Argentino de Rosario" 009E1E5C
006147D1 MOV DWORD PTR DS:[9D00C8],EDI "Temperley" 009E1E50
006147EE MOV DWORD PTR DS:[9D00CC],EDI "Lanús" 009E1E48
0061480B MOV DWORD PTR DS:[9D00D0],EDI "Boca Juniors" 009E1E38
00614828 MOV DWORD PTR DS:[9D00D4],EDI "Gimnasia y Esgrima de La Plata" 009E1E18
00614845 MOV DWORD PTR DS:[9D00D8],EDI "San Lorenzo de Almagro" 009E1E00
00614862 MOV DWORD PTR DS:[9D00DC],EDI "Argentinos Juniors" 009E1DEC
0061487F MOV DWORD PTR DS:[9D00E0],EDI "Rosario Central" 009E1DDC
0061489C MOV DWORD PTR DS:[9D00E4],EDI "Newell's Old Boys" 009E1DC8
006148B9 MOV DWORD PTR DS:[9D00E8],EDI "Racing Club" 009E1DBC
006148D6 MOV DWORD PTR DS:[9D00EC],EDI "Colón" 009E1DA8
006148F3 MOV DWORD PTR DS:[9D00F0],EDI "Platense" 009E1D9C
00614910 MOV DWORD PTR DS:[9D00F4],EDI "Ferro Carril Oeste" 009E1D88
0061492D MOV DWORD PTR DS:[9D00F8],EDI "Estudiantes de La Plata" 009E1D70
0061494A MOV DWORD PTR DS:[9D00FC],EDI "Gimnasia y Esgrima de Jujuy" 009E1D54
00614967 MOV DWORD PTR DS:[9D0100],EDI "Unión de Santa Fé" 009E1D40
00614984 MOV DWORD PTR DS:[9D0104],EDI "Huracán" 009E1D38
006149A1 MOV DWORD PTR DS:[9D0108],EDI "Talleres de Córdoba" 009E1D24
006149BE MOV DWORD PTR DS:[9D010C],EDI "Belgrano de Córdoba" 009E1D10
006149DB MOV DWORD PTR DS:[9D0110],EDI "Arsenal" 009E1D08
006149F8 MOV DWORD PTR DS:[9D0114],EDI "Crystal Palace" 009E1CF8
00614A15 MOV DWORD PTR DS:[9D0118],EDI "Glasgow Celtic" 009E1CE8
00614A32 MOV DWORD PTR DS:[9D011C],EDI "Glasgow Rangers" 009E1CD8
00614A4F MOV DWORD PTR DS:[9D0120],EDI "Athletic Club de Bilbao" 0098E568
00614A6C MOV DWORD PTR DS:[9D0124],EDI "C.D. Alavés" 0098E58C
00614A89 MOV DWORD PTR DS:[9D0128],EDI "Real Sociedad C.F." 0098E3C8
00614AA6 MOV DWORD PTR DS:[9D012C],EDI "Atlético de Madrid" 0098E2C4
00614AC3 MOV DWORD PTR DS:[9D0130],EDI "Atlético de Madrid B" 009E1CC0
00614AE0 MOV DWORD PTR DS:[9D0134],EDI "Athletic Club de Bilbao B" 009E1CA4
00614AFD MOV DWORD PTR DS:[9D0138],EDI "F.C. Barcelona" 0098E540
00614B1A MOV DWORD PTR DS:[9D013C],EDI "F.C. Barcelona B" 009E1C90
00614B37 MOV DWORD PTR DS:[9D0140],EDI "Real Valladolid" 0098E34C
00614B54 MOV DWORD PTR DS:[9D0144],EDI "Real Valladolid B" 009E1C7C
00614B71 MOV DWORD PTR DS:[9D0148],EDI "Málaga C.F." 0098E47C
00614B8E MOV DWORD PTR DS:[9D014C],EDI "Málaga C.F. B" 009E1C6C
00614BAB MOV DWORD PTR DS:[9D0150],EDI "Real Betis Balompié" 0098E520
00614BC8 MOV DWORD PTR DS:[9D0154],EDI "Real Betis Balompié B" 009E1C54
00614BE5 MOV DWORD PTR DS:[9D0158],EDI "Real Club Celta de Vigo" 0098E4FC
00614C02 MOV DWORD PTR DS:[9D015C],EDI "Real Club Celta de Vigo B" 009E1C38
00614C1F MOV DWORD PTR DS:[9D0160],EDI "Deportivo de La Coruña" 0098E4D8
00614C3C MOV DWORD PTR DS:[9D0164],EDI "Deportivo de La Coruña B" 009E1C1C
00614C59 MOV DWORD PTR DS:[9D0168],EDI "R.C.D. Espanyol" 0098E4B8
00614C76 MOV DWORD PTR DS:[9D016C],EDI "R.C.D. Espanyol B" 009E1C08
00614C93 MOV DWORD PTR DS:[9D0170],EDI "C.D. Logroñés" 009E1BF8
00614CB0 MOV DWORD PTR DS:[9D0174],EDI "C.D. Logroñés B" 009E1BE8
00614CCD MOV DWORD PTR DS:[9D0178],EDI "R.C.D. Mallorca" 0098E460
00614CEA MOV DWORD PTR DS:[9D017C],EDI "R.C.D. Mallorca B" 009E1BD4
00614D07 MOV DWORD PTR DS:[9D0180],EDI "Club Atlético Osasuna" 0098E438
00614D24 MOV DWORD PTR DS:[9D0184],EDI "Club Atlético Osasuna B" 009E1BBC
00614D41 MOV DWORD PTR DS:[9D0188],EDI "Real Oviedo C.F." 0098E0FC
00614D5E MOV DWORD PTR DS:[9D018C],EDI "Real Oviedo C.F. B" 009E1BA8
00614D7B MOV DWORD PTR DS:[9D0190],EDI "Real Madrid C.F." 0098E3EC
00614D98 MOV DWORD PTR DS:[9D0194],EDI "Real Madrid C.F. B" 009E1B94
00614DB5 MOV DWORD PTR DS:[9D0198],EDI "Sevilla C.F." 0098E3A8
00614DD2 MOV DWORD PTR DS:[9D019C],EDI "Sevilla C.F. B" 009E1B84
00614DEF MOV DWORD PTR DS:[9D01A0],EDI "Real Sociedad C.F. B" 009E1B6C
00614E0C MOV DWORD PTR DS:[9D01A4],EDI "Instituto de Córdoba" 009E1B54
00614E29 MOV DWORD PTR DS:[9D01A8],EDI "San Martín de San Juan" 009E1B3C
00614E46 MOV DWORD PTR DS:[9D01AC],EDI "Gimnasia y Tiro de Salta" 009E1B20
00614E63 MOV DWORD PTR DS:[9D01B0],EDI "Atlético Rafaela" 009E1B0C
00614E80 MOV DWORD PTR DS:[9D01B4],EDI "San Martín de Tucumán" 009E1AF4
00614E9D MOV DWORD PTR DS:[9D01B8],EDI "Almirante Brown de Arrecifes" 009E1AD4
00614EBA MOV DWORD PTR DS:[9D01BC],EDI "Atlético Tucumán" 009E1AC0
00614ED7 MOV DWORD PTR DS:[9D01C0],EDI "Olimpo de Bahía Blanca" 009E1AA8
00614EF4 MOV DWORD PTR DS:[9D01C4],EDI "Huracán de Corrientes" 009E1A90
00614F11 MOV DWORD PTR DS:[9D01C8],EDI "Aldosivi" 009E1A84
00614F2E MOV DWORD PTR DS:[9D01CC],EDI "Cipolletti de Río Negro" 009E1A6C
00614F4B MOV DWORD PTR DS:[9D01D0],EDI "San Martín de Mendoza" 009E1A54
00614F68 MOV DWORD PTR DS:[9D01D4],EDI "Douglas Haig" 009E1A44
00614F85 MOV DWORD PTR DS:[9D01D8],EDI "Gimnasia y Esgrima de Concepción del Uruguay" 009E1A14
00614FA2 MOV DWORD PTR DS:[9D01DC],EDI "Juventud Antoniana de Salta" 009E19F8
 006152B1 MOV DWORD PTR DS:[9D01E0],EDI "Godoy Cruz de Mendoza" 009E19E0
* also: "Godoy Cruz Antonio Tomba" 009E19C4
00614FEB MOV DWORD PTR DS:[9D01E4],EDI "Banfield" 009E19B8
00615008 MOV DWORD PTR DS:[9D01E8],EDI "Los Andes" 009E19AC
00615025 MOV DWORD PTR DS:[9D01EC],EDI "Quilmes" 009E19A4
00615042 MOV DWORD PTR DS:[9D01F0],EDI "Central Córdoba de Rosario" 009E1988
0061505F MOV DWORD PTR DS:[9D01F4],EDI "Chacarita Juniors" 009E1974
0061507C MOV DWORD PTR DS:[9D01F8],EDI "All Boys" 009E1968
00615099 MOV DWORD PTR DS:[9D01FC],EDI "San Miguel" 009E195C
006150B6 MOV DWORD PTR DS:[9D0200],EDI "Nueva Chicago" 009E194C
006150D3 MOV DWORD PTR DS:[9D0204],EDI "Defensa y Justicia" 009E1938
006150F0 MOV DWORD PTR DS:[9D0208],EDI "Arsenal de Sarandí" 009E1924
0061510D MOV DWORD PTR DS:[9D020C],EDI "Huracán de Tres Arroyos" 009E190C
0061512A MOV DWORD PTR DS:[9D0210],EDI "Defensores de Belgrano" 009E18F4
00615147 MOV DWORD PTR DS:[9D0214],EDI "Deportivo Morón" 009E18E4
00615164 MOV DWORD PTR DS:[9D0218],EDI "Estudiantes de Buenos Aires" 009E18C8
00615181 MOV DWORD PTR DS:[9D021C],EDI "Almagro" 009E18C0
0061519E MOV DWORD PTR DS:[9D0220],EDI "Atlanta" 009E18B8
006151BB MOV DWORD PTR DS:[9D0224],EDI "Deportivo Español" 009E18A4
006151D8 MOV DWORD PTR DS:[9D0228],EDI "El Porvenir" 009E1898
006151F5 MOV DWORD PTR DS:[9D022C],EDI "Tigre" 009E1890
00615212 MOV DWORD PTR DS:[9D0230],EDI "Middlesbrough" 009E1880
006152A9 MOV DWORD PTR DS:[9D0234],EDI "Newcastle United" 009E186C
*also "Newcastle" 009E1860
00615253 MOV DWORD PTR DS:[9D0238],EDI "Sunderland" 009E1854
0061526D MOV DWORD PTR DS:[9D023C],EDI "Aston Villa" 009E1848
00615287 MOV DWORD PTR DS:[9D0240],EDI "Manchester United" 009E1834
006152A1 MOV DWORD PTR DS:[9D0244],EDI "Liverpool" 009E1828
006152C9 MOV DWORD PTR DS:[9D0248],EDI "Everton" 009E1820
006152E6 MOV DWORD PTR DS:[9D024C],EDI "Tottenham Hotspur" 009E180C
00615303 MOV DWORD PTR DS:[9D0250],EDI "Chelsea" 009E1804
00615320 MOV DWORD PTR DS:[9D0254],EDI "Valencia C.F." 0098E36C
0061533D MOV DWORD PTR DS:[9D0258],EDI ASCII "Valencia C.F. B" 009E17F4
0061535A MOV DWORD PTR DS:[9D0260],EDI ASCII "Southampton" 009E17E8
00615377 MOV DWORD PTR DS:[9D025C],EDI "Brighton and Hove Albion" 009E17CC
00615394 MOV DWORD PTR DS:[9D0264],EDI "AS Monaco" 009E17C0
006153B1 MOV DWORD PTR DS:[9D0268],EDI "FC Metz" 009E17B8
006153CE MOV DWORD PTR DS:[9D026C],EDI "Cruzeiro Esporte Clube" 009E17A0
006153EB MOV DWORD PTR DS:[9D0270],EDI "São Paulo Futebol Clube" 0098A46C
00615408 MOV DWORD PTR DS:[9D0274],EDI "Sociedade Esportiva Palmeiras" 0098A4F0
00615425 MOV DWORD PTR DS:[9D0278],EDI "Sport Club Corinthians Paulista" 0098A2A8
006157BA MOV DWORD PTR DS:[9D027C],EDI "Gremio Foot Ball Porto Alegre" 009E1780
*also "Grêmio Foot Ball Porto-Alegrense" 009E175C
*also "Grêmio Foot-Ball Porto-Alegrense" 0098A304
00615484 MOV DWORD PTR DS:[9D0354],EDI "Clube de Regatas Vasco da Gama" 009E173C
006154A1 MOV DWORD PTR DS:[9D0280],EDI "Club Social y Deportivo Colo Colo" 009E1718
006157B2 MOV DWORD PTR DS:[9D0284],EDI "Univ.de Chile" 009E1708
*also "Univ. de Chile" 009E16F8
*also "Corporación de Fútbol de la Universidad de Chile" 009E16C4
*also "Club de Fútbol de la Universidad de Chile" 009E1698
006157AA MOV DWORD PTR DS:[9D0288],EDI "Univ.Catolica" 009E1688
*also "Universidad Catolica" 009E1670
*also "Club Deportivo Universidad Católica" 009E164C
006157A2 MOV DWORD PTR DS:[9D028C],EDI "Club Nacional de Fútbol" 009E1634
*also "Nacional Montevideo" 009E1620
0061579A MOV DWORD PTR DS:[9D0290],EDI "Olimpia" 009E1618
*also "Club Olimpia" 009E1608
00615792 MOV DWORD PTR DS:[9D0294],EDI "Cerro Porteño" 009E15F8
*also "Club Cerro Porteño" 009E15E4
0061578A MOV DWORD PTR DS:[9D0358],EDI "Clube de Regatas Flamengo" 009E15C8
*also "Clube de Regatas do Flamengo" 0098A2E4
00615782 MOV DWORD PTR DS:[9D0298],EDI "Club Atlético Peñarol" 009E15B0
*also "Penarol" 009E15A8
00615634 MOV DWORD PTR DS:[9D029C],EDI "Elgin City" 009E159C
00615651 MOV DWORD PTR DS:[9D02A0],EDI "Peterhead" 009E1590
0061566E MOV DWORD PTR DS:[0B63CDC],EDI "1.FC Kaiserslautern" 009E157C
0061577A MOV DWORD PTR DS:[0B63C9C],EDI "1.FC Kaiserslautern Amateure" 009E155C
*also "1.FC Kaiserslautern (A)" 009E1544
006156B7 MOV DWORD PTR DS:[0B63CBC],EDI "Bayer 04 Leverkusen" 009E1530
00615772 MOV DWORD PTR DS:[0B63CA0],EDI "Bayer Leverkusen Amateure" 009E1514
*also "Bayer Leverkusen (A)" 009E14FC
"Bayer 04 Leverkusen U21" 009E14E4
0061576A MOV DWORD PTR DS:[0B63CE8],EDI "Borussia Dortmund" 009E14D0
*also "BV Borussia Dortmund" 009E14B8
00615762 MOV DWORD PTR DS:[0B63CAC],EDI "Borussia Dortmund Amateure" 009E149C
*also "Borussia Dortmund (A)" 009E1484
0061575A MOV DWORD PTR DS:[0B63CD8],EDI "FC Bayern München" 009E1470
0061683D MOV DWORD PTR DS:[0B63CD0],EDI "Bayern München Amateure" 009E1458
*also "FC Bayern München Amateure" 009E143C
006157FE MOV DWORD PTR DS:[0B63CB4],EDI "FC St. Pauli" 009E142C
00616835 MOV DWORD PTR DS:[0B63CB0],EDI "FC St. Pauli Amateure" 009E1414
*also "FC St. Pauli (A)" 009E1400
00615847 MOV DWORD PTR DS:[0B63CD4],EDI "Hamburger SV" 009E13F0
0061682D MOV DWORD PTR DS:[0B63CA8],EDI "Hamburger SV Amateure" 009E13D8
*also "Hamburger SV (A)" 009E13C4
00615890 MOV DWORD PTR DS:[0B63CE4],EDI "Hertha BSC Berlin" 009E13B0
00616825 MOV DWORD PTR DS:[0B63CEC],EDI "Hertha BSC Amateure" 009E139C
*also "Hertha BSC (A)" 009E138C
006158D9 MOV DWORD PTR DS:[0B63CF0],EDI "Karlsruher SC" 009E137C
0061681D MOV DWORD PTR DS:[0B63CF8],EDI "Karlsruher SC Amateure" 009E1364
*also ASCII "Karlsruher SC (A)" 009E1350
*also "Karlsruher SC II" 009E133C
00615938 MOV DWORD PTR DS:[0B63CC0],EDI "SV Werder Bremen" 009E1328
00616815 MOV DWORD PTR DS:[0B63D00],EDI "SV Werder Bremen Amateure" 009E130C
*also "SV Werder Bremen (A)" 009E12F4
0061680D MOV DWORD PTR DS:[0B63CC8],EDI "TSV München 1860" 009E12E0
*also "TSV 1860 München"  009E12CC
00616805 MOV DWORD PTR DS:[0B63CCC],EDI "TSV München 1860 Amateure" 009E12B0
*also "TSV 1860 München Amateure" 009E1294
006159D9 MOV DWORD PTR DS:[0B63CE0],EDI "Tennis Borussia Berlin" 009E127C
006167FD MOV DWORD PTR DS:[0B63CB8],EDI "Tennis Borussia Amateure" 009E1260
*also "Tennis Borussia (A)" 009E124C
*also "Tennis Borussia Berlin II" 009E1230
00615A38 MOV DWORD PTR DS:[0B63CC4],EDI "VfB Stuttgart" 009E1220
006167F5 MOV DWORD PTR DS:[0B63CF4],EDI "VfB Stuttgart Amateure" 009E1208
*also "VfB Stuttgart (A)" 009E11F4
00615A81 MOV DWORD PTR DS:[0B63CFC],EDI "VfL Bochum" 009E11E8
006167ED MOV DWORD PTR DS:[0B63CA4],EDI "VfL Bochum Amateure" 009E11D4
*also "VfL Bochum (A)" 009E11C4
00615ACA MOV DWORD PTR DS:[9D02A4],EDI "Eintracht Frankfurt" 009E11B0
006167E5 MOV DWORD PTR DS:[9D02A8],EDI "Eintracht Frankfurt Amateure" 009E1190
*also "Eintracht Frankfurt (A)" 009E1178
00615B13 MOV DWORD PTR DS:[9D02AC],EDI "FC Hansa Rostock" 009E1164
006167DD MOV DWORD PTR DS:[9D02B0],EDI "FC Hansa Rostock Amateure" 009E1148
*also "FC Hansa Rostock (A)" 009E1130
00615B5C MOV DWORD PTR DS:[9D02B4],EDI "FC Schalke 04" 009E1120
006167D5 MOV DWORD PTR DS:[9D02B8],EDI "FC Schalke 04 Amateure" 009E1108
*also "FC Schalke 04 Amateure" 009E1108
00615BA5 MOV DWORD PTR DS:[9D02BC],EDI "SG Wattenscheid 09" 009E10E0
006167CD MOV DWORD PTR DS:[9D02C0],EDI "SG Wattenscheid 09 Amateure" 009E10C4
*also "SG Wattenscheid 09 (A)" 009E10AC
*also "SG Wattenscheid 09 II" 009E1094
00615C04 MOV DWORD PTR DS:[9D02C4],EDI "Sport Lisboa e Benfica" 009E107C
00615C21 MOV DWORD PTR DS:[9D02C8],EDI "Sport Lisboa e Benfica B" 009E1060
00615C3E MOV DWORD PTR DS:[9D02CC],EDI "Sporting Clube de Braga" 009E1048
00615C5B MOV DWORD PTR DS:[9D02D0],EDI "Sporting Clube de Braga B" 009E102C
00615C78 MOV DWORD PTR DS:[9D02D4],EDI "Clube Sport Marítimo" 009E1014
00615C95 MOV DWORD PTR DS:[9D02D8],EDI "Clube Sport Marítimo B" 009E0FFC
00615CB2 MOV DWORD PTR DS:[9D02DC],EDI "Futebol Clube do Porto" 009E0FE4
00615CCF MOV DWORD PTR DS:[9D02E0],EDI "Futebol Clube do Porto B" 009E0FC8
00615CEC MOV DWORD PTR DS:[9D02E4],EDI "S.D. Éibar" 0098E250
00615D09 MOV DWORD PTR DS:[9D02E8],EDI "Amurrio C.F." 009E0FB8
00615D26 MOV DWORD PTR DS:[9D02EC],EDI "C.D. Aurrerá Vitoria" 009E0FA0
00615D43 MOV DWORD PTR DS:[9D02F0],EDI "Barakaldo C.F." 009E0F90
00615D60 MOV DWORD PTR DS:[9D02F4],EDI "S.D. Beasaín" 009E0F80
00615D7D MOV DWORD PTR DS:[9D02F8],EDI "Bermeo Club" 009E0F74
00615D9A MOV DWORD PTR DS:[9D02FC],EDI "Gernika Club" 009E0F64
00615DB7 MOV DWORD PTR DS:[9D0304],EDI "S.D. Lemona" 009E0F58
00615DD4 MOV DWORD PTR DS:[9D0308],EDI "Elgoibar C.D." 009E0F48
006167C5 MOV DWORD PTR DS:[9D030C],EDI "Hernani C.D." 009E0F38
*also "C.D. Hernani" 009E0F28
00615E1D MOV DWORD PTR DS:[9D0310],EDI "Zalla U.C." 009E0F1C
00615E3A MOV DWORD PTR DS:[9D0314],EDI "Cultural Durango" 009E0F08
00615E57 MOV DWORD PTR DS:[9D0318],EDI "S.D. Amorebieta" 009E0EF8
00615E74 MOV DWORD PTR DS:[9D031C],EDI "Arenas Getxo Bilbao" 009E0EE4
00615E91 MOV DWORD PTR DS:[9D0320],EDI "Aurrerá Ondarroa C.D." 009E0ECC
00615EAE MOV DWORD PTR DS:[9D0324],EDI "Baskonia C.D." 009E0EBC
00615ECB MOV DWORD PTR DS:[9D0328],EDI "S.D. Éibar B" 009E0EAC
006167BD MOV DWORD PTR DS:[9D032C],EDI "U.D. San Pedro" 009E0E9C
*also "San Pedro U.D." 009E0E8C
00615F14 MOV DWORD PTR DS:[9D0330],EDI "Santurtzi C.D." 009E0E7C
00615F31 MOV DWORD PTR DS:[9D0334],EDI "Sestao River Club" 009E0E68
00615F4E MOV DWORD PTR DS:[9D0338],EDI "Tolosa C.F." 009E0E5C
00615F6B MOV DWORD PTR DS:[9D033C],EDI "Coritiba Football Club" 0098A664
00615F88 MOV DWORD PTR DS:[9D0340],EDI "Santos Futebol Clube" 0098A4BC
00615FA5 MOV DWORD PTR DS:[9D0344],EDI "Sport Club do Recife" 0098A4A4
006167B2 MOV DWORD PTR DS:[9D0348],EDI "Associação Portugesa de Desportos" 009E0E38
*also Associação Portuguesa de Desportos 009E0E14
00615FEE MOV DWORD PTR DS:[9D0350],EDI "Clube Atlético Mineiro" 0098A70C
0061600B MOV DWORD PTR DS:[9D0354],EDI "Clube de Regatas Vasco da Gama" 009E173C
00616028 MOV DWORD PTR DS:[9D0358],EDI "Clube de Regatas Flamengo" 009E15C8
00616045 MOV DWORD PTR DS:[9D035C],EDI "Sport Club Internacional" 0098A7C0
00616062 MOV DWORD PTR DS:[9D0360],EDI "Esporte Clube Vitória" 0098A800
006167A7 MOV DWORD PTR DS:[9D0364],EDI "Botafogo Futebol Clube" 009E0DFC
*also "Botafogo de Futebol e Regatas" 0098A58C
006160AB MOV DWORD PTR DS:[9D0368],EDI "Clube Atlético Paranaense" 0098A2C8
006160C8 MOV DWORD PTR DS:[9D036C],EDI "Associação Atlética Ponte Preta" 0098A484
006160E5 MOV DWORD PTR DS:[9D0370],EDI "Esporte Clube Juventude" 0098A7A8
00616102 MOV DWORD PTR DS:[9D0374],EDI "Guarani Futebol Clube" 009E0DE4
0061611F MOV DWORD PTR DS:[9D0378],EDI "Paraná Clube" 0098A6A4
0061613C MOV DWORD PTR DS:[9D037C],EDI "Chicago Fire" 009E0DD4
00616159 MOV DWORD PTR DS:[9D0380],EDI "Miami Fusion FC" 009E0DC4
00616176 MOV DWORD PTR DS:[9D0384],EDI "Washington DC United" 009E0DAC
00616193 MOV DWORD PTR DS:[9D0388],EDI "Tampa Bay Mutiny" 009E0D98
0061679C MOV DWORD PTR DS:[9D038C],EDI "San Jose Earthquakes" 009E0D80
*also "San Jose Clash" 009E0D70
006161DC MOV DWORD PTR DS:[9D0390],EDI "New England Revolution" 009E0D58
00616791 MOV DWORD PTR DS:[9D0394],EDI "NY/NJ Metrostars" 009E0D44
*also "NY-NJ Metrostars" 009E0D30
*also "NYNJ Metrostars" 009E0D20
0061623B MOV DWORD PTR DS:[9D0398],EDI "Los Angeles Galaxy" 009E0D0C
00616258 MOV DWORD PTR DS:[9D039C],EDI "Kansas City Wizards" 009E0CF8
00616275 MOV DWORD PTR DS:[9D03A0],EDI "Dallas Burn" 009E0CEC
00616292 MOV DWORD PTR DS:[9D03A4],EDI "Columbus Crew" 009E0CDC
006162AF MOV DWORD PTR DS:[9D03A8],EDI "Colorado Rapids" 009E0CCC
006162CC MOV DWORD PTR DS:[9D03AC],EDI "Albacete Balompié" 0098E2E8
006162E9 MOV DWORD PTR DS:[9D03B0],EDI "Albacete Balompié B" 009E0CB8
00616306 MOV DWORD PTR DS:[9D03B4],EDI "C.D. Badajoz" 0098E29C
00616323 MOV DWORD PTR DS:[9D03B8],EDI "C.D. Badajoz B" 009E0CA8
00616340 MOV DWORD PTR DS:[9D03BC],EDI "C.D. Leganés" 0098E19C
0061635D MOV DWORD PTR DS:[9D03C0],EDI "C.D. Leganés B" 009E0C98
0061637A MOV DWORD PTR DS:[9D03C4],EDI "C.D. Tenerife" 0098E38C
00616397 MOV DWORD PTR DS:[9D03C8],EDI "C.D. Tenerife B" 009E0C88
006163B4 MOV DWORD PTR DS:[9D03CC],EDI "C.P. Mérida" 009E0C7C
00616786 MOV DWORD PTR DS:[9D03D0],EDI "C.P. Mérida B" 009E0C6C
*also "C.P. Mérida Promesas" 009E0C54
006163FD MOV DWORD PTR DS:[9D03D4],EDI "Deportivo Alavés B" 009E0C40
0061641A MOV DWORD PTR DS:[9D03D8],EDI "Extremadura C.F." 0098E1F8
00616437 MOV DWORD PTR DS:[9D03DC],EDI "Extremadura C.F. B" 009E0C2C
00616454 MOV DWORD PTR DS:[9D03E0],EDI "Racing Club de Santander" 0098E0D4
00616471 MOV DWORD PTR DS:[9D03E4],EDI "Racing Club de Santander B" 009E0C10
0061648E MOV DWORD PTR DS:[9D03E8],EDI "Rayo Vallecano de Madrid" 0098E410
006164AB MOV DWORD PTR DS:[9D03EC],EDI "Rayo Vallecano de Madrid B" 009E0BF4
006164C8 MOV DWORD PTR DS:[9D03F0],EDI "Real Murcia C.F." 0098E160
006164E5 MOV DWORD PTR DS:[9D03F4],EDI "Real Murcia C.F. B" 009E0BE0
00616502 MOV DWORD PTR DS:[9D03F8],EDI "Real Sporting de Gijón" 0098E064
0061651F MOV DWORD PTR DS:[9D03FC],EDI "Real Sporting de Gijón B" 009E0BC4
0061653C MOV DWORD PTR DS:[9D0400],EDI "Real Zaragoza" 0098E30C
00616559 MOV DWORD PTR DS:[9D0404],EDI "Real Zaragoza B" 009E0BB4
00616576 MOV DWORD PTR DS:[9D0408],EDI "S.D. Compostela" 009E0BA4
00616593 MOV DWORD PTR DS:[9D040C],EDI "S.D. Compostela B" 009E0B90
006165B0 MOV DWORD PTR DS:[9D0410],EDI "U.D. Las Palmas" 0098E498
006165CD MOV DWORD PTR DS:[9D0414],EDI "U.D. Las Palmas B" 009E0B7C
006165EA MOV DWORD PTR DS:[9D0418],EDI "U.D. Salamanca" 0098E08C
00616607 MOV DWORD PTR DS:[9D041C],EDI "U.D. Salamanca B" 009E0B68
0061677B MOV DWORD PTR DS:[9D0420],EDI "Galatasaray" 009E0B5C
*also "Galatasaray SK" 009E0B4C
00616770 MOV DWORD PTR DS:[9D0424],EDI "BJK Besiktas" 009E0B3C
*also "Besiktas JK" 009E0B30
00616765 MOV DWORD PTR DS:[9D0428],EDI "Fenerbaçhe" 009E0B24
*also "Fenerbaçhe SK" 009E0B14
006166A8 MOV DWORD PTR DS:[9D042C],EDI "General Paz Juniors de Córdoba" 009E0AF4
006166C5 MOV DWORD PTR DS:[9D0430],EDI "Swansea City" 009E0AE4
006166E2 MOV DWORD PTR DS:[9D0434],EDI "Cardiff City" 009E0AD4
006166FF MOV DWORD PTR DS:[9D0438],EDI "Merthyr Tydfil" 009E0AC4
0061671C MOV DWORD PTR DS:[9D043C],EDI "Wrexham" 009E0ABC
00616739 MOV DWORD PTR DS:[9D0440],EDI "Sporting Clube De Portugal" 009E0AA0
0061675A MOV DWORD PTR DS:[9D0444],EDI "Sporting Clube De Portugal B" 009E0A80
00616855 MOV DWORD PTR DS:[9D0448],EDI "Arminia Bielefeld" 009E0A6C
00616F0C MOV DWORD PTR DS:[9D044C],EDI "Arminia Bielefeld Amateure" 009E0A50
*also "Arminia Bielefeld II" 009E0A38
0061689C MOV DWORD PTR DS:[9D0450],EDI "FC Energie Cottbus" 009E0A24
00616F03 MOV DWORD PTR DS:[9D0454],EDI "FC Energie Cottbus Amateure" 009E0A08
*also "FC Energie Cottbus II" 009E09F0
006168E3 MOV DWORD PTR DS:[9D0458],EDI "MSV Duisburg" 009E09E0
006168FE MOV DWORD PTR DS:[9D045C],EDI "MSV Duisburg Amateure" 009E09C8
00616919 MOV DWORD PTR DS:[9D0460],EDI "Hannover 96" 009E09BC
00616934 MOV DWORD PTR DS:[9D0464],EDI "Hannover 96 Amateure" 009E09A4
0061694F MOV DWORD PTR DS:[9D0468],EDI "1.FC Köln" 009E0998
00616EFA MOV DWORD PTR DS:[9D046C],EDI "1.FC Köln Amateure" 009E0984
*also "1.FC Köln U23" 009E0974
00616EF1 MOV DWORD PTR DS:[9D0470],EDI "Borussia M'gladbach" 009E0960
*also "Borussia Mgladbach" 009E094C
006169C2 MOV DWORD PTR DS:[9D0474],EDI "Bor. M'gladbach Amateure" 009E0930
006169DD MOV DWORD PTR DS:[9D0478],EDI "1.FC Nürnberg" 009E0920
006169F8 MOV DWORD PTR DS:[9D047C],EDI "1.FC Nürnberg Amateure" 009E0908
00616EE8 MOV DWORD PTR DS:[9D0480],EDI "Rot-Weiss Oberhausen" 009E08F0
*also "Rot-Weiß Oberhausen" 009E08DC
00616A3F MOV DWORD PTR DS:[9D0484],EDI "RW Oberhausen Amateure" 009E08C4
00616A5A MOV DWORD PTR DS:[9D0488],EDI "SC Freiburg" 009E08B8
00616A75 MOV DWORD PTR DS:[9D048C],EDI "SC Freiburg Amateure" 009E08A0
00616A90 MOV DWORD PTR DS:[9D0490],EDI "1.FC Saarbrücken" 009E088C
00616EDF MOV DWORD PTR DS:[9D0494],EDI "1.FC Saarbrücken Amaeteure" 009E0870
*also "1.FC Saarbrücken II" 009E085C
00616AD7 MOV DWORD PTR DS:[9D0498],EDI "SSV Ulm 1846" 009E084C
00616ED6 MOV DWORD PTR DS:[9D049C],EDI "SSV Ulm 1846 Amateure" 009E0834
*also "SSV Ulm 1846 II" 009E0824
00616B1E MOV DWORD PTR DS:[9D04A0],EDI "SpVgg Unterhaching" 009E0810
00616ECD MOV DWORD PTR DS:[9D04A4],EDI "SpVgg Unterhaching Amateure" 009E07F4
*also "SpVgg Unterhaching II" 009E07DC
00616B65 MOV DWORD PTR DS:[9D04A8],EDI "VfB Leipzig" 009E07D0
00616EC4 MOV DWORD PTR DS:[9D04AC],EDI "VfB Leipzig Amateure" 009E07B8
*also "VfB Leipzig II" 009E07A8
00616BAC MOV DWORD PTR DS:[9D04B0],EDI "VfL Wolfsburg" 009E0798
00616BC7 MOV DWORD PTR DS:[9D04B4],EDI "VfL Wolfsburg Amateure" 009E0780
00616BE2 MOV DWORD PTR DS:[9D04B8],EDI "C.D. Castellón" 009E0770
00616BFD MOV DWORD PTR DS:[9D04BC],EDI "C.D. Castellón B" 009E075C
00616C18 MOV DWORD PTR DS:[9D04C0],EDI "C.D. Badajoz" 0098E29C
00616C33 MOV DWORD PTR DS:[9D04C4],EDI "C.D. Badajoz B" 009E0CA8
00616C4E MOV DWORD PTR DS:[9D04C8],EDI "C.D. Logroñés" 009E1BF8 *********duplicate
00616C69 MOV DWORD PTR DS:[9D04CC],EDI "C.D. Logroñés B" 009E1BE8 *********duplicate
00616C84 MOV DWORD PTR DS:[9D04D0],EDI "C.D. Ourense" 009E074C
00616C9F MOV DWORD PTR DS:[9D04D4],EDI "C.D. Ourense B" 009E073C
00616CBA MOV DWORD PTR DS:[9D04D8],EDI "Córdoba C.F." 0098E268
00616CD5 MOV DWORD PTR DS:[9D04DC],EDI "Córdoba C.F. B" 009E072C
00616CF0 MOV DWORD PTR DS:[9D04E0],EDI "Cultural Leonesa" 009E0718
00616D0B MOV DWORD PTR DS:[9D04E4],EDI "Cultural Leonesa B" 009E0704
00616D26 MOV DWORD PTR DS:[9D04E8],EDI "Elche C.F." 0098E218
00616D41 MOV DWORD PTR DS:[9D04EC],EDI "Elche C.F. B" 009E06F4
00616D5C MOV DWORD PTR DS:[9D04F0],EDI "Levante U.D." 0098E180
00616D77 MOV DWORD PTR DS:[9D04F4],EDI "Levante U.D. B" 009E06E4
00616D92 MOV DWORD PTR DS:[9D04F8],EDI "Real Uniòn de Irún" 009E06D0
00616DAD MOV DWORD PTR DS:[9D04FC],EDI "Real Uniòn de Irún B" 009E06B8
00616DC8 MOV DWORD PTR DS:[9D0500],EDI "Recreativo de Huelva" 0098E0AC
00616DE3 MOV DWORD PTR DS:[9D0504],EDI "Recreativo de Huelva B" 009E06A0
00616DFE MOV DWORD PTR DS:[9D0508],EDI "Fortuna Düsseldorf" 009E068C
00616E19 MOV DWORD PTR DS:[9D050C],EDI "Fortuna Düsseldorf ii" 009E0674
00616E34 MOV DWORD PTR DS:[9D0510],EDI "sg hoechst" 009E0668
00616E4F MOV DWORD PTR DS:[9D0514],EDI "sg hoechst ii" 009E0658
00616E6A MOV DWORD PTR DS:[9D0518],EDI "fsv mainz 05" 009E0648
00616E85 MOV DWORD PTR DS:[9D051C],EDI "fsv mainz 05 ii" 009E0638
00616EA0 MOV DWORD PTR DS:[9D0520],EDI "stuttgarter kickers" 009E0624
00616EBB MOV DWORD PTR DS:[9D0524],EDI "stuttgarter kickers ii" 009E060C
```

[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)Hot Prospect for the Future**Posts:** 201**Joined:** Sun Nov 29, 2020 9:55 am**Has thanked:** [53 times](https://champman0102.net/app.php/thankslist/givens/3116/true)**Been thanked:** [59 times](https://champman0102.net/app.php/thankslist/givens/3116/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=18755\#p18755)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=18755 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=18755 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=18755#p18755 "Post") by **[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)** » Fri Feb 26, 2021 4:28 pm

Thanks Alan and Xeno. I did manage to find the 9D0 list of clubs.

Interestingly in club.dat I surmised that the code to use for Cardiff was 8B7 so replaced in Olly (in Welsh Prem Cup) their code of 9D0434 with 8B7 - low and behold Falkirk appeared in the game. (Interestingly Falkirk are not listed with a 9D0 value, or not one that has been recorded onto a list by anyone yet).

The 9D0 values can clearly be replaced with a hex value as is done for competition swaps - it just trying to work out what the hex value for each club is....

**Deleted User 1932**

### [Offsets](https://champman0102.net/viewtopic.php?p=18756\#p18756)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=18756 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=18756 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=18756#p18756 "Post") by **Deleted User 1932** » Fri Feb 26, 2021 4:37 pm

The Falkirk code has been recorded, in a round-about way. See about 2/3 of the way down this post: [https://champman0102.co.uk/showthread.p ... post336359](https://champman0102.co.uk/showthread.php?t=68&page=61&p=336359#post336359)

[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)Hot Prospect for the Future**Posts:** 201**Joined:** Sun Nov 29, 2020 9:55 am**Has thanked:** [53 times](https://champman0102.net/app.php/thankslist/givens/3116/true)**Been thanked:** [59 times](https://champman0102.net/app.php/thankslist/givens/3116/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=18758\#p18758)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=18758 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=18758 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=18758#p18758 "Post") by **[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)** » Fri Feb 26, 2021 4:52 pm

Okay. Thanks for that. Still, trying to locate the right code to use for other clubs is difficult. For what it's worth replacing Cardiff's 9D0 value with "8" brings up Kitzbuhel in the game, so that's one found at least. ![:lol:](https://champman0102.net/images/smilies/icon_lol.gif)

I've basically tried to turn the Welsh Prem Cup into a Canadian Cup with the 8 Canadian Premier League teams and then the 4 American-based Canadian teams replacing those 4 Welsh teams. So trying to find code for Toronto, Toronto II, Vancouver and Montreal....

[John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338)Patch Team**Posts:** 326**Joined:** Wed Nov 25, 2020 12:26 am**Has thanked:** [175 times](https://champman0102.net/app.php/thankslist/givens/338/true)**Been thanked:** [169 times](https://champman0102.net/app.php/thankslist/givens/338/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=18761\#p18761)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=18761 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=18761 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=18761#p18761 "Post") by **[John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338)** » Fri Feb 26, 2021 5:30 pm

> [Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=18755#p18755) Fri Feb 26, 2021 4:28 pm
> Thanks Alan and Xeno. I did manage to find the 9D0 list of clubs.
>
> Interestingly in club.dat I surmised that the code to use for Cardiff was 8B7 so replaced in Olly (in Welsh Prem Cup) their code of 9D0434 with 8B7 - low and behold Falkirk appeared in the game. (Interestingly Falkirk are not listed with a 9D0 value, or not one that has been recorded onto a list by anyone yet).
>
> The 9D0 values can clearly be replaced with a hex value as is done for competition swaps - it just trying to work out what the hex value for each club is....

Cardiff's club id may well be 2231 (0x8b7) in your data, but that will vary from data to data, and will change in game depending on how many teams are loaded - so there won't be a fixed id number (which is why the game has to look teams up by name).

[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)Hot Prospect for the Future**Posts:** 201**Joined:** Sun Nov 29, 2020 9:55 am**Has thanked:** [53 times](https://champman0102.net/app.php/thankslist/givens/3116/true)**Been thanked:** [59 times](https://champman0102.net/app.php/thankslist/givens/3116/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=18762\#p18762)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=18762 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=18762 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=18762#p18762 "Post") by **[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)** » Fri Feb 26, 2021 5:36 pm

Thanks John. Crap, sounds like I'm heading into a dead end with this one then.

**Deleted User 1932**

### [Offsets](https://champman0102.net/viewtopic.php?p=18763\#p18763)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=18763 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=18763 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=18763#p18763 "Post") by **Deleted User 1932** » Fri Feb 26, 2021 5:37 pm

> [Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=18758#p18758) Fri Feb 26, 2021 4:52 pm
> Okay. Thanks for that. Still, trying to locate the right code to use for other clubs is difficult. For what it's worth replacing Cardiff's 9D0 value with "8" brings up Kitzbuhel in the game, so that's one found at least. ![:lol:](https://champman0102.net/images/smilies/icon_lol.gif)

Don't be so sure - there is no reference to 8D0434 at all in the exe, and no club from Kitzbuhel in the original game data. Guessing you are using the patched data with the active Austrian league, it is perhaps possible that the Kitzbuhel club in that database has the lowest club ID?

[![User avatar](https://champman0102.net/download/file.php?avatar=384_1614080104.jpg)](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)

[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)Patch Team**Posts:** 2541**Joined:** Wed Nov 25, 2020 5:01 am**Has thanked:** [240 times](https://champman0102.net/app.php/thankslist/givens/384/true)**Been thanked:** [862 times](https://champman0102.net/app.php/thankslist/givens/384/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=18778\#p18778)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=18778 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=18778 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=18778#p18778 "Post") by **[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)** » Fri Feb 26, 2021 6:41 pm

**C header**

Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=75#)

```
//----------------------------------------------------------------------------
// Project: Championship Manager 3 Program (and subsequent updates)
// Sports Interactive
// Copyright © 1997. All Rights Reserved.
//
// SUBSYSTEM: Fix Application
// FILE: database.h
// AUTHOR: Marc Vaughan
//
// OVERVIEW
// ~~~~~~~~
// Header file for the database access functions.
//
//----------------------------------------------------------------------------

// Ifdef wrapping to prevent multiple inclusions
#ifndef DATABASE_H
#define DATABASE_H

//Added by Graeme Kelly
typedef struct
{
short day; // days from Jan 1st.
short year;
long LeapYear; // =1 if year is a leapyear, 0 otherwise.
} CM_DATE;

// -------------------- //
// Custom Include Files //
// -------------------- //
#include "date.h"
#include "utils.h"
#include "zipdir.h"
#include "club.h"
#include "langlib.h"

// Define for initialising club rep table
#define INITIALISE_TABLE TRUE

// Invalid date def
#define INVALID_DATE CM_DATE( 31, 1900 )

// Languages
#define DB_ALBANIAN 1
#define DB_ARABIC 2
#define DB_BULGARIAN 3
#define DB_CHINESE 4
#define DB_CROATIAN 5
#define DB_CZECH 6
#define DB_DUTCH 7
#define DB_ENGLISH 8
#define DB_FINNISH 9
#define DB_FRENCH 10
#define DB_GERMAN 11
#define DB_GREEK 12
#define DB_HEBREW 13
#define DB_HUNGARIAN 14
#define DB_ITALIAN 15
#define DB_JAPANESE 16
#define DB_KOREAN 17
#define DB_POLISH 18
#define DB_PORTUGUESE 19
#define DB_ROMANIAN 20
#define DB_RUSSIAN 21
#define DB_NORWEGIAN 22
#define DB_SERBIAN 23
#define DB_SPANISH 24
#define DB_TURKISH 25
#define DB_BURMESE 26
#define DB_MALAY 27
#define DB_PERSIAN 28
#define DB_SLOVAK 29
#define DB_SWEDISH 30
#define DB_ICELANDIC 31
#define DB_DANISH 32
#define DB_AFRIKAANS 33
#define _DB_ALBANIAN 34
#define DB_AMHARIC 35
#define DB_ARMENIAN 36
#define DB_AZERI 37
#define DB_BANGLA 38
#define DB_ESTONIAN 39
#define DB_GEORGIAN 40
#define DB_HINDI 41
#define DB_JAVANESE 42
#define DB_KHMER 43
#define DB_KYRGYZ 44
#define DB_LAO 45
#define DB_LATVIAN 46
#define DB_LETBURGESCH 47
#define DB_LITHUANIAN 48
#define DB_MACEDONIAN 49
#define DB_MALAGASY 50
#define DB_MALTESE 51
#define DB_SINHALESE 52
#define DB_SLOVENIAN 53
#define DB_SOMALI 54
#define DB_SWAHILI 55
#define DB_TAJIK 56
#define DB_TAMIL 57
#define DB_THAI 58
#define DB_UZBEK 59
#define VIETNAMESE 60

#define DB_NUMBER_OF_CM3_LANGUAGES 60

// Formation definitions
#define FORMATION_NOT_SET 0
#define FORMATION_532SW 1
#define FORMATION_532 2
#define FORMATION_442 3
#define FORMATION_433 4
#define FORMATION_424 5
#define FORMATION_352 6
#define FORMATION_41212 7
#define FORMATION_451 8
#define FORMATION_343 9

#define DB_NUMBER_OF_FORMATION_SHAPES 10

// NationGroupDefines
#define EEC_COUNTRY 2
#define NON_EEC_COUNTRY 1

// Selected leagues defs (+11c)
#define NOT_SELECTED 0x0000
#define SELECTED_BACKGROUND 0x0001
#define SELECTED_FOREGROUND 0x0002
#define ALL_DIVISIONS_ACTIVE 0x0004

// Compatability defs //
#define cm3_second_name_list cm3_second_names_list
#define CM3_PLAYER CM3_PLAYERS
#define CM3_NON_PLAYER CM3_NON_PLAYERS
#define CM3_CLUB_COMP CM3_CLUB_COMPS
#define cm3_club_tbl cm3_clubs_tbl
#define cm3_club_tbl_sz cm3_clubs_tbl_sz
#define cm3_player_tbl cm3_players_tbl
#define CM3_NAME CM3_NAMES
#define CENTER CENTRE
#define CM3_YOUTH_PLAYER CM3_YOUTH_PLAYERS

// ------------------//
// Constants //
// ----------------- //

#define INDEX_FILENAME "index.dat"

#define DB_CONTINENTS_VERSION 0x01
#define DB_NATIONS_VERSION 0x02
#define DB_CITIES_CORRUPT_ON_MAC 0x01
#define DB_CITIES_VERSION 0x02
#define DB_STADIUMS_VERSION 0x01
#define DB_CLUBS_VERSION 0x02
#define DB_STAFF_VERSION 0x02
#define DB_NON_PLAYERS_VERSION 0x02
#define DB_PLAYERS_VERSION 0x02
#define DB_STAFF_PREFERENCES_VERSION 0x01
#define DB_STAFF_HISTORY_VERSION 0x01
#define DB_CLUB_COMPS_VERSION 0x02
#define DB_CLUB_COMP_HISTORY_VERSION 0x01
#define DB_STAFF_COMPS_VERSION 0x02
#define DB_STAFF_COMP_HISTORY_VERSION 0x01
#define DB_OFFICIALS_VERSION 0x01
#define DB_COLOURS_VERSION 0x01
#define DB_NAMES_VERSION 0x01

// Primary colour definitions
#define PRIMARY_BLACK 1
#define PRIMARY_WHITE 2
#define PRIMARY_GREY 3
#define PRIMARY_YELLOW 4
#define PRIMARY_GREEN 5
#define PRIMARY_BLUE 6
#define PRIMARY_PURPLE 7
#define PRIMARY_RED 8
#define PRIMARY_ORANGE 9
#define PRIMARY_BROWN 10

// Condition level below which a player is considered unable to play
#define CONDITION_INJURED 60

// max number of friendly competitions
#define MAX_FRIENDLY_COMPETITIONS 127

// text lengths
#define LONG_TXT_LENGTH 101
#define STANDARD_TXT_LENGTH 51
#define SHORT_TXT_LENGTH 26

// club staff table sizes
#define DIRECTOR_SIZE 3
#define SQUAD_SIZE 50
#define SCOUT_SIZE 7
#define COACH_SIZE 5
#define PHYSIO_SIZE 3

// max number of human players
#define MAX_HUMAN_PLAYERS 16

// Maximum number of tactics in training at once
#define MAX_TACTIC_TRAINING 4

// Maximum size of a squad for a match
#define TEAM_SZ 20

// Ability defs
#define LOWER_TECHNICAL_ABILITY_LIMIT -125
#define UPPER_TECHNICAL_ABILITY_LIMIT 125
#define LOWER_NON_TECHNICAL_ABILITY_LIMIT 1
#define UPPER_NON_TECHNICAL_ABILITY_LIMIT 20

// ----------------------- //
// Enum definitions //
// ----------------------- //

// Home and away team definitions
#define HOME_TEAM 0
#define AWAY_TEAM 1

// nation region (+75)
#define REGION_AFRICA 1
#define REGION_ASIA 2
#define REGION_BALKAN 3
#define REGION_BRAZIL 4
#define REGION_BRITAIN 5
#define REGION_CARIBBEAN 6
#define REGION_CENTRAL_AMERICA 7
#define REGION_EASTERN_EUROPE 8
#define REGION_FRANCE 9
#define REGION_GERMANY 10
#define REGION_HOLLAND 11
#define REGION_ITALY 12
#define REGION_JAPAN 13
#define REGION_MIDDLE_EAST 14
#define REGION_NORTH_AFRICA 15
#define REGION_NORTH_AMERICA 16
#define REGION_NORTHERN_EUROPE 17
#define REGION_OCEANIA 18
#define REGION_RUSSIA 19
#define REGION_SCANDINAVIA 20
#define REGION_SOUTH_AFRICA 21
#define REGION_SOUTH_AMERICA 22
#define REGION_SOUTHERN_EUROPE 23
#define REGION_SPAIN 24
#define FIRST_REGION 1
#define LAST_REGION 24

// nation actual region (+76)
#define ACTUAL_REGION_AFRICA 1
#define ACTUAL_REGION_ASIA 2
#define ACTUAL_REGION_CARIBBEAN 3
#define ACTUAL_REGION_CENTRAL_AMERICA 4
#define ACTUAL_REGION_CENTRAL_EUROPE 5
#define ACTUAL_REGION_EASTERN_EUROPE 6
#define ACTUAL_REGION_MIDDLE_EAST 7
#define ACTUAL_REGION_NORTH_AFRICA 8
#define ACTUAL_REGION_NORTH_AMERICA 9
#define ACTUAL_REGION_OCEANIA 10
#define ACTUAL_REGION_SCANDINAVIA 11
#define ACTUAL_REGION_SOUTH_AMERICA 12
#define ACTUAL_REGION_SOUTHERN_EUROPE 13
#define ACTUAL_REGION_UK_AND_IRELAND 14
#define FIRST_ACTUAL_REGION 1
#define LAST_ACTUAL_REGION 14

// club professional status
#define PROFESSIONAL 1
#define SEMI_PRO 2
#define AMATEUR 3

// states of development
#define DEVELOPED_STATE 1
#define DEVLOPING_STATE 2
#define THIRD_WORLD_STATE 3

// database days of the week
#define DB_SUN 1
#define DB_MON 2
#define DB_TUE 3
#define DB_WED 4
#define DB_THUR 5
#define DB_FRI 6
#define DB_SAT 7

// staff job for club/nation (+3D)
#define JOB_INVALID_JOB 0
#define JOB_CHAIRMAN 1
#define JOB_MANAGING_DIRECTOR 2
#define JOB_GENERAL_MANAGER 3
#define JOB_DIRECTOR_OF_FOOTBALL 4
#define JOB_MANAGER 5
#define JOB_ASSISTANT_MANAGER 6
#define JOB_RESERVE_TEAM_MANAGER 7
#define JOB_COACH 8
#define JOB_SCOUT 9
#define JOB_PHYSIO 10
#define JOB_PLAYER 11
#define JOB_PLAYER_MANAGER 12
#define JOB_PLAYER_ASSISTANT_MANAGER 13
#define PLAYER_RESERVE_TEAM_MANAGER 14
#define JOB_PLAYER_COACH 15
#define JOB_PLAYER_RETIRED 16
#define JOB_MEDIA_PUNDIT 17

// staff playing squad
#define INVALID_SQUAD 0
#define CLUB_SENIOR_SQUAD 0x01
#define CLUB_RESERVE_SQUAD 0x02
#define NATION_MAIN_SQUAD 0x04
#define NATION_B_SQUAD 0x08

// staff classification (+5F)
#define INVALID_CLASSIFICATION 0
#define NON_PLAYER 1
#define PLAYER 2
#define NON_PLAYER_AND_PLAYER 3
#define YOUTH_PLAYER 4
#define NEW_HUMAN_MANAGER 5
#define SPARE_NON_PLAYER 6

// name tables
#define FIRSTNAME 1
#define SECONDNAME 2
#define COMMONNAME 3

// Player form definitions
#define VERY_POOR 0
#define POOR 1
#define AVERAGE 2
#define GOOD 3
#define VERY_GOOD 4
#define SUPERB 5

// Index file ids //
#define NUM_INDEX_TABLES 22
#define CLUB_TABLE 0
#define NATION_CLUBS_TABLE 1
#define COLOUR_TABLE 2
#define CONTINENT_TABLE 3
#define NATION_TABLE 4
#define STADIUM_TABLE 5
#define STAFF_TABLE 6
#define OFFICIALS_TABLE 7
#define YOUTH_PLAYER_TABLE 8 // Not used
#define NON_PLAYER_TABLE 9
#define PLAYER_TABLE 10
#define STAFF_COMP_TABLE 11
#define CLUB_COMP_TABLE 12
#define FIRST_NAME_TABLE 13
#define SECOND_NAME_TABLE 14
#define COMMON_NAME_TABLE 15
#define NATION_COMP_TABLE 16
#define STAFF_HISTORY_TABLE 17
#define STAFF_COMP_HISTORY_TABLE 18
#define CLUB_COMP_HISTORY_TABLE 19
#define NATION_COMP_HISTORY_TABLE 20
#define CITY_TABLE 21
#define STAFF_PREFERENCES_TABLE 22 // MUX with youth player table

#define test_for_bits_set( info, bits ) ( ( info & bits ) == bits )

// type definitions
#ifndef PLATFORM_MAC
typedef struct cm3_continents CM3_CONTINENTS;
typedef struct cm3_nations CM3_NATIONS;
typedef struct cm3_cities CM3_CITIES;
typedef struct cm3_stadiums CM3_STADIUMS;
typedef struct cm3_clubs CM3_CLUBS;
typedef struct cm3_staff CM3_STAFF;
typedef struct cm3_non_players CM3_NON_PLAYERS;
typedef struct cm3_players CM3_PLAYERS;
typedef struct cm3_staff_preferences CM3_STAFF_PREFERENCES;
typedef struct cm3_staff_history CM3_STAFF_HISTORY;
typedef struct cm3_club_comps CM3_CLUB_COMPS;
typedef struct cm3_club_comp_history CM3_CLUB_COMP_HISTORY;
typedef struct cm3_staff_comps CM3_STAFF_COMPS;
typedef struct cm3_staff_comp_history CM3_STAFF_COMP_HISTORY;
typedef struct cm3_officials CM3_OFFICIALS;
typedef struct cm3_colours CM3_COLOURS;
typedef struct cm3_names CM3_NAMES;
#else
typedef struct mac_cm3_continents CM3_CONTINENTS;
typedef struct mac_cm3_nations CM3_NATIONS;
typedef struct mac_cm3_cities CM3_CITIES;
typedef struct mac_cm3_stadiums CM3_STADIUMS;
typedef struct mac_cm3_clubs CM3_CLUBS;
typedef struct mac_cm3_staff CM3_STAFF;
typedef struct mac_cm3_non_players CM3_NON_PLAYERS;
typedef struct mac_cm3_players CM3_PLAYERS;
typedef struct mac_cm3_staff_preferences CM3_STAFF_PREFERENCES;
typedef struct mac_cm3_staff_history CM3_STAFF_HISTORY;
typedef struct mac_cm3_club_comps CM3_CLUB_COMPS;
typedef struct mac_cm3_club_comp_history CM3_CLUB_COMP_HISTORY;
typedef struct mac_cm3_staff_comps CM3_STAFF_COMPS;
typedef struct mac_cm3_staff_comp_history CM3_STAFF_COMP_HISTORY;
typedef struct mac_cm3_officials CM3_OFFICIALS;
typedef struct mac_cm3_colours CM3_COLOURS;
typedef struct mac_cm3_names CM3_NAMES;

#include "mac_database.h"
#endif

// -------------------------- //
// Continents //
// -------------------------- //

// This structure contains information about a nations name list beginning and
// end within each of the various names tables.
typedef struct
{
long first_name_start_index; // Start index for this nations first names
long second_name_start_index; // Start index for this nations second names
long common_name_start_index; // Start index for this nations common names
long number_first_names; // Total nmber of first names
long number_second_names; // Total number of second names
long number_common_names; // Total number of common names
long first_name_count; // Count of different types of first names
long second_name_count; // Count of different types of second names
long common_name_count; // Count of different types of common names
} NATION_NAME_INDEX_ENTRY;

#ifdef DATABASE_CPP
NATION_NAME_INDEX_ENTRY *nation_name_index_tbl = (NATION_NAME_INDEX_ENTRY*)0;
// Size is the same as the cm3_nations_tbl_sz
#else
extern NATION_NAME_INDEX_ENTRY *nation_name_index_tbl;
#endif

// the following structures need to be byte aligned
#ifdef PLATFORM_MAC
#pragma options align=packed
#endif

// -------------------------- //
// Continents //
// -------------------------- //

struct cm3_continents
{
// original data
long ContinentID;
char ContinentName[ SHORT_TXT_LENGTH ];
char ContinentGenderName;
char ContinentNameThreeLetter[ 4 ];
char ContinentNameContinentality[ SHORT_TXT_LENGTH ];
char ContinentFederationName[ LONG_TXT_LENGTH ];
char ContinentGenderFederationName;
char ContinentFederationNameShort[ SHORT_TXT_LENGTH ];
char ContinentGenderFederationNameShort;
SI_DOUBLE ContinentRegionalStrength;
};

// -------------------------- //
// Nations //
// -------------------------- //

struct cm3_nations
{
// original data
long NationID;
char NationName[ STANDARD_TXT_LENGTH ];
char NationGenderName;
char NationNameShort[ SHORT_TXT_LENGTH ];
char NationGenderNameShort;
char NationNameThreeLetter[ 4 ];
char NationNameNationality[ SHORT_TXT_LENGTH ];
CM3_CONTINENTS *NationContinent;
char NationRegion;
char NationActualRegion;
char NationFirstLanguage;
char NationSecondLanguage;
char NationThirdLanguage;
CM3_CITIES *NationCapitalCity;
char NationStateOfDevelopment;
char NationGroupMembership;
CM3_STADIUMS *NationNationalStadium;
char NationGameImportance;
char NationLeagueStandard;
short NationNumberClubs;
long NationNumberStaff; // Version 0x02 - Added
short NationSeasonUpdateDay; // Version 0x02 - Added
short NationReputation; // Version 0x02 - Changed char->short
CM3_COLOURS *NationForegroundColour1;
CM3_COLOURS *NationBackgroundColour1;
CM3_COLOURS *NationForegroundColour2;
CM3_COLOURS *NationBackgroundColour2;
CM3_COLOURS *NationForegroundColour3;
CM3_COLOURS *NationBackgroundColour3;
SI_DOUBLE NationFIFACoefficient;
SI_DOUBLE NationFIFACoefficient91;
SI_DOUBLE NationFIFACoefficient92;
SI_DOUBLE NationFIFACoefficient93;
SI_DOUBLE NationFIFACoefficient94;
SI_DOUBLE NationFIFACoefficient95;
SI_DOUBLE NationFIFACoefficient96;
SI_DOUBLE NationUEFACoefficient91;
SI_DOUBLE NationUEFACoefficient92;
SI_DOUBLE NationUEFACoefficient93;
SI_DOUBLE NationUEFACoefficient94;
SI_DOUBLE NationUEFACoefficient95;
SI_DOUBLE NationUEFACoefficient96;
CM3_NATIONS *NationRivals1;
CM3_NATIONS *NationRivals2;
CM3_NATIONS *NationRivals3;

// runtime data
char NationLeagueSelected;
long NationShortlistOffset; // Version 0x02 - Added
char NationGamesPlayed; // Version 0x02 - Moved to runtime
};

// WEATHER STRUCTURE DEFINITIONS //
// (Have Fun PJ) //
// This structure defines the current weather settings for an area.

#define SPECIAL_HAIL 1
#define SPECIAL_SLEET 2
#define SPECIAL_SNOW 3

typedef struct
{
char wind;
char precipitation;
char temperature;
char special;
} WEATHER_CONDITION;

// Wind defintion structure, this structure should give the precentage scale
// upon which each of the various wind type will happen within a season.
// Eg. calm - 3 // 0 - 3 % means calm weather occurs
// breezy - 20
// gusty - 75
// strong - 90
// gale - 100
typedef struct
{
char calm;
char breezy;
char gusty;
char strong;
char gale;
} WIND;

// Precipitation weather structure, this structure gives the percentage chance
// of each of the various types of precipitations happening.
typedef struct
{
char dry;
char wet;
char drizzle;
char shower;
char down_pour;
} PRECIPITATION;

// Temperature weather structure, this structure gives the percentage chance
// of each of the various types of precipitations happening.
typedef struct
{
char freezing;
char cold;
char mild;
char fine;
char warm;
char hot;
char very_hot;
} TEMPERATURE;

// This structure defines a seasons weather conditions within CM3.
typedef struct
{
short WeatherSeasonStartDay;
WIND WeatherSeasonWind;
PRECIPITATION WeatherSeasonPrecipitation;
TEMPERATURE WeatherSeasonTemperature;
} WEATHER_SEASON;

// CITY_WEATHER : This structure defines the weather for a particular city.
// This information should be editable through the data editor
// (Thanks PJ)

// Season definitions ... for indexing into CityWeatherSeason
#define SPRING 0
#define SUMMER 1
#define AUTUMN 2
#define WINTER 3

typedef struct
{
long CityWeatherID; // ID of the city (auto generated by editor)
char CityWeatherName[ SHORT_TXT_LENGTH ]; // Name of the city which is modelled (editable)
WEATHER_SEASON CityWeatherSeason[ 4 ]; // Seasonal model for this city (editable)
WEATHER_CONDITION CityWeatherCondition; // Current Weather in this city (not editable)
} CITY_WEATHER;

// -------------------------- //
// Cities //
// -------------------------- //

struct cm3_cities
{
// original data
long CityID;
char CityName[ SHORT_TXT_LENGTH ];
char CityGenderName;
CM3_NATIONS *CityNation;
SI_DOUBLE CityLatitude;
SI_DOUBLE CityLongitude;
char CityAttraction;
long CityWeather;
// CITY_WEATHER *CityWeatherCity; // Weather city to use for this cities weather
};

// -------------------------- //
// Stadiums //
// -------------------------- //

struct cm3_stadiums
{
// original data
long StadiumID;
char StadiumName[ STANDARD_TXT_LENGTH ];
char StadiumGenderName;
CM3_CITIES *StadiumCity;
long StadiumCapacity;
long StadiumSeatingCapacity;
long StadiumExpansionCapacity;
CM3_STADIUMS *StadiumNearbyStadium;
char StadiumCovered;
char StadiumUnderSoilHeating;
};

// -------------------------- //
// Clubs //
// -------------------------- //

struct cm3_clubs
{
// original data
long ClubID;
char ClubName[ STANDARD_TXT_LENGTH ];
char ClubGenderName;
char ClubNameShort[ SHORT_TXT_LENGTH ];
char ClubGenderNameShort;
CM3_NATIONS *ClubNation;
CM3_CLUB_COMPS *ClubDivision;
CM3_CLUB_COMPS *ClubLastDivision;
char ClubLastPosition;
CM3_CLUB_COMPS *ClubReserveDivision;
char ClubProfessionalStatus;
long ClubCash;
CM3_STADIUMS *ClubStadium;
char ClubOwnStadium;
CM3_STADIUMS *ClubReserveStadium;
char ClubHomeMatchDay;
long ClubAttendance;
long ClubMinAttendance;
long ClubMaxAttendance;
char ClubTraining;
short ClubReputation; // Version 0x02 - Changed char->short
char ClubPLC;
CM3_COLOURS *ClubForegroundColour1;
CM3_COLOURS *ClubBackgroundColour1;
CM3_COLOURS *ClubForegroundColour2;
CM3_COLOURS *ClubBackgroundColour2;
CM3_COLOURS *ClubForegroundColour3;
CM3_COLOURS *ClubBackgroundColour3;
CM3_STAFF *ClubFavouriteStaff1;
CM3_STAFF *ClubFavouriteStaff2;
CM3_STAFF *ClubFavouriteStaff3;
CM3_STAFF *ClubDislikedStaff1;
CM3_STAFF *ClubDislikedStaff2;
CM3_STAFF *ClubDislikedStaff3;
CM3_CLUBS *ClubRivals1;
CM3_CLUBS *ClubRivals2;
CM3_CLUBS *ClubRivals3;
CM3_STAFF *ClubChairman;
CM3_STAFF *ClubDirectorList[ DIRECTOR_SIZE ];
CM3_STAFF *ClubManager;
CM3_STAFF *ClubAssistantManager;
CM3_STAFF *ClubSquadList[ SQUAD_SIZE ];
CM3_STAFF *ClubCoachList[ COACH_SIZE ];
CM3_STAFF *ClubScoutList[ SCOUT_SIZE ];
CM3_STAFF *ClubPhysioList[ PHYSIO_SIZE ];

// runtime data
long ClubEuroFlag;
char ClubEuroSeeding;
CM3_STAFF *ClubTeamSelected[ TEAM_SZ ];
long ClubTacticTraining[ MAX_TACTIC_TRAINING ];
long ClubTacticSelected;
char ClubHasLinkedClub;

};

// -------------------------- //
// Staff //
// -------------------------- //

struct cm3_staff
{
long StaffID;
char *StaffFirstName;
char *StaffSecondName;
char *StaffCommonName;
CM_DATE StaffDateOfBirth;
short StaffYearOfBirth;
CM3_NATIONS *StaffNation;
CM3_NATIONS *StaffSecondNation;
unsigned char StaffInternationalApps;
unsigned char StaffInternationalGoals;
CM3_CLUBS *StaffNationContracted;
char StaffJobForNation;
CM_DATE StaffDateJoinedNation;
CM_DATE StaffContractExpiresNation;
CM3_CLUBS *StaffClubContracted;
char StaffJobForClub;
CM_DATE StaffDateJoinedClub;
CM_DATE StaffContractExpiresClub;
long StaffEstimatedWage;
long StaffEstimatedValue;
char StaffAdaptability;
char StaffAmbition;
char StaffDetermination;
char StaffLoyalty;
char StaffPressure;
char StaffProfessionalism;
char StaffSportsmanship;
char StaffTemperament;
char StaffPlayingSquad;
char StaffClassification;
char StaffClubValuation;
CM3_PLAYERS *StaffPlayerData;
CM3_STAFF_PREFERENCES *StaffPreferences; // Version 0x02 - New ptr type
CM3_NON_PLAYERS *StaffNonPlayerData;

// Runtime data //
char StaffSquadSelectedFor; // should be StaffEuroSquadFlag - Kev
};

// -------------------------- //
// Non Players //
// -------------------------- //

struct cm3_non_players
{
long StaffNonPlayerID;
short StaffNonPlayerCurrentAbility;
short StaffNonPlayerPotentialAbility;
short StaffNonPlayerHomeReputation; // Version 0x02 - Changed char->short
short StaffNonPlayerCurrentReputation; // Version 0x02 - Changed char->short
short StaffNonPlayerWorldReputation; // Version 0x02 - Changed char->short
char StaffNonPlayerAttacking;
char StaffNonPlayerBusiness;
char StaffNonPlayerCoaching;
char StaffNonPlayerCoachingGks;
char StaffNonPlayerCoachingTechnique;
char StaffNonPlayerDirectness;
char StaffNonPlayerDiscipline;
char StaffNonPlayerFreeRoles;
char StaffNonPlayerInterference;
char StaffNonPlayerJudgement;
char StaffNonPlayerJudgingPotential;
char StaffNonPlayerManHandling;
char StaffNonPlayerMarking;
char StaffNonPlayerMotivating;
char StaffNonPlayerOffside;
char StaffNonPlayerPatience;
char StaffNonPlayerPhysiotherapy;
char StaffNonPlayerPressing;
char StaffNonPlayerResources;
char StaffNonPlayerTactics;
char StaffNonPlayerYoungsters;
CM3_STAFF *StaffNonPlayerGoalkeeper;
CM3_STAFF *StaffNonPlayerSweeper;
CM3_STAFF *StaffNonPlayerDefender;
CM3_STAFF *StaffNonPlayerDefensiveMidfielder;
CM3_STAFF *StaffNonPlayerMidfielder;
CM3_STAFF *StaffNonPlayerAttackingMidfielder;
CM3_STAFF *StaffNonPlayerAttacker;
CM3_STAFF *StaffNonPlayerWingBack;
char StaffNonPlayerFormationPreferred;
};

// -------------------------- //
// Players //
// -------------------------- //

struct cm3_players
{
// original data
long StaffPlayerID;
char StaffPlayerSquadNumber;
short StaffPlayerCurrentAbility;
short StaffPlayerPotentialAbility;
short StaffPlayerHomeReputation; // Version 0x02 - Changed char->short
short StaffPlayerCurrentReputation; // Version 0x02 - Changed char->short
short StaffPlayerWorldReputation; // Version 0x02 - Changed char->short
char StaffPlayerGoalkeeper;
char StaffPlayerSweeper;
char StaffPlayerDefender;
char StaffPlayerDefensiveMidfielder;
char StaffPlayerMidfielder;
char StaffPlayerAttackingMidfielder;
char StaffPlayerAttacker;
char StaffPlayerWingBack;
char StaffPlayerRightSide;
char StaffPlayerLeftSide;
char StaffPlayerCentral;
char StaffPlayerFreeRole;
char StaffPlayerAcceleration;
char StaffPlayerAggression;
char StaffPlayerAgility;
char StaffPlayerAnticipation;
char StaffPlayerBalance;
char StaffPlayerBravery; // Value
char StaffPlayerConsistency;
char StaffPlayerCorners;
char StaffPlayerCrossing;
char StaffPlayerDecisions;
char StaffPlayerDirtiness;
char StaffPlayerDribbling;
char StaffPlayerFinishing;
char StaffPlayerFlair;
char StaffPlayerFreeKicks;
char StaffPlayerHandling;
char StaffPlayerHeading;
char StaffPlayerImportantMatches;
char StaffPlayerInjuryProneness;
char StaffPlayerJumping;
char StaffPlayerLeadership;
char StaffPlayerLeftFoot;
char StaffPlayerLongShots;
char StaffPlayerMarking;
char StaffPlayerMovement;
char StaffPlayerNaturalFitness;
char StaffPlayerOneOnOnes;
char StaffPlayerPace;
char StaffPlayerPassing;
char StaffPlayerPenalties;
char StaffPlayerPositioning;
char StaffPlayerReflexes;
char StaffPlayerRightFoot;
char StaffPlayerStamina;
char StaffPlayerStrength;
char StaffPlayerTackling;
char StaffPlayerTeamwork;
char StaffPlayerTechnique;
char StaffPlayerThrowIns;
char StaffPlayerVersatility;
char StaffPlayerVision;
char StaffPlayerWorkRate;

// runtime data
char StaffPlayerMorale;
};

// -------------------------- //
// Player details //
// -------------------------- //

struct cm3_staff_preferences
{
long StaffPreferencesID;
CM3_CLUBS *StaffFavouriteClubs1;
CM3_CLUBS *StaffFavouriteClubs2;
CM3_CLUBS *StaffFavouriteClubs3;
CM3_CLUBS *StaffDislikedClubs1;
CM3_CLUBS *StaffDislikedClubs2;
CM3_CLUBS *StaffDislikedClubs3;
CM3_STAFF *StaffFavouriteStaff1;
CM3_STAFF *StaffFavouriteStaff2;
CM3_STAFF *StaffFavouriteStaff3;
CM3_STAFF *StaffDislikedStaff1;
CM3_STAFF *StaffDislikedStaff2;
CM3_STAFF *StaffDislikedStaff3;
};

// -------------------------- //
// Staff History //
// -------------------------- //

struct cm3_staff_history
{
long StaffHistoryID;
CM3_STAFF *StaffHistoryStaff;
short StaffHistoryYear;
CM3_CLUBS *StaffHistoryClub;
char StaffHistoryOnLoan;
unsigned char StaffHistoryApps;
unsigned char StaffHistoryGoals;
};

// -------------------------- //
// Club Competitions //
// -------------------------- //

struct cm3_club_comps
{
long ClubCompID;
char ClubCompName[ STANDARD_TXT_LENGTH ];
char ClubCompGenderName;
char ClubCompNameShort[ SHORT_TXT_LENGTH ];
char ClubCompGenderNameShort;
char ClubCompNameThreeLetter[ 4 ];
char ClubCompScope;
char ClubCompSelected;
CM3_CONTINENTS *ClubCompContinent;
CM3_NATIONS *ClubCompNation;
CM3_COLOURS *ClubCompForegroundColour;
CM3_COLOURS *ClubCompBackgroundColour;
short ClubCompReputation; // Version 0x02 - Changed char->short
};

// -------------------------- //
// Club Competition History //
// -------------------------- //

struct cm3_club_comp_history
{
long ClubCompHistoryID;
CM3_CLUB_COMPS *ClubCompHistoryClubComp;
short ClubCompHistoryYear;
CM3_CLUBS *ClubCompHistoryWinners;
CM3_CLUBS *ClubCompHistoryRunnersUp;
CM3_CLUBS *ClubCompHistoryThirdPlaced;
CM3_CLUBS *ClubCompHistoryHosts;
};

// -------------------------- //
// Staff Competitions //
// -------------------------- //

struct cm3_staff_comps
{
long StaffCompID;
char StaffCompName[ STANDARD_TXT_LENGTH ];
char StaffCompGenderName;
char StaffCompNameShort[ SHORT_TXT_LENGTH ];
char StaffCompGenderNameShort;
CM3_CONTINENTS *StaffCompContinent;
CM3_NATIONS *StaffCompNation;
CM3_COLOURS *StaffCompForegroundColour;
CM3_COLOURS *StaffCompBackgroundColour;
short StaffCompReputation; // Version 0x02 - Changed char->short
};

// -------------------------- //
// Staff Competition History //
// -------------------------- //

struct cm3_staff_comp_history
{
long StaffCompHistoryID;
CM3_STAFF_COMPS *StaffCompHistoryStaffComp;
short StaffCompHistoryYear;
char *StaffCompHistoryFirstPlacedFirstName;
char *StaffCompHistoryFirstPlacedSecondName;
CM3_STAFF *StaffCompHistoryFirstPlacedIndex;
long StaffCompHistoryFirstPlacedInfo;
char *StaffCompHistorySecondPlacedFirstName;
char *StaffCompHistorySecondPlacedSecondName;
CM3_STAFF *StaffCompHistorySecondPlacedIndex;
long StaffCompHistorySecondPlacedInfo;
char *StaffCompHistoryThirdPlacedFirstName;
char *StaffCompHistoryThirdPlacedSecondName;
CM3_STAFF *StaffCompHistoryThirdPlacedIndex;
long StaffCompHistoryThirdPlacedInfo;
};

// -------------------------- //
// Officials //
// -------------------------- //

struct cm3_officials
{
long OfficialID;
char *OfficialFirstName;
char *OfficialSecondName;
CM_DATE OfficialDateOfBirth;
short OfficialYearOfBirth;
CM3_NATIONS *OfficialNation;
CM3_CITIES *OfficialCity;
short OfficialCurrentAbility;
short OfficialPotentialAbility;
short OfficialReputation;
char OfficialAllowingFlow;
char OfficialDiscipline;
char OfficialImportantMatches;
char OfficialPressure;
char OfficialRefereeing;
char OfficialRunningLine;
char OfficialTimekeeping;
};

// -------------------------- //
// Colours //
// -------------------------- //

struct cm3_colours
{
long ColourID;
char ColourName[ STANDARD_TXT_LENGTH ];
unsigned char ColourRedIntensity;
unsigned char ColourGreenIntensity;
unsigned char ColourBlueIntensity;
};

// -------------------------- //
// Names //
// -------------------------- //

// The cm3_names structure contains the information upon a name which is used
// by either the staff or officials within championship manager 3.
struct cm3_names
{
char Name[ STANDARD_TXT_LENGTH ];
long NameID;
long Nation;
char count;
};

// reset alignment
#ifdef PLATFORM_MAC
#pragma options align=reset
#endif

// -------------------------- //
// Variables //
// -------------------------- //

#define MAX_INDEX_NAME 50

// Index file struct //
typedef struct
{
char filename[ MAX_INDEX_NAME + 1 ];
long file_id;
long table_sz;
long offset;
long version;
} INDEX_TABLE;

#ifdef DATABASE_CPP
INDEX_TABLE index_info[ NUM_INDEX_TABLES ];

static BOOL game_format_data = FALSE;
static long num_of_friendlies = 0,
num_of_humans = 0;

// Table sizes //
long cm3_continents_tbl_sz = 0;
long cm3_nations_tbl_sz = 0;
long cm3_cities_tbl_sz = 0;
long cm3_stadiums_tbl_sz = 0;
long cm3_clubs_tbl_sz = 0;
long cm3_nation_clubs_tbl_sz = 0;
long cm3_staff_tbl_sz = 0;
long cm3_non_players_tbl_sz = 0;
long cm3_players_tbl_sz = 0;
long cm3_staff_preferences_tbl_sz = 0;
long cm3_staff_history_tbl_sz = 0;
long cm3_club_comps_tbl_sz = 0;
long cm3_club_comp_history_tbl_sz = 0;
long cm3_nation_club_comps_tbl_sz = 0;
long cm3_nation_club_comp_history_tbl_sz = 0;
long cm3_staff_comps_tbl_sz = 0;
long cm3_staff_comp_history_tbl_sz = 0;
long cm3_officials_tbl_sz = 0;
long cm3_colours_tbl_sz = 0;
long cm3_first_names_list_sz = 0;
long cm3_second_names_list_sz = 0;
long cm3_common_names_list_sz = 0;

char use_real_players = 1;

// Table ptrs //
CM3_CONTINENTS *cm3_continents_tbl = NULL;
CM3_NATIONS *cm3_nations_tbl = NULL;
CM3_CITIES *cm3_cities_tbl = NULL;
CM3_STADIUMS *cm3_stadiums_tbl = NULL;
CM3_CLUBS *cm3_clubs_tbl = NULL;
CM3_CLUBS *cm3_nation_clubs_tbl = NULL;
CM3_STAFF *cm3_staff_tbl = NULL;
CM3_NON_PLAYERS *cm3_non_players_tbl = NULL;
CM3_PLAYERS *cm3_players_tbl = NULL;
CM3_STAFF_PREFERENCES *cm3_staff_preferences_tbl = NULL;
CM3_STAFF_HISTORY *cm3_staff_history_tbl = NULL;
CM3_CLUB_COMPS *cm3_club_comps_tbl = NULL;
CM3_CLUB_COMP_HISTORY *cm3_club_comp_history_tbl = NULL;
CM3_CLUB_COMPS *cm3_nation_club_comps_tbl = NULL;
CM3_CLUB_COMP_HISTORY *cm3_nation_club_comp_history_tbl = NULL;
CM3_STAFF_COMPS *cm3_staff_comps_tbl = NULL;
CM3_STAFF_COMP_HISTORY *cm3_staff_comp_history_tbl = NULL;
CM3_OFFICIALS *cm3_officials_tbl = NULL;
CM3_COLOURS *cm3_colours_tbl = NULL;
CM3_NAMES *cm3_first_names_list = NULL;
CM3_NAMES *cm3_second_names_list = NULL;
CM3_NAMES *cm3_common_names_list = NULL;
#else
// Table sizes //
extern long cm3_continents_tbl_sz;
extern long cm3_nations_tbl_sz;
extern long cm3_cities_tbl_sz;
extern long cm3_stadiums_tbl_sz;
extern long cm3_clubs_tbl_sz;
extern long cm3_nation_clubs_tbl_sz;
extern long cm3_staff_tbl_sz;
extern long cm3_non_players_tbl_sz;
extern long cm3_players_tbl_sz;
extern long cm3_staff_preferences_tbl_sz;
extern long cm3_staff_history_tbl_sz;
extern long cm3_club_comps_tbl_sz;
extern long cm3_club_comp_history_tbl_sz;
extern long cm3_nation_club_comps_tbl_sz;
extern long cm3_nation_club_comp_history_tbl_sz;
extern long cm3_staff_comps_tbl_sz;
extern long cm3_staff_comp_history_tbl_sz;
extern long cm3_officials_tbl_sz;
extern long cm3_colours_tbl_sz;
extern long cm3_first_names_list_sz;
extern long cm3_second_names_list_sz;
extern long cm3_common_names_list_sz;

// Table sizes //
extern CM3_CONTINENTS *cm3_continents_tbl;
extern CM3_NATIONS *cm3_nations_tbl;
extern CM3_CITIES *cm3_cities_tbl;
extern CM3_STADIUMS *cm3_stadiums_tbl;
extern CM3_CLUBS *cm3_clubs_tbl;
extern CM3_CLUBS *cm3_nation_clubs_tbl;
extern CM3_STAFF *cm3_staff_tbl;
extern CM3_NON_PLAYERS *cm3_non_players_tbl;
extern CM3_PLAYERS *cm3_players_tbl;
extern CM3_STAFF_PREFERENCES *cm3_staff_preferences_tbl;
extern CM3_STAFF_HISTORY *cm3_staff_history_tbl;
extern CM3_CLUB_COMPS *cm3_club_comps_tbl;
extern CM3_CLUB_COMP_HISTORY *cm3_club_comp_history_tbl;
extern CM3_CLUB_COMPS *cm3_nation_club_comps_tbl;
extern CM3_CLUB_COMP_HISTORY *cm3_nation_club_comp_history_tbl;
extern CM3_STAFF_COMPS *cm3_staff_comps_tbl;
extern CM3_STAFF_COMP_HISTORY *cm3_staff_comp_history_tbl;
extern CM3_OFFICIALS *cm3_officials_tbl;
extern CM3_COLOURS *cm3_colours_tbl;
extern CM3_NAMES *cm3_first_names_list;
extern CM3_NAMES *cm3_second_names_list;
extern CM3_NAMES *cm3_common_names_list;

extern char use_real_players;
#endif

// Language header structure ..
typedef struct
{
long club_tbl_sz;
long continent_tbl_sz;
long nation_comp_tbl_sz;
long nation_tbl_sz;
long cities_tbl_sz;
long club_comp_tbl_sz;
long stadiums_tbl_sz;
long staff_comp_tbl_sz;
} LANG_HEADER;

// Structure containing club language information
typedef struct
{
char ClubName[ STANDARD_TXT_LENGTH ];
char GenderClubName;
char ClubNameShort[ SHORT_TXT_LENGTH ];
char GenderClubNameShort;
} CLUB_LANG;

// Structure containing continent language information
typedef struct
{
char ContinentName[ SHORT_TXT_LENGTH ];
char GenderContinentName;
char ContinentNameThreeLetter[ 4 ];
char ContinentNameNationality[ SHORT_TXT_LENGTH ];
char ContinentFederationName[ LONG_TXT_LENGTH ];
char GenderContinentFederationName;
char ContinentFederationNameShort[ SHORT_TXT_LENGTH ];
char GenderContinentFederationNameShort;
} CONTINENT_LANG;

// Structure containing nation competition language information
typedef struct
{
char NationCompName[ STANDARD_TXT_LENGTH ];
char GenderNationCompName;
char NationCompNameShort[ SHORT_TXT_LENGTH ];
char GenderNationCompNameShort;
char NationCompNameThreeLetter[ 4 ];
} NATION_COMP_LANG;

// Structure containing nation language information
typedef struct
{
char NationName[ STANDARD_TXT_LENGTH ];
char GenderNationName;
char NationNameShort[ SHORT_TXT_LENGTH ];
char GenderNationNameShort;
char NationNameThreeLetter[ 4 ];
char NationNameNationality[ SHORT_TXT_LENGTH ];
} NATION_LANG;

// Structure containing city language information
typedef struct
{
char CityName[ STANDARD_TXT_LENGTH ];
char GenderCityName;
} CITY_LANG;

// Structure containing stadium language information
typedef struct
{
char StadiumName[ STANDARD_TXT_LENGTH ];
char GenderStadiumName;
} STADIUM_LANG;

// Structure containing club comp language information
typedef struct
{
char ClubCompName[ STANDARD_TXT_LENGTH ];
char GenderClubCompName;
char ClubCompNameShort[ SHORT_TXT_LENGTH ];
char GenderClubCompNameShort;
char ClubCompNameThreeLetter[ 4 ];
} CLUB_COMP_LANG;

// Structure containing staff language information
typedef struct
{
char StaffCompName[ STANDARD_TXT_LENGTH ];
char GenderStaffCompName;
char StaffCompNameShort[ SHORT_TXT_LENGTH ];
char GenderStaffCompNameShort;
} STAFF_COMP_LANG;

// Class containing English language text for database
class ENGLISH_LANG
{
public:

ENGLISH_LANG( void );
~ENGLISH_LANG( void );

// access functions
char *get_nation_name( CM3_NATIONS *p_nation );
char *get_nation_name_three_letter( CM3_NATIONS *p_nation );
char *get_club_comp_name( CM3_CLUB_COMPS *p_club_comp );
char *get_continent_name( CM3_CONTINENTS *p_continent );
char *get_staff_comp_name( CM3_STAFF_COMPS *p_staff_comp );
char *get_club_name( CM3_CLUBS *p_club );
char *get_club_name_short( CM3_CLUBS *p_club );
char *get_stadium_name( CM3_STADIUMS *p_stadium );

private:
BOOL read_english_database( void );

LANG_HEADER lang_header;
CLUB_LANG *club_lang_data;
CONTINENT_LANG *continent_lang_data;
NATION_COMP_LANG *nation_comp_lang_data;
NATION_LANG *nation_lang_data;
CITY_LANG *city_lang_data;
STADIUM_LANG *stadium_lang_data;
CLUB_COMP_LANG *club_comp_lang_data;
STAFF_COMP_LANG *staff_comp_lang_data;
};

#ifdef DATABASE_CPP
LANGUAGE current_database_language = NO_LANGUAGE_SET;
long *club_remapping_indices = NULL;
#else
extern LANGUAGE current_database_language;
extern long *club_remapping_indices;
#endif
```

**\\* \[TUTORIAL\] How to install and run the game CM0102?> [viewtopic.php?f=85&t=3571](https://champman0102.net/viewtopic.php?f=85&t=3571)** **Please use search bar for solution before posting your issue**

[![User avatar](https://champman0102.net/download/file.php?avatar=384_1614080104.jpg)](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)

[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)Patch Team**Posts:** 2541**Joined:** Wed Nov 25, 2020 5:01 am**Has thanked:** [240 times](https://champman0102.net/app.php/thankslist/givens/384/true)**Been thanked:** [862 times](https://champman0102.net/app.php/thankslist/givens/384/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=18779\#p18779)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=18779 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=18779 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=18779#p18779 "Post") by **[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)** » Fri Feb 26, 2021 6:47 pm

**CPP headers in exe**

Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=75#)

```
9870f8 E:\dev\CM3\cm3 00-01\cm3\code\comp\intercomp\african_nations.cpp
9873c0 E:\dev\CM3\cm3 00-01\si\code\Area.cpp
9873e8 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\arg_prm.cpp
9874ec E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\arg_second.cpp
987924 E:\dev\CM3\cm3 00-01\cm3\code\award\argentina_awards.cpp
987960 E:\dev\CM3\cm3 00-01\cm3\code\transfer\argentina_rules.cpp
987a40 E:\dev\CM3\cm3 00-01\cm3\code\comp\eurocomp\asia_club_champ.cpp
987b60 E:\dev\CM3\cm3 00-01\cm3\code\comp\eurocomp\asia_cup_winner.cpp
987ba0 E:\dev\CM3\cm3 00-01\cm3\code\comp\intercomp\asia_nations.cpp
987be0 E:\dev\CM3\cm3 00-01\cm3\code\comp\eurocomp\asia_super_cup.cpp
987c20 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\aus_nsl.cpp
987cc0 E:\dev\CM3\cm3 00-01\cm3\code\award\australia_awards.cpp
987cfc E:\dev\CM3\cm3 00-01\cm3\code\transfer\australia_rules.cpp
987e24 E:\dev\CM3\cm3 00-01\cm3\code\award\award_manager.cpp
987fa4 E:\dev\CM3\cm3 00-01\cm3\code\award_screens.cpp
9880b0 E:\dev\CM3\cm3 00-01\cm3\code\award\award_shortlist.cpp
9880f4 E:\dev\CM3\cm3 00-01\cm3\code\awol.cpp
989934 E:\dev\CM3\cm3 00-01\cm3\code\background.cpp
989ae0 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\bel_fa_cup.cpp
989b18 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\bel_first.cpp
989b54 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\bel_second.cpp
989ccc E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\bel_super.cpp
989d04 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\bel_third.cpp
989dfc E:\dev\CM3\cm3 00-01\cm3\code\award\belgium_awards.cpp
989e34 E:\dev\CM3\cm3 00-01\cm3\code\transfer\belgium_rules.cpp
98a1e8 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\bra_champ_cup.cpp
98a3bc E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\bra_cup.cpp
98aa30 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\bra_nat_first.cpp
98ab64 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\bra_nat_second.cpp
98aba4 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\bra_nat_third.cpp
98acac E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\bra_reg_bahia.cpp
98ae10 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\bra_reg_central.cpp
98ae50 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\bra_reg_gaucho.cpp
98ae90 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\bra_reg_goias.cpp
98aed0 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\bra_reg_minas_gerais.cpp
98af14 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\bra_reg_north.cpp
98af54 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\bra_reg_northeast.cpp
98af98 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\bra_reg_parana.cpp
98afd8 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\bra_reg_pern.cpp
98b014 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\bra_reg_rio.cpp
98b050 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\bra_reg_santa.cpp
98b090 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\bra_reg_sp.cpp
98b0cc E:\dev\CM3\cm3 00-01\cm3\code\award\brazil_awards.cpp
98b104 E:\dev\CM3\cm3 00-01\cm3\code\transfer\brazil_rules.cpp
98b1fc E:\dev\CM3\cm3 00-01\cm3\code\cash.cpp
98b644 E:\dev\CM3\cm3 00-01\cm3\code\club_history.cpp
98b6a0 E:\dev\CM3\cm3 00-01\cm3\code\club_records.cpp
98e598 E:\dev\CM3\cm3 00-01\cm3\code\club_screens.cpp
99b3e0 E:\dev\CM3\cm3 00-01\cm3\code\coach.cpp
99b80c E:\dev\CM3\cm3 00-01\cm3\code\comp\comp.cpp
99c15c E:\dev\CM3\cm3 00-01\cm3\code\comp_screens.cpp
99ca94 E:\dev\CM3\cm3 00-01\cm3\code\comp\comp_stats.CPP
99ebd8 E:\dev\CM3\cm3 00-01\si\code\comp_text.cpp
99ec20 E:\dev\CM3\cm3 00-01\cm3\code\comp\comp_util.cpp
9a7d30 E:\dev\CM3\cm3 00-01\cm3\code\comp\eurocomp\con_champ.cpp
9a7d6c E:\dev\CM3\cm3 00-01\cm3\code\comp\eurocomp\con_merc_cup.cpp
9a7de4 E:\dev\CM3\cm3 00-01\cm3\code\comp\eurocomp\conmebol_liber.cpp
9a7e5c E:\dev\CM3\cm3 00-01\cm3\code\comp\eurocomp\conmebol_merc.cpp
9a7ed8 E:\dev\CM3\cm3 00-01\cm3\code\comp\conmebol_seeding.cpp
9a8190 E:\dev\CM3\cm3 00-01\cm3\code\contract_manager.cpp
9afc8c E:\dev\CM3\cm3 00-01\cm3\code\contract_screens.cpp
9b53c0 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\cro_a1.cpp
9b53f8 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\cro_a2a.cpp
9b5430 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\cro_a2b.cpp
9b5468 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\cro_cup.cpp
9b5538 E:\dev\CM3\cm3 00-01\cm3\code\award\croatia_awards.cpp
9b5570 E:\dev\CM3\cm3 00-01\cm3\code\transfer\croatia_rules.cpp
9b55ac E:\dev\CM3\cm3 00-01\cm3\code\comp\Cup.cpp
9b5944 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\cup_stage.cpp
9b5ac8 E:\dev\CM3\cm3 00-01\cm3\code\Database.cpp
9b8478 E:\dev\CM3\cm3 00-01\si\code\Date.cpp
9b8dc0 E:\dev\CM3\cm3 00-01\cm3\code\Db_files.cpp
9b8dfc E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\den_cup.cpp
9b8e30 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\den_first.cpp
9b8e6c E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\den_prm.cpp
9b8ea4 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\den_second.cpp
9b8ee0 E:\dev\CM3\cm3 00-01\cm3\code\award\denmark_awards.cpp
9b8f18 E:\dev\CM3\cm3 00-01\cm3\code\discipline.cpp
9c36ec E:\dev\CM3\cm3 00-01\si\code\display.cpp
9c3734 E:\dev\CM3\cm3 00-01\si\code\network.h
9c3858 E:\dev\CM3\cm3 00-01\cm3\code\dispute.cpp
9c4180 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\eng_auto_cup.cpp
9c4224 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\eng_cc_cup.cpp
9c425c E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\eng_charity.cpp
9c4294 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\eng_conf.cpp
9c42cc E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\eng_fa_cup.cpp
9c4338 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\eng_fa_trophy.cpp
9c4374 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\eng_first.cpp
9c43b0 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\eng_prm.cpp
9c43e8 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\eng_second.cpp
9c4424 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\eng_third.cpp
9c4460 E:\dev\CM3\cm3 00-01\cm3\code\award\england_awards.cpp
9c4498 E:\dev\CM3\cm3 00-01\cm3\code\transfer\england_rules.cpp
9c45f8 E:\dev\CM3\cm3 00-01\cm3\code\comp\eurocomp\eur_super_cup.cpp
9c4638 E:\dev\CM3\cm3 00-01\cm3\code\comp\intercomp\euro_champ.cpp
9c4674 E:\dev\CM3\cm3 00-01\cm3\code\comp\intercomp\euro_champ_qual.cpp
9c48c8 E:\dev\CM3\cm3 00-01\cm3\code\award\european_awards.cpp
9c4900 E:\dev\CM3\cm3 00-01\cm3\code\comp\eurocomp\european_cup.cpp
9c7474 E:\dev\CM3\cm3 00-01\cm3\code\comp\intercomp\fifa_confed.cpp
9c74f4 E:\dev\CM3\cm3 00-01\cm3\code\comp\fifa_rankings.cpp
9c7540 E:\dev\CM3\cm3 00-01\si\code\file_llist.CPP
9c7a48 E:\dev\CM3\cm3 00-01\cm3\code\file_screens.cpp
9c8158 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\fin_cup.cpp
9c818c E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\fin_first.cpp
9c8254 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\fin_prm.cpp
9c8784 E:\dev\CM3\cm3 00-01\cm3\code\finance.CPP
9c9eb4 E:\dev\CM3\cm3 00-01\cm3\code\find_screens.cpp
9ca1e0 E:\dev\CM3\cm3 00-01\cm3\code\Fine.cpp
9cc0fc E:\dev\CM3\cm3 00-01\cm3\code\award\finland_awards.cpp
9cc134 E:\dev\CM3\cm3 00-01\cm3\code\transfer\finland_rules.cpp
9cc208 E:\dev\CM3\cm3 00-01\cm3\code\comp\fix_man.cpp
9cc27c E:\dev\CM3\cm3 00-01\cm3\code\fog_of_war.cpp
9cc3dc E:\dev\CM3\cm3 00-01\cm3\code\formation.cpp
9ccaf0 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\fra_cfa.cpp
9ccb28 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\fra_cup.cpp
9ccb5c E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\fra_first.cpp
9ccb98 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\fra_lge_cup.cpp
9ccbd0 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\fra_lower.cpp
9ccc0c E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\fra_second.cpp
9ccc48 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\fra_super.cpp
9ccc80 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\fra_third.cpp
9cccbc E:\dev\CM3\cm3 00-01\cm3\code\award\france_awards.cpp
9cccf4 E:\dev\CM3\cm3 00-01\cm3\code\transfer\france_rules.cpp
9cd0a0 E:\dev\CM3\cm3 00-01\cm3\code\comp\friendly.cpp
9cd2a4 E:\dev\CM3\cm3 00-01\cm3\code\game.cpp
9cd3a0 E:\dev\CM3\cm3 00-01\cm3\code\game_config.cpp
9cd3e0 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\ger_cup.cpp
9cd414 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\ger_first.cpp
9cd450 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\ger_lge_cup.cpp
9cd488 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\ger_regional.cpp
9cd4c4 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\ger_second.cpp
9cd500 E:\dev\CM3\cm3 00-01\cm3\code\award\germany_awards.cpp
9cd538 E:\dev\CM3\cm3 00-01\cm3\code\transfer\germany_rules.cpp
9cd640 E:\dev\CM3\cm3 00-01\cm3\code\comp\intercomp\goldcup.cpp
9cdab0 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\gre_cup.cpp
9cdae4 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\gre_prm.cpp
9cdb1c E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\gre_second.cpp
9cdb58 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\gre_super.cpp
9cdb90 E:\dev\CM3\cm3 00-01\cm3\code\award\greece_awards.cpp
9cdbc8 E:\dev\CM3\cm3 00-01\cm3\code\transfer\greece_rules.cpp
9cdc00 E:\dev\CM3\cm3 00-01\si\code\gui_utils.cpp
9cdc60 E:\dev\CM3\cm3 00-01\si\code\Guio.cpp
9ce408 E:\dev\CM3\cm3 00-01\cm3\code\hall_of_fame.cpp
9cec24 E:\dev\CM3\cm3 00-01\cm3\code\History.cpp
9cedd4 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\hol_cup.cpp
9cee08 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\hol_first.cpp
9cefa4 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\hol_prm.cpp
9cefdc E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\hol_super.cpp
9cf014 E:\dev\CM3\cm3 00-01\cm3\code\award\holland_awards.cpp
9cf04c E:\dev\CM3\cm3 00-01\cm3\code\transfer\holland_rules.cpp
9cf0d8 E:\dev\CM3\cm3 00-01\cm3\code\comp\host_country.cpp
9cf11c E:\dev\CM3\cm3 00-01\cm3\code\human_manager.cpp
9d93cc E:\dev\CM3\cm3 00-01\cm3\code\index.cpp
9e7f28 E:\dev\CM3\cm3 00-01\cm3\code\injury.cpp
9e9d94 E:\dev\CM3\cm3 00-01\cm3\code\comp\eurocomp\inter_amer_cup.cpp
9e9dd4 E:\dev\CM3\cm3 00-01\cm3\code\award\international_awards.cpp
9e9e14 E:\dev\CM3\cm3 00-01\cm3\code\comp\eurocomp\intertoto_cup.cpp
9e9e94 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\ire_chal_cup.cpp
9e9ed0 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\ire_first.cpp
9e9f0c E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\ire_leinster_cup.cpp
9e9f4c E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\ire_lge_cup.cpp
9e9f84 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\ire_munster_cup.cpp
9ea000 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\ire_pres_cup.cpp
9ea080 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\ire_prm.cpp
9ea0b8 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\ire_super_cup.cpp
9ea0f4 E:\dev\CM3\cm3 00-01\cm3\code\award\ireland_awards.cpp
9ea12c E:\dev\CM3\cm3 00-01\cm3\code\transfer\ireland_rules.cpp
9ea1c8 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\ita_c1_super.cpp
9ea204 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\ita_c_cup.cpp
9ea23c E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\ita_cup.cpp
9ea2a8 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\ita_ser_a.cpp
9ea384 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\ita_ser_b.cpp
9ea474 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\ita_ser_c1a.cpp
9ea558 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\ita_ser_c1b.cpp
9ea654 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\ita_ser_c2a.cpp
9ea75c E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\ita_ser_c2b.cpp
9ea83c E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\ita_ser_c2c.cpp
9ea934 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\ita_super.cpp
9ea96c E:\dev\CM3\cm3 00-01\cm3\code\award\italy_awards.cpp
9ea9a4 E:\dev\CM3\cm3 00-01\cm3\code\transfer\italy_rules.cpp
9eab90 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\jap_emp_cup.cpp
9eabc8 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\jap_j1.cpp
9eaedc E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\jap_j2.cpp
9eaf14 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\jap_j_cup.cpp
9eaf4c E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\jap_super.cpp
9eaf84 E:\dev\CM3\cm3 00-01\cm3\code\award\japan_awards.cpp
9eafbc E:\dev\CM3\cm3 00-01\cm3\code\transfer\japan_rules.cpp
9eaff4 E:\dev\CM3\cm3 00-01\cm3\code\key_nation.cpp
9eb0e8 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\kor_fa_cup.cpp
9eb120 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\kor_league.cpp
9eb15c E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\kor_league_cup.cpp
9eb198 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\kor_super_cup.cpp
9eb1d4 E:\dev\CM3\cm3 00-01\cm3\code\award\korea_awards.cpp
9eb20c E:\dev\CM3\cm3 00-01\cm3\code\transfer\korea_rules.cpp
9ed840 E:\dev\CM3\cm3 00-01\si\code\Langlib.cpp
9f15f4 E:\dev\CM3\cm3 00-01\cm3\code\comp\league.cpp
9f1630 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\league_stage.cpp
9f1734 E:\dev\CM3\cm3 00-01\si\code\main.cpp
9f18a4 E:\dev\CM3\cm3 00-01\cm3\code\manager_manager.cpp
a15138 E:\dev\CM3\cm3 00-01\cm3\code\manager_screens.cpp
a15708 E:\dev\CM3\cm3 00-01\cm3\code\match_day.cpp
a15884 E:\dev\CM3\cm3 00-01\cm3\code\match_eng.cpp
a159b0 E:\dev\CM3\cm3 00-01\cm3\code\match_events.cpp
a15da4 E:\dev\CM3\cm3 00-01\cm3\code\match_man.cpp
a15e10 E:\dev\CM3\cm3 00-01\cm3\code\match_official.cpp
a16058 E:\dev\CM3\cm3 00-01\cm3\code\match_pl.cpp
a161d4 E:\dev\CM3\cm3 00-01\cm3\code\match_screens.cpp
a17ba0 E:\dev\CM3\cm3 00-01\cm3\code\match_stats.CPP
a17bec E:\dev\CM3\cm3 00-01\cm3\code\media.cpp
a5a51c E:\dev\CM3\cm3 00-01\cm3\code\Menubar.cpp
a5ab00 E:\dev\CM3\cm3 00-01\cm3\code\comp\friendly\mini_cup.cpp
a5ab3c E:\dev\CM3\cm3 00-01\cm3\code\comp\friendly\mini_league.cpp
a5abe4 E:\dev\CM3\cm3 00-01\cm3\code\award\month_award.cpp
a5b234 E:\dev\CM3\cm3 00-01\cm3\code\award\month_ratings.cpp
a5b26c E:\dev\CM3\cm3 00-01\cm3\code\award\nation_awards.cpp
a5b2a4 E:\dev\CM3\cm3 00-01\cm3\code\national_teams.cpp
a645e4 E:\dev\CM3\cm3 00-01\cm3\code\national_teams_screens.cpp
a649a8 E:\dev\CM3\cm3 00-01\si\code\network.CPP
a649e8 E:\dev\CM3\cm3 00-01\cm3\code\new_transfer_rule_screens.cpp
a693ec E:\dev\CM3\cm3 00-01\cm3\code\news.cpp
a694ac E:\dev\CM3\cm3 00-01\cm3\code\news_screens.cpp
a695f0 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\nir_charity.cpp
a69628 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\nir_cup.cpp
a6965c E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\nir_first.cpp
a69698 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\nir_lge_cup.cpp
a696d0 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\nir_prm.cpp
a69708 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\nor_cup.cpp
a69740 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\nor_first.cpp
a6977c E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\nor_prm.cpp
a697b4 E:\dev\CM3\cm3 00-01\cm3\code\award\northern_ireland_awards.cpp
a697f4 E:\dev\CM3\cm3 00-01\cm3\code\transfer\northern_ireland_rules.cpp
a69838 E:\dev\CM3\cm3 00-01\cm3\code\award\norway_awards.cpp
a69870 E:\dev\CM3\cm3 00-01\cm3\code\transfer\norway_rules.cpp
a69a18 E:\dev\CM3\cm3 00-01\cm3\code\notes.cpp
a6a068 E:\dev\CM3\cm3 00-01\cm3\code\comp\eurocomp\oceania_club_champ.cpp
a6a0ec E:\dev\CM3\cm3 00-01\cm3\code\comp\intercomp\oceania_nations.cpp
a6a22c E:\dev\CM3\cm3 00-01\cm3\code\officials_manager.cpp
a6a268 E:\dev\CM3\cm3 00-01\cm3\code\award\old_finland_awards.cpp
a6a2a4 E:\dev\CM3\cm3 00-01\cm3\code\award\old_france_awards.cpp
a6a2e0 E:\dev\CM3\cm3 00-01\cm3\code\award\old_international_awards.cpp
a6a324 E:\dev\CM3\cm3 00-01\cm3\code\award\old_ireland_awards.cpp
a6a360 E:\dev\CM3\cm3 00-01\cm3\code\comp\intercomp\olympics.cpp
a6a39c E:\dev\CM3\cm3 00-01\si\code\os.cpp
a6b1e0 E:\dev\CM3\cm3 00-01\cm3\code\physio.cpp
a6bf9c E:\dev\CM3\cm3 00-01\cm3\code\player_regen.cpp
a701b0 E:\dev\CM3\cm3 00-01\cm3\code\player_search.cpp
a78310 E:\dev\CM3\cm3 00-01\cm3\code\player_stats.cpp
a7853c E:\dev\CM3\cm3 00-01\si\code\plot.cpp
a78564 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\pol_cup.cpp
a78598 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\pol_first.cpp
a785d4 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\pol_lge_cup.cpp
a7860c E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\pol_second.cpp
a78648 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\pol_super.cpp
a78680 E:\dev\CM3\cm3 00-01\cm3\code\award\poland_awards.cpp
a786b8 E:\dev\CM3\cm3 00-01\cm3\code\transfer\poland_rules.cpp
a786f0 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\por_cup.cpp
a78724 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\por_prm.cpp
a7875c E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\por_second.cpp
a78798 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\por_second_b.cpp
a787d4 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\por_super.cpp
a7880c E:\dev\CM3\cm3 00-01\cm3\code\award\portugal_awards.cpp
a78844 E:\dev\CM3\cm3 00-01\cm3\code\transfer\portugal_rules.cpp
a78a50 E:\dev\CM3\cm3 00-01\cm3\code\printouts.cpp
a794dc E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_argentina.cpp
a79518 E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_asia.cpp
a79550 E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_australia.cpp
a79598 E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_belgium_cup.cpp
a795e8 E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_belgium_league.cpp
a7963c E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_brazil_national.cpp
a79694 E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_brazil_regional.cpp
a796d8 E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_croatia.cpp
a79714 E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_denmark.cpp
a79750 E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_england.cpp
a7978c E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_europe.cpp
a797d0 E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_finland_cup.cpp
a79820 E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_finland_league.cpp
a79860 E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_france.cpp
a798a4 E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_germany_cup.cpp
a798f4 E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_germany_league.cpp
a79934 E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_greece.cpp
a7996c E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_holland.cpp
a799b8 E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_international.cpp
a799f8 E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_ireland.cpp
a79a40 E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_italy_cup.cpp
a79a8c E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_italy_league.cpp
a79adc E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_japan_cup.cpp
a79b28 E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_japan_league.cpp
a79b68 E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_korea.cpp
a79ba0 E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_northern_ireland.cpp
a79bf4 E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_norway_cup.cpp
a79c44 E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_norway_league.cpp
a79c84 E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_oceania.cpp
a79cc0 E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_poland.cpp
a79cf8 E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_portugal.cpp
a79d34 E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_russia.cpp
a79d7c E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_scotland_cup.cpp
a79dcc E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_scotland_league.cpp
a79e10 E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_south_america.cpp
a79e5c E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_spain_cup.cpp
a79ea8 E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_spain_league.cpp
a79ef4 E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_sweden_cup.cpp
a79f40 E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_sweden_league.cpp
a79f8c E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_turkey_cup.cpp
a79fd8 E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_turkey_league.cpp
a7a018 E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_usa.cpp
a7a050 E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\rb_wales.cpp
a7a088 E:\dev\CM3\cm3 00-01\cm3\code\record_utils.cpp
a7a858 E:\dev\CM3\cm3 00-01\cm3\code\ruling_body\ruling_body.cpp
a7ac58 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\rus_cup.cpp
a7ac8c E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\rus_first.cpp
a7acc8 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\rus_prm.cpp
a7ad00 E:\dev\CM3\cm3 00-01\cm3\code\award\russia_awards.cpp
a7ad38 E:\dev\CM3\cm3 00-01\cm3\code\transfer\russia_rules.cpp
a7ad70 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\sco_chal_cup.cpp
a7adac E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\sco_fa_cup.cpp
a7ade4 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\sco_first.cpp
a7af38 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\sco_lge_cup.cpp
a7af70 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\sco_prm.cpp
a7afa8 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\sco_second.cpp
a7afe4 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\sco_third.cpp
a7b020 E:\dev\CM3\cm3 00-01\cm3\code\award\scotland_awards.cpp
a7b058 E:\dev\CM3\cm3 00-01\cm3\code\transfer\scotland_rules.cpp
a7b094 E:\dev\CM3\cm3 00-01\cm3\code\scout_manager.cpp
a7ddbc E:\dev\CM3\cm3 00-01\si\code\scrman.cpp
a7de5c E:\dev\CM3\cm3 00-01\cm3\code\search_edit_session.cpp
a7de94 E:\dev\CM3\cm3 00-01\cm3\code\search_eng.cpp
a7df38 E:\dev\CM3\cm3 00-01\cm3\code\search_filters.cpp
a7e840 E:\dev\CM3\cm3 00-01\cm3\code\search_screens.cpp
a801dc E:\dev\CM3\cm3 00-01\cm3\code\Setup.cpp
a825a4 E:\dev\CM3\cm3 00-01\cm3\code\shortlist_manager.cpp
a8278c E:\dev\CM3\cm3 00-01\cm3\code\simulated_stats.cpp
a82810 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\spa_cup.cpp
a82844 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\spa_first.cpp
a82880 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\spa_lower.cpp
a828bc E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\spa_second.cpp
a828f8 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\spa_second_b.cpp
a82a58 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\spa_super.cpp
a82a90 E:\dev\CM3\cm3 00-01\cm3\code\award\spain_awards.cpp
a82ac8 E:\dev\CM3\cm3 00-01\cm3\code\transfer\spain_rules.cpp
a82b88 E:\dev\CM3\cm3 00-01\cm3\code\comp\squad_manager.cpp
a835b0 E:\dev\CM3\cm3 00-01\cm3\code\comp\stadium.cpp
a8360c E:\dev\CM3\cm3 00-01\cm3\code\staff_contracts.cpp
a83b78 E:\dev\CM3\cm3 00-01\cm3\code\staff_records.cpp
a84aac E:\dev\CM3\cm3 00-01\cm3\code\staff_screens.cpp
a8b464 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\sub_league.cpp
a8b4a0 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\swe_cup.cpp
a8b53c E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\swe_first.cpp
a8b578 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\swe_prm.cpp
a8b5b0 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\swe_second.cpp
a8b5ec E:\dev\CM3\cm3 00-01\cm3\code\award\sweden_awards.cpp
a8b908 E:\dev\CM3\cm3 00-01\cm3\code\tactics.cpp
a8b94c E:\dev\CM3\cm3 00-01\cm3\code\tactics_screens.cpp
a8c6d4 E:\dev\CM3\cm3 00-01\si\code\tcpip.cpp
a8c87c E:\dev\CM3\cm3 00-01\cm3\code\award\team_award.cpp
a8cc88 E:\dev\CM3\cm3 00-01\cm3\code\training_edit_session.cpp
a8ccd0 E:\dev\CM3\cm3 00-01\cm3\code\training_manager.cpp
a8cfa0 E:\dev\CM3\cm3 00-01\cm3\code\training_schedule.cpp
a8d1d8 E:\dev\CM3\cm3 00-01\cm3\code\training_screens.cpp
a8d514 E:\dev\CM3\cm3 00-01\cm3\code\transfer_manager.cpp
a9e318 E:\dev\CM3\cm3 00-01\cm3\code\transfer_offer.cpp
a9e98c E:\dev\CM3\cm3 00-01\cm3\code\transfer_screens.cpp
aa180c E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\tur_cup.cpp
aa1840 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\tur_first.cpp
aa187c E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\tur_second.cpp
aa18b8 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\tur_second_b.cpp
aa1970 E:\dev\CM3\cm3 00-01\cm3\code\award\turkey_awards.cpp
aa19a8 E:\dev\CM3\cm3 00-01\cm3\code\transfer\turkey_rules.cpp
aa19e0 E:\dev\CM3\cm3 00-01\cm3\code\comp\eurocomp\uefa_cup.cpp
aa1a1c E:\dev\CM3\cm3 00-01\cm3\code\comp\uefa_seeding.cpp
aa1b90 E:\dev\CM3\cm3 00-01\cm3\code\ultimatum.cpp
aa1f80 E:\dev\CM3\cm3 00-01\cm3\code\award\usa_awards.cpp
aa1fb4 E:\dev\CM3\cm3 00-01\cm3\code\comp\leagues\usa_mls.cpp
aa20a0 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\usa_mls_all_stars.cpp
aa20e0 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\usa_open_cup.cpp
aa211c E:\dev\CM3\cm3 00-01\cm3\code\transfer\usa_rules.cpp
ad4134 E:\dev\CM3\cm3 00-01\si\code\utils.cpp
ad439c E:\dev\CM3\cm3 00-01\cm3\code\virtual_staff.cpp
ad43cc E:\dev\CM3\cm3 00-01\cm3\code\award\wales_awards.cpp
ad4404 E:\dev\CM3\cm3 00-01\cm3\code\transfer\wales_rules.cpp
ad443c E:\dev\CM3\cm3 00-01\cm3\code\comp\worldcup\wc_african_cup.cpp
ad4680 E:\dev\CM3\cm3 00-01\cm3\code\comp\worldcup\wc_asia_league.cpp
ad4850 E:\dev\CM3\cm3 00-01\cm3\code\comp\worldcup\wc_concacaf_cup.cpp
ad4a6c E:\dev\CM3\cm3 00-01\cm3\code\comp\worldcup\wc_europe_league.cpp
ad4afc E:\dev\CM3\cm3 00-01\cm3\code\comp\worldcup\wc_oceania_league.cpp
ad4ce0 E:\dev\CM3\cm3 00-01\cm3\code\comp\worldcup\wc_south_american_league .cpp
ad4dec E:\dev\CM3\cm3 00-01\cm3\code\weather.cpp
ad5684 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\wel_cup.cpp
ad56f4 E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\wel_lge_cup.cpp
ad572c E:\dev\CM3\cm3 00-01\cm3\code\comp\cups\wel_prm_cup.cpp
ad5764 E:\dev\CM3\cm3 00-01\cm3\code\comp\eurocomp\world_club_champ.cpp
ad5848 E:\dev\CM3\cm3 00-01\cm3\code\comp\eurocomp\world_club_cup.cpp
ad5888 E:\dev\CM3\cm3 00-01\cm3\code\comp\worldcup\world_cup.cpp
ad58c4 E:\dev\CM3\cm3 00-01\cm3\code\award\world_cup_awards.cpp
ad59b0 E:\dev\CM3\cm3 00-01\cm3\code\award\year_award.cpp
ad6a38 E:\dev\CM3\cm3 00-01\cm3\code\award\year_ratings.cpp
ad6ab0 E:\dev\CM3\cm3 00-01\si\code\zipdir.cpp
```

Spoiler

9870f8 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\intercomp\\african\_nations.cpp

9873c0 E:\\dev\\CM3\\cm3 00-01\\si\\code\\Area.cpp

9873e8 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\arg\_prm.cpp

9874ec E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\arg\_second.cpp

987924 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\argentina\_awards.cpp

987960 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\transfer\\argentina\_rules.cpp

987a40 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\eurocomp\\asia\_club\_champ.cpp

987b60 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\eurocomp\\asia\_cup\_winner.cpp

987ba0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\intercomp\\asia\_nations.cpp

987be0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\eurocomp\\asia\_super\_cup.cpp

987c20 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\aus\_nsl.cpp

987cc0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\australia\_awards.cpp

987cfc E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\transfer\\australia\_rules.cpp

987e24 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\award\_manager.cpp

987fa4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\_screens.cpp

9880b0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\award\_shortlist.cpp

9880f4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\awol.cpp

989934 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\background.cpp

989ae0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\bel\_fa\_cup.cpp

989b18 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\bel\_first.cpp

989b54 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\bel\_second.cpp

989ccc E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\bel\_super.cpp

989d04 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\bel\_third.cpp

989dfc E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\belgium\_awards.cpp

989e34 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\transfer\\belgium\_rules.cpp

98a1e8 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\bra\_champ\_cup.cpp

98a3bc E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\bra\_cup.cpp

98aa30 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\bra\_nat\_first.cpp

98ab64 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\bra\_nat\_second.cpp

98aba4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\bra\_nat\_third.cpp

98acac E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\bra\_reg\_bahia.cpp

98ae10 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\bra\_reg\_central.cpp

98ae50 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\bra\_reg\_gaucho.cpp

98ae90 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\bra\_reg\_goias.cpp

98aed0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\bra\_reg\_minas\_gerais.cpp

98af14 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\bra\_reg\_north.cpp

98af54 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\bra\_reg\_northeast.cpp

98af98 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\bra\_reg\_parana.cpp

98afd8 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\bra\_reg\_pern.cpp

98b014 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\bra\_reg\_rio.cpp

98b050 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\bra\_reg\_santa.cpp

98b090 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\bra\_reg\_sp.cpp

98b0cc E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\brazil\_awards.cpp

98b104 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\transfer\\brazil\_rules.cpp

98b1fc E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\cash.cpp

98b644 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\club\_history.cpp

98b6a0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\club\_records.cpp

98e598 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\club\_screens.cpp

99b3e0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\coach.cpp

99b80c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\comp.cpp

99c15c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\_screens.cpp

99ca94 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\comp\_stats.CPP

99ebd8 E:\\dev\\CM3\\cm3 00-01\\si\\code\\comp\_text.cpp

99ec20 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\comp\_util.cpp

9a7d30 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\eurocomp\\con\_champ.cpp

9a7d6c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\eurocomp\\con\_merc\_cup.cpp

9a7de4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\eurocomp\\conmebol\_liber.cpp

9a7e5c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\eurocomp\\conmebol\_merc.cpp

9a7ed8 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\conmebol\_seeding.cpp

9a8190 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\contract\_manager.cpp

9afc8c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\contract\_screens.cpp

9b53c0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\cro\_a1.cpp

9b53f8 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\cro\_a2a.cpp

9b5430 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\cro\_a2b.cpp

9b5468 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\cro\_cup.cpp

9b5538 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\croatia\_awards.cpp

9b5570 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\transfer\\croatia\_rules.cpp

9b55ac E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\Cup.cpp

9b5944 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\cup\_stage.cpp

9b5ac8 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\Database.cpp

9b8478 E:\\dev\\CM3\\cm3 00-01\\si\\code\\Date.cpp

9b8dc0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\Db\_files.cpp

9b8dfc E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\den\_cup.cpp

9b8e30 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\den\_first.cpp

9b8e6c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\den\_prm.cpp

9b8ea4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\den\_second.cpp

9b8ee0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\denmark\_awards.cpp

9b8f18 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\discipline.cpp

9c36ec E:\\dev\\CM3\\cm3 00-01\\si\\code\\display.cpp

9c3734 E:\\dev\\CM3\\cm3 00-01\\si\\code\\network.h

9c3858 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\dispute.cpp

9c4180 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\eng\_auto\_cup.cpp

9c4224 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\eng\_cc\_cup.cpp

9c425c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\eng\_charity.cpp

9c4294 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\eng\_conf.cpp

9c42cc E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\eng\_fa\_cup.cpp

9c4338 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\eng\_fa\_trophy.cpp

9c4374 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\eng\_first.cpp

9c43b0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\eng\_prm.cpp

9c43e8 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\eng\_second.cpp

9c4424 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\eng\_third.cpp

9c4460 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\england\_awards.cpp

9c4498 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\transfer\\england\_rules.cpp

9c45f8 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\eurocomp\\eur\_super\_cup.cpp

9c4638 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\intercomp\\euro\_champ.cpp

9c4674 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\intercomp\\euro\_champ\_qual.cpp

9c48c8 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\european\_awards.cpp

9c4900 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\eurocomp\\european\_cup.cpp

9c7474 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\intercomp\\fifa\_confed.cpp

9c74f4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\fifa\_rankings.cpp

9c7540 E:\\dev\\CM3\\cm3 00-01\\si\\code\\file\_llist.CPP

9c7a48 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\file\_screens.cpp

9c8158 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\fin\_cup.cpp

9c818c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\fin\_first.cpp

9c8254 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\fin\_prm.cpp

9c8784 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\finance.CPP

9c9eb4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\find\_screens.cpp

9ca1e0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\Fine.cpp

9cc0fc E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\finland\_awards.cpp

9cc134 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\transfer\\finland\_rules.cpp

9cc208 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\fix\_man.cpp

9cc27c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\fog\_of\_war.cpp

9cc3dc E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\formation.cpp

9ccaf0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\fra\_cfa.cpp

9ccb28 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\fra\_cup.cpp

9ccb5c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\fra\_first.cpp

9ccb98 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\fra\_lge\_cup.cpp

9ccbd0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\fra\_lower.cpp

9ccc0c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\fra\_second.cpp

9ccc48 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\fra\_super.cpp

9ccc80 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\fra\_third.cpp

9cccbc E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\france\_awards.cpp

9cccf4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\transfer\\france\_rules.cpp

9cd0a0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\friendly.cpp

9cd2a4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\game.cpp

9cd3a0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\game\_config.cpp

9cd3e0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\ger\_cup.cpp

9cd414 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\ger\_first.cpp

9cd450 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\ger\_lge\_cup.cpp

9cd488 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\ger\_regional.cpp

9cd4c4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\ger\_second.cpp

9cd500 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\germany\_awards.cpp

9cd538 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\transfer\\germany\_rules.cpp

9cd640 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\intercomp\\goldcup.cpp

9cdab0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\gre\_cup.cpp

9cdae4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\gre\_prm.cpp

9cdb1c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\gre\_second.cpp

9cdb58 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\gre\_super.cpp

9cdb90 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\greece\_awards.cpp

9cdbc8 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\transfer\\greece\_rules.cpp

9cdc00 E:\\dev\\CM3\\cm3 00-01\\si\\code\\gui\_utils.cpp

9cdc60 E:\\dev\\CM3\\cm3 00-01\\si\\code\\Guio.cpp

9ce408 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\hall\_of\_fame.cpp

9cec24 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\History.cpp

9cedd4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\hol\_cup.cpp

9cee08 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\hol\_first.cpp

9cefa4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\hol\_prm.cpp

9cefdc E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\hol\_super.cpp

9cf014 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\holland\_awards.cpp

9cf04c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\transfer\\holland\_rules.cpp

9cf0d8 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\host\_country.cpp

9cf11c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\human\_manager.cpp

9d93cc E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\index.cpp

9e7f28 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\injury.cpp

9e9d94 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\eurocomp\\inter\_amer\_cup.cpp

9e9dd4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\international\_awards.cpp

9e9e14 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\eurocomp\\intertoto\_cup.cpp

9e9e94 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\ire\_chal\_cup.cpp

9e9ed0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\ire\_first.cpp

9e9f0c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\ire\_leinster\_cup.cpp

9e9f4c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\ire\_lge\_cup.cpp

9e9f84 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\ire\_munster\_cup.cpp

9ea000 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\ire\_pres\_cup.cpp

9ea080 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\ire\_prm.cpp

9ea0b8 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\ire\_super\_cup.cpp

9ea0f4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\ireland\_awards.cpp

9ea12c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\transfer\\ireland\_rules.cpp

9ea1c8 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\ita\_c1\_super.cpp

9ea204 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\ita\_c\_cup.cpp

9ea23c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\ita\_cup.cpp

9ea2a8 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\ita\_ser\_a.cpp

9ea384 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\ita\_ser\_b.cpp

9ea474 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\ita\_ser\_c1a.cpp

9ea558 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\ita\_ser\_c1b.cpp

9ea654 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\ita\_ser\_c2a.cpp

9ea75c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\ita\_ser\_c2b.cpp

9ea83c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\ita\_ser\_c2c.cpp

9ea934 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\ita\_super.cpp

9ea96c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\italy\_awards.cpp

9ea9a4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\transfer\\italy\_rules.cpp

9eab90 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\jap\_emp\_cup.cpp

9eabc8 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\jap\_j1.cpp

9eaedc E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\jap\_j2.cpp

9eaf14 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\jap\_j\_cup.cpp

9eaf4c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\jap\_super.cpp

9eaf84 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\japan\_awards.cpp

9eafbc E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\transfer\\japan\_rules.cpp

9eaff4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\key\_nation.cpp

9eb0e8 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\kor\_fa\_cup.cpp

9eb120 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\kor\_league.cpp

9eb15c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\kor\_league\_cup.cpp

9eb198 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\kor\_super\_cup.cpp

9eb1d4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\korea\_awards.cpp

9eb20c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\transfer\\korea\_rules.cpp

9ed840 E:\\dev\\CM3\\cm3 00-01\\si\\code\\Langlib.cpp

9f15f4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\league.cpp

9f1630 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\league\_stage.cpp

9f1734 E:\\dev\\CM3\\cm3 00-01\\si\\code\\main.cpp

9f18a4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\manager\_manager.cpp

a15138 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\manager\_screens.cpp

a15708 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\match\_day.cpp

a15884 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\match\_eng.cpp

a159b0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\match\_events.cpp

a15da4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\match\_man.cpp

a15e10 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\match\_official.cpp

a16058 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\match\_pl.cpp

a161d4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\match\_screens.cpp

a17ba0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\match\_stats.CPP

a17bec E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\media.cpp

a5a51c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\Menubar.cpp

a5ab00 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\friendly\\mini\_cup.cpp

a5ab3c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\friendly\\mini\_league.cpp

a5abe4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\month\_award.cpp

a5b234 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\month\_ratings.cpp

a5b26c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\nation\_awards.cpp

a5b2a4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\national\_teams.cpp

a645e4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\national\_teams\_screens.cpp

a649a8 E:\\dev\\CM3\\cm3 00-01\\si\\code\\network.CPP

a649e8 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\new\_transfer\_rule\_screens.cpp

a693ec E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\news.cpp

a694ac E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\news\_screens.cpp

a695f0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\nir\_charity.cpp

a69628 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\nir\_cup.cpp

a6965c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\nir\_first.cpp

a69698 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\nir\_lge\_cup.cpp

a696d0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\nir\_prm.cpp

a69708 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\nor\_cup.cpp

a69740 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\nor\_first.cpp

a6977c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\nor\_prm.cpp

a697b4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\northern\_ireland\_awards.cpp

a697f4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\transfer\\northern\_ireland\_rules.cpp

a69838 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\norway\_awards.cpp

a69870 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\transfer\\norway\_rules.cpp

a69a18 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\notes.cpp

a6a068 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\eurocomp\\oceania\_club\_champ.cpp

a6a0ec E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\intercomp\\oceania\_nations.cpp

a6a22c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\officials\_manager.cpp

a6a268 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\old\_finland\_awards.cpp

a6a2a4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\old\_france\_awards.cpp

a6a2e0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\old\_international\_awards.cpp

a6a324 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\old\_ireland\_awards.cpp

a6a360 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\intercomp\\olympics.cpp

a6a39c E:\\dev\\CM3\\cm3 00-01\\si\\code\\os.cpp

a6b1e0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\physio.cpp

a6bf9c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\player\_regen.cpp

a701b0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\player\_search.cpp

a78310 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\player\_stats.cpp

a7853c E:\\dev\\CM3\\cm3 00-01\\si\\code\\plot.cpp

a78564 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\pol\_cup.cpp

a78598 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\pol\_first.cpp

a785d4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\pol\_lge\_cup.cpp

a7860c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\pol\_second.cpp

a78648 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\pol\_super.cpp

a78680 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\poland\_awards.cpp

a786b8 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\transfer\\poland\_rules.cpp

a786f0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\por\_cup.cpp

a78724 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\por\_prm.cpp

a7875c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\por\_second.cpp

a78798 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\por\_second\_b.cpp

a787d4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\por\_super.cpp

a7880c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\portugal\_awards.cpp

a78844 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\transfer\\portugal\_rules.cpp

a78a50 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\printouts.cpp

a794dc E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_argentina.cpp

a79518 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_asia.cpp

a79550 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_australia.cpp

a79598 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_belgium\_cup.cpp

a795e8 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_belgium\_league.cpp

a7963c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_brazil\_national.cpp

a79694 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_brazil\_regional.cpp

a796d8 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_croatia.cpp

a79714 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_denmark.cpp

a79750 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_england.cpp

a7978c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_europe.cpp

a797d0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_finland\_cup.cpp

a79820 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_finland\_league.cpp

a79860 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_france.cpp

a798a4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_germany\_cup.cpp

a798f4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_germany\_league.cpp

a79934 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_greece.cpp

a7996c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_holland.cpp

a799b8 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_international.cpp

a799f8 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_ireland.cpp

a79a40 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_italy\_cup.cpp

a79a8c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_italy\_league.cpp

a79adc E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_japan\_cup.cpp

a79b28 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_japan\_league.cpp

a79b68 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_korea.cpp

a79ba0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_northern\_ireland.cpp

a79bf4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_norway\_cup.cpp

a79c44 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_norway\_league.cpp

a79c84 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_oceania.cpp

a79cc0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_poland.cpp

a79cf8 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_portugal.cpp

a79d34 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_russia.cpp

a79d7c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_scotland\_cup.cpp

a79dcc E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_scotland\_league.cpp

a79e10 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_south\_america.cpp

a79e5c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_spain\_cup.cpp

a79ea8 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_spain\_league.cpp

a79ef4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_sweden\_cup.cpp

a79f40 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_sweden\_league.cpp

a79f8c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_turkey\_cup.cpp

a79fd8 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_turkey\_league.cpp

a7a018 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_usa.cpp

a7a050 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\rb\_wales.cpp

a7a088 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\record\_utils.cpp

a7a858 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ruling\_body\\ruling\_body.cpp

a7ac58 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\rus\_cup.cpp

a7ac8c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\rus\_first.cpp

a7acc8 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\rus\_prm.cpp

a7ad00 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\russia\_awards.cpp

a7ad38 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\transfer\\russia\_rules.cpp

a7ad70 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\sco\_chal\_cup.cpp

a7adac E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\sco\_fa\_cup.cpp

a7ade4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\sco\_first.cpp

a7af38 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\sco\_lge\_cup.cpp

a7af70 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\sco\_prm.cpp

a7afa8 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\sco\_second.cpp

a7afe4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\sco\_third.cpp

a7b020 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\scotland\_awards.cpp

a7b058 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\transfer\\scotland\_rules.cpp

a7b094 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\scout\_manager.cpp

a7ddbc E:\\dev\\CM3\\cm3 00-01\\si\\code\\scrman.cpp

a7de5c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\search\_edit\_session.cpp

a7de94 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\search\_eng.cpp

a7df38 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\search\_filters.cpp

a7e840 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\search\_screens.cpp

a801dc E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\Setup.cpp

a825a4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\shortlist\_manager.cpp

a8278c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\simulated\_stats.cpp

a82810 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\spa\_cup.cpp

a82844 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\spa\_first.cpp

a82880 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\spa\_lower.cpp

a828bc E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\spa\_second.cpp

a828f8 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\spa\_second\_b.cpp

a82a58 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\spa\_super.cpp

a82a90 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\spain\_awards.cpp

a82ac8 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\transfer\\spain\_rules.cpp

a82b88 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\squad\_manager.cpp

a835b0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\stadium.cpp

a8360c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\staff\_contracts.cpp

a83b78 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\staff\_records.cpp

a84aac E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\staff\_screens.cpp

a8b464 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\sub\_league.cpp

a8b4a0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\swe\_cup.cpp

a8b53c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\swe\_first.cpp

a8b578 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\swe\_prm.cpp

a8b5b0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\swe\_second.cpp

a8b5ec E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\sweden\_awards.cpp

a8b908 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\tactics.cpp

a8b94c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\tactics\_screens.cpp

a8c6d4 E:\\dev\\CM3\\cm3 00-01\\si\\code\\tcpip.cpp

a8c87c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\team\_award.cpp

a8cc88 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\training\_edit\_session.cpp

a8ccd0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\training\_manager.cpp

a8cfa0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\training\_schedule.cpp

a8d1d8 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\training\_screens.cpp

a8d514 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\transfer\_manager.cpp

a9e318 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\transfer\_offer.cpp

a9e98c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\transfer\_screens.cpp

aa180c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\tur\_cup.cpp

aa1840 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\tur\_first.cpp

aa187c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\tur\_second.cpp

aa18b8 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\tur\_second\_b.cpp

aa1970 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\turkey\_awards.cpp

aa19a8 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\transfer\\turkey\_rules.cpp

aa19e0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\eurocomp\\uefa\_cup.cpp

aa1a1c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\uefa\_seeding.cpp

aa1b90 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\ultimatum.cpp

aa1f80 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\usa\_awards.cpp

aa1fb4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\leagues\\usa\_mls.cpp

aa20a0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\usa\_mls\_all\_stars.cpp

aa20e0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\usa\_open\_cup.cpp

aa211c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\transfer\\usa\_rules.cpp

ad4134 E:\\dev\\CM3\\cm3 00-01\\si\\code\\utils.cpp

ad439c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\virtual\_staff.cpp

ad43cc E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\wales\_awards.cpp

ad4404 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\transfer\\wales\_rules.cpp

ad443c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\worldcup\\wc\_african\_cup.cpp

ad4680 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\worldcup\\wc\_asia\_league.cpp

ad4850 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\worldcup\\wc\_concacaf\_cup.cpp

ad4a6c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\worldcup\\wc\_europe\_league.cpp

ad4afc E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\worldcup\\wc\_oceania\_league.cpp

ad4ce0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\worldcup\\wc\_south\_american\_league .cpp

ad4dec E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\weather.cpp

ad5684 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\wel\_cup.cpp

ad56f4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\wel\_lge\_cup.cpp

ad572c E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\cups\\wel\_prm\_cup.cpp

ad5764 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\eurocomp\\world\_club\_champ.cpp

ad5848 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\eurocomp\\world\_club\_cup.cpp

ad5888 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\comp\\worldcup\\world\_cup.cpp

ad58c4 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\world\_cup\_awards.cpp

ad59b0 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\year\_award.cpp

ad6a38 E:\\dev\\CM3\\cm3 00-01\\cm3\\code\\award\\year\_ratings.cpp

ad6ab0 E:\\dev\\CM3\\cm3 00-01\\si\\code\\zipdir.cpp

**\\* \[TUTORIAL\] How to install and run the game CM0102?> [viewtopic.php?f=85&t=3571](https://champman0102.net/viewtopic.php?f=85&t=3571)** **Please use search bar for solution before posting your issue**

[John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338)Patch Team**Posts:** 326**Joined:** Wed Nov 25, 2020 12:26 am**Has thanked:** [175 times](https://champman0102.net/app.php/thankslist/givens/338/true)**Been thanked:** [169 times](https://champman0102.net/app.php/thankslist/givens/338/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=21499\#p21499)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=21499 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=21499 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=21499#p21499 "Post") by **[John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338)** » Thu Mar 18, 2021 4:55 pm

0089A6B3 \|. 74 61 JE SHORT 3968.0089A716

0089A83F 74 61 JE SHORT 3968.0089A8A2

Fill these with NOP and the 'Load Preset' option will be available on the Tactics screen (for opening AI tactic files).

Patch form:

Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=75#)

```
0x49a6b3 0x74 0x90
0x49a6b4 0x61 0x90
0x49a83f 0x74 0x90
0x49a840 0x61 0x90
```

**Deleted User 211**

### [Offsets](https://champman0102.net/viewtopic.php?p=21543\#p21543)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=21543 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=21543 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=21543#p21543 "Post") by **Deleted User 211** » Thu Mar 18, 2021 11:30 pm

Hi guys,

Does anyone remember if there's ever been a patch for allowing Bosman transfers in all countries? I know Saturn has provided the odd fix in the past to allow it in some countries, so I assume it's possible to enable it for all.

A couple more questions - I'm looking at the "jobs abroad boost", and can see that Saturn added 5 changes for it initially:

Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=75#)

```
0x29d315 0x7e 0xeb
0x29d664 0x3b 0xff
0x29d6e4 0x7d 0xeb
0x29ea36 0x74 0xeb
0x29ea7e 0x74 0xeb
```

But I've noticed within Nick's "misc files" zip file, there are only 4 changes, and 1 of them is different to the original:

Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=75#)

```
0x29d315 0x7e 0xeb
0x29d665 0x7e 0xeb
0x29d6e4 0x7d 0xeb
0x29ea7e 0x74 0xeb
```

On top of that, within the CM0102 Loader code, I've noticed it is back to 5 changes, but it is a combination of the above sets of changes ![:D](https://champman0102.net/images/smilies/icon_e_biggrin.gif)

Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=75#)

```
0x29ea36 0x74 0xeb
0x29d315 0x7e 0xeb
0x29d665 0x7e 0xeb
0x29d6e4 0x7d 0xeb
0x29ea7e 0x74 0xeb
```

Can anyone please confirm which is the correct combination? I'm looking to add the patch to my tool, and I want to make sure I get it right. I'm also a proper noob when it comes to the patching side of things, so right now don't have a clue what each change does ![:lol:](https://champman0102.net/images/smilies/icon_lol.gif)

One last question - does anyone have the patch file for the "unlock your potential" change? Think it was originallly a Tapani patch that gives your manager a potential ability of 200. Cannot for the life of me find the changes anywhere on the forums.

Thanks guys ![:)](https://champman0102.net/images/smilies/icon_e_smile.gif)

[John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338)Patch Team**Posts:** 326**Joined:** Wed Nov 25, 2020 12:26 am**Has thanked:** [175 times](https://champman0102.net/app.php/thankslist/givens/338/true)**Been thanked:** [169 times](https://champman0102.net/app.php/thankslist/givens/338/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=21549\#p21549)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=21549 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=21549 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=21549#p21549 "Post") by **[John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338)** » Fri Mar 19, 2021 12:49 am

0x74 is the ASM instruction JE, which is Jump if Equal

0x7d is the ASM instruction JGE, which is Jump if Greater than or Equal to

0x7e is the ASM instruction JLE, which is Jump if Less than or Equal to

0xeb is the ASM instruction JMP, which JUMP

So that code is basically just forcing the jumps to occur regardless of the criteria specified by the game.

The following two change do the same thing, just in a different way. The first is part of a CMP (compare) instruction - it changes a value from 59 to 255, making the comparison always true (I assume, I don't know what it being compared). The 2nd version just forces the JMP to occur ignoring the CMP instruction.

0x29d664 0x3b 0xff

0x29d665 0x7e 0xeb

No idea if you need all 5.

[![User avatar](https://champman0102.net/download/file.php?avatar=384_1614080104.jpg)](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)

[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)Patch Team**Posts:** 2541**Joined:** Wed Nov 25, 2020 5:01 am**Has thanked:** [240 times](https://champman0102.net/app.php/thankslist/givens/384/true)**Been thanked:** [862 times](https://champman0102.net/app.php/thankslist/givens/384/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=21552\#p21552)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=21552 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=21552 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=21552#p21552 "Post") by **[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)** » Fri Mar 19, 2021 5:56 am

> [JonBetts](https://champman0102.net/memberlist.php?mode=viewprofile&u=211) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=21543#p21543) Thu Mar 18, 2021 11:30 pm
> On top of that, within the CM0102 Loader code, I've noticed it is back to 5 changes, but it is a combination of the above sets of changes ![:D](https://champman0102.net/images/smilies/icon_e_biggrin.gif)
>
> Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=75#)
>
> ```
> 0x29ea36 0x74 0xeb
> 0x29d315 0x7e 0xeb
> 0x29d665 0x7e 0xeb
> 0x29d6e4 0x7d 0xeb
> 0x29ea7e 0x74 0xeb
> ```
>
> Can anyone please confirm which is the correct combination? I'm looking to add the patch to my tool, and I want to make sure I get it right. I'm also a proper noob when it comes to the patching side of things, so right now don't have a clue what each change does ![:lol:](https://champman0102.net/images/smilies/icon_lol.gif)

Hi,

Best combination of Saturn and JohnLocke patch is below one for jobs abroad boost , I think

Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=75#)

```
0x29ea36 0x74 0xeb
0x29d315 0x7e 0xeb
0x29d665 0x7e 0xeb
0x29d6e4 0x7d 0xeb
0x29ea7e 0x74 0xeb
```

It makes below:

0069EA36 JE 0069EA71 -> JMP 0069EA71 Ignores language difference between manager and club nation

0069D315 JLE 0069D33E --> JMP 0069D33E Ignores Current ability and club reputation

0069D665 JLE 0069D6A8 --> JMP 0069D6A8 Ignores Age upper limit \[59\]

0069D6E4 JGE 0069D751 --> JMP 0069D751 Ignores Age lower limit \[45\]

0069EA7E JE 0069EABF --> JMP 0069EABF Ignores Manager's nation's developed state

Beside this, you can combine also below patches for better as a package , I suggest:

\*\*\*Solution about the bug that clubs in background never hires manager, now they can

Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=75#)

```
0x1448aa 0x2 0x0
0x1448ab 0x74 0x75
```

\*\*\*Allows human managers to apply for jobs at clubs in inactive leagues. If you only apply this patch, the Apply button will always display.

Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=75#)

```
0x82ca9 0x75 0x90
0x82caa 0x59 0x90
0x82cb6 0x74 0x90
0x82cb7 0x4c 0x90
```

\\*\\*\\* The Apply button will now only appear for teams that don't have a manager.

Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=75#)

```
0x6a357 0xe8 0x90
0x6a358 0xe4 0x90
0x6a359 0x86 0x90
0x6a35a 0x1 0x90
0x6a35b 0x0 0x90
0x82c9e 0x57 0x8b
0x82c9f 0xe8 0x74
0x82ca0 0xec 0x24
0x82ca1 0x9d 0x1c
0x82ca2 0xb 0x36
0x82ca3 0x0 0x8b
0x82ca4 0x83 0x86
0x82ca5 0xc4 0xcf
0x82ca6 0x4 0x0
0x82ca7 0x85 0x0
0x82ca8 0xc0 0x0
0x82ca9 0x90 0x85
0x82caa 0x90 0xc0
0x82cab 0x57 0x75
0x82cac 0xe8 0x57
0x82cad 0x6f 0xeb
0x82cae 0x1b 0x9
0x82caf 0xc 0x90
0x82cb0 0x0 0x90
0x82cb6 0x90 0x74
0x82cb7 0x90 0x4c
```

\*\*\*Manage any team ( to show apply button for National , U21, reserve, non-league teams)

Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=75#)

```
0x82a74 0xf 0x90
0x82a75 0x84 0x90
0x82a76 0x8a 0x90
0x82a77 0x2 0x90
0x82a78 0x0 0x90
0x82a79 0x0 0x90
```

\*\*\*Continental auto load , will load all continental club competitions whatever your selected leagues are (except European ones - still only load with a European league)

Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=75#)

```
0x43172f 0xf 0x90
0x431730 0x84 0x90
0x431731 0x6f 0x90
0x431732 0x1 0x90
0x431733 0x0 0x90
0x431734 0x0 0x90
0x4319c4 0xf 0x90
0x4319c5 0x84 0x90
0x4319c6 0x81 0x90
0x4319c7 0x1 0x90
0x4319c8 0x0 0x90
0x4319c9 0x0 0x90
0x431c75 0xf 0x90
0x431c76 0x84 0x90
0x431c77 0xe0 0x90
0x431c78 0x1 0x90
0x431c79 0x0 0x90
0x431c7a 0x0 0x90
0x431f84 0xf 0x90
0x431f85 0x84 0x90
0x431f86 0x20 0x90
0x431f87 0x1 0x90
0x431f88 0x0 0x90
0x431f89 0x0 0x90
```

**\\* \[TUTORIAL\] How to install and run the game CM0102?> [viewtopic.php?f=85&t=3571](https://champman0102.net/viewtopic.php?f=85&t=3571)** **Please use search bar for solution before posting your issue**

**Deleted User 211**

### [Offsets](https://champman0102.net/viewtopic.php?p=21603\#p21603)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=21603 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=21603 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=21603#p21603 "Post") by **Deleted User 211** » Fri Mar 19, 2021 12:29 pm

Thanks both for your responses. Will look into these this evening. And thank you Xeno for some of the other patches - I've got a couple of these already, but some of them look very useful like the continental competitions being loaded!

Do either of you know the hex changes for the "unlock your potential" patch which sets your manager's potential to 200 (not sure if it does anything else or not)?

Cheers

[Nick+Co](https://champman0102.net/memberlist.php?mode=viewprofile&u=70)Patch Team**Posts:** 1022**Joined:** Tue Apr 14, 2020 3:11 pm**Has thanked:** [91 times](https://champman0102.net/app.php/thankslist/givens/70/true)**Been thanked:** [1310 times](https://champman0102.net/app.php/thankslist/givens/70/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=21606\#p21606)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=21606 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=21606 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=21606#p21606 "Post") by **[Nick+Co](https://champman0102.net/memberlist.php?mode=viewprofile&u=70)** » Fri Mar 19, 2021 12:38 pm

@JonBetts: For that code, which is in my patcher as "Enable your potential to grow", your best bet (for that and others) is to use my patcher just to do that one patch on a exe and then do a comparison of the two.

i.e.

1) Have a clean 3.9.68 cm0102.exe

2) Make a copy to back it up as original.exe

3) Use my patcher to patch to just patch that one thing

4) Bring up the command prompt, go to that directory with the exe's in and type:

fc /b original.exe cm0102.exe > patch.txt

patch.txt will be created and be a patch file you can use.

It's really two patches, the "Tapani Space Patch" and then his patch to make it work.

**Deleted User 211**

### [Offsets](https://champman0102.net/viewtopic.php?p=21612\#p21612)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=21612 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=21612 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=21612#p21612 "Post") by **Deleted User 211** » Fri Mar 19, 2021 1:05 pm

> [Nick+Co](https://champman0102.net/memberlist.php?mode=viewprofile&u=70) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=21606#p21606) Fri Mar 19, 2021 12:38 pm
> @JonBetts: For that code, which is in my patcher as "Enable your potential to grow", your best bet (for that and others) is to use my patcher just to do that one patch on a exe and then do a comparison of the two.
>
> i.e.
>
> 1) Have a clean 3.9.68 cm0102.exe
>
> 2) Make a copy to back it up as original.exe
>
> 3) Use my patcher to patch to just patch that one thing
>
> 4) Bring up the command prompt, go to that directory with the exe's in and type:
>
> fc /b original.exe cm0102.exe > patch.txt
>
> patch.txt will be created and be a patch file you can use.
>
> It's really two patches, the "Tapani Space Patch" and then his patch to make it work.

Thanks mate, that's a big help ![:)](https://champman0102.net/images/smilies/icon_e_smile.gif)

**Deleted User 211**

### [Offsets](https://champman0102.net/viewtopic.php?p=21662\#p21662)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=21662 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=21662 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=21662#p21662 "Post") by **Deleted User 211** » Fri Mar 19, 2021 10:55 pm

> [xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=21552#p21552) Fri Mar 19, 2021 5:56 am
>
> > [JonBetts](https://champman0102.net/memberlist.php?mode=viewprofile&u=211) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=21543#p21543) Thu Mar 18, 2021 11:30 pm
> > On top of that, within the CM0102 Loader code, I've noticed it is back to 5 changes, but it is a combination of the above sets of changes ![:D](https://champman0102.net/images/smilies/icon_e_biggrin.gif)
> >
> > Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=75#)
> >
> > ```
> > 0x29ea36 0x74 0xeb
> > 0x29d315 0x7e 0xeb
> > 0x29d665 0x7e 0xeb
> > 0x29d6e4 0x7d 0xeb
> > 0x29ea7e 0x74 0xeb
> > ```
> >
> > Can anyone please confirm which is the correct combination? I'm looking to add the patch to my tool, and I want to make sure I get it right. I'm also a proper noob when it comes to the patching side of things, so right now don't have a clue what each change does ![:lol:](https://champman0102.net/images/smilies/icon_lol.gif)
>
> Hi,
>
> Best combination of Saturn and JohnLocke patch is below one for jobs abroad boost , I think
>
> Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=75#)
>
> ```
> 0x29ea36 0x74 0xeb
> 0x29d315 0x7e 0xeb
> 0x29d665 0x7e 0xeb
> 0x29d6e4 0x7d 0xeb
> 0x29ea7e 0x74 0xeb
> ```
>
> It makes below:
>
> 0069EA36 JE 0069EA71 -> JMP 0069EA71 Ignores language difference between manager and club nation
>
> 0069D315 JLE 0069D33E --> JMP 0069D33E Ignores Current ability and club reputation
>
> 0069D665 JLE 0069D6A8 --> JMP 0069D6A8 Ignores Age upper limit \[59\]
>
> 0069D6E4 JGE 0069D751 --> JMP 0069D751 Ignores Age lower limit \[45\]
>
> 0069EA7E JE 0069EABF --> JMP 0069EABF Ignores Manager's nation's developed state
>
> Beside this, you can combine also below patches for better as a package , I suggest:
>
> \*\*\*Solution about the bug that clubs in background never hires manager, now they can
>
> Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=75#)
>
> ```
> 0x1448aa 0x2 0x0
> 0x1448ab 0x74 0x75
> ```
>
> \*\*\*Allows human managers to apply for jobs at clubs in inactive leagues. If you only apply this patch, the Apply button will always display.
>
> Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=75#)
>
> ```
> 0x82ca9 0x75 0x90
> 0x82caa 0x59 0x90
> 0x82cb6 0x74 0x90
> 0x82cb7 0x4c 0x90
> ```
>
> \\*\\*\\* The Apply button will now only appear for teams that don't have a manager.
>
> Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=75#)
>
> ```
> 0x6a357 0xe8 0x90
> 0x6a358 0xe4 0x90
> 0x6a359 0x86 0x90
> 0x6a35a 0x1 0x90
> 0x6a35b 0x0 0x90
> 0x82c9e 0x57 0x8b
> 0x82c9f 0xe8 0x74
> 0x82ca0 0xec 0x24
> 0x82ca1 0x9d 0x1c
> 0x82ca2 0xb 0x36
> 0x82ca3 0x0 0x8b
> 0x82ca4 0x83 0x86
> 0x82ca5 0xc4 0xcf
> 0x82ca6 0x4 0x0
> 0x82ca7 0x85 0x0
> 0x82ca8 0xc0 0x0
> 0x82ca9 0x90 0x85
> 0x82caa 0x90 0xc0
> 0x82cab 0x57 0x75
> 0x82cac 0xe8 0x57
> 0x82cad 0x6f 0xeb
> 0x82cae 0x1b 0x9
> 0x82caf 0xc 0x90
> 0x82cb0 0x0 0x90
> 0x82cb6 0x90 0x74
> 0x82cb7 0x90 0x4c
> ```
>
> \*\*\*Manage any team ( not sure , you applied this already or not )
>
> Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=75#)
>
> ```
> 0x82a74 0xf 0x90
> 0x82a75 0x84 0x90
> 0x82a76 0x8a 0x90
> 0x82a77 0x2 0x90
> 0x82a78 0x0 0x90
> 0x82a79 0x0 0x90
> ```
>
> \\*\\*\\* Continental auto load , will load all continental club cometitions whatever your selected leagues are.
>
> Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=75#)
>
> ```
> 0x43172f 0xf 0x90
> 0x431730 0x84 0x90
> 0x431731 0x6f 0x90
> 0x431732 0x1 0x90
> 0x431733 0x0 0x90
> 0x431734 0x0 0x90
> 0x4319c4 0xf 0x90
> 0x4319c5 0x84 0x90
> 0x4319c6 0x81 0x90
> 0x4319c7 0x1 0x90
> 0x4319c8 0x0 0x90
> 0x4319c9 0x0 0x90
> 0x431c75 0xf 0x90
> 0x431c76 0x84 0x90
> 0x431c77 0xe0 0x90
> 0x431c78 0x1 0x90
> 0x431c79 0x0 0x90
> 0x431c7a 0x0 0x90
> 0x431f84 0xf 0x90
> 0x431f85 0x84 0x90
> 0x431f86 0x20 0x90
> 0x431f87 0x1 0x90
> 0x431f88 0x0 0x90
> 0x431f89 0x0 0x90
> ```

Just an FYI, the "Continental auto load" patch you listed seems to cause CM to crash when I try starting a new game with it active, even with no other patches loaded. I can see it is an option on Nick's Patcher, so I'll have a look at the changes it makes in there.

[Post Reply](https://champman0102.net/posting.php?mode=reply&t=1540 "Post a reply")

- [Print view](https://champman0102.net/viewtopic.php?t=1540&start=75&view=print "Print view")

Display: All posts1 day7 days2 weeks1 month3 months6 months1 yearSort by: AuthorPost timeSubjectDirection: AscendingDescending

* * *

764 posts


- [Page **4** of **31**](https://champman0102.net/viewtopic.php?t=1540&start=75# "Click to jump to page…")










  - Jump to page:

- [Previous](https://champman0102.net/viewtopic.php?t=1540&start=50)
- [1](https://champman0102.net/viewtopic.php?t=1540)
- [2](https://champman0102.net/viewtopic.php?t=1540&start=25)
- [3](https://champman0102.net/viewtopic.php?t=1540&start=50)
- 4
- [5](https://champman0102.net/viewtopic.php?t=1540&start=100)
- [6](https://champman0102.net/viewtopic.php?t=1540&start=125)
- …
- [31](https://champman0102.net/viewtopic.php?t=1540&start=750)
- [Next](https://champman0102.net/viewtopic.php?t=1540&start=100)

[Return to “Patches”](https://champman0102.net/viewforum.php?f=35)

Jump to

- [The Website](https://champman0102.net/viewforum.php?f=71)
- [↳   Announcements](https://champman0102.net/viewforum.php?f=2)
- [↳   New Signings](https://champman0102.net/viewforum.php?f=7)
- [↳   Awards](https://champman0102.net/viewforum.php?f=5)
- [↳   Hall of Fame](https://champman0102.net/viewforum.php?f=88)
- [↳   Awards](https://champman0102.net/viewforum.php?f=90)
- [↳   Members](https://champman0102.net/viewforum.php?f=91)
- [↳   Stories](https://champman0102.net/viewforum.php?f=8)
- [Downloads](https://champman0102.net/viewforum.php?f=54)
- [↳   Downloads](https://champman0102.net/viewforum.php?f=57)
- [↳   Background Packs](https://champman0102.net/viewforum.php?f=79)
- [↳   Colour Schemes](https://champman0102.net/viewforum.php?f=78)
- [↳   Commentary Files](https://champman0102.net/viewforum.php?f=82)
- [↳   Databases](https://champman0102.net/viewforum.php?f=73)
- [↳   Documentation](https://champman0102.net/viewforum.php?f=80)
- [↳   Fonts](https://champman0102.net/viewforum.php?f=74)
- [↳   Game](https://champman0102.net/viewforum.php?f=76)
- [↳   Menubars](https://champman0102.net/viewforum.php?f=75)
- [↳   Patches](https://champman0102.net/viewforum.php?f=72)
- [↳   Tactics](https://champman0102.net/viewforum.php?f=81)
- [↳   Tactic Packs](https://champman0102.net/viewforum.php?f=84)
- [↳   Tools](https://champman0102.net/viewforum.php?f=77)
- [Technical Support, Tutorials & FAQs](https://champman0102.net/viewforum.php?f=13)
- [↳   Technical Support, Tutorials & FAQs](https://champman0102.net/viewforum.php?f=43)
- [↳   Tutorials](https://champman0102.net/viewforum.php?f=85)
- [The Office](https://champman0102.net/viewforum.php?f=3)
- [↳   Scouting and Research](https://champman0102.net/viewforum.php?f=34)
- [↳   Africa](https://champman0102.net/viewforum.php?f=37)
- [↳   Asia](https://champman0102.net/viewforum.php?f=38)
- [↳   Europe](https://champman0102.net/viewforum.php?f=52)
- [↳   North, Central America & Caribbean](https://champman0102.net/viewforum.php?f=53)
- [↳   Oceania](https://champman0102.net/viewforum.php?f=39)
- [↳   South America](https://champman0102.net/viewforum.php?f=40)
- [↳   Free Players and Staff](https://champman0102.net/viewforum.php?f=42)
- [↳   Histories](https://champman0102.net/viewforum.php?f=48)
- [↳   Research](https://champman0102.net/viewforum.php?f=41)
- [Championship Managers Club](https://champman0102.net/viewforum.php?f=11)
- [↳   Data Updates](https://champman0102.net/viewforum.php?f=33)
- [↳   General](https://champman0102.net/viewforum.php?f=26)
- [↳   Graphics](https://champman0102.net/viewforum.php?f=36)
- [↳   Network Games](https://champman0102.net/viewforum.php?f=27)
- [↳   Official Challenges](https://champman0102.net/viewforum.php?f=28)
- [↳   Patches](https://champman0102.net/viewforum.php?f=35)
- [↳   Stories](https://champman0102.net/viewforum.php?f=29)
- [↳   Tactics](https://champman0102.net/viewforum.php?f=30)
- [↳   Talents, Tips and Training](https://champman0102.net/viewforum.php?f=31)
- [↳   Other Championship Managers](https://champman0102.net/viewforum.php?f=32)
- [CM 01/02 Interactive](https://champman0102.net/viewforum.php?f=10)
- [↳   Championship Managers League](https://champman0102.net/viewforum.php?f=20)
- [↳   CM Forums United](https://champman0102.net/viewforum.php?f=21)
- [↳   Dream Team League](https://champman0102.net/viewforum.php?f=22)
- [↳   Trillionaires Toys](https://champman0102.net/viewforum.php?f=25)
- [The Community](https://champman0102.net/viewforum.php?f=9)
- [↳   Football](https://champman0102.net/viewforum.php?f=14)
- [↳   Gaming](https://champman0102.net/viewforum.php?f=15)
- [↳   General Chat](https://champman0102.net/viewforum.php?f=16)
- [↳   Other Sports](https://champman0102.net/viewforum.php?f=17)
- [↳   Soccer Manager](https://champman0102.net/viewforum.php?f=86)
- [↳   TV & Films](https://champman0102.net/viewforum.php?f=19)
- [Archives](https://champman0102.net/viewforum.php?f=87)
- [↳   Archives](https://champman0102.net/viewforum.php?f=83)

Powered by [phpBB](https://www.phpbb.com/) ® Forum Software © phpBB Limited

[Privacy](https://champman0102.net/ucp.php?mode=privacy "Privacy")
\|
[Terms](https://champman0102.net/ucp.php?mode=terms "Terms")

---

## Page 5 (posts 101-125)

[Forums](https://champman0102.net/index.php "Forums")

# Championship Manager 2001/2002 Forums

Keeping the Game Alive

[Skip to content](https://champman0102.net/viewtopic.php?t=1540&start=100#start_here)

## [Offsets](https://champman0102.net/viewtopic.php?t=1540&start=100)

**Moderator:** [Patch Team](https://champman0102.net/memberlist.php?mode=group&g=21)

[Post Reply](https://champman0102.net/posting.php?mode=reply&t=1540 "Post a reply")

- [Print view](https://champman0102.net/viewtopic.php?t=1540&start=100&view=print "Print view")

764 posts


- [Page **5** of **31**](https://champman0102.net/viewtopic.php?t=1540&start=100# "Click to jump to page…")










  - Jump to page:

- [Previous](https://champman0102.net/viewtopic.php?t=1540&start=75)
- [1](https://champman0102.net/viewtopic.php?t=1540)
- …
- [3](https://champman0102.net/viewtopic.php?t=1540&start=50)
- [4](https://champman0102.net/viewtopic.php?t=1540&start=75)
- 5
- [6](https://champman0102.net/viewtopic.php?t=1540&start=125)
- [7](https://champman0102.net/viewtopic.php?t=1540&start=150)
- …
- [31](https://champman0102.net/viewtopic.php?t=1540&start=750)
- [Next](https://champman0102.net/viewtopic.php?t=1540&start=125)

[![User avatar](https://champman0102.net/download/file.php?avatar=384_1614080104.jpg)](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)

[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)Patch Team**Posts:** 2541**Joined:** Wed Nov 25, 2020 5:01 am**Has thanked:** [240 times](https://champman0102.net/app.php/thankslist/givens/384/true)**Been thanked:** [862 times](https://champman0102.net/app.php/thankslist/givens/384/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=21674\#p21674)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=21674 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=21674 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=21674#p21674 "Post") by **[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)** » Sat Mar 20, 2021 7:05 am

> [JonBetts](https://champman0102.net/memberlist.php?mode=viewprofile&u=211) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=21662#p21662) Fri Mar 19, 2021 10:55 pm
> Just an FYI, the "Continental auto load" patch you listed seems to cause CM to crash when I try starting a new game with it active, even with no other patches loaded. I can see it is an option on Nick's Patcher, so I'll have a look at the changes it makes in there.

I do the same patching , no crash with clean 3.9.68 . Did your game crash on the beginning or later? But there is one issue I see that , with continental auto load patch below, you need to select at least a European league.

\\*\\*\\* Continental auto load , will load all continental club competitions whatever your selected leagues are (except European ones - still only load with a European league)

Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=100#)

```
0x43172f 0xf 0x90
0x431730 0x84 0x90
0x431731 0x6f 0x90
0x431732 0x1 0x90
0x431733 0x0 0x90
0x431734 0x0 0x90
0x4319c4 0xf 0x90
0x4319c5 0x84 0x90
0x4319c6 0x81 0x90
0x4319c7 0x1 0x90
0x4319c8 0x0 0x90
0x4319c9 0x0 0x90
0x431c75 0xf 0x90
0x431c76 0x84 0x90
0x431c77 0xe0 0x90
0x431c78 0x1 0x90
0x431c79 0x0 0x90
0x431c7a 0x0 0x90
0x431f84 0xf 0x90
0x431f85 0x84 0x90
0x431f86 0x20 0x90
0x431f87 0x1 0x90
0x431f88 0x0 0x90
0x431f89 0x0 0x90
```

Solution is here. To load European continental competitions auto together with above patch is below:

\\*\\*\\* European continental club competitions auto load , will load all continental club competitions whatever your selected leagues are. Shall be used together with above patch so that it will work really whatever your selected leagues are ![:)](https://champman0102.net/images/smilies/icon_e_smile.gif)

Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=100#)

```
0x136a3 0x74 0x90
0x136a4 0x30 0x90
0x4313b3 0xf 0x90
0x4313b4 0x84 0x90
0x4313b5 0x47 0x90
0x4313b6 0x2 0x90
0x4313b7 0x0 0x90
0x4313b8 0x0 0x90
```

**\\* \[TUTORIAL\] How to install and run the game CM0102?> [viewtopic.php?f=85&t=3571](https://champman0102.net/viewtopic.php?f=85&t=3571)** **Please use search bar for solution before posting your issue**

**Deleted User 211**

### [Offsets](https://champman0102.net/viewtopic.php?p=21677\#p21677)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=21677 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=21677 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=21677#p21677 "Post") by **Deleted User 211** » Sat Mar 20, 2021 8:59 am

> [xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=21674#p21674) Sat Mar 20, 2021 7:05 am
>
> > [JonBetts](https://champman0102.net/memberlist.php?mode=viewprofile&u=211) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=21662#p21662) Fri Mar 19, 2021 10:55 pm
> > Just an FYI, the "Continental auto load" patch you listed seems to cause CM to crash when I try starting a new game with it active, even with no other patches loaded. I can see it is an option on Nick's Patcher, so I'll have a look at the changes it makes in there.
>
> I do the same patching , no crash with clean 3.9.68 . Did your game crash on the beginning or later? But there is one issue I see that , with continental auto load patch below, you need to select at least a European league.
>
> \\*\\*\\* Continental auto load , will load all continental club competitions whatever your selected leagues are (except European ones - still only load with a European league)
>
> Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=100#)
>
> ```
> 0x43172f 0xf 0x90
> 0x431730 0x84 0x90
> 0x431731 0x6f 0x90
> 0x431732 0x1 0x90
> 0x431733 0x0 0x90
> 0x431734 0x0 0x90
> 0x4319c4 0xf 0x90
> 0x4319c5 0x84 0x90
> 0x4319c6 0x81 0x90
> 0x4319c7 0x1 0x90
> 0x4319c8 0x0 0x90
> 0x4319c9 0x0 0x90
> 0x431c75 0xf 0x90
> 0x431c76 0x84 0x90
> 0x431c77 0xe0 0x90
> 0x431c78 0x1 0x90
> 0x431c79 0x0 0x90
> 0x431c7a 0x0 0x90
> 0x431f84 0xf 0x90
> 0x431f85 0x84 0x90
> 0x431f86 0x20 0x90
> 0x431f87 0x1 0x90
> 0x431f88 0x0 0x90
> 0x431f89 0x0 0x90
> ```
>
> Solution is here. To load European continental competitions auto together with above patch is below:
>
> \\*\\*\\* European continental club competitions auto load , will load all continental club competitions whatever your selected leagues are. Shall be used together with above patch so that it will work really whatever your selected leagues are ![:)](https://champman0102.net/images/smilies/icon_e_smile.gif)
>
> Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=100#)
>
> ```
> 0x136a3 0x74 0x90
> 0x136a4 0x30 0x90
> 0x4313b3 0xf 0x90
> 0x4313b4 0x84 0x90
> 0x4313b5 0x47 0x90
> 0x4313b6 0x2 0x90
> 0x4313b7 0x0 0x90
> 0x4313b8 0x0 0x90
> ```

Thanks very much for the information and the updated patch ![:)](https://champman0102.net/images/smilies/icon_e_smile.gif) will have a look at this today. Once I've got this patch sorted I'm going to have to do a couple of days of testing, making sure that no errors occur! ![:ugeek:](https://champman0102.net/images/smilies/icon_e_ugeek.gif)

[![User avatar](https://champman0102.net/download/file.php?avatar=384_1614080104.jpg)](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)

[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)Patch Team**Posts:** 2541**Joined:** Wed Nov 25, 2020 5:01 am**Has thanked:** [240 times](https://champman0102.net/app.php/thankslist/givens/384/true)**Been thanked:** [862 times](https://champman0102.net/app.php/thankslist/givens/384/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=21678\#p21678)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=21678 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=21678 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=21678#p21678 "Post") by **[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)** » Sat Mar 20, 2021 9:01 am

> [JonBetts](https://champman0102.net/memberlist.php?mode=viewprofile&u=211) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=21677#p21677) Sat Mar 20, 2021 8:59 am
> Thanks very much for the information and the updated patch ![:)](https://champman0102.net/images/smilies/icon_e_smile.gif) will have a look at this today. Once I've got this patch sorted I'm going to have to do a couple of days of testing, making sure that no errors occur! ![:ugeek:](https://champman0102.net/images/smilies/icon_e_ugeek.gif)

Last crash you face, with continental auto load patch, did you start without a European league?

**\\* \[TUTORIAL\] How to install and run the game CM0102?> [viewtopic.php?f=85&t=3571](https://champman0102.net/viewtopic.php?f=85&t=3571)** **Please use search bar for solution before posting your issue**

**Deleted User 211**

### [Offsets](https://champman0102.net/viewtopic.php?p=21680\#p21680)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=21680 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=21680 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=21680#p21680 "Post") by **Deleted User 211** » Sat Mar 20, 2021 9:46 am

> [xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=21678#p21678) Sat Mar 20, 2021 9:01 am
>
> > [JonBetts](https://champman0102.net/memberlist.php?mode=viewprofile&u=211) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=21677#p21677) Sat Mar 20, 2021 8:59 am
> > Thanks very much for the information and the updated patch ![:)](https://champman0102.net/images/smilies/icon_e_smile.gif) will have a look at this today. Once I've got this patch sorted I'm going to have to do a couple of days of testing, making sure that no errors occur! ![:ugeek:](https://champman0102.net/images/smilies/icon_e_ugeek.gif)
>
> Last crash you face, with continental auto load patch, did you start without a European league?

Nope, I had England, Germany, Italian and Spain loaded (as well as Australia, Brazil and the USA).

[![User avatar](https://champman0102.net/download/file.php?avatar=384_1614080104.jpg)](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)

[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)Patch Team**Posts:** 2541**Joined:** Wed Nov 25, 2020 5:01 am**Has thanked:** [240 times](https://champman0102.net/app.php/thankslist/givens/384/true)**Been thanked:** [862 times](https://champman0102.net/app.php/thankslist/givens/384/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=21682\#p21682)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=21682 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=21682 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=21682#p21682 "Post") by **[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)** » Sat Mar 20, 2021 9:55 am

> [JonBetts](https://champman0102.net/memberlist.php?mode=viewprofile&u=211) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=21680#p21680) Sat Mar 20, 2021 9:46 am
>
> > [xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=21678#p21678) Sat Mar 20, 2021 9:01 am
> >
> > > [JonBetts](https://champman0102.net/memberlist.php?mode=viewprofile&u=211) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=21677#p21677) Sat Mar 20, 2021 8:59 am
> > > Thanks very much for the information and the updated patch ![:)](https://champman0102.net/images/smilies/icon_e_smile.gif) will have a look at this today. Once I've got this patch sorted I'm going to have to do a couple of days of testing, making sure that no errors occur! ![:ugeek:](https://champman0102.net/images/smilies/icon_e_ugeek.gif)
> >
> > Last crash you face, with continental auto load patch, did you start without a European league?
>
> Nope, I had England, Germany, Italian and Spain loaded (as well as Australia, Brazil and the USA).

Are you using patched exe ? Tapani or saturn? Concacaf competitions are off or not in your exe? Let me check crash reason

**\\* \[TUTORIAL\] How to install and run the game CM0102?> [viewtopic.php?f=85&t=3571](https://champman0102.net/viewtopic.php?f=85&t=3571)** **Please use search bar for solution before posting your issue**

**Deleted User 211**

### [Offsets](https://champman0102.net/viewtopic.php?p=21689\#p21689)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=21689 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=21689 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=21689#p21689 "Post") by **Deleted User 211** » Sat Mar 20, 2021 11:46 am

> [xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=21682#p21682) Sat Mar 20, 2021 9:55 am
>
> > [JonBetts](https://champman0102.net/memberlist.php?mode=viewprofile&u=211) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=21680#p21680) Sat Mar 20, 2021 9:46 am
> >
> > > [xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=21678#p21678) Sat Mar 20, 2021 9:01 am
> > >
> > > Last crash you face, with continental auto load patch, did you start without a European league?
> >
> > Nope, I had England, Germany, Italian and Spain loaded (as well as Australia, Brazil and the USA).
>
> Are you using patched exe ? Tapani or saturn? Concacaf competitions are off or not in your exe? Let me check crash reason

Nope it was a fresh exe. I'll have a look later and see why it didn't work. I've already asked you enough questions ![:D](https://champman0102.net/images/smilies/icon_e_biggrin.gif)

[John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338)Patch Team**Posts:** 326**Joined:** Wed Nov 25, 2020 12:26 am**Has thanked:** [175 times](https://champman0102.net/app.php/thankslist/givens/338/true)**Been thanked:** [169 times](https://champman0102.net/app.php/thankslist/givens/338/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=22126\#p22126)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=22126 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=22126 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=22126#p22126 "Post") by **[John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338)** » Wed Mar 24, 2021 12:59 pm

\[AE2C92\] is current year (I think).

[![User avatar](https://champman0102.net/download/file.php?avatar=384_1614080104.jpg)](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)

[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)Patch Team**Posts:** 2541**Joined:** Wed Nov 25, 2020 5:01 am**Has thanked:** [240 times](https://champman0102.net/app.php/thankslist/givens/384/true)**Been thanked:** [862 times](https://champman0102.net/app.php/thankslist/givens/384/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=22432\#p22432)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=22432 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=22432 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=22432#p22432 "Post") by **[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)** » Fri Mar 26, 2021 7:28 pm

In Nick's patcher , renaming and transfer windows are merged in one.

So, who wants only transfer window update:

\*\*\*if you are using 3.9.68 version , you can install patches from Nick's patcher under tools/ apply misc patches.

Need to apply 1 by 1 and with below order:

APPLYMISCPATCH: "Saturn v1/Transfer Windows.patch"

APPLYMISCPATCH: "Saturn v3/Transfer windows edit.patch"

APPLYMISCPATCH: "Saturn v8/Danish transfer window.patch"

APPLYMISCPATCH: "Saturn v8/Swedish transfer window.patch"

APPLYMISCPATCH: "Misc Patches/FixSaturnFrenchJokerWindowPatch.patch"

\*\*\*If you are using Tapani 2.21 or 2.22 version, before these patches you need to apply below Transfer window reversal patch first, then apply above patches again 1 by 1 and in order.

Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=100#)

```
0x12d54 0x38 0x37
0x12d89 0xc6 0x88
0x12d8a 0x46 0x4e
0x12d8c 0x4 0x8b
0x12d8d 0x8b 0x8c
0x12d8e 0x8c 0x24
0x12d8f 0x24 0xc
0x12d90 0xc 0x2
0x12d91 0x2 0x0
0x12d93 0x0 0x8b
0x12d94 0x8b 0xc6
0x12d95 0xc6 0x5e
0x12d96 0x5e 0x5b
0x12d97 0x5b 0x64
0x12d98 0x64 0x89
0x12d99 0x89 0xd
0x12d9a 0xd 0x0
0x12d9e 0x0 0x81
0x12d9f 0x81 0xc4
0x12da0 0xc4 0x10
0x12da1 0x10 0x2
0x12da2 0x2 0x0
0x12da4 0x0 0xc2
0x12da5 0xc2 0x14
0x12da6 0x14 0x0
0x12da7 0x0 0x90
0x3f1b2 0x32 0x3
0x3f1e8 0xeb 0x88
0x3f1e9 0xc5 0x56
0x3f1ea 0x90 0x13
0x179b85 0x18 0xc
0x179b96 0x2 0x1
0x179c01 0x6a 0xb1
0x179c02 0x7 0x2
0x179c03 0x59 0xc6
0x179c04 0x89 0x0
0x179c05 0x8 0x7
0x179c06 0xc7 0x88
0x179c07 0x40 0x58
0x179c08 0x2 0x1
0x179c09 0xff 0xc6
0x179c0a 0x1 0x40
0x179c0b 0x6 0x2
0x179c0d 0x89 0x88
0x179c0f 0x6 0x3
0x179c10 0xc7 0xc6
0x179c12 0x8 0x4
0x179c13 0xff 0x5
0x179c14 0x1 0xc6
0x179c15 0x8 0x40
0x179c16 0x0 0x5
0x179c17 0xb5 0x1
0x179c18 0x1 0x8b
0x179c19 0x89 0x46
0x179c1a 0x48 0x4
0x179c1b 0xc 0x83
0x179c1c 0xc7 0xc0
0x179c1d 0x40 0x6
0x179c1e 0xe 0xc6
0x179c1f 0xff 0x0
0x179c20 0x1 0x7
0x179c21 0x0 0x88
0x179c22 0x1 0x58
0x179c23 0x89 0x1
0x179c24 0x48 0xc6
0x179c25 0x12 0x40
0x179c26 0xc7 0x2
0x179c27 0x40 0x4
0x179c28 0x14 0xc6
0x179c29 0xff 0x40
0x179c2a 0x1 0x3
0x179c2b 0x1 0x1a
0x179c2c 0x0 0x88
0x179c2d 0x90 0x48
0x179c2e 0x90 0x4
0x179c2f 0x90 0x88
0x179c30 0x90 0x58
0x179c31 0x90 0x5
0x1c1670 0xff 0x6
0x1c1674 0xd 0x1e
0x1c1675 0x66 0x88
0x1c1676 0xc7 0x50
0x1c1677 0x40 0x4
0x1c1678 0x4 0x88
0x1c1679 0x5 0x48
0x1c167a 0x1 0x5
0x1c168b 0xff 0x3
0x1c168f 0x1 0x1f
0x1c1693 0x8 0x7
0x1c16a3 0x66 0x88
0x1c16a4 0xc7 0x50
0x1c16a5 0x40 0x2
0x1c16a6 0x2 0x88
0x1c16a7 0xff 0x48
0x1c16a8 0x1 0x3
0x1c16bd 0x66 0x88
0x1c16be 0xc7 0x50
0x1c16bf 0x40 0x2
0x1c16c0 0x2 0xc6
0x1c16c1 0xff 0x40
0x1c16c2 0x1f 0x3
0x1c16c3 0x90 0x14
0x1c16db 0xff 0x5
0x1c16df 0x1 0x15
0x1c16e3 0x0 0xb
0x1c16f7 0xc7 0xc6
0x1c16fb 0xff 0x88
0x1c16fc 0x1 0x50
0x1c16fd 0x1 0x2
0x1c16fe 0x90 0xc6
0x1c16ff 0x90 0x40
0x1c1700 0x90 0x3
0x1c1701 0x90 0xa
0x1ecfac 0x50 0x58
0x1ecfb1 0x1 0x16
0x1ecfb5 0x6 0x4
0x1ecfcb 0xff 0x6
0x1ecfcf 0x1 0x1d
0x1ecfd3 0x8 0x7
0x1ecff8 0x48 0x58
0x1ed009 0x1 0x14
0x26149b 0xff 0x4
0x26149f 0x1 0x1b
0x2614a3 0x8 0x9
0x2614b9 0x1 0x2
0x2614d3 0x1 0x1f
0x2614d5 0x48 0x58
0x26150c 0x1f 0x1e
0x261510 0x2 0x3
0x266c40 0x53 0x81
0x266c41 0x51 0xec
0x266c42 0xc6 0x0
0x266c43 0x41 0x2
0x266c44 0x8 0x0
0x266c45 0x2 0x0
0x266c46 0x6a 0x53
0x266c47 0x18 0x56
0x266c48 0xe8 0x8b
0x266c49 0xf9 0xf1
0x266c4a 0xe1 0x6a
0x266c4b 0x2d 0x18
0x266c4c 0x0 0xc6
0x266c4d 0x5b 0x46
0x266c4e 0x59 0x8
0x266c4f 0x51 0x2
0x266c50 0x85 0xe8
0x266c51 0xc0 0xf1
0x266c52 0x8a 0xe1
0x266c53 0x5c 0x2d
0x266c54 0x24 0x0
0x266c55 0x24 0x33
0x266c56 0x89 0xdb
0x266c57 0x41 0x83
0x266c58 0x4 0xc4
0x266c59 0x75 0x4
0x266c5a 0x68 0x3b
0x266c5b 0x81 0xc3
0x266c5c 0xec 0x89
0x266c5d 0x0 0x46
0x266c5e 0x2 0x4
0x266c5f 0x0 0x75
0x266c60 0x0 0x62
0x266cba 0x81 0x5e
0x266cbb 0xc4 0x5b
0x266cbc 0x0 0x81
0x266cbd 0x2 0xc4
0x266cbf 0x0 0x2
0x266cc0 0x59 0x0
0x266cc1 0x5b 0x0
0x266cc5 0x88 0xc6
0x266cc6 0x18 0x0
0x266cc7 0x90 0xf
0x266cc9 0x78 0x58
0x266cce 0xff 0x6
0x266cd2 0x3 0xc
0x266cd6 0x0 0xb
0x266ce2 0x88 0xc6
0x266ce3 0x18 0x0
0x266ce4 0x90 0xf
0x266ce6 0x78 0x58
0x266cec 0x66 0x88
0x266ced 0xc7 0x50
0x266cee 0x40 0x3
0x266cef 0x3 0x88
0x266cf0 0x1b 0x50
0x266cf1 0x2 0x4
0x266cf3 0x78 0x58
0x266cf8 0x88 0xc6
0x266cf9 0x58 0x40
0x266cfb 0x90 0xf
0x266d05 0xff 0x6
0x266d06 0x66 0xc6
0x266d07 0xc7 0x40
0x266d08 0x40 0x3
0x266d09 0x3 0x1e
0x266d0a 0x6 0x88
0x266d0b 0x6 0x50
0x266d0c 0x90 0x4
0x266d16 0x90 0x5e
0x266d18 0x78 0x58
0x266d1a 0x88 0xc6
0x266d1b 0x18 0x0
0x266d1c 0x90 0xf
0x266d27 0x5 0x1d
0x266d2b 0x7 0x9
0x266d2c 0x59 0x5b
0x266d2d 0x5b 0x81
0x266d2e 0xc3 0xc4
0x266d2f 0x90 0x0
0x266d30 0x90 0x2
0x266d31 0x90 0x0
0x266d32 0x90 0x0
0x266d33 0x90 0xc3
0x3d3df0 0x53 0x81
0x3d3df1 0x51 0xec
0x3d3df2 0xc6 0x0
0x3d3df3 0x41 0x2
0x3d3df4 0x8 0x0
0x3d3df5 0x2 0x0
0x3d3df6 0x6a 0x53
0x3d3df7 0x18 0x56
0x3d3df8 0xe8 0x8b
0x3d3df9 0x49 0xf1
0x3d3dfa 0x10 0x6a
0x3d3dfb 0x17 0x18
0x3d3dfc 0x0 0xc6
0x3d3dfd 0x5b 0x46
0x3d3dfe 0x59 0x8
0x3d3dff 0x51 0x2
0x3d3e00 0x85 0xe8
0x3d3e01 0xc0 0x41
0x3d3e02 0x8a 0x10
0x3d3e03 0x5c 0x17
0x3d3e04 0x24 0x0
0x3d3e05 0x24 0x33
0x3d3e06 0x89 0xdb
0x3d3e07 0x41 0x83
0x3d3e08 0x4 0xc4
0x3d3e09 0x75 0x4
0x3d3e0a 0x68 0x3b
0x3d3e0b 0x81 0xc3
0x3d3e0c 0xec 0x89
0x3d3e0d 0x0 0x46
0x3d3e0e 0x2 0x4
0x3d3e0f 0x0 0x75
0x3d3e10 0x0 0x62
0x3d3e6a 0x81 0x5e
0x3d3e6b 0xc4 0x5b
0x3d3e6c 0x0 0x81
0x3d3e6d 0x2 0xc4
0x3d3e6f 0x0 0x2
0x3d3e70 0x59 0x0
0x3d3e71 0x5b 0x0
0x3d3e73 0xb1 0x80
0x3d3e74 0x1 0xca
0x3d3e75 0x88 0xff
0x3d3e76 0x18 0xb1
0x3d3e77 0x88 0x1
0x3d3e78 0x78 0xc6
0x3d3e79 0x1 0x0
0x3d3e7a 0xc7 0x13
0x3d3e7b 0x40 0x88
0x3d3e7c 0x2 0x58
0x3d3e7d 0xff 0x1
0x3d3e7e 0x1 0x88
0x3d3e7f 0x6 0x50
0x3d3e80 0x1 0x2
0x3d3e81 0x8b 0x88
0x3d3e82 0x46 0x48
0x3d3e83 0x4 0x3
0x3d3e84 0x83 0xc6
0x3d3e85 0xc0 0x40
0x3d3e86 0x6 0x4
0x3d3e87 0x80 0x5
0x3d3e88 0xca 0x88
0x3d3e89 0xff 0x48
0x3d3e8a 0x88 0x5
0x3d3e8b 0x18 0x8b
0x3d3e8c 0x88 0x46
0x3d3e8d 0x78 0x4
0x3d3e8e 0x1 0xc6
0x3d3e8f 0x88 0x40
0x3d3e90 0x50 0x6
0x3d3e91 0x2 0x13
0x3d3e92 0xc6 0x83
0x3d3e93 0x40 0xc0
0x3d3e94 0x3 0x6
0x3d3e95 0x1 0x88
0x3d3e96 0xc6 0x58
0x3d3e97 0x40 0x1
0x3d3e98 0x4 0x88
0x3d3e99 0x8 0x50
0x3d3e9a 0x88 0x2
0x3d3e9b 0x78 0x88
0x3d3e9c 0x5 0x48
0x3d3e9d 0x8b 0x3
0x3d3e9e 0x46 0xc6
0x3d3e9f 0x4 0x40
0x3d3ea0 0x88 0x4
0x3d3ea1 0x58 0x8
0x3d3ea2 0xc 0x88
0x3d3ea3 0x83 0x58
0x3d3ea4 0xc0 0x5
0x3d3ea5 0xc 0x8b
0x3d3ea6 0x88 0x46
0x3d3ea7 0x48 0x4
0x3d3ea8 0x1 0x83
0x3d3ea9 0xc7 0xc0
0x3d3eaa 0x40 0xc
0x3d3eab 0x2 0xc6
0x3d3eac 0xff 0x0
0x3d3ead 0x1 0x13
0x3d3eae 0x0 0x88
0x3d3eaf 0x1 0x48
0x3d3eb0 0x8b 0x1
0x3d3eb1 0x46 0x88
0x3d3eb2 0x4 0x50
0x3d3eb3 0x83 0x2
0x3d3eb4 0xc0 0xc6
0x3d3eb5 0x12 0x40
0x3d3eb6 0x88 0x3
0x3d3eb7 0x78 0xf
0x3d3eb8 0x5 0xc6
0x3d3eb9 0x88 0x40
0x3d3eba 0x18 0x4
0x3d3ebb 0xc7 0xb
0x3d3ebc 0x40 0x88
0x3d3ebd 0x1 0x48
0x3d3ebe 0x1 0x5
0x3d3ebf 0xff 0x8b
0x3d3ec0 0x1 0x46
0x3d3ec1 0x1 0x4
0x3d3ec2 0x59 0x88
0x3d3ec3 0x5b 0x58
0x3d3ec4 0xc3 0x16
0x3d3ec5 0x90 0x83
0x3d3ec6 0x90 0xc0
0x3d3ec7 0x90 0x12
0x3d3ec8 0x90 0x5e
0x3d3ec9 0x90 0x88
0x3d3eca 0x90 0x58
0x3d3ecb 0x90 0x5
0x3d3ecc 0x90 0xc6
0x3d3ecd 0x90 0x0
0x3d3ece 0x90 0x13
0x3d3ecf 0x90 0x88
0x3d3ed0 0x90 0x48
0x3d3ed1 0x90 0x1
0x3d3ed2 0x90 0x88
0x3d3ed3 0x90 0x50
0x3d3ed4 0x90 0x2
0x3d3ed5 0x90 0xc6
0x3d3ed6 0x90 0x40
0x3d3ed7 0x90 0x3
0x3d3ed8 0x90 0xf
0x3d3ed9 0x90 0x5b
0x3d3eda 0x90 0x81
0x3d3edb 0x90 0xc4
0x3d3edc 0x90 0x0
0x3d3edd 0x90 0x2
0x3d3ede 0x90 0x0
0x3d3edf 0x90 0x0
0x3d3ee0 0x90 0xc3
0x3ec872 0xa 0xf
0x3ec876 0x5 0xb
0x3ec888 0x66 0x88
0x3ec889 0xc7 0x50
0x3ec88a 0x40 0x2
0x3ec88b 0x2 0xc6
0x3ec88c 0xff 0x40
0x3ec88d 0x1 0x3
0x3ec88e 0x90 0x18
0x3ec892 0x8 0x2
0x3ec8a6 0xff 0x2
0x3ec8ae 0x0 0x5
0x3ec8c6 0x66 0x88
0x3ec8c7 0xc7 0x50
0x3ec8c8 0x40 0x3
0x3ec8c9 0x3 0xc6
0x3ec8ca 0x1b 0x40
0x3ec8cb 0x1 0x4
0x3ec8cc 0xc6 0x7
0x3ec8cd 0x46 0x5b
0x3ec8ce 0x13 0x81
0x3ec8cf 0xa 0xc4
0x3ec8d0 0x5b 0x0
0x3ec8d1 0x81 0x2
0x3ec8d2 0xc4 0x0
0x3ec8d4 0x2 0xc3
0x3ec8d5 0x0 0x90
0x3ec8d6 0x0 0x90
0x3ec8d7 0xc3 0x90
0x4594fe 0xff 0x3
0x459502 0x1 0x11
0x459506 0x6 0x5
0x45951c 0xff 0x4
0x459520 0x1 0x14
0x459524 0x8 0x7
0x45953b 0x1 0xf
0x45953f 0x0 0xb
0x45954b 0x48 0x58
0x45955c 0x1 0x1f
0x4d27ca 0xb2 0xc2
0x4d27cb 0x15 0x23
0x4d27cc 0xf0 0xb5
0x4d2893 0xe9 0xc9
0x4d2894 0x14 0x2b
0x4d2895 0xf0 0xc8
0x4d299f 0xdd 0xcd
0x4d29a0 0x13 0xd5
0x4d29a1 0xf0 0xd0
0x4d2a25 0x57 0x67
0x4d2a26 0x13 0x6c
0x4d2a27 0xf0 0xd2
0x4d2b74 0x8 0x58
0x4d2b75 0x12 0xb
0x4d2b76 0xf0 0xec
0x4d2bb7 0xc5 0x75
0x4d2bb8 0x11 0xac
0x4d2bb9 0xf0 0xef
0x4d2c80 0xfc 0xc
0x4d2c81 0x10 0x37
0x4d2c82 0xf0 0xf2
0x4d2dd0 0xf 0xc2
0x4d2dd1 0xf0 0x3
0x4d2dd2 0xff 0x0
0x4d2e12 0xba 0x1a
0x4d2e13 0x3d 0xb8
0x5ccf56 0x4a 0x44
0x5ccf57 0x61 0x65
0x5ccf58 0x6e 0x63
0x5ccf59 0x75 0x65
0x5ccf5a 0x61 0x6d
0x5ccf5b 0x72 0x62
0x5ccf5c 0x79 0x65
0x5ccf5d 0x2e 0x72
0x5ccf5e 0x0 0x2e
```

**\\* \[TUTORIAL\] How to install and run the game CM0102?> [viewtopic.php?f=85&t=3571](https://champman0102.net/viewtopic.php?f=85&t=3571)** **Please use search bar for solution before posting your issue**

[![User avatar](https://champman0102.net/download/file.php?avatar=384_1614080104.jpg)](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)

[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)Patch Team**Posts:** 2541**Joined:** Wed Nov 25, 2020 5:01 am**Has thanked:** [240 times](https://champman0102.net/app.php/thankslist/givens/384/true)**Been thanked:** [862 times](https://champman0102.net/app.php/thankslist/givens/384/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=22449\#p22449)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=22449 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=22449 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=22449#p22449 "Post") by **[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)** » Fri Mar 26, 2021 10:06 pm

About England non-EU foreign player restrictions:

00579C63 MOV BYTE PTR DS:\[EDX+5\],3-------> Current offset in 3.9.68, non-EU foreign player limit is 3 and can see if player is non-EU foreign in squad screen

00579C63 MOV BYTE PTR DS:\[EDX+1\],3-------> Current offset in Tapani 2.21/2.22/Saturn, there is no non-EU foreign player limit and can not see if player is non-EU foreign in squad screen

00579C63 MOV BYTE PTR DS:\[EDX+5\],32 -----> You can do this offset change so that there will be no non-EU foreign player limit and can see if player is non-EU foreign in squad screen

( not save game compatible, applicable to 3.9.68 and Tapani 2.21/2.22/Saturn )

Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=100#)

```
0x179c65 0x1 0x5
0x179c66 0x3 0x32
```

**\\* \[TUTORIAL\] How to install and run the game CM0102?> [viewtopic.php?f=85&t=3571](https://champman0102.net/viewtopic.php?f=85&t=3571)** **Please use search bar for solution before posting your issue**

[![User avatar](https://champman0102.net/download/file.php?avatar=384_1614080104.jpg)](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)

[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)Patch Team**Posts:** 2541**Joined:** Wed Nov 25, 2020 5:01 am**Has thanked:** [240 times](https://champman0102.net/app.php/thankslist/givens/384/true)**Been thanked:** [862 times](https://champman0102.net/app.php/thankslist/givens/384/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=22486\#p22486)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=22486 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=22486 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=22486#p22486 "Post") by **[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)** » Sat Mar 27, 2021 12:39 pm

Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=100#)

```
007DD212 PUSH 0E > PUSH 1        English suspensions will begin immediately instead of after 14 days.
007DF766 PUSH 0E > PUSH 1        Republic Of Ireland suspensions will begin immediately instead of after 14 days.
007DB019 PUSH 0E > PUSH 1        Suspensions given for players making obscene gestures will now take effect immediately instead of after 14 days.
```

This is already found in the past.

3.9.68 applicable.

But not sure already applied totally or not in Tapani/Saturn versions .

So , writing here for recording.

**\\* \[TUTORIAL\] How to install and run the game CM0102?> [viewtopic.php?f=85&t=3571](https://champman0102.net/viewtopic.php?f=85&t=3571)** **Please use search bar for solution before posting your issue**

[John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338)Patch Team**Posts:** 326**Joined:** Wed Nov 25, 2020 12:26 am**Has thanked:** [175 times](https://champman0102.net/app.php/thankslist/givens/338/true)**Been thanked:** [169 times](https://champman0102.net/app.php/thankslist/givens/338/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=22490\#p22490)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=22490 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=22490 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=22490#p22490 "Post") by **[John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338)** » Sat Mar 27, 2021 1:35 pm

> [xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=22486#p22486) Sat Mar 27, 2021 12:39 pm
> 007DD212 PUSH 0E > PUSH 1 English suspensions will begin immediately instead of after 14 days.
>
> 007DF766 PUSH 0E > PUSH 1 Republic Of Ireland suspensions will begin immediately instead of after 14 days.
>
> 007DB019 PUSH 0E > PUSH 1 Suspensions given for players making obscene gestures will now take effect immediately instead of after 14 days.
>
> This is already found in the past , but not sure applied totally or not . So , writing here for recording

For info: the PUSH instruction means the value is being passed to a new section of code, the code runs with a CALL instruction - in these cases:

007DD22F . E8 7CF3D6FF CALL 3968.0054C5B0 ; \\3968.0054C5B0

007DF789 . E8 22CED6FF CALL 3968.0054C5B0 ; \\3968.0054C5B0

007DB030 \|. E8 7B15D7FF CALL 3968.0054C5B0 ; \\3968.0054C5B0

Notice they all call the same function; so if you go to 0054C5B0, press ctrl+r you will get a big list of every time that function is called - which will let you find all the PUSH instructions for every league / competition (although it might not be easy to determine which league / competition it relates to).

Having said that, upon looking at some of the function calls they don't all seem to be related - so maybe the call is some generic code related to events that will occur in the future (not just suspensions).

A thought: if you NOP out the call instruction, maybe players won't get suspended at all?

[![User avatar](https://champman0102.net/download/file.php?avatar=384_1614080104.jpg)](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)

[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)Patch Team**Posts:** 2541**Joined:** Wed Nov 25, 2020 5:01 am**Has thanked:** [240 times](https://champman0102.net/app.php/thankslist/givens/384/true)**Been thanked:** [862 times](https://champman0102.net/app.php/thankslist/givens/384/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=22491\#p22491)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=22491 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=22491 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=22491#p22491 "Post") by **[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)** » Sat Mar 27, 2021 2:18 pm

@John Locke, actually I was looking for a solution of below issues, any idea?

\*you can not appeal suspension for Champions/Europa League

\\* you can not discipline your player for red card or any issue in Champions / Europa League. Player always unhappy about discipline even kill other side.

**\\* \[TUTORIAL\] How to install and run the game CM0102?> [viewtopic.php?f=85&t=3571](https://champman0102.net/viewtopic.php?f=85&t=3571)** **Please use search bar for solution before posting your issue**

[John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338)Patch Team**Posts:** 326**Joined:** Wed Nov 25, 2020 12:26 am**Has thanked:** [175 times](https://champman0102.net/app.php/thankslist/givens/338/true)**Been thanked:** [169 times](https://champman0102.net/app.php/thankslist/givens/338/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=22529\#p22529)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=22529 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=22529 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=22529#p22529 "Post") by **[John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338)** » Sat Mar 27, 2021 8:40 pm

No idea what that code would look like, so I wouldn't know where to start.

[John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338)Patch Team**Posts:** 326**Joined:** Wed Nov 25, 2020 12:26 am**Has thanked:** [175 times](https://champman0102.net/app.php/thankslist/givens/338/true)**Been thanked:** [169 times](https://champman0102.net/app.php/thankslist/givens/338/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=22552\#p22552)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=22552 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=22552 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=22552#p22552 "Post") by **[John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338)** » Sun Mar 28, 2021 12:25 am

\[AE2354\] = Number of cities

\[AE2358\] = Number of stadiums

[![User avatar](https://champman0102.net/download/file.php?avatar=384_1614080104.jpg)](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)

[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)Patch Team**Posts:** 2541**Joined:** Wed Nov 25, 2020 5:01 am**Has thanked:** [240 times](https://champman0102.net/app.php/thankslist/givens/384/true)**Been thanked:** [862 times](https://champman0102.net/app.php/thankslist/givens/384/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=22761\#p22761)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=22761 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=22761 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=22761#p22761 "Post") by **[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)** » Mon Mar 29, 2021 6:54 pm

It is asked in another thread , I am writing here for recording.

Origianally posted by giovanisantana29 in [https://champman0102.co.uk/showthread.p ... post348921](https://champman0102.co.uk/showthread.php?t=68&page=82&p=348921#post348921)

**giovanisantana29's post :**

Some interesting things I discovered recently:

**\*\*\*\*\*And will be possible see "your" attributes in the game and "your" Transfer screen as well, which shows "your" fluent languages for example. Human manager attributes.**

00874A9A JL SHORT 00874AB9 >> JMP SHORT 00874AB9

00874AA2 JGE SHORT 00874AB9 >> JMP SHORT 00874AB9

Fill with NOP: 00874ABD, 00874ACA, 00874ACE, 00874C03, 0087A670 and 0087DE27

Patch form:

Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=100#)

```
0x474a9a 0x7c 0xeb
0x474aa2 0x7d 0xeb
0x474abd 0x74 0x90
0x474abe 0x1d 0x90
0x474aca 0x74 0x90
0x474acb 0x10 0x90
0x474ace 0x7c 0x90
0x474acf 0xc 0x90
0x474c03 0x7d 0x90
0x474c04 0x8 0x90
0x47a670 0xf 0x90
0x47a671 0x8c 0x90
0x47a672 0x7c 0x90
0x47a673 0x26 0x90
0x47a674 0x0 0x90
0x47a675 0x0 0x90
0x47de27 0xf 0x90
0x47de28 0x8d 0x90
0x47de29 0xec 0x90
0x47de2a 0x78 0x90
0x47de2b 0x0 0x90
0x47de2c 0x0 0x90
```

**\*\*\*\*\*And will be possible see the Squad Status of the AI players in their Contract screen.**

Fill with NOP: 0087D33D

Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=100#)

```
0047D33D: 00 90
0047D33E: 00 90
0047D33F: 00 90
0047D340: 00 90
0047D341: 00 90
0047D342: 00 90
```

**\*\*\*\*\*For who don't play the game in the English language a " error Database cpp 7784 " appears constantly in the game. Fill with NOP 0053585D to 005358BF will solve this.**

Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=100#)

```
Fill with NOP 0053585D to 005358BF
```

**\*\*\*\*\*Doing this will be possible change the Squad Status at any time when you try to sign a player.**

**Explaining better: When we offer a contract to a player, before we offer salary and other things we have to choose their Squad Status. When choosing this cannot be changed for some time (about 2 weeks). With this modification you can change this at any time.**

004DD265 JE SHORT 004DD2C9 >>>> JMP SHORT 004DD2C9

004DDA31 JE SHORT 004DDA57 >>>> JMP SHORT 004DDA57

Patch form:

Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=100#)

```
0xdd265 0x74 0xeb
0xdda31 0x74 0xeb
```

**\*\*\*\*\*The "Disable Unprotected Contracts" option in CMPatcher disable not only the unprotected contracts rule, but others contracts rules as well like max 5 year contracts and a percentage of transfer value to the player's developer club. Well, if we disable only the unprotected contracts rule without disable the others rules?**

**In offset 00868307 have a number "2" which refers to the number of years that a contract becomes unprotected (this number is increased by 1 if the player is under 28). So if we change for a unreachable number like 15 (0F) in an .exe with the "Disable Unprotected Contracts" unchecked, the unprotected contracts rule will in practice be disabled since it will be impossible for a player to have more than a 15 years contract. But the other rules (max 5 year contract and % for the developer club) will hold.**

Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=100#)

```
00868307   ADD EBX,2  >>>>  ADD EBX,0F
```

**\\* \[TUTORIAL\] How to install and run the game CM0102?> [viewtopic.php?f=85&t=3571](https://champman0102.net/viewtopic.php?f=85&t=3571)** **Please use search bar for solution before posting your issue**

[![User avatar](https://champman0102.net/download/file.php?avatar=384_1614080104.jpg)](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)

[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)Patch Team**Posts:** 2541**Joined:** Wed Nov 25, 2020 5:01 am**Has thanked:** [240 times](https://champman0102.net/app.php/thankslist/givens/384/true)**Been thanked:** [862 times](https://champman0102.net/app.php/thankslist/givens/384/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=23403\#p23403)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=23403 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=23403 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=23403#p23403 "Post") by **[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)** » Mon Apr 05, 2021 7:24 pm

> [John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=21499#p21499) Thu Mar 18, 2021 4:55 pm
> 0089A6B3 \|. 74 61 JE SHORT 3968.0089A716
>
> 0089A83F 74 61 JE SHORT 3968.0089A8A2
>
> Fill these with NOP and the 'Load Preset' option will be available on the Tactics screen (for opening AI tactic files).

Hi JohnLocke, after this modification, I have 2 pcs 'Load Preset' on tactics menu. It seems they are doing same thing, but any difference you think?

**\\* \[TUTORIAL\] How to install and run the game CM0102?> [viewtopic.php?f=85&t=3571](https://champman0102.net/viewtopic.php?f=85&t=3571)** **Please use search bar for solution before posting your issue**

[John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338)Patch Team**Posts:** 326**Joined:** Wed Nov 25, 2020 12:26 am**Has thanked:** [175 times](https://champman0102.net/app.php/thankslist/givens/338/true)**Been thanked:** [169 times](https://champman0102.net/app.php/thankslist/givens/338/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=23408\#p23408)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=23408 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=23408 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=23408#p23408 "Post") by **[John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338)** » Mon Apr 05, 2021 7:34 pm

> [xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=23403#p23403) Mon Apr 05, 2021 7:24 pm
>
> > [John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=21499#p21499) Thu Mar 18, 2021 4:55 pm
> > 0089A6B3 \|. 74 61 JE SHORT 3968.0089A716
> >
> > 0089A83F 74 61 JE SHORT 3968.0089A8A2
> >
> > Fill these with NOP and the 'Load Preset' option will be available on the Tactics screen (for opening AI tactic files).
>
> Hi JohnLocke, after this modification, I have 2 pcs 'Load Preset' on tactics menu. It seems they are doing same thing, but any difference you think?

I only tested them independently - maybe you just need to NOP one or the other but not both.

[hodgy](https://champman0102.net/memberlist.php?mode=viewprofile&u=260)Hot Prospect for the Future**Posts:** 194**Joined:** Tue Nov 24, 2020 10:14 pm**Has thanked:** [110 times](https://champman0102.net/app.php/thankslist/givens/260/true)**Been thanked:** [60 times](https://champman0102.net/app.php/thankslist/givens/260/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=25261\#p25261)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=25261 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=25261 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=25261#p25261 "Post") by **[hodgy](https://champman0102.net/memberlist.php?mode=viewprofile&u=260)** » Sun Apr 18, 2021 6:07 pm

Has anyone come across the offset where an AI club calculates the transfer value it is willing to accept for a player?

[![User avatar](https://champman0102.net/download/file.php?avatar=384_1614080104.jpg)](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)

[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)Patch Team**Posts:** 2541**Joined:** Wed Nov 25, 2020 5:01 am**Has thanked:** [240 times](https://champman0102.net/app.php/thankslist/givens/384/true)**Been thanked:** [862 times](https://champman0102.net/app.php/thankslist/givens/384/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=25792\#p25792)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=25792 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=25792 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=25792#p25792 "Post") by **[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)** » Thu Apr 22, 2021 12:28 pm

008C31D2 ADD AL,12 ---------> change to ADD AL,0A

This can reduce work permit waiting time for UK from 18-25 days to 10-17 days, need your test

Patch form to reduce work permit to 10-17 days:

Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=100#)

```
004C31D3 0x12 0x0A
```

Patch form to reduce work permit to 7-14 days:

Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=100#)

```
004C31D3 0x12 0x07
```

Note: You should be able to reduce the time further by changing '0x0A' to a lower value, e.g. 0x01 for 1 to 8 days.

**\\* \[TUTORIAL\] How to install and run the game CM0102?> [viewtopic.php?f=85&t=3571](https://champman0102.net/viewtopic.php?f=85&t=3571)** **Please use search bar for solution before posting your issue**

[zionmaster](https://champman0102.net/memberlist.php?mode=viewprofile&u=444)Youth Team Player**Posts:** 43**Joined:** Wed Nov 25, 2020 8:27 am**Has thanked:** [149 times](https://champman0102.net/app.php/thankslist/givens/444/true)**Been thanked:** [13 times](https://champman0102.net/app.php/thankslist/givens/444/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=25863\#p25863)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=25863 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=25863 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=25863#p25863 "Post") by **[zionmaster](https://champman0102.net/memberlist.php?mode=viewprofile&u=444)** » Fri Apr 23, 2021 2:21 am

> [xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=22761#p22761) Mon Mar 29, 2021 6:54 pm
> It is asked in another thread , I am writing here for recording.
>
> Origianally posted by giovanisantana29 in [https://champman0102.co.uk/showthread.p ... post348921](https://champman0102.co.uk/showthread.php?t=68&page=82&p=348921#post348921)
>
> giovanisantana29's post :
>
> Some interesting things I discovered recently:
>
> Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=100#)
>
> ```
> 00874A9A JL SHORT 00874AB9 >> JMP SHORT 00874AB9
> 00874AA2 JGE SHORT 00874AB9 >> JMP SHORT 00874AB9
> Fill with NOP: 00874ABD, 00874ACA, 00874ACE, 00874C03, 0087A670 and 0087DE27
> ```
>
> **And will be possible see "your" attributes in the game and "your" Transfer screen as well, which shows "your" fluent languages for example. Human manager attributes.**
>
> Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=100#)
>
> ```
> Fill with NOP: 0087D33D
> ```
>
> **And will be possible see the Squad Status of the AI players in their Contract screen.**
>
> **For who don't play the game in the English language a "error Database" appears constantly in the game. Fill with NOP 0053585D to 005358BF will solve this.**
>
> Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=100#)
>
> ```
> 004DD265 JE SHORT 004DD2C9  >>>>  JMP SHORT 004DD2C9
> 004DDA31 JE SHORT 004DDA57  >>>>  JMP SHORT 004DDA57
> ```
>
> **Doing this will be possible change the Squad Status at any time when you try to sign a player.**
>
> **Explaining better: When we offer a contract to a player, before we offer salary and other things we have to choose their Squad Status. When choosing this cannot be changed for some time (about 2 weeks). With this modification you can change this at any time.**
>
> This one I don't know if has already been discovered, but I looked for something similar and I didn't find, so I guess not:
>
> The "Disable Unprotected Contracts" option in CMPatcher disable not only the unprotected contracts rule, but others contracts rules as well like max 5 year contracts and a percentage of transfer value to the player's developer club. Well, if we disable only the unprotected contracts rule without disable the others rules?
>
> Code: **In offset 00868307 have a number "2" which refers to the number of years that a contract becomes unprotected (this number is increased by 1 if the player is under 28). So if we change for a unreachable number like 15 (0F) in an .exe with the "Disable Unprotected Contracts" unchecked, the unprotected contracts rule will in practice be disabled since it will be impossible for a player to have more than a 15 years contract. But the other rules (max 5 year contract and % for the developer club) will hold.**

Dear sir xeno

Could you please guide me how to do this step by step?

Thank you very much :-\*

[![User avatar](https://champman0102.net/download/file.php?avatar=384_1614080104.jpg)](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)

[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)Patch Team**Posts:** 2541**Joined:** Wed Nov 25, 2020 5:01 am**Has thanked:** [240 times](https://champman0102.net/app.php/thankslist/givens/384/true)**Been thanked:** [862 times](https://champman0102.net/app.php/thankslist/givens/384/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=26074\#p26074)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=26074 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=26074 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=26074#p26074 "Post") by **[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)** » Sun Apr 25, 2021 1:29 pm

> [zionmaster](https://champman0102.net/memberlist.php?mode=viewprofile&u=444) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=25863#p25863) Fri Apr 23, 2021 2:21 am
>
> > [xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=22761#p22761) Mon Mar 29, 2021 6:54 pm
> > It is asked in another thread , I am writing here for recording.
> >
> > Origianally posted by giovanisantana29 in [https://champman0102.co.uk/showthread.p ... post348921](https://champman0102.co.uk/showthread.php?t=68&page=82&p=348921#post348921)
> >
> > giovanisantana29's post :
> >
> > Some interesting things I discovered recently:
> >
> > Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=100#)
> >
> > ```
> > 00874A9A JL SHORT 00874AB9 >> JMP SHORT 00874AB9
> > 00874AA2 JGE SHORT 00874AB9 >> JMP SHORT 00874AB9
> > Fill with NOP: 00874ABD, 00874ACA, 00874ACE, 00874C03, 0087A670 and 0087DE27
> > ```
> >
> > **And will be possible see "your" attributes in the game and "your" Transfer screen as well, which shows "your" fluent languages for example. Human manager attributes.**
> >
> > Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=100#)
> >
> > ```
> > Fill with NOP: 0087D33D
> > ```
> >
> > **And will be possible see the Squad Status of the AI players in their Contract screen.**
> >
> > **For who don't play the game in the English language a "error Database" appears constantly in the game. Fill with NOP 0053585D to 005358BF will solve this.**
> >
> > Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=100#)
> >
> > ```
> > 004DD265 JE SHORT 004DD2C9  >>>>  JMP SHORT 004DD2C9
> > 004DDA31 JE SHORT 004DDA57  >>>>  JMP SHORT 004DDA57
> > ```
> >
> > **Doing this will be possible change the Squad Status at any time when you try to sign a player.**
> >
> > **Explaining better: When we offer a contract to a player, before we offer salary and other things we have to choose their Squad Status. When choosing this cannot be changed for some time (about 2 weeks). With this modification you can change this at any time.**
> >
> > This one I don't know if has already been discovered, but I looked for something similar and I didn't find, so I guess not:
> >
> > The "Disable Unprotected Contracts" option in CMPatcher disable not only the unprotected contracts rule, but others contracts rules as well like max 5 year contracts and a percentage of transfer value to the player's developer club. Well, if we disable only the unprotected contracts rule without disable the others rules?
> >
> > Code: **In offset 00868307 have a number "2" which refers to the number of years that a contract becomes unprotected (this number is increased by 1 if the player is under 28). So if we change for a unreachable number like 15 (0F) in an .exe with the "Disable Unprotected Contracts" unchecked, the unprotected contracts rule will in practice be disabled since it will be impossible for a player to have more than a 15 years contract. But the other rules (max 5 year contract and % for the developer club) will hold.**
>
> Dear sir xeno
>
> Could you please guide me how to do this step by step?
>
> Thank you very much :-\*

Hi, I added a patch form in the original post and below.

Copy the following patch form into a Notepad file, save it with .patch extension, and then apply it using Nick's patcher (Tools > Apply patch file).

**\*\*\*\*\*And will be possible see "your" attributes in the game and "your" Transfer screen as well, which shows "your" fluent languages for example. Human manager attributes.**

Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=100#)

```
00874A9A JL SHORT 00874AB9 >> JMP SHORT 00874AB9
00874AA2 JGE SHORT 00874AB9 >> JMP SHORT 00874AB9
Fill with NOP: 00874ABD, 00874ACA, 00874ACE, 00874C03, 0087A670 and 0087DE27
```

Patch form:

Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=100#)

```
0x474a9a 0x7c 0xeb
0x474aa2 0x7d 0xeb
0x474abd 0x74 0x90
0x474abe 0x1d 0x90
0x474aca 0x74 0x90
0x474acb 0x10 0x90
0x474ace 0x7c 0x90
0x474acf 0xc 0x90
0x474c03 0x7d 0x90
0x474c04 0x8 0x90
0x47a670 0xf 0x90
0x47a671 0x8c 0x90
0x47a672 0x7c 0x90
0x47a673 0x26 0x90
0x47a674 0x0 0x90
0x47a675 0x0 0x90
0x47de27 0xf 0x90
0x47de28 0x8d 0x90
0x47de29 0xec 0x90
0x47de2a 0x78 0x90
0x47de2b 0x0 0x90
0x47de2c 0x0 0x90
```

**\\* \[TUTORIAL\] How to install and run the game CM0102?> [viewtopic.php?f=85&t=3571](https://champman0102.net/viewtopic.php?f=85&t=3571)** **Please use search bar for solution before posting your issue**

[John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338)Patch Team**Posts:** 326**Joined:** Wed Nov 25, 2020 12:26 am**Has thanked:** [175 times](https://champman0102.net/app.php/thankslist/givens/338/true)**Been thanked:** [169 times](https://champman0102.net/app.php/thankslist/givens/338/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=26362\#p26362)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=26362 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=26362 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=26362#p26362 "Post") by **[John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338)** » Wed Apr 28, 2021 9:09 am

008148A9 74 6E JE SHORT cm0102.00814919

Fill with NOP and the 'Basque' option will always be available when filtering by nationality on the Player & Staff Search screen. Normally, the option is only there if you're managing a club with the Basque restriction.

Patch file (untested, written manually - too lazy to auto generate one ![:D](https://champman0102.net/images/smilies/icon_e_biggrin.gif))

Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=100#)

```
0x4148A9 0x74 0x90
0x4148AA 0x6E 0x90
```

The nationality used is stored at:

0080764A A1 24F49C00 MOV EAX,DWORD PTR DS:\[9CF424\]

Change the 9CF value and you can change the associated nationality filter, e.g. for Wales (which is oddly missing from the list of nations to filter by) it would be:

0080764A A1 10F59C00 MOV EAX,DWORD PTR DS:\[9CF510\]

[John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338)Patch Team**Posts:** 326**Joined:** Wed Nov 25, 2020 12:26 am**Has thanked:** [175 times](https://champman0102.net/app.php/thankslist/givens/338/true)**Been thanked:** [169 times](https://champman0102.net/app.php/thankslist/givens/338/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=26410\#p26410)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=26410 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=26410 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=26410#p26410 "Post") by **[John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338)** » Wed Apr 28, 2021 2:27 pm

If you fill the following lines with NOP it will remove the 'Attributes' button on the Shortlist, Player Search, Staff Search & Scout screens. Part of a 'hide all stats' patch I'm tinkering with.

00813850 6A 02 PUSH 2

00813852 6A 01 PUSH 1

00813854 68 641FDE00 PUSH cm0102.00DE1F64

00813859 50 PUSH EAX

0081385A 6A 01 PUSH 1

0081385C 6A 0C PUSH 0C

0081385E 51 PUSH ECX

0081385F 6A 30 PUSH 30

00813861 6A 00 PUSH 0

00813863 6A 01 PUSH 1

00813865 55 PUSH EBP

...

0081386B E8 3008FFFF CALL cm0102.008040A0 ;

[![User avatar](https://champman0102.net/download/file.php?avatar=384_1614080104.jpg)](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)

[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)Patch Team**Posts:** 2541**Joined:** Wed Nov 25, 2020 5:01 am**Has thanked:** [240 times](https://champman0102.net/app.php/thankslist/givens/384/true)**Been thanked:** [862 times](https://champman0102.net/app.php/thankslist/givens/384/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=26415\#p26415)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=26415 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=26415 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=26415#p26415 "Post") by **[Xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384)** » Wed Apr 28, 2021 3:19 pm

Hi John Locke, there are LOCKED-UNLOCK buttons in scouts screen and tactics screen in exe. I remember , I saw them active in my games in past years without any code changing , but I dont see them now and I dont know how I see them and what they do.

If it works how I think, scout will be locked for same searching and tactics will be locked so that assistant manager will not change it in holiday mode.

Do you remember such thing or did you check this part? I locked scout but he returned from searching in my tests.

May be there is another way or it does not work like what I hope.

**\\* \[TUTORIAL\] How to install and run the game CM0102?> [viewtopic.php?f=85&t=3571](https://champman0102.net/viewtopic.php?f=85&t=3571)** **Please use search bar for solution before posting your issue**

[John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338)Patch Team**Posts:** 326**Joined:** Wed Nov 25, 2020 12:26 am**Has thanked:** [175 times](https://champman0102.net/app.php/thankslist/givens/338/true)**Been thanked:** [169 times](https://champman0102.net/app.php/thankslist/givens/338/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=26417\#p26417)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=26417 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=26417 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=26417#p26417 "Post") by **[John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338)** » Wed Apr 28, 2021 3:42 pm

> [xeno](https://champman0102.net/memberlist.php?mode=viewprofile&u=384) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=26415#p26415) Wed Apr 28, 2021 3:19 pm
> Hi John Locke, there are LOCKED-UNLOCK buttons in scouts screen and tactics screen in exe. I remember , I saw them active in my games in past years without any code changing , but I dont see them now and I dont know how I see them and what they do.
>
> If it works how I think, scout will be locked for same searching and tactics will be locked so that assistant manager will not change it in holiday mode.
>
> Do you remember such thing or did you check this part? I locked scout but he returned from searching in my tests.
>
> May be there is another way or it does not work like what I hope.

You can lock tactics with a password, so if you're playing multi-player on the same PC your opponent can't use your tactic. I assume that's what you've found.

[Post Reply](https://champman0102.net/posting.php?mode=reply&t=1540 "Post a reply")

- [Print view](https://champman0102.net/viewtopic.php?t=1540&start=100&view=print "Print view")

Display: All posts1 day7 days2 weeks1 month3 months6 months1 yearSort by: AuthorPost timeSubjectDirection: AscendingDescending

* * *

764 posts


- [Page **5** of **31**](https://champman0102.net/viewtopic.php?t=1540&start=100# "Click to jump to page…")










  - Jump to page:

- [Previous](https://champman0102.net/viewtopic.php?t=1540&start=75)
- [1](https://champman0102.net/viewtopic.php?t=1540)
- …
- [3](https://champman0102.net/viewtopic.php?t=1540&start=50)
- [4](https://champman0102.net/viewtopic.php?t=1540&start=75)
- 5
- [6](https://champman0102.net/viewtopic.php?t=1540&start=125)
- [7](https://champman0102.net/viewtopic.php?t=1540&start=150)
- …
- [31](https://champman0102.net/viewtopic.php?t=1540&start=750)
- [Next](https://champman0102.net/viewtopic.php?t=1540&start=125)

[Return to “Patches”](https://champman0102.net/viewforum.php?f=35)

Jump to

- [The Website](https://champman0102.net/viewforum.php?f=71)
- [↳   Announcements](https://champman0102.net/viewforum.php?f=2)
- [↳   New Signings](https://champman0102.net/viewforum.php?f=7)
- [↳   Awards](https://champman0102.net/viewforum.php?f=5)
- [↳   Hall of Fame](https://champman0102.net/viewforum.php?f=88)
- [↳   Awards](https://champman0102.net/viewforum.php?f=90)
- [↳   Members](https://champman0102.net/viewforum.php?f=91)
- [↳   Stories](https://champman0102.net/viewforum.php?f=8)
- [Downloads](https://champman0102.net/viewforum.php?f=54)
- [↳   Downloads](https://champman0102.net/viewforum.php?f=57)
- [↳   Background Packs](https://champman0102.net/viewforum.php?f=79)
- [↳   Colour Schemes](https://champman0102.net/viewforum.php?f=78)
- [↳   Commentary Files](https://champman0102.net/viewforum.php?f=82)
- [↳   Databases](https://champman0102.net/viewforum.php?f=73)
- [↳   Documentation](https://champman0102.net/viewforum.php?f=80)
- [↳   Fonts](https://champman0102.net/viewforum.php?f=74)
- [↳   Game](https://champman0102.net/viewforum.php?f=76)
- [↳   Menubars](https://champman0102.net/viewforum.php?f=75)
- [↳   Patches](https://champman0102.net/viewforum.php?f=72)
- [↳   Tactics](https://champman0102.net/viewforum.php?f=81)
- [↳   Tactic Packs](https://champman0102.net/viewforum.php?f=84)
- [↳   Tools](https://champman0102.net/viewforum.php?f=77)
- [Technical Support, Tutorials & FAQs](https://champman0102.net/viewforum.php?f=13)
- [↳   Technical Support, Tutorials & FAQs](https://champman0102.net/viewforum.php?f=43)
- [↳   Tutorials](https://champman0102.net/viewforum.php?f=85)
- [The Office](https://champman0102.net/viewforum.php?f=3)
- [↳   Scouting and Research](https://champman0102.net/viewforum.php?f=34)
- [↳   Africa](https://champman0102.net/viewforum.php?f=37)
- [↳   Asia](https://champman0102.net/viewforum.php?f=38)
- [↳   Europe](https://champman0102.net/viewforum.php?f=52)
- [↳   North, Central America & Caribbean](https://champman0102.net/viewforum.php?f=53)
- [↳   Oceania](https://champman0102.net/viewforum.php?f=39)
- [↳   South America](https://champman0102.net/viewforum.php?f=40)
- [↳   Free Players and Staff](https://champman0102.net/viewforum.php?f=42)
- [↳   Histories](https://champman0102.net/viewforum.php?f=48)
- [↳   Research](https://champman0102.net/viewforum.php?f=41)
- [Championship Managers Club](https://champman0102.net/viewforum.php?f=11)
- [↳   Data Updates](https://champman0102.net/viewforum.php?f=33)
- [↳   General](https://champman0102.net/viewforum.php?f=26)
- [↳   Graphics](https://champman0102.net/viewforum.php?f=36)
- [↳   Network Games](https://champman0102.net/viewforum.php?f=27)
- [↳   Official Challenges](https://champman0102.net/viewforum.php?f=28)
- [↳   Patches](https://champman0102.net/viewforum.php?f=35)
- [↳   Stories](https://champman0102.net/viewforum.php?f=29)
- [↳   Tactics](https://champman0102.net/viewforum.php?f=30)
- [↳   Talents, Tips and Training](https://champman0102.net/viewforum.php?f=31)
- [↳   Other Championship Managers](https://champman0102.net/viewforum.php?f=32)
- [CM 01/02 Interactive](https://champman0102.net/viewforum.php?f=10)
- [↳   Championship Managers League](https://champman0102.net/viewforum.php?f=20)
- [↳   CM Forums United](https://champman0102.net/viewforum.php?f=21)
- [↳   Dream Team League](https://champman0102.net/viewforum.php?f=22)
- [↳   Trillionaires Toys](https://champman0102.net/viewforum.php?f=25)
- [The Community](https://champman0102.net/viewforum.php?f=9)
- [↳   Football](https://champman0102.net/viewforum.php?f=14)
- [↳   Gaming](https://champman0102.net/viewforum.php?f=15)
- [↳   General Chat](https://champman0102.net/viewforum.php?f=16)
- [↳   Other Sports](https://champman0102.net/viewforum.php?f=17)
- [↳   Soccer Manager](https://champman0102.net/viewforum.php?f=86)
- [↳   TV & Films](https://champman0102.net/viewforum.php?f=19)
- [Archives](https://champman0102.net/viewforum.php?f=87)
- [↳   Archives](https://champman0102.net/viewforum.php?f=83)

Powered by [phpBB](https://www.phpbb.com/) ® Forum Software © phpBB Limited

[Privacy](https://champman0102.net/ucp.php?mode=privacy "Privacy")
\|
[Terms](https://champman0102.net/ucp.php?mode=terms "Terms")

---

## Page 6 (posts 126-150)

[Forums](https://champman0102.net/index.php "Forums")

# Championship Manager 2001/2002 Forums

Keeping the Game Alive

[Skip to content](https://champman0102.net/viewtopic.php?t=1540&start=25#start_here)

## [Offsets](https://champman0102.net/viewtopic.php?t=1540&start=25)

**Moderator:** [Patch Team](https://champman0102.net/memberlist.php?mode=group&g=21)

[Post Reply](https://champman0102.net/posting.php?mode=reply&t=1540 "Post a reply")

- [Print view](https://champman0102.net/viewtopic.php?t=1540&start=25&view=print "Print view")

764 posts


- [Page **2** of **31**](https://champman0102.net/viewtopic.php?t=1540&start=25# "Click to jump to page…")










  - Jump to page:

- [Previous](https://champman0102.net/viewtopic.php?t=1540)
- [1](https://champman0102.net/viewtopic.php?t=1540)
- 2
- [3](https://champman0102.net/viewtopic.php?t=1540&start=50)
- [4](https://champman0102.net/viewtopic.php?t=1540&start=75)
- [5](https://champman0102.net/viewtopic.php?t=1540&start=100)
- …
- [31](https://champman0102.net/viewtopic.php?t=1540&start=750)
- [Next](https://champman0102.net/viewtopic.php?t=1540&start=50)

[Lt. Columbo](https://champman0102.net/memberlist.php?mode=viewprofile&u=169)Youth Team Player**Posts:** 12**Joined:** Sun Oct 25, 2020 11:56 am**Has thanked:** [3 times](https://champman0102.net/app.php/thankslist/givens/169/true)**Been thanked:** [9 times](https://champman0102.net/app.php/thankslist/givens/169/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=7563\#p7563)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=7563 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=7563 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=7563#p7563 "Post") by **[Lt. Columbo](https://champman0102.net/memberlist.php?mode=viewprofile&u=169)** » Sun Dec 06, 2020 5:41 pm

Hello guys - great work you all do. I've been playing a number of the retro dbs and was wondering if anyone knows a way of disabling squad numbers for specific leagues. From looking at Saturn's patch collection and a few threads on the old forum, I think it's something to do with \[ESI+52\] but I can't get any further than that.

[John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338)Patch Team**Posts:** 326**Joined:** Wed Nov 25, 2020 12:26 am**Has thanked:** [175 times](https://champman0102.net/app.php/thankslist/givens/338/true)**Been thanked:** [169 times](https://champman0102.net/app.php/thankslist/givens/338/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=7703\#p7703)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=7703 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=7703 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=7703#p7703 "Post") by **[John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338)** » Mon Dec 07, 2020 8:33 pm

> [Lt. Columbo](https://champman0102.net/memberlist.php?mode=viewprofile&u=169) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=7563#p7563) Sun Dec 06, 2020 5:41 pm
> Hello guys - great work you all do. I've been playing a number of the retro dbs and was wondering if anyone knows a way of disabling squad numbers for specific leagues. From looking at Saturn's patch collection and a few threads on the old forum, I think it's something to do with \[ESI+52\] but I can't get any further than that.

Does this help? It's every line that contains "\[ESI+52\]," and "BYTE". I've not looked any of them up to check if they're related.

Code: [Select all](https://champman0102.net/viewtopic.php?t=1540&start=25#)

```
004056E5      |. 884E 52        MOV BYTE PTR DS:[ESI+52],CL
00411D18      |. 884E 52        MOV BYTE PTR DS:[ESI+52],CL
0041EA50      |. 884E 52        MOV BYTE PTR DS:[ESI+52],CL
0041FF1D      |. 884E 52        MOV BYTE PTR DS:[ESI+52],CL
0042A621      |. C646 52 02     MOV BYTE PTR DS:[ESI+52],2
0042CBDF      |. 884E 52        MOV BYTE PTR DS:[ESI+52],CL
0042DEB7      |. 8846 52        MOV BYTE PTR DS:[ESI+52],AL
00514960      |. 884E 52        MOV BYTE PTR DS:[ESI+52],CL
00515E62      |. 884E 52        MOV BYTE PTR DS:[ESI+52],CL
00516F79      |. 884E 52        MOV BYTE PTR DS:[ESI+52],CL
00553A6F      |. 884E 52        MOV BYTE PTR DS:[ESI+52],CL
00572E02      |. 8846 52        MOV BYTE PTR DS:[ESI+52],AL
00574BDE      |. 884E 52        MOV BYTE PTR DS:[ESI+52],CL
005767F3      |. 8846 52        MOV BYTE PTR DS:[ESI+52],AL
00578140      |> 884E 52        MOV BYTE PTR DS:[ESI+52],CL
0057A16B      |. 8846 52        MOV BYTE PTR DS:[ESI+52],AL              ; |
0058383C      |. 8846 52        MOV BYTE PTR DS:[ESI+52],AL
00593BEB      |. 8846 52        MOV BYTE PTR DS:[ESI+52],AL
00595D1A      |. 8856 52        MOV BYTE PTR DS:[ESI+52],DL
005BC49E      |. 884E 52        MOV BYTE PTR DS:[ESI+52],CL
005BF126      |. 8846 52        MOV BYTE PTR DS:[ESI+52],AL
005DB47B      |. 8856 52        MOV BYTE PTR DS:[ESI+52],DL
005DF45E      |> 884E 52        MOV BYTE PTR DS:[ESI+52],CL
005EAF0C      |. 884E 52        MOV BYTE PTR DS:[ESI+52],CL
005EBE67      |. 8846 52        MOV BYTE PTR DS:[ESI+52],AL
005F85D8      |. 884E 52        MOV BYTE PTR DS:[ESI+52],CL
006320EA      |. 8846 52        MOV BYTE PTR DS:[ESI+52],AL              ; |
0063301B      |. 8846 52        MOV BYTE PTR DS:[ESI+52],AL              ; |
00635AFC      |. 884E 52        MOV BYTE PTR DS:[ESI+52],CL
0063A970      |. 8846 52        MOV BYTE PTR DS:[ESI+52],AL
006416BF      |. 884E 52        MOV BYTE PTR DS:[ESI+52],CL
00646921      |. 884E 52        MOV BYTE PTR DS:[ESI+52],CL
00663698      |. 884E 52        MOV BYTE PTR DS:[ESI+52],CL
0066BD1B      |. 8856 52        MOV BYTE PTR DS:[ESI+52],DL
0078BDDE      |. 8846 52        MOV BYTE PTR DS:[ESI+52],AL
0078EDF3      |. 8846 52        MOV BYTE PTR DS:[ESI+52],AL
00790B6C      |. 8846 52        MOV BYTE PTR DS:[ESI+52],AL
0079277E      |. 8846 52        MOV BYTE PTR DS:[ESI+52],AL
007C9700      |. 8846 52        MOV BYTE PTR DS:[ESI+52],AL
007CBFBB      |. 884E 52        MOV BYTE PTR DS:[ESI+52],CL
007CF9B2      |. 8856 52        MOV BYTE PTR DS:[ESI+52],DL
007D1737      |. 8856 52        MOV BYTE PTR DS:[ESI+52],DL
007D2679      |. 8846 52        MOV BYTE PTR DS:[ESI+52],AL
007EA891      |. 8846 52        MOV BYTE PTR DS:[ESI+52],AL
007EB7C0      |. 884E 52        MOV BYTE PTR DS:[ESI+52],CL
007F2A3B      |. 884E 52        MOV BYTE PTR DS:[ESI+52],CL
0084FE83      |. 885E 52        MOV BYTE PTR DS:[ESI+52],BL
00855D44      |> 884E 52        MOV BYTE PTR DS:[ESI+52],CL
00859DF4      |. F646 52 02     |TEST BYTE PTR DS:[ESI+52],2
0088F12B      |. 8846 52        MOV BYTE PTR DS:[ESI+52],AL
008905C2      |. 884E 52        MOV BYTE PTR DS:[ESI+52],CL
008FE012      |. 8856 52        MOV BYTE PTR DS:[ESI+52],DL
008FF2F8      |. 8856 52        MOV BYTE PTR DS:[ESI+52],DL
0090234B      |. 8846 52        MOV BYTE PTR DS:[ESI+52],AL              ; |
00925C85      |. 8846 52        MOV BYTE PTR DS:[ESI+52],AL
0092B51B      |. 8846 52        MOV BYTE PTR DS:[ESI+52],AL              ; |
Lines found:56
```

[Lt. Columbo](https://champman0102.net/memberlist.php?mode=viewprofile&u=169)Youth Team Player**Posts:** 12**Joined:** Sun Oct 25, 2020 11:56 am**Has thanked:** [3 times](https://champman0102.net/app.php/thankslist/givens/169/true)**Been thanked:** [9 times](https://champman0102.net/app.php/thankslist/givens/169/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=7791\#p7791)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=7791 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=7791 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=7791#p7791 "Post") by **[Lt. Columbo](https://champman0102.net/memberlist.php?mode=viewprofile&u=169)** » Tue Dec 08, 2020 8:03 pm

Yep - useful, thanks. Looks like that list is all leagues with squad numbers. Change to 'BL' at the end and that seems to turn them off. Many thanks!

[marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005)Youth Team Player**Posts:** 31**Joined:** Fri Nov 27, 2020 10:01 am**Has thanked:** [2 times](https://champman0102.net/app.php/thankslist/givens/2005/true)**Been thanked:** [6 times](https://champman0102.net/app.php/thankslist/givens/2005/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=7818\#p7818)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=7818 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=7818 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=7818#p7818 "Post") by **[marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005)** » Tue Dec 08, 2020 10:23 pm

can any1 explain what ruling\_body cpp means?

i swapped all ofssets like suggested here

[https://champman0102.co.uk/showthread.p ... post442361](https://champman0102.co.uk/showthread.php?t=801&page=33&p=442361#post442361)

but get errors about ruling\_body, i can still play (just click ok) but still want to know what is it

[marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005)Youth Team Player**Posts:** 31**Joined:** Fri Nov 27, 2020 10:01 am**Has thanked:** [2 times](https://champman0102.net/app.php/thankslist/givens/2005/true)**Been thanked:** [6 times](https://champman0102.net/app.php/thankslist/givens/2005/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=7852\#p7852)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=7852 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=7852 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=7852#p7852 "Post") by **[marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005)** » Wed Dec 09, 2020 9:39 am

and 1 more question about league swap

i swapped denmark and russia, and now all russian players "fgn" for league games, how to change it?

surely i can change it in editor but.

[Lt. Columbo](https://champman0102.net/memberlist.php?mode=viewprofile&u=169)Youth Team Player**Posts:** 12**Joined:** Sun Oct 25, 2020 11:56 am**Has thanked:** [3 times](https://champman0102.net/app.php/thankslist/givens/169/true)**Been thanked:** [9 times](https://champman0102.net/app.php/thankslist/givens/169/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=7864\#p7864)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=7864 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=7864 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=7864#p7864 "Post") by **[Lt. Columbo](https://champman0102.net/memberlist.php?mode=viewprofile&u=169)** » Wed Dec 09, 2020 12:54 pm

> [marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=7852#p7852) Wed Dec 09, 2020 9:39 am
> and 1 more question about league swap
>
> i swapped denmark and russia, and now all russian players "fgn" for league games, how to change it?
>
> surely i can change it in editor but.

Quick fix might be making Russia an EU country, perhaps? When I've looked at player restriction offsets previously, it seems to be along the line of "MOV BYTE PTR DS:\[EDX+2\],4" where "+2" is one of the below list and "4" then the number allowed.

\[-\] = Foreign players (Croatia & South Korea)

\[+1\] = No restrictions

\[+2\] = Foreign players

\[+3\] = Non-EU players (Portugal)

\[+5\] = Non-EU players

[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)Hot Prospect for the Future**Posts:** 201**Joined:** Sun Nov 29, 2020 9:55 am**Has thanked:** [53 times](https://champman0102.net/app.php/thankslist/givens/3116/true)**Been thanked:** [59 times](https://champman0102.net/app.php/thankslist/givens/3116/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=7865\#p7865)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=7865 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=7865 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=7865#p7865 "Post") by **[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)** » Wed Dec 09, 2020 1:10 pm

Check the start of the block of coding for each league - there will be a line; MOV BYTE PTR DS:\[ESI+50\], 20 - you need to change the value at end, this relates to the country's rules I think (so change the value in Danish leagues to the value that is in the original Russian leagues and vice-versa, and that should hopefully solve it).

[marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005)Youth Team Player**Posts:** 31**Joined:** Fri Nov 27, 2020 10:01 am**Has thanked:** [2 times](https://champman0102.net/app.php/thankslist/givens/2005/true)**Been thanked:** [6 times](https://champman0102.net/app.php/thankslist/givens/2005/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=7871\#p7871)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=7871 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=7871 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=7871#p7871 "Post") by **[marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005)** » Wed Dec 09, 2020 3:02 pm

> [Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=7865#p7865) Wed Dec 09, 2020 1:10 pm
> Check the start of the block of coding for each league - there will be a line; MOV BYTE PTR DS:\[ESI+50\], 20 - you need to change the value at end, this relates to the country's rules I think (so change the value in Danish leagues to the value that is in the original Russian leagues and vice-versa, and that should hopefully solve it).

problem is - i made it for cm3 (98/99) and there is no russian league)

i guess making Russia EU in editor is most easy choice

[djole2mcloud](https://champman0102.net/memberlist.php?mode=viewprofile&u=5430)Decent Young Player**Posts:** 66**Joined:** Wed Dec 09, 2020 6:57 am**Has thanked:** [11 times](https://champman0102.net/app.php/thankslist/givens/5430/true)**Been thanked:** [38 times](https://champman0102.net/app.php/thankslist/givens/5430/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=7892\#p7892)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=7892 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=7892 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=7892#p7892 "Post") by **[djole2mcloud](https://champman0102.net/memberlist.php?mode=viewprofile&u=5430)** » Wed Dec 09, 2020 7:42 pm

This post, on my opinion is probably one of the most important on the forum. It provides great deal of potential for league swapp. Also, i think this post deserve a little bit more explanation from Saturn, cause, it seems that to regular users isn't quite clear (including myself,of course).

Creating template files for every unplayable league (for swapping with some playable) would be great addition. Also, league ID's from club\_comp.dat file in .txt would be great. JL posted many years ago offset for competitions in playable leagues...

I am aware that this is a great deal of work and time, but as i say, i really think this post have a great deal of potential that is still very much unused.

I hope i did not insult anyone with this post.

Thanks

SWAPPING LEAGUES

Originally Posted by saturn

Previously, league patches were done by swapping all of one nation's attributes and clubs with another nation's. The following process patches a league by instead telling the game to load another nation's attributes and clubs directly, without the need to swap things around.

This method takes advantage of the fact that there are some competitions in the database but that are not used in the exe. The countries with competitions in the database are:

Austria

China

Czech Republic

Hong Kong

India

Indonesia

Luxembourg

Malaysia

Mexico

Singapore

South Africa

Switzerland

Thailand

Yugoslavia

It is possible to patch countries without leagues in the database, but I'll get to that later.

Each playable league and playable cup has a 9CF\*\*\*value in the cm0102.exe. The exe always uses these 9CF\*\*\* values when referencing leagues or cups. The 9CF\*\*\* value itself is simply the competition's ID#, which is taken from club\_comp.dat file in the Data folder. A competition's ID# can easily be found by opening the club\_comp.dat file in XVI32 and looking to the four bytes to the left of a competition's long name. For example, we can see here that the Belgian First Division A's ID# is 00, and that the English Premier League's is 07. The values are in hexadecimal and after reaching FF (or FF 00 00 00) the next ID# will be 00 01 (00 01 00 00), so the values are stored from right to left.

So every competition has an ID# but not every competition has a 9CF\*\*\* value. As we know, a competition's 9CF\*\*\* value is the same as their ID#. What this new method of league patching does is change all the references in the cm0102.exe of the old competition's 9CF\*\*\* values to the new competition's ID#. Let's look at a line of code in setup.cpp:

00835E51 MOV EDX,DWORD PTR DS:\[9CF8B0\]

This will load the Northern Ireland Premier Division when the Northern Ireland league has been selected. If you look for that competition in club\_comp.dat, you can see that its competition ID# is 9A. We can write the above line from setup.cpp as the following and the code will do the exact same thing:

00835E51 MOV EDX,9A

But of course, we want to change it to another competition's ID# entirely. So the following would load the Swiss National Division A instead:

00835E51 MOV EDX,0FA (note that in Olly when entering hexadecimal values that begin with a letter, a zero has to go before it).

Again the Swiss National Division A's ID# is taken from club\_comp.dat. So to summarise, for a Northern Ireland --> Switzerland swap, in the exe you would replace a lot of (not all) instances of:

Code:

Northern Ireland --> Switzerland 9CF3E4 --> 9CF4AC

Northern Ireland Premier Division --> Swiss National Division A 9CF8B0 --> 0FA

Northern Ireland First Division --> Swiss National Division B 9CF8B4 --> 0FB

Northern Ireland Lower Division --> Swiss Lower Division 9CF8B8 --> 0FC

Northern Irish Cup --> Swiss Cup 9CF8C0 --> 0FD

(The 9CF\*\*\* value for Switzerland can be found in the 9CF\*\*\* thread linked above.)

The easiest way to find all instances of the 9CF\*\*\* values is by downloading the cm0102.exe.txt file here and just CTRL+F each value.

The lines to change to convert Northern Ireland to Switzerland are:

Spoiler!

Code:

Northern Ireland --> Switzerland 9CF3E4 --> 9CF4AC

00413E40 MOV EAX,DWORD PTR DS:\[9CF3E4\] award\_manager

0055DEF0 MOV EAX,DWORD PTR DS:\[9CF3E4\] discipline

005EF483 CMP EAX,DWORD PTR DS:\[9CF3E4\] hall\_of\_fame

00668619 MOV EAX,DWORD PTR DS:\[9CF3E4\] key\_nation

0078D8B6 MOV ECX,DWORD PTR DS:\[9CF3E4\] nir\_lge\_cup

0078D95E MOV ECX,DWORD PTR DS:\[9CF3E4\] nir\_lge\_cup

00792DAE MOV EAX,DWORD PTR DS:\[9CF3E4\] northern\_ireland\_awards

007934A4 MOV EAX,DWORD PTR DS:\[9CF3E4\] northern\_ireland\_awards

007E0B11 MOV EDX,DWORD PTR DS:\[9CF3E4\] rb\_northern\_ireland

007E0DEB MOV EAX,DWORD PTR DS:\[9CF3E4\] rb\_northern\_ireland

008D2B63 MOV EDX,DWORD PTR DS:\[9CF3E4\] transfer\_manager

Northern Ireland Premier Division --> Swiss National Division A 9CF8B0 --> 0FA

0078A2D5 MOV EAX,DWORD PTR DS:\[9CF8B0\] nir\_charity

0078AD81 MOV EBP,DWORD PTR DS:\[9CF8B0\] nir\_cup

0078BDC8 MOV EDI,DWORD PTR DS:\[9CF8B0\] nir\_first

0078C055 MOV EAX,DWORD PTR DS:\[9CF8B0\] nir\_first

0078C06F MOV ECX,DWORD PTR DS:\[9CF8B0\] nir\_first

0078C19D MOV EAX,DWORD PTR DS:\[9CF8B0\] nir\_first

0078C30B MOV ECX,DWORD PTR DS:\[9CF8B0\] nir\_first

0078C498 MOV EAX,DWORD PTR DS:\[9CF8B0\] nir\_first

0078C4E7 MOV EAX,DWORD PTR DS:\[9CF8B0\] nir\_first

0078C54C MOV ECX,DWORD PTR DS:\[9CF8B0\] nir\_first

0078C5DA MOV EDX,DWORD PTR DS:\[9CF8B0\] nir\_first

0078C6BF MOV ECX,DWORD PTR DS:\[9CF8B0\] nir\_first

0078ED0D MOV EAX,DWORD PTR DS:\[9CF8B0\] nir\_prm

00792FE3 MOV EDX,DWORD PTR DS:\[9CF8B0\] northern\_ireland\_awards

00793040 MOV EDX,DWORD PTR DS:\[9CF8B0\] northern\_ireland\_awards

0079309F MOV EDX,DWORD PTR DS:\[9CF8B0\] northern\_ireland\_awards

007930FE MOV EDX,DWORD PTR DS:\[9CF8B0\] northern\_ireland\_awards

0079315D MOV EDX,DWORD PTR DS:\[9CF8B0\] northern\_ireland\_awards

007931D2 MOV EDX,DWORD PTR DS:\[9CF8B0\] northern\_ireland\_awards

007934D1 MOV ECX,DWORD PTR DS:\[9CF8B0\] northern\_ireland\_awards

007934F5 MOV ECX,DWORD PTR DS:\[9CF8B0\] northern\_ireland\_awards

00793519 MOV ECX,DWORD PTR DS:\[9CF8B0\] northern\_ireland\_awards

0079353D MOV EDX,DWORD PTR DS:\[9CF8B0\] northern\_ireland\_awards

00793630 MOV EAX,DWORD PTR DS:\[9CF8B0\] northern\_ireland\_awards

00835E51 MOV EDX,DWORD PTR DS:\[9CF8B0\] setup

Northern Ireland First Division --> Swiss National Division B 9CF8B4 --> 0FB

0078AD8B CMP EDX,DWORD PTR DS:\[9CF8B4\] nir\_cup

0078BCFD MOV EAX,DWORD PTR DS:\[9CF8B4\] nir\_first

0078C3BC MOV ECX,DWORD PTR DS:\[9CF8B4\] nir\_first

0078C42C MOV EAX,DWORD PTR DS:\[9CF8B4\] nir\_first

0078C44A MOV EAX,DWORD PTR DS:\[9CF8B4\] nir\_first

0078EDED MOV EDX,DWORD PTR DS:\[9CF8B4\] nir\_prm

0078EFA9 MOV EDX,DWORD PTR DS:\[9CF8B4\] nir\_prm

0079322A MOV EDX,DWORD PTR DS:\[9CF8B4\] northern\_ireland\_awards

00793287 MOV EDX,DWORD PTR DS:\[9CF8B4\] northern\_ireland\_awards

007932E6 MOV EDX,DWORD PTR DS:\[9CF8B4\] northern\_ireland\_awards

00793345 MOV EDX,DWORD PTR DS:\[9CF8B4\] northern\_ireland\_awards

007933A4 MOV EDX,DWORD PTR DS:\[9CF8B4\] northern\_ireland\_awards

00793413 MOV EDX,DWORD PTR DS:\[9CF8B4\] northern\_ireland\_awards

00793566 MOV ECX,DWORD PTR DS:\[9CF8B4\] northern\_ireland\_awards

00793577 MOV ECX,DWORD PTR DS:\[9CF8B4\] northern\_ireland\_awards

0079359B MOV ECX,DWORD PTR DS:\[9CF8B4\] northern\_ireland\_awards

007935BF MOV EDX,DWORD PTR DS:\[9CF8B4\] northern\_ireland\_awards

0079366B MOV ECX,DWORD PTR DS:\[9CF8B4\] northern\_ireland\_awards

00835EA6 MOV EDX,DWORD PTR DS:\[9CF8B4\] setup

Northern Ireland Lower Division --> Swiss Lower Division 9CF8B8 --> 0FC

0078AD61 CMP EBP,DWORD PTR DS:\[9CF8B8\] nir\_cup

Northern Irish Cup --> Swiss Cup 9CF8C0 --> 0FD

006686E9 MOV EAX,DWORD PTR DS:\[9CF8C0\] key\_nation

0078A26E MOV EAX,DWORD PTR DS:\[9CF8C0\] nir\_charity

0078A345 MOV EAX,DWORD PTR DS:\[9CF8C0\] nir\_charity

00835EF9 MOV EDX,DWORD PTR DS:\[9CF8C0\] setup

00836018 MOV EAX,DWORD PTR DS:\[9CF8C0\] setup

Other

00835F4A JE 00835F70 --> JMP 00835F70 Prevents NI League Cup from loading

00835F9D JE 00835FC3 --> JMP 00835FC3 Prevents NI Charity Shield from loading

Changing ~60 lines of code might seem like a lot, but remember you only have to do this once to create a .patch file, which you can then use on any .68 database. In this example all you would have to do was remove two clubs from both Swiss divisions to have an up to date version of the league (along with renaming of the competitions/awards with the Names Editor).

Note that not every reference to Northern Ireland has been changed to Switzerland, and knowing when not to change a value comes down to the experience of playing the game. For example, we know that NI regens can appear at British clubs, so if you see a reference to Northern Ireland in player\_regen.cpp and it's surrounded by British countries, it's pretty obvious that Switzerland shouldn't be swapped in for it. It is essential that countries are swapped in award\_manager, discipline, hall\_of\_fame, key\_nation and transfer\_manager parts of the code, and much of the rest is straightforward (awards, the actual competitions' code, ruling body etc).

For leagues not in the database, the easiest solution is to use other unused competitions already in the database. The Hong Kong cups are good candidates as there are no teams to move around or competition histories to clear. Just get the competition's ID# from club\_comp.dat, then add clubs to the competition in the Tri Wasano editor (and change its continent and nationality there too).

\[/quote\]

[marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005)Youth Team Player**Posts:** 31**Joined:** Fri Nov 27, 2020 10:01 am**Has thanked:** [2 times](https://champman0102.net/app.php/thankslist/givens/2005/true)**Been thanked:** [6 times](https://champman0102.net/app.php/thankslist/givens/2005/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=7930\#p7930)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=7930 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=7930 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=7930#p7930 "Post") by **[marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005)** » Thu Dec 10, 2020 8:19 am

"For leagues not in the database, the easiest solution is to use other unused competitions already in the database"

TBH i didnt get that point, why not to create NEW competition as you wish in editor, save, and copy ID from .dat file?

i did that for several leagues and it works

[djole2mcloud](https://champman0102.net/memberlist.php?mode=viewprofile&u=5430)Decent Young Player**Posts:** 66**Joined:** Wed Dec 09, 2020 6:57 am**Has thanked:** [11 times](https://champman0102.net/app.php/thankslist/givens/5430/true)**Been thanked:** [38 times](https://champman0102.net/app.php/thankslist/givens/5430/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=7980\#p7980)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=7980 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=7980 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=7980#p7980 "Post") by **[djole2mcloud](https://champman0102.net/memberlist.php?mode=viewprofile&u=5430)** » Thu Dec 10, 2020 6:15 pm

Good solution marcovanbast...i also did that... I prefer old style of league patching, probably cause i do it like that more then 13 yrs...also, i always save files for every patch, all changes, so i can use them again.

for me, the thing i didn't fully understood is how to move competition from one country to other(drop menu), what is most interesting for me...saturn,jl andgio explained that few times, but i did't quite catch the point...i would like tutorial for this matter very much...

[clipeus](https://champman0102.net/memberlist.php?mode=viewprofile&u=408)Hot Prospect for the Future**Posts:** 192**Joined:** Wed Nov 25, 2020 7:15 am**Has thanked:** [74 times](https://champman0102.net/app.php/thankslist/givens/408/true)**Been thanked:** [28 times](https://champman0102.net/app.php/thankslist/givens/408/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=8026\#p8026)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=8026 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=8026 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=8026#p8026 "Post") by **[clipeus](https://champman0102.net/memberlist.php?mode=viewprofile&u=408)** » Fri Dec 11, 2020 1:04 pm

how can i identify the teams participating in the champions? I was thinking of replacing the champions of cm with the Italian Cup Serie C

[hodgy](https://champman0102.net/memberlist.php?mode=viewprofile&u=260)Hot Prospect for the Future**Posts:** 194**Joined:** Tue Nov 24, 2020 10:14 pm**Has thanked:** [110 times](https://champman0102.net/app.php/thankslist/givens/260/true)**Been thanked:** [60 times](https://champman0102.net/app.php/thankslist/givens/260/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=8235\#p8235)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=8235 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=8235 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=8235#p8235 "Post") by **[hodgy](https://champman0102.net/memberlist.php?mode=viewprofile&u=260)** » Fri Dec 11, 2020 8:45 pm

Has anyone found offsets relating to injuries?

[clipeus](https://champman0102.net/memberlist.php?mode=viewprofile&u=408)Hot Prospect for the Future**Posts:** 192**Joined:** Wed Nov 25, 2020 7:15 am**Has thanked:** [74 times](https://champman0102.net/app.php/thankslist/givens/408/true)**Been thanked:** [28 times](https://champman0102.net/app.php/thankslist/givens/408/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=8259\#p8259)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=8259 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=8259 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=8259#p8259 "Post") by **[clipeus](https://champman0102.net/memberlist.php?mode=viewprofile&u=408)** » Sat Dec 12, 2020 8:11 am

does anybody know the uefa coefficient for champions league?

0075F9CC \|. 68 24C99900 \|PUSH cm0102.0099C924 ; ASCII "UEFA Coefficients"

what does it means this offsets?

where can i find how to manage them?

[marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005)Youth Team Player**Posts:** 31**Joined:** Fri Nov 27, 2020 10:01 am**Has thanked:** [2 times](https://champman0102.net/app.php/thankslist/givens/2005/true)**Been thanked:** [6 times](https://champman0102.net/app.php/thankslist/givens/2005/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=8320\#p8320)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=8320 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=8320 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=8320#p8320 "Post") by **[marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005)** » Sat Dec 12, 2020 10:39 pm

How to change number of ntaional cup entrants?

i changed Danish Premier League 12 teams => 16 teams

but in cup there 12 teams from den\_prm

i trying search den\_prm offset in den\_cup section but there only cmp function and no 0c=12 values..

[John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338)Patch Team**Posts:** 326**Joined:** Wed Nov 25, 2020 12:26 am**Has thanked:** [175 times](https://champman0102.net/app.php/thankslist/givens/338/true)**Been thanked:** [169 times](https://champman0102.net/app.php/thankslist/givens/338/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=8327\#p8327)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=8327 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=8327 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=8327#p8327 "Post") by **[John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338)** » Sun Dec 13, 2020 12:11 am

> [clipeus](https://champman0102.net/memberlist.php?mode=viewprofile&u=408) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=8259#p8259) Sat Dec 12, 2020 8:11 am
> does anybody know the uefa coefficient for champions league?
>
> 0075F9CC \|. 68 24C99900 \|PUSH cm0102.0099C924 ; ASCII "UEFA Coefficients"
>
> what does it means this offsets?
>
> where can i find how to manage them?

That's probably just displaying that text to the screen.

I have no idea how to edit the values.

[John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338)Patch Team**Posts:** 326**Joined:** Wed Nov 25, 2020 12:26 am**Has thanked:** [175 times](https://champman0102.net/app.php/thankslist/givens/338/true)**Been thanked:** [169 times](https://champman0102.net/app.php/thankslist/givens/338/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=8328\#p8328)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=8328 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=8328 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=8328#p8328 "Post") by **[John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338)** » Sun Dec 13, 2020 12:13 am

> [marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=8320#p8320) Sat Dec 12, 2020 10:39 pm
> How to change number of ntaional cup entrants?
>
> i changed Danish Premier League 12 teams => 16 teams
>
> but in cup there 12 teams from den\_prm
>
> i trying search den\_prm offset in den\_cup section but there only cmp function and no 0c=12 values..

Is that within a loop? I can picture code that loops until a value is the number you want and keeps looping until it is - so maybe change the value and see what happens?

[marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005)Youth Team Player**Posts:** 31**Joined:** Fri Nov 27, 2020 10:01 am**Has thanked:** [2 times](https://champman0102.net/app.php/thankslist/givens/2005/true)**Been thanked:** [6 times](https://champman0102.net/app.php/thankslist/givens/2005/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=8355\#p8355)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=8355 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=8355 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=8355#p8355 "Post") by **[marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005)** » Sun Dec 13, 2020 3:09 pm

> [John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=8328#p8328) Sun Dec 13, 2020 12:13 am
>
> > [marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=8320#p8320) Sat Dec 12, 2020 10:39 pm
> > How to change number of ntaional cup entrants?
> >
> > i changed Danish Premier League 12 teams => 16 teams
> >
> > but in cup there 12 teams from den\_prm
> >
> > i trying search den\_prm offset in den\_cup section but there only cmp function and no 0c=12 values..
>
> Is that within a loop? I can picture code that loops until a value is the number you want and keeps looping until it is - so maybe change the value and see what happens?

but theres no 0c value around loop, so what value to change?

[clipeus](https://champman0102.net/memberlist.php?mode=viewprofile&u=408)Hot Prospect for the Future**Posts:** 192**Joined:** Wed Nov 25, 2020 7:15 am**Has thanked:** [74 times](https://champman0102.net/app.php/thankslist/givens/408/true)**Been thanked:** [28 times](https://champman0102.net/app.php/thankslist/givens/408/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=8375\#p8375)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=8375 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=8375 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=8375#p8375 "Post") by **[clipeus](https://champman0102.net/memberlist.php?mode=viewprofile&u=408)** » Sun Dec 13, 2020 7:10 pm

> [John Locke](https://champman0102.net/memberlist.php?mode=viewprofile&u=338) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=8327#p8327) Sun Dec 13, 2020 12:11 am
>
> > [clipeus](https://champman0102.net/memberlist.php?mode=viewprofile&u=408) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=8259#p8259) Sat Dec 12, 2020 8:11 am
> > does anybody know the uefa coefficient for champions league?
> >
> > 0075F9CC \|. 68 24C99900 \|PUSH cm0102.0099C924 ; ASCII "UEFA Coefficients"
> >
> > what does it means this offsets?
> >
> > where can i find how to manage them?
>
> That's probably just displaying that text to the screen.
>
> I have no idea how to edit the values.

it's really strange, from that line i don't go anywhere.. there's nothing related to that offset... ![:(](https://champman0102.net/images/smilies/icon_e_sad.gif)

[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)Hot Prospect for the Future**Posts:** 201**Joined:** Sun Nov 29, 2020 9:55 am**Has thanked:** [53 times](https://champman0102.net/app.php/thankslist/givens/3116/true)**Been thanked:** [59 times](https://champman0102.net/app.php/thankslist/givens/3116/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=8691\#p8691)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=8691 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=8691 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=8691#p8691 "Post") by **[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)** » Tue Dec 15, 2020 8:47 am

> [marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=7930#p7930) Thu Dec 10, 2020 8:19 am
> "For leagues not in the database, the easiest solution is to use other unused competitions already in the database"
>
> TBH i didnt get that point, why not to create NEW competition as you wish in editor, save, and copy ID from .dat file?
>
> i did that for several leagues and it works

Marcovanbast - how do you copy the ID numbers from the .dat file once you've added a new competition?

[marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005)Youth Team Player**Posts:** 31**Joined:** Fri Nov 27, 2020 10:01 am**Has thanked:** [2 times](https://champman0102.net/app.php/thankslist/givens/2005/true)**Been thanked:** [6 times](https://champman0102.net/app.php/thankslist/givens/2005/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=8693\#p8693)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=8693 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=8693 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=8693#p8693 "Post") by **[marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005)** » Tue Dec 15, 2020 9:42 am

> [Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=8691#p8691) Tue Dec 15, 2020 8:47 am
>
> > [marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=7930#p7930) Thu Dec 10, 2020 8:19 am
> > "For leagues not in the database, the easiest solution is to use other unused competitions already in the database"
> >
> > TBH i didnt get that point, why not to create NEW competition as you wish in editor, save, and copy ID from .dat file?
> >
> > i did that for several leagues and it works
>
> Marcovanbast - how do you copy the ID numbers from the .dat file once you've added a new competition?

same as IDs of existing comps.

1) create new comp

2) save

3) go to club\_comp.dat

4) find you new created comp (it 99% should be at the end of file)

5) 4 bytes left from **full name** (dont confuse with short name) - your id.

[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)Hot Prospect for the Future**Posts:** 201**Joined:** Sun Nov 29, 2020 9:55 am**Has thanked:** [53 times](https://champman0102.net/app.php/thankslist/givens/3116/true)**Been thanked:** [59 times](https://champman0102.net/app.php/thankslist/givens/3116/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=8708\#p8708)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=8708 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=8708 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=8708#p8708 "Post") by **[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)** » Tue Dec 15, 2020 12:29 pm

Thanks for that, have found the ID number location, much appreciated.

[Okocha26](https://champman0102.net/memberlist.php?mode=viewprofile&u=1793)Youth Team Player**Posts:** 38**Joined:** Thu Nov 26, 2020 9:04 pm**Has thanked:** [6 times](https://champman0102.net/app.php/thankslist/givens/1793/true)**Been thanked:** [13 times](https://champman0102.net/app.php/thankslist/givens/1793/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=9176\#p9176)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=9176 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=9176 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=9176#p9176 "Post") by **[Okocha26](https://champman0102.net/memberlist.php?mode=viewprofile&u=1793)** » Sat Dec 19, 2020 3:22 pm

> [marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=8320#p8320) Sat Dec 12, 2020 10:39 pm
> How to change number of ntaional cup entrants?
>
> i changed Danish Premier League 12 teams => 16 teams
>
> but in cup there 12 teams from den\_prm
>
> i trying search den\_prm offset in den\_cup section but there only cmp function and no 0c=12 values..

how did you changed teams 12 to 16?

which program did you use? editor doesnt work for new companies, is there anybody, who knows adding new club comp.?

[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)Hot Prospect for the Future**Posts:** 201**Joined:** Sun Nov 29, 2020 9:55 am**Has thanked:** [53 times](https://champman0102.net/app.php/thankslist/givens/3116/true)**Been thanked:** [59 times](https://champman0102.net/app.php/thankslist/givens/3116/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=9235\#p9235)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=9235 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=9235 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=9235#p9235 "Post") by **[Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116)** » Sun Dec 20, 2020 8:44 am

> [marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=8693#p8693) Tue Dec 15, 2020 9:42 am
>
> > [Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=8691#p8691) Tue Dec 15, 2020 8:47 am
> >
> > > [marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=7930#p7930) Thu Dec 10, 2020 8:19 am
> > > "For leagues not in the database, the easiest solution is to use other unused competitions already in the database"
> > >
> > > TBH i didnt get that point, why not to create NEW competition as you wish in editor, save, and copy ID from .dat file?
> > >
> > > i did that for several leagues and it works
> >
> > Marcovanbast - how do you copy the ID numbers from the .dat file once you've added a new competition?
>
> same as IDs of existing comps.
>
> 1) create new comp
>
> 2) save
>
> 3) go to club\_comp.dat
>
> 4) find you new created comp (it 99% should be at the end of file)
>
> 5) 4 bytes left from **full name** (dont confuse with short name) - your id.

Just FYI on this, not sure you've noticed. But the last competition listed on the club\_comp.dat file is Belgian Fourth Division D, Hex ID number 1B0

If you create a new competition this is given the ID number 1B1....which is the ID number for 'B' Internationals. Now in theory (and when you view the .dat file for national\_comp, each competition should be shifted down by 1 ID number every time you add a competition to the clubs list). BUT, I added about 8 new competitions (to file teams into) and when you start a new game the European Championships Qualifying Tournament has been renamed. B Internationals now show up. U21 Internationals disappear. Utter chaos. I used the Tri-Wasano editor rather than the official editor to create the new competitions, not sure if that may have been the cause.

[Okocha26](https://champman0102.net/memberlist.php?mode=viewprofile&u=1793)Youth Team Player**Posts:** 38**Joined:** Thu Nov 26, 2020 9:04 pm**Has thanked:** [6 times](https://champman0102.net/app.php/thankslist/givens/1793/true)**Been thanked:** [13 times](https://champman0102.net/app.php/thankslist/givens/1793/false)

### [Offsets](https://champman0102.net/viewtopic.php?p=9237\#p9237)

- [Quote](https://champman0102.net/posting.php?mode=quote&p=9237 "Reply with quote")
- - [Quote](https://champman0102.net/posting.php?mode=quote&p=9237 "Reply with quote")


[Post](https://champman0102.net/viewtopic.php?p=9237#p9237 "Post") by **[Okocha26](https://champman0102.net/memberlist.php?mode=viewprofile&u=1793)** » Sun Dec 20, 2020 10:01 am

> [marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=8693#p8693) Tue Dec 15, 2020 9:42 am
>
> > [Footballer](https://champman0102.net/memberlist.php?mode=viewprofile&u=3116) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=8691#p8691) Tue Dec 15, 2020 8:47 am
> >
> > > [marcovanbast](https://champman0102.net/memberlist.php?mode=viewprofile&u=2005) wrote: [View quoted post](https://champman0102.net/viewtopic.php?p=7930#p7930) Thu Dec 10, 2020 8:19 am
> > > "For leagues not in the database, the easiest solution is to use other unused competitions already in the database"
> > >
> > > TBH i didnt get that point, why not to create NEW competition as you wish in editor, save, and copy ID from .dat file?
> > >
> > > i did that for several leagues and it works
> >
> > Marcovanbast - how do you copy the ID numbers from the .dat file once you've added a new competition?
>
> same as IDs of existing comps.
>
> 1) create new comp
>
> 2) save
>
> 3) go to club\_comp.dat
>
> 4) find you new created comp (it 99% should be at the end of file)
>
> 5) 4 bytes left from **full name** (dont confuse with short name) - your id.

i used CM3PreEditor for changing teams 18 to 21. i controlled from official editor, it was ok. runned to game and the game installed. but there is a problem about teams. first 18 teams in Turkish Premier Leauge from 21 teams. rest 3 teams are in TPL teams list but they are not in leauge table. what should i do can u help me please?

[Post Reply](https://champman0102.net/posting.php?mode=reply&t=1540 "Post a reply")

- [Print view](https://champman0102.net/viewtopic.php?t=1540&start=25&view=print "Print view")

Display: All posts1 day7 days2 weeks1 month3 months6 months1 yearSort by: AuthorPost timeSubjectDirection: AscendingDescending

* * *

764 posts


- [Page **2** of **31**](https://champman0102.net/viewtopic.php?t=1540&start=25# "Click to jump to page…")










  - Jump to page:

- [Previous](https://champman0102.net/viewtopic.php?t=1540)
- [1](https://champman0102.net/viewtopic.php?t=1540)
- 2
- [3](https://champman0102.net/viewtopic.php?t=1540&start=50)
- [4](https://champman0102.net/viewtopic.php?t=1540&start=75)
- [5](https://champman0102.net/viewtopic.php?t=1540&start=100)
- …
- [31](https://champman0102.net/viewtopic.php?t=1540&start=750)
- [Next](https://champman0102.net/viewtopic.php?t=1540&start=50)

[Return to “Patches”](https://champman0102.net/viewforum.php?f=35)

Jump to

- [The Website](https://champman0102.net/viewforum.php?f=71)
- [↳   Announcements](https://champman0102.net/viewforum.php?f=2)
- [↳   New Signings](https://champman0102.net/viewforum.php?f=7)
- [↳   Awards](https://champman0102.net/viewforum.php?f=5)
- [↳   Hall of Fame](https://champman0102.net/viewforum.php?f=88)
- [↳   Awards](https://champman0102.net/viewforum.php?f=90)
- [↳   Members](https://champman0102.net/viewforum.php?f=91)
- [↳   Stories](https://champman0102.net/viewforum.php?f=8)
- [Downloads](https://champman0102.net/viewforum.php?f=54)
- [↳   Downloads](https://champman0102.net/viewforum.php?f=57)
- [↳   Background Packs](https://champman0102.net/viewforum.php?f=79)
- [↳   Colour Schemes](https://champman0102.net/viewforum.php?f=78)
- [↳   Commentary Files](https://champman0102.net/viewforum.php?f=82)
- [↳   Databases](https://champman0102.net/viewforum.php?f=73)
- [↳   Documentation](https://champman0102.net/viewforum.php?f=80)
- [↳   Fonts](https://champman0102.net/viewforum.php?f=74)
- [↳   Game](https://champman0102.net/viewforum.php?f=76)
- [↳   Menubars](https://champman0102.net/viewforum.php?f=75)
- [↳   Patches](https://champman0102.net/viewforum.php?f=72)
- [↳   Tactics](https://champman0102.net/viewforum.php?f=81)
- [↳   Tactic Packs](https://champman0102.net/viewforum.php?f=84)
- [↳   Tools](https://champman0102.net/viewforum.php?f=77)
- [Technical Support, Tutorials & FAQs](https://champman0102.net/viewforum.php?f=13)
- [↳   Technical Support, Tutorials & FAQs](https://champman0102.net/viewforum.php?f=43)
- [↳   Tutorials](https://champman0102.net/viewforum.php?f=85)
- [The Office](https://champman0102.net/viewforum.php?f=3)
- [↳   Scouting and Research](https://champman0102.net/viewforum.php?f=34)
- [↳   Africa](https://champman0102.net/viewforum.php?f=37)
- [↳   Asia](https://champman0102.net/viewforum.php?f=38)
- [↳   Europe](https://champman0102.net/viewforum.php?f=52)
- [↳   North, Central America & Caribbean](https://champman0102.net/viewforum.php?f=53)
- [↳   Oceania](https://champman0102.net/viewforum.php?f=39)
- [↳   South America](https://champman0102.net/viewforum.php?f=40)
- [↳   Free Players and Staff](https://champman0102.net/viewforum.php?f=42)
- [↳   Histories](https://champman0102.net/viewforum.php?f=48)
- [↳   Research](https://champman0102.net/viewforum.php?f=41)
- [Championship Managers Club](https://champman0102.net/viewforum.php?f=11)
- [↳   Data Updates](https://champman0102.net/viewforum.php?f=33)
- [↳   General](https://champman0102.net/viewforum.php?f=26)
- [↳   Graphics](https://champman0102.net/viewforum.php?f=36)
- [↳   Network Games](https://champman0102.net/viewforum.php?f=27)
- [↳   Official Challenges](https://champman0102.net/viewforum.php?f=28)
- [↳   Patches](https://champman0102.net/viewforum.php?f=35)
- [↳   Stories](https://champman0102.net/viewforum.php?f=29)
- [↳   Tactics](https://champman0102.net/viewforum.php?f=30)
- [↳   Talents, Tips and Training](https://champman0102.net/viewforum.php?f=31)
- [↳   Other Championship Managers](https://champman0102.net/viewforum.php?f=32)
- [CM 01/02 Interactive](https://champman0102.net/viewforum.php?f=10)
- [↳   Championship Managers League](https://champman0102.net/viewforum.php?f=20)
- [↳   CM Forums United](https://champman0102.net/viewforum.php?f=21)
- [↳   Dream Team League](https://champman0102.net/viewforum.php?f=22)
- [↳   Trillionaires Toys](https://champman0102.net/viewforum.php?f=25)
- [The Community](https://champman0102.net/viewforum.php?f=9)
- [↳   Football](https://champman0102.net/viewforum.php?f=14)
- [↳   Gaming](https://champman0102.net/viewforum.php?f=15)
- [↳   General Chat](https://champman0102.net/viewforum.php?f=16)
- [↳   Other Sports](https://champman0102.net/viewforum.php?f=17)
- [↳   Soccer Manager](https://champman0102.net/viewforum.php?f=86)
- [↳   TV & Films](https://champman0102.net/viewforum.php?f=19)
- [Archives](https://champman0102.net/viewforum.php?f=87)
- [↳   Archives](https://champman0102.net/viewforum.php?f=83)

Powered by [phpBB](https://www.phpbb.com/) ® Forum Software © phpBB Limited

[Privacy](https://champman0102.net/ucp.php?mode=privacy "Privacy")
\|
[Terms](https://champman0102.net/ucp.php?mode=terms "Terms")

---

