import { useState, useEffect, useCallback, useRef } from 'react'

const activeCls = 's-active'

export function scrollToView(child: HTMLElement, parent: HTMLElement) {
  const childTop = child.offsetTop
  const childBottom = childTop + child.offsetHeight
  if (childTop - parent.scrollTop < 0) {
    parent.scrollTop = childTop
  }
  if (childBottom - parent.scrollTop > parent.offsetHeight) {
    parent.scrollTop = childBottom - parent.offsetHeight
  }
}

export const useScrollWrapper = (selector: string) => {
  const [ref, setRef] = useState<HTMLDivElement | null>(null)
  const [self, setSelf] = useState<HTMLElement | null>(null)
  const lastScrollTop = useRef(-1)

  const onScroll = useCallback(() => {
    try {
      if (!self) return
      const sTop = self.scrollTop
      if (lastScrollTop.current === sTop) return
      lastScrollTop.current = sTop

      const offsetTop = (e: HTMLElement) => {
        let offsetTop = 0
        let t = e
        while (t) {
          offsetTop += t.offsetTop
          t = t.offsetParent! as HTMLElement
          if (t.contains(self)) {
            return offsetTop
          }
        }
        console.warn('target not reached', e, self)
        return -1
      }

      const containner = self.querySelector('[data-scroll=containner]')
      const contents = self.querySelector('div[data-scroll=contents]') as HTMLDivElement
      if (!containner || !contents || !self) {
        return
      }

      const titles = Array.from(containner.querySelectorAll('a[data-scroll=title]')) as HTMLAnchorElement[]
      const actives = Array.from(contents.querySelectorAll('a.s-active'))

      for (let a of actives) {
        a.classList.remove(activeCls)
      }
      if (offsetTop(titles[0]) > sTop) {
        return
      }

      for (let a of titles.reverse()) {
        if (offsetTop(a) <= sTop) {
          const ca = contents.querySelector(`a[data-id=${a.getAttribute('data-id')}]`) as HTMLAnchorElement
          if (ca) {
            ca.classList.add(activeCls)
            scrollToView(ca.parentElement!, contents)
            break
          }
        }
      }
    } catch (e) {
      console.warn(e)
    }
  }, [self])

  useEffect(() => {
    let c: HTMLElement | null | undefined = ref
    while (c) {
      const containner = c.querySelector(selector)
      if (containner) {
        setSelf(containner as HTMLElement)
      }
      c = c?.parentElement
    }
  }, [ref, selector])

  useEffect(() => {
    if (self) {
      self.addEventListener('scroll', onScroll)
      return () => self.removeEventListener('scroll', onScroll)
    }
  }, [self, onScroll])

  return setRef
}
