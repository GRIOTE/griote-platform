// Re-export types from admin.service for convenience
export type {
  UsersListResponse,
  PlatformStats,
  AdminFilters,
} from '../../../services/admin.service'

// Admin-specific user interface with additional fields from admin endpoint
import type { User as BaseUser } from '../../../services/auth.service'

export interface AdminUser extends BaseUser {
  email_verified: boolean
  created_at: string
}

// Local user form type
export interface UserFormData {
  email: string
  password: string
  first_name: string
  last_name: string
}
