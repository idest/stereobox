import React from 'react';
import styled from 'styled-components';
import { media } from '../utils/style';
import Tabs from './Tabs';
import Tab from './Tabs/Tab';
import HelpIcon from '../assets/question-circle';
import logo from '../assets/logo.png';
import TopBar from './TopBar';
import enMessages from '../locales/layout/en/messages.json';
import esMessages from '../locales/layout/es/messages.json';

const messages = {
  en: enMessages,
  es: esMessages
};

export class MobileLayout extends React.Component {
  render() {
    const children = React.Children.toArray(this.props.children);
    const { locale } = this.props;
    return (
      <AppWrapper>
        <TopBar locale={locale} />
        <MainSection>
          <Content>
            {children.find(child => child.props.name === 'readings')}
            <TabsWrapper>
              <Tabs>
                <Tab title={messages[locale].geocompassTab}>
                  <GeoCompassWrapper>
                    {children.find(child => child.props.name === 'geocompass')}
                  </GeoCompassWrapper>
                </Tab>
                <Tab title={messages[locale].schmidtnetTab}>
                  <SchmidtNetWrapper>
                    {children.find(child => child.props.name === 'schmidtnet')}
                  </SchmidtNetWrapper>
                </Tab>
                <Tab title={messages[locale].contextTab}>
                  <ContextWrapper>
                    {children.find(child => child.props.name === 'context')}
                  </ContextWrapper>
                </Tab>
              </Tabs>
            </TabsWrapper>
          </Content>
        </MainSection>
      </AppWrapper>
    );
  }
}

export class DesktopLayout extends React.Component {
  render() {
    const children = React.Children.toArray(this.props.children);
    const { locale } = this.props;
    return (
      <AppWrapper>
        <TopBar locale={locale} />
        <MainSection>
          <Title>Geo Compass</Title>
          <SubtitleContainer>
            <Subtitle>{messages[locale].subtitle}</Subtitle>
            <Icon active={this.props.showHelp}>
              <HelpIcon
                active={this.props.showHelp}
                onClick={this.props.toggleHelp}
              />
            </Icon>
          </SubtitleContainer>
          <Content>
            <ControlsSection>
              <ReadingsWrapper>
                {children.find(child => child.props.name === 'readings')}
              </ReadingsWrapper>
              <GeoCompassWrapper>
                {children.find(child => child.props.name === 'geocompass')}
              </GeoCompassWrapper>
            </ControlsSection>
            <VisualizationsSection>
              <SchmidtNetWrapper>
                {children.find(child => child.props.name === 'schmidtnet')}
              </SchmidtNetWrapper>
              <ContextWrapper>
                {children.find(child => child.props.name === 'context')}
              </ContextWrapper>
            </VisualizationsSection>
          </Content>
          <LogoContainer>
            <StyledA href="https://idest.github.io">
              <Logo src={logo} />
            </StyledA>
          </LogoContainer>
        </MainSection>
      </AppWrapper>
    );
  }
}

const AppWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const MainSection = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 400px;
  width: auto;
  padding: 30px;
  justify-content: center;
  background: ${props => props.theme.bgColor};
  color: ${props => props.theme.fgColorD20};
  ${media.tablet`
    width: 640px;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  `};
  ${media.desktop`
    width: 960px;
  `};
`;

const Title = styled.h1`
  ${media.tablet`
    margin-bottom: 0.5em;
  `};
  ${media.desktop`
    width: 100%;
    color: ${props => props.theme.fgColorD20};
  `};
`;

const SubtitleContainer = styled.div`
  ${media.tablet`
    display: none;
  `};
  ${media.desktop`
    position: relative
    display: flex;
    flex-wrap: wrap;
    height: 2em;
    width: 100%;
    justify-content: flex-start;
    align-items: flex-start;
    margin-bottom: 5px;
  `};
`;

const Subtitle = styled.h3`
  position: absolute;
  margin: 0;
  width: 100%;
  left: 50%;
  transform: translateX(-50%);
  color: ${props => props.theme.fgColorD40};
  z-index: 0;
`;

const Icon = styled.span`
  display: flex;
  height: 20px;
  width: 20px;
  margin-left: auto;
  cursor: pointer;
  z-index: 1;
  > svg {
    width: 100%;
    height: 100%;
    fill: ${props =>
      props.active ? props.theme.fgColorD20 : props.theme.fgColorD40};
    &:hover {
      fill: ${props => props.theme.fgColorD20};
    }
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  border: solid 2px ${props => props.theme.bgColorL40};
  ${media.tablet`
    flex-direction: row;
    max-height: 500px;
  `};
`;

const TabsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden; //moz fix
`;

const ReadingsWrapper = styled.div``; // Geo..Wrapper overlaps Readings w/o this

const GeoCompassWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 200px; // if not present height gets really big in moz
`;

const ControlsSection = styled.div`
  ${media.tablet`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: 45%;
    border-right: 2px solid ${props => props.theme.bgColorL40};
  `};
  ${media.desktop`
    width: 30%;
  `};
`;

const VisualizationsSection = styled.div`
  ${media.tablet`
    display: flex;
    flex-direction: column;
    width: 55%;
  `};
  ${media.desktop`
    flex-direction: row;
    width: 70%;
  `};
`;

const SchmidtNetWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 200px;
  ${media.desktop`
  flex: 4;
  `};
`;

const ContextWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 200px;
  border-top: 1px solid ${props => props.theme.bgColorL40};
  ${media.tablet`
    border-top: 2px solid ${props => props.theme.bgColorL40};
  `};
  ${media.desktop`
    flex: 3;
    border-top: 0;
    border-left: 2px solid ${props => props.theme.bgColorL40};
  `};
`;

const LogoContainer = styled.div`
  display: flex;
  position: absolute;
  left: 20px;
  top: 15px;
  /*
  right: 30px;
  bottom: 15px;
  */
  height: 40px;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.img`
  height: 40px;
`;

const StyledA = styled.a`
  opacity: 0.35;
  &:hover {
    opacity: 0.75;
  }
`;
