# 🌌 Nebula Archive - Plataforma Cloud-Native de Armazenamento

## 📋 TL;DR (Too Long; Didn't Read)

**Nebula Archive** é uma infraestrutura **Enterprise-grade, Cloud-Native** construída na AWS para armazenamento e gerenciamento seguro de arquivos estáticos. O projeto implementa uma solução completa com segurança em camadas, utilizando:

- 🔐 **Presigned URLs** com expiração de 5 minutos para acesso temporário a arquivos
- 🛡️ **Múltiplas zonas de disponibilidade (Multi-AZ)** para alta disponibilidade
- 📊 **Arquitetura distribuída globalmente** via CloudFront para latência mínima
- 🔒 **Criptografia em repouso** (SSE-S3) e isolamento de rede com VPC
- 🚀 **Sem provisioning manual de buckets** - gerenciamento automático via backend

Este é um projeto **full-stack** que combina conhecimentos de **Frontend, Backend, Banco de Dados e Arquitetura Cloud**, implementado do zero por um jovem arquiteto em ascensão. A jornada não foi fácil, mas o resultado é robusto e escalável.

---

## 🏗️ Arquitetura do Projeto

![Arquitetura do Projeto](public/arquitetura/diagrama.jpeg)

> 💡 A imagem acima representa a topologia completa da infraestrutura, incluindo VPC, subnets públicas/privadas, ALB, EC2, RDS e distribuição global via CloudFront.

---

## 📚 Documentação Técnica

### 🌐 1. Fundação da Infraestrutura: VPC e Topologia de Rede

A VPC é o alicerce de toda a arquitetura. Foi configurada com **máxima disponibilidade** distribuindo recursos em **duas zonas de disponibilidade (AZs)** distintas: `us-east-1a` e `us-east-1b`.

#### Configuração de Rede (CIDR)

| Componente | Valor | Observação |
|-----------|-------|-----------|
| **Bloco CIDR Principal** | `10.0.0.0/16` | ~65.536 IPs disponíveis |
| **CIDR de Subrede** | `/24` | 256 IPs por subrede (5 reservados pela AWS) |
| **IPs Reservados AWS** | 5 por subrede | `.0` (rede), `.1` (gateway), `.2` (DNS), `.3` (reservado), `.255` (broadcast) |

<details>
  <summary>📸 Clique para ver as evidências visuais (Fotos 2-6)</summary>

#### Console VPC - Criação da Fundação
![VPC Console](public/imagens_da_documentacao_aws/2.jpeg)

#### Configuração do Bloco CIDR Principal (10.0.0.0/16)
![CIDR Configuration](public/imagens_da_documentacao_aws/3.jpeg)

#### Distribuição em 2 AZs com Subredes Públicas/Privadas
![Multi-AZ Setup](public/imagens_da_documentacao_aws/4.jpeg)

#### S3 Gateway Endpoint para Acesso Econômico
![S3 Gateway Endpoint](public/imagens_da_documentacao_aws/5.jpeg)

#### VPC Criada com Sucesso
![VPC Success](public/imagens_da_documentacao_aws/6.jpeg)

</details>

#### 🎯 Estratégia de Alta Disponibilidade

- **2 Subredes Públicas**: Hospedam o Application Load Balancer (ALB) em ambas as AZs
- **2 Subredes Privadas**: Hospedam instâncias EC2 (backend) isoladas da internet
- **1 NAT Gateway Zonal**: Permite que instâncias privadas façam requisições externas (patches, atualizações)
- **S3 Gateway Endpoint**: Reduz custos ao rotear tráfego S3 sem passar pelo NAT Gateway

> ⚠️ **Princípio de Evolução Arquitetural**: A arquitetura foi desenhada para suportar **Multi-AZ no RDS** desde o início. Embora o laboratório use Single-AZ por economia, a infrastructure-as-code está pronta para produção.

---

