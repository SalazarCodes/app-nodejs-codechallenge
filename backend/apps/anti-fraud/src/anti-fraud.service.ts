import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class AntiFraudService {
  constructor(
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) { }

  validateTransaction(data: any) {
    console.log('AntiFraudService: Validating transaction', data);
    const status = data.amount > 1000 ? 'rejected' : 'approved';
    console.log(`AntiFraudService: Emitting transaction_status_updated: ${status}`);

    this.kafkaClient.emit('transaction_status_updated', {
      transactionExternalId: data.transactionExternalId,
      status,
    }).subscribe();
  }
}
