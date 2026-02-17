import { useContext } from 'react'
import { ScriptContext } from './ScriptContext'

export const useScript = () => {
  const context = useContext(ScriptContext)
  if (context === undefined) {
    throw new Error('useScript must be used within a ScriptProvider')
  }
  return context
}
