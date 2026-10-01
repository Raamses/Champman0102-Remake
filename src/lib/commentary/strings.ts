// @paths lib/commentary
import type { ChanceType, CommentaryLang, SetPieceKind } from './types';

/**
 * i18n-ready commentary strings. Keyed templates with {player} {team}
 * {minute} {opponent} {chanceType} slots. Each key holds a VARIETY ARRAY —
 * the seeded feature RNG picks the variant deterministically.
 * Languages: English + Hebrew (RTL-safe: no leading/trailing punctuation slots).
 */
export type StringKey =
  | 'goal' | 'goal.header' | 'goal.one-on-one' | 'goal.long-shot' | 'goal.cross' | 'goal.through-ball'
  | 'save' | 'save.header' | 'save.one-on-one' | 'save.long-shot' | 'save.cross' | 'save.through-ball'
  | 'miss' | 'miss.header' | 'miss.one-on-one' | 'miss.long-shot' | 'miss.cross' | 'miss.through-ball'
  | 'chance' | 'chance.cross' | 'chance.through-ball' | 'chance.header' | 'chance.long-shot' | 'chance.one-on-one'
  | 'assist'
  | 'yellow' | 'second-yellow' | 'red'
  | 'injury' | 'injury.recovers'
  | 'sub'
  | 'setpiece.corner' | 'setpiece.freeKick' | 'setpiece.throwIn'
  | 'setpiece.goal' | 'setpiece.save' | 'setpiece.miss'
  | 'kickoff' | 'full-time' | 'half-time';

type Varieties = string[];

