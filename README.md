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

![Arquitetura do Projeto](public/arquitetura/Nebula-Archive.jpeg)

> 💡 A imagem acima representa a topologia completa da infraestrutura, incluindo VPC, subnets públicas/privadas, ALB, EC2, RDS e distribuição global via CloudFront.

---

## 📚 Documentação Técnica - Passo a Passo Detalhado

### 🎯 Visão Geral: Iniciando a Infraestrutura Enterprise

**Imagem 1:** Eu estava na tela inicial do console da AWS, dando início à criação da infraestrutura nível enterprise com proteção incrível para hospedar o sistema **NEBULA ARCHIVE**, uma plataforma de armazenamento e gerenciamento de arquivos estáticos sem que você precise provisionar um só bucket.

Esse gerenciamento é permitido graças a um algoritmo de autenticação chamado **Presigned URL**, onde:
1. O usuário faz o registro e login
2. Quando faz o envio de qualquer arquivo, para cada arquivo uma conexão **Presigned URL para o bucket S3** será criada
3. Essa URL **não é permanente** - ela expira em 5 minutos
4. Mesmo que a URL vaze, ela inevitavelmente expirará
5. Mesmo que alguém intercepte a URL e modifique qualquer caractere, o S3 irá detectar e bloquear a tentativa
6. Força bruta (acesso forçado) é completamente inviável

---

## 🌐 1. Fundação da Infraestrutura: VPC e Topologia de Rede

### Criando a VPC Base

**Imagem 2:** Na tela inicial do serviço VPC, local onde criarei a fundação de toda infraestrutura.

**Imagem 3:** Já configurando a VPC onde dei o nome de: **nebula-archive**

**Configuração CIDR:**
- **Bloco CIDR:** `10.0.0.0/16` = aproximadamente **65.536 IPs** para serem distribuídos pelas subredes privadas e públicas
- **CIDR de Subrede:** `/24` = **256 IPs** por subrede
- **IPs Reservados:** **5 IPs** será reservado para AWS por subrede

![VPC Console](public/imagens_da_documentacao_aws/2.jpeg)

![CIDR Configuration](public/imagens_da_documentacao_aws/3.jpeg)

### Configurando Zonas de Disponibilidade e Subredes

**Imagem 4:** Criando os elementos da VPC:

- ✅ **VPC regional em 2 zonas de disponibilidade** para termos **alta disponibilidade** em casos de falhas em alguma AZ
- ✅ Se uma AZ falhar, a outra continua operando e **todo o sistema permanece intacto**
- ✅ **2 Subredes públicas** onde armazenará as **ALBs** que fará a distribuição de tráfego para as **EC2** que estarão em subredes privadas
- ✅ **2 Subredes privadas** para garantir alta disponibilidade
- ✅ **1 NAT GATEWAY ZONAL** - terei 1 NAT GATEWAY fazendo todo o trabalho de tráfego para a route table em caso do RDS ou EC2 na subrede privada quererem fazer atualizações de patch

![Multi-AZ Setup](public/imagens_da_documentacao_aws/4.jpeg)

### Otimizando Custos com Gateway Endpoint

**Imagem 5:** Escolhi um **GATEWAY Endpoint do S3** para que os elementos da subrede privada se comuniquem com o S3 de maneira **mais barata**, tendo opção de desabilitar o NAT GATEWAY ou não se eu quiser.

![S3 Gateway Endpoint](public/imagens_da_documentacao_aws/5.jpeg)

**Imagem 6:** VPC sendo criada com sucesso.

![VPC Success](public/imagens_da_documentacao_aws/6.jpeg)

---

## 🔐 2. Segurança e Acesso: IAM, Roles e Policies

### Criando a Policy S3

**Imagem 8:** Após criar a fundação, fui para o **IAM** onde criei uma política que será usada posteriormente.

**Imagem 9:** Adicionei uma **política personalizada gerada por IA** de acordo com o que eu queria de funcionalidade. Essa política vai permitir **atividades no bucket S3**. No resource eu coloquei o nome do meu bucket que foi **Nebula-Archive-Midia**.

