import { Request, Response } from "express";

let users: Array<string> = new Array<string>();

const addUser = (req: Request, resp: Response) => {
  const userName: string = generateName(6);
  users.push(userName);

  resp.status(201).send({ user: userName });
};

const getUsers = (req: Request, resp: Response) => {
  resp.status(200).send({ users: users });
};

function generateName(length: number): string {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export { addUser, getUsers };
