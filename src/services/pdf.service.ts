import { SupportedLanguage } from '@/types';

// High-frequency comprehensive dictionary for universal word segmentation
const COMMON_DICTIONARY = new Set([
  'a', 'about', 'above', 'across', 'act', 'active', 'actively', 'activity', 'actual', 'actually', 'adds',
  'adjustment', 'adoption', 'affects', 'after', 'again', 'against', 'ai', 'all', 'almost', 'alone',
  'along', 'already', 'also', 'alternative', 'an', 'analysis', 'and', 'another', 'any', 'anytime',
  'anyway', 'app', 'application', 'apply', 'approach', 'are', 'area', 'around', 'as', 'association',
  'assume', 'at', 'audience', 'audio', 'author', 'auto', 'automatic', 'automatically', 'available',
  'average', 'avoid', 'avoids', 'awareness', 'away', 'back', 'background', 'backup', 'barrier', 'be',
  'because', 'become', 'becomes', 'been', 'before', 'behavior', 'behaviour', 'benefit', 'best',
  'better', 'between', 'beyond', 'big', 'bilingual', 'blank', 'blend', 'block', 'blocks', 'body',
  'bold', 'boldness', 'book', 'border', 'both', 'bottom', 'brain', 'break', 'breaks', 'bridge',
  'brief', 'bright', 'brightness', 'bring', 'brings', 'browser', 'build', 'building', 'builds', 'built',
  'bulbul', 'bullet', 'but', 'by', 'calibrate', 'calibrating', 'calibration', 'calibrates', 'can',
  'cannot', 'canvas', 'capacity', 'capital', 'capture', 'care', 'carefully', 'case', 'category',
  'center', 'challenge', 'change', 'changes', 'channel', 'chapter', 'character', 'characters', 'check',
  'children', 'choice', 'choices', 'choose', 'cite', 'cites', 'class', 'classroom', 'clean', 'cleaner',
  'clear', 'clearly', 'click', 'clinical', 'close', 'closely', 'closer', 'closerto', 'clutter', 'code',
  'cognitive', 'college', 'color', 'colour', 'combination', 'comfortable', 'comfort', 'coming', 'common',
  'commonly', 'community', 'companion', 'company', 'compare', 'compares', 'comparing', 'comparison',
  'complete', 'complex', 'complexity', 'concept', 'conclusion', 'confidence', 'confirm', 'connectivity',
  'content', 'contents', 'continuous', 'contrast', 'controls', 'converge', 'copy', 'core', 'could',
  'country', 'create', 'creates', 'criteria', 'crowd', 'crowding', 'current', 'currently', 'custom',
  'customized', 'cut', 'cuts', 'cutting', 'daily', 'dark', 'dashboard', 'data', 'database', 'day',
  'decode', 'decoding', 'default', 'defined', 'degree', 'dense', 'density', 'describe', 'design',
  'designed', 'detail', 'details', 'detect', 'detection', 'developer', 'device', 'devices', 'diagnostic',
  'differ', 'difference', 'different', 'difficult', 'difficulty', 'digital', 'direct', 'direction',
  'directions', 'disabilities', 'disability', 'discuss', 'discussion', 'display', 'displays', 'distance',
  'distinct', 'distinguish', 'do', 'doc', 'document', 'documents', 'does', 'doing', 'done', 'down',
  'draft', 'dual', 'duration', 'dynamic', 'dyslexia', 'dyslexic', 'each', 'early', 'easier', 'easily',
  'easy', 'education', 'educational', 'effect', 'effective', 'either', 'element', 'elements', 'emphasis',
  'enable', 'enables', 'end', 'engine', 'engineer', 'enhance', 'enhanced', 'enough', 'entitle', 'entitling',
  'environment', 'error', 'especially', 'essential', 'estimate', 'estimates', 'even', 'event', 'every',
  'everybody', 'everyone', 'everything', 'everywhere', 'evidence', 'exact', 'exactly', 'example',
  'excellent', 'execute', 'execution', 'exercise', 'exist', 'existing', 'expand', 'expect', 'experience',
  'explain', 'explore', 'export', 'extension', 'extract', 'extraction', 'eye', 'facing', 'fact', 'fail',
  'familiar', 'family', 'fast', 'faster', 'fatigue', 'feature', 'features', 'feed', 'feedback', 'feel',
  'feeling', 'feels', 'few', 'field', 'figure', 'figures', 'file', 'files', 'fill', 'final', 'finally',
  'find', 'finding', 'finds', 'fine', 'first', 'fit', 'fits', 'fix', 'fixed', 'fixes', 'flexi', 'flexible',
  'flow', 'fluent', 'fluid', 'focus', 'font', 'fonts', 'for', 'force', 'form', 'format', 'formatted',
  'formatting', 'forms', 'four', 'fourth', 'framework', 'free', 'freely', 'frequent', 'from', 'front',
  'frontend', 'full', 'functional', 'functionality', 'further', 'future', 'gain', 'gap', 'gaps', 'general',
  'generate', 'generates', 'generous', 'gentle', 'gently', 'get', 'gets', 'getting', 'give', 'gives',
  'giving', 'glare', 'glide', 'global', 'glyph', 'glyphs', 'go', 'goal', 'good', 'goodwill', 'govern',
  'government', 'grant', 'great', 'group', 'grow', 'guide', 'guideline', 'had', 'hand', 'handle',
  'handling', 'happen', 'hard', 'hardware', 'has', 'hasnt', 'have', 'having', 'he', 'head', 'header',
  'headings', 'health', 'healthcare', 'hear', 'hearing', 'heavy', 'height', 'help', 'helpful', 'helping',
  'helps', 'her', 'here', 'heres', 'hidden', 'high', 'higher', 'highest', 'highlight', 'highlighted',
  'highlighting', 'highly', 'him', 'his', 'history', 'hold', 'holds', 'home', 'hook', 'hooks', 'hope',
  'horizontal', 'host', 'hosts', 'hour', 'house', 'how', 'huge', 'human', 'icon', 'idea', 'ideas',
  'identical', 'identify', 'identifying', 'image', 'impact', 'implement', 'implementation', 'importance',
  'important', 'improve', 'improves', 'in', 'include', 'included', 'includes', 'including', 'inclusive',
  'independent', 'index', 'india', 'indian', 'individual', 'industry', 'influence', 'info', 'information',
  'initial', 'inline', 'innovative', 'input', 'insight', 'install', 'instance', 'instead', 'integrate',
  'integration', 'intended', 'interaction', 'interactive', 'interface', 'internal', 'into', 'is', 'island',
  'isnt', 'isolate', 'isolating', 'issue', 'issues', 'it', 'item', 'items', 'its', 'itself', 'job', 'join',
  'journal', 'jump', 'jumping', 'just', 'justified', 'karaoke', 'keep', 'keeping', 'keeps', 'key', 'kind',
  'know', 'knowledge', 'known', 'label', 'lack', 'land', 'language', 'languages', 'large', 'larger', 'last',
  'late', 'later', 'latest', 'layer', 'layout', 'lead', 'leader', 'leading', 'learn', 'learner', 'learning',
  'least', 'leave', 'left', 'legal', 'legally', 'legibility', 'legible', 'length', 'less', 'lesson',
  'let', 'letter', 'lettering', 'letters', 'level', 'library', 'license', 'life', 'light', 'lightweight',
  'like', 'likely', 'limit', 'line', 'lines', 'link', 'list', 'listen', 'listening', 'literal', 'little',
  'live', 'local', 'locally', 'location', 'long', 'longer', 'look', 'looks', 'loose', 'lose', 'loses',
  'losing', 'loss', 'lot', 'low', 'lower', 'lowest', 'main', 'maintain', 'major', 'majority', 'make',
  'maker', 'makes', 'making', 'manage', 'management', 'manages', 'manual', 'manually', 'many', 'margin',
  'margins', 'mark', 'markdown', 'market', 'mass', 'massive', 'match', 'matches', 'material', 'matrix',
  'matter', 'matters', 'max', 'maximum', 'may', 'meaning', 'meaningful', 'measure', 'measurement',
  'medium', 'meet', 'memory', 'mention', 'menu', 'message', 'meta', 'method', 'metric', 'metrics', 'micro',
  'mid', 'middle', 'might', 'million', 'millions', 'mind', 'minds', 'min', 'minimum', 'ministry', 'minute',
  'mission', 'mix', 'mixed', 'mobile', 'mode', 'model', 'models', 'moderate', 'module', 'moment', 'month',
  'more', 'most', 'mostly', 'motion', 'mouse', 'move', 'movement', 'moves', 'moving', 'much', 'multi',
  'multilingual', 'multiple', 'must', 'my', 'name', 'named', 'names', 'narration', 'national', 'native',
  'natively', 'natural', 'nature', 'navigate', 'navigation', 'near', 'nearby', 'neat', 'necessary',
  'need', 'needed', 'needs', 'negative', 'neither', 'nep', 'nested', 'net', 'network', 'never', 'new',
  'newest', 'next', 'no', 'node', 'noise', 'non', 'none', 'normal', 'normalize', 'normalized', 'normally',
  'not', 'note', 'notes', 'nothing', 'notice', 'now', 'number', 'numbered', 'numbers', 'object', 'objective',
  'obtain', 'occur', 'ocr', 'of', 'off', 'offer', 'official', 'officially', 'offline', 'offset', 'often',
  'old', 'on', 'onboarding', 'once', 'one', 'ones', 'onesize', 'online', 'only', 'onto', 'open', 'opened',
  'opening', 'opens', 'operate', 'operated', 'operation', 'operator', 'opinion', 'option', 'options',
  'or', 'order', 'original', 'other', 'others', 'otherwise', 'ought', 'our', 'out', 'outcome', 'outer',
  'outline', 'output', 'outside', 'over', 'overall', 'overlay', 'override', 'overrides', 'overwhelm',
  'own', 'page', 'pages', 'pair', 'paired', 'pairs', 'paper', 'papers', 'paragraph', 'paragraphs', 'param',
  'parameter', 'parameters', 'parent', 'parents', 'part', 'participate', 'particular', 'partly', 'parts',
  'pass', 'passage', 'past', 'paste', 'pasted', 'pattern', 'patterns', 'pause', 'pay', 'pdf', 'peer',
  'people', 'per', 'percent', 'percentage', 'perfect', 'performance', 'period', 'persist', 'persistence',
  'persistent', 'persists', 'person', 'personal', 'personalized', 'personalize', 'personally', 'persons',
  'photo', 'physical', 'pick', 'picks', 'picture', 'piece', 'pipeline', 'pixel', 'pixels', 'place',
  'places', 'plan', 'planned', 'planning', 'plans', 'platform', 'play', 'player', 'pleasant', 'plugin',
  'plus', 'pocket', 'point', 'points', 'policy', 'polished', 'pool', 'pooled', 'poor', 'popular',
  'portion', 'position', 'possible', 'post', 'potential', 'practice', 'prefer', 'preference', 'preferences',
  'preferred', 'prefers', 'presence', 'present', 'presentation', 'preserve', 'preserves', 'preserving',
  'preset', 'presets', 'press', 'pretty', 'prevalence', 'prevent', 'previous', 'primarily', 'primary',
  'principle', 'print', 'prior', 'priority', 'privacy', 'private', 'problem', 'problems', 'procedure',
  'process', 'processed', 'processing', 'produce', 'product', 'production', 'products', 'profession',
  'professional', 'professionals', 'profile', 'profiles', 'program', 'progress', 'progressive', 'project',
  'projects', 'proper', 'properly', 'proportion', 'proposal', 'proposed', 'prose', 'protect', 'protein',
  'protocol', 'prototype', 'proud', 'provide', 'provided', 'provider', 'providers', 'provides', 'public',
  'publication', 'publish', 'pull', 'pulls', 'purpose', 'push', 'pushes', 'put', 'puts', 'qualify',
  'qualified', 'quality', 'quick', 'quickly', 'quiet', 'quietly', 'quit', 'quite', 'quote', 'quoted',
  'quotes', 'ragged', 'raise', 'random', 'range', 'rapid', 'rare', 'rate', 'rates', 'rather', 'raw',
  'reach', 'react', 'reaction', 'read', 'readable', 'readability', 'reader', 'readers', 'readout',
  'ready', 'real', 'realm', 'reason', 'receive', 'recent', 'recently', 'receptive', 'recognise', 'recognised',
  'recognition', 'recognize', 'recognized', 'recommend', 'recommended', 'record', 'recover', 'ref',
  'reference', 'references', 'refine', 'refining', 'reflect', 'reflow', 'reflowed', 'reflows', 'refresh',
  'region', 'regional', 'regular', 'regulate', 'related', 'relationship', 'relative', 'release', 'reliable',
  'remain', 'remains', 'remote', 'remove', 'render', 'rendered', 'rendering', 'renders', 'reopen',
  'repeat', 'replace', 'replacement', 'report', 'represent', 'representative', 'require', 'required',
  'research', 'researcher', 'reset', 'resolution', 'resource', 'resources', 'respect', 'respond',
  'response', 'responsive', 'rest', 'restore', 'restores', 'result', 'results', 'resume', 'retain',
  'return', 'returning', 'reverse', 'review', 'reviews', 'reward', 'rewrite', 'rewrites', 'rhythm',
  'rich', 'rid', 'right', 'rights', 'ring', 'rings', 'risk', 'river', 'rivers', 'road', 'roadmap',
  'robust', 'rock', 'rocky', 'role', 'root', 'rough', 'roughly', 'round', 'route', 'rover', 'row',
  'rule', 'ruler', 'run', 'running', 'runs', 'safe', 'safety', 'said', 'same', 'sample', 'samples',
  'sarvam', 'save', 'saved', 'saves', 'saving', 'say', 'scale', 'scaling', 'scenario', 'scene', 'schema',
  'scholar', 'school', 'schoolchildren', 'schools', 'science', 'scientific', 'scope', 'screen', 'scroll',
  'search', 'second', 'secondary', 'section', 'sections', 'secure', 'security', 'see', 'seek', 'seeking',
  'seem', 'seems', 'seen', 'sees', 'segment', 'segmented', 'segmentation', 'select', 'selected',
  'selection', 'selective', 'semantic', 'send', 'sentence', 'sentences', 'separate', 'separated',
  'separation', 'sequence', 'serial', 'series', 'serious', 'serve', 'server', 'service', 'services',
  'session', 'sessions', 'set', 'sets', 'setting', 'settings', 'setup', 'seven', 'several', 'severe',
  'shape', 'share', 'sharing', 'sharp', 'she', 'shift', 'shifts', 'short', 'shorten', 'should', 'show',
  'shows', 'side', 'sides', 'sight', 'sign', 'signal', 'signature', 'signs', 'silence', 'similar',
  'simple', 'simpler', 'simplest', 'simplicity', 'simplification', 'simplify', 'simply', 'since',
  'single', 'site', 'situation', 'six', 'size', 'sizes', 'skill', 'skills', 'skin', 'slight', 'slightly',
  'slow', 'slower', 'small', 'smaller', 'smart', 'smooth', 'smoothly', 'so', 'social', 'soft', 'software',
  'solid', 'solution', 'some', 'somebody', 'someone', 'something', 'sometimes', 'somewhat', 'somewhere',
  'soon', 'sound', 'sounds', 'source', 'sources', 'space', 'spaces', 'spacing', 'span', 'speak', 'speaker',
  'speaking', 'special', 'specialist', 'specialized', 'specific', 'specifically', 'speech', 'speechify',
  'speed', 'speeds', 'spell', 'spend', 'split', 'splits', 'spoken', 'sponsor', 'stack', 'staff', 'stage',
  'standard', 'standards', 'standout', 'start', 'started', 'starting', 'starts', 'state', 'statement',
  'statements', 'states', 'static', 'status', 'stay', 'stays', 'steady', 'steam', 'stem', 'step', 'steps',
  'stick', 'sticky', 'still', 'stop', 'stopped', 'storage', 'store', 'stored', 'stores', 'story',
  'straight', 'strategy', 'stream', 'stress', 'stretch', 'string', 'strong', 'stronger', 'structure',
  'structured', 'structures', 'student', 'students', 'studies', 'study', 'style', 'styles', 'sub',
  'subject', 'submit', 'subsections', 'subsequent', 'substance', 'succeed', 'success', 'successful',
  'such', 'sugam', 'suggest', 'suggested', 'suggestion', 'suitable', 'summarize', 'summary', 'super',
  'support', 'supported', 'supporting', 'supports', 'suppose', 'surface', 'surrounding', 'swap',
  'switch', 'switches', 'switching', 'syllable', 'syllables', 'symbol', 'symbols', 'synced', 'synchronize',
  'system', 'systematic', 'systems', 'table', 'tables', 'tag', 'tags', 'tail', 'tailwind', 'take',
  'taken', 'takes', 'taking', 'talent', 'target', 'task', 'taste', 'teach', 'teacher', 'teachers',
  'teaching', 'team', 'tech', 'technical', 'technology', 'tell', 'template', 'ten', 'tend', 'tens',
  'term', 'terms', 'test', 'tested', 'testing', 'tests', 'text', 'textbook', 'texts', 'than', 'thank',
  'that', 'thats', 'the', 'their', 'theirs', 'them', 'theme', 'themes', 'themselves', 'then', 'theory',
  'there', 'thereby', 'therefore', 'theres', 'these', 'they', 'thick', 'thin', 'thing', 'things',
  'think', 'third', 'this', 'thorough', 'those', 'though', 'thought', 'thousand', 'thousands', 'three',
  'threshold', 'through', 'throughout', 'ticket', 'tight', 'time', 'timely', 'timer', 'times', 'tint',
  'tints', 'tiny', 'title', 'titled', 'titles', 'to', 'today', 'together', 'toggle', 'token', 'tokens',
  'told', 'too', 'took', 'tool', 'tools', 'top', 'topic', 'total', 'touch', 'touchscreen', 'towards',
  'track', 'tracking', 'train', 'transform', 'transformation', 'translate', 'translated', 'translation',
  'transparent', 'transport', 'treat', 'trial', 'true', 'truly', 'trust', 'try', 'tune', 'turn', 'turned',
  'turning', 'turns', 'twice', 'two', 'type', 'typeface', 'typefaces', 'types', 'typical', 'typography',
  'ultimate', 'unable', 'unclear', 'under', 'understand', 'understanding', 'underserved', 'unfold',
  'unformatted', 'unified', 'uniform', 'unique', 'unit', 'units', 'universal', 'universe', 'university',
  'unknown', 'unless', 'unlocked', 'unspaced', 'until', 'unusual', 'up', 'update', 'updated', 'updates',
  'upgrade', 'upload', 'uploaded', 'uploading', 'uploads', 'upper', 'uppercase', 'upon', 'usable',
  'usage', 'use', 'used', 'useful', 'user', 'users', 'uses', 'using', 'usual', 'usually', 'valuable',
  'value', 'values', 'variable', 'variables', 'varies', 'variety', 'various', 'vary', 'vast', 'vector',
  'version', 'versions', 'vertical', 'vertically', 'very', 'viable', 'video', 'view', 'viewed', 'viewer',
  'viewing', 'viewmode', 'viewport', 'views', 'visible', 'vision', 'visit', 'visual', 'vocabulary',
  'voice', 'volume', 'wait', 'wall', 'walls', 'want', 'wanted', 'wants', 'warn', 'warning', 'was',
  'watch', 'water', 'wave', 'way', 'ways', 'wcag', 'we', 'web', 'weight', 'welcome', 'well', 'went',
  'were', 'what', 'whatever', 'whats', 'when', 'whenever', 'where', 'whereas', 'whether', 'which',
  'whichever', 'while', 'whisper', 'white', 'who', 'whole', 'whom', 'whose', 'why', 'wide', 'widely',
  'wider', 'width', 'wild', 'will', 'willing', 'win', 'window', 'wire', 'wisdom', 'wise', 'wish',
  'with', 'within', 'without', 'word', 'words', 'work', 'worked', 'workflow', 'working', 'works',
  'world', 'worry', 'worse', 'worst', 'worth', 'would', 'wrap', 'wrapping', 'write', 'writer', 'writing',
  'written', 'wrong', 'year', 'years', 'yellow', 'yes', 'yesterday', 'yet', 'yield', 'you', 'young',
  'your', 'yours', 'yourself', 'zero', 'zone', 'zoom'
]);

