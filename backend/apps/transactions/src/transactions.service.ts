import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { Transaction, TransactionStatus } from './transaction/entities/transaction.entity';
import { CreateTransactionDto } from './transaction/dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) { }

  async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const transaction = this.transactionsRepository.create({
      ...createTransactionDto,
      status: TransactionStatus.PENDING,
    });
    const savedTransaction = await this.transactionsRepository.save(transaction);

    // Emit event to anti-fraud service
    const payload = {
      transactionExternalId: savedTransaction.transactionExternalId,
      amount: savedTransaction.value,
    };
    console.log(`TransactionsService: Emitting payload: ${JSON.stringify(payload)}`);
    this.kafkaClient.emit('transaction_created', payload).subscribe();

    return savedTransaction;
  }

  async updateStatus(transactionExternalId: string, status: TransactionStatus) {
    await this.transactionsRepository.update(transactionExternalId, { status });
  }

  findAll() {
    return this.transactionsRepository.find();
  }
}
