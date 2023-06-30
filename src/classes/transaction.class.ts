import { v4 as gerarId } from "uuid";

class Transaction {
  id: string;
  title: string;
  value: number;
  type: "income" | "outcome" | undefined;

  constructor(
    titleTransaction: string,
    valueTransaction: number,
    typeTransaction: "income" | "outcome" | undefined
  ) {
    this.id = gerarId();
    this.title = titleTransaction;
    this.value = valueTransaction;
    this.type = typeTransaction;
  }
}

export default Transaction;
