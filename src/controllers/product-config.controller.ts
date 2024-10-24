import { CategoryModel, CollectionModel } from '@src/models/product-config.model';
import { isNull } from '@src/utils/check-validation';
import { throwServerErrorResponse, throwNotFoundResponse } from '@src/utils/error-handler';
import { deleteFiles } from '@src/utils/file.util';
import { makeSlug } from '@src/utils/generator';
import { Request, Response } from 'express';

// Category oparations
export const createCategory = async (req: Request, res: Response) => {
  try {
    req.body.slug = makeSlug(req.body?.name);
    req.body.image = req.file?.path;
    req.body.parent = isNull(req.body?.parent) ? null : req.body?.parent;
    const category = await CategoryModel.create({ ...req.body });
    return res.status(201).json({
      message: 'Category created successfully',
      data: category,
      success: true,
    });
  } catch (error) {
    return throwServerErrorResponse(res, error);
  }
};

export const updateCategory = async (req, res) => {
  const category = await CategoryModel.findById(req.params?.id);
  if (!category) {
    return throwNotFoundResponse(res, 'Category not found');
  }

  if ((req.file || !req.body.image) && category.image) {
    deleteFiles(category.image);
  }

  req.body.image = req.file?.path || req.body.image;
  req.body.slug = makeSlug(req.body?.name) || category.slug;
  req.body.parent = isNull(req.body?.parent) ? null : req.body?.parent;

  const updatedCategory = await CategoryModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  return res.status(200).json({
    message: 'Category updated successfully',
    data: updatedCategory,
    success: true,
  });
};

export const getCategoryTree = async (req, res) => {
  try {
    const categories = await CategoryModel.find({ parent: null, isDeleted: false }).lean();
    // Recursive function to populate subcategories
    const populateSubcategories = async (category) => {
      const subcategories = await CategoryModel.find({ parent: category._id, isDeleted: false }).lean();
      category.subcategories = subcategories;
      if (subcategories.length > 0) {
        await Promise.all(subcategories.map(populateSubcategories));
      }
      return category;
    };
    const categoryTree = await Promise.all(categories.map(populateSubcategories));
    return res.status(200).json({ data: categoryTree, success: true });
  } catch (error) {
    return throwServerErrorResponse(res, error);
  }
};

export const deleteCategory = async (req, res) => {
  const category = await CategoryModel.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
  if (!category) {
    return res.status(404).json({
      message: 'Category not found',
      success: false,
    });
  }
  return res.status(200).json({
    message: 'Category deleted successfully',
    data: category,
    success: true,
  });
};

// Category End

// Collection oparations
export const createCollection = async (req, res) => {
  try {
    req.body.image = req.file?.path;
    const collection = await CollectionModel.create(req.body);
    return res.status(201).json({
      message: 'Collection created successfully',
      data: collection,
      success: true,
    });
  } catch (error) {
    return throwServerErrorResponse(res, error);
  }
};

export const updateCollection = async (req, res) => {
  const collection = await CollectionModel.findById(req.params?.id);
  if (!collection) {
    return throwNotFoundResponse(res, 'Collection not found');
  }

  if ((req.file || !req.body.image) && collection.image) {
    deleteFiles(collection.image);
  }

  req.body.image = req.file?.path || req.body.image;

  const newCollection = await CollectionModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  return res.status(200).json({
    message: 'Collection updated successfully',
    data: newCollection,
    success: true,
  });
};

export const getCollections = async (req, res) => {
  try {
    const collections = await CollectionModel.find({ isDeleted: false });
    return res.status(200).json({ data: collections, success: true });
  } catch (error) {
    return throwServerErrorResponse(res, error);
  }
};

export const deleteCollection = async (req, res) => {
  const collection = await CollectionModel.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
  if (!collection) {
    return res.status(404).json({
      message: 'Collection not found',
      success: false,
    });
  }
  return res.status(200).json({
    message: 'Collection deleted successfully',
    data: collection,
    success: true,
  });
};

// Collection End
