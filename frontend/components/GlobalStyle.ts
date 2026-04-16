import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: system-ui, 'Segoe UI', Roboto, sans-serif;
    /* background and color now set by ThemeProvider */
  }
`;

export default GlobalStyle;
