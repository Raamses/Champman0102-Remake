// @paths lib/engine
import { RNG } from './rng';
import {
  MatchEvent,
  MatchEventType,
  MatchResult,
  TeamState,
  PlayerState,
  ChanceType,
} from './types';
import { applySetPieceResolution } from '../lib/tactics/setpieces';
import { substituteAI } from '../lib/tactics/substitutions';

export type Language = 'en' | 'he';

export interface CommentaryOptions {
  seed?: number;
  lang?: Language;
  homeTeam?: Partial<TeamState>;
  awayTeam?: Partial<TeamState>;
}

export interface CommentaryContext {
  lang?: Language;
  homeTeam?: Partial<TeamState>;
  awayTeam?: Partial<TeamState>;
}

export interface CommentaryEntry {
  minute: number;
  text: string;
  type: MatchEventType;
  team?: 'home' | 'away';
  playerId?: number;
  toString(): string;
}

type TemplateMap = Record<MatchEventType, string[]> & {
  goalByType?: Partial<Record<ChanceType, string[]>>;
  saveByType?: Partial<Record<ChanceType, string[]>>;
  missByType?: Partial<Record<ChanceType, string[]>>;
  chanceByType?: Partial<Record<ChanceType, string[]>>;
};

const TEMPLATES_EN: TemplateMap = {
  goal: [
    "{minute}' - GOAL! {player} finds the back of the net for {team}!",
    "{minute}' - GOAL! A wonderful strike by {player} puts {team} on the scoresheet!",
    "{minute}' - GOAL! {player} scores with a clinical finish!",
    "{minute}' - GOAL! {player} hammers it home for {team}!",
    "{minute}' - GOAL! Brilliant composure from {player} to slot it past {keeper}!",
  ],
  goalByType: {
    'header': [
      "{minute}' - GOAL! {player} rises highest to head the ball into the top corner!",
      "{minute}' - GOAL! A bullet header from {player} gives {keeper} no chance!",
      "{minute}' - GOAL! {player} powers a towering header into the back of the net!",
    ],
    'cross': [
      "{minute}' - GOAL! Dangerous cross into the box and {player} volleys it home!",
      "{minute}' - GOAL! Pinpoint cross met perfectly by {player} for {team}!",
      "{minute}' - GOAL! {player} connects with the whipped ball to score!",
    ],
    'through-ball': [
      "{minute}' - GOAL! {player} latches onto a defense-splitting through-ball and scores!",
      "{minute}' - GOAL! Splendid through-ball and an emphatic finish by {player}!",
      "{minute}' - GOAL! {player} bursts onto the through-ball and slips it past {keeper}!",
    ],
    'one-on-one': [
      "{minute}' - GOAL! {player} is clean through one-on-one and calmly slots past {keeper}!",
      "{minute}' - GOAL! {player} rounds {keeper} with poise and walks it into the net!",
      "{minute}' - GOAL! Ice-cool finish from {player} in the one-on-one!",
    ],
    'long-shot': [
      "{minute}' - GOAL! WHAT A SCREAMER! {player} hammers a thunderous strike from distance!",
      "{minute}' - GOAL! Sensational long-range effort from {player} beats {keeper} from 30 yards!",
      "{minute}' - GOAL! Out of nothing! {player} launches a rocket into the top corner!",
    ],
  },
  save: [
    "{minute}' - Great save by {keeper} to deny {player}!",
    "{minute}' - {keeper} makes a brilliant stop to keep it out!",
    "{minute}' - What a save! {keeper} tips the effort away for {opponent}!",
    "{minute}' - {player} strikes on target, but {keeper} reacts well to push it away.",
  ],
  saveByType: {
    'header': [
      "{minute}' - {keeper} pulls off an acrobatic save to tip {player}'s header over the bar!",
      "{minute}' - Point-blank header from {player}, but {keeper} somehow claws it away!",
    ],
    'cross': [
      "{minute}' - {keeper} bravely dives across the six-yard box to intercept {player}'s volley!",
      "{minute}' - {player} connects on the volley, but {keeper} gets two hands behind it.",
    ],
    'through-ball': [
      "{minute}' - {keeper} rushes off the line to smother {player}'s effort after the through-ball!",
      "{minute}' - Quick off the mark! {keeper} blocks {player}'s shot on the break.",
    ],
    'one-on-one': [
      "{minute}' - Huge save! {keeper} stands tall and denies {player} in the one-on-one!",
      "{minute}' - {player} is one-on-one, but {keeper} makes a heroic stop with outstretched legs!",
    ],
    'long-shot': [
      "{minute}' - {keeper} dives full stretch to tip {player}'s long-range blast around the post!",
      "{minute}' - Fierce strike from distance by {player}, safely parried away by {keeper}.",
    ],
  },
  miss: [
    "{minute}' - {player} shoots wide of the post!",
    "{minute}' - Close! {player} sends the effort just over the bar.",
    "{minute}' - {player} misses the target from a promising position.",
    "{minute}' - {player} drags the shot wide for {team}.",
  ],
  missByType: {
    'header': [
      "{minute}' - {player} gets up well, but steers the header inches wide of the upright!",
      "{minute}' - A free header for {player}, but it flies harmlessly over the crossbar.",
    ],
    'cross': [
      "{minute}' - {player} attacks the cross on the volley, but can't direct it on target!",
      "{minute}' - Cross flashed across goal, but {player} scuffs the connection wide.",
    ],
    'through-ball': [
      "{minute}' - {player} races onto the through-ball, but rushes the shot and fires wide!",
      "{minute}' - Splendid through-ball, but {player} drags the finish past the far post.",
    ],
    'one-on-one': [
      "{minute}' - What a miss! Clean through on goal, {player} puts it wide of the mark!",
      "{minute}' - {player} has only {keeper} to beat, but snatches at the shot and misses!",
    ],
    'long-shot': [
      "{minute}' - Speculative strike from distance by {player} sails high into the stands.",
      "{minute}' - {player} tries his luck from 25 yards out, but it curls wide.",
    ],
  },
  chance: [
    "{minute}' - {team} create a dangerous opening in the final third!",
    "{minute}' - Good attacking move by {player} for {team}.",
    "{minute}' - {team} carve open the defense with sharp interplay.",
    "{minute}' - Dangerous moment as {player} threatens the {opponent} defense.",
  ],
  chanceByType: {
    'header': [
      "{minute}' - Floating ball into the box, {player} prepares to contest in the air...",
    ],
    'cross': [
      "{minute}' - Whipped cross from wide into a crowded penalty area!",
    ],
    'through-ball': [
      "{minute}' - Clever through-ball sliced between the center-backs!",
    ],
    'one-on-one': [
      "{minute}' - Defense caught flat-footed! {player} is clean through on goal!",
    ],
    'long-shot': [
      "{minute}' - Space opens up outside the penalty area for {player}...",
    ],
  },
  assist: [
    "{minute}' - Fantastic vision from {player} to set up the goal!",
    "{minute}' - Brilliant assist by {player} to unlock the defense!",
    "{minute}' - Pinpoint delivery by {player} creates the scoring chance.",
  ],
  yellow: [
    "{minute}' - Yellow card: {player} is booked by the referee for a late challenge.",
    "{minute}' - {player} goes into the referee's notebook after a cynical foul.",
    "{minute}' - Caution shown to {player} for persistent infringement.",
  ],
  red: [
    "{minute}' - RED CARD! {player} is sent off for a reckless tackle!",
    "{minute}' - {player} receives a straight red card and is ordered off the pitch!",
    "{minute}' - Disastrous for {team}! {player} is shown the red card!",
  ],
  injury: [
    "{minute}' - Injury concern: {player} goes down and signals to the bench.",
    "{minute}' - Play stopped as {player} receives medical attention on the pitch.",
    "{minute}' - {player} looks to be in severe pain after a heavy collision.",
  ],
  sub: [
    "{minute}' - Substitution for {team}: {subIn} comes on to replace {subOut}.",
    "{minute}' - Tactical change for {team}: {subOut} makes way for {subIn}.",
    "{minute}' - Fresh legs for {team}: {subIn} enters the match, replacing {subOut}.",
  ],
  corner: [
    "{minute}' - Corner kick for {team}. {player} steps up to take it.",
    "{minute}' - {team} win a corner kick in a dangerous area.",
    "{minute}' - Out for a corner. {player} trots over to deliver.",
  ],
  freeKick: [
    "{minute}' - Dangerous free kick for {team} in shooting range. {player} over the ball.",
    "{minute}' - Free kick awarded to {team} in a promising position.",
    "{minute}' - Foul conceded! {player} stands over the dead ball for {team}.",
  ],
};

