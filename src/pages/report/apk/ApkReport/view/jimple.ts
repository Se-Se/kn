export default function jimpleHighlight(hljs: any) {
  const JAVA_IDENT_RE = '[\u00C0-\u02B8a-zA-Z_$][\u00C0-\u02B8a-zA-Z_$0-9.]*';
  const GENERIC_IDENT_RE = `${JAVA_IDENT_RE}(<${JAVA_IDENT_RE}(\\s*,\\s*${JAVA_IDENT_RE})*>)?`;
  const KEYWORDS =    'false synchronized int abstract float private char boolean var static null if const '
    + 'for true while long strictfp finally protected import native final void '
    + 'enum else break transient catch instanceof byte super volatile case assert short '
    + 'package default double public try this switch continue throws protected public private '
    + 'module requires exports do staticinvoke virtualinvoke';

  // https://docs.oracle.com/javase/7/docs/technotes/guides/language/underscores-literals.html
  const JAVA_NUMBER_RE = '\\b'
    + '('
    + '0[bB]([01]+[01_]+[01]+|[01]+)' // 0b...
    + '|'
    + '0[xX]([a-fA-F0-9]+[a-fA-F0-9_]+[a-fA-F0-9]+|[a-fA-F0-9]+)' // 0x...
    + '|'
    + '('
    + '([\\d]+[\\d_]+[\\d]+|[\\d]+)(\\.([\\d]+[\\d_]+[\\d]+|[\\d]+))?'
    + '|'
    + '\\.([\\d]+[\\d_]+[\\d]+|[\\d]+)'
    + ')'
    + '([eE][-+]?\\d+)?' // octal, decimal, float
    + ')'
    + '[lLfF]?';
  const JAVA_NUMBER_MODE = {
    className: 'number',
    begin: JAVA_NUMBER_RE,
    relevance: 0,
  };
  const FUNCTION_NAME_MODE = {
    className: 'function',
    begin: `(${GENERIC_IDENT_RE}\\s+)+${hljs.UNDERSCORE_IDENT_RE}\\s*\\(`,
    returnBegin: true,
    end: /[)>]/,
    returnEnd: true,
    keywords: KEYWORDS,
    contains: [
      {
        begin: `${hljs.UNDERSCORE_IDENT_RE}\\s*\\(`, returnBegin: true,
        relevance: 0,
        contains: [hljs.UNDERSCORE_TITLE_MODE],
      },
      {
        className: 'params',
        begin: /\(/, end: /\)/,
        keywords: KEYWORDS,
        relevance: 0,
        contains: [
          hljs.APOS_STRING_MODE,
          hljs.QUOTE_STRING_MODE,
          hljs.C_NUMBER_MODE,
          hljs.C_BLOCK_COMMENT_MODE,
        ],
      },
    ],
  };
  // const FUNCTION_NAME_MODE_NO = {
  //   className: 'function',
  //   begin: '(' + GENERIC_IDENT_RE + '\\s+)+' + hljs.UNDERSCORE_IDENT_RE + '\\s*\\(', returnBegin: true, end: /[{;=>]/,
  //   excludeEnd: true,
  //   keywords: KEYWORDS,
  //   contains: [
  //     {
  //       begin: hljs.UNDERSCORE_IDENT_RE + '\\s*\\(', returnBegin: true,
  //       relevance: 0,
  //       contains: [hljs.UNDERSCORE_TITLE_MODE]
  //     },
  //     {
  //       className: 'params',
  //       begin: /\(/, end: /\)/,
  //       keywords: KEYWORDS,
  //       relevance: 0,
  //       contains: [
  //         hljs.APOS_STRING_MODE,
  //         hljs.QUOTE_STRING_MODE,
  //         hljs.C_NUMBER_MODE,
  //         hljs.C_BLOCK_COMMENT_MODE
  //       ]
  //     },
  //     hljs.C_LINE_COMMENT_MODE,
  //     hljs.C_BLOCK_COMMENT_MODE
  //   ]
  // }

  return {
    keywords: KEYWORDS,
    illegal: /<\/|#/,
    contains: [
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      JAVA_NUMBER_MODE,
      {
        className: 'signature',
        begin: '<',
        end: '>',
        keywords: KEYWORDS,
        contains: [
          FUNCTION_NAME_MODE,
          {
            // className: 'type',
            begin: /(\w+\.)*\w+/,
            end: /:\s/,
            excludeEnd: true,
          },
        ],
      },
      {
        className: 'meta',
        begin: '\\[\\d+\\]', // @[A-Za-z]+
      },
      {
        className: 'name',
        begin: /\$r\d+/,
      },
    ],
  };
};
