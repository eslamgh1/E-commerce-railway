
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // console.log('Before / started.........');
    const req = context.switchToHttp().getRequest();
const {method,url} = req;
const now = Date.now();
// console.log(`Request: ${method} ${url} TimeNow: ${now} Before / started......`);


   
    return next
      .handle().pipe(tap(() => {
          const time = Date.now();
          //  console.log(`After/completed...${method} ${url} ${time - now}ms`)
          } ),
      );
  }
}