**Imagem 10:** Porém, me recordo que esse bucket **Nebula-Archive-Midia foi mudado para o Nebula-Archive-Storage** que é o bucket onde realmente seria para armazenamento dos objetos estáticos. Veja a política aqui com o nome correto.

![Policy Creation Start](public/imagens_da_documentacao_aws/8.jpeg)

![AI Generated Policy](public/imagens_da_documentacao_aws/9.jpeg)

![Correct Bucket Name](public/imagens_da_documentacao_aws/10.jpeg)

**Imagem 11:** Dando nome para a política de: **NebulaArchiveS3Policy** e coloquei uma descrição adequada.

![Policy Named](public/imagens_da_documentacao_aws/11.jpeg)

**Imagem 12:** Mensagem da política sendo criada com sucesso.

![Policy Success](public/imagens_da_documentacao_aws/12.jpeg)

### Criando o EC2 Instance Profile

**Imagem 13:** Criando um **perfil (Instance Profile)** e coloquei a política gerenciada pela AWS de **AmazonSSMManageManagedInstanceCore**.

![EC2 Role Creation](public/imagens_da_documentacao_aws/13.jpeg)

**Imagem 14:** Dando nome para o perfil de **NebulaArchiveEC2Role**. Isso permitirá que a **EC2 acesse o S3** e guarde os arquivos já que no **EC2 será hospedado o backend** e o **ORM Prisma** que terá conexão com o **RDS** via conversão de linguagem de TypeScript para banco de dados.

![EC2 Role Named](public/imagens_da_documentacao_aws/14.jpeg)

**Imagem 15:** O perfil sendo criado com sucesso.

![Profile Success](public/imagens_da_documentacao_aws/15.jpeg)

---

## 🛡️ 3. Security Groups: Controle de Tráfego em Camadas

**Imagem 16:** Na tela inicial dos grupos de segurança (**SG**), local onde criarei os SGs.

![SG Console](public/imagens_da_documentacao_aws/16.jpeg)

### ALB Security Group

**Imagem 17:** Criando o primeiro SG - o do **ALB** onde dei o nome de **NebulaArchive-ALB-SG** com descrição adequada e atribui esse SG à VPC que criei anteriormente.

![ALB SG Creation](public/imagens_da_documentacao_aws/17.jpeg)

**Imagem 18:** Nas regras de entrada do security group da ALB, atribuindo:
- ✅ **HTTP** - Porta **80** de origem para qualquer lugar
- ✅ **HTTPS** - Porta **443** para qualquer lugar

Isso permite que o ALB aceite as requisições de qualquer lugar e faça a distribuição do tráfego para as instâncias adequadas.

![ALB Ingress Rules](public/imagens_da_documentacao_aws/18.jpeg)

**Imagem 19:** Security group da ALB sendo criado com sucesso.

![ALB SG Success](public/imagens_da_documentacao_aws/19.jpeg)

### EC2 Security Group

**Imagem 20:** Criando o security group da **EC2** onde dei o nome de **NebulaArchive-EC2-SG**, descrição adequada e atribuí a VPC que criei anteriormente.

![EC2 SG Creation](public/imagens_da_documentacao_aws/20.jpeg)

**Imagem 21:** Nas regras de entrada, coloquei:
- Tipo: **TCP PERSONALIZADO**
- Porta: **3000** (a porta que o **backend está atribuído** também - então ambas precisam estar em **sincronia** pois o frontend envia requisições para a porta 3000 que é o backend)
- Origem: Personalizada com o SG adequado

![EC2 Ingress Rules](public/imagens_da_documentacao_aws/21.jpeg)

**Imagem 22:** Security Group da EC2 sendo criado com sucesso.

![EC2 SG Success](public/imagens_da_documentacao_aws/22.jpeg)

### RDS Security Group

