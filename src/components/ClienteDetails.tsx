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
  // Encontra as contas do cliente
  const clienteContas = contas.filter(conta => conta.cpfCnpjCliente === cliente.cpfCnpj);

  // Encontra a agência do cliente
  const clienteAgencia = agencias.find(agencia => agencia.codigo === cliente.codigoAgencia);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Detalhes do Cliente</h2>
      <button onClick={onVoltar} className="px-4 py-2 bg-gray-300 rounded mb-4">
        Voltar para a Lista
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold">Informações Pessoais</h3>
          <p><strong>ID:</strong> {cliente.id}</p>
          <p><strong>Nome:</strong> {cliente.nome}</p>
          {cliente.nomeSocial && <p><strong>Nome Social:</strong> {cliente.nomeSocial}</p>}
          <p><strong>CPF/CNPJ:</strong> {cliente.cpfCnpj}</p>
          {cliente.rg && <p><strong>RG:</strong> {cliente.rg}</p>}
          <p><strong>Data de Nascimento:</strong> {cliente.dataNascimento.toLocaleDateString()}</p>
          <p><strong>Email:</strong> {cliente.email}</p>
          <p><strong>Estado Civil:</strong> {cliente.estadoCivil}</p>
        </div>

        <div>
          <h3 className="font-semibold">Informações Financeiras</h3>
          <p><strong>Endereço:</strong> {cliente.endereco}</p>
          <p><strong>Renda Anual:</strong> {cliente.rendaAnual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          <p><strong>Patrimônio:</strong> {cliente.patrimonio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Contas Bancárias</h3>
        {clienteContas.length > 0 ? (
          <ul>
            {clienteContas.map(conta => (
              <li key={conta.id} className="mb-2 border p-2 rounded">
                <p><strong>ID da Conta:</strong> {conta.id}</p>
                <p><strong>Tipo:</strong> {conta.tipo}</p>
                <p><strong>Saldo:</strong> {conta.saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                <p><strong>Limite de Crédito:</strong> {conta.limiteCredito.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                <p><strong>Crédito Disponível:</strong> {conta.creditoDisponivel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Este cliente não possui contas bancárias.</p>
        )}
      </div>

      {clienteAgencia && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Agência</h3>
          <p><strong>Código:</strong> {clienteAgencia.codigo}</p>
          <p><strong>Nome:</strong> {clienteAgencia.nome}</p>
          <p><strong>Endereço:</strong> {clienteAgencia.endereco}</p>
        </div>
      )}
    </div>
  );
};

export default ClienteDetails;