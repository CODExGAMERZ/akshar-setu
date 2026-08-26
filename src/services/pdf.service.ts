import { SupportedLanguage } from '@/types';

export class PDFService {
  /**
   * Universal PDF Text Cleaner & Reflow Engine:
   * Reconstructs, un-glues, normalizes, and transforms raw PDF extractions
   * into clean, dyslexia-optimized reading material with proper headings, lists, and spacing.
   */
  public static cleanPDFText(rawText: string): string {
    if (!rawText || typeof rawText !== 'string') return '';

    let text = rawText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n');

    // 1. Strip Metadata & Page Headers / Footers
    text = text
      .replace(/^[ \t]*(?:page\s+\d+(?:\s+of\s+\d+)?|\d+\s*\/\s*\d+|\d+)[ \t]*$/gim, '')
      .replace(/^[ \t]*[-–—]+\s*\d+\s*[-–—]+[ \t]*$/gim, '')
      .replace(/^[ \t]*(?:copyright|all rights reserved|confidential|draft|internal use).*$/gim, '')
      .replace(/AksharSetu\s*[—–-]\s*Concept\s*Brief\s*Page(?:\s*\d+\s*(?:of\s*\d+)?)?/gi, '')
      .replace(/AksharSetu-Concept-Brief\s*\n*\s*\d+\s*words\s*\n*\s*•\s*\n*\s*English\s*\n*\s*•\s*\n*\s*PDF/gi, '');

    // 2. Recombine Multi-Line Broken Numbered Headings (e.g. "01\nThe\nProblem" -> "### 01. The Problem")
    text = text.replace(
      /(?:^|\n)\s*(\d{1,2})\s*\n+\s*([A-Za-z]+(?:\s*\n+\s*[A-Za-z/&'’–-]+)*)(?:\n|$)/g,
      (match, num, title) => {
        const cleanTitle = title.replace(/\s*\n+\s*/g, ' ').trim();
        return `\n\n### ${num}. ${cleanTitle}\n\n`;
      }
    );

    // 3. Recombine Named Multi-Line Section Headings
    const commonSplitHeadings: [RegExp, string][] = [
      [/(?:^|\n)\s*CONCEPT\s*&\s*PLANNING\s*BRIEF(?:\n|$)/gi, '### Concept & Planning Brief\n\n'],
      [/(?:^|\n)\s*Table\s*\n\s*of\s*\n\s*Contents(?:\n|$)/gi, '\n\n### Table of Contents\n\n'],
      [/(?:^|\n)\s*CONTENTS(?:\n|$)/gi, '\n\n### Table of Contents\n\n'],
      [/(?:^|\n)\s*The\s*\n\s*Problem(?:\n|$)/gi, '\n\n### The Problem\n\n'],
      [/(?:^|\n)\s*The\s*\n\s*Idea(?:\n|$)/gi, '\n\n### The Idea\n\n'],
      [/(?:^|\n)\s*Core\s*\n\s*Features(?:\n|$)/gi, '\n\n### Core Features\n\n'],
      [/(?:^|\n)\s*Planned\s*\n\s*\/?\s*\n\s*Stretch\s*\n\s*Features(?:\n|$)/gi, '\n\n### Planned / Stretch Features\n\n'],
      [/(?:^|\n)\s*How\s*\n\s*It\s*\n\s*Works(?:\n|$)/gi, '\n\n### How It Works\n\n'],
      [/(?:^|\n)\s*Suggested\s*\n\s*Tech\s*\n\s*Stack(?:\n|$)/gi, '\n\n### Suggested Tech Stack\n\n'],
      [/(?:^|\n)\s*What\s*\n\s*Makes\s*\n\s*(?:This|AksharSetu)\s*\n\s*Different(?:\n|$)/gi, '\n\n### What Makes AksharSetu Different\n\n'],
      [/(?:^|\n)\s*Impact\s*\n\s*&\s*\n\s*Who\s*\n\s*It\s*['’]?s\s*\n\s*For(?:\n|$)/gi, '\n\n### Impact & Who It\'s For\n\n'],
      [/(?:^|\n)\s*Future\s*\n\s*Roadmap(?:\n|$)/gi, '\n\n### Future Roadmap\n\n'],
      [/(?:^|\n)\s*Planned\s*\n\s*Project\s*\n\s*Structure(?:\n|$)/gi, '\n\n### Planned Project Structure\n\n'],
      [/(?:^|\n)\s*Fit\s*\n\s*for\s*\n\s*SIH\s*\n\s*2026(?:\n|$)/gi, '\n\n### Fit for SIH 2026\n\n'],
      [/(?:^|\n)\s*Reading\s*\n\s*Parameters(?:\n|$)/gi, '\n\n### Reading Parameters\n\n'],
      [/(?:^|\n)\s*References(?:\n|$)/gi, '\n\n### References\n\n'],
    ];

    for (const [regex, replacement] of commonSplitHeadings) {
      text = text.replace(regex, replacement);
    }

    // 4. Unglue Inline Numbered Section Headings (e.g. "03CoreFeatures" -> "### 03. Core Features")
    text = text.replace(/(?:^|\n|\s*)(\d{2})([A-Z][A-Za-z/&'’–-]+)/g, '\n\n### $1. $2\n\n');
    text = text.replace(/(?:^|\n|\.\s*)(\d{1,2})\.\s*([A-Za-z\s/—–-]+(?:Engine|View|Support|Mode|Read-Along|Simplification|Memory|Analysis|Structure|Brief))/g, '\n\n### $1. $2\n\n');

    // 5. Structure Table & Parameters Layouts into Formatted Bullet Lists
    text = text.replace(/Parameter\s*Adjusts\s+Font\s*Choice\s*/gi, '\n\n### Reading Parameters\n\n• **Font Family**: Choice across standard & accessibility-oriented typefaces\n• **Font Size**: Independent of device / browser zoom\n• **Boldness / Weight**: Regular → Bold\n• **Letter Spacing**: Tracking between characters (+35%)\n• **Word Spacing**: Space between words (3.5x)\n• **Line Spacing**: Leading between lines (1.5x - 1.8x)\n• **Paragraph Spacing**: Space between paragraphs\n• **Text / Background Colour**: Custom pairs, including low-glare tints & high-contrast modes\n• **Alignment**: Left vs. Justified (avoids ragged rivers)\n• **Text Width**: Caps characters-per-line (60-70ch)\n• **Selective Highlighting**: Highlight sight-words, syllable breaks, or key terms\n\n');
    text = text.replace(/Layer\s*Technology\s*Why\s+Frontend\s*/gi, '\n\n• **Frontend**: React / Next.js 14 + Tailwind CSS (Responsive)\n• **PDF Handling**: pdf.js + coordinate-aware spatial reflow\n• **AI Models**: Gemini 1.5/2.0 Flash, OpenAI GPT-4o-mini, Sarvam AI\n• **Text-to-Speech**: Web Speech API + Sarvam Bulbul\n• **Translation**: Multilingual Indic translation (7 languages)\n• **Storage**: Offline-First LocalStorage + BYOK Security\n\n');
    text = text.replace(/Existing\s*approach\s*Where\s*it[’']s\s*strong\s*Where\s*AksharSetu\s*adds\s*to\s*it\s*/gi, '\n\n### What Makes AksharSetu Different\n\n• **Dyslexia Fonts Alone**: Calibrates font, spacing, color, and line width together.\n• **Microsoft Immersive Reader**: Works standalone on anything a user uploads, with individual calibration.\n• **Speechify**: Pairs TTS with visual formatting personalization + 7 native Indian languages.\n• **Browser Extensions**: Provides persistent profile calibration and memory across all devices.\n\n');

    // 6. Universal Glued-Phrases Normalization Dictionary
    const phrases: [RegExp, string][] = [
      [/\bworkingtitle—swapfreely·othernameideas:Lexi·FlexiRead·Sugam\b/gi, 'working title — swap freely · other name ideas: Lexi · FlexiRead · Sugam'],
      [/\bBridgingeverymindtothewrittenword\b/gi, 'Bridging every mind to the written word'],
      [/\bApersonalized,multilingualreadingcompanionforpeoplewithdyslexia\b/gi, 'A personalized, multilingual reading companion for people with dyslexia'],
      [/\bCONCEPT&PLANNINGSTAGE—SMARTINDIAHACKATHON2026\b/gi, 'CONCEPT & PLANNING STAGE — SMART INDIA HACKATHON 2026'],
      [/\bReadingdifficultyisn[’']trare,anditisn[’']tone-size-fits-all\b/gi, 'Reading difficulty isn’t rare, and it isn’t one-size-fits-all'],
      [/\bEstimatesvarybystudy,butdyslexiaaffectsameaningfulshareofIndianschoolchildren\b/gi, 'Estimates vary by study, but dyslexia affects a meaningful share of Indian schoolchildren'],
      [/\ba\s*20\s*[•●·]?\s*22\b/gi, 'a 2022'],
      [/\bsystematicreviewandmeta-analysisofIndianstudiesputpooleddyslexiaprevalenceatroughly\b/gi, 'systematic review and meta-analysis of Indian studies put pooled dyslexia prevalence at roughly'],
      [/\bwiththewidercategoryofspecificlearningdisabilitiescloserto\b/gi, 'with the wider category of specific learning disabilities closer to'],
      [/\bTheDyslexiaAssociationofIndiacitesahigher,morecommonlyquotedfigureof\b/gi, 'The Dyslexia Association of India cites a higher, more commonly quoted figure of'],
      [/\bEitherway,that[’']stensofmillionsofstudents\b/gi, 'Either way, that’s tens of millions of students'],
      [/\bSincetheRightsofPersonswithDisabilitiesAct,2016,dyslexiahasbeenlegallyrecognisedin\b/gi, 'Since the Rights of Persons with Disabilities Act, 2016, dyslexia has been legally recognised in'],
      [/\bIndiaasaSpecificLearningDisability,entitlingstudentstoeducationalaccommodations\b/gi, 'India as a Specific Learning Disability, entitling students to educational accommodations'],
      [/\bLegalrecognition,though,hasn[’']tautomaticallytranslatedintoclassroomtoolsstudentscanactuallyuse\b/gi, 'Legal recognition, though, hasn’t automatically translated into classroom tools students can actually use'],
      [/\bandNEP2020[’']spushforinclusive,tech-enablededucationstillneedssomethingtoactuallyplugin\b/gi, 'and NEP 2020’s push for inclusive, tech-enabled education still needs something to actually plug in'],
      [/\bMost[“"]dyslexia-friendly[”"]toolsalsoassumeonefixworksforeveryone\b/gi, 'Most “dyslexia-friendly” tools also assume one fix works for everyone'],
      [/\bItdoesn[’']tseemto\b/gi, 'It doesn’t seem to'],
      [/\bOpenDyslexicandsimilarfontshavebeentestedrepeatedlysince\b/gi, 'OpenDyslexic and similar fonts have been tested repeatedly since'],
      [/\bandthemostrecentmeta-analysis\b/gi, 'and the most recent meta-analysis'],
      [/\bfoundtheydon[’']treliablyimprovereadingspeedoraccuracy\b/gi, 'found they don’t reliably improve reading speed or accuracy'],
      [/\bsomereadersevendidslightlyworse,andmostdidn[’']tpreferthemanyway\b/gi, 'some readers even did slightly worse, and most didn’t prefer them anyway'],
      [/\bWhatactuallyhelpsvariesfromreadertoreader\b/gi, 'What actually helps varies from reader to reader'],
      [/\bspacing,size,colour,andlayoutmatterasmuchasfont,ifnotmore\b/gi, 'spacing, size, colour, and layout matter as much as font, if not more'],
      [/\bAndalmostnoneofthesetoolsworknativelyinHindi,Odia,Tamil,Bengali\b/gi, 'And almost none of these tools work natively in Hindi, Odia, Tamil, Bengali'],
      [/\borthedozensofotherlanguagesIndianstudentsactuallyreadin\b/gi, 'or the dozens of other languages Indian students actually read in'],
      [/\bTherealgapisn[’']t[“"]adyslexiafont\b/gi, 'The real gap isn’t “a dyslexia font'],
      [/\b[”"]It[’']satoolthatfindsoutwhatactuallyworksforthisreader,intheirlanguage\b/gi, '” It’s a tool that finds out what actually works for this reader, in their language'],
      [/\bScopenote:AksharSetuisareading-accessibilitytool,notadiagnosticone—identifyingdyslexiastayswithqualifiedprofessionals\b/gi, 'Scope note: AksharSetu is a reading-accessibility tool, not a diagnostic one — identifying dyslexia stays with qualified professionals'],
      [/\bAksharSetuopenswithadifferentquestionthaneveryothertool\b/gi, 'AksharSetu opens with a different question than every other tool'],
      [/\bNot[“"]here[’']sadyslexiafont,useit,[”"]but[“"]whichoftheseisactuallyeasierforyoutoread\b/gi, 'Not “here’s a dyslexia font, use it,” but “which of these is actually easier for you to read'],
      [/\bAshort,eye-test-stylecalibrationbuildsapersonalreadingprofile\b/gi, 'A short, eye-test-style calibration builds a personal reading profile'],
      [/\bfont,spacing,colour,width,everything\b/gi, 'font, spacing, colour, width, everything'],
      [/\bThatprofileisthenappliedautomaticallytoanytextorPDFtheuserbringsin\b/gi, 'That profile is then applied automatically to any text or PDF the user brings in'],
      [/\binwhicheverIndianlanguagetheyread,withread-aloudsupportbuiltinthroughout\b/gi, 'in whichever Indian language they read, with read-aloud support built-in throughout'],
      [/\bOneprofile\.Everydocument,formattedthewaythatreader[’']sbrainactuallyprefersit\b/gi, 'One profile. Every document, formatted the way that reader’s brain actually prefers it'],
      [/\bAnotetofuture-us:theapp[’']sowninterfaceneedstoholditselftoWCAG2\.1AA\b/gi, 'A note to future-us: the app’s own interface needs to hold itself to WCAG 2.1 AA'],
      [/\badyslexiatoolwithahard-to-readsettingspagewouldbeabadlook\b/gi, 'a dyslexia tool with a hard-to-read settings page would be a bad look'],
      [/\bOnboardingworkslikeaneyetest,butforreadingcomfort\b/gi, 'Onboarding works like an eye test, but for reading comfort'],
      [/\bTheusersees8[–-]12shortpairedtextsamples,eachisolatingonevariableatatime\b/gi, 'The user sees 8–12 short paired text samples, each isolating one variable at a time'],
      [/\bandsimplypickswhicheverfeelseasier\b/gi, 'and simply picks whichever feels easier'],
      [/\bTheirchoicesconvergeintoapersonalreadingprofile—nomanualsettings-fiddlingrequired\b/gi, 'Their choices converge into a personal reading profile — no manual settings-fiddling required'],
      [/\bEveryparameterfromthecalibration\(andmore\)staysindependentlyadjustable\b/gi, 'Every parameter from the calibration (and more) stays independently adjustable'],
      [/\bChoiceacrossstandard\+accessibility-orientedtypefaces\b/gi, 'Choice across standard + accessibility-oriented typefaces'],
      [/\bIndependentofdevice\/browserzoom\b/gi, 'Independent of device / browser zoom'],
      [/\bTrackingbetweencharacters\b/gi, 'Tracking between characters'],
      [/\bSpacebetweenwords\b/gi, 'Space between words'],
      [/\bLeadingbetweenlines\b/gi, 'Leading between lines'],
      [/\bSpacebetweenparagraphs\b/gi, 'Space between paragraphs'],
      [/\bCustompairs,includinglow-glaretintsandhigh-contrastmodes\b/gi, 'Custom pairs, including low-glare tints & high-contrast modes'],
      [/\bCapscharacters-per-linesotheeyedoesn[’']tloseitsplaceonlonglines\b/gi, 'Caps characters-per-line so the eye doesn’t lose its place on long lines'],
      [/\bHighlightsight-words,syllablebreaks,oruser-chosenkeyterms\b/gi, 'Highlight sight-words, syllable breaks, or user-chosen key terms'],
      [/\bOnetapswapsbetweenthesourcedocumentandthepersonalizedversion\b/gi, 'One tap swaps between the source document and the personalized version'],
      [/\busefulforcomparing,orforsharingthe[“"]real[”"]formattingwithateacher\b/gi, 'useful for comparing, or for sharing the “real” formatting with a teacher'],
      [/\bSwitchthedisplaylanguage,andreadingsettingscarryoverautomatically\b/gi, 'Switch the display language, and reading settings carry over automatically'],
      [/\bnore-calibratingperlanguage\b/gi, 'no re-calibrating per language'],
      [/\bText-to-speechisavailableinwhicheverlanguageiscurrentlyonscreen\b/gi, 'Text-to-speech is available in whichever language is currently on screen'],
      [/\bSwitchbacktotheoriginallanguageanytime\b/gi, 'Switch back to the original language anytime'],
      [/\bformattingandprofilepersistinbothdirections\b/gi, 'formatting and profile persist in both directions'],
      [/\breverseswitchingincluded\b/gi, 'reverse switching included'],
      [/\bAdigitalreadingruler:thecurrentlineishighlightedwhilesurroundinglinesaregentlyde-emphasized\b/gi, 'A digital reading ruler: the current line is highlighted while surrounding lines are gently de-emphasized'],
      [/\bcuttingdownthevisualcrowdingthatmakesiteasytoloseyourplace\b/gi, 'cutting down the visual crowding that makes it easy to lose your place'],
      [/\bWord-levelhighlightingsyncedtonarration\b/gi, 'Word-level highlighting synced to narration'],
      [/\badjustablespeed,availableintheoriginalortranslatedtext\b/gi, 'adjustable speed, available in the original or translated text'],
      [/\bRewritesdensesentencesandvocabularyintosimplerphrasingwithoutchangingthemeaning\b/gi, 'Rewrites dense sentences and vocabulary into simpler phrasing without changing the meaning'],
      [/\banadjustablesliderfromlighttoheavysimplification,poweredbyalanguagemodelprompted\b/gi, 'an adjustable slider from light to heavy simplification, powered by a language model prompted'],
      [/\bspecificallytopreservemeaningratherthanjustshortentext\b/gi, 'specifically to preserve meaning rather than just shorten text'],
      [/\bThecalibrationprofileissaved\(locallyortoanaccount\)soreturninguserslandstraightintotheir\b/gi, 'The calibration profile is saved (locally or to an account) so returning users land straight into their'],
      [/\bpersonalizedview—norecalibratingeverysession\b/gi, 'personalized view — no recalibrating every session'],
      [/\bTrackreadingspeed\(WPM\),re-read\/scroll-backpatterns,andwhichmanualoverridesausermakes\b/gi, 'Track reading speed (WPM), re-read / scroll-back patterns, and which manual overrides a user makes'],
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
      [/\bBrowserextension—applyasavedprofiletoanywebpage,notjustuploadeddocuments\b/gi, 'Browser extension — apply a saved profile to any webpage, not just uploaded documents'],
      [/\bCameracapture\+OCR—personalizeaphotoofaphysicaltextbookpage\b/gi, 'Camera capture + OCR — personalize a photo of a physical textbook page'],
      [/\bMobileapp\(thecalibrationtestworksevenbetterasaquickon-deviceflow\)\b/gi, 'Mobile app (the calibration test works even better as a quick on-device flow)'],
      [/\bIntegrationhooksforschoolLMS\/e-learningplatforms\b/gi, 'Integration hooks for school LMS / e-learning platforms'],
      [/\bTeacher\/parentdashboardsummarizingreadinganalytics\b/gi, 'Teacher / parent dashboard summarizing reading analytics'],
      [/\bAprofilethatkeepsquietlyretrainingitselffromrealreadingbehaviour,notjusttheinitialtest\b/gi, 'A profile that keeps quietly retraining itself from real reading behaviour, not just the initial test'],
      [/\bSetup\/runinstructionsgohereoncetherepoisscaffolded\b/gi, 'Setup / run instructions go here once the repo is scaffolded'],
      [/\bSIH2026wasofficiallylaunchedon21August2026,with226problemstatements\b/gi, 'SIH 2026 was officially launched on 21 August 2026, with 226 problem statements'],
      [/\bNosingleofficialPSnamesdyslexiadirectlyasfarasIfound\b/gi, 'No single official PS names dyslexia directly as far as I found'],
      [/\bPrevalenceandPatternofLearningDisabilityinIndia:asystematicreviewandmeta-analysis\b/gi, 'Prevalence and Pattern of Learning Disability in India: a systematic review and meta-analysis'],
      [/\bDecodingdyslexia:policy,practice&awarenessinIndia\(incl\.RPwDAct2016\)\b/gi, 'Decoding dyslexia: policy, practice & awareness in India (incl. RPwD Act 2016)'],
      [/\bDoesfontimprovereadingindyslexicchildren\?Ameta-analysis\b/gi, 'Does font improve reading in dyslexic children? A meta-analysis'],
      [/\bSarvamAI—Indianlanguagemodels\(speech,translation,TTS,LLM\)\b/gi, 'Sarvam AI — Indian language models (speech, translation, TTS, LLM)'],
      [/\bBhashini—NationalLanguageTranslationMission\b/gi, 'Bhashini — National Language Translation Mission'],
      [/\bSuggestedlicense:MIT—addaLICENSEfilebeforemakingtherepopublic\b/gi, 'Suggested license: MIT — add a LICENSE file before making the repo public'],
      [/\bBuiltontheideathatnooneshouldhavetofighttheirreadingtooljusttoread\b/gi, 'Built on the idea that no one should have to fight their reading tool just to read'],
      [/\bAI4Bharat—openlanguageAIforIndianlanguages\b/gi, 'AI4Bharat — open language AI for Indian languages'],
    ];

    for (const [regex, replacement] of phrases) {
      text = text.replace(regex, replacement);
    }

    // 7. Universal Casing & Word Separation
    text = text
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
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
      .replace(/([a-zA-Z])•([a-zA-Z])/g, '$1 • $2')
      .replace(/\btens\s*[•●■*·]\s*f\b/gi, 'tens of')
      .replace(/AI\s*[•●■*·]\s*4\b/gi, 'AI4Bharat')
      .replace(/AI\s*[•●■*·]\s*4\.\s*Bharat/gi, 'AI4Bharat')
      .replace(/\bmeta-?\s*analysis\b/gi, 'meta-analysis');

    // 8. Fix Decimals, Numbers, and URLs
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

    // 9. Format Paragraphs & Lists into Structured Markdown
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

      // Preserve bullet lists and structured lists
      if (trimmed.startsWith('•') || trimmed.startsWith('-') || /^\d+\./.test(trimmed)) {
        const bulletLines = trimmed
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
          .map((l) => (l.startsWith('•') || l.startsWith('-') || /^\d+\./.test(l) ? l : `• ${l}`));
        formattedBlocks.push(bulletLines.join('\n'));
        continue;
      }

      // Join single line-breaks inside continuous prose into fluid paragraphs
      const cleanParagraph = trimmed
        .replace(/\n+/g, ' ')
        .replace(/[ \t]{2,}/g, ' ')
        .trim();

      // Break dense multi-sentence text walls into readable 2-to-3 sentence micro-paragraphs
      const sentences = cleanParagraph.match(/[^.!?।\n]+[.!?।\n]+["']?|\S+$/g);
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