**Imagem 23:** Criando o Security Group do **RDS** onde dei o nome de **NebulaArchive-RDS-SG**, com descrição adequada, atribui a VPC criada anteriormente. Coloquei as regras de entrada de:
- Tipo: **PostgreSQL**
- Porta: **5432** (a porta padrão ouvinte desse banco para fazer conexão - então mesmo que no Docker do backend a porta seja por exemplo `9000:5432`, na AWS ela ouve por padrão na **porta 5432**)
- Origem: Security Group da EC2

![RDS SG Creation](public/imagens_da_documentacao_aws/23.jpeg)

**Imagem 24:** Security group do RDS sendo criado com sucesso.

![RDS SG Success](public/imagens_da_documentacao_aws/24.jpeg)

---

## 🗄️ 4. Banco de Dados: RDS PostgreSQL

### Selecionando o Motor

**Imagem 25:** Na tela inicial do serviço RDS para criação, finalmente, do banco de dados.

![RDS Console](public/imagens_da_documentacao_aws/25.jpeg)

**Imagem 26:** Escolhendo o motor **PostgreSQL** (lembrando que o RDS ouve em mais de 4 motores, podendo escolher eles).

![PostgreSQL Selection](public/imagens_da_documentacao_aws/26.jpeg)

### Configurando o Plano Gratuito

**Imagem 27:** Escolhendo o plano gratuito (já que estamos fazendo um laboratório então apliquei o **princípio de gerenciamento de custo** na criação dessa infraestrutura):
- **Tipo:** `db.t4g.micro`
- **CPU:** 2 vCPUs
- **RAM:** 1 GB
- **Armazenamento:** 20 GB
- **Preço:** Ridiculamente barato

![Free Tier Selection](public/imagens_da_documentacao_aws/27.jpeg)

**Imagem 28:** Como nem tudo são flores, cometi um erro e tive que voltar. Escolhendo novamente o PostgreSQL com configuração completa.

![PostgreSQL Config](public/imagens_da_documentacao_aws/28.jpeg)

### Configurando a Disponibilidade

**Imagem 29:** Escolhendo a implantação de **SINGLE-AZ** (uma única AZ para portar o banco de dados). Porém, **como estratégia e cumprimento do princípio de evolução arquitetural**, desenhei a arquitetura para ser **MULTI-AZ quando necessário** e **recomendo que nem coloque SINGLE-AZ, coloque MULTI-AZ logo de cara** para se precaver por falhas de AZ. Porém, estamos em um laboratório.

![Single-AZ Deployment](public/imagens_da_documentacao_aws/29.jpeg)

### Configurações de Armazenamento e Conectividade

**Imagem 30:** Dando o nome pro banco: **RDSDatabaseNebula**, coloquei o nome de usuário (simples mas educacional, lembrando que esse banco **já não existe mais** pois eu fiz todos os testes, gravações que precisava e depois destruí tudo, obviamente). A senha foi autogerenciada com uma senha adequada e claro, não irei dar detalhes sobre essa senha.

![DB Name & Credentials](public/imagens_da_documentacao_aws/30.jpeg)

**Imagem 31:** Tipo de instância - como tinha mencionado anteriormente. O armazenamento por padrão era 20GB mas **aumentei pra 50GB**.

![Instance Type Storage](public/imagens_da_documentacao_aws/31.jpeg)

**Imagem 32:** Parte de conectividade onde coloquei o RDS na **VPC** que é onde ela residirá.

![VPC Connectivity](public/imagens_da_documentacao_aws/32.jpeg)

**Imagem 33:** Escolhendo o **security group do RDS** que criei anteriormente nos passos anteriores.

![RDS SG Assignment](public/imagens_da_documentacao_aws/33.jpeg)

**Imagem 42:** E o banco de dados foi criado com sucesso.

![RDS Success](public/imagens_da_documentacao_aws/42.jpeg)

---

## 💾 5. Storage S3: Buckets Privados com Criptografia

### Criando o Bucket de Armazenamento

