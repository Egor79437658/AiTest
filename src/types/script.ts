export type ScriptStatus = 0 | 1 | 2

export interface Script {
  id: number // IDS
  name: string // (prefix AT_)
  version: string // sss.mmm.vvv
  testCaseId: number // IDT
  precondition?: string
  createdAt: Date
  status: ScriptStatus
  lastRunAt?: Date
  lastRunStatus?: 'успешно' | 'с_ошибками'
  duration?: number
  owner: { id: number; username: string }
  code?: string
}

export interface ScriptRun {
  id: number
  scriptId: number
  startedAt: Date
  finishedAt?: Date
  status: 'успешно' | 'с_ошибками' | 'запланирован' | 'в_работе' | 'отменен'
  triggeredBy?: { id: number; username: string }
  duration?: number
  logs?: string
  error?: string
}

export type ScriptUpdateData = Partial<
  Omit<Script, 'id' | 'owner' | 'createdAt'>
>