export const STRINGS: Record<CommentaryLang, Record<StringKey, Varieties>> = {
  en: {
    'goal': ['⚽ GOAL! {player} scores for {team}!', '{player} finds the net! {team} lead the charge!'],
    'goal.header': ['⚽ GOAL! {player} rises highest and heads it home for {team}!'],
    'goal.one-on-one': ['⚽ GOAL! {player} rounds the keeper and slots it in for {team}!'],
    'goal.long-shot': ['⚽ GOAL! {player} lets fly from distance and it flies in for {team}!'],
    'goal.cross': ['⚽ GOAL! {player} meets the cross and finishes for {team}!'],
    'goal.through-ball': ['⚽ GOAL! {player} latches onto the through-ball and scores for {team}!'],
    'save': ['🧤 Save! {keeper} denies {player}!'],
    'save.header': ['🧤 Save! {keeper} palms away the header from {player}!'],
    'save.one-on-one': ['🧤 Huge save! {keeper} stands tall against {player}!'],
    'save.long-shot': ['🧤 {keeper} tips the long shot around the post!'],
    'save.cross': ['🧤 {keeper} claims the cross under pressure from {player}!'],
    'save.through-ball': ['🧤 {keeper} smothers {player}\u2019s through-ball effort!'],
    'miss': ['Miss by {player}.', '{player} drags it wide.'],
    'miss.header': ['{player} gets under the header and it sails over.'],
    'miss.one-on-one': ['{player} fires wide with just the keeper to beat!'],
    'miss.long-shot': ['{player}\u2019s long shot whistles past the post.'],
    'miss.cross': ['{player} can\u2019t connect with the cross.'],
    'miss.through-ball': ['{player} scuffs the through-ball chance wide.'],
    'chance': ['{player} carves out a chance for {team}...'],
    'chance.cross': ['{player} whips in a cross for {team}...'],
    'chance.through-ball': ['A threaded through-ball finds {player} ({team})...'],
    'chance.header': ['{player} climbs for the header ({team})...'],
    'chance.long-shot': ['{player} winds up from range ({team})...'],
    'chance.one-on-one': ['{player} is clean through ({team})...'],
    'assist': ['{player} laid it on a plate.'],
    'yellow': ['🟨 Booked: {player}.'],
    'second-yellow': ['🟨🟥 Second yellow — {player} is off!'],
    'red': ['🟥 SENT OFF! {player} sees red for {team}!'],
    'injury': ['🚑 {player} is down and needs treatment.'],
    'injury.recovers': ['{player} shakes it off and plays on.'],
    'sub': ['🔄 {team}: {playerIn} replaces {playerOut}.'],
    'setpiece.corner': ['Corner to {team} — {player} to take.'],
    'setpiece.freeKick': ['Free kick in a dangerous area — {player} stands over it ({team}).'],
    'setpiece.throwIn': ['Long throw incoming for {team}: {player}.'],
    'setpiece.goal': ['⚽ From the set piece, {player} scores for {team}!'],
    'setpiece.save': ['🧤 The set-piece effort is saved by {keeper}!'],
    'setpiece.miss': ['The set piece comes to nothing — {player} can\u2019t keep it down.'],
    'kickoff': ['We\u2019re underway: {home} vs {away}!'],
    'half-time': ['Half-time: {home} {homeGoals}-{awayGoals} {away}.'],
    'full-time': ['Full-time: {home} {homeGoals}-{awayGoals} {away}.'],
  },
  he: {
    'goal': ['⚽ שער! {player} כובש לזכות {team}!', '{player} מצליח לכבוש! {team} מתקדם!'],
    'goal.header': ['⚽ שער! {player} מתנשא גבוה וכובש בראש לזכות {team}!'],
    'goal.one-on-one': ['⚽ שער! {player} עוקף את השוער ודוחף פנימה עבור {team}!'],
    'goal.long-shot': ['⚽ שער! {player} יורה מרחוק והכדור נכנס לזכות {team}!'],
    'goal.cross': ['⚽ שער! {player} נוגע בהצלבה ומסיים עבור {team}!'],
    'goal.through-ball': ['⚽ שער! {player} מקבל כדור עומק וכובש לזכות {team}!'],
    'save': ['🧤 הצלה! {keeper} עוצר את {player}!'],
    'save.header': ['🧤 הצלה! {keeper} מרחיק את הנגיחה של {player}!'],
    'save.one-on-one': ['🧤 הצלה ענקית! {keeper} נשאר עומד מול {player}!'],
    'save.long-shot': ['🧤 {keeper} מרחיק לקרן את הבעיטה מרחוק!'],
    'save.cross': ['🧤 {keeper} אוסף את ההצלבה תחת הלחץ של {player}!'],
    'save.through-ball': ['🧤 {keeper} סוגר את המהלך של {player}!'],
    'miss': ['החמצה של {player}.', '{player} בועט לידיים.'],
    'miss.header': ['{player} מתחת לכדור — הנגיחה עוברת מעל.'],
    'miss.one-on-one': ['{player} בועט החוצה עם רק השוער בדרך!'],
    'miss.long-shot': ['הבעיטה הרחוקה של {player} חולפת על פס השער.'],
    'miss.cross': ['{player} לא מצליח להתחבר להצלבה.'],
    'miss.through-ball': ['{player} מפספס את הכדור רחוק.'],
    'chance': ['{player} מסתובב להזדמנות עבור {team}...'],
    'chance.cross': ['{player} מצליב פנימה עבור {team}...'],
    'chance.through-ball': ['כדור עומק מגיע אל {player} ({team})...'],
    'chance.header': ['{player} מטפס לנגיחה ({team})...'],
    'chance.long-shot': ['{player} יורה מרחוק ({team})...'],
    'chance.one-on-one': ['{player} יוצא לבד מול השוער ({team})...'],
    'assist': ['{player} בישל על מגש של כסף.'],
    'yellow': ['🟨 כרטיס צהוב: {player}.'],
    'second-yellow': ['🟨🟥 צהוב שני — {player} מורחק!'],
    'red': ['🟥 כרטיס אדום ל{player} מקבוצת {team}!'],
    'injury': ['🚑 {player} נופל וזקוק לטיפול.'],
    'injury.recovers': ['{player} מתאושש וממשיך לשחק.'],
    'sub': ['🔄 {team}: {playerIn} מחליף את {playerOut}.'],
    'setpiece.corner': ['קרן לזכות {team} — {player} לבצע.'],
    'setpiece.freeKick': ['בעיטה חופשית באזור מסוכן — {player} עומד מעל הכדור.'],
    'setpiece.throwIn': ['זריקה חוזרת ארוכה עבור {team}: {player}.'],
    'setpiece.goal': ['⚽ מהקבוצה הנייחת, {player} כובש לזכות {team}!'],
    'setpiece.save': ['🧤 הניסיון מהקבוצה הנייחת נעצר על ידי {keeper}!'],
    'setpiece.miss': ['הקבוצה הנייחת לא מניבה דבר — {player} לא מצליח לשמור על הכדור במסגרת.'],
    'kickoff': ['המשחק התחיל: {home} נגד {away}!'],
    'half-time': ['מחצית: {home} {homeGoals}-{awayGoals} {away}.'],
    'full-time': ['סיום: {home} {homeGoals}-{awayGoals} {away}.'],
  },
} as const;

/** Chance-type i18n name slots used inside chance templates (typed map guard) */
export const CHANCE_TYPE_LABELS: Record<CommentaryLang, Record<ChanceType, string>> = {
  en: { 'cross': 'cross', 'through-ball': 'through-ball', 'header': 'header', 'long-shot': 'long shot', 'one-on-one': 'one-on-one' },
  he: { 'cross': 'הצלבה', 'through-ball': 'כדור עומק', 'header': 'נגיחה', 'long-shot': 'בעיטה רחוקה', 'one-on-one': 'אחד-על-אחד' },
};

export const SET_PIECE_LABELS: Record<CommentaryLang, Record<SetPieceKind, string>> = {
  en: { 'corner': 'corner', 'freeKick': 'free kick', 'throwIn': 'throw-in' },
  he: { 'corner': 'קרן', 'freeKick': 'בעיטה חופשית', 'throwIn': 'זריקת חוץ' },
};