**Imagem 34:** Comecei a criar os buckets e o primeiro bucket criado foi **nebula-archive-media-gabriel**.

![Bucket Creation](public/imagens_da_documentacao_aws/34.jpeg)

**Imagem 35:** O mais importante - **bloqueio de acesso ao público**. Ou seja, esse bucket é **PRIVADO**.

![Block Public Access](public/imagens_da_documentacao_aws/35.jpeg)

**Imagem 36:** Adicionando a **criptografia padrão S3 (SSE-S3)**, algo que é **primordial** para o funcionamento da nossa infraestrutura. Esse padrão de criptografia, basicamente, iriamos passar a parte de **encriptar automaticamente para AWS**.

![SSE-S3 Encryption](public/imagens_da_documentacao_aws/36.jpeg)

**Imagem 37:** Bucket sendo criado com sucesso.

![Bucket Success](public/imagens_da_documentacao_aws/37.jpeg)

---

## 🖥️ 6. Instâncias de Computação: EC2 para Backend

### Criando a Instância EC2

**Imagem 38:** Fui finalmente para a parte de **instância EC2**, onde residirá o **backend** com toda a lógica de negócio e o **ORM PRISMA**.

Dando o nome do EC2 para **NebulaArchive-Backend**, escolhi a imagem padrão **AMAZON LINUX** (mais rápida, mais eficiente basicamente e o padrão de mercado). Lembrando que **criei uma instância apenas**.

![EC2 Dashboard](public/imagens_da_documentacao_aws/38.jpeg)

### Configuração de Rede e Segurança

**Imagem 39:** Atribuindo essa EC2 à VPC que criamos anteriormente. **Desabilitei também a criação de IP Público** já que essa instância residirá em uma **subrede privada** então não tem necessidade, até porque a instância não será acessível ao público, somente ao ALB por **permissões especiais de acordo com o privilégio mínimo**.

Atribuindo um **grupo de segurança existente** que criamos anteriormente, o **NebulaArchive-EC2-SG**.

**⚠️ Atenção:** Não criei par de **Access Key** pois acessamos a instância pelo meio mais profissional, pelo **SSM**.

![EC2 VPC Config](public/imagens_da_documentacao_aws/39.jpeg)

### Atribuindo Role IAM

**Imagem 40:** Atribuindo o **perfil (Instance Profile)** que criamos anteriormente chamado de **NebulaArchiveEC2Role** onde permitirá a **EC2 acessar o bucket** para envio das imagens estáticas.

![EC2 SG and Role](public/imagens_da_documentacao_aws/40.jpeg)

**Imagem 41:** EC2 rodando perfeitamente.

![EC2 Running](public/imagens_da_documentacao_aws/41.jpeg)

### Acessando a EC2 via SSM

**Imagem 43:** Já estamos dentro do **terminal da EC2**, rodei comandos necessários para verificar a **versão do Docker, Docker Compose**, itens necessários para hospedagem do nosso backend.

![Docker Verification](public/imagens_da_documentacao_aws/43.jpeg)

---

## 🎯 7. Application Load Balancer (ALB): Orquestração de Tráfego

### Criando o Target Group

**Imagem 44:** Criando o **grupo de destino**, pois a ALB receberá os tráfegos e o destino será a instância EC2 criada anteriormente.

![Target Group Creation](public/imagens_da_documentacao_aws/44.jpeg)

**Imagem 45:** Dando o nome do grupo de destino - **TG-Nebula-Archive**, porta **3000** (porta do nosso backend e de outras configurações que fizemos anteriormente) e protocolo **HTTP**, tipo de endereço **IPv4** e atribuí a VPC que criamos anteriormente.

![Target Group Config](public/imagens_da_documentacao_aws/45.jpeg)

**Imagem 46:** Atribuindo o grupo de destino à EC2 onde ALB receberá o tráfego e enviará aos destinos = EC2. Veja que aqui atribui novamente a porta **3000**.

