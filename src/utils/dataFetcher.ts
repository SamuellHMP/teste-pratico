import Papa from 'papaparse';
import { Cliente } from '../interfaces/Cliente';
import { Conta } from '../interfaces/Conta';
import { Agencia } from '../interfaces/Agencia';

const clientesUrl = 'https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=clientes';
const contasUrl = 'https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=contas';
const agenciasUrl = 'https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=agencias';

interface ClienteCSV {
  id: string;
  cpfCnpj: string;
  rg?: string;
  dataNascimento: string; // O CSV virá como string
  nome: string;
  nomeSocial?: string;
  email: string;
  endereco: string;
  rendaAnual: string; // O CSV virá como string
  patrimonio: string; // O CSV virá como string
  estadoCivil: "Solteiro" | "Casado" | "Viúvo" | "Divorciado";
  codigoAgencia: string; // O CSV virá como string
}

interface ContaCSV {
  id: string;
  cpfCnpjCliente: string;
  tipo: "corrente" | "poupanca";
  saldo: string; // O CSV virá como string
  limiteCredito: string; // O CSV virá como string
  creditoDisponivel: string; // O CSV virá como string
}

interface AgenciaCSV {
  id: string;
  codigo: string; // O CSV virá como string
  nome: string;
  endereco: string;
}

interface FetchDataResult {
  clientes: Cliente[];
  contas: Conta[];
  agencias: Agencia[];
}

export async function fetchData(): Promise<FetchDataResult> {
  try {
    const [clientesResponse, contasResponse, agenciasResponse] = await Promise.all([
      fetch(clientesUrl),
      fetch(contasUrl),
      fetch(agenciasUrl),
    ]);

    const clientesCsv = await clientesResponse.text();
    const contasCsv = await contasResponse.text();
    const agenciasCsv = await agenciasResponse.text();

    const clientesResult = Papa.parse<ClienteCSV>(clientesCsv, { header: true, dynamicTyping: false });
    const contasResult = Papa.parse<ContaCSV>(contasCsv, { header: true, dynamicTyping: false });
    const agenciasResult = Papa.parse<AgenciaCSV>(agenciasCsv, { header: true, dynamicTyping: false });

    const clientes: Cliente[] = clientesResult.data.map(row => ({
      id: row.id,
      cpfCnpj: row.cpfCnpj,
      rg: row.rg,
      dataNascimento: new Date(row.dataNascimento),
      nome: row.nome,
      nomeSocial: row.nomeSocial,
      email: row.email,
      endereco: row.endereco,
      rendaAnual: Number(row.rendaAnual.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()),
      patrimonio: Number(row.patrimonio.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()),
      estadoCivil: row.estadoCivil,
      codigoAgencia: Number(row.codigoAgencia),
    }));

    const contas: Conta[] = contasResult.data.map(row => ({
      id: row.id,
      cpfCnpjCliente: row.cpfCnpjCliente,
      tipo: row.tipo,
      saldo: Number(row.saldo.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()),
      limiteCredito: Number(row.limiteCredito.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()),
      creditoDisponivel: Number(row.creditoDisponivel.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()),
    }));

    const agencias: Agencia[] = agenciasResult.data.map(row => ({
      id: row.id,
      codigo: Number(row.codigo),
      nome: row.nome,
      endereco: row.endereco,
    }));

    return { clientes, contas, agencias };

  } catch (error) {
    console.error('Erro ao buscar ou processar os dados:', error);
    return { clientes: [], contas: [], agencias: [] };
  }
}