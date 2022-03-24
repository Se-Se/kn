import styled from "@emotion/styled";
import { Button } from "@tencent/tea-component";
import React from "react";

export const WeakButton = styled((props) => <Button {...props} type="weak">{props.children}</Button>)`
  color: black;
`
