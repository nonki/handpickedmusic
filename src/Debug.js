import React, { useEffect, useState  } from 'react'
import { API, graphqlOperation  } from 'aws-amplify'
import { debug } from './graphql/queries';

const Debug = () => {
  const [data, setData] = useState("")

  useEffect(() => {
    fetchDebug()
  }, [])

  async function fetchDebug() {
    try {
      const debugGQL = await API.graphql(graphqlOperation(debug))
      const debugData = debugGQL.data.debug
      setData(debugData)
    } catch (err) { console.log(`error fetching debug: ${err}`) }
  }

  return (
    <div>
      <p>{data}</p>
    </div>
  )
}

export default Debug
