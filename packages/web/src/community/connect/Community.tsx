import * as React from 'react'
import { StyleSheet } from 'react-native'
import { H1 } from 'src/fonts/Fonts'
import { NameSpaces, useTranslation } from 'src/i18n'
import { Cell, GridRow, Spans } from 'src/layout/GridRow'

export default function Community() {
  const { t } = useTranslation(NameSpaces.community)
  return (
    <GridRow>
      <Cell span={Spans.full} style={styles.container}>
        <H1>{t('communityTitle')}</H1>
      </Cell>
    </GridRow>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridColumnGap: 10,
  },
})