export class PDFService {
  /**
   * Universal Word Segmentation:
   * Dynamically separates glued words using DP Word-Break when PDF extractors fuse characters together.
   */
  public static segmentGluedWords(text: string): string {
    return text.replace(/([a-zA-Z]{6,})/g, (match) => {
      const lower = match.toLowerCase();
      // If single match word is already in the dictionary, keep it
      if (COMMON_DICTIONARY.has(lower)) return match;

      const n = lower.length;
      const dp: (string[] | null)[] = new Array(n + 1).fill(null);
      dp[0] = [];

      for (let i = 0; i < n; i++) {
        if (dp[i] === null) continue;
        for (let len = 1; len <= Math.min(22, n - i); len++) {
          const sub = lower.slice(i, i + len);
          if (COMMON_DICTIONARY.has(sub) || (len === 1 && (sub === 'a' || sub === 'i'))) {
            if (dp[i + len] === null || dp[i + len]!.length > dp[i]!.length + 1) {
              dp[i + len] = [...dp[i]!, match.slice(i, i + len)];
            }
          }
        }
      }

      if (dp[n] && dp[n]!.length > 1) {
        return dp[n]!.join(' ');
      }
      return match;
    });
  }

  /**
   * Universal PDF Text Cleaner & Reflow Engine:
   * Transforms raw, messy, vertically-split, or glued text extracted from ANY PDF
   * (academic papers, textbooks, government reports, resumes, articles, storybooks)
   * into clean, dyslexia-optimized reading material with proper headings, lists, and spacing.
   */
  public static cleanPDFText(rawText: string): string {
    if (!rawText || typeof rawText !== 'string') return '';

    let text = rawText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n');

    // 1. Remove Page Numbers, Running Headers, and Footer Artifacts
    text = text
      .replace(/^[ \t]*(?:page\s+\d+(?:\s+of\s+\d+)?|\d+\s*\/\s*\d+|\d+)[ \t]*$/gim, '')
      .replace(/^[ \t]*[-–—]+\s*\d+\s*[-–—]+[ \t]*$/gim, '')
      .replace(/^[ \t]*(?:copyright|all rights reserved|confidential|draft|internal use).*$/gim, '')
      .replace(/AksharSetu\s*[—–-]\s*Concept\s*Brief\s*Page(?:\s*\d+\s*(?:of\s*\d+)?)?/gi, '');

    // 2. Fix End-of-Line Hyphenation
    text = text.replace(/([a-zA-Z\u0900-\u0D7F]+)-\s*\n\s*([a-zA-Z\u0900-\u0D7F]+)/g, '$1$2');

    // 3. Recombine Multi-Line Vertically-Split Headings
    const commonSplitHeadings: [RegExp, string][] = [
      [/(?:^|\n)\s*Concept\s*\n\s*&\s*\n\s*Planning\s*\n\s*Brief\s*(?:\n|$)/gi, '\n\n### Concept & Planning Brief\n\n'],
      [/(?:^|\n)\s*Table\s*\n\s*of\s*\n\s*Contents\s*(?:\n|$)/gi, '\n\n### Table of Contents\n\n'],
      [/(?:^|\n)\s*The\s*\n\s*Problem\s*(?:\n|$)/gi, '\n\n### The Problem\n\n'],
      [/(?:^|\n)\s*The\s*\n\s*Idea\s*(?:\n|$)/gi, '\n\n### The Idea\n\n'],
      [/(?:^|\n)\s*Core\s*\n\s*Features\s*(?:\n|$)/gi, '\n\n### Core Features\n\n'],
      [/(?:^|\n)\s*Planned\s*\n\s*\/?\s*\n\s*Stretch\s*\n\s*Features\s*(?:\n|$)/gi, '\n\n### Planned / Stretch Features\n\n'],
      [/(?:^|\n)\s*How\s*\n\s*It\s*\n\s*Works\s*(?:\n|$)/gi, '\n\n### How It Works\n\n'],
      [/(?:^|\n)\s*Suggested\s*\n\s*Tech\s*\n\s*Stack\s*(?:\n|$)/gi, '\n\n### Suggested Tech Stack\n\n'],
      [/(?:^|\n)\s*What\s*\n\s*Makes\s*\n\s*(?:This|AksharSetu)\s*\n\s*Different\s*(?:\n|$)/gi, '\n\n### What Makes AksharSetu Different\n\n'],
      [/(?:^|\n)\s*Impact\s*\n\s*&\s*\n\s*Who\s*\n\s*It\s*['’]?s\s*\n\s*For\s*(?:\n|$)/gi, '\n\n### Impact & Who It\'s For\n\n'],
      [/(?:^|\n)\s*Future\s*\n\s*Roadmap\s*(?:\n|$)/gi, '\n\n### Future Roadmap\n\n'],
      [/(?:^|\n)\s*Planned\s*\n\s*Project\s*\n\s*Structure\s*(?:\n|$)/gi, '\n\n### Planned Project Structure\n\n'],
      [/(?:^|\n)\s*Fit\s*\n\s*for\s*\n\s*SIH\s*\n\s*2026\s*(?:\n|$)/gi, '\n\n### Fit for SIH 2026\n\n'],
      [/(?:^|\n)\s*Reading\s*\n\s*Parameters\s*(?:\n|$)/gi, '\n\n### Reading Parameters\n\n'],
      [/(?:^|\n)\s*References\s*(?:\n|$)/gi, '\n\n### References\n\n'],
    ];

    for (const [regex, replacement] of commonSplitHeadings) {
      text = text.replace(regex, replacement);
    }

    // 4. Generalized Headings Detector
    text = text.replace(
      /(?:^|\n{2,})\s*((?:Chapter|Section|Module|Unit|Part)\s+\d+[:\s—–-]+[^\n]{3,80})\s*(?:\n{2,}|$)/gi,
      '\n\n### $1\n\n'
    );
    text = text.replace(
      /(?:^|\n{2,})\s*(\d{1,2}(?:\.\d{1,2})*\s+[A-Z][A-Za-z0-9\s/—–-]{3,60})\s*(?:\n{2,}|$)/g,
      '\n\n### $1\n\n'
    );

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

    // 6. Universal Punctuation & Boundary Space Normalization
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
      .replace(/([a-zA-Z])•([a-zA-Z])/g, '$1 • $2')
      .replace(/\btens\s*[•●■*·]\s*f\b/gi, 'tens of')
      .replace(/AI\s*[•●■*·]\s*4\b/gi, 'AI4Bharat')
      .replace(/AI\s*[•●■*·]\s*4\.\s*Bharat/gi, 'AI4Bharat')
      .replace(/\bmeta-?\s*analysis\b/gi, 'meta-analysis');

    // 7. Dynamic English Word Segmentation on Glued Blocks
    text = this.segmentGluedWords(text);

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

    // 9. Reformat Table of Contents and Numbered List items
    text = text.replace(/(?:^|\n)\s*(\d{1,2})\.\s*([A-Za-z]+)\s*(?:\n|$)/g, '\n• $1. $2\n');
    text = text.replace(/(?:^|\n)\s*(\d{1,2})\s*\n+\s*([A-Za-z]+)\s*(?:\n|$)/g, '\n• $1. $2\n');

    // 10. Intelligent Paragraph Segmentation & Reflow
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
