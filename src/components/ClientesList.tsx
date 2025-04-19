import React, { useState, useEffect, useMemo } from 'react';
import { Cliente } from '../interfaces/Cliente';
import { fetchData } from '../utils/dataFetcher';

const itemsPerPage = 10;

const ClienteList: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterName, setFilterName] = useState('');
  const [searchCpfCnpj, setSearchCpfCnpj] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchData();
        setClientes(data.clientes);
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

  // Filtra e pesquisa os clientes
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
    setCurrentPage(1); // Resetar a página ao filtrar
  };

  const handleSearchCpfCnpjChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchCpfCnpj(event.target.value);
    setCurrentPage(1); // Resetar a página ao pesquisar
  };

  if (loading) {
    return <div>Carregando clientes...</div>;
  }

  if (error) {
    return <div>Erro ao carregar os clientes: {error}</div>;
  }

  return (
    <div>
      <h2>Lista de Clientes</h2>

      <div className="mb-4 flex items-center space-x-4">
        <div>
          <label htmlFor="filterName" className="block text-gray-700 text-sm font-bold mb-2">
            Filtrar por Nome:
          </label>
          <input
            type="text"
            id="filterName"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={filterName}
            onChange={handleFilterNameChange}
          />
        </div>
        <div>
          <label htmlFor="searchCpfCnpj" className="block text-gray-700 text-sm font-bold mb-2">
            Pesquisar por CPF/CNPJ:
          </label>
          <input
            type="text"
            id="searchCpfCnpj"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={searchCpfCnpj}
            onChange={handleSearchCpfCnpjChange}
          />
        </div>
      </div>

      {currentClientes.length > 0 ? (
        <ul>
          {currentClientes.map(cliente => (
            <li key={cliente.id}>
              {cliente.nome} - {cliente.cpfCnpj}
            </li>
          ))}
        </ul>
      ) : (
        <div>Nenhum cliente encontrado com os critérios de busca.</div>
      )}

      {totalPages > 1 && (
        <div className="mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 mr-2 border rounded disabled:opacity-50"
          >
            Anterior
          </button>
          {renderPageNumbers()}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-2 ml-2 border rounded disabled:opacity-50"
          >
            Próximo
          </button>
        </div>
      )}
    </div>
  );
};

export default ClienteList;