### 🔐 2. Segurança e Acesso: IAM, Roles e Policies

#### 2.1 IAM Policy para Acesso S3

A política `NebulaArchiveS3Policy` foi criada com permissões granulares para operações no bucket S3. Inicialmente nomeado `Nebula-Archive-Midia`, foi posteriormente renomeado para **`Nebula-Archive-Storage`** (melhor convenção).

<details>
  <summary>📸 Clique para ver as evidências visuais (Fotos 8-12)</summary>

#### Criação da Policy - Imagem 8
![Policy Creation Start](public/imagens_da_documentacao_aws/8.jpeg)

#### Policy Personalizada Gerada por IA - Imagem 9
![AI Generated Policy](public/imagens_da_documentacao_aws/9.jpeg)

#### Atualização para Nome Correto (nebula-archive-storage) - Imagem 10
![Correct Bucket Name](public/imagens_da_documentacao_aws/10.jpeg)

#### Policy Nomeada: NebulaArchiveS3Policy - Imagem 11
![Policy Named](public/imagens_da_documentacao_aws/11.jpeg)

#### Policy Criada com Sucesso - Imagem 12
![Policy Success](public/imagens_da_documentacao_aws/12.jpeg)

</details>

#### 2.2 EC2 Instance Role com Princípio de Menor Privilégio

A role `NebulaArchiveEC2Role` foi configurada com a política gerenciada AWS `AmazonSSMManageManagedInstanceCore`, permitindo:

- ✅ Acesso ao bucket S3 (`Nebula-Archive-Storage`) para leitura/escrita
- ✅ Acesso via **AWS Systems Manager (SSM)** em vez de SSH keys (mais seguro)
- ✅ Gerenciamento centralizado de acesso sem exposição de credenciais

<details>
  <summary>📸 Clique para ver as evidências visuais (Fotos 13-15)</summary>

#### Criação do EC2 Instance Profile - Imagem 13
![EC2 Role Creation](public/imagens_da_documentacao_aws/13.jpeg)

#### Role Nomeada: NebulaArchiveEC2Role - Imagem 14
![EC2 Role Named](public/imagens_da_documentacao_aws/14.jpeg)

#### Profile Criado com Sucesso - Imagem 15
![Profile Success](public/imagens_da_documentacao_aws/15.jpeg)

</details>

> 🔒 **Segurança**: Nenhuma Access Key foi criada. O acesso é 100% via Systems Manager Session Manager, eliminando o risco de vazamento de credentials.

---

### 🛡️ 3. Security Groups: Controle de Tráfego em Camadas

Três security groups foram criados para isolamento de tráfego por função:

#### 3.1 ALB Security Group (`NebulaArchive-ALB-SG`)

| Tipo | Protocolo | Porta | Origem | Propósito |
|------|-----------|-------|--------|----------|
| HTTP | TCP | 80 | 0.0.0.0/0 | Acesso público ao balanceador |
| HTTPS | TCP | 443 | 0.0.0.0/0 | Tráfego seguro para ALB |

<details>
  <summary>📸 Clique para ver as evidências visuais (Fotos 16-19)</summary>

#### Console de Security Groups - Imagem 16
![SG Console](public/imagens_da_documentacao_aws/16.jpeg)

#### Criação do ALB Security Group - Imagem 17
![ALB SG Creation](public/imagens_da_documentacao_aws/17.jpeg)

#### Regras de Entrada (HTTP/HTTPS) - Imagem 18
![ALB Ingress Rules](public/imagens_da_documentacao_aws/18.jpeg)

#### ALB SG Criado com Sucesso - Imagem 19
![ALB SG Success](public/imagens_da_documentacao_aws/19.jpeg)

</details>

#### 3.2 EC2 Security Group (`NebulaArchive-EC2-SG`)

| Tipo | Protocolo | Porta | Origem | Propósito |
|------|-----------|-------|--------|----------|
| TCP Personalizado | TCP | 3000 | `NebulaArchive-ALB-SG` | Backend NestJS |