const TEMPLATES_HE: TemplateMap = {
  goal: [
    "{minute}' - שער! {player} מבקיע עבור {team}!",
    "{minute}' - שער! בעיטה נפלאה של {player} לרשת!",
    "{minute}' - שער! {player} מסיים בצורה מושלמת!",
    "{minute}' - שער! {player} מפציץ לרשת של {opponent}!",
    "{minute}' - שער! קור רוח מדהים של {player} שמכניע את {keeper}!",
  ],
  goalByType: {
    'header': [
      "{minute}' - שער! {player} עולה מעל כולם ונוגח פנימה לחיבורים!",
      "{minute}' - שער! נגיחה אדירה של {player} שלא משאירה ל-{keeper} שום סיכוי!",
      "{minute}' - שער! {player} מתרומם נפלא ונוגח בעוצמה לרשת!",
    ],
    'cross': [
      "{minute}' - שער! הגבהה מסוכנת לרחבה ו-{player} מהאוויר בועט פנימה!",
      "{minute}' - שער! כדור רוחב מושלם ו-{player} דוחק מקרוב לרשת!",
      "{minute}' - שער! {player} פוגש כדור רוחב חד וכובש עבור {team}!",
    ],
    'through-ball': [
      "{minute}' - שער! {player} מקבל כדור עומק נפלא וחותך את הרשת!",
      "{minute}' - שער! כדור עומק גאוני וסיומת מוחצת של {player}!",
      "{minute}' - שער! {player} דוהר לכדור העומק ומגלגל מעבר ל-{keeper}!",
    ],
    'one-on-one': [
      "{minute}' - שער! {player} מגיע לאחד-על-אחד ומגלגל בקור רוח מעבר ל-{keeper}!",
      "{minute}' - שער! {player} עובר את {keeper} ומגלגל פנימה לשער הריק!",
      "{minute}' - שער! סיומת קטלנית של {player} בעימות ישיר מול השוער!",
    ],
    'long-shot': [
      "{minute}' - שער! איזה שער אדיר! {player} משחרר פצצה מרחוק ישר לרשת!",
      "{minute}' - שער! בעיטה מדהימה מ-30 מטרים של {player} מכניעה את {keeper}!",
      "{minute}' - שער! איזה טיל! {player} יורה ממרחק היישר לחיבורי הקורות!",
    ],
  },
  save: [
    "{minute}' - הצלה גדולה של {keeper} שעוצר את {player}!",
    "{minute}' - {keeper} מזנק נפלא ומונע שער בטוח!",
    "{minute}' - איזו הצלה! {keeper} שולח יד והודף את הניסיון של {player}!",
    "{minute}' - {player} בועט למסגרת, אך {keeper} מגיב מצוין ומחלץ.",
  ],
  saveByType: {
    'header': [
      "{minute}' - זינוק מרהיב של {keeper} שמחלץ נגיחה מסוכנת של {player} מעל המשקוף!",
      "{minute}' - {player} נוגח מקרוב, אבל {keeper} באינסטינקט נדיר מונע שער!",
    ],
    'cross': [
      "{minute}' - {keeper} מזנק באומץ לתוך תיבת החמש ובולם בעיטה של {player} מהאוויר!",
      "{minute}' - {player} פוגש את ההגבהה, אך {keeper} נמצא במקום והודף בשתי ידיים.",
    ],
    'through-ball': [
      "{minute}' - {keeper} יוצא מהר משערו וסוגר את הפינה מול {player}!",
      "{minute}' - יציאה מהירה של {keeper} שמקדים את {player} ומונע סכנה.",
    ],
    'one-on-one': [
      "{minute}' - הצלת ענק! {keeper} עומד איתן ובולם את {player} באחד על אחד!",
      "{minute}' - {player} לבד מול {keeper}, אך השוער עוצר ברגלו!",
    ],
    'long-shot': [
      "{minute}' - {keeper} מתעופף והודף לקרן את הפצצה של {player} ממרחק!",
      "{minute}' - בעיטה חזקה מחוץ לרחבה של {player}, אך {keeper} קולט בבטחה.",
    ],
  },
  miss: [
    "{minute}' - {player} בועט מחוץ למסגרת!",
    "{minute}' - כמעט! הבעיטה של {player} חולפת מעל המשקוף.",
    "{minute}' - {player} מחמיץ ממצב מצוין.",
    "{minute}' - {player} בועט ליד הקורה עבור {team}.",
  ],
  missByType: {
    'header': [
      "{minute}' - {player} עולה טוב לנגיחה, אבל שולח את הכדור סנטימטרים ליד הקורה!",
      "{minute}' - נגיחה חופשית של {player} חולפת מעל המשקוף.",
    ],
    'cross': [
      "{minute}' - {player} מנסה להבקיע מהאוויר, אך הכדור לא פוגש את המסגרת!",
      "{minute}' - הגבהה מסוכנת, אך {player} לא מצליח לכוון לרשת.",
    ],
    'through-ball': [
      "{minute}' - {player} מקבל כדור עומק גדול, אך בועט בחיפזון החוצה!",
      "{minute}' - כדור עומק מצוין, אך {player} מפספס את המסגרת.",
    ],
    'one-on-one': [
      "{minute}' - החמצה בלתי נתפסת! {player} לבד מול השוער ובועט החוצה!",
      "{minute}' - {player} מול {keeper} בלבד, אך מפספס את המסגרת לחלוטין!",
    ],
    'long-shot': [
      "{minute}' - ניסיון בעיטה מרחוק של {player} עף גבוה ליציע.",
      "{minute}' - {player} מנסה את מזלו מ-25 מטרים, אך הכדור מסתובב החוצה.",
    ],
  },
  chance: [
    "{minute}' - {team} מייצרת הזדמנות מסוכנת בשליש האחרון!",
    "{minute}' - מהלך התקפי יפה של {player} עבור {team}.",
    "{minute}' - {team} חותכת את ההגנה במסירות מהירות.",
    "{minute}' - רגע מסוכן כש-{player} מאיים על שער היריבה.",
  ],
  chanceByType: {
    'header': [
      "{minute}' - כדור מוגבה לרחבה, {player} מתכונן למאבק אווירי...",
    ],
    'cross': [
      "{minute}' - כדור רוחב חד נשלח לרחבה עמוסה בשחקנים!",
    ],
    'through-ball': [
      "{minute}' - מסירת עומק חכמה מפלחת את קו ההגנה!",
    ],
    'one-on-one': [
      "{minute}' - ההגנה נתפסת לא מוכנה! {player} דוהר לבד מול השער!",
    ],
    'long-shot': [
      "{minute}' - שטח פנוי נפתח מחוץ לרחבה עבור {player}...",
    ],
  },
  assist: [
    "{minute}' - בישול נפלא של {player}!",
    "{minute}' - מסירה גאונית של {player} שפותחת את ההגנה!",
    "{minute}' - כדור מדויק של {player} מסדר שער קל.",
  ],
  yellow: [
    "{minute}' - כרטיס צהוב: {player} מוצהב על עבירה מאוחרת.",
    "{minute}' - השופט רושם את {player} בפנקס לאחר עבירה טקטית.",
    "{minute}' - אזהרה נשלפת ל-{player} על עבירה חוזרת.",
  ],
  red: [
    "{minute}' - כרטיס אדום! {player} מורחק מהמגרש על עבירה קשה!",
    "{minute}' - השופט שולף כרטיס אדום ישיר ל-{player}!",
    "{minute}' - מכה קשה ל-{team}! {player} מורחק בכרטיס אדום!",
  ],
  injury: [
    "{minute}' - חשש מפציעה: {player} נפגע ומסמן לספסל.",
    "{minute}' - המשחק נעצר כש-{player} מקבל טיפול רפואי על הדשא.",
    "{minute}' - {player} סובל מכאבים עזים בעקבות התנגשות חזקה.",
  ],
  sub: [
    "{minute}' - חילוף ב-{team}: {subIn} נכנס במקום {subOut}.",
    "{minute}' - שינוי טקטי ב-{team}: {subOut} מפנה מקום ל-{subIn}.",
    "{minute}' - רענון כוחות ב-{team}: {subIn} עולה לכר הדשא במקום {subOut}.",
  ],
  corner: [
    "{minute}' - בעיטת קרן לטובת {team}. {player} ניגש להגביה.",
    "{minute}' - {team} זוכה בבעיטת קרן באזור מסוכן.",
    "{minute}' - הכדור יוצא לקרן. {player} מתכונן להרמה.",
  ],
  freeKick: [
    "{minute}' - בעיטה חופשית מסוכנת לטובת {team} בטווח בעיטה. {player} ליד הכדור.",
    "{minute}' - עבירה ובעיטה חופשית עבור {team} בעמדה מבטיחה.",
    "{minute}' - שריקה לעבירה! {player} ניגש לבצע את הבעיטה החופשית עבור {team}.",
  ],
};

