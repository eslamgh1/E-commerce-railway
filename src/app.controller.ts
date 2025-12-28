import { Body, Controller, Get, Next, Param, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import type { Request, Response ,NextFunction } from 'express';

import { S3Service } from './common/service/s3.service'



@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService , 
    private readonly s3Service:S3Service
  ) {}

  @Get()
  getHello(@Body() body: object ,@Param() params: object): string {
    return this.appService.getHello();
  }

  @Get("/upload/*path")
    async GetFile(@Req() req:Request , @Res() res:Response , @Next() next:NextFunction) {
    const { path } = req.params as unknown as { path: string[] };
    // const { downLoadName } = req.query as unknown as { downLoadName: string };
    const Key = path.join('/');
    // console.log(Key)
    const result = await this.s3Service.getFile({path:Key})
    // console.log(result)

    const stream = result.Body as NodeJS.ReadableStream;
    res.set("cross-origin-resource-policy", "cross-origin")
    res.setHeader('Content-Type', result?.ContentType! || "application/octet-stream");

    // if (downLoadName) {
    //   res.setHeader("content-disposition", `attachment; filename="${downLoadName || path.join("/").split("/").pop()}"`);
    // }
    stream.pipe(res)

  }









}
