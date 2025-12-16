import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AntiFraudService } from './anti-fraud.service';

@Controller()
export class AntiFraudController {
  constructor(private readonly antiFraudService: AntiFraudService) { }

  @MessagePattern('transaction_created')
  handleTransactionCreated(@Payload() message: any) {
    console.log('AntiFraudController: Raw message type:', typeof message);
    try {
      console.log('AntiFraudController: Raw message JSON:', JSON.stringify(message));
    } catch (e) {
      console.log('AntiFraudController: Could not stringify message');
    }
    const data = message.value || message;
    this.antiFraudService.validateTransaction(data);
  }
}
