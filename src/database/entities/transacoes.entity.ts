import { randomUUID } from "crypto";
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
import { UsuarioEntity } from "./usuario.entity";

@Entity({ name: "transacoes" })
export class TransacoesEntity {
  @PrimaryColumn({ type: "uuid" })
  id!: string;

  @Column({ type: "float8", nullable: false })
  valor!: number;

  @Column({ type: "int4", nullable: false })
  tipo!: number;

  @Column({ name: "criadoem", type: "timestamp", nullable: false })
  criadoEm!: Date;

  @Column({ name: "id_usuario", type: "uuid", nullable: false })
  idUsuario!: string;

  @ManyToOne(() => UsuarioEntity, (usuario) => usuario.transacoes)
  @JoinColumn({
    name: "id_usuario",
    foreignKeyConstraintName: "transacoes_id_usuario_fkey",
    referencedColumnName: "id",
  })
  usuario!: UsuarioEntity;

  @BeforeInsert()
  beforeInsert() {
    this.id = randomUUID();
  }
}
