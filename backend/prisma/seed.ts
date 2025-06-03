import { PrismaClient } from '../generated/prisma';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Criando clientes
  const clients = await Promise.all(
    Array.from({ length: 5 }).map(() =>
      prisma.client.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          status: faker.helpers.arrayElement(['ACTIVE', 'INACTIVE']),
        },
      })
    )
  );

  // Criando ativos
  const assets = await Promise.all(
    Array.from({ length: 5 }).map(() =>
      prisma.asset.create({
        data: {
          name: faker.company.name(),
          type: faker.helpers.arrayElement(['STOCK', 'FUND', 'BOND', 'ETF', 'CRYPTO']),
          currentValue: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
          symbol: faker.finance.currencyCode(),
          description: faker.lorem.sentence(),
        },
      })
    )
  );

  // Criando alocações
  const allocations = await Promise.all(
    clients.map((client) => {
      const asset = faker.helpers.arrayElement(assets);
      return prisma.allocation.create({
        data: {
          clientId: client.id,
          assetId: asset.id,
          quantity: faker.number.float({ min: 1, max: 100, fractionDigits: 2 }),
          txCount: 2,
        },
      });
    })
  );

  // Criando transações para cada alocação
  for (const allocation of allocations) {
    await prisma.transaction.createMany({
      data: [
        {
          allocationId: allocation.id,
          type: 'BUY',
          quantity: faker.number.float({ min: 1, max: 50, fractionDigits: 2 }),
          price: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
          date: faker.date.past(),
        },
        {
          allocationId: allocation.id,
          type: 'SELL',
          quantity: faker.number.float({ min: 1, max: 50, fractionDigits: 2 }),
          price: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
          date: faker.date.recent(),
        },
      ],
    });
  }

  console.log('✅ Seeding concluído com sucesso');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
