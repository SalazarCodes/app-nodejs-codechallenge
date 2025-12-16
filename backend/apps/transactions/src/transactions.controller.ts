import { Controller, Post, Body, Get } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './transaction/dto/create-transaction.dto';
import { TransactionStatus } from './transaction/entities/transaction.entity';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @MessagePattern('transaction_status_updated')
  async handleTransactionStatusUpdated(@Payload() message: any) {
    console.log('TransactionsController: Raw message', message);

    // Kafka messages sometimes wrap the payload in a 'value' property or just return the object
    const data = message.value || message;

    if (!data.transactionExternalId) {
      console.error('TransactionsController: Missing transactionExternalId', data);
      return;
    }

    console.log(`TransactionsController: Updating ${data.transactionExternalId} to ${data.status}`);
    await this.transactionsService.updateStatus(data.transactionExternalId, data.status);
  }

  @Get()
  findAll() {
    return this.transactionsService.findAll();
  }
}
