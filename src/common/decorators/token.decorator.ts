import { SetMetadata } from "@nestjs/common";
import { TokenTypeEnum } from "../enums";

export const tokenName = "typeToken"

export const Token = (typeToken: TokenTypeEnum =TokenTypeEnum.access  ) => {
    
    return SetMetadata(tokenName, typeToken)
}