# 🌌 Nebula-Archive

> **Status do Projeto:** Em desenvolvimento 🚀

O **Nebula-Archive** é uma solução robusta de arquivamento e gerenciamento de dados desenvolvida com o framework **NestJS**. O projeto foi concebido sob a ótica de um **Cloud-Native Developer**, priorizando escalabilidade, desacoplamento e resiliência, utilizando o que há de mais moderno no ecossistema **AWS**.

---

## 🛠️ Tech Stack & Arquitetura

Este sistema utiliza uma arquitetura modular baseada em microservices/serverless ready:

- **Backend:** [NestJS](https://nestjs.com/) (Node.js) com TypeScript
- **Gerenciador de Pacotes:** `pnpm` (Alta performance e economia de disco)
- **Infraestrutura (Target):** AWS (S3 para armazenamento, DynamoDB para metadados)
- **Segurança:** Implementação de **IAM Roles** com princípio de privilégio mínimo
- **Observabilidade:** Monitoramento via **Amazon CloudWatch** e Logs estruturados

---

## 🚀 Como Rodar o Projeto

Como estamos utilizando o **pnpm**, o processo de instalação é extremamente rápido.

### Pré-requisitos

- Node.js (v20 ou superior)
- pnpm instalado (`npm i -g pnpm`)

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/GabrielF0900/Nebula-Archive.git
   ```

2. Instale as dependências:
   ```bash
   pnpm install
   ```

### Execução (Modo Desenvolvimento)

```bash
pnpm start:dev
```

A API estará disponível em `http://localhost:3000`.

---

## 🏗️ Padrões de Cloud Architecture (SAA-C03)

O projeto segue os pilares do **AWS Well-Architected Framework**:

1. **Resiliência:** Design preparado para implantação em **Multi-AZ**
2. **Performance:** Otimização de consultas e processamento assíncrono
3. **Segurança:** Proteção de dados em repouso e em trânsito
4. **Custo:** Uso eficiente de **Managed Services** para evitar sobrecarga de infraestrutura

---

## 🤝 Contato & Conexões

Desenvolvido por **Gabriel Falcão da Cruz**.

Atualmente cursando Sistemas de Informação (5º Semestre) e focado em soluções de arquitetura de nuvem escaláveis.

- **🌐 Portfólio:** [Link do seu Portfólio](https://www.gabrielfalcaodacruz.tech/)
- **💼 LinkedIn:** [Link do LinkedIn](https://www.linkedin.com/in/gabrielfalcaodev/)

---

> "Build for the cloud, scale for the world." ☁️
