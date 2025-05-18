# Hono - MongoDB

## Tech Stack

- **Runtime**: [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- **Framework**: [Hono.js](https://hono.dev/) (Modern, fast web framework)
- **Database**: [MongoDB](https://www.mongodb.com/) (With native Node.js driver)
- **Deployment**: [Wrangler](https://developers.cloudflare.com/workers/wrangler/)
- **Types**: [Cloudflare Typegen](https://developers.cloudflare.com/workers/wrangler/commands/#types)

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/thedhruvish/hono-mongodb.git
cd hono-mongodb
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
   - Create `.dev.vars` file in root directory:
   ```ini
   MONGODB_URI="your_mongodb_connection_string"
   ```

## Deployment

### Development
```bash
npm run dev
```

### Production
1. Set production secrets:
```bash
npx wrangler secret put MONGODB_URI
```

2. Deploy to Cloudflare:
```bash
npm run deploy
```

### Type Generation
Sync Cloudflare bindings with:
```bash
npm run cf-typegen
```

## Project Structure
```
src/
├── db/          # Database connection logic
├── routes/      # API endpoint handlers
├── types/       # TypeScript type definitions
└── index.ts     # Main application entry
```

## Environment Variables
- `MONGODB_URI`: MongoDB connection string
- (Production) Set via `wrangler secret put`

## Contributing
Feel free to fork the repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

## Contact
- [Dhruvish Lathiya](https://thedhruvish.com)
- [GitHub](https://github.com/thedhruvish)
- [Twitter](https://x.com/dhruvishlathiya)
- [Email](mailto:thedhruvish@gmail.com)

## License
MIT License - See [LICENSE](LICENSE)


        