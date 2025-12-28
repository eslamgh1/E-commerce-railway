
import { applyDecorators } from '@nestjs/common';
import { Role } from './role.decorators';
import { Token } from './token.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthunticationGuard } from 'src/common/guards';
import { AuthorizationGuard } from 'src/common/guards/authorization.gurds';
import { TokenTypeEnum, userRole } from 'src/common';
    
export function Auth({typeToken = TokenTypeEnum.access , role = [userRole.USER]}: {typeToken?: TokenTypeEnum , role?: userRole[]} ={}) {
  return applyDecorators(    
    Token(typeToken) ,
    Role(role),
    UseGuards(AuthunticationGuard,AuthorizationGuard)

  );
}
