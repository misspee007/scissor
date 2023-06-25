import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptPasswordMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    if (req.body && req.body.password) {
      const hash = await bcrypt.hash(req.body.password, 10);
      req.body.password = hash;
    }
    next();
  }
}