/**
 * CommentaryService — Generates live text commentary from match engine events.
 * Seeded and deterministic per seed. Supports English and Hebrew with rich variety.
 */
export class CommentaryService {
  private rng: RNG;
  private seed: number;
  private lang: Language;
  private homeTeam?: Partial<TeamState>;
  private awayTeam?: Partial<TeamState>;

  constructor(options: CommentaryOptions = {}) {
    this.seed = options.seed ?? 42;
    this.rng = new RNG(this.seed);
    this.lang = options.lang ?? 'en';
    this.homeTeam = options.homeTeam;
    this.awayTeam = options.awayTeam;
  }

  public setLanguage(lang: Language): void {
    this.lang = lang;
  }

  public getLanguage(): Language {
    return this.lang;
  }

  public setSeed(seed: number): void {
    this.seed = seed;
    this.rng = new RNG(seed);
  }

  public setTeams(homeTeam?: Partial<TeamState>, awayTeam?: Partial<TeamState>): void {
    this.homeTeam = homeTeam;
    this.awayTeam = awayTeam;
  }

  /**
   * Generate commentary string for a single MatchEvent.
   */
  public generate(event: MatchEvent, context?: CommentaryContext): string {
    return this.generateEntry(event, context).text;
  }

  /**
   * Alias for generate() matching render naming convention.
   */
  public render(event: MatchEvent, context?: CommentaryContext): string {
    return this.generate(event, context);
  }