**⚠️ Atenção:** TODAS AS PORTAS DESTINADAS AO EC2 PRECISAM ESTAR EM SINCRONIA, OU SEJA, **TODAS AS PORTAS DEVEM SER 3000**.

![EC2 to TG Assignment](public/imagens_da_documentacao_aws/46.jpeg)

**Imagem 47:** GRUPO DE DESTINO sendo criado com sucesso.

![TG Success](public/imagens_da_documentacao_aws/47.jpeg)

### Criando o ALB

**⚠️ Atenção Crítica:** COMO ESTAMOS NO MODELO **FREE TIER DA AWS** TENDO **200 DE CRÉDITO**, A ALB QUE SERIA BASICAMENTE O **ITEM MAIS CARO**, SE TORNA **MUITO BARATO** POIS O FREE TIER AJUDA NISSO.

**⚠️ 2 ITENS QUE PRECISAMOS TER ATENÇÃO:** NAT GATEWAY E ALB - **SÃO OS ITENS MAIS CAROS DA INFRAESTRUTURA**.

**Imagem 48:** Opções de ELB, escolhi **ALB que é para HTTPS**.

![ELB Options](public/imagens_da_documentacao_aws/48.jpeg)

**Imagem 49:** Dando nome pra ALB - **ALB-Nebula-Archive**, coloquei o esquema **voltado para a internet** já que o sistema será com esse objetivo.

![ALB Configuration](public/imagens_da_documentacao_aws/49.jpeg)

**Imagem 50:** Uma série de configurações:
- Primeiro, atribuí a ALB à rede VPC
- Escolhi a **subrede pública** chamada: **nebula-archive-subnet-public1** e região: **us-east-1a**

**⚠️ Atenção:** TODA INFRAESTRUTURA RESIDE NESSA REGIÃO.

![ALB Subnets](public/imagens_da_documentacao_aws/50.jpeg)

**Imagem 51:** Atribuindo a ALB na **outra subnet** chamada: **nebula-archive-subnet-public2** na mesma região: **us-east-1b**.

![ALB SG Assignment](public/imagens_da_documentacao_aws/51.jpeg)

**Imagem 52:** Atribuindo o **grupo de segurança da ALB** que criamos anteriormente, chamado de **NebulaArchive-ALB-SG**.

Fazendo outras configurações onde atribuí o **protocolo 80** e atribuí para ALB **encaminhar o tráfego ao grupo de destino** que direciona posteriormente à EC2 que está na subrede privada.

**Ou seja:**
- **ALB RECEBE O TRÁFEGO DA INTERNET**
- **DIRECIONA OS TRÁFEGOS PARA OS DESTINOS**
- **DESTINOS SÃO A EC2**
- Como **criamos SOMENTE 1 INSTÂNCIA**, não tem problema pois o tráfego será mínimo
- **PORÉM**, em uma situação REAL, o certo seria:
  - Criar uma **AMI**
  - **Atribuir ao Auto Scaling**
  - **Atribuir o Grupo de Destino** às EC2 do Auto Scaling
  - **Auto Scaling vai fazer o dimensionamento automático** da quantidade de instâncias de acordo com a demanda
  - **ESSA É A ARQUITETURA MAIS PROFISSIONAL E REQUISITADA** que eu dou como arquiteto cloud junior (tenho ainda o que aprender, lógico.)

![ALB Listener Config](public/imagens_da_documentacao_aws/52.jpeg)

**Imagem 53:** Balanceador de carga **ALB-Nebula-Archive** sendo criado com sucesso.

![ALB Success](public/imagens_da_documentacao_aws/53.jpeg)

---

## 🚀 8. Deployment do Backend via EC2

### Git Clone e Configuração

**Imagem 54:** No repositório do Nebula Archive pegando o **link HTTPS do repositório** para fazer conexão com EC2 via SSM para fazer git clone desse projeto.

![Backend Repository](public/imagens_da_documentacao_aws/54.jpeg)

**Imagem 55:** Fazendo exatamente isso - **git clone do projeto**.

