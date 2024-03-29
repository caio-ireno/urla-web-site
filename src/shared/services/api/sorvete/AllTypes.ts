import { Environment } from '../../../environment'
import { Api } from '../axios-config'

export interface SorveteProps {
  id: number
  tipo: string
  sabores: {
    id: number
    nome: string
    imagem: string
    descricao: string
    sorvete_id: number
  }
}

export interface ListaSorveteProps {
  id: number
  nome: string
  imagem: string
  descricao: string
  sorvete_id: number
}

type SorveteComTotalCount = {
  data: SorveteProps[]
  totalCount: number
}

type SaboresComTotalCount = {
  data: {
    data: ListaSorveteProps[]
  }
}

const getAll = async (page = 1): Promise<SorveteComTotalCount | Error> => {
  try {
    const urlRelativa = `/sorvetes?&_page=${page}`
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

const getAllSabores = async (
  page = 1,
): Promise<SaboresComTotalCount | Error> => {
  try {
    const urlRelativa = `/sabores?page=${page}`
    const { data } = await Api.get(urlRelativa)

    if (data) {
      return {
        data,
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
    await Api.delete<ListaSorveteProps>(`/sabores/${id}`)
  } catch (error) {
    console.error(error)
    return new Error((error as { message: string }).message || 'Erro ao apagar')
  }
}

const getById = async (id: number): Promise<ListaSorveteProps | Error> => {
  try {
    const { data } = await Api.get(`/sabores/${id}`)

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
  dados: Omit<ListaSorveteProps, 'id'>,
): Promise<number | Error> => {
  try {
    const { data } = await Api.post<ListaSorveteProps>('/sabores', dados, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

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
  dados: ListaSorveteProps,
): Promise<void | Error> => {
  console.log(dados)
  try {
    const { data } = await Api.put(`/sabores/${id}`, dados)
    if (data) {
      console.log(data)
      return data.id
    }
  } catch (error) {
    console.error(error)
    return new Error(
      (error as { message: string }).message || 'Erro ao atualizar',
    )
  }
}

export const AllTypes = {
  getAll,
  deleteById,
  getAllSabores,
  getById,
  create,
  updateById,
}