  /**
   * Generate a structured CommentaryEntry for a single MatchEvent.
   */
  public generateEntry(event: MatchEvent, context?: CommentaryContext): CommentaryEntry {
    const lang = context?.lang ?? this.lang;
    const homeTeam = context?.homeTeam ?? this.homeTeam;
    const awayTeam = context?.awayTeam ?? this.awayTeam;

    const templates = this.getTemplatesForEvent(event, lang);
    const template = templates[this.rng.int(0, templates.length - 1)];

    const text = this.interpolate(template, event, { lang, homeTeam, awayTeam });

    return {
      minute: event.minute,
      text,
      type: event.type,
      team: event.team,
      playerId: event.playerId,
      toString() {
        return this.text;
      },
    };
  }

  /**
   * Generate commentary strings for an array/stream of MatchEvents.
   */
  public generateAll(events: MatchEvent[], context?: CommentaryContext): string[] {
    return events.map(e => this.generate(e, context));
  }

  /**
   * Generate structured CommentaryEntries for an array of MatchEvents.
   */
  public generateEntries(events: MatchEvent[], context?: CommentaryContext): CommentaryEntry[] {
    return events.map(e => this.generateEntry(e, context));
  }

  /**
   * Format all events from a MatchResult.
   */
  public formatMatch(result: MatchResult, context?: CommentaryContext): string[] {
    const ctx: CommentaryContext = {
      homeTeam: result.homeTeam,
      awayTeam: result.awayTeam,
      ...context,
    };
    return this.generateAll(result.events, ctx);
  }

