# Meu Discord

Aplicação estilo Discord com:
- Login/cadastro local para demonstração
- Servidores e canais
- Chat em tempo real com Socket.IO
- Sala de voz
- Compartilhamento de tela com WebRTC
- Interface responsiva

## Requisitos
- Node.js 20 ou superior
- npm

## Instalação

No terminal, dentro desta pasta:

```bash
npm install
npm run install-all
npm run dev
```

Depois abra:

http://localhost:5173

Para testar voz e tela entre duas pessoas, abra o site em duas janelas/navegadores diferentes.

### Observação sobre produção

A versão local usa um servidor de sinalização Socket.IO e WebRTC. Para uso público na internet, recomenda-se:
- HTTPS
- banco de dados
- autenticação real
- TURN server para conexões WebRTC que não conseguem estabelecer conexão direta
- persistência de servidores, canais e mensagens
