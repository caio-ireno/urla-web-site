import { Environment } from '../../../environment';
import { Api } from '../axios-config';

interface SorveteProps{
  id: number;
  nomeSorvete: string;
  tipoSorvete: string;
  sorveteId:number;
}

interface ListaSorveteProps{
  id: number;
  sorveteId:number;
  nomeSorvete: string;
  tipoSorvete: string;
}

type SorveteComTotalCount = {
  data: SorveteProps[];
  totalCount: number;
}

const getAll = async (page=1, filter=''): Promise<SorveteComTotalCount | Error> => {
  try{
    const urlRelativa=`/sorvetes?_page=${page}&_limit=${Environment.LIMITE_LINHAS}&nomeSorvete_like=${filter}`;
    const {data, headers} = await Api.get(urlRelativa);

    if(data){
      return {
        data,
        totalCount:Number(headers['x-total-count'] || Environment.LIMITE_LINHAS),
      };
    }

    return new Error('Erro ao listar os Registros');
  } catch (error){
    console.error(error);
    return new Error((error as {message:string}).message || 'Erro ao Carregar');
  }
};

const getById = async (id:number): Promise<ListaSorveteProps | Error> => {
  try{
    const {data} = await Api.get(`/pessoas/${id}`);

    if(data){
      return data;
    }

    return new Error('Erro ao consultar o Registro');
  } catch (error){
    console.error(error);
    return new Error((error as {message:string}).message || 'Erro ao consultar');
  }
};

const create = async (dados:Omit<ListaSorveteProps, 'id'>): Promise<number | Error> => {
  try{
    const {data} = await Api.post<ListaSorveteProps>('/pessoas', dados); //Dessa forma eu consigo dizer qqual dado esta retornando

    if(data){
      return data.id;
    }

    return new Error('Erro ao criar o Registro');
  } catch (error){
    console.error(error);
    return new Error((error as {message:string}).message || 'Erro ao criar');
  }
};

const updateById = async (id:number, dados:ListaSorveteProps): Promise<void | Error> => {
  try{
    await Api.put(`/pessoas/${id}`, dados); 

  } catch (error){
    console.error(error);
    return new Error((error as {message:string}).message || 'Erro ao atualizar');
  }
};

const deleteById = async (id:number): Promise<void | Error> => {
  try{
    await Api.delete<ListaSorveteProps>(`/pessoas/${id}`); 

  } catch (error){
    console.error(error);
    return new Error((error as {message:string}).message || 'Erro ao apagar');
  }
};

export const SorveteService ={
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};