  /**
   * Hook for set-pieces (corners, free kicks) using lib/tactics/setpieces.ts.
   */
  public formatSetPiece(
    type: 'corner' | 'freeKick' | 'throwIn',
    team: string,
    player: string,
    outcome: 'goal' | 'save' | 'miss',
    minute: number,
    lang: Language = this.lang
  ): string {
    if (lang === 'he') {
      const typeName = type === 'corner' ? 'קרן' : type === 'freeKick' ? 'בעיטה חופשית' : 'חוץ';
      if (outcome === 'goal') {
        return `${minute}' - ${player} ניגש לבצע ${typeName}... שער! כדור מושלם היישר אל הרשת!`;
      } else if (outcome === 'save') {
        return `${minute}' - ${player} מבצע ${typeName}, אך השוער מתעופף והודף!`;
      } else {
        return `${minute}' - ${player} לוקח את ה${typeName}, אך הכדור חומק ליד הקורה.`;
      }
    } else {
      const typeName = type === 'corner' ? 'corner' : type === 'freeKick' ? 'free kick' : 'throw-in';
      if (outcome === 'goal') {
        return `${minute}' - ${player} steps up for the ${typeName}... GOAL! An incredible finish into the net!`;
      } else if (outcome === 'save') {
        return `${minute}' - ${player} sends in the ${typeName}, but the goalkeeper makes a fantastic save!`;
      } else {
        return `${minute}' - ${player} delivers the ${typeName}, but it flies harmlessly off target.`;
      }
    }
  }

