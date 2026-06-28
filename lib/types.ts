// ── Tipos do Portal CASE ──────────────────────────

export type Role = 'admin' | 'client'
export type Priority = 'alta' | 'media' | 'baixa'
export type MaterialType = 'carrossel' | 'reels' | 'stories' | 'anuncio' | 'outro'
export type MaterialStatus = 'pendente' | 'aprovado' | 'alteracoes_solicitadas'
export type CalendarEventType = 'reuniao' | 'entrega' | 'acao' | 'prazo'
export type ContentFormat = 'reels' | 'feed' | 'stories' | 'carrossel'
export type ContentStatus = 'planejado' | 'produzido' | 'publicado'
export type AssignedTo = 'CASE' | 'Cliente' | 'Ambos'
export type LabCategory = 'estrategia' | 'marketing' | 'dados' | 'relacionamento' | 'legado'

export interface Client {
  id: string
  name: string
  slug: string
  logo_url?: string
  meta_ad_account_id?: string
  meta_access_token?: string
  ecommerce_platform?: string
  ecommerce_api_token?: string
  ecommerce_store_id?: string
  google_sheet_id?: string
  google_sheet_last_sync?: string
  active: boolean
  created_at: string
}

export interface Profile {
  id: string
  client_id: string
  email: string
  full_name?: string
  role: Role
  avatar_url?: string
  created_at: string
}

export interface MetricsSnapshot {
  id: string
  client_id: string
  snapshot_date: string
  sales_value: number
  ad_spend: number
  impressions: number
  reach: number
  roas: number
  cpc: number
  cpm: number
  ctr: number
  purchases: number
  new_customers: number
  conversion_rate: number
  avg_ticket: number
  repurchase_rate: number
  video_plays: number
  thru_plays: number
  synced_at: string
}

export interface AdPerformance {
  id: string
  client_id: string
  ad_id: string
  ad_name?: string
  campaign_name?: string
  campaign_objective?: string
  creative_url?: string
  roas: number
  ctr: number
  purchases: number
  cost_per_purchase: number
  period_start?: string
  period_end?: string
  synced_at: string
}

export interface Opportunity {
  id: string
  client_id: string
  order_position: number
  title: string
  description?: string
  priority: Priority
  impact_label?: string
  impact_value?: string
  status: 'active' | 'archived'
  created_at: string
}

export interface TimelineEvent {
  id: string
  client_id: string
  event_date: string
  title: string
  description?: string
  badge_label?: string
  badge_value?: string
  icon_type: string
  created_at: string
}

export interface Material {
  id: string
  client_id: string
  created_by?: string
  title: string
  type?: MaterialType
  file_url?: string
  thumbnail_url?: string
  status: MaterialStatus
  feedback?: string
  submitted_at: string
  reviewed_at?: string
}

export interface Meeting {
  id: string
  client_id: string
  meeting_date: string
  title: string
  summary?: string
  total_actions: number
  completed_actions: number
  created_at: string
  actions?: MeetingAction[]
}

export interface MeetingAction {
  id: string
  meeting_id: string
  description: string
  assigned_to?: AssignedTo
  due_date?: string
  completed: boolean
  completed_at?: string
}

export interface CalendarEvent {
  id: string
  client_id: string
  title: string
  description?: string
  type: CalendarEventType
  starts_at: string
  ends_at?: string
  created_at: string
}

export interface ContentPlan {
  id: string
  client_id: string
  week_start: string
  scope: 'semanal' | 'mensal'
  generated_at: string
  items?: ContentItem[]
}

export interface ContentItem {
  id: string
  plan_id: string
  post_date: string
  format?: ContentFormat
  title: string
  daily_goal?: string
  status: ContentStatus
  created_at: string
}

export interface LabModule {
  id: string
  title: string
  category?: LabCategory
  lesson_count: number
  order_position: number
  progress?: ClientModuleProgress
}

export interface ClientModuleProgress {
  id: string
  client_id: string
  module_id: string
  completed_lessons: number
  last_accessed: string
}

// ── Helpers ──────────────────────────────────────

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value)
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function deltaClass(value: number): string {
  return value >= 0 ? 'kpi-delta-up' : 'kpi-delta-down'
}

export function deltaSign(value: number): string {
  return value >= 0 ? `+${value.toFixed(1)}%` : `${value.toFixed(1)}%`
}
