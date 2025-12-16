import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { TransactionsModule } from './transactions.module';

async function bootstrap() {
  const app = await NestFactory.create(TransactionsModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'transactions-consumer-server',
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
