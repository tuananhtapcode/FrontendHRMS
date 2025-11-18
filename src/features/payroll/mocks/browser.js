import { setupWorker } from 'msw/browser'
import { payrollHandlers } from './handlers'

export const worker = setupWorker(...payrollHandlers)