  /**
   * Resolve and comment a set piece in one step using applySetPieceResolution.
   */
  public resolveAndCommentSetPiece(
    minute: number,
    setPieceType: 'corner' | 'freeKick' | 'throwIn',
    team: TeamState,
    opponent: TeamState,
    side: 'home' | 'away'
  ): { event: MatchEvent; commentary: string; outcome: string } {
    const attackers = team.players.filter(p => p.position === 'ATT' || p.position === 'MID');
    const defenders = opponent.players.filter(p => p.position === 'DEF');
    const keeper = opponent.players.find(p => p.position === 'GK') || opponent.players[0];
    const taker = attackers[this.rng.int(0, attackers.length - 1)] || team.players[0];

    const outcome = applySetPieceResolution(
      taker.attributes,
      defenders.map(d => d.attributes),
      keeper.attributes,
      this.rng,
      setPieceType
    );

    const commentary = this.formatSetPiece(
      setPieceType,
      team.name,
      taker.name,
      outcome as 'goal' | 'save' | 'miss',
      minute
    );

    let eventType: MatchEventType = setPieceType === 'corner' ? 'corner' : 'freeKick';
    if (outcome === 'goal') eventType = 'goal';
    else if (outcome === 'save') eventType = 'save';
    else if (outcome === 'miss') eventType = 'miss';

    const event: MatchEvent = {
      minute,
      type: eventType,
      team: side,
      playerId: taker.id,
      playerName: taker.name,
      description: commentary,
    };

    return { event, commentary, outcome };
  }

  /**
   * Hook for substitutions using lib/tactics/substitutions.ts.
   */
  public formatSubstitution(
    team: string,
    subIn: string,
    subOut: string,
    minute: number,
    lang: Language = this.lang
  ): string {
    if (lang === 'he') {
      return `${minute}' - חילוף ב-${team}: ${subIn} נכנס במקום ${subOut}.`;
    }
    return `${minute}' - Substitution for ${team}: ${subIn} comes on to replace ${subOut}.`;
  }

  /**
   * Evaluate a substitution with substituteAI and return commentary if warranted.
   */
  public evaluateAndCommentSubstitution(
    minute: number,
    team: TeamState,
    opponentGoals: number,
    side: 'home' | 'away'
  ): { event: MatchEvent; commentary: string } | null {
    const sub = substituteAI(team, opponentGoals, minute);
    if (!sub) return null;

    const subIn = team.players[sub.subInIdx];
    const subOut = team.players[sub.subOutIdx];
    if (!subIn || !subOut) return null;

    const commentary = this.formatSubstitution(team.name, subIn.name, subOut.name, minute);
    const event: MatchEvent = {
      minute,
      type: 'sub',
      team: side,
      playerId: subIn.id,
      subInId: subIn.id,
      subOutId: subOut.id,
      playerName: subIn.name,
      subInName: subIn.name,
      subOutName: subOut.name,
      description: commentary,
    };

    return { event, commentary };
  }

