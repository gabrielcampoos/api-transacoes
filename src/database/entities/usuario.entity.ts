import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from "typeorm";
import { EnderecoEntity } from "./endereco.entity";

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

  @OneToOne(() => EnderecoEntity)
  @JoinColumn({
    name: "id_endereco",
    foreignKeyConstraintName: "fk_enderecos",
    referencedColumnName: "id",
  })
  endereco?: EnderecoEntity;

  @BeforeInsert()
  beforeInsert() {
    this.criadoEm = new Date();
  }
}
