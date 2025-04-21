# Lumina AI

Lumina AI is a powerful multi-agent architecture that leverages multiple AI providers to deliver optimal results for various tasks.

## Repository Structure

This monorepo contains all components of the Lumina AI system:

- **core/**: Central orchestration and core services
- **providers/**: AI provider integration (OpenAI, Claude, Gemini, DeepSeek, Grok)
- **memory/**: State and context management
- **security/**: Authentication and authorization
- **docs/**: Documentation
- **deployment/**: Deployment configurations and scripts

## Features

- Multi-provider AI integration with intelligent routing
- Advanced computer control capabilities
- Sophisticated memory and context management
- Extensive tool integration framework
- Cross-platform support (web and mobile)

## Getting Started

### Prerequisites

- Python 3.10+
- Docker and Docker Compose (for containerized deployment)
- Node.js 18+ (for web frontend)

### Installation

```bash
# Clone the repository
git clone https://github.com/kimhons/lumina-ai.git
cd lumina-ai

# Install dependencies
pip install -e .

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys and configuration
```

### Running Locally

```bash
# Start the core services
python -m lumina.core.gateway

# In another terminal, start the provider service
python -m lumina.providers.server
```

### Deployment

See the [deployment documentation](deployment/README.md) for detailed instructions on deploying Lumina AI in various environments.

## Development

### Testing

```bash
# Run all tests
pytest

# Run specific component tests
pytest core/tests/
pytest providers/tests/
```

### Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
