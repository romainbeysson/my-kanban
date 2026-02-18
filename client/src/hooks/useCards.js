import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { cardService } from '../services';

export const useCreateCard = (boardId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listId, ...data }) => cardService.create(listId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Erreur lors de la création de la carte');
    },
  });
};

export const useUpdateCard = (boardId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => cardService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Erreur lors de la mise à jour');
    },
  });
};

export const useDeleteCard = (boardId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cardService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
      toast.success('Carte supprimée');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Erreur lors de la suppression');
    },
  });
};

export const useMoveCard = (boardId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, listId, position }) => cardService.move(id, listId, position),
    onMutate: async ({ id, listId, position }) => {
      await queryClient.cancelQueries({ queryKey: ['board', boardId] });
      const previousBoard = queryClient.getQueryData(['board', boardId]);
      return { previousBoard };
    },
    onError: (error, _, context) => {
      if (context?.previousBoard) {
        queryClient.setQueryData(['board', boardId], context.previousBoard);
      }
      toast.error('Erreur lors du déplacement');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
    },
  });
};

export const useReorderCards = (boardId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cardService.reorder,
    onMutate: async () => {
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
