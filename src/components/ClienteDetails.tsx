import React from 'react';
import { Cliente } from '../interfaces/Cliente';
import { Conta } from '../interfaces/Conta';
import { Agencia } from '../interfaces/Agencia';

interface ClienteDetailsProps {
  cliente: Cliente;
  contas: Conta[];
  agencias: Agencia[];
  onVoltar: () => void;
}

const ClienteDetails: React.FC<ClienteDetailsProps> = ({ cliente, contas, agencias, onVoltar }) => {
  const clienteContas = contas.filter(conta => conta.cpfCnpjCliente === cliente.cpfCnpj);
  const clienteAgencia = agencias.find(agencia => agencia.codigo === cliente.codigoAgencia);

  const formatCpfCnpj = (cpfCnpj: string): string => {
    const cleanedValue = cpfCnpj.replace(/\D/g, '');
    if (cleanedValue.length === 11) {
      return cleanedValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (cleanedValue.length === 14) {
      return cleanedValue.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return cpfCnpj;
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Detalhes do Cliente</h2>
      <button onClick={onVoltar} className="px-4 py-2 bg-gray-300 rounded mb-4 hover:bg-gray-400">
        Voltar para a Lista
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">Informações Pessoais</h3>
          <p><strong className="text-gray-700">ID:</strong> <span className="text-gray-600">{cliente.id}</span></p>
          <p><strong className="text-gray-700">Nome:</strong> <span className="text-gray-600">{cliente.nome}</span></p>
          {cliente.nomeSocial && <p><strong className="text-gray-700">Nome Social:</strong> <span className="text-gray-600">{cliente.nomeSocial}</span></p>}
          <p><strong className="text-gray-700">CPF/CNPJ:</strong> <span className="text-gray-600">{formatCpfCnpj(cliente.cpfCnpj)}</span></p>
          {cliente.rg && <p><strong className="text-gray-700">RG:</strong> <span className="text-gray-600">{cliente.rg}</span></p>}
          <p><strong className="text-gray-700">Data de Nascimento:</strong> <span className="text-gray-600">{cliente.dataNascimento.toLocaleDateString()}</span></p>
          <p><strong className="text-gray-700">Email:</strong> <span className="text-gray-600">{cliente.email}</span></p>
          <p><strong className="text-gray-700">Estado Civil:</strong> <span className="text-gray-600">{cliente.estadoCivil}</span></p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">Informações Financeiras</h3>
          <p><strong className="text-gray-700">Endereço:</strong> <span className="text-gray-600">{cliente.endereco}</span></p>
          <p><strong className="text-gray-700">Renda Anual:</strong> <span className="text-gray-600">
            {isNaN(cliente.rendaAnual)
              ? <i className="text-gray-500">indisponível</i>
              : cliente.rendaAnual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span></p>
          <p><strong className="text-gray-700">Patrimônio:</strong> <span className="text-gray-600">{cliente.patrimonio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2">Contas Bancárias</h3>
        {clienteContas.length > 0 ? (
          <ul className="shadow rounded border">
            {clienteContas.map(conta => (
              <li key={conta.id} className="mb-2 border-b last:border-b-0 p-4">
                <p><strong className="text-gray-700">ID da Conta:</strong> <span className="text-gray-600">{conta.id}</span></p>
                <p><strong className="text-gray-700">Tipo:</strong> <span className="text-gray-600">{conta.tipo}</span></p>
                <p><strong className="text-gray-700">Saldo:</strong> <span className="text-gray-600">
                  {isNaN(conta.saldo)
                    ? <i className="text-gray-500">indisponível</i>
                    : conta.saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span></p>
                <p><strong className="text-gray-700">Limite de Crédito:</strong> <span className="text-gray-600">{conta.limiteCredito.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></p>
                <p><strong className="text-gray-700">Crédito Disponível:</strong> <span className="text-gray-600">{conta.creditoDisponivel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Este cliente não possui contas bancárias.</p>
        )}
      </div>
      
      <h3 className="font-semibold text-lg mb-2">Agência</h3>
      {clienteAgencia ? (
        <div>
          <p><strong className="text-gray-700">Código:</strong> <span className="text-gray-600">{clienteAgencia.codigo}</span></p>
          <p><strong className="text-gray-700">Nome:</strong> <span className="text-gray-600">{clienteAgencia.nome}</span></p>
          <p><strong className="text-gray-700">Endereço:</strong> <span className="text-gray-600">{clienteAgencia.endereco}</span></p>
        </div>
      ) : (
        <p className="text-gray-500">Informações da agência não encontradas.</p>
      )}
    </div>
  );
};

export default ClienteDetails;