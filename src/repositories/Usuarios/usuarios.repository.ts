import { pgHelper } from "../../database";
import { UsuarioEntity } from "../../database/entities/usuario.entity";
import { Usuario } from "../../models";
import { Endereco } from "../../models/Endereco";
import { CadastrarLogarUsuarioDTO } from "../../usecases";

export class UsuariosRepository {
  public async verificarSeExisteUsuarioPorEmail(
    email: string
  ): Promise<boolean> {
    const manager = pgHelper.client.manager;

    const usuarioEncontrado = await manager.findOne(UsuarioEntity, {
      where: { email },
      relations: {
        endereco: true,
      },
    });

    return !!usuarioEncontrado;

    // const [usuarioEncontrado] = await pgHelper.client.query('SELECT * FROM usuarios WHERE email = $1', [email]);

    // return !!usuarioEncontrado;
  }

  public async cadastrar(dados: CadastrarLogarUsuarioDTO): Promise<Usuario> {
    const manager = pgHelper.client.manager;

    const { email, senha } = dados;

    const newUser = manager.create(UsuarioEntity, { email, senha });
    const usuarioCriado = await manager.save(newUser);

    return this.entityToModel(usuarioCriado);
    // await pgHelper.client.query(
    //   "INSERT INTO usuarios (email, senha) VALUES ($1, $2)",
    //   [email, senha]
    // );

    // const [ultimoInserido] = await pgHelper.client.query(
    //   "SELECT * from usuarios ORDER BY criadoEm DESC LIMIT 1"
    // );

    // return this.entityToModel(ultimoInserido);
  }

  public async autenticacaoLogin(
    dados: CadastrarLogarUsuarioDTO
  ): Promise<Usuario | undefined> {
    const manager = pgHelper.client.manager;

    const { email, senha } = dados;

    const usuarioEncontrado = await manager.findOne(UsuarioEntity, {
      where: { email, senha },
      relations: {
        endereco: true,
      },
    });

    if (!usuarioEncontrado) return undefined;

    return this.entityToModel(usuarioEncontrado);
    // const [usuarioEncontrado] = await pgHelper.client.query(
    //   "SELECT * FROM usuarios WHERE email = $1 AND senha = $2",
    //   [email, senha]
    // );

    // if (!usuarioEncontrado) return undefined;

    // return this.entityToModel(usuarioEncontrado);
  }

  public async buscaUsuarioPorID(
    idUsuario: string
  ): Promise<Usuario | undefined> {
    const manager = pgHelper.client.manager;

    const usuarioEncontrado = await manager.findOne(UsuarioEntity, {
      where: {
        id: idUsuario,
      },
      relations: {
        endereco: true,
      },
    });

    if (!usuarioEncontrado) return undefined;

    return this.entityToModel(usuarioEncontrado);
  }

  // TRANSFORMA RESULTADO DA BUSCA EM UMA INSTANCIA DA MODEL
  private entityToModel(dadosDB: UsuarioEntity): Usuario {
    const { endereco } = dadosDB;

    if (endereco) {
      const enderecoModel = new Endereco(
        endereco.id,
        endereco.logradouro,
        endereco.cidade,
        endereco.uf,
        endereco.criadoEm,
        endereco.numero
      );
      return new Usuario(
        dadosDB.id,
        dadosDB.email,
        dadosDB.senha,
        enderecoModel
      );
    }

    return new Usuario(dadosDB.id, dadosDB.email, dadosDB.senha);
  }
}
