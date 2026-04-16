import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: 'Space Grotesk', system-ui, sans-serif;
    background-color: #0e0e0e;
    color: #ffffff;
    min-height: 100dvh;
  }

  ::selection {
    background: #c3f400;
    color: #000;
  }

  .material-symbols-outlined {
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    font-family: 'Material Symbols Outlined';
  }
`;

export default GlobalStyle;
