import { SetMetadata } from "@nestjs/common";
import { userRole } from "../enums";

export const roleName = "access_roles"
export const Role = (access_roles: userRole[] ) => {
    
    return SetMetadata(roleName, access_roles)
}