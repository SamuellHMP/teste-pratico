import React, { useState, useEffect } from 'react';
import { Cliente } from '../interfaces/Cliente';
import { fetchData } from '../utils/dataFetcher';

const itemsPerPage = 10;

const ClienteList: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClientes = clientes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(clientes.length / itemsPerPage);

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

  if (loading) {
    return <div>Carregando clientes...</div>;
  }

  if (error) {
    return <div>Erro ao carregar os clientes: {error}</div>;
  }

  return (
    <div>
      <h2>Lista de Clientes</h2>
      {currentClientes.length > 0 ? (
        <ul>
          {currentClientes.map(cliente => (
            <li key={cliente.id}>
              {cliente.nome} - {cliente.cpfCnpj}
            </li>
          ))}
        </ul>
      ) : (
        <div>Nenhum cliente encontrado.</div>
      )}
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
    </div>
  );
};

export default ClienteList;