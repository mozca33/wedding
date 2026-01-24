export interface RSVPData {
  id?: string
  name: string
  email: string
  phone?: string
  message?: string
  confirmed?: boolean
  createdAt?: string
}

export interface RSVPRow {
  id: string
  name: string
  email: string
  phone?: string
  message?: string
  confirmed: boolean
  created_at: string
  updated_at: string
}

export interface GalleryItem {
  id: string
  filePath: string
  fileName: string
  fileSize: number
  category: 'ceremony' | 'reception' | 'party' | 'other'
  uploadedBy?: string
  approved: boolean
  createdAt: string
  publicUrl?: string
}

export interface SharedFile {
  id: string
  filePath: string
  fileName: string
  fileSize: number
  description?: string
  uploadedBy?: string
  createdAt: string
}

export interface NotificationState {
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  isVisible: boolean
}

export interface GalleryRow {
  id: string
  created_at: string
  file_path: string
  file_name: string
  file_size: number
  category: 'ceremony' | 'reception' | 'party' | 'other'
  uploaded_by?: string
  approved: boolean
}

export interface RSVPRow {
  id: string
  created_at: string
  name: string
  email: string
  phone?: string
  guests_count: number
  guest_names?: string[]
  dietary_restrictions?: string
  message?: string
  confirmed: boolean
}

export interface GiftCategory {
  id: string
  name: string
  description?: string
  icon: string
  color: string
  created_at: string
}

export interface Gift {
  id: string
  category_id: string
  name: string
  description?: string
  price: number
  image_url?: string
  store_link?: string
  is_purchased: boolean
  purchased_by?: string
  purchased_at?: string
  priority: 1 | 2 | 3
  created_at: string
  updated_at: string
  category?: GiftCategory
}

export interface GiftPurchaseData {
  gift_id: string
  buyer_name: string
}