import { useState } from 'react'
import { useRealtimeLogSubscription, StreamType } from 'generated/graphql'

/**
 * 获取一个实时的log,
 * @param id analysis id
 * @returns [log, isCompleted]
 */
export const useLog = (id: string) => {
  const [log, setLog] = useState<string[]>([])
  const [completed, setCompleted] = useState(false)

  useRealtimeLogSubscription({
    variables: {
      id
    },
    onSubscriptionData({ subscriptionData }) {
      const lg = subscriptionData.data?.log
      if (lg) {
        if (lg.type === StreamType.Start) {
          setCompleted(false)
          setLog([lg.content])
        } else if (lg.type === StreamType.Append) {
          if (lg.content) {
            setLog(s => [...s, lg.content])
          }
        } else if (lg.type === StreamType.End) {
          if (lg.content) {
            setLog(s => [...s, lg.content])
          }
          setCompleted(true)
        }
      }
    }
  })

  return [log, completed] as const
}