⚠️ **Crítico**: A porta **3000** deve estar em sincronização perfeita em:
- Backend `main.ts`
- Docker container expose
- ALB target group
- Security group rule

<details>
  <summary>📸 Clique para ver as evidências visuais (Fotos 20-22)</summary>

#### Criação do EC2 Security Group - Imagem 20
![EC2 SG Creation](public/imagens_da_documentacao_aws/20.jpeg)

#### Regras de Entrada Personalizadas (Porta 3000) - Imagem 21
![EC2 Ingress Rules](public/imagens_da_documentacao_aws/21.jpeg)

#### EC2 SG Criado com Sucesso - Imagem 22
![EC2 SG Success](public/imagens_da_documentacao_aws/22.jpeg)

</details>

#### 3.3 RDS Security Group (`NebulaArchive-RDS-SG`)

| Tipo | Protocolo | Porta | Origem | Propósito |
|------|-----------|-------|--------|----------|
| PostgreSQL | TCP | 5432 | `NebulaArchive-EC2-SG` | Conexão BD (EC2 → RDS) |

> 📌 A porta **5432** é o listener padrão PostgreSQL na AWS, independente da porta exposta no Docker (`9000:5432`).

<details>
  <summary>📸 Clique para ver as evidências visuais (Fotos 23-24)</summary>

#### Criação do RDS Security Group - Imagem 23
![RDS SG Creation](public/imagens_da_documentacao_aws/23.jpeg)

#### RDS SG Criado com Sucesso - Imagem 24
![RDS SG Success](public/imagens_da_documentacao_aws/24.jpeg)

</details>

---

### 🗄️ 4. Banco de Dados: RDS PostgreSQL com Prisma ORM

O RDS PostgreSQL foi configurado como o **coração da aplicação**, armazenando dados de usuários, metadados de arquivos e logs de transações.

#### Configuração de Instância

| Parâmetro | Valor | Justificativa |
|-----------|-------|---------------|
| **Motor** | PostgreSQL 15+ | Motor relacional robusto, suporte a JSON, índices avançados |
| **Tier** | `db.t4g.micro` | Gratuito no Free Tier (2 vCPUs, 1GB RAM) |
| **Armazenamento** | 50 GB | Escalado de 20GB padrão para accommodar crescimento |
| **Backup** | Automático | Retenção de 7 dias (configurável) |
| **Implantação** | Single-AZ (laboratório) | Preparado para Multi-AZ em produção |

<details>
  <summary>📸 Clique para ver as evidências visuais (Fotos 25-33)</summary>

#### Console RDS - Imagem 25
![RDS Console](public/imagens_da_documentacao_aws/25.jpeg)

#### Seleção do Motor PostgreSQL - Imagem 26
![PostgreSQL Selection](public/imagens_da_documentacao_aws/26.jpeg)

#### Plano Gratuito (db.t4g.micro) - Imagem 27
![Free Tier Selection](public/imagens_da_documentacao_aws/27.jpeg)

#### Reconfiguração PostgreSQL - Imagem 28
![PostgreSQL Config](public/imagens_da_documentacao_aws/28.jpeg)

#### Implantação Single-AZ - Imagem 29
![Single-AZ Deployment](public/imagens_da_documentacao_aws/29.jpeg)

#### Nome da Instância e Credenciais - Imagem 30
![DB Name & Credentials](public/imagens_da_documentacao_aws/30.jpeg)

#### Tipo de Instância e Armazenamento - Imagem 31
![Instance Type Storage](public/imagens_da_documentacao_aws/31.jpeg)

#### Conectividade VPC - Imagem 32
![VPC Connectivity](public/imagens_da_documentacao_aws/32.jpeg)

#### Security Group RDS Atribuído - Imagem 33
![RDS SG Assignment](public/imagens_da_documentacao_aws/33.jpeg)

