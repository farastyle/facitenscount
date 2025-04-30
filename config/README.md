# Diretório de Configuração

Este diretório contém arquivos de configuração para o Rastreador de Itens do Discord.

## Estrutura

- `config.json` - Arquivo principal de configuração
- `/items` - Definições de itens e configurações de reconhecimento
- `/reference` - Imagens de referência para reconhecimento de itens

## Formato do Arquivo de Configuração

O arquivo principal de configuração (`config.json`) tem a seguinte estrutura:

```json
{
  "itemsPath": "config/items",
  "storageType": "json",
  "storagePath": "data",
  "gridSettings": {
    "rows": 4,
    "columns": 5
  }
}
```

## Configuração de Itens

Cada item é definido em um arquivo JSON separado no diretório `items`. Os arquivos de itens têm a seguinte estrutura:

```json
{
  "name": "Placa de Pare",
  "description": "Uma placa de pare vermelha octagonal",
  "imagePath": "reference/placa_pare.png",
  "coordinates": {
    "grid": { "row": 0, "col": 2 },
    "pixel": { "x": 320, "y": 80 }
  },
  "features": {
    "color": { "r": 220, "g": 20, "b": 20 },
    "shape": "octagon"
  }
}
```

## Adicionando Novos Itens

1. Crie um novo arquivo JSON no diretório `items`
2. Defina as propriedades do item (nome, descrição, etc.)
3. Adicione uma imagem de referência ao diretório `reference`
4. Atualize o JSON do item para apontar para a imagem de referência

O sistema carregará automaticamente o novo item ao reiniciar.