import ApolloClient from 'apollo-boost'
import { InMemoryCache } from 'apollo-cache-inmemory'
import fetch from 'cross-fetch'
import gql from 'graphql-tag'
import getConfig from 'next/config'
import * as React from 'react'
import { ApolloProvider, Query } from 'react-apollo'
import ShowApolloError from 'src/dev/ShowApolloError'
import ValidatorsList from 'src/dev/ValidatorsList'
import { I18nProps, withNamespaces } from 'src/i18n'

function createApolloClient() {
  return new ApolloClient({
    uri: getConfig().publicRuntimeConfig.BLOCKSCOUT.uri,
    cache: new InMemoryCache(),
    // TODO: Remove this workaround when the backend service fixes not needed errors
    fetch: async (...args) => {
      const response = await fetch(...args)
      const { data } = await response.json()
      return new (Response as any)(JSON.stringify({ data }))
    },
  })
}

const query = gql`
  query ValidatorGroups {
    latestBlock
    celoValidatorGroups {
      address
      commission
      votes
      account {
        accountType
        address
        attestationsFulfilled
        attestationsRequested
        lockedGold
        name
        nonvotingLockedGold
        url
        usd
      }
      affiliates(first: 10) {
        edges {
          node {
            address
            elected
            groupAddressHash
            member
            online
            score
            signerAddressHash
            account {
              name
              url
              usd
              lockedGold
              nonvotingLockedGold
            }
          }
        }
      }
    }
  }
`

class ValidatorsListApp extends React.PureComponent<I18nProps> {
  render() {
    if (!getConfig().publicRuntimeConfig.FLAGS.VALIDATORS) {
      return null
    }
    return (
      <ApolloProvider client={createApolloClient()}>
        <Query query={query}>
          {({ loading, error, data }) => {
            if (error) {
              return <ShowApolloError error={error} />
            }
            return <ValidatorsList data={loading ? undefined : data} isLoading={loading} />
          }}
        </Query>
      </ApolloProvider>
    )
  }
}

export default withNamespaces('dev')(ValidatorsListApp)