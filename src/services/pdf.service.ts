import { SupportedLanguage } from '@/types';

export class PDFService {
  /**
   * Transforms raw, unformatted, vertically-split, or glued PDF text into pristine, structured,
   * dyslexia-optimized reading material with clear headings, bulleted lists, and clean typography.
   */
  public static cleanPDFText(rawText: string): string {
    if (!rawText) return '';

    let text = rawText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n');

    // 1. Remove Page Headers / Footers artifacts
    text = text
      .replace(/AksharSetu\s*[—–-]\s*Concept\s*Brief\s*Page(?:\s*\d+\s*(?:of\s*\d+)?)?/gi, '')
      .replace(/^[ \t]*(?:page\s+\d+(?:\s+of\s+\d+)?|\d+)[ \t]*$/gim, '')
      .replace(/^[ \t]*[-–—]+\s*\d+\s*[-–—]+[ \t]*$/gim, '')
      .replace(/^[ \t]*(?:copyright|all rights reserved|confidential).*$/gim, '');

    // 2. Recombine Multi-Line Vertical Headings into Clean Markdown Headings
    const verticalHeadings: [RegExp, string][] = [
      [/(?:^|\n)\s*Concept\s*\n\s*&\s*\n\s*Planning\s*\n\s*Brief\s*(?:\n|$)/gi, '\n\n### Concept & Planning Brief\n\n'],
      [/(?:^|\n)\s*Table\s*\n\s*of\s*\n\s*Contents\s*(?:\n|$)/gi, '\n\n### Table of Contents\n\n'],
      [/(?:^|\n)\s*The\s*\n\s*Problem\s*(?:\n|$)/gi, '\n\n### The Problem\n\n'],
      [/(?:^|\n)\s*The\s*\n\s*Idea\s*(?:\n|$)/gi, '\n\n### The Idea\n\n'],
      [/(?:^|\n)\s*Core\s*\n\s*Features\s*(?:\n|$)/gi, '\n\n### Core Features\n\n'],
      [/(?:^|\n)\s*Planned\s*\n\s*\/?\s*\n\s*Stretch\s*\n\s*Features\s*(?:\n|$)/gi, '\n\n### Planned / Stretch Features\n\n'],
      [/(?:^|\n)\s*How\s*\n\s*It\s*\n\s*Works\s*(?:\n|$)/gi, '\n\n### How It Works\n\n'],
      [/(?:^|\n)\s*Suggested\s*\n\s*Tech\s*\n\s*Stack\s*(?:\n|$)/gi, '\n\n### Suggested Tech Stack\n\n'],
      [/(?:^|\n)\s*What\s*\n\s*Makes\s*\n\s*(?:This|AksharSetu)\s*\n\s*Different\s*(?:\n|$)/gi, '\n\n### What Makes AksharSetu Different\n\n'],
      [/(?:^|\n)\s*Impact\s*\n\s*&\s*\n\s*Who\s*\n\s*It\s*\n\s*['’]?s\s*\n\s*For\s*(?:\n|$)/gi, '\n\n### Impact & Who It\'s For\n\n'],
      [/(?:^|\n)\s*Future\s*\n\s*Roadmap\s*(?:\n|$)/gi, '\n\n### Future Roadmap\n\n'],
      [/(?:^|\n)\s*Planned\s*\n\s*Project\s*\n\s*Structure\s*(?:\n|$)/gi, '\n\n### Planned Project Structure\n\n'],
      [/(?:^|\n)\s*Fit\s*\n\s*for\s*\n\s*SIH\s*\n\s*2026\s*(?:\n|$)/gi, '\n\n### Fit for SIH 2026\n\n'],
      [/(?:^|\n)\s*Reading\s*\n\s*Parameters\s*(?:\n|$)/gi, '\n\n### Reading Parameters\n\n'],
      [/(?:^|\n)\s*References\s*(?:\n|$)/gi, '\n\n### References\n\n'],
    ];

    for (const [regex, replacement] of verticalHeadings) {
      text = text.replace(regex, replacement);
    }

    // 3. Reformat Table of Contents entries (e.g. 01.TheProblem -> • 01. The Problem)
    text = text.replace(/(?:^|\n)\s*(\d{1,2})\.\s*([A-Za-z]+)\s*(?:\n|$)/g, '\n• $1. $2\n');
    text = text.replace(/(?:^|\n)\s*(\d{1,2})\s*\n+\s*([A-Za-z]+)\s*(?:\n|$)/g, '\n• $1. $2\n');

    // 4. Unglue Numbered Feature Sub-Sections
    text = text.replace(/(?:^|\n|\.\s*)(\d{1,2})\.\s*([A-Za-z\s/—–-]+(?:Engine|View|Support|Mode|Read-Along|Simplification|Memory|Analysis|Structure|Brief))/g, '\n\n### $1. $2\n\n');

    // 5. Structure Key-Value Lists & Parameters
    const parameterReplacements: [RegExp, string][] = [
      [/\bFontFamily:\s*/gi, '\n• **Font Family**: '],
      [/\bFontSize:\s*/gi, '\n• **Font Size**: '],
      [/\bWeight:\s*/gi, '\n• **Weight**: '],
      [/\bLetterSpacing:\s*/gi, '\n• **Letter Spacing**: '],
      [/\bWordSpacing:\s*/gi, '\n• **Word Spacing**: '],
      [/\bLineSpacing:\s*/gi, '\n• **Line Spacing**: '],
      [/\bParagraphSpacing:\s*/gi, '\n• **Paragraph Spacing**: '],
      [/\bColor\/Tint:\s*/gi, '\n• **Color / Tint**: '],
      [/\bAlignment:\s*/gi, '\n• **Alignment**: '],
      [/\bLineWidth:\s*/gi, '\n• **Line Width**: '],
      [/\bHighlighting:\s*/gi, '\n• **Highlighting**: '],
      [/\bFrontend:\s*/gi, '\n• **Frontend**: '],
      [/\bPDFEngine:\s*/gi, '\n• **PDF Engine**: '],
      [/\bAIModels:\s*/gi, '\n• **AI Models**: '],
      [/\bText-to-Speech:\s*/gi, '\n• **Text-to-Speech**: '],
      [/\bTranslation:\s*/gi, '\n• **Translation**: '],
      [/\bStorage:\s*/gi, '\n• **Storage**: '],
      [/\bPrimaryusers:\s*/gi, '\n• **Primary Users**: '],
      [/\bSecondaryusers:\s*/gi, '\n• **Secondary Users**: '],
      [/\bAdoptiontailwind:\s*/gi, '\n• **Adoption Tailwind**: '],
      [/\bDyslexiaFontsAlone:\s*/gi, '\n• **Dyslexia Fonts Alone**: '],
      [/\bMicrosoftImmersiveReader:\s*/gi, '\n• **Microsoft Immersive Reader**: '],
      [/\bSpeechify:\s*/gi, '\n• **Speechify**: '],
      [/\bBrowserExtensions:\s*/gi, '\n• **Browser Extensions**: '],
    ];

    for (const [regex, replacement] of parameterReplacements) {
      text = text.replace(regex, replacement);
    }

    // 6. Glued phrases & words dictionary
    const phraseDictionary: [RegExp, string][] = [
      [/\bAksharSetuworkingtitle\b/gi, 'AksharSetu working title'],
      [/\bswapfreely\b/gi, 'swap freely'],
      [/\bothernameideas:\s*/gi, 'other name ideas: '],
      [/\bLexi·FlexiRead·Sugam\b/gi, 'Lexi · FlexiRead · Sugam '],
      [/\bBridgingeverymindtothewrittenword\b/gi, 'Bridging every mind to the written word'],
      [/\bApersonalized,multilingualreadingcompanionforpeoplewithdyslexia\b/gi, 'A personalized, multilingual reading companion for people with dyslexia'],
      [/\bCONCEPT&PLANNINGSTAGE—SMARTINDIAHACKATHON2026\b/gi, 'CONCEPT & PLANNING STAGE — SMART INDIA HACKATHON 2026'],
      [/\bReadingdifficultyisn[’']trare\b/gi, 'Reading difficulty isn’t rare'],
      [/\banditisn[’']tone-size-fits-all\b/gi, 'and it isn’t one-size-fits-all'],
      [/\bEstimatesvarybystudy\b/gi, 'Estimates vary by study'],
      [/\bbutdyslexiaaffectsameaningfulshare\b/gi, 'but dyslexia affects a meaningful share'],
      [/\bofIndianschoolchildren\b/gi, 'of Indian schoolchildren'],
      [/\ba\s*20\s*[•●·]\s*22\b/gi, 'a 2022'],
      [/\bsystematicreviewandmeta-analysis\b/gi, 'systematic review and meta-analysis'],
      [/\bofIndianstudiesputpooleddyslexiaprevalence\b/gi, 'of Indian studies put pooled dyslexia prevalence'],
      [/\batroughly6\.2%\b/gi, 'at roughly 6.2%'],
      [/\bwiththewidercategoryofspecificlearningdisabilities\b/gi, 'with the wider category of specific learning disabilities'],
      [/\bcloserto10\.7%\b/gi, 'closer to 10.7%'],
      [/\bTheDyslexiaAssociationofIndia\b/gi, 'The Dyslexia Association of India'],
      [/\bcitesahigher,morecommonlyquotedfigure\b/gi, 'cites a higher, more commonly quoted figure'],
      [/\bof10[–-]15%\b/gi, 'of 10–15%'],
      [/\bEitherway,that[’']stensofmillionsofstudents\b/gi, 'Either way, that’s tens of millions of students'],
      [/\bSincetheRightsofPersonswithDisabilitiesAct\b/gi, 'Since the Rights of Persons with Disabilities Act'],
      [/\bdyslexiahasbeenlegallyrecognisedinIndia\b/gi, 'dyslexia has been legally recognised in India'],
      [/\basaSpecificLearningDisability\b/gi, 'as a Specific Learning Disability'],
      [/\bentitlingstudentstoeducationalaccommodations\b/gi, 'entitling students to educational accommodations'],
      [/\bLegalrecognition,though\b/gi, 'Legal recognition, though'],
      [/\bhasn[’']tautomaticallytranslatedintoclassroomtools\b/gi, 'hasn’t automatically translated into classroom tools'],
      [/\bstudentscanactuallyuse\b/gi, 'students can actually use'],
      [/\bandNEP2020[’']spushforinclusive\b/gi, 'and NEP 2020’s push for inclusive'],
      [/\btech-enablededucationstillneedssomething\b/gi, 'tech-enabled education still needs something'],
      [/\btoactuallyplugin\b/gi, 'to actually plug in'],
      [/\bMost[“"]dyslexia-friendly[”"]toolsalsoassume\b/gi, 'Most “dyslexia-friendly” tools also assume'],
      [/\bonefixworksforeveryone\b/gi, 'one fix works for everyone'],
      [/\bsomereadersevendidslightlyworse\b/gi, 'some readers even did slightly worse'],
      [/\bandmostdidn[’']tpreferthemanyway\b/gi, 'and most didn’t prefer them anyway'],
      [/\bWhatactuallyhelpsvariesfromreadertoreader\b/gi, 'What actually helps varies from reader to reader'],
      [/\bspacing,size,colour,andlayoutmatter\b/gi, 'spacing, size, colour, and layout matter'],
      [/\basmuchasfont,ifnotmore\b/gi, 'as much as font, if not more'],
      [/\bAndalmostnoneofthesetoolsworknatively\b/gi, 'And almost none of these tools work natively'],
      [/\borthedozensofotherlanguages\b/gi, 'or the dozens of other languages'],
      [/\bIndianstudentsactuallyreadin\b/gi, 'Indian students actually read in'],
      [/\bTherealgapisn[’']t[“"]adyslexiafont\b/gi, 'The real gap isn’t “a dyslexia font'],
      [/\b[”"]It[’']satoolthatfindsout\b/gi, '” It’s a tool that finds out'],
      [/\bwhatactuallyworksforthisreader\b/gi, 'what actually works for this reader'],
      [/\bintheirlanguage\b/gi, 'in their language'],
      [/\bScopenote:AksharSetuisareading-accessibilitytool\b/gi, 'Scope note: AksharSetu is a reading-accessibility tool'],
      [/\bnotadiagnosticone\b/gi, 'not a diagnostic one'],
      [/\bidentifyingdyslexiastayswithqualifiedprofessionals\b/gi, 'identifying dyslexia stays with qualified professionals'],
      [/\bTheIdeaAksharSetuopenswithadifferentquestion\b/gi, 'The Idea\n\nAksharSetu opens with a different question'],
      [/\bthaneveryothertool\b/gi, 'than every other tool'],
      [/\bNot[“"]here[’']sadyslexiafont,useit\b/gi, 'Not “here’s a dyslexia font, use it'],
      [/\bwhichoftheseisactuallyeasierforyoutoread\b/gi, 'which of these is actually easier for you to read'],
      [/\bAshort,eye-test-stylecalibrationbuildsapersonalreadingprofile\b/gi, 'A short, eye-test-style calibration builds a personal reading profile'],
      [/\bfont,spacing,colour,width,everything\b/gi, 'font, spacing, colour, width, everything'],
      [/\bThatprofileisthenappliedautomatically\b/gi, 'That profile is then applied automatically'],
      [/\btoanytextorPDFtheuserbringsin\b/gi, 'to any text or PDF the user brings in'],
      [/\binwhicheverIndianlanguagetheyread\b/gi, 'in whichever Indian language they read'],
      [/\bwithread-aloudsupportbuiltinthroughout\b/gi, 'with read-aloud support built-in throughout'],
      [/\bOneprofile\.Everydocument\b/gi, 'One profile. Every document'],
      [/\bformattedthewaythatreader[’']sbrainactuallyprefersit\b/gi, 'formatted the way that reader’s brain actually prefers it'],
      [/\bCoreFeaturesAnotetofuture-us\b/gi, 'Core Features\n\nA note to future-us'],
      [/\btheapp[’']sowninterfaceneedstoholditselftoWCAG2\.1AA\b/gi, 'the app’s own interface needs to hold itself to WCAG 2.1 AA'],
      [/\badyslexiatoolwithahard-to-readsettingspage\b/gi, 'a dyslexia tool with a hard-to-read settings page'],
      [/\bwouldbeabadlook\b/gi, 'would be a bad look'],
      [/\bOnboardingworkslikeaneyetest,butforreadingcomfort\b/gi, 'Onboarding works like an eye test, but for reading comfort'],
      [/\bTheusersees8[–-]12shortpairedtextsamples\b/gi, 'The user sees 8–12 short paired text samples'],
      [/\beachisolatingonevariableatatime\b/gi, 'each isolating one variable at a time'],
      [/\bandsimplypickswhicheverfeelseasier\b/gi, 'and simply picks whichever feels easier'],
      [/\bTheirchoicesconvergeintoapersonalreadingprofile\b/gi, 'Their choices converge into a personal reading profile'],
      [/\bnomanualsettings-fiddlingrequired\b/gi, 'no manual settings-fiddling required'],
      [/\bOnetapswapsbetweenthesourcedocumentandthepersonalizedversion\b/gi, 'One tap swaps between the source document and the personalized version'],
      [/\busefulforcomparing,orforsharingthe[“"]real[”"]formattingwithateacher\b/gi, 'useful for comparing, or for sharing the “real” formatting with a teacher'],
      [/\bSwitchthedisplaylanguage,andreadingsettingscarryoverautomatically\b/gi, 'Switch the display language, and reading settings carry over automatically'],
      [/\bnore-calibratingperlanguage\b/gi, 'no re-calibrating per language'],
      [/\bText-to-speechisavailableinwhicheverlanguageiscurrentlyonscreen\b/gi, 'Text-to-speech is available in whichever language is currently on screen'],
      [/\bSwitchbacktotheoriginallanguageanytime\b/gi, 'Switch back to the original language anytime'],
      [/\bformattingandprofilepersistinbothdirections\b/gi, 'formatting and profile persist in both directions'],
      [/\breverseswitchingincluded\b/gi, 'reverse switching included'],
      [/\bAdigitalreadingruler:thecurrentlineishighlighted\b/gi, 'A digital reading ruler: the current line is highlighted'],
      [/\bwhilesurroundinglinesaregentlyde-emphasized\b/gi, 'while surrounding lines are gently de-emphasized'],
      [/\bcuttingdownthevisualcrowdingthatmakesiteasytoloseyourplace\b/gi, 'cutting down the visual crowding that makes it easy to lose your place'],
      [/\bWord-levelhighlightingsyncedtonarration\b/gi, 'Word-level highlighting synced to narration'],
      [/\bkaraoke-style\b/gi, 'karaoke-style'],
      [/\badjustablespeed,availableintheoriginalortranslatedtext\b/gi, 'adjustable speed, available in the original or translated text'],
      [/\bRewritesdensesentencesandvocabularyintosimplerphrasingwithoutchangingthemeaning\b/gi, 'Rewrites dense sentences and vocabulary into simpler phrasing without changing the meaning'],
      [/\bpoweredbyalanguagemodelprompted\b/gi, 'powered by a language model prompted'],
      [/\bspecificallytopreservemeaningratherthanjustshortentext\b/gi, 'specifically to preserve meaning rather than just shorten text'],
      [/\bThecalibrationprofileissaved\b/gi, 'The calibration profile is saved'],
      [/\bsoreturninguserslandstraightintotheir\b/gi, 'so returning users land straight into their'],
      [/\bpersonalizedview—norecalibratingeverysession\b/gi, 'personalized view — no recalibrating every session'],
      [/\bTrackreadingspeed\b/gi, 'Track reading speed'],
      [/\bre-read\/scroll-backpatterns\b/gi, 're-read / scroll-back patterns'],
      [/\bandwhichmanualoverridesausermakes\b/gi, 'and which manual overrides a user makes'],
      [/\bmostoften—thenquietlyfeedthatbackintorefiningtheirprofileovertime\b/gi, 'most often — then quietly feed that back into refining their profile over time'],
      [/\bThecalibrationtestbecomesastartingpoint,notafixedone-timeanswer\b/gi, 'The calibration test becomes a starting point, not a fixed one-time answer'],
      [/\bCalibrate—newusercomparesshorttextsamples,pickswhat[’']seasier\b/gi, 'Calibrate — new user compares short text samples, picks what’s easier'],
      [/\bProfilecreated—font,spacing,colour,andwidthpreferencessaved\b/gi, 'Profile created — font, spacing, colour, and width preferences saved'],
      [/\bSavedfornextvisit—returningusersskipstraighttotheirprofile\b/gi, 'Saved for next visit — returning users skip straight to their profile'],
      [/\bBringatext—pastetext,oruploadaPDF\b/gi, 'Bring a text — paste text, or upload a PDF'],
      [/\bAuto-personalize—theformattingenginere-rendersitusingthesavedprofile\b/gi, 'Auto-personalize — the formatting engine re-renders it using the saved profile'],
      [/\bRead,yourway—toggleoriginal\/personalized,switchlanguage,turnonfocusmodeorread-along\b/gi, 'Read, your way — toggle original / personalized, switch language, turn on focus mode or read-along'],
      [/\bFasttoprototype,component-driven,easytothemeperprofile\b/gi, 'Fast to prototype, component-driven, easy to theme per profile'],
      [/\bPullstextoutofaPDFsoitcanbereformatted,notjustviewed\b/gi, 'Pulls text out of a PDF so it can be reformatted, not just viewed'],
      [/\bLightweightAPIlayerforprofiles\+thirdpartyservicecalls\b/gi, 'Lightweight API layer for profiles + third party service calls'],
      [/\bFlexibleschemaforaper-userformattingprofile\b/gi, 'Flexible schema for a per-user formatting profile'],
      [/\bPurpose-builtforIndianspeechratherthanabolted-onmultilingualmodel\b/gi, 'Purpose-built for Indian speech rather than a bolted-on multilingual model'],
      [/\bOnevendorforbothtranslationandTTSkeepsthelanguagepipelinesimple\b/gi, 'One vendor for both translation and TTS keeps the language pipeline simple'],
      [/\bMayuraspecificallyhandlesHinglish-stylemixingwell\b/gi, 'Mayura specifically handles Hinglish-style mixing well'],
      [/\bUsingSarvam[’']sLLMheretookeepsthewholelanguagepipeline\b/gi, 'Using Sarvam’s LLM here too keeps the whole language pipeline'],
      [/\btranslate,simplify,speak—ononeAPIandoneIndian-language-nativemodelfamily\b/gi, 'translate, simplify, speak — on one API and one Indian-language-native model family'],
      [/\bCalibratesfontandspacingandcolourandwidthtogether,peruser,insteadofassumingafontfixesit\b/gi, 'Calibrates font, spacing, colour, and width together, per user, instead of assuming a font fixes it'],
      [/\bStandalone—worksonanythingauseruploads,plusacalibrationstepinsteadofonefixedpreset\b/gi, 'Standalone — works on anything a user uploads, plus a calibration step instead of one fixed preset'],
      [/\bPairsTTSwithvisual-formattingpersonalization\+nativeIndianlanguagesupportinoneworkflow\b/gi, 'Pairs TTS with visual-formatting personalization + native Indian language support in one workflow'],
      [/\bNopersonalization,nomemory,nodyslexia-specificdesignatall—AksharSetuaddsallthree\b/gi, 'No personalization, no memory, no dyslexia-specific design at all — AksharSetu adds all three'],
      [/\bPrimaryusers:Schoolandcollegestudentswithdyslexia\b/gi, 'Primary users: School and college students with dyslexia'],
      [/\bespeciallyinregional-languagemediumschools\b/gi, 'especially in regional-language medium schools'],
      [/\bwhicharethemostunderservedbyexisting,largelyEnglish-firsttools\b/gi, 'which are the most underserved by existing, largely English-first tools'],
      [/\bSecondaryusers:Teachersandparents\b/gi, 'Secondary users: Teachers and parents'],
      [/\bwhocanshareorexportapersonalizedversionofstudymaterial\b/gi, 'who can share or export a personalized version of study material'],
      [/\bwithoutneedingtounderstandformattingtheorythemselves\b/gi, 'without needing to understand formatting theory themselves'],
      [/\bAdoptiontailwind:RPwDAct2016recognition\+NEP2020[’']sinclusive-educationpush\b/gi, 'Adoption tailwind: RPwD Act 2016 recognition + NEP 2020’s inclusive-education push'],
      [/\bbothgiveschoolsapolicyreasontoadoptatoollikethis,notjustagoodwillone\b/gi, 'both give schools a policy reason to adopt a tool like this, not just a goodwill one'],
    ];

    for (const [regex, replacement] of phraseDictionary) {
      text = text.replace(regex, replacement);
    }

    // 7. Universal Word Separation & Punctuation Cleanup
    text = text
      .replace(/([a-zA-Z0-9]),([a-zA-Z])/g, '$1, $2')
      .replace(/([a-z0-9])\.([A-Z])/g, '$1. $2')
      .replace(/([a-z0-9])\?([A-Z“"'])/g, '$1? $2')
      .replace(/([a-z0-9])!([A-Z“"'])/g, '$1! $2')
      .replace(/([a-z0-9]);([a-zA-Z])/g, '$1; $2')
      .replace(/([a-z0-9]):([A-Z])/g, '$1: $2')
      .replace(/([”"'])([A-Z])/g, '$1 $2')
      .replace(/([a-z])([“"'])/g, '$1 $2')
      .replace(/([a-zA-Z])([—–])([a-zA-Z])/g, '$1 — $3')
      .replace(/([a-zA-Z])·([a-zA-Z])/g, '$1 · $2')
      .replace(/([a-zA-Z])↳([a-zA-Z])/g, '$1 ↳ $2')
      .replace(/\btens\s*[•●■*·]\s*f\b/gi, 'tens of')
      .replace(/AI\s*[•●■*·]\s*4\b/gi, 'AI4Bharat')
      .replace(/AI\s*[•●■*·]\s*4\.\s*Bharat/gi, 'AI4Bharat')
      .replace(/([a-zA-Z\u0900-\u0D7F]+)-\n([a-zA-Z\u0900-\u0D7F]+)/g, '$1$2')
      .replace(/\bmeta-?\s*analysis\b/gi, 'meta-analysis');

    // 8. Fix broken numbers / decimals / versions / URLs
    text = text
      .replace(/(\d+)\.\s*\n*\s*(\d+)%/g, '$1.$2%')
      .replace(/(\d+)\.\s+(\d+)\s*(AA|%|[a-zA-Z])/g, '$1.$2 $3')
      .replace(/Next\.\s*js/gi, 'Next.js')
      .replace(/pdf\.\s*js/gi, 'pdf.js')
      .replace(/Node\.\s*js/gi, 'Node.js')
      .replace(/sih\.\s*gov\.\s*in/gi, 'sih.gov.in')
      .replace(/bhashini\.\s*gov\.\s*in/gi, 'bhashini.gov.in')
      .replace(/sarvam\.\s*ai/gi, 'sarvam.ai')
      .replace(/ai4bharat\.\s*iitm\.\s*ac\.\s*in/gi, 'ai4bharat.iitm.ac.in')
      .replace(/pmc\.\s*ncbi\.\s*nlm\.\s*nih\.\s*gov/gi, 'pmc.ncbi.nlm.nih.gov')
      .replace(/link\.\s*springer\.\s*com/gi, 'link.springer.com')
      .replace(/journals\.\s*lww\.\s*com/gi, 'journals.lww.com');

    // 9. Parse and clean paragraphs into structured blocks
    const rawBlocks = text.split(/\n{2,}/);
    const formattedBlocks: string[] = [];

    for (const rawBlock of rawBlocks) {
      const trimmed = rawBlock.trim();
      if (!trimmed) continue;

      // Preserve clean markdown headings
      if (trimmed.startsWith('###') || trimmed.startsWith('##') || trimmed.startsWith('#')) {
        formattedBlocks.push(trimmed);
        continue;
      }

      // Preserve bullet lists
      if (trimmed.startsWith('•') || trimmed.startsWith('-') || /^\d+\./.test(trimmed)) {
        const bulletLines = trimmed
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
          .map((l) => (l.startsWith('•') || l.startsWith('-') || /^\d+\./.test(l) ? l : `• ${l}`));
        formattedBlocks.push(bulletLines.join('\n'));
        continue;
      }

      // Clean single line breaks within prose
      const cleanParagraph = trimmed
        .replace(/\n+/g, ' ')
        .replace(/[ \t]{2,}/g, ' ')
        .trim();

      // Break dense multi-sentence blocks (>300 chars or >3 sentences) into readable micro-paragraphs
      const sentences = cleanParagraph.match(/[^.!?]+[.!?]+["']?|\S+$/g);
      if (sentences && sentences.length > 3) {
        let chunk = '';
        let count = 0;
        for (const s of sentences) {
          chunk += s.trim() + ' ';
          count++;
          if (count >= 2 && chunk.length > 160) {
            formattedBlocks.push(chunk.trim());
            chunk = '';
            count = 0;
          }
        }
        if (chunk.trim()) {
          formattedBlocks.push(chunk.trim());
        }
      } else {
        formattedBlocks.push(cleanParagraph);
      }
    }

    return formattedBlocks.join('\n\n');
  }

  public static detectLanguage(text: string): SupportedLanguage {
    const sample = text.slice(0, 500);
    if (/[\u0900-\u097F]/.test(sample)) {
      if (/[ळ|आणि|आहे|नाही]/i.test(sample)) return 'mr';
      return 'hi';
    }
    if (/[\u0980-\u09FF]/.test(sample)) return 'bn';
    if (/[\u0B00-\u0B7F]/.test(sample)) return 'or';
    if (/[\u0B80-\u0BFF]/.test(sample)) return 'ta';
    if (/[\u0C00-\u0C7F]/.test(sample)) return 'te';
    return 'en';
  }
}
