import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Button from '../components/Button'
import Navbar from '../components/Navbar'
import Logo from '../components/Logo'

const TestAPI = () => {
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [token, setToken] = useState('')
  const { user } = useAuth()

  // Datos de prueba
  const testUser = {
    nombre: 'Juan',
    apellido: 'Pérez',
    email: `juan.perez${Date.now()}@test.com`, // Email único con timestamp
    password: '123456',
    telefono: '0991234567',
    fechaNacimiento: '1990-01-01',
    rol: 'paciente'
  }

  // Función para probar endpoints
  const testEndpoint = async (endpoint, method = 'GET', data = null) => {
    try {
      setLoading(true)
      let response
      
      switch (method) {
        case 'POST':
          response = await api.post(endpoint, data)
          break
        case 'PUT':
          response = await api.put(endpoint, data)
          break
        case 'GET':
        default:
          response = await api.get(endpoint)
          break
      }
      
      setResults(prev => ({
        ...prev,
        [endpoint]: {
          success: true,
          data: response.data,
          status: response.status
        }
      }))
      
      return { success: true, data: response.data }
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [endpoint]: {
          success: false,
          error: error.response?.data?.msg || error.message,
          status: error.response?.status
        }
      }))
      
      return { success: false, error: error.response?.data?.msg || error.message }
    } finally {
      setLoading(false)
    }
  }

  // Pruebas de autenticación
  const testRegistro = () => testEndpoint('/api/auth/registro', 'POST', testUser)
  const testLogin = () => testEndpoint('/api/auth/login', 'POST', { email: testUser.email, password: testUser.password })
  const testVerificarToken = () => testEndpoint('/api/auth/verificar-token')
  const testPerfil = () => testEndpoint('/api/auth/perfil')
  const testActualizarPerfil = () => testEndpoint('/api/auth/perfil', 'PUT', { nombre: 'Juan Actualizado' })

  // Pruebas de recuperación
  const testRecuperarPassword = () => {
    console.log('📤 Enviando recuperación para:', testUser.email)
    testEndpoint('/api/auth/recuperar-password', 'POST', { email: testUser.email })
  }
  
  // Prueba de confirmación (simulada)
  const testConfirmarCuenta = () => {
    if (token) {
      testEndpoint(`/api/auth/confirmar/${token}`)
    } else {
      alert('Ingresa un token de confirmación para probar')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} user={user} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Logo size="large" className="justify-center" />
          <h1 className="text-3xl font-bold text-gray-900 mt-4">🧪 Prueba Completa de API</h1>
          <p className="text-gray-600 mt-2">Backend Dental Bosch - Todos los Endpoints</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Autenticación */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🔐 Autenticación</h2>
            <div className="space-y-3">
              <Button onClick={testRegistro} loading={loading} className="w-full">
                📝 Test Registro
              </Button>
              <Button onClick={testLogin} loading={loading} className="w-full">
                🔑 Test Login
              </Button>
              <Button onClick={testVerificarToken} loading={loading} className="w-full">
                ✅ Test Verificar Token
              </Button>
            </div>
          </div>

          {/* Perfil */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">👤 Perfil de Usuario</h2>
            <div className="space-y-3">
              <Button onClick={testPerfil} loading={loading} className="w-full">
                👁 Test Obtener Perfil
              </Button>
              <Button onClick={testActualizarPerfil} loading={loading} className="w-full">
                ✏️ Test Actualizar Perfil
              </Button>
            </div>
          </div>

          {/* Pacientes */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">👥 Gestión de Pacientes</h2>
            <div className="space-y-3">
              <Button onClick={() => testEndpoint('/api/pacientes/', 'GET')} loading={loading} className="w-full">
                📋 Test Obtener Todos los Pacientes
              </Button>
              <Button onClick={() => testEndpoint('/api/pacientes/69b190f68138b8fcf2785014', 'GET')} loading={loading} className="w-full">
                🔍 Test Obtener Paciente por ID
              </Button>
            </div>
          </div>

          {/* Recuperación */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🔧 Recuperación de Password</h2>
            <div className="space-y-3">
              <Button onClick={testRecuperarPassword} loading={loading} className="w-full">
                📧 Test Recuperar Password
              </Button>
            </div>
          </div>

          {/* Confirmación */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">✅ Confirmación de Cuenta</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Token de confirmación"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button onClick={testConfirmarCuenta} loading={loading} className="w-full">
                🔗 Test Confirmar Cuenta
              </Button>
            </div>
          </div>

          {/* Info de prueba */}
          <div className="bg-blue-50 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">ℹ️ Info de Prueba</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Email actual:</strong> {testUser.email}</p>
              <p><strong>Password:</strong> {testUser.password}</p>
              <p><strong>Timestamp:</strong> {Date.now()}</p>
              <p className="text-blue-600">Cada prueba usa un email único</p>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Resultados de Pruebas</h2>
          <div className="space-y-3">
            {Object.entries(results).map(([endpoint, result]) => (
              <div key={endpoint} className={`p-4 rounded-lg border ${
                result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm">{endpoint}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {result.success ? '✅' : '❌'}
                  </span>
                </div>
                <div className="mt-2 text-sm">
                  {result.success ? (
                    <div>
                      <span className="text-green-700">✅ Éxito</span>
                      <div className="text-gray-600 mt-1">
                        Status: {result.status}<br/>
                        Data: {JSON.stringify(result.data, null, 2)}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span className="text-red-700">❌ Error</span>
                      <div className="text-gray-600 mt-1">
                        Status: {result.status}<br/>
                        Error: {result.error}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestAPI
