import { hash, compare } from "bcrypt";
//The hash and compare functions from the bcrypt package in Node.js are asynchronous by default

export const Hash =  async ({plainText, saltRounds=Number(process.env.SALT_ROUNDS)}) => {
  return  await hash(plainText, saltRounds)

};
export const Compare =  async ({plainText, cipherText}) => {
  return  await compare(plainText, cipherText)

};