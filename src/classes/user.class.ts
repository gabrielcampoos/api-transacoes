import { v4 as gerarId } from "uuid";

class User {
  id: string;
  name: string;
  cpf: string;
  email: string;
  age: number;
  transactions?: Array<any>;

  constructor(
    nameUser: string,
    cpfUser: string,
    emailUser: string,
    ageUser: number
  ) {
    this.id = gerarId();
    this.name = nameUser;
    this.cpf = cpfUser;
    this.email = emailUser;
    this.age = ageUser;
    this.transactions = [];
  }

  mostrarUsuario() {
    return {
      id: this.id,
      name: this.name,
      cpf: this.cpf,
      email: this.email,
      age: this.age,
    };
  }
}

export default User;
