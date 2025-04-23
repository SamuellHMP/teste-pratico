import React, { useState, useEffect, useMemo } from 'react';
import { Cliente } from '../interfaces/Cliente';
import { Conta } from '../interfaces/Conta';
import { Agencia } from '../interfaces/Agencia';
import { fetchData } from '../utils/dataFetcher';
import ClienteDetails from './ClienteDetails';

const itemsPerPage = 10;

const ClienteList: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [contas, setContas] = useState<Conta[]>([]);
  const [agencias, setAgencias] = useState<Agencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterName, setFilterName] = useState('');
  const [searchCpfCnpj, setSearchCpfCnpj] = useState('');
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchData();
        setClientes(data.clientes);
        setContas(data.contas);
        setAgencias(data.agencias);
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Ocorreu um erro ao carregar os clientes.');
        } else {
          setError('Ocorreu um erro desconhecido ao carregar os clientes.');
        }
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredClientes = useMemo(() => {
    return clientes.filter(cliente => {
      const nameMatch = cliente.nome.toLowerCase().includes(filterName.toLowerCase());
      const cpfCnpjMatch = cliente.cpfCnpj.includes(searchCpfCnpj);
      return nameMatch && cpfCnpjMatch;
    });
  }, [clientes, filterName, searchCpfCnpj]);

  const totalPages = Math.ceil(filteredClientes.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClientes = filteredClientes.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const handleClienteClick = (cliente: Cliente) => setSelectedCliente(cliente);
  const handleVoltarLista = () => setSelectedCliente(null);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`mx-1 px-3 py-2 border rounded ${currentPage === i ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-300 text-gray-700 hover:bg-gray-200'}`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  const handleFilterNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterName(event.target.value);
    setCurrentPage(1);
  };

  const handleSearchCpfCnpjChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCpfCnpj(event.target.value);
    setCurrentPage(1);
  };

  const formatCpfCnpj = (cpfCnpj: string): string => {
    const cleanedValue = cpfCnpj.replace(/\D/g, '');
    if (cleanedValue.length === 11) {
      return cleanedValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (cleanedValue.length === 14) {
      return cleanedValue.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return cpfCnpj;
  };

  if (loading) {
    return <div className="text-center py-1">Carregando clientes...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-1">Erro ao carregar os clientes: {error}</div>;
  }

  return (
    <div className="container mx-auto p-2">
      <h2 className="text-blue-900 text-2xl font-bold mb-4">Banco Gigante</h2>

      {selectedCliente ? (
        <ClienteDetails
          cliente={selectedCliente}
          contas={contas}
          agencias={agencias}
          onVoltar={handleVoltarLista}
        />
      ) : (
        <>
          <div className="flex justify-center gap-4 mb-4">
            <div>
              <label htmlFor="filterName" className="block text-gray-700 text-sm font-bold mb-1">
                Filtrar por Nome:
              </label>
              <input
                type="text"
                id="filterName"
                className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={filterName}
                onChange={handleFilterNameChange}
              />
            </div>
            <div>
              <label htmlFor="searchCpfCnpj" className="block text-gray-700 text-sm font-bold mb-1">
                Pesquisar por CPF/CNPJ:
              </label>
              <input
                type="text"
                id="searchCpfCnpj"
                className="shadow appearance-none border rounded w-full py-1 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={searchCpfCnpj}
                onChange={handleSearchCpfCnpjChange}
              />
            </div>
          </div>

          <div className="shadow rounded border mb-2 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CPF/CNPJ
                  </th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nascimento
                  </th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Renda Anual
                  </th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agência
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentClientes.map(cliente => (
                  <tr key={cliente.id} className="hover:bg-gray-100 cursor-pointer" onClick={() => handleClienteClick(cliente)}>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{cliente.nome}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{formatCpfCnpj(cliente.cpfCnpj)}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{cliente.dataNascimento.toLocaleDateString()}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{cliente.rendaAnual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{cliente.codigoAgencia}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-2 flex justify-center items-center space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 border rounded disabled:opacity-50"
              >
                Anterior
              </button>
              {renderPageNumbers()}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-2 border rounded disabled:opacity-50"
              >
                Próximo
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ClienteList;