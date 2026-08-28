'use client';

import { useState } from 'react';
import mlPricesData from '@/data/ml_prices.json';

const ML_LINKS = {
  miniBike: "https://www.mercadolivre.com.br/ultimate-fitness-mini-bike-bicicleta-ergometrica/up/MLBU2934790909",
  spinning: "https://www.mercadolivre.com.br/ultimate-fitness-bicicleta-ergometrica-spinning/up/MLBU3325822548",
  miniBike2: "https://www.mercadolivre.com.br/ultimate-fitness-mini-bike-bicicleta-ergometrica/up/MLBU2954483127",
};

export default function AdminUpdatePrices() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [autoFetchAttempted, setAutoFetchAttempted] = useState(false);
  
  const [prices, setPrices] = useState({
    miniBike: { price: mlPricesData.products.miniBike.price, originalPrice: mlPricesData.products.miniBike.originalPrice || 0 },
    spinning: { price: mlPricesData.products.spinning.price, originalPrice: mlPricesData.products.spinning.originalPrice || 0 },
    miniBike2: { price: mlPricesData.products.miniBike2.price, originalPrice: mlPricesData.products.miniBike2.originalPrice || 0 },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('🔐 Verificando senha...');

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        setMessage('✅ Acesso liberado!');
      } else {
        setMessage('❌ Senha incorreta');
      }
    } catch (error) {
      setMessage('❌ Erro ao autenticar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFetch = async () => {
    setLoading(true);
    setMessage('🔄 Tentando buscar preços automaticamente do Mercado Livre...');
    setAutoFetchAttempted(true);

    try {
      const response = await fetch('/api/ml-products/fetch', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success && data.prices) {
        // Atualizar preços com dados do ML
        setPrices(data.prices);
        setMessage('✅ Preços atualizados automaticamente! Revise e salve.');
      } else {
        setMessage('⚠️ Não foi possível buscar automaticamente. Use a atualização manual abaixo.');
      }
    } catch (error) {
      setMessage('⚠️ Erro ao buscar automaticamente. Use a atualização manual abaixo.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('💾 Salvando preços...');

    try {
      const response = await fetch('/api/admin/update-prices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prices }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('✅ Preços atualizados com sucesso! Aguarde o deploy (~2 min).');
      } else {
        setMessage(`❌ Erro: ${data.error}`);
      }
    } catch (error) {
      setMessage('❌ Erro ao salvar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const openAllLinks = () => {
    Object.values(ML_LINKS).forEach(url => {
      window.open(url, '_blank');
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-lg shadow-2xl p-8 w-full max-w-md border border-red-500/20">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            🔒 Admin - Ultimate Fitness
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Senha de Acesso:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                placeholder="Digite a senha"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition"
            >
              {loading ? '⏳ Verificando...' : 'Entrar'}
            </button>
          </form>
          {message && (
            <div className="mt-4 p-3 bg-gray-700 rounded-lg text-center text-sm">
              {message}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-2xl p-6 md:p-8 border border-red-500/20">
          <h1 className="text-3xl font-bold text-white mb-2">
            🎯 Atualizar Preços - Mercado Livre
          </h1>
          <p className="text-gray-400 mb-6">
            Última atualização: {new Date(mlPricesData.lastUpdated).toLocaleString('pt-BR')}
          </p>

          {/* Botões de Ação */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <button
              onClick={handleAutoFetch}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? '⏳ Buscando...' : '🤖 Buscar Automaticamente'}
            </button>
            <button
              onClick={openAllLinks}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              🔗 Abrir Produtos no ML
            </button>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.includes('✅') ? 'bg-green-900/50 border border-green-500' :
              message.includes('❌') ? 'bg-red-900/50 border border-red-500' :
              'bg-yellow-900/50 border border-yellow-500'
            }`}>
              <p className="text-white">{message}</p>
            </div>
          )}

          {/* Formulário de Preços */}
          <div className="space-y-6">
            {Object.entries(prices).map(([key, data]) => (
              <div key={key} className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white capitalize">
                      {key === 'miniBike' ? 'Mini Bike' : key === 'miniBike2' ? 'Mini Bike Pro' : 'Spinning'}
                    </h3>
                    <a
                      href={ML_LINKS[key as keyof typeof ML_LINKS]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-400 hover:underline"
                    >
                      Ver no Mercado Livre →
                    </a>
                  </div>
                  <span className="text-2xl">
                    {key === 'miniBike' ? '🚴' : key === 'miniBike2' ? '🚴‍♀️' : '🏋️'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm">Preço Atual (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={data.price}
                      onChange={(e) => setPrices({
                        ...prices,
                        [key]: { ...data, price: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg border border-gray-500 focus:border-red-500 focus:outline-none text-lg font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm">Preço Original (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={data.originalPrice}
                      onChange={(e) => setPrices({
                        ...prices,
                        [key]: { ...data, originalPrice: parseFloat(e.target.value) || 0 }
                      })}
                      className="w-full px-4 py-3 bg-gray-600 text-white rounded-lg border border-gray-500 focus:border-red-500 focus:outline-none text-lg"
                      placeholder="Opcional"
                    />
                  </div>
                </div>

                {data.originalPrice > 0 && data.originalPrice > data.price && (
                  <div className="mt-3 text-green-400 font-semibold">
                    💰 Desconto: {Math.round(((data.originalPrice - data.price) / data.originalPrice) * 100)}%
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Botão Salvar */}
          <div className="mt-8">
            <button
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-bold py-4 rounded-lg transition text-lg"
            >
              {loading ? '⏳ Salvando...' : '💾 Salvar Preços'}
            </button>
          </div>

          {/* Instruções */}
          <div className="mt-8 p-4 bg-gray-700/30 rounded-lg border border-gray-600">
            <h3 className="text-white font-bold mb-2">📋 Como usar:</h3>
            <ol className="text-gray-300 text-sm space-y-1 list-decimal list-inside">
              <li>Clique em "Buscar Automaticamente" (pode não funcionar devido ao anti-bot do ML)</li>
              <li>Se falhar, clique em "Abrir Produtos no ML"</li>
              <li>Copie os preços de cada produto</li>
              <li>Cole nos campos acima</li>
              <li>Clique em "Salvar Preços"</li>
              <li>Aguarde ~2 minutos para o deploy automático</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
