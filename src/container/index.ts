import UserRepository from "@/repositories/user-repository";
import Container from "typedi";

export default function initContainer(): void {
  Container.set('UserRepository', Container.get(UserRepository))
}