![Git Clone](public/imagens_da_documentacao_aws/55.jpeg)

**Imagem 56:** Arquivo `.env` no **nano .env** onde tem informações necessárias como:
- **URL do banco de dados**
- **Nome do bucket**
- **Porta (3000 como sempre)**
- **Região**

Lembrando: todas essas informações do .env foram destruídas.

**⚠️ Atenção:** LEMBRA QUANDO EU DISSE QUE TERIA QUE MUDAR O NOME DO BUCKET de **nebula-archive-media-gabriel** para **nebula-archive-storage**? Pois é, aconteceu! E eu ainda tive que colocar um **nome de variável de ambiente mais adequado e atual e oficial**.

![.env Configuration](public/imagens_da_documentacao_aws/56.jpeg)

### Criando a Imagem Docker

**Imagem 57:** Criando a **imagem Docker** dentro do SSM do nosso projeto.

![Docker Build](public/imagens_da_documentacao_aws/57.jpeg)

**Imagem 58:** Servidor rodando perfeitamente. Porém, como nem tudo são flores, enfrentei uma série de dificuldades que pretendo colocar aqui como documentação e mostrar que **a vida de um futuro arquiteto cloud sênior não é fácil**.

![Backend Running](public/imagens_da_documentacao_aws/58.jpeg)

**Imagem 59:** E mostra **o que queremos - o HELLO WORLD** (cômico, não é? kkk). **BINGO!**

![Hello World](public/imagens_da_documentacao_aws/59.jpeg)

---

## 🌍 9. Frontend & Distribuição Global via CloudFront

### Criando o Bucket Frontend

**Imagem 60:** Criando o **bucket do frontend** (onde residirá os arquivos estáticos do nosso frontend que será **distribuído globalmente via CLOUDFRONT**). O nome do bucket foi **nebula-archive-frontend-prod**.

![Frontend Bucket Creation](public/imagens_da_documentacao_aws/60.jpeg)

**Imagem 61:** Uma parte **CRUCIAL** - o **bloqueio do acesso público** pra esse bucket (**MUITO IMPORTANTE**).

![Block Frontend Public Access](public/imagens_da_documentacao_aws/61.jpeg)

**Imagem 62:** Bucket do frontend sendo criado.

![Frontend Bucket Success](public/imagens_da_documentacao_aws/62.jpeg)

### Upload dos Arquivos Estáticos

**Imagem 63:** Dentro do bucket do frontend, iniciando o **upload de todos os arquivos estáticos** de dentro da pasta **DIST** da pasta **FRONTEND** com os arquivos estáticos.

![DIST Upload Start](public/imagens_da_documentacao_aws/63.jpeg)

**Imagem 64:** Fazendo upload dos arquivos estáticos da pasta **DIST**. E antes disso, eu preparei o ambiente localmente no **VS CODE** onde:
- Arrumei variáveis de ambiente
- Fiz **build do frontend** usando **PNPM RUN BUILD** (lembrando que **não usei NPM** mas **PNPM** por ser **mais leve e versátil** e lembrando, **primeira vez usando PNPM**, mostrando e provando que **posso sim me adaptar a mudanças**)

Algo **muito importante** - arquivo **INDEX.HTML**. Após fazer upload dos arquivos estáticos, vamos para a distribuição no CloudFront.

![PNPM Build and index.html](public/imagens_da_documentacao_aws/64.jpeg)

### Criando a Distribuição CloudFront

**Imagem 65:** Já criando a distribuição onde dei o nome de **frontend-distribuition**, coloquei a descrição adequada.

![Distribution Creation](public/imagens_da_documentacao_aws/65.jpeg)

**Imagem 66:** Selecionando a origem (onde fica os arquivos que eu quero distribuir? No **S3 do FRONTEND**). Na mesma imagem mostra eu selecionando o **bucket do FRONTEND**.

![Origin Selection](public/imagens_da_documentacao_aws/66.jpeg)

