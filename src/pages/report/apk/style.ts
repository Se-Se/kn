import { css } from '@emotion/core';

export const Style = css`
.markdown-dialog-icon {
  cursor: pointer;
  .plaint-icon {
    width: 16px;
    height: 16px;
  }
}
.exp-chain {
  pre {
    display: block;
    overflow-x: auto;
    padding: 1em 0.5em;
    background: #f0f0f0;
    color: #444444;
  }
}
.icfg-view {
  div {
    &.path-view {
      width: 100%;
      display: flex;
      flex-direction: row;
      line-height: 1.5em;
      max-height: 600px;
      overflow-y: auto;
      .path {
        flex: none;
        pre {
          max-width: 100px;
          overflow-x: auto;
          background: #f0f0f0;
          text-align: center;
          display: block;
          padding: 1em 1em 1em 1em;
          padding-right: 0;
          color: #444444;
          code {
            &:not(:empty) {
              background: #ddd;
              padding: 0 0.5em;
              height: 20px;
              border-radius: 5px;
            }
          }
          span {
            &:not(.empty) {
              display: inline-block;
              width: 100%;
              position: relative;
            }
          }
        }
      }
      .code {
        width: 1px;
        flex: auto;
        & > div {
          padding-left: 1.5em;
          background: #f0f0f0;
        }
      }
    }
  }
}
.suggestion {
  margin-top: 1em;
  line-height: 2em;
  pre {
    line-height: 1.5em;
  }
}
.intent-1 {
  padding-left: 2em;
}
.manifest {
  hr {
    margin: 0;
  }
  .signature {
    .kv-key {
      color: #999 !important;
    }
  }
  .exported-components {
    .kv-key {
      border-right: 1px solid #eef0f4;
    }
  }
  h2 {
    padding: 1em 0 0 0;
  }
  h3 {
    padding-top: 1em;
  }
}
.check-block {
  h3 {
    margin-bottom: 1em;
  }
}
details {
  summary {
    cursor: pointer;
    h3 {
      display: inline;
    }
    &:focus {
      outline: 0;
    }
  }
}
.activity-name {
  display: block;
  margin-bottom: 1.5em;
  font-size: 1.1em;
}
.constant-key {
  .code-div {
    display: block;
    padding: 0.5em;
    background: #f0f0f0;
    color: #444444;
    margin: 1em 0px;
    code {
      word-break: break-all;
    }
  }
}
table.icfg-view, table.cfg-view, table.table-list {
  table-layout: fixed;
  border-collapse: collapse;
  width: 100%;
}
table.icfg-view tr td, table.cfg-view tr td, table.table-list tr td {
  padding: 0;
}
table.icfg-view tr td:first-of-type, table.cfg-view tr td:first-of-type, table.table-list tr td:first-of-type {
  width: 2em;
  vertical-align: top;
}
table.icfg-view tr td:first-of-type span, table.cfg-view tr td:first-of-type span, table.table-list tr td:first-of-type span {
  border-right: 1px solid #eef0f4;
  text-align: left;
  padding-right: 0.8em;
  display: inline-block;
}
table.icfg-view tr td:nth-of-type(2) > div, table.cfg-view tr td:nth-of-type(2) > div, table.table-list tr td:nth-of-type(2) > div {
  margin-bottom: 10px;
}
.icfg-view div.path-view .path pre code.first, .icfg-view div.path-view .path pre code.last {
  background: #0abf5b;
  color: #fff;
}
.manifest .permission h2, .manifest .thirdparty h2 {
  padding-right: 1em;
}
.manifest .permission .kvpair, .manifest .thirdparty .kvpair {
  width: 100%;
  word-break: break-all;
}
.manifest .permission .kv-index, .manifest .thirdparty .kv-index {
  width: 1px;
}
.manifest .permission .kv-index .no, .manifest .thirdparty .kv-index .no {
  display: inline-block;
  padding-right: 10px;
  line-height: 30px;
  white-space: nowrap;
}
.manifest .permission .kv-key, .manifest .thirdparty .kv-key {
  border-left: 1px solid #eef0f4;
  padding-left: 10px;
}
.manifest .permission .kv-level, .manifest .thirdparty .kv-level {
  padding-right: 20px;
}
.manifest .permission .kv-level .legend, .manifest .thirdparty .kv-level .legend {
  width: 20px;
  height: 10px;
}
.manifest .permission .kv-value, .manifest .thirdparty .kv-value {
  width: 50%;
}
.markdown-dialog {
  .markdown {
    overflow-x: auto;
  }
}
`;
