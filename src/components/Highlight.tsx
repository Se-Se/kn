import React, { useMemo } from 'react'
import styled from '@emotion/styled/macro'

const Mark = styled.mark`
  background: yellow;
`

export type HighlightArgs = {
  text: string
  regex: RegExp
  whole: RegExp
}

function reEscape(str: string) {
  // http://kevin.vanzonneveld.net
  // +   original by: booeyOH
  // +   improved by: Ates Goral (http://magnetiq.com)
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   bugfixed by: Onno Marsman
  // *     example 1: preg_quote("$40");
  // *     returns 1: '\$40'
  // *     example 2: preg_quote("*RRRING* Hello?");
  // *     returns 2: '\*RRRING\* Hello\?'
  // *     example 3: preg_quote("\\.+*?[^]$(){}=!<>|:");
  // *     returns 3: '\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:'

  return str.replace(/([\\\].+*?[^$(){}=!<>|:])/g, "\\$1")
}

export function makeArgs(key: string): HighlightArgs {
  return {
    text: key,
    regex: new RegExp(`(${reEscape(key)})`, 'gi'),
    whole: new RegExp(`^(${reEscape(key)})$`, 'i'),
  }
}

const HighlightLimit = 1_000
function highlight(s: any, args?: HighlightArgs) {
  if (args === undefined || typeof s !== 'string') {
    return s
  }

  let count = 0
  const { regex, whole } = args
  const out = s.split(regex).map((i, idx) => (whole.test(i) && (count++ < HighlightLimit)) ? <Mark key={idx++}>{i}</Mark> : i)
  return out
}

type HighlightProps = {
  keyword?: HighlightArgs | string
}

export const Highlight: React.FC<HighlightProps> = ({ children, keyword }) => {
  const args = useMemo(() => {
    if (typeof keyword === 'string') {
      return makeArgs(keyword)
    }
    return keyword
  }, [keyword])
  return <>{highlight(children, args)}</>
}