### Configurando Segurança

**Imagem 67:** Algo **IMPORTANTÍSSIMO** para a proteção da infraestrutura - a **ativação do serviço WAF** para proteção do sistema contra **injeção de SQL**.

**⚠️ Atenção:** DURANTE ESSE PROCESSO, ENFRENTEI UMA SÉRIE DE DIFICULDADES PARA QUE TODO O SISTEMA ESTEJA FUNCIONANDO PERFEITAMENTE. EU TINHA COLOCADO A **PROTEÇÃO NÍVEL ALTA NO WAF** E ACHEI QUE ERA ESSE NÍVEL DE PROTEÇÃO QUE ESTAVA **BLOQUEANDO A ENTRADA NO SITE**. ENTÃO, DESATIVEI ESSA FUNCIONALIDADE POSTERIORMENTE E DEPOIS O ATIVEI.

![WAF Activation](public/imagens_da_documentacao_aws/67.jpeg)

**Imagem 68:** Colocando o **nível de proteção contra ataques DDoS** - o famoso **SHIELD**.

![DDoS Shield](public/imagens_da_documentacao_aws/68.jpeg)

**Imagem 69:** Distribuição sendo criada.

![Distribution Created](public/imagens_da_documentacao_aws/69.jpeg)

### Configurando Default Root Object

**Imagem 70:** **⚠️ Lembra quando eu disse para PRESTAR E GUARDAR A INFORMAÇÃO SOBRE O INDEX.HTML? ENTÃO, TIVE QUE VOLTAR NA DISTRIBUIÇÃO E ESPECIFICAR O INDEX.HTML.**

![Index HTML Default](public/imagens_da_documentacao_aws/70.jpeg)

### Aplicando Bucket Policy

**Imagem 71:** Dentro da distribuição, **copiando a POLICY da distribuição**, código que irei colocar no **bucket S3 do FRONTEND** para ele **distribuir globalmente pelos pontos de presença** e **aumentar em, digamos que, 100% o acesso rápido** do conteúdo estático desse site, fazendo com que o site seja **extremamente rápido, como o FLASH**.

![Copy Distribution Policy](public/imagens_da_documentacao_aws/71.jpeg)

**Imagem 72:** Exatamente isso - estava dentro do **bucket policy do bucket do frontend** e colei o **código policy copiado da distribuição**.

![Apply Bucket Policy](public/imagens_da_documentacao_aws/72.jpeg)

### Configurando Error Pages

**Imagem 73:** Criando basicamente **destinos de erro**, como:
- **403: Forbidden**
- **TTL 200**

![Error Pages Creation](public/imagens_da_documentacao_aws/73.jpeg)

**Imagem 74:** Páginas de erro **403 e 404** criadas.

![Error Pages Done](public/imagens_da_documentacao_aws/74.jpeg)

### Cache Invalidation

**Imagem 75:** Fazendo uma configuração que admito, **muito engenhosa e bem simples** - através do comando **"/*"** eu basicamente disse para **excluir o histórico de distribuição** e **passar a distribuir os arquivos** que eu acabei de fazer upload.

**⚠️ Atenção:** DURANTE O PROCESSO DE CRIAÇÃO E TENTATIVA DE FAZER A INFRAESTRUTURA FUNCIONAR, EU RODEI ESSE COMANDO **VÁRIAS VEZES** POIS TIVE QUE FAZER ALGUMAS **ALTERAÇÕES ESTRATÉGICAS**. FUI PESQUISANDO E FAZENDO, PROVANDO ASSIM TAMBÉM MINHA **CAPACIDADE DE PESQUISA E APLICAÇÃO**. DEU DOR DE CABEÇA, MAS O TRABALHO ESTÁ FEITO.

![Cache Invalidation](public/imagens_da_documentacao_aws/75.jpeg)

**Imagem 76:** Novamente, colocando o **index.html** - **muito importante**.

![Index Default Confirmed](public/imagens_da_documentacao_aws/76.jpeg)