#### RDS Criado com Sucesso - Imagem 42
![RDS Success](public/imagens_da_documentacao_aws/42.jpeg)

</details>

#### Conexão ORM Prisma

```typescript
// prisma/.env
DATABASE_URL="postgresql://admin:senha@RDSDatabaseNebula.xxxxx.us-east-1.rds.amazonaws.com:5432/nebula_db"
```

O Prisma converte queries TypeScript em SQL otimizado, executado no RDS.

---

### 💾 5. Storage S3: Buckets Privados com Criptografia

#### 5.1 Bucket de Armazenamento Permanente (`Nebula-Archive-Storage`)

Armazena todos os arquivos estáticos dos usuários de forma **permanente e privada**.

<details>
  <summary>📸 Clique para ver as evidências visuais (Fotos 34-37)</summary>

#### Criação do Bucket Inicial - Imagem 34
![Bucket Creation](public/imagens_da_documentacao_aws/34.jpeg)

#### Bloqueio de Acesso Público (Essencial) - Imagem 35
![Block Public Access](public/imagens_da_documentacao_aws/35.jpeg)

#### Criptografia SSE-S3 Ativada - Imagem 36
![SSE-S3 Encryption](public/imagens_da_documentacao_aws/36.jpeg)

#### Bucket Criado com Sucesso - Imagem 37
![Bucket Success](public/imagens_da_documentacao_aws/37.jpeg)

</details>

**Configuração de Criptografia:**
- 🔐 **SSE-S3**: Amazon S3-Managed Keys
- 🔑 Chaves rotacionadas automaticamente pela AWS
- 📊 Sem custo adicional

#### 5.2 Presigned URLs: O Coração da Segurança

Quando um usuário faz upload de um arquivo:

```
1. Frontend → Backend: POST /upload (credenciais válidas)
2. Backend verifica JWT e gera Presigned URL
3. Backend retorna URL + expiração de 5 minutos
4. Frontend faz PUT direto ao S3 via URL
5. Após 5 min, URL expira permanentemente
```

**Proteções:**

- ✅ Não expõe credenciais AWS ao frontend
- ✅ URL expires em 5 minutos (curto prazo)
- ✅ Qualquer modificação na URL (ex: alteração de caractere) invalida a assinatura
- ✅ S3 rejeita requisições com assinatura inválida
- ✅ Força bruta é inviável (impossível gerar assinatura válida sem secret)

---

### 🖥️ 6. Instâncias de Computação: EC2 para Backend

Uma instância **EC2 única** hospeda o backend NestJS + ORM Prisma. Em produção, seria escalada via **Auto Scaling Group**.

#### Configuração da Instância

| Parâmetro | Valor | Observação |
|-----------|-------|-----------|
| **Nome** | `NebulaArchive-Backend` | Identificável |
| **AMI** | Amazon Linux 2 | Leve, eficiente, padrão de mercado |
| **Tipo** | Configurável (lab: t2.micro) | Escalável |
| **VPC** | `nebula-archive` | Mesma VPC |
| **Subnet** | Privada (`us-east-1a` ou `b`) | Sem IP público |
| **Security Group** | `NebulaArchive-EC2-SG` | Porta 3000 |
| **Role IAM** | `NebulaArchiveEC2Role` | Acesso S3 |
| **Access Keys** | ❌ Não criadas | Acesso via SSM Session Manager |

<details>
  <summary>📸 Clique para ver as evidências visuais (Fotos 38-43)</summary>

#### Painel EC2 - Imagem 38
![EC2 Dashboard](public/imagens_da_documentacao_aws/38.jpeg)

#### Configuração de VPC e Subnet Privada - Imagem 39
![EC2 VPC Config](public/imagens_da_documentacao_aws/39.jpeg)

#### Atribuição de Security Group e Role IAM - Imagem 40
![EC2 SG and Role](public/imagens_da_documentacao_aws/40.jpeg)

