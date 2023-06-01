import { css } from 'styled-components';
import browser from 'webextension-polyfill';

const robotoRegular = browser.runtime.sendMessage({ greeting: "roboregular" });
const robotoMedium = browser.runtime.sendMessage({ greeting: "robomedium" });

const styles = css`
  font-family: Roboto, sans-serif;
  font-size: 16px;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  background-color: ${props => props.theme.palette.primary};
  color: ${props => props.theme.font.primary};

  @font-face {
    font-family: Roboto;
    src: url(${robotoRegular}) url(${robotoMedium});
  }
`;

export default styles;
