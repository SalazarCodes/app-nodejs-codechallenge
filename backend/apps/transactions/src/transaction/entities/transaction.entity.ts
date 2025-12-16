import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum TransactionStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    transactionExternalId: string;

    @Column('uuid')
    accountExternalIdDebit: string;

    @Column('uuid')
    accountExternalIdCredit: string;

    @Column('int')
    transferTypeId: number;

    @Column('decimal', { precision: 10, scale: 2 })
    value: number;

    @Column({
        type: 'enum',
        enum: TransactionStatus,
        default: TransactionStatus.PENDING,
    })
    status: TransactionStatus;

    @CreateDateColumn()
    createdAt: Date;
}
