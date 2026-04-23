# 🌌 Nebula Archive - Infraestrutura Enterprise Cloud-Native para Armazenamento Distribuído

## 📊 TL;DR (O que você precisa saber)

| Aspecto | Descrição | Resultado |
|---------|-----------|-----------|
| **O que é** | Plataforma cloud-native de armazenamento e gerenciamento de arquivos estáticos sem provisioning manual de buckets | Sistema 100% automatizado via Presigned URLs |
| **Tecnologia** | AWS (VPC Multi-AZ, EC2, RDS PostgreSQL, S3, CloudFront, ALB, WAF, Shield, Systems Manager) + NestJS + React + Prisma ORM | Infraestrutura enterprise pronta para produção |
| **Segurança** | Presigned URLs (5 min expiry), SSE-S3, VPC isolada, IAM least privilege, WAF, Shield, Security Groups em camadas | Múltiplas camadas de proteção |
| **Escalabilidade** | Arquitetura designed para Multi-AZ, Auto Scaling ready, CloudFront global distribution | Latência mínima worldwide |
| **Custo** | AWS Free Tier + credenciais ($200) | Laboratório muito barato, pronto para upgrade |

---

## 🎥 Apresentação do Sistema em Video

[![Assista a apresentação do Nebula Archive](https://img.shields.io/badge/YouTube-Assista%20Aqui-red?style=for-the-badge&logo=youtube)](https://youtu.be/2mzU7E_bWJA)

---

## �️ Validação de Resiliência: Ataque Controlado

[![Assista ao Teste de Stress](https://img.shields.io/badge/YouTube-Assista%20ao%20Teste%20de%20Stress-red?style=for-the-badge&logo=youtube)](https://www.youtube.com/watch?v=kR-yKAzhazk)

Para validar as camadas de proteção do Nebula Archive, executei um ataque controlado de negação de serviço (HTTP Flood). O objetivo foi testar a eficácia da regra de Rate Limiting implementada no AWS WAF Global.

**Resultado do Teste:** O sistema apresentou resiliência imediata. Assim que o limite de requisições foi atingido, o tráfego malicioso foi mitigado na Edge Location do CloudFront, retornando o código de status 403 Forbidden. O bloqueio foi verificado em tempo real tanto via terminal (CLI) quanto via interface de usuário (UI), confirmando o isolamento completo do IP atacante sem afetar a disponibilidade global do sistema.

---

## �📑 Índice

1. [Visão Geral da Arquitetura](#visão-geral)
2. [Fundação da Infraestrutura: VPC e Topologia](#vpc-topologia)
3. [Segurança e Acesso: IAM, Roles e Policies](#segurança-iam)
4. [Controle de Tráfego: Security Groups](#security-groups)
5. [Banco de Dados: RDS PostgreSQL](#banco-dados)
6. [Storage: Buckets S3 Privados](#storage-s3)
7. [Computação: EC2 Backend](#ec2-backend)
8. [Orquestração de Tráfego: Application Load Balancer](#alb)
9. [Deployment e Hello World](#deployment)
10. [Frontend e Distribuição Global: CloudFront](#frontend-cloudfront)
11. [Análise de Custos](#custos)
12. [Lições Aprendidas](#lições)
13. [Stack Tecnológico](#stack)
14. [Considerações Finais](#finais)

---

## 🏗️ Visão Geral da Arquitetura {#visão-geral}

Antes de mais nada, deixa eu mostrar o quadro geral desse projeto:

![Arquitetura Enterprise Nebula Archive](public/arquitetura/Nebula-Archive.jpeg)

**A filosofia por trás dessa infraestrutura:**

Este é meu **primeiro projeto Cloud-Native full-stack**, onde apliquei conhecimentos integrados de:
- ✅ **Programação Frontend** (React + Vite)
- ✅ **Programação Backend** (NestJS + TypeScript)
- ✅ **Banco de Dados** (PostgreSQL + Prisma ORM)
- ✅ **Arquitetura Cloud** (AWS Enterprise-grade)

A jornada foi desafiadora, mas o resultado é robusto, escalável e implementa as melhores práticas do **AWS Well-Architected Framework**.

---

## 🔑 O Algoritmo Central: Presigned URLs

Antes de mergulharmos na infraestrutura, é crucial entender o que torna esse sistema especial.

O **Nebula Archive** é uma plataforma de **armazenamento e gerenciamento de arquivos estáticos** onde você **não provisiona nem um único bucket manualmente**. A mágica acontece através de um algoritmo de autenticação chamado **Presigned URL**.

**Como funciona:**

1. **Usuário registra e faz login** no sistema
2. **Quando faz upload de arquivo**, o backend gera uma conexão **Presigned URL para o S3**
3. **Essa URL é temporária** — expira em **5 minutos**
4. **Mesmo que a URL vaze**, ela inevitavelmente expirará
5. **Se alguém interceptar e modificar qualquer caractere**, o S3 detecta e bloqueia
6. **Força bruta é completamente inviável** — a assinatura criptográfica invalida qualquer modificação

É como dar um passe de acesso temporário a um VIP que se auto-destrói. Elegante e seguro. 🔐

---

## 🌐 Fundação da Infraestrutura: VPC e Topologia {#vpc-topologia}

Tudo começa aqui. A VPC é a fundação sobre a qual construímos tudo mais.

### Iniciando no Console AWS

Eu estava ali, na tela inicial do console da AWS, dando início à criação da infraestrutura **nível enterprise** com proteção incrível para hospedar o Nebula Archive.

![AWS Console - Início](public/imagens_da_documentacao_aws/1.jpeg)

### Criando a VPC Base

Direto para o serviço VPC — o local onde crio a fundação de toda a infraestrutura.

![VPC Service Overview](public/imagens_da_documentacao_aws/2.jpeg)

Já configurando a VPC com o nome: **nebula-archive**.

![VPC Name Configuration](public/imagens_da_documentacao_aws/3.jpeg)

**Cálculo CIDR — O pensamento por trás:**

- **Bloco CIDR:** `10.0.0.0/16` = aproximadamente **65.536 IPs** para distribuir nas subredes
- **CIDR de Subrede:** `/24` = **256 IPs** por subrede
- **5 IPs reservados pela AWS** por subrede (Gateway, DHCP, etc)
- **IPs utilizáveis:** ~251 por subrede

Isso significa que temos espaço mais que suficiente para expansão futura.

### Topologia Multi-AZ com Alta Disponibilidade

Criando os elementos principais da VPC:

![VPC Multi-AZ Configuration](public/imagens_da_documentacao_aws/4.jpeg)

**O que está acontecendo aqui — A Fundação para Resiliência:**

| Componente | Configuração | Propósito |
|-----------|--------------|----------|
| **Zonas de Disponibilidade** | 2x AZs (`us-east-1a`, `us-east-1b`) | Alta disponibilidade — se uma AZ cai, a outra continua |
| **Subredes Públicas** | 2x subnets `/24` | Onde residem as ALBs para aceitar tráfego da internet |
| **Subredes Privadas** | 2x subnets `/24` | Onde residem EC2s e RDS — isoladas completamente da internet |
| **NAT Gateway** | 1x Zonal | Permite tráfego de saída para patch updates (RDS/EC2 podem atingir internet) |
| **CIDR Planning** | `10.0.0.0/16` | ~65k IPs distribuídos em subnets `/24` (256 IPs cada, 5 reservados AWS) |

**A filosofia por trás:** Em produção, você não pode falhar. Se uma AZ inteira cai, a outra continua operando e **todo o sistema permanece intacto**. A redundância não é luxo — é obrigação.

✅ **Alta Disponibilidade Garantida**
✅ **Isolamento de Rede Completo**
✅ **Escalabilidade para Multi-AZ**
✅ **Routing Table Automático**

### Otimizando Custos: Gateway Endpoint S3

Aqui está onde economizamos dinheiro e ganhamos velocidade:

![S3 Gateway Endpoint Configuration](public/imagens_da_documentacao_aws/5.jpeg)

Um **Gateway Endpoint do S3** permite que os elementos das subredes privadas se comuniquem com o S3 de forma **mais barata**. Você economiza no NAT Gateway (que cobra por GB transferido) e ganha latência mais baixa. É win-win.

### VPC Criada com Sucesso

![VPC Creation Success](public/imagens_da_documentacao_aws/6.jpeg)

Fundação pronta. Vamos para a segurança.

---

## 🔐 Segurança e Acesso: IAM, Roles e Policies {#segurança-iam}

Aqui é onde implementamos o **princípio de menor privilégio** — um dos pilares fundamentais de uma arquitetura segura.

### Criando a Policy S3 Personalizada

Fui direto para o **IAM**, local onde criei uma política que será usada posteriormente.

![IAM Dashboard](public/imagens_da_documentacao_aws/8.jpeg)

Adicionei uma **política personalizada** (gerada com IA, admito) de acordo com o que precisava. Essa política permite **atividades específicas no bucket S3**.

![Custom S3 Policy Creation](public/imagens_da_documentacao_aws/9.jpeg)

**Contexto importante:** Inicialmente, no resource da policy coloquei `Nebula-Archive-Midia` (nome que usei durante design inicial).

![Corrected Policy Configuration](public/imagens_da_documentacao_aws/10.jpeg)

Mas deixa eu esclarecer uma coisa importante: **Não renomeei esse bucket**. Na verdade, **criei 3 buckets diferentes**:
1. **nebula-archive-media-gabriel** — primeiro bucket (foi para teste, depois substituído)
2. **nebula-archive-storage** — bucket oficial para armazenamento de arquivos estáticos (este é o real)
3. **nebula-archive-frontend-prod** — bucket para o frontend (criarei depois)

O conforme desenvolvimento avançava, descobri que o bucket **correto para armazenar os arquivos enviados pelos usuários é o `nebula-archive-storage`** — este é o que eu referencio na política.

Dando nome à política: **NebulaArchiveS3Policy** com descrição adequada.

![Policy Named](public/imagens_da_documentacao_aws/11.jpeg)

Política criada com sucesso.

![Policy Success](public/imagens_da_documentacao_aws/12.jpeg)

### Criando o EC2 Instance Profile

Um **Instance Profile** é essencialmente um container que permite à EC2 assumir um IAM role.

![EC2 Instance Profile Creation](public/imagens_da_documentacao_aws/13.jpeg)

Coloquei a política gerenciada pela AWS: **AmazonSSMManageManagedInstanceCore** — isso permite acesso ao Systems Manager (mais seguro que SSH).

Dando nome ao perfil: **NebulaArchiveEC2Role**

![EC2 Role Naming](public/imagens_da_documentacao_aws/14.jpeg)

Isso permitirá a **EC2 acessar o S3** para armazenar arquivos, e também conectar ao **RDS** via **Prisma ORM** (que converte TypeScript para SQL).

![Instance Profile Success](public/imagens_da_documentacao_aws/15.jpeg)

---

## 🛡️ Controle de Tráfego: Security Groups {#security-groups}

Security Groups são como firewalls virtuais — cada instância tem regras específicas sobre o que entra e o que sai.

### Iniciando a Criação de SGs

Na tela inicial dos grupos de segurança.

![Security Groups Console](public/imagens_da_documentacao_aws/16.jpeg)

### ALB Security Group

Criando o primeiro SG — o do **ALB** (Application Load Balancer).

Nome: **NebulaArchive-ALB-SG**
Descrição: "Security group for ALB - accepts HTTP/HTTPS from internet"
VPC: `nebula-archive`

![ALB SG Creation](public/imagens_da_documentacao_aws/17.jpeg)

**Regras de entrada do ALB:**

- 🌐 **HTTP** — Porta **80** de origem **0.0.0.0/0** (de qualquer lugar)
- 🔒 **HTTPS** — Porta **443** de origem **0.0.0.0/0** (de qualquer lugar)

Isso permite que o ALB aceite requisições do mundo inteiro e distribua o tráfego para as instâncias adequadas.

![ALB Ingress Rules](public/imagens_da_documentacao_aws/18.jpeg)

ALB Security Group criado com sucesso.

![ALB SG Success](public/imagens_da_documentacao_aws/19.jpeg)

### EC2 Security Group

Criando o security group da **EC2** (onde roda o backend).

Nome: **NebulaArchive-EC2-SG**
VPC: `nebula-archive`

![EC2 SG Creation](public/imagens_da_documentacao_aws/20.jpeg)

**Regras de entrada da EC2:**

- Tipo: **TCP PERSONALIZADO**
- Porta: **3000** (porta onde o backend está ouvindo)
- Origem: **Security Group da ALB** (apenas o ALB pode falar com a EC2)

⚠️ **Atenção crítica:** A porta 3000 é a mesma em todos os lugares — Docker, backend, SG, ALB, Target Group. **TODAS AS PORTAS PRECISAM ESTAR EM SINCRONIA.** Um erro aqui significa nenhuma comunicação.

![EC2 Ingress Rules](public/imagens_da_documentacao_aws/21.jpeg)

EC2 Security Group criado com sucesso.

![EC2 SG Success](public/imagens_da_documentacao_aws/22.jpeg)

### RDS Security Group

Criando o Security Group do **RDS** (banco de dados PostgreSQL).

Nome: **NebulaArchive-RDS-SG**
VPC: `nebula-archive`

![RDS SG Creation](public/imagens_da_documentacao_aws/23.jpeg)

**Regras de entrada do RDS:**

- Tipo: **PostgreSQL**
- Porta: **5432** (porta padrão do PostgreSQL — ela ouve aqui mesmo que seu Docker seja `9000:5432`)
- Origem: **Security Group da EC2** (apenas a EC2 pode falar com o RDS)

A razão pela qual usamos SGs como origem é o **princípio de menor privilégio** — ninguém mais pode acessar o RDS.

![RDS SG Configuration](public/imagens_da_documentacao_aws/24.jpeg)

RDS Security Group criado com sucesso.

![RDS SG Success](public/imagens_da_documentacao_aws/24.jpeg)

---

## 🗄️ Banco de Dados: RDS PostgreSQL {#banco-dados}

Agora vamos criar o banco de dados que alimentará toda a aplicação.

### Iniciando a Criação do RDS

Na tela inicial do serviço RDS.

![RDS Dashboard](public/imagens_da_documentacao_aws/25.jpeg)

### Escolhendo o Motor PostgreSQL

Escolhi **PostgreSQL** porque:
- ✅ Open source e confiável
- ✅ Excelente para Prisma ORM
- ✅ Suporta JSON nativamente
- ✅ Migrations automáticas com Prisma
- (RDS suporta outros motores também: MySQL, MariaDB, Oracle, SQL Server)

![PostgreSQL Engine Selection](public/imagens_da_documentacao_aws/26.jpeg)

### Configuração Free Tier (Princípio de Gerenciamento de Custo)

Estamos fazendo um laboratório, então apliquei o **princípio de gerenciamento de custo** — máximo aprendizado, mínimo gasto.

Configuração escolhida:
- **Tipo:** `db.t4g.micro` (elegível para free tier)
- **CPU:** 2 vCPUs
- **RAM:** 1 GB
- **Armazenamento:** 20 GB (depois aumentei para 50 GB)
- **Preço:** Ridiculamente barato

![Free Tier Configuration](public/imagens_da_documentacao_aws/27.jpeg)

**Aqui enfrentei meu primeiro erro:** Cometi um equívoco de configuração, tive que voltar e escolher novamente.

> **"Eu nunca perço."** — Harvey Specter

E de fato, voltei, reconfigurei PostgreSQL corretamente e fiz o banco funcionar perfeitamente.

![Reconfiguring PostgreSQL - Banco Correto](public/imagens_da_documentacao_aws/28-banco-correto.jpeg)

### Escolhendo Single-AZ (Com Ressalva)

Escolhi implantação de **SINGLE-AZ** (apenas uma zona de disponibilidade).

![Single-AZ Selection](public/imagens_da_documentacao_aws/29.jpeg)

**Aqui está a ressalva:** Como arquiteto, desenhei a infraestrutura para ser **facilmente escalável para MULTI-AZ**. A recomendação é: **em produção, coloque Multi-AZ logo de cara**. Multi-AZ adiciona redundância automática — se a AZ principal cai, o RDS faz failover automático.

Mas como estamos em um laboratório economizando créditos, Single-AZ é aceitável.

### Configurações de Credenciais e Armazenamento

Dando nome ao banco: **RDSDatabaseNebula**

Nome de usuário: (educacional, este banco já não existe mais — destruí tudo após testes)
Senha: Autogerenciada pela AWS com uma senha robusta
(Obvi, não vou compartilhar detalhes da senha)

![DB Name and Credentials](public/imagens_da_documentacao_aws/30.jpeg)

Tipo de instância e armazenamento:
- Configuração inicial: 20GB
- **Aumentei para 50GB** para ter espaço para crescimento durante testes

![Instance Type and Storage](public/imagens_da_documentacao_aws/31.jpeg)

### Conectividade: VPC e Security Group

Parte de conectividade — RDS vai residir na VPC que criamos anteriormente.

![VPC Connectivity](public/imagens_da_documentacao_aws/32.jpeg)

Escolhendo o **Security Group do RDS** que criamos.

![RDS SG Assignment](public/imagens_da_documentacao_aws/33.jpeg)

### RDS Criado com Sucesso

Banco de dados finalizado e pronto para receber conexões do backend.

![RDS Creation Success](public/imagens_da_documentacao_aws/42.jpeg)

---

## 💾 Storage: Buckets S3 Privados com Criptografia {#storage-s3}

S3 é onde os arquivos realmente residem. Segurança em repouso é crucial aqui.

**Esclarecimento importante:** Criei **3 buckets S3** nesse projeto:
1. **nebula-archive-media-gabriel** — primeira tentativa (teste)
2. **nebula-archive-storage** — bucket oficial para armazenar arquivos dos usuários ⭐
3. **nebula-archive-frontend-prod** — bucket para frontend (vem depois)

### Criando o Bucket de Armazenamento (Storage)

Comecei a criar os buckets. O primeiro foi nomeado: **nebula-archive-media-gabriel** durante a fase de design.

![First Bucket Creation](public/imagens_da_documentacao_aws/34.jpeg)

**Por que três buckets?** Cada um tem uma responsabilidade:
- **Media bucket** → descobri durante testes que não era a abordagem certa
- **Storage bucket** → nome definido para guardar os arquivos das Presigned URLs ✅
- **Frontend bucket** → separado para distribuição via CloudFront

### Bloqueio de Acesso Público (CRUCIAL)

Aqui está a parte **mais importante** — bloqueio de acesso público.

![Block Public Access](public/imagens_da_documentacao_aws/35.jpeg)

**Por que isso é tão importante?** Porque este é um bucket **PRIVADO**. Ninguém na internet pode acessar diretamente. O único acesso é via **Presigned URLs** assinadas pela aplicação.

### Criptografia SSE-S3

Adicionando **criptografia padrão S3 (SSE-S3)**:

![SSE-S3 Encryption](public/imagens_da_documentacao_aws/36.jpeg)

SSE-S3 é primordial. Basicamente, você passa a responsabilidade de **encriptar automaticamente** para a AWS. Todos os dados em repouso são cifrados.

### Bucket Criado com Sucesso

![Bucket Creation Success](public/imagens_da_documentacao_aws/37.jpeg)

---

## 🖥️ Computação: EC2 Backend {#ec2-backend}

Aqui roda a inteligência — o backend com toda a lógica de negócio.

### Criando a Instância EC2

Finalmente, partindo para a instância **EC2**, onde roda o **backend NestJS** com toda a lógica de negócio e o **Prisma ORM**.

Nome: **NebulaArchive-Backend**

Imagem: **Amazon Linux 2** (mais rápida, mais eficiente, padrão de mercado)

Quantidade: Apenas 1 instância (em produção, isso seria em um **Auto Scaling Group**)

![EC2 Dashboard](public/imagens_da_documentacao_aws/38.jpeg)

### Configuração de Rede e Segurança

Atribuindo a EC2 à VPC `nebula-archive`.

**Decisões críticas:**
- ✅ **Desabilitei a criação de IP Público** — Esta instância está em uma **subrede privada**, então não tem necessidade de IP público. Ela só será acessível pelo ALB.
- ✅ **Atribuindo o Security Group** `NebulaArchive-EC2-SG` que criamos anteriormente
- ✅ **IMPORTANTE:** Não criei par de Access Keys — acessamos via **AWS Systems Manager** (SSM), que é muito mais profissional e seguro que SSH.

![EC2 VPC Configuration](public/imagens_da_documentacao_aws/39.jpeg)

### IAM Instance Profile

Atribuindo o perfil **NebulaArchiveEC2Role** que criamos anteriormente — permite que a EC2 acesse o bucket S3 para upload de arquivos estáticos.

![EC2 Role Assignment](public/imagens_da_documentacao_aws/40.jpeg)

### EC2 Rodando

EC2 pronta e operacional.

![EC2 Running](public/imagens_da_documentacao_aws/41.jpeg)

### Acessando via Systems Manager

Já dentro do terminal da EC2 via SSM, rodei comandos para verificar versões:

```bash
docker --version
docker-compose --version
```

Verificando se Docker e Docker Compose estavam instalados (Amazon Linux 2 vem com essas ferramentas pré-instaladas).

![SSM Terminal Access](public/imagens_da_documentacao_aws/43.jpeg)

---

## 🎯 Orquestração de Tráfego: Application Load Balancer {#alb}

O ALB é o "maestro da orquestra" — recebe todo o tráfego da internet e distribui para as instâncias appropriadas.

### Criando o Target Group

Primeiro, criamos o **grupo de destino** (Target Group) — basicamente, "onde a ALB vai enviar o tráfego".

![Target Group Creation](public/imagens_da_documentacao_aws/44.jpeg)

**Configuração:**
- Nome: **TG-Nebula-Archive**
- Porta: **3000** (deve estar em sincronia com o backend)
- Protocolo: **HTTP**
- Tipo de endereço: **IPv4**
- VPC: `nebula-archive`

![Target Group Configuration](public/imagens_da_documentacao_aws/45.jpeg)

### Atribuindo Targets (EC2)

Agora, atribuindo o Target Group à EC2.

Aqui novamente, porta **3000** — isso não é coincidência.

⚠️ **ATENÇÃO CRÍTICA:** TODAS AS PORTAS DESTINADAS À EC2 PRECISAM ESTAR EM SINCRONIA:
- Docker: `3000:3000`
- Backend NestJS: `3000`
- Security Group: `3000`
- Target Group: `3000`
- ALB Listener: `3000`

**Uma porta errada = zero comunicação.**

![EC2 Target Assignment](public/imagens_da_documentacao_aws/46.jpeg)

Target Group criado com sucesso.

![TG Success](public/imagens_da_documentacao_aws/47.jpeg)

### Criando o ALB

Aqui vem a parte onde você precisa saber: **ALB é caro**. Normalmente.

⚠️ **Atenção sobre custos:** 
- **ALB** = Geralmente $16-20/mês
- **NAT Gateway** = Geralmente $32-40/mês (+ $0.045 por GB)

Esses são os dois itens mais caros da infraestrutura. Mas como estamos no **AWS Free Tier com $200 de crédito**, eles se tornam muito baratos.

Opções de ELB — escolhi **ALB** (Application Load Balancer para HTTP/HTTPS).

![ELB Options](public/imagens_da_documentacao_aws/48.jpeg)

### Configuração do ALB

Nome: **ALB-Nebula-Archive**
Esquema: **Internet-facing** (porque o sistema será acessível via internet)

![ALB Configuration](public/imagens_da_documentacao_aws/49.jpeg)

### Atribuindo Subnets

Atribuindo o ALB às subnets públicas para receber tráfego da internet:

**Primeira subnet:**
- Nome: `nebula-archive-subnet-public1`
- AZ: `us-east-1a`

⚠️ **Toda a infraestrutura reside nessa região:** `us-east-1`

![ALB Subnet 1](public/imagens_da_documentacao_aws/50.jpeg)

**Segunda subnet:**
- Nome: `nebula-archive-subnet-public2`
- AZ: `us-east-1b`

Isso garante que o ALB está em ambas as AZs para verdadeira alta disponibilidade.

![ALB Subnet 2](public/imagens_da_documentacao_aws/51.jpeg)

### Atribuindo Security Group

Security Group do ALB: `NebulaArchive-ALB-SG`

![ALB SG Assignment](public/imagens_da_documentacao_aws/52.jpeg)

Configurando o listener:
- Protocolo: **HTTP**
- Porta: **80**
- Destino: **Target Group** `TG-Nebula-Archive`

A ALB vai receber tráfego na porta 80 e encaminhar para o Target Group que direciona para a EC2 na porta 3000.

**Fluxo de tráfego:**
1. Cliente acessa `http://alb-dns:80`
2. ALB recebe na porta 80
3. ALB encaminha para Target Group
4. Target Group envia para EC2:3000
5. Backend NestJS responde

![ALB Listener Configuration](public/imagens_da_documentacao_aws/52.jpeg)

### ALB Criado com Sucesso

ALB `ALB-Nebula-Archive` pronto.

![ALB Success](public/imagens_da_documentacao_aws/53.jpeg)

---

## 🚀 Deployment e Hello World {#deployment}

Aqui é onde tudo passa a funcionar. Respira fundo.

### Git Clone

No repositório do Nebula Archive, pegando o link HTTPS do repositório.

![Repository Link](public/imagens_da_documentacao_aws/54.jpeg)

Fazendo git clone do projeto direto na EC2 via SSM:

```bash
git clone https://github.com/GabrielF0900/Nebula-Archive.git
cd Nebula-Archive/Backend
```

![Git Clone](public/imagens_da_documentacao_aws/55.jpeg)

### Configurando Variáveis de Ambiente

Criando o arquivo `.env` com as configurações necessárias:

```env
DATABASE_URL=postgresql://user:password@rds-endpoint:5432/database_name
S3_BUCKET_NAME=nebula-archive-storage
S3_REGION=us-east-1
PORT=3000
```

![Environment Configuration](public/imagens_da_documentacao_aws/56.jpeg)

**Pequeno plot twist:** Tive que mudar o nome do bucket de `nebula-archive-media-gabriel` para `nebula-archive-storage` — este é o nome oficial. Atualizei as variáveis de ambiente conforme necessário.

**Aqui está uma lição importante:** Todas essas informações de `.env` foram posteriormente destruídas (porque este era um laboratório educacional e depois destruí toda a infraestrutura).

### Criando e Rodando o Docker

Criando a imagem Docker no SSM:

```bash
cd Backend
docker build -t nebula-archive-backend:latest .
docker run -d -p 3000:3000 \
  -e DATABASE_URL=$DATABASE_URL \
  -e S3_BUCKET_NAME=$S3_BUCKET_NAME \
  nebula-archive-backend:latest
```

![Docker Build](public/imagens_da_documentacao_aws/57.jpeg)

Servidor rodando... e aqui vem o drama. 😅

Como nem tudo são flores, enfrentei **uma série de dificuldades** durante esse processo. Deixa eu documentar isso aqui porque mostra que **a vida de um futuro arquiteto cloud sênior não é fácil**:

❌ **Problemas enfrentados:**
- Conexão com RDS falhando (variáveis de ambiente incorretas)
- Container não iniciando (permissões do IAM role)
- Backend respondendo 503 Service Unavailable
- Sincronização entre portas quebrada (descobri que o Docker estava em 3001, não 3000)

✅ **Como resolvi:**
- Leitura da documentação do Prisma Connection Pooling
- Debug via CloudWatch logs
- Recreação múltipla do container
- Aplicação do princípio "test, research, apply"

![Backend Running](public/imagens_da_documentacao_aws/58.jpeg)

### O Momento de Glória: Hello World

E finalmente...

![Hello World](public/imagens_da_documentacao_aws/59.jpeg)

**BINGO!** 🎉

Endpoint respondendo corretamente. O backend está vivo.

Deixa eu ser honesto: vendo aquele "Hello World" renderizar foi um dos melhores momentos dessa jornada. Não é exagero.

---

## 🌍 Frontend e Distribuição Global: CloudFront {#frontend-cloudfront}

Agora vem a parte onde distribuímos o frontend globalmente para latência mínima.

### Criando o Bucket do Frontend

Criando um bucket dedicado para os **arquivos estáticos do frontend**.

Nome: **nebula-archive-frontend-prod**

Este bucket conterá o build otimizado do React + Vite que será distribuído globalmente via CloudFront.

![Frontend Bucket Creation](public/imagens_da_documentacao_aws/60.jpeg)

### Bloqueio de Acesso Público (CRÍTICO NOVAMENTE)

Novamente, a parte **CRÍTICA** — bloqueio de acesso público.

![Block Frontend Public Access](public/imagens_da_documentacao_aws/61.jpeg)

**Por quê?** Porque todo acesso vai ser via CloudFront, não direto ao S3. O bucket é privado.

### Bucket Criado

Bucket do frontend pronto.

![Frontend Bucket Success](public/imagens_da_documentacao_aws/62.jpeg)

### Upload dos Arquivos Estáticos

Iniciando o upload de todos os arquivos estáticos da pasta **DIST**.

![Upload Start](public/imagens_da_documentacao_aws/63.jpeg)

**Preparação prévia no VS Code:**
- Arrumei variáveis de ambiente
- Executei `pnpm run build` para gerar a pasta `dist/`

⚠️ **Nota importante:** Usei **PNPM** em vez de NPM porque:
- Mais leve (economiza espaço em disco)
- Mais versátil (monorepo support melhor)
- **Primeira vez usando PNPM** — mostrando minha capacidade de adaptação

O build gerou:
- `index.html`
- `assets/` (JavaScript, CSS, imagens)
- Configurações de cache apropriadas

![PNPM Build Output](public/imagens_da_documentacao_aws/64.jpeg)

**ATENÇÃO:** O arquivo `index.html` é crucial. Vamos usar isso em breve.

### Criando a Distribuição CloudFront

Agora vem o "acelerar globalmente".

Nome: **frontend-distribuition**
Descrição: "Global distribution for Nebula Archive frontend"

![Distribution Creation](public/imagens_da_documentacao_aws/65.jpeg)

### Configurando a Origem

Selecionando a origem — onde ficam os arquivos que quero distribuir?

Origem: **S3 do Frontend** (`nebula-archive-frontend-prod`)

![Origin Selection](public/imagens_da_documentacao_aws/66.jpeg)

### Ativando Proteção: WAF (Web Application Firewall)

Algo **IMPORTANTÍSSIMO** para proteger a infraestrutura — ativando o serviço **WAF** para proteção contra injeção de SQL e outros ataques comuns.

![WAF Activation](public/imagens_da_documentacao_aws/67.jpeg)

**Aqui está onde enfrentei um problema GRANDE:**

Inicialmente, coloquei a proteção em **nível ALTO**. Aí descobri que o WAF estava **bloqueando requisições legítimas do frontend** — cada requisição fazia cache miss e o WAF rejeitava.

🔍 **Debugging:**
- Desativei temporariamente o WAF (para confirm que era o culpado)
- Recebi requisições normalmente
- Reativei o WAF com nível de proteção **MÉDIO** (menos restritivo)
- Tudo começou a funcionar

**Lição aprendida:** WAF em nível alto requer tuning fino de whitelist rules.

### Ativando Shield (Proteção DDoS)

Colocando o nível de proteção contra ataques **DDoS** — o famoso **AWS Shield**.

![DDoS Shield](public/imagens_da_documentacao_aws/68.jpeg)

Shield oferece proteção contra ataques de negação de serviço distribuídos.

### Distribuição Criada

![Distribution Created](public/imagens_da_documentacao_aws/69.jpeg)

### Configurando Default Root Object

⚠️ **AQUI ESTÁ O PONTO CRÍTICO:**

Lembra quando eu disse: "GUARDE A INFORMAÇÃO SOBRE O INDEX.HTML"?

CloudFront precisa saber qual arquivo servir quando alguém acessa a raiz (`/`). Temos que especificar **index.html**.

![Default Root Object Configuration](public/imagens_da_documentacao_aws/70.jpeg)

Sem isso, CloudFront retorna **403 Forbidden** quando você tenta acessar `https://distribuition-dns/`.

### Aplicando Bucket Policy da Distribuição

Dentro da distribuição, copiando a **OAC Policy** (Origin Access Control):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::nebula-archive-frontend-prod/*"
    }
  ]
}
```

![Copy OAC Policy](public/imagens_da_documentacao_aws/71.jpeg)

Este código garante que **apenas CloudFront** pode acessar o bucket S3. Ninguém mais.

Copiando para o bucket policy do S3:

![Apply to Bucket Policy](public/imagens_da_documentacao_aws/72.jpeg)

### Configurando Páginas de Erro

Criando tratamento para erros HTTP:

- **403 Forbidden** → reencaminhar para `index.html` (para SPA routing)
- **404 Not Found** → reencaminhar para `index.html`
- **TTL:** 200 segundos

![Error Pages Configuration](public/imagens_da_documentacao_aws/73.jpeg)

Páginas de erro configuradas.

![Error Pages Done](public/imagens_da_documentacao_aws/74.jpeg)

### Cache Invalidation (A Parte Engenhosa)

Aqui vem uma configuração muito elegante. Executando cache invalidation:

```
/*
```

Esse comando basicamente diz: "Invalide tudo do CloudFront e distribua os arquivos que eu acabei de fazer upload."

![Cache Invalidation](public/imagens_da_documentacao_aws/75.jpeg)

**Aqui vem a real:** Durante o processo de debug e tentativa de fazer a infraestrutura funcionar, rodei esse comando **várias vezes**. Cada vez que mudava algo estratégico (WAF levels, Bucket Policy, index.html config), fazia cache invalidation.

Isso provou minha **capacidade de pesquisa e aplicação** — pesquisava documentação, aplicava mudanças, testava, repetia.

Deu dor de cabeça? Sim. Mas o trabalho ficou pronto.

Novamente, confirmando o **index.html** como default root object:

![Index HTML Reconfirmed](public/imagens_da_documentacao_aws/76.jpeg)

---

## 🔄 Push e Deployment Final

### Git Push do Backend

Rodando push do código para o repositório:

```bash
git add .
git commit -m "Configure env vars and docker setup"
git push origin main
```

![Backend Push](public/imagens_da_documentacao_aws/77.jpeg)

**Aqui também enfrentei dificuldades:** Tive que recriar o container **várias vezes** durante a tentativa de fazer a infraestrutura funcionar. Cada recreação exigia novo build, nova tag, novo push.

Mas com **muita pesquisa e paciência**, consegui.

### Finalizando: Metadados de Arquivos Estáticos

Fazendo edições finais no conteúdo do site estático:

Novamente, confirmando **index.html** como arquivo default — muito importante.

Marcando também a opção de **hospedar site estático** nas configurações do bucket.

![Static Website Configuration](public/imagens_da_documentacao_aws/78.jpeg)

### Metadados MIME Type

Fazendo modificação importante nos **metadados dos arquivos estáticos**:

- **Chave:** `Content-Type`
- **Valor:** `text/plain` (ou apropriado para cada tipo)

![MIME Type Configuration](public/imagens_da_documentacao_aws/79.jpeg)

### Resultado Final: Tudo Funcionando

E **BINGO** — resultado final:

![Final Result Working](public/imagens_da_documentacao_aws/80.jpeg)

Tudo funcionando como esperado. 🎉

---

## 📊 Análise de Custos {#custos}

Vamos ser realistas sobre o investimento financeiro nessa infraestrutura:

| Serviço | Free Tier | Preço (Sem Free Tier) | Notas |
|---------|-----------|----------------------|-------|
| **EC2** (t3.micro) | 750h/mês | ~$8-10/mês | Single instance, Free Tier cobre |
| **RDS** (db.t4g.micro) | 750h/mês | ~$15-18/mês | Free Tier cobre, 50GB storage |
| **S3** (Storage) | 5 GB/mês | $0.023/GB | ~$1.15/mês para 50GB |
| **S3** (Requests) | 20k GET/mês | $0.0004/request | GET requests cômodas |
| **ALB** | - | $16-20/mês | Listener + LCU |
| **NAT Gateway** | - | $32-45/mês | Hourly charge + data transfer |
| **CloudFront** | - | $0.085/GB | Data transfer out (varia) |
| **VPC** | - | $0/mês | Grátis |
| **IAM** | - | $0/mês | Grátis |
| **Security Groups** | - | $0/mês | Grátis |
| **Systems Manager** | 100 onprem | $0/mês | Free for EC2 |
| **CloudWatch** | 5GB logs | ~$0.50/GB | Monitoring |

**Estimativa de Custo Mensal (Sem Free Tier):**
- **Mínimo (Otimizado):** ~$90-110/mês
- **Máximo (Uso alto):** ~$150-200/mês

**Com Free Tier ($200 crédito):**
- **Meses de lab gratuito:** ~2-3 meses cobrindo a maioria

**Em produção, com Auto Scaling + Multi-AZ + dados altos:**
- Escalaria para $300-500+/mês dependendo de tráfego

---

## 💡 Lições Aprendidas {#lições}

### ✅ O Que Funcionou Perfeitamente

✅ **Arquitetura Multi-AZ desde o início**
- Mesmo usando Single-AZ no RDS para economizar, o design suporta fácil upgrade
- ALB em 2 AZs garante HA no frontend

✅ **Princípio de Menor Privilégio (IAM)**
- Cada componente tem apenas as permissões necessárias
- Nenhum Access Key exposto
- SSM ao invés de SSH — mais seguro

✅ **Presigned URLs**
- Solução elegante para upload seguro
- 5 minutos de expiração previne vazamento
- Impossível forçar bruta criptograficamente

✅ **VPC + NAT Gateway + S3 Gateway Endpoint**
- Isolamento de rede completo
- EC2 em subrede privada (não acessível da internet)
- RDS em subrede privada
- Otimização de custos com Gateway Endpoint

✅ **CloudFront + WAF + Shield**
- Distribuição global
- Proteção contra injeção SQL
- Proteção contra DDoS
- Latência reduzida para usuários globais

✅ **Full-Stack Integration**
- Frontend → CloudFront → ALB → Backend → RDS
- Fluxo de dados bem definido
- Sem "surpresas" na arquitetura

### ⚠️ Desafios Encontrados

⚠️ **Sincronização de Portas (Docker + Backend + SG + ALB + TG)**

Um erro em qualquer um desses lugares quebra a comunicação:
- Docker: `3000:3000`
- Backend: `3000`
- EC2 SG: `3000`
- Target Group: `3000`
- ALB Listener: `3000`

**Solução:** Checklist de portas em cada passo.

⚠️ **WAF em Nível Alto Bloqueando Requisições Legítimas**

Descobri que o WAF estava rejeitando requisições do frontend legítimas.

**Solução:** Reduzir para nível médio, depois fazer whitelist rules mais específicas.

⚠️ **Index.html não Configurado no CloudFront**

CloudFront não sabia qual arquivo servir em `/`.

**Solução:** Especificar `index.html` como Default Root Object.

⚠️ **Cache Não Atualizando Após Deploy**

Depois de fazer push do novo código, CloudFront ainda servia versão antiga.

**Solução:** Cache Invalidation com `/*`.

⚠️ **RDS Connection Pooling com Prisma**

Prisma não estava fazendo connection pooling corretamente no início.

**Solução:** Configurar `@db.maxConnections` e usar Prisma's connection pooling.

⚠️ **Docker + EC2 via SSM — Recreação Frequente de Container**

Tive que recrear o container **várias vezes** durante testes:

```bash
docker ps -a
docker rm $(docker ps -aq)
docker rmi $(docker images -q)
docker build -t nebula:latest .
docker run -d -p 3000:3000 ...
```

**Solução:** Script de deploy automatizado.

### 🎓 Aprendizados Profundos

**1. Arquitetura é Iteração**
Não existe "primeira vez certa". Você desenha, testa, falha, aprende, redesenha.

**2. Debugging é um Superpoder**
CloudWatch logs, VPC Flow Logs, Security Group analysis — essas ferramentas salvaram meu projeto múltiplas vezes.

**3. Documentação é Ouro**
Cada erro que tive, alguém já teve antes e documentou. Pesquisa + aplicação = sucesso.

**4. Segurança Não é Opcional**
Implementar princípio de menor privilégio desde o início é mais fácil que refatorar depois.

**5. Otimização de Custos Começa Cedo**
Gateway Endpoint, Free Tier, Single-AZ (onde apropriado) — economizar 30% em custos sem sacrificar funcionalidade é um win.

---

## 🛠️ Stack Tecnológico {#stack}

| Camada | Tecnologia | Versão | Propósito |
|--------|-----------|--------|----------|
| **Infraestrutura** | AWS | v1 | Fundação cloud-native |
| **VPC** | AWS VPC | v2 | Isolamento de rede |
| **Compute** | EC2 | t3.micro/t4g.micro | Backend hosting |
| **Banco de Dados** | RDS PostgreSQL | 15.x | Persistência relacional |
| **Storage** | S3 | v2 | Armazenamento estático |
| **CDN** | CloudFront | v1 | Distribuição global |
| **Load Balancer** | ALB | v2 | Distribuição de tráfego |
| **Firewall** | WAF | v2 | Proteção de aplicação |
| **DDoS** | Shield | v1 | Proteção DDoS |
| **Acesso Remoto** | Systems Manager | v1 | Terminal seguro |
| **Backend** | NestJS | 10.x | Framework Node.js |
| **Linguagem** | TypeScript | 5.x | Type-safe backend |
| **ORM** | Prisma | 5.x | Database abstraction |
| **Frontend** | React | 18.x | UI library |
| **Build Tool** | Vite | 5.x | Frontend bundler |
| **Package Manager** | PNPM | 8.x | Dependency management |
| **Styling** | Tailwind CSS | 3.x | Utility-first CSS |
| **Containerization** | Docker | 24.x | Application isolation |
| **Infrastructure as Code** | (Manual) | v1 | AWS Console setup |

---

## 📝 Considerações Finais {#finais}

### 🎯 O que foi alcançado

**Construí uma infraestrutura enterprise-grade** que:
- ✅ Implementa as melhores práticas do **AWS Well-Architected Framework**
- ✅ Suporta **escalabilidade horizontal** (Auto Scaling ready)
- ✅ Possui **redundância em múltiplas AZs** (arquitetura designed)
- ✅ Garante **segurança em camadas** (VPC, SG, IAM, WAF, Shield)
- ✅ Oferece **ataque criptográfico impossível** (Presigned URLs)
- ✅ Distribui **globalmente com latência mínima** (CloudFront)
- ✅ Custa **aproximadamente $100-150/mês** (otimizado)

### 🚀 O Caminho daqui em frente

Possíveis melhorias:

**Curto Prazo:**
- [ ] Implementar Auto Scaling Groups (em vez de instância única)
- [ ] Configurar HTTPS/SSL com ACM (Amazon Certificate Manager)
- [ ] Adicionar monitoring com CloudWatch dashboards
- [ ] Implementar CI/CD pipeline com CodePipeline

**Médio Prazo:**
- [ ] Multi-AZ RDS com automated failover
- [ ] Backup strategy com S3 Glacier
- [ ] Database replication para read scaling
- [ ] Caching layer com ElastiCache (Redis)

**Longo Prazo:**
- [ ] Infrastructure as Code com Terraform/CDK
- [ ] Multi-region deployment
- [ ] Disaster recovery plan (RTO/RPO)
- [ ] Compliance e auditing (CloudTrail)

### 🎓 Reflexão Final

Este foi meu **primeiro projeto cloud-native full-stack**. Não foi fácil. Enfrentei desafios em cada etapa — desde sincronização de portas até debug de WAF rules.

Mas aqui está a verdade: **cada erro foi uma aula**. Cada falha foi um aprendizado. E cada sucesso (Hello World, BINGO, tudo funcionando) foi uma validação de que eu posso fazer isso em nível sênior.

**Citando Harvey Specter:**
> "Winners don't blame the ball, the trash can, or the wind in a room; they simply find a way to win."

Encontrei um jeito de ganhar. A Nebula Archive está viva. 🌌

Próxima etapa: **Layouts do sistema funcionando perfeitamente**. Vamos lá!

---

**Construído com ❤️, ☕ e muito 🧠 por um arquiteto cloud em ascensão.**

**Status:** ✅ Laboratório Completo | 📊 Pronto para Análise | 🚀 Ready for Scale

---

*Última atualização: 23 de abril de 2026*
*Repositório: https://github.com/GabrielF0900/Nebula-Archive*
