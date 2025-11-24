# Como rodar o projeto (Passo a passo simples e completo)

Este guia explica, de forma fácil, como instalar e rodar o projeto no computador.

---

## ✅ 1. Instalar o Node.js
O Node.js é necessário para rodar o programa.

Baixar aqui:  
https://nodejs.org/en

1. Clique em **LTS (Recomendado)**  
2. Baixe o instalador  
3. Clique em **Next** até finalizar a instalação  

---

## ✅ 2. Abrir o VS Code

1. Abra o **VS Code**
2. Clique em **Terminal**
3. Clique em **New Terminal** (Novo Terminal)

Um terminal vai abrir na parte inferior.

---

## ✅ 3. Baixar o projeto do GitHub

No terminal do VS Code digite:

```bash
git clone <URL_DO_REPOSITORIO>
cd nome_da_pasta_do_projeto
npm install -g pnpm
pnpm install
pnpm dev
