import React, { useState, useMemo, useContext, useCallback } from 'react'
import { FluentBundle, FluentResource } from '@fluent/bundle'
import { LocalizationProvider, Localized, LocalizedProps, ReactLocalization, useLocalization } from '@fluent/react'
import { useMount } from 'hooks/common'
import { negotiateLanguages } from '@fluent/langneg'
import { zh_CN } from './zh_CN'
import { en } from './en'
import { NavMenu, List, ConfigProvider, Icon } from '@tencent/tea-component'
import { functions } from './functions'
import { Redirect } from 'react-router-dom'
import { Language } from 'generated/graphql'
import styled from '@emotion/styled'

interface UserLangType {
  lang: readonly string[]
  setLang: (s: readonly string[]) => void
}
const UserLangContext = React.createContext<UserLangType>({
  lang: ['zh-CN'],
  setLang: () => void 0
})

function fromEntries<T>(ary: [string, T][]): Record<string, T> {
  let out: Record<string, T> = {}
  for (const [key, value] of ary) {
    out[key] = value
  }
  return out
}
const join = (dict: Record<string, string>): string => {
  return Object.entries(dict).map(([k, v]) => `${k} = ${v}`).join('\n')
}
const MessageAll: Record<string, string> = {
  'zh-CN': join(zh_CN),
  'en': join(en),
}
const AvaliableLangs = Object.keys(MessageAll)
const MessageBundles: Record<string, FluentBundle> = fromEntries(
  Object.entries(MessageAll).map(([locale, content]) => {
    const bundle = new FluentBundle(locale, {
      functions
    })
    bundle.addResource(new FluentResource(content))
    return [locale, bundle]
  })
)

function* generateMessages(currentLocales: readonly string[]) {
  for (const locale of currentLocales) {
    if (MessageBundles.hasOwnProperty(locale)) {
      yield MessageBundles[locale]
    }
  }
}

type I18nProviderProps = {
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [lang, setLangOri] = useState(navigator.languages)
  const setLang = (s: readonly string[]) => {
    if (s.length > 0) {
      localStorage.setItem('lang', s[0])
    }

    const currentLocales = negotiateLanguages(
      [...s, ...navigator.languages, 'en'],
      AvaliableLangs,
      { defaultLocale: 'en' }
    )

    setLangOri(currentLocales)
  }

  useMount(() => {
    const lastSelected = []
    const lang = localStorage.getItem('lang')
    if (lang) {
      lastSelected.push(lang)
    }
    setLang(lastSelected)
  })

  const eLang = useMemo(() => {
    if (process.env.REACT_APP_LOCK_LANG) {
      return [process.env.REACT_APP_LOCK_LANG, ...lang]
    } else {
      return lang
    }
  }, [lang])

  const l10n = useMemo(() => new ReactLocalization(generateMessages(eLang)), [eLang])

  const teaLocale = eLang[0] === 'zh-CN' ? 'zh' : 'en'
  return <UserLangContext.Provider value={useMemo(() => ({
    lang: eLang,
    setLang,
  }), [eLang])}>
    <LocalizationProvider l10n={l10n}>
      <ConfigProvider locale={teaLocale}>
        {children}
      </ConfigProvider>
    </LocalizationProvider>
  </UserLangContext.Provider>
}

export const useLanguage = () => {
  const ctx = useContext(UserLangContext)
  return ctx.lang
}
export const useCurLanguage = () => {
  const ctx = useContext(UserLangContext)
  return ctx.lang[0]
}
export const useGqlLanguage = () => {
  const lang = useCurLanguage()
  return {
    language: lang === 'zh-CN' ? Language.Zh : Language.En
  }
}

export const useGetMessage: () => (id: string, params?: Record<string, string>, defaultText?: string) => string = () => {
  const { l10n } = useLocalization()
  return useMemo(() => l10n.getString.bind(l10n), [l10n])
}

const LangSelect: React.FC = () => {
  const lang = useCurLanguage()
  return <Localized id='lang-display'>
    {lang}
  </Localized>
}

const SelectLang: React.FC<{ lang: string }> = ({ lang }) => {
  const ctx = useContext(UserLangContext)

  return <List.Item onClick={useCallback(() => {
    ctx.setLang([lang])
  }, [lang, ctx])}>
    {MessageBundles[lang].getMessage('lang-display')?.value ?? lang}
  </List.Item>
}

export const I18nItem: React.FC = () => {
  if (process.env.REACT_APP_LOCK_LANG) {
    return <></>
  }
  return <NavMenu.Item
    type='dropdown'
    overlay={<List type='option'>
      {AvaliableLangs.map(lang => <SelectLang key={lang} lang={lang} />)}
    </List>}
  >
    <LangSelect />
  </NavMenu.Item>
}

const Gray = styled.span`
  color: #444444;
`
const Format = {
  strong: <strong></strong>,
  br: <br />,
  RedirectLogin: <Redirect to='/login' />,
  ExternalLink: <Icon type='externallink' />,
  Export: <Icon type='download' />,
  Gray: <Gray></Gray>,
  List: <List></List>,
  ListItem: <List.Item></List.Item>,
}
const FormatLocalized: React.FC<LocalizedProps> = ({ children, ...props }) => {
  return <Localized {...props} elems={Format}>{children ?? <>{props.id}</>}</Localized>
}

export const localizedTabs = (ids: string[]) => {
  return ids.map(id => ({
    id,
    label: <Localized id={`tabs-${id}`} />
  }))
}

export const localizedOptions = (prefix: string, values: readonly string[]) => {
  return values.map(value => ({
    value,
    text: <Localized id={`${prefix}${value}`} />
  }))
}

export {
  FormatLocalized as Localized
}
