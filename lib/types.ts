export interface RSVPData {
	id?: string;
	name: string;
	email: string;
	phone?: string;
	message?: string;
	confirmed?: boolean;
	createdAt?: string;
}

export interface RSVPRow {
	id: string;
	name: string;
	email: string;
	phone?: string;
	message?: string;
	confirmed: boolean;
	created_at: string;
	updated_at: string;
}

export interface GalleryItem {
	id: string;
	filePath: string;
	fileName: string;
	fileSize: number;
	category: 'ceremony' | 'reception' | 'party' | 'other';
	uploadedBy?: string;
	approved: boolean;
	createdAt: string;
	publicUrl?: string;
}

export interface SharedFile {
	id: string;
	filePath: string;
	fileName: string;
	fileSize: number;
	description?: string;
	uploadedBy?: string;
	createdAt: string;
}

export interface NotificationState {
	message: string;
	type: 'success' | 'error' | 'info' | 'warning';
	isVisible: boolean;
}

export interface GalleryRow {
	id: string;
	created_at: string;
	file_path: string;
	file_name: string;
	file_size: number;
	category: 'ceremony' | 'reception' | 'party' | 'other';
	uploaded_by?: string;
	approved: boolean;
}

export interface RSVPRow {
	id: string;
	created_at: string;
	name: string;
	email: string;
	phone?: string;
	message?: string;
	confirmed: boolean;
}

// Categorias de presentes
export type GiftCategoryType = 'cozinha' | 'limpeza' | 'cama-e-banho' | 'para-a-vida-de-casados';

export interface GiftCategory {
	id: GiftCategoryType;
	name: string;
	icon: string;
}

// Presente individual
export interface Gift {
	id: string;
	category: GiftCategoryType;
	name: string;
	price: number;
	quantity: number;
	image: string;
	reserved: number; // quantidade reservada no carrinho (pendente)
	sold: number; // quantidade vendida (confirmada)
}

// Item no carrinho
export interface CartItem {
	giftId: string;
	name: string;
	price: number;
	quantity: number;
	image: string;
}

// Pedido de compra
export interface GiftOrder {
	id: string;
	items: CartItem[];
	total: number;
	buyerName: string;
	buyerEmail: string;
	buyerPhone?: string;
	status: 'pending' | 'confirmed' | 'cancelled';
	createdAt: string;
	confirmedAt?: string;
}

export interface GiftPurchaseData {
	items: CartItem[];
	buyerName: string;
	buyerEmail: string;
	buyerPhone?: string;
}