#### EC2 Rodando com Sucesso - Imagem 41
![EC2 Running](public/imagens_da_documentacao_aws/41.jpeg)

#### Verificação de Docker e Docker Compose - Imagem 43
![Docker Verification](public/imagens_da_documentacao_aws/43.jpeg)

</details>

#### 🚀 Deployment do Backend

O projeto foi clonado via Git e executado em Docker:

```bash
# No terminal SSM da EC2
git clone https://github.com/seu-usuario/Nebula-Archive.git
cd Nebula-Archive/Backend
nano .env  # Configurar DATABASE_URL, BUCKET_NAME, AWS_REGION
docker-compose up -d
```

**Arquivo `.env` (exemplo destruído):**
```env
DATABASE_URL=postgresql://admin:senha@RDSDatabaseNebula.xxxxx.us-east-1.rds.amazonaws.com:5432/nebula
AWS_BUCKET_NAME=Nebula-Archive-Storage
AWS_REGION=us-east-1
BACKEND_PORT=3000
JWT_SECRET=seu_secret_super_seguro
```

<details>
  <summary>📸 Clique para ver a evidência do .env (Foto 56)</summary>

#### Arquivo .env Configurado - Imagem 56
![.env Configuration](public/imagens_da_documentacao_aws/56.jpeg)

</details>

---

### 🎯 7. Application Load Balancer (ALB): Orquestração de Tráfego

O ALB recebe todo o tráfego da internet (porta 80) e distribui para a(s) instância(s) EC2 na porta 3000.

#### Configuração do Target Group

<details>
  <summary>📸 Clique para ver as evidências visuais (Fotos 44-47)</summary>

#### Criação do Target Group - Imagem 44
![Target Group Creation](public/imagens_da_documentacao_aws/44.jpeg)

#### Configuração: TG-Nebula-Archive, Porta 3000 - Imagem 45
![Target Group Config](public/imagens_da_documentacao_aws/45.jpeg)

#### Atribuição de EC2 ao Target Group - Imagem 46
![EC2 to TG Assignment](public/imagens_da_documentacao_aws/46.jpeg)

#### Target Group Criado com Sucesso - Imagem 47
![TG Success](public/imagens_da_documentacao_aws/47.jpeg)

</details>

#### Configuração do ALB

| Parâmetro | Valor |
|-----------|-------|
| **Nome** | `ALB-Nebula-Archive` |
| **Esquema** | Internet-facing |
| **Subnets** | `nebula-archive-subnet-public1` (us-east-1a) + `nebula-archive-subnet-public2` (us-east-1b) |
| **Security Group** | `NebulaArchive-ALB-SG` |
| **Listener** | Porta 80 (HTTP) → Target Group (Porta 3000) |
| **Protocolo** | HTTP (lab) / HTTPS recomendado (prod) |

<details>
  <summary>📸 Clique para ver as evidências visuais (Fotos 48-53)</summary>

#### Opções de ELB - Imagem 48
![ELB Options](public/imagens_da_documentacao_aws/48.jpeg)

#### Configuração do ALB - Imagem 49
![ALB Configuration](public/imagens_da_documentacao_aws/49.jpeg)

#### Seleção de Subnets Públicas - Imagem 50
![ALB Subnets](public/imagens_da_documentacao_aws/50.jpeg)

#### Atribuição de Security Group - Imagem 51
![ALB SG Assignment](public/imagens_da_documentacao_aws/51.jpeg)

#### Configuração de Listener e Target Group - Imagem 52
![ALB Listener Config](public/imagens_da_documentacao_aws/52.jpeg)

#### ALB Criado com Sucesso - Imagem 53
![ALB Success](public/imagens_da_documentacao_aws/53.jpeg)

</details>

#### 🔄 Fluxo de Tráfego

```
[Internet] → [ALB port 80] → [Target Group] → [EC2 port 3000]
```

