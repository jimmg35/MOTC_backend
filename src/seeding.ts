

import { autoInjectable } from "tsyringe"
import { WebApiContext } from "./dbcontext"
import { Role } from "./entity/authentication/Role"

@autoInjectable()
export class Seeder {

  public dbcontext: WebApiContext

  constructor(dbcontext: WebApiContext) {
    this.dbcontext = dbcontext
  }

  public seedRole = async () => {

    const role_repository = this.dbcontext.connection.getRepository(Role)
    await role_repository.query("ALTER SEQUENCE role_id_seq RESTART WITH 1;")
    await role_repository.query("TRUNCATE TABLE role CASCADE;")
    await role_repository.insert([
      { roleName: "user" },
      { roleName: "admin" }
    ])
  }

}
