'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryAPI, Category, CreateCategoryPayload, UpdateCategoryPayload } from '../api/categories';

const CATEGORIES_QUERY_KEY = ['categories'];

export const useCategories = () => {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: categoryAPI.getAllCategories,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
  });
};

export const useCategoryById = (id: number) => {
  return useQuery({
    queryKey: [...CATEGORIES_QUERY_KEY, id],
    queryFn: () => categoryAPI.getCategoryById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) => categoryAPI.createCategory(payload),
    onSuccess: (newCategory) => {
      // Update the categories list
      queryClient.setQueryData(CATEGORIES_QUERY_KEY, (oldData: Category[] | undefined) => {
        return oldData ? [...oldData, newCategory] : [newCategory];
      });

      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
    onError: (error) => {
      console.error('Failed to create category:', error);
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateCategoryPayload }) =>
      categoryAPI.updateCategory(id, payload),
    onSuccess: (updatedCategory) => {
      // Update specific category in cache
      queryClient.setQueryData([...CATEGORIES_QUERY_KEY, updatedCategory.id], updatedCategory);

      // Update in categories list
      queryClient.setQueryData(CATEGORIES_QUERY_KEY, (oldData: Category[] | undefined) => {
        return oldData
          ? oldData.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat))
          : [updatedCategory];
      });

      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
    onError: (error) => {
      console.error('Failed to update category:', error);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoryAPI.deleteCategory(id),
    onSuccess: (_, deletedId) => {
      // Remove from categories list
      queryClient.setQueryData(CATEGORIES_QUERY_KEY, (oldData: Category[] | undefined) => {
        return oldData ? oldData.filter((cat) => cat.id !== deletedId) : [];
      });

      // Remove specific category query
      queryClient.removeQueries({ queryKey: [...CATEGORIES_QUERY_KEY, deletedId] });

      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
    onError: (error) => {
      console.error('Failed to delete category:', error);
    },
  });
};
