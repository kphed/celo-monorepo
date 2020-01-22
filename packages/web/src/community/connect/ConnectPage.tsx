import * as React from 'react'
import { View } from 'react-native'
import Fade from 'react-reveal/Fade'
import Community from 'src/community/connect/Community'
import Growth from 'src/community/connect/Growth'
import Tenets from 'src/community/connect/Tenets'
import ConnectCover from 'src/community/ConnectCover'
import { H3 } from 'src/fonts/Fonts'
import OpenGraph from 'src/header/OpenGraph'
import { I18nProps, NameSpaces, withNamespaces } from 'src/i18n'
import { Cell, GridRow, Spans } from 'src/layout/GridRow'
import ConnectionFooter from 'src/shared/ConnectionFooter'
import { hashNav } from 'src/shared/menu-items'
import { standardStyles } from 'src/styles'
import ArticleData from './ArticleData'
import EventData from './EventsData'

const preview = require('src/community/connect/preview.jpg')

type Props = I18nProps

// only send used translations to the client
const NAME_SPACES = ['common', 'community']

export class ConnectPage extends React.Component<Props> {
  // This is Next.js method that runs serverside. it is only available on page components
  static getInitialProps = () => {
    return {
      namespacesRequired: NAME_SPACES,
    }
  }

  render() {
    const { t } = this.props
    return (
      <>
        <OpenGraph
          path="/community"
          title={t('pageTitle')}
          description={
            'Celo is building a monetary system that allows more people to participate, and we invite you to join the conversation and our community. Diverse perspectives and inclusive conversations welcomed.'
          }
          image={preview}
        />
        <View style={standardStyles.sectionMarginTop}>
          <ConnectCover />
          <Community />
          <GridRow
            nativeID={hashNav.connect.events}
            desktopStyle={standardStyles.sectionMarginTop}
            mobileStyle={standardStyles.sectionMarginTopMobile}
          >
            <Cell span={Spans.full}>
              <Fade bottom={true} distance={'20px'}>
                <H3>{t('events.title')}</H3>
              </Fade>
            </Cell>
          </GridRow>
          <EventData />
          <Growth />
          <ArticleData />
          <Tenets />
          <View nativeID={hashNav.connect.newsletter}>
            <ConnectionFooter includeDividerLine={true} />
          </View>
        </View>
      </>
    )
  }
}

export default withNamespaces(NameSpaces.community)(ConnectPage)
