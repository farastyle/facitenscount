# Rastreador de Itens do Discord

Um bot do Discord que monitora canais para imagens, detecta itens específicos e extrai informações de quantidade.

## Funcionalidades

- Integração com bot do Discord para monitorar um canal específico
- Reconhecimento de imagem para identificar itens a partir de imagens de referência
- OCR para extrair valores numéricos (como quantidade)
- Sistema de configuração para definir itens de referência
- Painel para visualizar e analisar resultados
- Interface simples e intuitiva

## Como Começar

### Pré-requisitos

- Node.js 16+
- Um token de bot do Discord (do [Portal de Desenvolvedores do Discord](https://discord.com/developers/applications))
- Servidor Discord com um canal para monitoramento

### Configuração

1. Copie `.env.example` para `.env` e preencha suas credenciais do Discord:
   ```
   DISCORD_TOKEN=seu_token_do_bot
   DISCORD_CLIENT_ID=seu_client_id
   DISCORD_GUILD_ID=seu_guild_id
   DISCORD_CHANNEL_ID=seu_channel_id
   ```

2. Instale as dependências:
   ```
   npm install
   ```

3. Inicie a aplicação:
   ```
   npm run dev
   ```

4. Inicie o bot:
   ```
   npm run start:bot
   ```

## Uso

1. Adicione seu bot do Discord ao seu servidor
2. Configure o bot para monitorar um canal específico
3. Configure os itens de referência na Biblioteca de Itens
4. Quando os usuários postarem imagens contendo estes itens, o bot irá:
   - Detectar os itens na imagem
   - Extrair informações de quantidade
   - Armazenar os resultados
   - Responder à mensagem com uma confirmação

## Tecnologias Utilizadas

- Discord.js - Integração com API do Discord
- Tesseract.js - OCR para extração de texto
- Canvas - Processamento de imagem
- React - Framework de interface
- Tailwind CSS - Estilização

## Estrutura do Projeto

- `/src/bot` - Implementação do bot do Discord
- `/src/components` - Componentes React para o painel
- `/src/utils` - Funções utilitárias
- `/config` - Arquivos de configuração para itens de referência
- `/data` - Armazenamento para resultados de detecção