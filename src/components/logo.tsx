import styled from "styled-components"

export const Logo = styled.figure.attrs<{ $width?: string | null; $height: string | null; }>(props => ({
  type: "text",
  $width: props.$width || "100px",
  $height: props.$height || "100px"
}))`
  background: url(/dronitter-logo.svg) no-repeat center;
  width: ${props => props.$width};
  height: ${props => props.$height};

  &.white {
    background-image: none;
    background-color: var(--wht);
    mask: url(/dronitter-logo.svg) no-repeat center;
  }
`