  private getTemplatesForEvent(event: MatchEvent, lang: Language): string[] {
    const dict = lang === 'he' ? TEMPLATES_HE : TEMPLATES_EN;

    // Check for chance-type specific templates
    if (event.chanceType) {
      if (event.type === 'goal' && dict.goalByType?.[event.chanceType]) {
        return dict.goalByType[event.chanceType]!;
      }
      if (event.type === 'save' && dict.saveByType?.[event.chanceType]) {
        return dict.saveByType[event.chanceType]!;
      }
      if (event.type === 'miss' && dict.missByType?.[event.chanceType]) {
        return dict.missByType[event.chanceType]!;
      }
      if (event.type === 'chance' && dict.chanceByType?.[event.chanceType]) {
        return dict.chanceByType[event.chanceType]!;
      }
    }

    const templates = dict[event.type];
    if (templates && templates.length > 0) {
      return templates;
    }

    // Fallback if unexpected event type
    return [`${event.minute}' - ${event.description || event.type}`];
  }

  private interpolate(
    template: string,
    event: MatchEvent,
    context: { lang: Language; homeTeam?: Partial<TeamState>; awayTeam?: Partial<TeamState> }
  ): string {
    const { lang, homeTeam, awayTeam } = context;
    const isHome = event.team === 'home';
    const myTeam = isHome ? homeTeam : awayTeam;
    const oppTeam = isHome ? awayTeam : homeTeam;

    const defaultTeamName = isHome
      ? (lang === 'he' ? 'מארחת' : 'Home')
      : (lang === 'he' ? 'אורחת' : 'Away');
    const defaultOppName = isHome
      ? (lang === 'he' ? 'אורחת' : 'Away')
      : (lang === 'he' ? 'מארחת' : 'Home');

    const teamName = myTeam?.name || defaultTeamName;
    const oppName = oppTeam?.name || defaultOppName;

    let playerName = event.playerName;
    if (!playerName && event.playerId && myTeam?.players) {
      const p = myTeam.players.find(x => x.id === event.playerId);
      if (p) playerName = p.name;
    }
    if (!playerName) {
      playerName = lang === 'he' ? 'שחקן ההתקפה' : 'The attacker';
    }

    let keeperName: string | undefined;
    if (oppTeam?.players) {
      const gk = oppTeam.players.find(p => p.position === 'GK');
      if (gk) keeperName = gk.name;
    }
    if (!keeperName) {
      keeperName = lang === 'he' ? 'השוער' : 'The keeper';
    }

    let assistName = event.assistName;
    if (!assistName && event.assistId && myTeam?.players) {
      const a = myTeam.players.find(x => x.id === event.assistId);
      if (a) assistName = a.name;
    }
    if (!assistName) {
      assistName = lang === 'he' ? 'הקשר' : 'The playmaker';
    }

    let subInName = event.subInName;
    if (!subInName && event.subInId && myTeam?.players) {
      const p = myTeam.players.find(x => x.id === event.subInId);
      if (p) subInName = p.name;
    }
    if (!subInName) {
      subInName = lang === 'he' ? 'שחקן מחליף' : 'The substitute';
    }

    let subOutName = event.subOutName;
    if (!subOutName && event.subOutId && myTeam?.players) {
      const p = myTeam.players.find(x => x.id === event.subOutId);
      if (p) subOutName = p.name;
    }
    if (!subOutName) {
      subOutName = lang === 'he' ? 'השחקן המוחלף' : 'The player';
    }

    return template
      .replace(/\{minute\}/g, String(event.minute))
      .replace(/\{player\}/g, playerName)
      .replace(/\{shooter\}/g, playerName)
      .replace(/\{taker\}/g, playerName)
      .replace(/\{team\}/g, teamName)
      .replace(/\{opponent\}/g, oppName)
      .replace(/\{keeper\}/g, keeperName)
      .replace(/\{assist\}/g, assistName)
      .replace(/\{subIn\}/g, subInName)
      .replace(/\{subOut\}/g, subOutName);
  }
}
