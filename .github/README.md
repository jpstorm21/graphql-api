# GitHub Actions Workflows

Este directorio contiene los workflows de GitHub Actions para automatizar el CI/CD del proyecto GraphQL API.

## Workflows Disponibles

### 1. Tests (`test.yml`)
**Trigger**: Push y Pull Requests en branches principales
**Funciones**:
- Ejecuta tests unitarios y E2E
- Genera reportes de cobertura
- Ejecuta en múltiples versiones de Node.js (18.18.0, 20.x)
- Configura PostgreSQL como servicio
- Sube cobertura a Codecov
- Comenta PRs con información de cobertura

### 2. Deploy (`deploy.yml`)
**Trigger**: Push a main/master y cuando Tests pasen exitosamente
**Funciones**:
- Construye la aplicación
- Crea imagen Docker
- Despliega a la plataforma configurada
- Solo se ejecuta si los tests pasan

### 3. Code Quality (`quality.yml`)
**Trigger**: Push y Pull Requests
**Funciones**:
- Ejecuta ESLint
- Verifica formato con Prettier
- Verifica tipos con TypeScript
- Ejecuta auditoría de seguridad
- Verifica dependencias desactualizadas

### 4. Setup Environment (`setup-env.yml`)
**Trigger**: Manual
**Funciones**:
- Configura el entorno de desarrollo
- Genera tipos GraphQL
- Ejecuta migraciones de base de datos
- Verifica la configuración

## Configuración Requerida

### Secrets de GitHub
Para que los workflows funcionen completamente, necesitas configurar estos secrets en tu repositorio:

```bash
# Para Codecov (opcional)
CODECOV_TOKEN=your_codecov_token

# Para SonarCloud (opcional)
SONAR_TOKEN=your_sonar_token

# Para despliegue (ejemplo con Heroku)
HEROKU_API_KEY=your_heroku_api_key

# Para AWS (si usas ECS)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
```

### Configuración de Codecov
1. Ve a [codecov.io](https://codecov.io)
2. Conecta tu repositorio de GitHub
3. Copia el token y agrégalo como secret `CODECOV_TOKEN`

### Configuración de SonarCloud
1. Ve a [sonarcloud.io](https://sonarcloud.io)
2. Crea un proyecto para tu repositorio
3. Genera un token y agrégalo como secret `SONAR_TOKEN`

## Variables de Entorno

Los workflows usan estas variables de entorno:

```yaml
NODE_ENV: test
DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
```

## Matriz de Testing

Los tests se ejecutan en múltiples versiones de Node.js:
- **18.18.0**: Versión específica del proyecto
- **20.x**: Última versión LTS

## Servicios

### PostgreSQL
- **Imagen**: postgres:15
- **Puerto**: 5432
- **Usuario**: postgres
- **Contraseña**: postgres
- **Base de datos**: test_db

## Comandos Disponibles

```bash
# Ejecutar tests localmente (simulando CI)
npm ci
npm run test:cov
npm run test:e2e

# Verificar calidad de código
npm run lint
npx prettier --check "src/**/*.ts" "test/**/*.ts"
npx tsc --noEmit
npm audit

# Generar tipos GraphQL
npm run generate-types
```

## Troubleshooting

### Tests fallan en CI pero pasan localmente
1. Verifica que uses la misma versión de Node.js
2. Asegúrate de que las variables de entorno estén configuradas
3. Verifica que PostgreSQL esté disponible

### Cobertura no se sube a Codecov
1. Verifica que el token `CODECOV_TOKEN` esté configurado
2. Asegúrate de que el archivo `coverage/lcov.info` se genere correctamente

### Deploy falla
1. Verifica que los secrets de la plataforma de despliegue estén configurados
2. Asegúrate de que los tests pasen antes del deploy
3. Verifica la configuración de la plataforma de destino

## Personalización

### Agregar más versiones de Node.js
```yaml
strategy:
  matrix:
    node-version: [16.x, 18.18.0, 20.x, 21.x]
```

### Cambiar la base de datos de test
```yaml
services:
  mysql:
    image: mysql:8.0
    env:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: test_db
```

### Agregar más plataformas de despliegue
```yaml
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v20
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.ORG_ID }}
    vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Monitoreo

Los workflows generan badges que puedes agregar a tu README:

```markdown
![Tests](https://github.com/tu-usuario/graphql-api/workflows/Tests/badge.svg)
![Deploy](https://github.com/tu-usuario/graphql-api/workflows/Deploy/badge.svg)
![Code Quality](https://github.com/tu-usuario/graphql-api/workflows/Code%20Quality/badge.svg)
```
