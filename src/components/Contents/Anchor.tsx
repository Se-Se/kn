import React from 'react'

// eslint-disable-next-line jsx-a11y/anchor-is-valid
export const Anchor: React.FunctionComponent<{ id: string }> = ({ children, id }) => <a data-scroll='title' data-id={id} id={id}>{children}</a>
