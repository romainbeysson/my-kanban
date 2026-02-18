import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { listService } from '../services';

export const useCreateList = (boardId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => listService.create(boardId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Erreur lors de la création de la liste');
    },
  });
};

export const useUpdateList = (boardId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => listService.update(boardId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Erreur lors de la mise à jour');
    },
  });
};

export const useDeleteList = (boardId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => listService.delete(boardId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
      toast.success('Liste supprimée');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Erreur lors de la suppression');
    },
  });
};

export const useReorderLists = (boardId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lists) => listService.reorder(boardId, lists),
    onMutate: async (newLists) => {
      await queryClient.cancelQueries({ queryKey: ['board', boardId] });
      const previousBoard = queryClient.getQueryData(['board', boardId]);
      return { previousBoard };
    },
    onError: (error, _, context) => {
      if (context?.previousBoard) {
        queryClient.setQueryData(['board', boardId], context.previousBoard);
      }
      toast.error('Erreur lors du réordonnancement');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
    },
  });
};
