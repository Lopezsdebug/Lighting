# Lighting — projeto enxuto

Versão reorganizada do projeto Lighting para evitar a grande quantidade de arquivos do React/Vite.

## Estrutura

```text
Lighting/
├── package.json
├── server.js
├── .gitignore
└── public/
    ├── index.html
    ├── app.js
    └── style.css
```

São apenas **7 arquivos**.

## Rodar no computador

```bash
npm install
npm start
```

Depois abra `http://localhost:3001`.

## O que foi mantido

- Login/perfil local
- Servidores e canais
- Chat em tempo real com Socket.IO
- Canais de voz
- Microfone via WebRTC
- Compartilhamento de tela via WebRTC
- Sinalização WebRTC no Node.js
- STUN e suporte opcional a TURN do Cloudflare
- Interface responsiva estilo Discord

## Publicar

Este formato é adequado para colocar em um único serviço Node, como Render, Railway ou outro host compatível.

Com o servidor publicado, o frontend também é servido pelo mesmo endereço. Não é necessário Vercel separado.

### Variáveis opcionais

`PORT` — fornecida normalmente pelo serviço de hospedagem.

`FRONTEND_URL` — origem permitida. Pode ser omitida quando o frontend e o backend estão no mesmo endereço.

`TURN_KEY_ID` e `TURN_KEY_API_TOKEN` — opcionais para fornecer TURN pelo Cloudflare. Sem eles, o projeto usa STUN.

## GitHub

A pasta contém somente 7 arquivos do projeto. Não envie `node_modules`; o `.gitignore` já impede isso.
