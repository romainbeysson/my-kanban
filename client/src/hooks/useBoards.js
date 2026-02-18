import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { boardService } from '../services';

export const useBoards = () => {
  return useQuery({
    queryKey: ['boards'],
    queryFn: async () => {
      const data = await boardService.getAll();
      return data.boards;
    },
  });
};

export const useBoard = (boardId) => {
  return useQuery({
    queryKey: ['board', boardId],
    queryFn: async () => {
      const data = await boardService.getById(boardId);
      return data.board;
    },
    enabled: !!boardId,
  });
};

export const useCreateBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: boardService.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      toast.success('Board créé avec succès !');
      return data.board;
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Erreur lors de la création');
    },
  });
};

export const useUpdateBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => boardService.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      queryClient.invalidateQueries({ queryKey: ['board', variables.id] });
      toast.success('Board mis à jour');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Erreur lors de la mise à jour');
    },
  });
};

export const useDeleteBoard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: boardService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      toast.success('Board supprimé');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Erreur lors de la suppression');
    },
  });
};