---

## 📝 10. Finalizações e Otimizações

### Push do Código

**Imagem 77:** Rodando o **push do VS Code** para o backend.

**⚠️ Atenção:** DURANTE A TENTATIVA DE FAZER A INFRA FUNCIONAR, TIVE QUE **RECRIAR VÁRIAS VEZES O CONTAINER** E ENVIAR PARA A EC2. TIVE DIFICULDADES, MAS COM MUITA PESQUISA, CONSEGUI.

![Backend Push](public/imagens_da_documentacao_aws/77.jpeg)

### Configurações de Hospedagem Estática

**Imagem 78:** Novamente, fazendo a **edição do conteúdo do site estático** e colocando o **INDEX.HTML** - **muito importante**, vale ressaltar. Repare que eu marquei a **opção de hospedar site estático** - **importante também**.

![Metadata Edit](public/imagens_da_documentacao_aws/78.jpeg)

### Metadados de Arquivos Estáticos

**Imagem 79:** Fazendo uma modificação importante - os **METADADOS dos arquivos estáticos**. Coloquei que foi definido pelo sistema:
- **Chave:** `CONTENT-TYPE`
- **Valor:** `text/plain`

![Content Type Definition](public/imagens_da_documentacao_aws/79.jpeg)

**Imagem 80:** E **BINGO** - resultado final, tudo funcionando como esperado!

![Final Result](public/imagens_da_documentacao_aws/80.jpeg)

---

## 🎓 Conclusão e Aprendizados

**⚠️ Reflexão Final:**

ALGUMAS ALTERAÇÕES EU CONSEGUI FAZER, **PRINCIPALMENTE NO CÓDIGO FONTE** PARA COLOCAR AS **VARIÁVEIS DE AMBIENTES NECESSÁRIAS** PARA AS **REQUISIÇÕES HTTPS FUNCIONAR**.

VALE RESSALTAR QUE **ESSE É O PRIMEIRO PROJETO CLOUD NATIVE** ONDE APLICO MEUS CONHECIMENTOS EM:
- ✅ Programação **FRONTEND**
- ✅ Programação **BACKEND**
- ✅ Banco de Dados
- ✅ **INFRAESTRUTURA/ARQUITETURA CLOUD**

**FOI DESAFIADOR, MAS APRENDI MUITA COISA.**

---

## 💡 Principais Aprendizados

### ✅ O Que Funcionou

✅ **Arquitetura Multi-AZ desde o início** - Mesmo em Single-AZ para economia, o design suporta Multi-AZ  
✅ **Princípio de Menor Privilégio** - IAM roles restritas, sem Access Keys expostas  
✅ **Presigned URLs** - Solução elegante para upload seguro sem exposição de credenciais  
✅ **VPC + NAT Gateway + S3 Gateway Endpoint** - Isolamento de rede com otimização de custos  
✅ **CloudFront + WAF + Shield** - Distribuição global com proteção em camadas  
✅ **Full-Stack Integration** - Frontend → ALB → Backend → RDS → S3  

### 🔧 Desafios Encontrados

⚠️ **Sincronização de Portas** - Todas as portas (Docker, Backend, SG, ALB, TG) precisam estar em perfeita sincronização. Erro em uma = falha total.

⚠️ **WAF com Nível Alto** - Inicialmente bloqueava requisições legítimas. Necessário ajuste fino de regras.

⚠️ **Index.html no CloudFront** - CloudFront precisa saber o arquivo default para root `/`. Sem isso, retorna 403.

⚠️ **Cache Invalidation** - Após mudanças no frontend, necessário invalidar cache manualmente.

⚠️ **Docker + EC2 via SSM** - Recriar container e enviá-lo exigiu pesquisa e iteração. Documentação em produção é crítica.

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

## 🔐 Checklist de Boas Práticas de Segurança

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

**Construído com ❤️, ☕ e muito 🧠 - Primeiro projeto Cloud-Native de um arquiteto em ascensão.**
