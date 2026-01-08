// Re-export types from admin.service for convenience
export type {
  Category,
} from '../../../services/admin.service'

export interface CategoryFormData {
  name: string
  description?: string
}
