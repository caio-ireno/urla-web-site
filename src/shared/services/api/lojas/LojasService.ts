import { Environment } from '../../../environment'
import { Api } from '../axios-config'

export interface LojasProps {
  id: number
  telefone: number
  nomeLoja: string
  endereço: string
  imgLoja: string
  rota: string
}

export interface ListaLojasProps {
  id: number
  telefone: number
  nomeLoja: string
  endereço: string
  imgLoja: string
  rota: string
}

type LojasComTotalCount = {
  data: LojasProps[]
  totalCount: number
}

const getAll = async (
  page = 1,
  filter = '',
): Promise<LojasComTotalCount | Error> => {
  try {
    const urlRelativa = `/lojas?&_page=${page}&nomeLoja_like=${filter}`
    const { data, headers } = await Api.get(urlRelativa)

    if (data) {
      return {
        data,
        totalCount: Number(
          headers['x-total-count'] || Environment.LIMITE_LINHAS,
        ),
      }
    }

    return new Error('Erro ao listar os Registros')
  } catch (error) {
    console.error(error)
    return new Error(
      (error as { message: string }).message || 'Erro ao Carregar',
    )
  }
}

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api.delete<ListaLojasProps>(`/lojas/${id}`)
  } catch (error) {
    console.error(error)
    return new Error((error as { message: string }).message || 'Erro ao apagar')
  }
}

const getById = async (id: number): Promise<ListaLojasProps | Error> => {
  try {
    const { data } = await Api.get(`/lojas/${id}`)

    if (data) {
      return data
    }

    return new Error('Erro ao consultar o Registro')
  } catch (error) {
    console.error(error)
    return new Error(
      (error as { message: string }).message || 'Erro ao consultar',
    )
  }
}

const create = async (
  dados: Omit<ListaLojasProps, 'id'>,
): Promise<number | Error> => {
  try {
    const { data } = await Api.post<ListaLojasProps>('/lojas', dados, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }) //Dessa forma eu consigo dizer qqual dado esta retornando

    if (data) {
      return data.id
    }

    return new Error('Erro ao criar o Registro')
  } catch (error) {
    console.error(error)
    return new Error((error as { message: string }).message || 'Erro ao criar')
  }
}

const updateById = async (
  id: number,
  dados: ListaLojasProps,
): Promise<void | Error> => {
  try {
    const { data } = await Api.put(`/lojas/${id}`, dados)
    if (data) {
      return data.id
    }
  } catch (error) {
    console.error(error)
    return new Error(
      (error as { message: string }).message || 'Erro ao atualizar',
    )
  }
}

export const LojasServices = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
}