> ⚠️ **Crítico**: Em produção, usar **Auto Scaling** para escalabilidade automática. O architecture foi desenhada com isso em mente desde o início.

---

### 🌍 8. Frontend & Distribuição Global via CloudFront

#### 8.1 Bucket Frontend (`nebula-archive-frontend-prod`)

Armazena todos os arquivos estáticos do React/Vite compilados (pasta `dist/`).

<details>
  <summary>📸 Clique para ver as evidências visuais (Fotos 60-64)</summary>

#### Criação do Bucket Frontend - Imagem 60
![Frontend Bucket Creation](public/imagens_da_documentacao_aws/60.jpeg)

#### Bloqueio de Acesso Público (Essencial) - Imagem 61
![Block Frontend Public Access](public/imagens_da_documentacao_aws/61.jpeg)

#### Bucket Frontend Criado - Imagem 62
![Frontend Bucket Success](public/imagens_da_documentacao_aws/62.jpeg)

#### Upload de Arquivos da Pasta DIST - Imagem 63
![DIST Upload](public/imagens_da_documentacao_aws/63.jpeg)

#### Build com PNPM e Upload de index.html - Imagem 64
![PNPM Build and index.html](public/imagens_da_documentacao_aws/64.jpeg)

</details>

**Build do Frontend Localmente:**

```bash
cd Frontend
pnpm install
pnpm run build
# Gera pasta 'dist/' com todos os arquivos estáticos otimizados
```

> 💡 **PNPM vs NPM**: Escolhido por ser mais leve (~50% menos espaço) e versátil. Primeira vez usando PNPM - prova de adaptabilidade a mudanças.

#### 8.2 CloudFront Distribution (`frontend-distribution`)

Distribui o conteúdo estático globalmente através de **154+ edge locations** da AWS, reduzindo latência.

<details>
  <summary>📸 Clique para ver as evidências visuais (Fotos 65-76)</summary>

#### Criação da Distribuição - Imagem 65
![Distribution Creation](public/imagens_da_documentacao_aws/65.jpeg)

#### Seleção de Origem (S3 Frontend) - Imagem 66
![Origin Selection](public/imagens_da_documentacao_aws/66.jpeg)

#### Ativação de WAF para Proteção SQL Injection - Imagem 67
![WAF Activation](public/imagens_da_documentacao_aws/67.jpeg)

#### Proteção DDoS Shield - Imagem 68
![DDoS Shield](public/imagens_da_documentacao_aws/68.jpeg)

#### Distribuição Criada - Imagem 69
![Distribution Created](public/imagens_da_documentacao_aws/69.jpeg)

#### Definição de index.html como Default Root Object - Imagem 70
![Index HTML Default](public/imagens_da_documentacao_aws/70.jpeg)

#### Cópia da Distribution Policy para Bucket - Imagem 71
![Copy Distribution Policy](public/imagens_da_documentacao_aws/71.jpeg)

#### Aplicação de Bucket Policy - Imagem 72
![Apply Bucket Policy](public/imagens_da_documentacao_aws/72.jpeg)

#### Criação de Error Pages (403, 404) - Imagem 73
![Error Pages Creation](public/imagens_da_documentacao_aws/73.jpeg)

#### Error Pages Configuradas - Imagem 74
![Error Pages Done](public/imagens_da_documentacao_aws/74.jpeg)

#### Cache Invalidation via "/*" - Imagem 75
![Cache Invalidation](public/imagens_da_documentacao_aws/75.jpeg)

#### Index.html Definido Como Default - Imagem 76
![Index Default Confirmed](public/imagens_da_documentacao_aws/76.jpeg)

</details>

#### 🔒 Configuração de Segurança CloudFront

