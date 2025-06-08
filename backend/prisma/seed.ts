import { PrismaClient } from "../generated/prisma";
import { faker } from "@faker-js/faker";
import { Decimal } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

async function main() {
  // Criar alguns ativos
  const assets = await Promise.all(
    Array.from({ length: 10 }).map(() =>
      prisma.asset.create({
        data: {
          name: faker.finance.accountName(),
          type: faker.helpers.arrayElement(["STOCK", "FUND", "BOND", "ETF", "CRYPTO"]),
          currentValue: new Decimal(faker.finance.amount({ min: 50, max: 500, dec: 2 })),
          symbol: faker.finance.currencyCode(),
          description: faker.lorem.sentence(),
        },
      })
    )
  );

  for (let i = 0; i < 5; i++) {
    const client = await prisma.client.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        status: "ACTIVE",
      },
    });

    const allocations: Record<string, { id: string; quantity: Decimal }> = {};

    for (let j = 0; j < 20; j++) {
      const asset = faker.helpers.arrayElement(assets);
      const allocationKey = `${client.id}_${asset.id}`;

      if (!allocations[allocationKey]) {
        const allocation = await prisma.allocation.create({
          data: {
            clientId: client.id,
            assetId: asset.id,
            quantity: new Decimal(0),
          },
        });
        allocations[allocationKey] = {
          id: allocation.id,
          quantity: allocation.quantity,
        };
      }

      const allocation = allocations[allocationKey];
      const txType = faker.helpers.arrayElement(["BUY", "SELL"] as const);
      const quantity = new Decimal(faker.finance.amount({ min: 1, max: 10, dec: 2 }));
      let newQuantity =
        txType === "BUY" ? allocation.quantity.plus(quantity) : allocation.quantity.minus(quantity);

      if (newQuantity.lessThanOrEqualTo(0)) {
        newQuantity = allocation.quantity.plus(quantity);
      }

      await prisma.allocation.update({
        where: { id: allocation.id },
        data: {
          quantity: newQuantity,
        },
      });

      allocation.quantity = newQuantity;

      await prisma.transaction.create({
        data: {
          allocationId: allocation.id,
          clientId: client.id,
          assetId: asset.id,
          type: txType,
          quantity,
          price: asset.currentValue,
          date: faker.date.past(),
        },
      });
    }
  }

  console.log("✅ Seed finalizada com sucesso.");
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });