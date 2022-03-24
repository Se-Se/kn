/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_LOCK_LANG: 'zh' | 'en'
    REACT_APP_LOCAL_DOC?: string
  }
}