| Aspecto | Configuração |
|--------|------------|
| **OAC (Origin Access Control)** | Ativado (recomendado em vez de OAI) |
| **WAF (Web Application Firewall)** | Ativado (proteção contra SQL Injection) |
| **DDoS Shield** | Ativado (proteção contra ataques distribuídos) |
| **Bucket Policy** | Restringe acesso apenas via CloudFront |
| **TTL** | Configurável (cache de conteúdo estático) |

> ⚠️ **Nota sobre WAF**: Inicialmente com nível "Alto", foi desativado temporariamente durante testes, depois reativado. Níveis altos podem bloquear requests legítimas - ajustar conforme necessário.

#### 🚀 Cache Invalidation

Após atualizar arquivos no S3, é necessário invalidar o cache:

```bash
# Invalida TODOS os arquivos em cache
aws cloudfront create-invalidation \
  --distribution-id E1234ABCD \
  --paths "/*"
```

Esse comando foi rodado várias vezes durante o desenvolvimento para refletir mudanças estratégicas.

---

### 📊 9. Otimização de Metadados S3

Para garantir que o navegador interprete corretamente os arquivos estáticos, metadados foram configurados:

<details>
  <summary>📸 Clique para ver as evidências visuais (Fotos 77-80)</summary>

#### Push do Backend para Repo - Imagem 77
![Backend Push](public/imagens_da_documentacao_aws/77.jpeg)

#### Edição de Metadados - Imagem 78
![Metadata Edit](public/imagens_da_documentacao_aws/78.jpeg)

#### Definição de CONTENT-TYPE - Imagem 79
![Content Type Definition](public/imagens_da_documentacao_aws/79.jpeg)

#### Resultado Final - Imagem 80
![Final Result](public/imagens_da_documentacao_aws/80.jpeg)

</details>

**Metadados Críticos:**

```
Content-Type: text/html (para index.html)
Content-Type: application/javascript (para .js)
Content-Type: text/css (para .css)
Content-Type: application/json (para .json)
```

---

## 💡 10. Aprendizados e Desafios

### 🎓 O Que Funcionou

✅ **Arquitetura Multi-AZ desde o início** - Mesmo em Single-AZ para economia, o design suporta Multi-AZ  
✅ **Princípio de Menor Privilégio** - IAM roles restritas, sem Access Keys expostas  
✅ **Presigned URLs** - Solução elegante para upload seguro sem exposição de credenciais  
✅ **VPC + NAT Gateway + S3 Gateway Endpoint** - Isolamento de rede com otimização de custos  
✅ **CloudFront + WAF + Shield** - Distribuição global com proteção em camadas  
✅ **Full-Stack Integration** - Frontend → ALB → Backend → RDS → S3  

### 🔧 Desafios Encontrados

⚠️ **Sincronização de Portas**: Todas as portas (Docker, Backend, SG, ALB, TG) precisam estar em perfeita sincronização. Erro em uma = falha total.

⚠️ **WAF com Nível Alto**: Inicialmente bloqueava requisições legítimas. Necessário ajuste fino de regras.

⚠️ **Index.html no CloudFront**: CloudFront precisa saber o arquivo default para root `/`. Sem isso, retorna 403.

⚠️ **Cache Invalidation**: Após mudanças no frontend, é necessário invalidar cache manualmente. Comando `aws cloudfront create-invalidation --paths "/*"` rodado múltiplas vezes.

⚠️ **Docker + EC2 via SSM**: Recriar container e enviá-lo exigiu pesquisa e iteração. Documentação em produção é crítica.

> 💬 **Reflexão**: A vida de um futuro arquiteto cloud sênior não é fácil. Mas com pesquisa, paciência e iteração, tudo é possível. Este foi meu **primeiro projeto Cloud-Native** combinando Frontend + Backend + BD + Infra. Aprendi muito.

---

## 🚀 Hello World! 🎉

<details>
  <summary>📸 O Resultado Final (Foto 59)</summary>

#### Backend Respondendo com Sucesso
![Hello World](public/imagens_da_documentacao_aws/59.jpeg)

