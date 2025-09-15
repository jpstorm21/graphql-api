# Guía de Testing

Este proyecto incluye una suite completa de tests que cubre todos los aspectos de la aplicación GraphQL API.

## Tipos de Tests

### 1. Tests Unitarios (`*.spec.ts`)
- **Ubicación**: `src/**/*.spec.ts`
- **Propósito**: Testear componentes individuales de forma aislada
- **Cobertura**: Servicios, Resolvers, Helpers

### 2. Tests de Integración (`*.integration.spec.ts`)
- **Ubicación**: `src/**/*.integration.spec.ts`
- **Propósito**: Testear la interacción entre componentes dentro de un módulo
- **Cobertura**: Módulos completos (UserModule, RoleModule)

### 3. Tests End-to-End (`*.e2e-spec.ts`)
- **Ubicación**: `test/**/*.e2e-spec.ts`
- **Propósito**: Testear la aplicación completa desde la perspectiva del usuario
- **Cobertura**: Endpoints GraphQL, flujos completos

## Scripts Disponibles

```bash
# Ejecutar todos los tests unitarios
npm run test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con cobertura
npm run test:cov

# Ejecutar tests con cobertura en modo watch
npm run test:cov:watch

# Ejecutar solo tests unitarios
npm run test:unit

# Ejecutar solo tests de integración
npm run test:integration

# Ejecutar tests E2E
npm run test:e2e

# Ejecutar tests E2E en modo watch
npm run test:e2e:watch

# Ejecutar todos los tests (unitarios + E2E)
npm run test:all

# Debug de tests
npm run test:debug
```

## Estructura de Tests

```
src/
├── modules/
│   ├── user/
│   │   ├── user.service.spec.ts          # Tests unitarios del servicio
│   │   ├── user.resolver.spec.ts         # Tests unitarios del resolver
│   │   └── user.integration.spec.ts     # Tests de integración del módulo
│   └── role/
│       ├── role.service.spec.ts          # Tests unitarios del servicio
│       ├── role.resolver.spec.ts         # Tests unitarios del resolver
│       └── role.integration.spec.ts      # Tests de integración del módulo
├── helpers/
│   └── bcrypt.spec.ts                    # Tests unitarios de helpers
└── ...

test/
├── app.e2e-spec.ts                       # Tests E2E principales
├── user.e2e-spec.ts                       # Tests E2E específicos de usuarios
├── role.e2e-spec.ts                       # Tests E2E específicos de roles
├── setup.ts                               # Configuración global de tests
└── jest-e2e.json                         # Configuración Jest para E2E
```

## Cobertura de Tests

El proyecto está configurado para mantener una cobertura mínima del 80% en:
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

### Verificar Cobertura

```bash
npm run test:cov
```

Los reportes de cobertura se generan en:
- **HTML**: `coverage/lcov-report/index.html`
- **LCOV**: `coverage/lcov.info`
- **Texto**: En la consola

## Configuración

### Jest (Tests Unitarios)
- **Archivo**: `package.json` (sección `jest`)
- **Patrón**: `*.spec.ts`
- **Directorio**: `src/`
- **Timeout**: 30 segundos

### Jest E2E
- **Archivo**: `test/jest-e2e.json`
- **Patrón**: `*.e2e-spec.ts`
- **Directorio**: `test/`

### Setup Global
- **Archivo**: `test/setup.ts`
- Configuración de variables de entorno
- Limpieza de mocks
- Configuración de console

## Mejores Prácticas

### 1. Tests Unitarios
- Usar mocks para dependencias externas
- Testear casos de éxito y error
- Verificar que los métodos se llamen con los parámetros correctos
- Usar `beforeEach` y `afterEach` para setup/cleanup

### 2. Tests de Integración
- Testear la interacción real entre componentes
- Usar mocks solo para dependencias externas (BD, APIs)
- Verificar flujos completos

### 3. Tests E2E
- Testear desde la perspectiva del usuario final
- Usar datos reales cuando sea posible
- Verificar respuestas HTTP completas

### 4. Naming Conventions
- **Describe**: Describir el componente o funcionalidad
- **It**: Describir el comportamiento específico
- **Variables**: Usar prefijos como `mock`, `expected`, `actual`

## Ejemplos de Uso

### Test Unitario de Servicio
```typescript
describe('UserService', () => {
  it('should create user successfully', async () => {
    // Arrange
    const userData = { name: 'Juan', email: 'juan@test.com' };
    userRepository.save.mockResolvedValue(mockUser);

    // Act
    const result = await userService.createUser(userData);

    // Assert
    expect(result).toEqual(mockUser);
    expect(userRepository.save).toHaveBeenCalledWith(expect.objectContaining(userData));
  });
});
```

### Test E2E de GraphQL
```typescript
it('should create user via GraphQL', () => {
  const mutation = `
    mutation {
      createUser(input: { name: "Juan", email: "juan@test.com" }) {
        id
        name
      }
    }
  `;

  return request(app.getHttpServer())
    .post('/graphql')
    .send({ query: mutation })
    .expect(200);
});
```

## Troubleshooting

### Tests que fallan por timeout
- Aumentar el timeout en `test/setup.ts`
- Verificar que los mocks estén configurados correctamente

### Tests E2E que fallan
- Verificar que la aplicación se inicie correctamente
- Revisar la configuración de la base de datos de test
- Verificar que los endpoints GraphQL estén disponibles

### Cobertura baja
- Agregar tests para casos edge
- Verificar que todos los branches estén cubiertos
- Revisar archivos excluidos en la configuración de Jest
