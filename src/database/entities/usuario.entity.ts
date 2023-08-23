import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import { EnderecoEntity } from "./endereco.entity";
import { TransacoesEntity } from "./transacoes.entity";

@Entity({ name: "usuarios" })
export class UsuarioEntity extends BaseEntity {
  @PrimaryColumn()
  id!: string;

  @Column({ unique: true, type: "varchar", length: 150 })
  email!: string;

  @Column({ type: "varchar", length: 255 })
  senha!: string;

  @Column({ name: "criadoem" })
  criadoEm!: Date;

  @Column({ name: "id_endereco", nullable: true })
  idEndereco!: string | null;

  @OneToOne(() => EnderecoEntity)
  @JoinColumn({
    name: "id_endereco",
    foreignKeyConstraintName: "fk_enderecos",
    referencedColumnName: "id",
  })
  endereco?: EnderecoEntity;

  @OneToMany(() => TransacoesEntity, (transacao) => transacao.usuario)
  transacoes!: TransacoesEntity[];

  @BeforeInsert()
  beforeInsert() {
    this.criadoEm = new Date();
  }
}
