import { Types } from 'mongoose';

export interface ICategory {
  name: string;
  parent?: Types.ObjectId | null; // Reference to the parent category or null if it's a root category
  slug: string;
  image?: string;
  description?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
}

export interface ICollection {
  name: string;
  description?: string;
  image?: string;
  slug: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
}

interface IVariantOption {
  key: string;
  value: string;
}

export interface IVariant {
  _id?: Types.ObjectId;
  options: IVariantOption[];
  sku: string;
  stock: number;
  price: number;
  discountPrice?: number;
  costPrice?: number;
  image?: string;
  isActive?: boolean;
  isDeleted?: boolean;
}

export interface IProduct {
  name: string;
  summary: string;
  description: string;
  price: number;
  discountPrice?: number;
  costPrice?: number;
  weight?: number;
  weightUnit?: string;
  height?: number;
  heightUnit?: string;
  width?: number;
  widthUnit?: string;
  hasVariants: boolean;
  options?: Array<{ id: number; name: string; value: Array<{ id: number; name: string }> }>;
  variants?: Array<IVariant>;
  sku: string;
  trackStock: boolean;
  stock?: number;
  category: Types.ObjectId;
  collections?: Types.ObjectId[];
  tags?: Array<string>;
  images?: Array<string>;
  thumbnails?: Array<string>;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
}