O backend está up, BD está sincronizado, S3 pronto, CloudFront distribuindo globalmente. **Bingo!**

</details>

---

## 📝 Estrutura do Projeto

```
Nebula-Archive/
├── Backend/                    # NestJS + Prisma ORM
│   ├── src/
│   │   ├── authservice/       # Autenticação JWT
│   │   ├── files/             # Upload/Download com Presigned URLs
│   │   ├── users/             # Gerenciamento de usuários
│   │   ├── prisma/            # Conexão RDS
│   │   └── storage/           # Integração S3
│   ├── prisma/
│   │   ├── schema.prisma      # Definição do BD
│   │   └── migrations/        # Histórico de evolução do BD
│   └── Dockerfile
│
├── Frontend/                   # React + Vite
│   ├── src/
│   │   ├── components/        # UI Components
│   │   ├── lib/               # Utilitários (API client, auth context)
│   │   └── hooks/             # Custom hooks
│   ├── dist/                  # Output build (enviado para S3)
│   └── vite.config.ts
│
├── Database/                   # RDS PostgreSQL (configurado via AWS)
│   └── Dockerfile             # (Opcional para testes locais)
│
├── public/
│   ├── arquitetura/           # Diagrama da arquitetura
│   └── imagens_da_documentacao_aws/  # 80 imagens de evidências
│
└── README.md                   # Este arquivo
```

---

## 🔐 Segurança: Checklist de Boas Práticas

- [x] VPC isolada da internet (subredes privadas para EC2)
- [x] Security Groups com least privilege (menor privilégio)
- [x] RDS com credenciais não expostas em código
- [x] EC2 sem SSH keys - acesso via Systems Manager
- [x] S3 com bloqueio de acesso público
- [x] S3 com criptografia SSE-S3 em repouso
- [x] Presigned URLs com expiração curta (5 minutos)
- [x] CloudFront com WAF ativado
- [x] Shield ativado contra DDoS
- [x] ALB em múltiplas AZs para alta disponibilidade
- [x] Bucket policy restringindo acesso apenas via CloudFront

---

## 💰 Gerenciamento de Custos

### Itens Caros para Monitorar

⚠️ **NAT Gateway** - ~$32/mês por NAT Gateway (us-east-1)  
⚠️ **ALB** - ~$16/mês + $0.006/LCU  
⚠️ **Data Transfer** - Cobrado por gigabyte saído (exceto S3 Gateway Endpoint)  

### Economia Aplicada

✅ **Free Tier AWS** - 200 créditos/mês (primeiros 12 meses)  
✅ **Single-AZ no RDS** - Economia no laboratório  
✅ **S3 Gateway Endpoint** - Economiza custo de NAT Gateway para tráfego S3  
✅ **CloudFront** - Sem custo de data transfer para origem S3 (mesmo region)  

---

## 🛠️ Como Executar Localmente (Dev Environment)

### Pré-requisitos

```bash
# Node.js 18+
# Docker & Docker Compose
# AWS CLI v2
# PNPM (ou NPM)
```

### Backend

```bash
cd Backend
cp .env.example .env
# Editar .env com credenciais locais/RDS
pnpm install
pnpm run build
pnpm run start:dev
```

### Frontend

```bash
cd Frontend
pnpm install
pnpm run dev
# Acessar http://localhost:5173
```

### Banco de Dados

```bash
# Usando Docker Compose (local)
docker-compose up -d

# Rodar migrations
pnpm prisma migrate dev
```

---

## 📞 Contato & Suporte

Este projeto é uma **prova de conceito de arquitetura Cloud-Native Enterprise**. Para dúvidas sobre implementação, abra uma issue no repositório.

---

## 📄 Licença

MIT License - Sinta-se livre para usar como referência.

---

**Construído com ❤️, ☕ e muito 🧠 - Primeiro projeto Cloud-Native de um arquiteto em ascensão.**
