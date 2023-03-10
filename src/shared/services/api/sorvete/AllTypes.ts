import { Environment } from '../../../environment';
import { Api } from '../axios-config';

export interface SorveteProps {
  id: number;
  tipo: string;
  sabores: {
    id: number;
    nome: string;
    imagem: string;
    descricao: string;
    sorveteId: number;
  };
}

export interface ListaSorveteProps {
  id: number;
  nome: string;
  imagem: string;
  descricao: string;
  sorveteId: number;
}

type SorveteComTotalCount = {
  data: SorveteProps[];
  totalCount: number;
};

type SaboresComTotalCount = {
  data: ListaSorveteProps[];
  totalCount: number;
};

const getAll = async (page = 1): Promise<SorveteComTotalCount | Error> => {
  try {
    const urlRelativa = `/sorvetes?&_embed=sabores&_page=${page}`;
    const { data, headers } = await Api.get(urlRelativa);

    if (data) {
      return {
        data,
        totalCount: Number(
          headers['x-total-count'] || Environment.LIMITE_LINHAS,
        ),
      };
    }

    return new Error('Erro ao listar os Registros');
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || 'Erro ao Carregar',
    );
  }
};

const getAllSabores = async (
  page = 1,
  filter = '',
): Promise<SaboresComTotalCount | Error> => {
  try {
    const urlRelativa = `/sabores?&_page=${page}&_limit=${Environment.LIMITE_LINHAS}&nome_like=${filter}`;
    const { data, headers } = await Api.get(urlRelativa);

    if (data) {
      return {
        data,
        totalCount: Number(
          headers['x-total-count'] || Environment.LIMITE_LINHAS,
        ),
      };
    }

    return new Error('Erro ao listar os Registros');
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || 'Erro ao Carregar',
    );
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api.delete<ListaSorveteProps>(`/sabores/${id}`);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || 'Erro ao apagar',
    );
  }
};

const getById = async (id: number): Promise<ListaSorveteProps | Error> => {
  try {
    const { data } = await Api.get(`/sabores/${id}`);

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o Registro');
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || 'Erro ao consultar',
    );
  }
};

const create = async (
  dados: Omit<ListaSorveteProps, 'id'>,
): Promise<number | Error> => {
  try {
    const { data } = await Api.post<ListaSorveteProps>('/sabores', dados); //Dessa forma eu consigo dizer qqual dado esta retornando

    if (data) {
      return data.id;
    }

    return new Error('Erro ao criar o Registro');
  } catch (error) {
    console.error(error);
    return new Error((error as { message: string }).message || 'Erro ao criar');
  }
};

const updateById = async (
  id: number,
  dados: ListaSorveteProps,
): Promise<void | Error> => {
  try {
    await Api.put(`/sabores/${id}`, dados);
  } catch (error) {
    console.error(error);
    return new Error(
      (error as { message: string }).message || 'Erro ao atualizar',
    );
  }
};
export const AllTypes = {
  getAll,
  deleteById,
  getAllSabores,
  getById,
  create,
  updateById,
};
