import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { H1, H4 } from 'src/fonts/Fonts'
import EmailForm, { After } from 'src/forms/EmailForm'
import { I18nProps, NameSpaces, withNamespaces } from 'src/i18n'
import { Cell, GridRow, Spans } from 'src/layout/GridRow'
import AspectRatio from 'src/shared/AspectRatio'
import { colors, standardStyles, textStyles } from 'src/styles'

export default withNamespaces(NameSpaces.community)(function ConnectCover({ t }: I18nProps) {
  return (
    <>
      <GridRow>
        <Cell span={Spans.full}>
          <View>
            <View style={standardStyles.blockMarginTablet}>
              <AspectRatio ratio={855 / 286}>
                <View style={{ backgroundColor: colors.faintGold, height: '100%' }} />
              </AspectRatio>
            </View>
            <H1 style={textStyles.center}>
              <Text style={styles.developers}>Developers. </Text>
              <Text style={styles.designers}>Designers. </Text>
              <Text style={styles.dreamers}>Dreamers. </Text>
              <Text style={styles.doers}>Doers. </Text>
            </H1>
          </View>
        </Cell>
      </GridRow>
      <GridRow
        desktopStyle={standardStyles.sectionMarginBottom}
        tabletStyle={standardStyles.sectionMarginBottomTablet}
        mobileStyle={standardStyles.sectionMarginBottomMobile}
        allStyle={standardStyles.centered}
      >
        <Cell span={Spans.half}>
          <H4 style={[textStyles.center, standardStyles.elementalMargin]}>
            {t('cover.joinMovement')}
          </H4>
          <EmailForm
            submitText={t('signUp')}
            route={'/contacts'}
            whenComplete={<After t={t} />}
            isDarkMode={false}
          />
        </Cell>
      </GridRow>
    </>
  )
})

const styles = StyleSheet.create({
  developers: {
    color: colors.primary,
  },
  designers: {
    color: colors.purple,
  },
  dreamers: {
    color: colors.red,
  },
  doers: {
    color: colors.lightBlue,
  },
})
