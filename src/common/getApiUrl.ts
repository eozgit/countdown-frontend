import { host } from '@/client'

export default (segment: string) => new URL(segment, host).href;
